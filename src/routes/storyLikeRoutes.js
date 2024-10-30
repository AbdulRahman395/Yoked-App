// routes/likeRoutes.js
const express = require('express');
const storyLikeController = require('../controllers/storyLikeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to like a story
router.post('/:storyId/like', authMiddleware, storyLikeController.likeStory);

// Route to unlike a story
// router.delete('/story/:storyId/unlike', authenticateUser, unlikeStory);

// // Route to get likes for a story
// router.get('/story/:storyId/likes', authenticateUser, getStoryLikes);

module.exports = router;
