const express = require('express');
const userController = require('../controllers/userController')
const router = express.Router();

// User Routes
router.post("/register", userController.registerUser);
router.post("/verify-otp", userController.verifyOTP);
router.post('/login', userController.loginUser);
router.post('/forget-password', userController.forgetPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;