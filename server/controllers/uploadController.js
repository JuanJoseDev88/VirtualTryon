const multer = require('multer');
const cloudinaryService = require('../services/cloudinaryService');
const axios = require('axios');
const config = require('../config/config');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

exports.uploadClothes = [upload.single('clothesPhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const result = await cloudinaryService.uploadImage(req.file.buffer);
    const imageUrl = result.secure_url;

    // Send imageUrl to another endpoint
    if (config.targetEndpoint) {
      try {
        await axios.post(config.targetEndpoint, { imageUrl });
        console.log('Image URL sent to target endpoint.');
      } catch (targetError) {
        console.error('Error sending image URL to target endpoint:', targetError.message);
        // Decide how to handle this error: return 500 or continue
      }
    }

    console.log('Uploaded to Cloudinary:', imageUrl);

    res.status(200).json({ message: 'File uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
}];
