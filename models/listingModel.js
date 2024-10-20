const mongoose = require("mongoose");

const DateIntervalSchema = new mongoose.Schema({
  start: {
    type: Date,
    required: [true, "Start date is required"],
  },
  end: {
    type: Date,
    required: [true, "End date is required"],
  },
});

const listingSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: [true, "Price is required"],
      validate: {
        validator: function (value) {
          return typeof value === "number"; // Ensures it's a number
        },
        message: "Price must be a number",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be above 1"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      validate: {
        validator: function (value) {
          return typeof value === "number"; // Ensures it's a number
        },
        message: "Duration must be a number",
      },
    },
    images: {
      type: [String],
      required: [true, "Please upload images of the listing"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      validate: {
        validator: function (value) {
          return typeof value === "string"; // Ensures it's a string
        },
        message: "Country must be a string",
      },
    },
    maxGuests: {
      type: Number,
      required: [true, "Maximum number of guests is required"],
      validate: {
        validator: function (value) {
          return typeof value === "number"; // Ensures it's a number
        },
        message: "Maximum number of guests must be a number",
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    unavailableDates: {
      type: [DateIntervalSchema],
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

listingSchema.virtual("reviews", {
  ref: "review",
  foreignField: "listing",
  localField: "_id",
});

listingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select:
      "-__v -passwordChangedAt -passwordResetToken -passwordResetExpires -role",
  });

  next();
});

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
