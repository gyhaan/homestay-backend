const Booking = require("../models/bookingModel");
const Listing = require("../models/listingModel");
const catchAsyncFunction = require("../utils/catchAsyncFunction");

exports.createBooking = catchAsyncFunction(async (req, res, next) => {
  const booking = await Booking.create({
    listing: req.body.listing,
    user: req.body.user || req.user._id,
    guide: req.body.guide,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  const listing = await Listing.findById(req.body.listing);

  listing.unavailableDates.push({
    start: booking.startDate,
    end: booking.endDate,
  });

  await listing.save();

  res.status(200).json({
    status: "success",
    data: {
      booking,
    },
  });
});

exports.deleteBooking = catchAsyncFunction(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return next(new AppError("No document with that ID was found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
