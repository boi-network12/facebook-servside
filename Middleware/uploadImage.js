const multer = require("multer");
const path = require("path");

// Set storage settings for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads");
        console.log("Saving files to:", uploadPath); // Log upload path
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        console.log("Generated filename:", filename); // Log filename
        cb(null, filename);
    },
});


// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

// Configure multer with the storage and file filter
const upload = multer({ storage, fileFilter });

module.exports = upload;
