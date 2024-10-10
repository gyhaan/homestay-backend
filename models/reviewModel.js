const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  listing: {
    type: mongoose.Schema.ObjectId,
    ref: "listing",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "listing",
    select: "price",
  }).populate({
    path: "user",
    select: "name",
  });

  next();
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
