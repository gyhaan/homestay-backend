const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsyncFunction = require("../utils/catchAsyncFunction");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

function signToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  return token;
}

async function verifyToken(req, token) {
  jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) {
      next(err);
    } else {
      req.user = await User.findById(decoded.id);
    }
  });
}

exports.signUp = catchAsyncFunction(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  let token;

  try {
    token = signToken({ id: user._id, email: user.email });
  } catch (err) {
    next(err);
  }

  res.status(201).json({
    status: "success",
    token,
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

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protectRoute = catchAsyncFunction(async (req, res, next) => {
  console.log(req.headers);

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new AppError("You are not logged in", 401));
  }

  const token = req.headers.authorization.split(" ")[1];

  const decodedData = jwt.verify(
    token,
    process.env.JWT_SECRET,
    function (err, decode) {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(new AppError("Invalid Token, please log in", 401));
        }
        if (err.name === "TokenExpiredError") {
          return next(new AppError("Token Expired, please log in again", 401));
        }
        if (err.name === "NotBeforeError") {
          return next(
            new AppError("Token not active: Please try again later.", 401)
          );
        }
      }
      return decode;
    }
  );

  // ????? Missing check if password has changed

  const currentUser = await User.findById(decodedData.id);
  console.log(currentUser);

  next();
});

exports.forgotPassword = catchAsyncFunction(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("User doesn't exist", 401));
  }

  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}
  `;

  const message = `If you want to reset the password use this link ${resetURL}, if not don't mind this message`;

  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    text: message,
  });

  res.status(200).json({
    status: "success",
    data: "Reset token sent",
  });
});

exports.resetPassword = catchAsyncFunction(async (req, res, next) => {
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(new AppError("Bad Request", 401));
  }

  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  console.log(user);

  if (!user) {
    return next(new AppError("Reset Token Expired or Invalid", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    data: user,
  });
});
