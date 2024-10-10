const mongoose = require("mongoose");

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
    booked: {
      type: Boolean,
      required: true,
      default: false,
      validate: {
        validator: function (value) {
          return typeof value === "boolean"; // Ensures it's a boolean
        },
        message: "Booked must be a boolean",
      },
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

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
