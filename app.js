const express = require("express");
const Listing = require("./models/listingModel");
const listingRouter = require("./routes/listingRoute");
const AppError = require("./utils/AppError");
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/v1/listings", listingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`This route ${req.originalUrl} does not exist`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
});

module.exports = app;
