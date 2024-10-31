const express = require('express');
const router = express.Router();
const postbookmarkController = require('../controllers/postBookmarkController');
const authMiddleware = require('../middlewares/authMiddleware')

// Route to add a comment to a post
router.post('/add-post', authMiddleware, postbookmarkController.addToPostBookmark);

// Route to update a comment
router.get('/get-post-bookmarks', authMiddleware, postbookmarkController.getPostBookmarks);

// Route to delete a comment
router.delete('/:id/remove-post', authMiddleware, postbookmarkController.removeFromPostBookmark);

module.exports = router;
