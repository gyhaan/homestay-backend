const Listing = require("../models/listingModel");

const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const catchAsyncFunction = require("../utils/catchAsyncFunction");

exports.getAllListings = catchAsyncFunction(async (req, res) => {
  console.log(req.user);
  const features = new APIFeatures(Listing, req.query).filter().sort().select();
  // .paginate();

  const listings = await features.query;

  res.status(200).json({
    status: "success",
    results: listings.length,
    data: {
      listings,
    },
  });
});

exports.createListing = catchAsyncFunction(async (req, res) => {
  const newListing = await Listing.create(req.body);
  // const newListing = await Listing.create({
  //   price: req.body.price,
  //   duration: req.body.duration,
  //   country: req.body.country,
  //   maxGuests: req.body.maxGuests,
  // });

  res.status(201).json({
    status: "success",
    data: {
      newListing,
    },
  });
});

exports.getListing = catchAsyncFunction(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new AppError("No listing with that ID was found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      listing,
    },
  });
});

exports.updateListing = catchAsyncFunction(async (req, res, next) => {
  const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!listing) {
    return next(new AppError("No document with that ID was found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      listing,
    },
  });
});

exports.deleteListing = catchAsyncFunction(async (req, res, next) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);

  if (!listing) {
    return next(new AppError("No document with that ID was found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
