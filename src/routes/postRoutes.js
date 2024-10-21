const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

router.post('/create', authMiddleware, upload.single('image'), postController.createPost);
router.get('/get-my-posts', authMiddleware, postController.getMyPosts);
router.get('/get-single-post/:id', postController.getSinglePost);
router.get('/user/:userId', postController.getAllPosts);
router.put('/update-post/:id', upload.single('image'), postController.updatePost);
router.delete('/delete-post/:id', postController.deletePost);

module.exports = router;
