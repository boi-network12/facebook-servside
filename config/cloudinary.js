const { v2 } = require("cloudinary");

v2.config({
    cloud_name: "dypgxulgp",
    api_key: "942926628544572",
    api_secret: "jLLbxTIwtXMfjb9HXMKSGBXXqTA",
});

module.exports = { cloudinary: v2 }