const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Google OAuth login and callback routes
router.get('/google', authController.loginWithGoogle);
router.get('/google/callback', authController.googleCallback);

// Profile route (protected)
router.get('/profile', authMiddleware, authController.getProfile);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
