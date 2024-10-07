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
router.route("/:id").get(userController.getUserById);

module.exports = router;
