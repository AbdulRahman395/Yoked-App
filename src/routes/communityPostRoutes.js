const express = require('express');
const router = express.Router();
const postController = require('../controllers/communityPostController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

// Route to create a new post
router.post('/create-new', upload.single('image'), authMiddleware, postController.createPost);

// Route to get all posts
router.get('/get-all', authMiddleware, postController.getAllPosts);

// Route to get all posts of authetnticated user
router.get('/get-my-posts', authMiddleware, postController.getMyPosts);

// Route to get a single post by ID
router.get('/get-single/:postId', authMiddleware, postController.getPostById);

// Route to update a post by ID
router.put('/update/:postId', upload.single('image'), authMiddleware, postController.updatePost);

// Route to delete a post by ID
router.delete('/delete/:postId', authMiddleware, postController.deletePost);

module.exports = router;
