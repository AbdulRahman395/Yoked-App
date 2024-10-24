const express = require('express');
const storyController = require('../controllers/storyController');
const router = express.Router();
const upload = require('../config/multerConfig');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/addStory', authMiddleware, upload.single('media'), storyController.addStory);
router.get('/getmyStories', authMiddleware, storyController.getMyStories);

module.exports = router;