// routes/likeRoutes.js
const express = require('express');
const storyLikeController = require('../controllers/storyLikeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to like a story
router.post('/:storyId/like', authMiddleware, storyLikeController.likeStory);

// Route to unlike a story
router.delete('/:storyId/unlike', authMiddleware, storyLikeController.unlikeStory);

// // Route to get likes for a story
router.get('/:storyId/likes', authMiddleware, storyLikeController.getStoryLikes);

module.exports = router;
