const Booking = require("../models/bookingModel");
const Listing = require("../models/listingModel");
const User = require("../models/userModel");
const catchAsyncFunction = require("../utils/catchAsyncFunction");

exports.getAllUsers = catchAsyncFunction(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getUserById = catchAsyncFunction(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// exports.createUser = catchAsyncFunction(async (req, res) => {
//   const user = await User.create({
//     name: req.body.name,
//     email: req.body.email,
//     role: req.body.role,
//     password: req.body.password,
//     passwordConfirm: req.body.passwordConfirm,
//   });

//   res.status(201).json({
//     status: "success",
//     data: {
//       user,
//     },
//   });
// });

exports.updateUser = catchAsyncFunction(async (req, res) => {
  const filterObj = { ...req.body };

  function filterProperties(...values) {
    const filterObjKeys = Object.keys(filterObj);

    filterObjKeys.forEach((el) => {
      if (!values.includes(el)) {
        delete filterObj[el];
      }
    });
  }

  filterProperties("name", "email");

  const user = await User.findByIdAndUpdate(req.user._id, filterObj, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsyncFunction(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMyBookings = catchAsyncFunction(async (req, res, next) => {
  const listings = await Booking.find({ user: req.user._id }).populate(
    "listing"
  );

  // const listingIds = bookings.map((el) => el.listing);
  // const listings = await Listing.find({ _id: { $in: listingIds } });

  res.status(200).json({
    status: "success",
    data: {
      listings,
    },
  });
});

exports.getMyListings = catchAsyncFunction(async (req, res, next) => {
  const listings = await Listing.find({ user: req.user._id });

  res.status(200).json({
    status: "success",
    data: {
      listings,
    },
  });
});

exports.getGuidesBookings = catchAsyncFunction(async (req, res, next) => {
  const listings = await Booking.find({ guide: req.body.id }).populate(
    "listing"
  );

  res.status(200).json({
    status: "success",
    data: {
      listings,
    },
  });
});

exports.getMe = catchAsyncFunction(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
