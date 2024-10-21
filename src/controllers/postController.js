const Post = require('../models/Post');

const postController = {
    // Create a new post
    createPost: async (req, res) => {
        try {
            const { caption, location, tags, audience, growthPhase, liftFocus, foundation, workoutType } = req.body;

            const userId = req.user._id;

            if (!caption || !location || !tags || !audience) {
                return res.status(400).json({ message: 'All required fields must be filled' });
            }

            // Validate required fields
            if (!req.file || !growthPhase || !liftFocus || !foundation || !workoutType) {
                return res.status(400).json({ message: 'All required flair fields must be filled' });
            }

            // Process tags
            const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

            // Create the post object
            const newPost = new Post({
                userId,
                image: req.file.filename,
                caption,
                location,
                tags: tagsArray,
                audience: audience || 'everyone',
                flair: {
                    growthPhase,
                    liftFocus,
                    foundation,
                    workoutType
                }
            });

            const savedPost = await newPost.save();

            return res.status(201).json({
                message: 'Post created successfully',
                post: savedPost
            });
        } catch (error) {
            console.error('Error creating post:', error);
            return res.status(500).json({
                message: 'An error occurred while creating the post',
                details: error.message
            });
        }
    },

    // Get all posts for a user
    getMyPosts: async (req, res) => {
        try {
            const userId = req.user.id;

            const myPosts = await Post.find({ userId });

            if (!myPosts.length) {
                return res.status(404).json({ message: 'No posts found for this user' });
            }

            return res.status(200).json({
                message: 'Posts fetched successfully',
                posts: myPosts
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

    // Get a single post by ID
    getSinglePost: async (req, res) => {
        try {
            const postId = req.params.id;

            const post = await Post.findById(postId);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json({
                message: 'Post fetched successfully',
                post
            });
        } catch (error) {
            console.error('Error fetching post:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

    // Get all posts by a specific user
    getAllPosts: async (req, res) => {
        try {
            const { userId } = req.params;

            const userPosts = await Post.find({ userId });

            if (!userPosts.length) {
                return res.status(404).json({ message: 'No posts found for this user' });
            }

            return res.status(200).json({
                message: 'Posts fetched successfully',
                posts: userPosts
            });
        } catch (error) {
            console.error('Error fetching user posts:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

    // Update a post by ID
    updatePost: async (req, res) => {
        try {
            const postId = req.params.id;
            const { caption, location, tags, audience, growthPhase, liftFocus, foundation, workoutType } = req.body;

            // Find the post by ID
            const post = await Post.findById(postId);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // If there's an image in the request, update the image field
            if (req.file) {
                post.image = req.file.filename;
            }

            // Update caption, location, tags, audience, and flair if they are provided
            if (caption) post.caption = caption;
            if (location) post.location = location;
            if (tags) {
                post.tags = tags.split(',').map(tag => tag.trim()); // Convert tags string to array
            }
            if (audience) post.audience = audience;

            // Update flair if provided
            if (growthPhase || liftFocus || foundation || workoutType) {
                post.flair = {
                    growthPhase: growthPhase || post.flair.growthPhase,
                    liftFocus: liftFocus || post.flair.liftFocus,
                    foundation: foundation || post.flair.foundation,
                    workoutType: workoutType || post.flair.workoutType
                };
            }

            // Save the updated post
            const updatedPost = await post.save();

            return res.status(200).json({
                message: 'Post updated successfully',
                post: updatedPost
            });
        } catch (error) {
            console.error('Error updating post:', error);
            return res.status(500).json({
                message: 'An error occurred while updating the post',
                details: error.message
            });
        }
    },

    // Delete a post by ID
    deletePost: async (req, res) => {
        try {
            const postId = req.params.id;

            const deletedPost = await Post.findByIdAndDelete(postId);

            if (!deletedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json({
                message: 'Post deleted successfully',
                post: deletedPost
            });
        } catch (error) {
            console.error('Error deleting post:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

}

module.exports = postController;