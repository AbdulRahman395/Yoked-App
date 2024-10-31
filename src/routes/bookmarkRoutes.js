const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/reelBookmarkController');
const authMiddleware = require('../middlewares/authMiddleware')

// Route to add a comment to a post
router.post('/add', authMiddleware, bookmarkController.addToReelBookmark);

// Route to update a comment
router.get('/get-bookmarks', authMiddleware, bookmarkController.getReelBookmarks);

// Route to delete a comment
router.delete('/:id/remove', authMiddleware, bookmarkController.removeFromReelBookmark);

module.exports = router;
