const express = require("express");
const Listing = require("./models/listingModel");
const listingRouter = require("./routes/listingRoute");
const userRouter = require("./routes/userRoute");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`This route ${req.originalUrl} does not exist`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
