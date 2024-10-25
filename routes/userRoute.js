const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

//auth
router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch(
  "/updatePassword",
  authController.protectRoute,
  authController.updatePassword
);
router.patch("/resetPassword/:resetToken", authController.resetPassword);

//user
router.route("/").get(userController.getAllUsers);
router
  .route("/getBookings")
  .get(
    authController.protectRoute,
    authController.restrictTo("user"),
    userController.getMyBookings
  );

router
  .route("/getGuideBookings")
  .get(
    authController.protectRoute,
    authController.restrictTo("guide"),
    userController.getGuidesBookings
  );

router
  .route("/getMyListings")
  .get(
    authController.protectRoute,
    authController.restrictTo("guide"),
    userController.getMyListings
  );

router
  .route("/getGuideBookings")
  .get(authController.protectRoute, userController.getMe);
router.route("/getMe").get(authController.protectRoute, userController.getMe);

router.route("/:id").get(userController.getUserById);
router
  .route("/updateUser")
  .patch(authController.protectRoute, userController.updateUser);

module.exports = router;
