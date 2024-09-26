const mongoose = require("mongoose");
const Listing = require("../models/listingModel");

exports.getAllListings = async (req, res) => {
  try {
    //FILTERING
    let queryObj = { ...req.query };
    const excludedObj = ["fields", "limit", "sort", "page"];
    excludedObj.forEach((el) => delete queryObj[el]);
    const queryStr = JSON.stringify(queryObj).replace(
      /(gte|lte|lt|gt)/,
      (match) => `$${match}`
    );
    queryObj = JSON.parse(queryStr);
    let listings = Listing.find(queryObj);

    //SORTING
    console.log(req.query.sort);
    if (req.query.sort) {
      const sortQuery = req.query.sort.split(",").join(" ");
      listings = listings.sort(sortQuery);
    }

    listings = await listings;
    res.status(200).json({
      status: "success",
      results: listings.length,
      data: {
        listings,
      },
    });
  } catch (err) {
    console.log("Something went wrong");
    res.status(404).json({
      status: "fail",
      message: "Bloodclat",
    });
  }
};
