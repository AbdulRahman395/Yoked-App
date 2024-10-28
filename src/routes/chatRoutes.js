const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware')

// Route to load the dashboard (make sure the user is logged in)
user_route.get('/dashboard', authMiddleware, chatController.loadDashboard);

// Route to save a new chat message
user_route.post('/save-chat', authMiddleware, chatController.saveChat);

// Route to delete a chat message
user_route.post('/delete-chat', authMiddleware, chatController.deleteChat);

// Route to update a chat message
user_route.post('/update-chat', authMiddleware, chatController.updateChat);

module.exports = router;