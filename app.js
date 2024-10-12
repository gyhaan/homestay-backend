const express = require("express");

const listingRouter = require("./routes/listingRoute");
const userRouter = require("./routes/userRoute");
const reviewRouter = require("./routes/reviewRoute");
const eventRouter = require("./routes/eventRoute");
const bookingRouter = require("./routes/bookingRoute");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`This route ${req.originalUrl} does not exist`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
