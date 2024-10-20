const multer = require("multer");
const sharp = require("sharp");
const streamifier = require("streamifier");

const Listing = require("../models/listingModel");

const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const catchAsyncFunction = require("../utils/catchAsyncFunction");

const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images", 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadListingImages = upload.array("images", 3);

exports.resizePhotos = async (req, res, next) => {
  req.body.images = [];
  if (!req.files.length) {
    return next();
  }

  await Promise.all(
    req.files.map(async (el) => {
      // Sanitize the filename by replacing spaces and special characters
      const sanitizedFilename = el.originalname
        .replace(/[^a-zA-Z0-9-_]/g, "_") // Replace any character that is not alphanumeric, dash, or underscore
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .concat(`-${Date.now()}`);

      // Resize the image using Sharp
      const buffer = await sharp(el.buffer)
        .resize(350, 350, {
          fit: "cover",
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
          nearLossless: true,
        })
        .toBuffer();

      // Upload to Cloudinary
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "listings",
            public_id: sanitizedFilename,
            format: "webp",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(new AppError("Failed to upload image", 500));
            } else {
              // Add the uploaded image URL to req.body.images
              req.body.images.push(result.secure_url);
              resolve();
            }
          }
        );

        // Stream the buffer to Cloudinary
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    })
  );

  next();
};

exports.getAllListings = catchAsyncFunction(async (req, res) => {
  const features = new APIFeatures(Listing, req.query).filter().sort().select();
  // .paginate();

  const listings = await features.query;

  res.status(200).json({
    status: "success",
    results: listings.length,
    data: {
      listings,
    },
  });
});

exports.createListing = catchAsyncFunction(async (req, res) => {
  // const newListing = await Listing.create(req.body);
  const newListing = await Listing.create({
    price: req.body.price,
    duration: req.body.duration,
    country: req.body.country,
    maxGuests: req.body.maxGuests,
    images: req.body.images,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      newListing,
    },
  });
});

exports.getListing = catchAsyncFunction(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");

  if (!listing) {
    return next(new AppError("No listing with that ID was found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      listing,
    },
  });
});

exports.updateListing = catchAsyncFunction(async (req, res, next) => {
  const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!listing) {
    return next(new AppError("No document with that ID was found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      listing,
    },
  });
});

exports.deleteListing = catchAsyncFunction(async (req, res, next) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);

  if (!listing) {
    return next(new AppError("No document with that ID was found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
