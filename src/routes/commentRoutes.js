const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware')

// Route to add a comment to a post
router.post('/:postId/add-comment', authMiddleware, commentController.addComment);

// Route to update a comment
router.put('/:commentId/update-comment', authMiddleware, commentController.updateComment);

// Route to delete a comment
router.delete('/:commentId/delete', authMiddleware, commentController.deleteComment);

// Route to get all comments for a post
router.get('/:postId/get-comments', authMiddleware, commentController.getTopCommentsByPost);

// Route to get all comments for a post
router.get('/:commentId/get-child-comments', authMiddleware, commentController.getChildComments);

module.exports = router;
