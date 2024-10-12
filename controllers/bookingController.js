const Booking = require("../models/bookingModel");
const catchAsyncFunction = require("../utils/catchAsyncFunction");

exports.createBooking = catchAsyncFunction(async (req, res, next) => {
  const { listing } = req.body;

  const booking = await Booking.create({
    listing,
    user: req.body.user || req.user._id,
  });

  res.status(200).json({
    status: "success",
    data: {
      booking,
    },
  });
});
