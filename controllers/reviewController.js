const Review = require("../models/reviewModel");
const catchAsyncFunction = require("../utils/catchAsyncFunction");

exports.getAllReviews = catchAsyncFunction(async (req, res) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    data: reviews,
  });
});

exports.createReview = catchAsyncFunction(async (req, res) => {
  const review = await Review.create({ ...req.body, user: req.user._id });

  res.status(200).json({
    status: "success",
    data: review,
  });
});
