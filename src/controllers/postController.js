const Post = require('../models/Post');

const postController = {
    // Create a new post
    createPost: async (req, res) => {
        try {
            const { caption, location, tags, audience, growthPhase, liftFocus, foundation, workoutType } = req.body;

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

    
}

module.exports = postController;