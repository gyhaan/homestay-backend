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
    required: [true, "Booking must belong to a Tour!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endAt: {
    type: Date,
    validate: {
      validator: function (value) {
        return value > this.createdAt;
      },
      message: "The End Date of the tour must be greater than the start!!",
    },
  },
});

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
