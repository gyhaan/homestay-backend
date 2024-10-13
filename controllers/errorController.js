const AppError = require("../utils/AppError");

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};

const sendErrorProd = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong, reload and try again!",
    });
  }
};

const handleValidationError = (err) => {
  const errorKeys = Object.values(err.errors).map((el) => el.message);
  const message = errorKeys.join(". ");

  return new AppError(message, 400);
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
  const [value] = Object.entries(err.keyValue);
  const message = `The ${value[0]} ${value[1]} is already in use.`;

  return new AppError(message, 400);
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(res, err);
  } else {
    // do it like this because the message and statusCode are not enumerable
    let error = { ...err, message: err.message, statusCode: err.statusCode };

    if (err.name === "ValidationError") {
      error = handleValidationError(err);
    }
    if (err.name === "CastError") {
      error = handleCastError(err);
    }

    if (err.code === 11000) {
      error = handleDuplicateError(err);
    }

    sendErrorProd(res, error);
  }
};

module.exports = globalErrorHandler;
