const express = require('express');
const AthleteProfileController = require('../controllers/athleteController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const upload = require('../config/multerConfig');

// Athlete Routes
router.post("/register", authMiddleware, upload.single('profileImage'), AthleteProfileController.createProfile);
router.get('/athlete-profile/:userId', AthleteProfileController.getAthleteProfile);
router.get('/my-athlete-profile', authMiddleware, AthleteProfileController.getMyAthleteProfile);
router.delete('/delete-profile', AthleteProfileController.deleteAthleteProfile);
router.put('/update-profile', upload.single('profileImage'), AthleteProfileController.updateProfile);

module.exports = router;