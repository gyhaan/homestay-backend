const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const listingRouter = require("./routes/listingRoute");
const userRouter = require("./routes/userRoute");
const reviewRouter = require("./routes/reviewRoute");
const eventRouter = require("./routes/eventRoute");
const bookingRouter = require("./routes/bookingRoute");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//cors issue
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://homestay-frontend-ten.vercel.app", // Production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, origin); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the origin
      }
    },
    credentials: true, // Allow cookies and credentials
  })
);

// middleware
app.use(express.json());
app.use(cookieParser());

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
