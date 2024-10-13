// review, rating, createdAt, ref to tour, ref to user
const mongoose = require("mongoose");
const Listing = require("./listingModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty."],
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Can't be less than 1"],
      max: [5, "Can't exceed 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    listing: {
      type: mongoose.Schema.ObjectId,
      ref: "listing",
      required: [true, "Listing is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select:
      "-__v -passwordChangedAt -passwordResetToken -passwordResetExpires -role",
  });
  // this.populate({
  //   path: "tour",
  //   select: "-__v",
  // }).populate({
  //   path: "user",
  //   select: "-__v -passwordChangedAt",
  // });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (listingId) {
  const stats = await this.aggregate([
    {
      $match: { listing: listingId },
    },
    {
      $group: {
        _id: "$listing",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Listing.findByIdAndUpdate(listingId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Listing.findByIdAndUpdate(listingId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

// reviewSchema.post("save", function () {
//   this.constructor.calcAverageRatings(this.tour);
// });

// Pre hook for findOneAnd* queries
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // 'this' refers to the query object. Use findOne() to get the document before it is modified.
  this.r = await this.model.findOne(this.getFilter());
  next();
});

// Post hook for findOneAnd* queries
reviewSchema.post(/^findOneAnd/, async function () {
  // 'this.r' is the document before it was modified.
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.listing);
  }
});

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.listing);
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
