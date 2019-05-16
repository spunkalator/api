
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.API_KEY,
api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
cloudinary: cloudinary,
folder: "images",
allowedFormats: ["jpg", "png"],
transformation: [{ width: 500, height: 500, crop: "limit" }],
filename: function (req, file, cb) {
    cb(undefined);
  },
});

const parser = multer({ storage: storage });


router.post('/uploadImage', parser.single("image"), controller.uploadImages)
module.exports = router;