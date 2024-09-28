const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingControllers");

router
  .route("/")
  .get(listingController.getAllListings)
  .post(listingController.createListing);

router
  .route("/:id")
  .get(listingController.getListing)
  .patch(listingController.updateListing)
  .delete(listingController.deleteListing);

module.exports = router;
