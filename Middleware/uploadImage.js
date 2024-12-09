const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const upload = multer({ storage });

// upload image to cloudinary
const uploadImageToCloudinary = async (req, res, next) => {
    try {

        const images = [];
        for (const file of req.files) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "upload" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });

            images.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }

        req.images = images;
        next();
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ message: "Error uploading image", error: error.message });
    }
};



module.exports = {
    upload,
    uploadImageToCloudinary
};
