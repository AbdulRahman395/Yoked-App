const Post = require('../models/Post');
const CommunityPost = require('../models/CommunityPost'); // Import the new model

const communityPostController = {

    // Create a new community post
    createCommunityPost: async (req, res) => {
        try {
            const { title, content } = req.body;
            const userId = req.user._id;

            if (!title || !content || !req.file) {
                return res.status(400).json({ message: 'All fields must be filled' });
            }

            const newCommunityPost = new CommunityPost({
                userId,
                title,
                content,
                image: req.file.filename,
            });

            const savedCommunityPost = await newCommunityPost.save();

            return res.status(201).json({
                message: 'Community post created successfully',
                post: savedCommunityPost
            });
        } catch (error) {
            console.error('Error creating community post:', error);
            return res.status(500).json({
                message: 'An error occurred while creating the community post',
                details: error.message
            });
        }
    },

    // Get all community posts
    getAllCommunityPosts: async (req, res) => {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const communityPosts = await CommunityPost.find({})
                .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limitNumber)
                .populate('userId', 'name username'); // Populate user details

            const totalCommunityPosts = await CommunityPost.countDocuments({});

            if (!communityPosts.length) {
                return res.status(404).json({ message: 'No community posts found' });
            }

            return res.status(200).json({
                message: 'Community posts fetched successfully',
                totalCommunityPosts,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalCommunityPosts / limitNumber),
                posts: communityPosts
            });
        } catch (error) {
            console.error('Error fetching community posts:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

    // Get a single community post by ID
    getSingleCommunityPost: async (req, res) => {
        try {
            const postId = req.params.id;

            const communityPost = await CommunityPost.findById(postId).populate('userId', 'name username');

            if (!communityPost) {
                return res.status(404).json({ message: 'Community post not found' });
            }

            return res.status(200).json({
                message: 'Community post fetched successfully',
                post: communityPost
            });
        } catch (error) {
            console.error('Error fetching community post:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

    // Update a community post by ID
    updateCommunityPost: async (req, res) => {
        try {
            const postId = req.params.id;
            const { title, content } = req.body;

            const communityPost = await CommunityPost.findById(postId);

            if (!communityPost) {
                return res.status(404).json({ message: 'Community post not found' });
            }

            if (req.file) {
                communityPost.image = req.file.filename; // Update the image if provided
            }
            if (title) communityPost.title = title;
            if (content) communityPost.content = content;

            const updatedCommunityPost = await communityPost.save();

            return res.status(200).json({
                message: 'Community post updated successfully',
                post: updatedCommunityPost
            });
        } catch (error) {
            console.error('Error updating community post:', error);
            return res.status(500).json({
                message: 'An error occurred while updating the community post',
                details: error.message
            });
        }
    },

    // Delete a community post by ID
    deleteCommunityPost: async (req, res) => {
        try {
            const postId = req.params.id;

            const deletedCommunityPost = await CommunityPost.findByIdAndDelete(postId);

            if (!deletedCommunityPost) {
                return res.status(404).json({ message: 'Community post not found' });
            }

            return res.status(200).json({
                message: 'Community post deleted successfully',
                post: deletedCommunityPost
            });
        } catch (error) {
            console.error('Error deleting community post:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

    // Updated method to get all posts, now including user info
    getAllPosts: async (req, res) => {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const allPosts = await Post.find({})
                .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limitNumber)
                .populate('userId', 'name username'); // Populate user details

            const totalPosts = await Post.countDocuments({});

            if (!allPosts.length) {
                return res.status(404).json({ message: 'No posts found' });
            }

            return res.status(200).json({
                message: 'All posts fetched successfully',
                totalPosts,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalPosts / limitNumber),
                posts: allPosts
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },
};

module.exports = communityPostController;
