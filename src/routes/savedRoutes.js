const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');
const authMiddleware = require('../middlewares/authMiddleware')

// Route to add a comment to a post
router.post('/add', authMiddleware, savedController.addToSaved);

// Route to update a comment
router.get('/get-saved', authMiddleware, savedController.getSaved);

// Route to delete a comment
router.delete('/:id/remove', authMiddleware, savedController.removeFromSaved);

module.exports = router;
