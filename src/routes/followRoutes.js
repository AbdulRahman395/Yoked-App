const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const followController = require('../controllers/followController')

const router = express.Router();

// Follow Routes
router.post('/follow', authMiddleware, followController.followUser);
router.post('/unfollow', authMiddleware, followController.unfollowUser);
router.get('/myfollowers', authMiddleware, followController.getMyFollowers);
router.get('/myfollowings', authMiddleware, followController.getFollowing);
router.get('/followers/:userId', followController.getFollowers);
router.get('/followings/:userId', followController.getFollowing);

module.exports = router;