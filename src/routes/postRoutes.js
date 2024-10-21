const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

router.post('/create', authMiddleware, upload.single('image'), postController.createPost);
router.get('/get-my-posts', authMiddleware, postController.getMyPosts);
router.get('/get-single-post/:id', postController.getSinglePost);
router.get('/get-all-posts', postController.getAllPosts);
router.get('/user/:userId', postController.getAllUserPosts);
router.put('/update-post/:id', upload.single('image'), postController.updatePost);
router.delete('/delete-post/:id', postController.deletePost);

module.exports = router;
