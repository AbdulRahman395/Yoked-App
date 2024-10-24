const express = require('express');
const storyController = require('../controllers/storyController');
const router = express.Router();
const upload = require('../config/multerConfig');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/addStory', authMiddleware, upload.single('media'), storyController.addStory);
router.get('/getmyStories', authMiddleware, storyController.getMyStories);
router.get('/getUserStories/:userId', storyController.getUserStories);
router.get('/get-following-stories', storyController.getAllStories);
router.delete('/delete/:storyId', storyController.deleteStory);

module.exports = router;