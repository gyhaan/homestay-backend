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

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(res, err);
  } else {
    let error = { ...err };
    if (err.name === "ValidationError") {
      error = handleValidationError(err);
    }
    if (err.name === "CastError") {
      error = handleCastError(err);
    }
    sendErrorProd(res, error);
  }
};

module.exports = globalErrorHandler;
