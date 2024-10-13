const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listingControllers");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(listingController.getAllListings)
  .post(
    authController.protectRoute,
    authController.restrictTo("guide"),
    listingController.uploadListingImages,
    listingController.resizePhotos,
    listingController.createListing
  );

router
  .route("/:id")
  .get(listingController.getListing)
  .patch(
    authController.protectRoute,
    authController.restrictTo("guide"),
    listingController.updateListing
  )
  .delete(
    authController.protectRoute,
    authController.restrictTo("guide"),
    listingController.deleteListing
  );

module.exports = router;
