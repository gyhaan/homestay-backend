const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUserById);

module.exports = router;
