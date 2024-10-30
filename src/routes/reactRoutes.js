const express = require('express');
const router = express.Router();
const reactController = require('../controllers/reactController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to add a reaction
router.post('/posts/:postId/reaction', authMiddleware, reactController.addReaction);

// Route to update a reaction
router.put('/posts/:postId/reaction', authMiddleware, reactController.updateReaction);

// Route to remove a reaction
router.delete('/posts/:postId/reaction', authMiddleware, reactController.removeReaction);

module.exports = router;
