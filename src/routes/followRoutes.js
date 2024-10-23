const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const followController = require('../controllers/followController')

const router = express.Router();

// Follow Routes
router.post('/follow', authMiddleware, followController.followUser);
router.post('/unfollow', authMiddleware, followController.unfollowUser);
router.get('/myfollowers', authMiddleware, followController.getMyFollowers);

module.exports = router;