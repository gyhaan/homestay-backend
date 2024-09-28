const mongoose = require("mongoose");
const Listing = require("../models/listingModel");
const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");

exports.getAllListings = async (req, res) => {
  try {
    const features = new APIFeatures(Listing, req.query)
      .filter()
      .sort()
      .select();
    // .paginate();

    const listings = await features.query;

    res.status(200).json({
      status: "success",
      results: listings.length,
      data: {
        listings,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: "Bloodclat",
      error: err.message,
    });
  }
};

exports.createListing = async (req, res, next) => {
  try {
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
  } catch (err) {
    // console.log(err);
    // res.status(404).json({
    //   status: "fail",
    //   message: "Bloodclat",
    //   error: err,
    // });
    err.status = "fail";
    err.statusCode = 400;
    next(err);
  }
};

exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        listing,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: "Bloodclat",
      error: err,
    });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        listing,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: "Something went wrong",
      error: err,
    });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: {
        listing,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: "Something went wrong",
      error: err,
    });
  }
};
