const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.ObjectId,
    ref: "listing",
    required: [true, "Booking must belong to a Tour!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "Booking must have a tourist"],
  },
  guide: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "Booking must have a guide"],
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true,
    validate: {
      validator: function (value) {
        return value >= Date.now() - 10000; // Validate that startDate is in the future
      },
      message: "The Start Date must be in the present or future!", // Updated error message
    },
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: "The End Date of the tour must be greater than the start!!",
    },
  },
});

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
