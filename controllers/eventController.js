const Event = require("../models/eventModel");

const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const catchAsyncFunction = require("../utils/catchAsyncFunction");

exports.getAllEvents = catchAsyncFunction(async (req, res, next) => {
  const features = new APIFeatures(Event, req.query).filter().sort().select();
  // .paginate();

  const events = await features.query;

  res.status(200).json({
    status: "success",
    results: events.length,
    data: {
      events,
    },
  });
});

exports.createEvent = catchAsyncFunction(async (req, res, next) => {
  // Destructure the required fields from the request body
  const { name, link, image, date, price, location } = req.body;

  // Create the event using the Event model
  const newEvent = await Event.create(req.body);

  // Send the created event back in the response
  res.status(201).json({
    status: "success",
    data: {
      event: newEvent,
    },
  });
});
