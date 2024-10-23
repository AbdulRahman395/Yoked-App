const express = require('express');
const userController = require('../controllers/userController')
const router = express.Router();

// User Routes
router.post("/register", userController.registerUser);
router.post("/verify-otp", userController.verifyOTP);
router.post('/login', userController.loginUser);
router.post('/change-password', userController.changePassword);
router.post('/forget-password', userController.forgetPassword);
router.post('/reset-password', userController.resetPassword);
router.put('/update-athlete-status', userController.updateAthleteStatus);
router.get('/get-profile/:userId', userController.getUserById);
router.get('/get-my-profile', userController.getMyProfile);

module.exports = router;