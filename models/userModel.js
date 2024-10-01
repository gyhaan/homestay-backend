const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Every user needs a name"],
    minLength: [8, "You need atleast 8 characters"],
    maxLength: [20, "You can't exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Every user needs an email"],
    validate: {
      validator: function (value) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: "Please provide a valid email",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "guide"],
      message: "Role can only be user or guide",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "You need atleast 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirm is required"],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "The password doesn't match",
    },
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
