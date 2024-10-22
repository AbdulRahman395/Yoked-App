const express = require('express');
const AthleteProfileController = require('../controllers/athleteController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// User Routes
router.post("/register", authMiddleware, AthleteProfileController.createOrUpdateProfile);
router.get('/athlete-profile/:userId', AthleteProfileController.getAthleteProfile);
// router.post('/forget-password', AthleteProfileController.forgetPassword);
// router.post('/reset-password', AthleteProfileController.resetPassword);

module.exports = router;