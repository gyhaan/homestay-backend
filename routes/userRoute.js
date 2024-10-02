const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.route("/").get(userController.getAllUsers).post(authController.signUp);
router.route("/:id").get(userController.getUserById);

module.exports = router;
