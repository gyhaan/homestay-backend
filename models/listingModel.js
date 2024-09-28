const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  country: { type: String, required: true },
  maxGuests: { type: Number, required: true },
  booked: { type: Boolean, required: true, default: false },
});

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
