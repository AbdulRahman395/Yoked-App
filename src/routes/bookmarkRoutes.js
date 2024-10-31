const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const authMiddleware = require('../middlewares/authMiddleware')

// Route to add a comment to a post
router.post('/add', authMiddleware, bookmarkController.addToBookmark);

// Route to update a comment
router.get('/get-saved', authMiddleware, bookmarkController.getBookmarks);

// Route to delete a comment
router.delete('/:id/remove', authMiddleware, bookmarkController.removeFromBookmark);

module.exports = router;
