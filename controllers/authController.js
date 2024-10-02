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
