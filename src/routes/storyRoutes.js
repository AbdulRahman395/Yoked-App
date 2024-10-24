const express = require('express');
const storyController = require('../controllers/storyController');
const router = express.Router();
const upload = require('../config/multerConfig');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/addStory', authMiddleware, upload.single('media'), storyController.addStory);

module.exports = router;