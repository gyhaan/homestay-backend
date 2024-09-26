const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  price: Number,
  duration: Number,
  country: String,
  maxGuests: Number,
  booked: Boolean,
});

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
