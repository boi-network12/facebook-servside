const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: 'dypgxulgp',  // Replace with your cloud name
    api_key: '942926628544572',        // Replace with your API key
    api_secret: 'jLLbxTIwtXMfjb9HXMKSGBXXqTA',  // Replace with your API secret
});

module.exports = cloudinary;
