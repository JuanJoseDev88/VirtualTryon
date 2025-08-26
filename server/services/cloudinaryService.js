const cloudinary = require('cloudinary').v2;
const config = require('../config/config');

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret
});

exports.uploadImage = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    ).end(imageBuffer);
  });
};
