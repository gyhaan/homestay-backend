const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsyncFunction = require("../utils/catchAsyncFunction");

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
    next(new AppError("You are not logged in", 401));
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

  const currentUser = await User.findById(decodedData.id);
  console.log(currentUser);

  next();
});
