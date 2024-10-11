const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Event name is required."],
  },
  link: {
    type: String,
    required: [true, "Event link is required."],
  },
  image: {
    type: String,
    required: [true, "Event image URL is required."],
  },
  date: {
    type: Date,
    required: [true, "Event date is required."],
  },
  price: {
    type: String,
    required: [true, "Event price is required."],
  },
  location: {
    type: String,
    required: [true, "Event location is required."],
  },
});

const Event = mongoose.model("event", eventSchema);

module.exports = Event;
