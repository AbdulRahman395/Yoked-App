const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

router.post('/create', authMiddleware, upload.single('image'), postController.createPost);

module.exports = router;
