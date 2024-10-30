const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsyncFunction = require("../utils/catchAsyncFunction");
const sendEmail = require("../utils/email");

function signToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  return token;
}

exports.signUp = catchAsyncFunction(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken({ id: user._id });

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // httpOnly: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.login = catchAsyncFunction(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password are available
  if (!email || !password) {
    next(new AppError("Please provide both your email and password", 400));
  }

  // 2) check if email has an assigned user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    next(new AppError("Incorrect email or password", 401));
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    next(new AppError("Incorrect email or password", 401));
  }

  // 3) create a token and send it
  const token = signToken({ id: user._id });

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    role: user.role,
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to perform this operation", 403)
      );
    }

    next();
  };
};

exports.protectRoute = catchAsyncFunction(async (req, res, next) => {
  // Check for authorization token
  // if (
  //   !req.headers.authorization ||
  //   !req.headers.authorization.startsWith("Bearer")
  // ) {
  //   return next(new AppError("You are not logged in", 401));
  // }

  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("You are not logged in", 401));
  }

  // Extract token from header
  // const token = req.headers.authorization.split(" ")[1];
  const token = req.cookies.jwt;

  // Verify token and handle possible errors
  const decodedData = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return reject(new AppError("Invalid Token, please log in", 401));
        } else if (err.name === "TokenExpiredError") {
          return reject(new AppError("Token Expired, log in again", 401));
        } else if (err.name === "NotBeforeError") {
          return reject(new AppError("Token not active yet", 401));
        } else {
          return reject(err);
        }
      }
      resolve(decoded);
    });
  });

  // Find user by token ID
  const currentUser = await User.findById(decodedData.id);

  // Check if user still exists
  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  // Check if user changed password after token was issued
  const isPasswordChanged = currentUser.checkPasswordChanged(decodedData.iat);

  // If password changed, prompt for re-login
  if (!isPasswordChanged) {
    return next(new AppError("Password recently changed, log in again", 401));
  }

  // Attach user to request object
  req.user = currentUser;

  next();
});

exports.forgotPassword = catchAsyncFunction(async (req, res, next) => {
  // Find user by email
  const user = await User.findOne({ email: req.body.email });

  // If user doesn't exist, return an error
  if (!user) {
    return next(new AppError("User doesn't exist", 401));
  }

  // Generate password reset token and save it
  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  // Message to send to user's email
  const message = `To reset your password, use this link: ${resetURL}`;

  try {
    // Send reset email
    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      text: message,
    });

    // Respond with success message
    res.status(200).json({
      status: "success",
      data: "Reset token sent",
    });
  } catch (err) {
    // Clear token if email fails to send
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Return error if email couldn't be sent
    return next(new AppError("Error sending email, please try again!", 500));
  }
});

exports.resetPassword = catchAsyncFunction(async (req, res, next) => {
  // Check if password and confirm are provided
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(new AppError("Please provide password and confirm value", 401));
  }

  // Hash the reset token from the URL
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  // Find user by reset token and check if it's not expired
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token is invalid or expired, return error
  if (!user) {
    return next(new AppError("Reset Token Expired or Invalid", 400));
  }

  // Set new password and clear reset token fields
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Save updated user
  await user.save();

  // Respond with success and updated user data
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updatePassword = catchAsyncFunction(async (req, res, next) => {
  const { currentPassword } = req.body;

  // Get the current user and include password field
  const currentUser = await User.findById(req.user._id).select("+password");

  // Check if the current password is correct
  const isPasswordCorrect = await currentUser.comparePassword(currentPassword);

  // If incorrect, return error
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect Password", 400));
  }

  // Update password and confirm values
  currentUser.password = req.body.password;
  currentUser.passwordConfirm = req.body.passwordConfirm;

  // Save updated user
  await currentUser.save();

  // Respond with success and updated user data
  res.status(200).json({
    status: "success",
    data: {
      currentUser,
    },
  });
});
