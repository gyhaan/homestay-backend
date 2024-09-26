const express = require("express");
const Listing = require("./models/listingModel");
const listingRouter = require("./routes/listingRoute");
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/v1/listings", listingRouter);

module.exports = app;
