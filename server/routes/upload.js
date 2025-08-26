const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.post('/clothes', uploadController.uploadClothes);

module.exports = router;
