const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Every user needs a name"],
    minLength: [8, "You need atleast 8 characters"],
    maxLength: [20, "You can't exceed 20 characters"],
  },
  email: {
    type: String,
    unique: [true, "This email is already in use"],
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.findOne({ isActive: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.checkPasswordChanged = function (jwtTimestamp) {
  if (!this.passwordChangedAt) {
    return next();
  }

  const time = this.passwordChangedAt.getTime();
  return jwtTimestamp * 1000 > time;
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
