const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(
    authController.protectRoute,
    authController.restrictTo("user"),
    bookingController.createBooking
  );

router
  .route("/:id")
  .delete(
    authController.protectRoute,
    authController.restrictTo("user"),
    bookingController.deleteBooking
  );

module.exports = router;
