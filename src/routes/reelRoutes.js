const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');
const authMiddleware = require('../middlewares/authMiddleware');
const videoUpload = require('../config/videoConfig');

router.post('/create', authMiddleware, videoUpload.single('video'), reelController.createReel);
router.get('/get-my-reels', authMiddleware, reelController.getMyReels);
router.get('/get-single-reel/:id', reelController.getSingleReel);
router.get('/get-all-reels', reelController.getAllReels);
router.delete('/delete-reel/:id', reelController.deleteReel);

module.exports = router;
