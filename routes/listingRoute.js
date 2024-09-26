const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingControllers");

router.route("/").get(listingController.getAllListings);

module.exports = router;
