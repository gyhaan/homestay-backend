const mongoose = require("mongoose");
const Listing = require("../models/listingModel");
const APIFeatures = require("../utils/APIFeatures");

exports.getAllListings = async (req, res) => {
  try {
    // //FILTERING
    // let queryObj = { ...req.query };
    // const excludedObj = ["fields", "limit", "sort", "page"];
    // excludedObj.forEach((el) => delete queryObj[el]);
    // const queryStr = JSON.stringify(queryObj).replace(
    //   /(gte|lte|lt|gt)/,
    //   (match) => `$${match}`
    // );
    // queryObj = JSON.parse(queryStr);
    // let listings = Listing.find(queryObj);

    // //SORTING

    // if (req.query.sort) {
    //   const sortQuery = req.query.sort.split(",").join(" ");
    //   listings = listings.sort(sortQuery);
    // } else {
    //   listings = listings.sort("-price");
    // }

    // // SELECT FIELDS
    // if (req.query.fields) {
    //   const fieldsQuery = req.query.fields.split(",").join(" ");
    //   listings = listings.select(fieldsQuery);
    // }

    // // LIMITING
    // const pageNumber = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 1;
    // const skip = (pageNumber - 1) * limit;
    // const totalDoc = await Listing.countDocuments();
    // const maxPages = totalDoc / limit;

    // if (pageNumber > maxPages || pageNumber < 0 || limit < 0)
    //   throw new Error("This page does not exist");

    // listings = await listings.skip(skip).limit(limit);

    const features = new APIFeatures(Listing, req.query)
      .filter()
      .sort()
      .select();
    // .paginate();

    const listings = await features.query;
    res.status(200).json({
      status: "success",
      // results: listings.length,
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
