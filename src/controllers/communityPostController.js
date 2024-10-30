const CommunityPost = require('../models/CommunityPost');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const User = require('../models/User');

const communityPostController = {
    // Create a new post ✅
    createPost: async (req, res) => {
        try {
            const { title, description } = req.body;
            const userId = req.user._id;
            const media = req.file ? req.file.filename : req.body.media;

            if (!media) {
                return res.status(400).json({ message: "Media is required." });
            }

            const post = new CommunityPost({
                userId,
                title,
                description,
                media,
                reactions: []
            });

            await post.save();

            // Get followers from the followers collection
            const followers = await Follow.find({ followeeId: userId });

            if (followers && followers.length > 0) {
                // Retrieve the user's full name for the notification message
                const user = await User.findById(userId);

                const userName = user ? user.fullname : "Someone";

                // Create notifications for each follower
                const notifications = followers.map(follower => ({
                    userId: follower.followerId,  // Notify each follower
                    title: "New Community Post",
                    message: `${userName} has uploaded a new Community Post.`,
                    timestamp: new Date()
                }));

                // Insert all notifications at once
                await Notification.insertMany(notifications);
            }

            res.status(201).json({
                success: true,
                message: 'Post created successfully',
                post
            });
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to create post',
                error: error.message
            });
        }
    },

    // Get all posts ✅
    getAllPosts: async (req, res) => {
        try {
            const posts = await CommunityPost.find()
                .populate('userId', 'username') // Populate user information
                .sort({ createdAt: -1 }); // Sort by newest first

            res.status(200).json({
                success: true,
                message: 'Posts fetched successfully',
                posts
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch posts',
                error: error.message
            });
        }
    },

    // Get a single post by ID ✅
    getPostById: async (req, res) => {
        try {
            const { postId } = req.params;

            const post = await CommunityPost.findById(postId).populate('userId', 'username');
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post fetched successfully',
                post
            });
        } catch (error) {
            console.error("Error fetching post:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch post',
                error: error.message
            });
        }
    },

    // Update a post (partial update based on provided fields) ✅
    updatePost: async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.user._id;

            // Initialize an update object
            const updateData = {};

            // Conditionally add fields to updateData only if they are provided
            if (req.body.title) updateData.title = req.body.title;
            if (req.body.description) updateData.description = req.body.description;
            if (req.file) updateData.media = req.file.filename; // Use uploaded file path for media if provided

            // Check if at least one field is provided to update
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "No fields provided to update." });
            }

            // Update the post with the specified fields
            const post = await CommunityPost.findOneAndUpdate(
                { _id: postId, userId }, // Ensure only the post owner can update
                updateData,
                { new: true } // Return the updated document
            );

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found or unauthorized'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post updated successfully',
                post
            });
        } catch (error) {
            console.error("Error updating post:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to update post',
                error: error.message
            });
        }
    },

    // Delete a post ✅
    deletePost: async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.user._id;

            const post = await CommunityPost.findOneAndDelete({ _id: postId, userId });
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found or unauthorized'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post deleted successfully'
            });
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete post',
                error: error.message
            });
        }
    },


    // Add or update a reaction to a post
    addReaction: async (req, res) => {
        try {
            const { postId } = req.params;
            const { reaction } = req.body;
            const userId = req.user._id;

            // Validate the reaction type
            if (!['like', 'love', 'fire', 'muscle'].includes(reaction)) {
                return res.status(400).json({ message: "Invalid reaction type" });
            }

            // Find the post
            const post = await CommunityPost.findById(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            // Find the existing reaction by this user
            const existingReactionIndex = post.reactions.findIndex(
                (r) => r.userId.toString() === userId.toString()
            );

            if (existingReactionIndex !== -1) {
                // Update the existing reaction
                post.reactions[existingReactionIndex].type = reaction;
            } else {
                // Add a new reaction
                post.reactions.push({ userId, type: reaction });
            }

            // Save the updated post
            await post.save();

            res.status(200).json({
                success: true,
                message: 'Reaction added/updated successfully',
                post
            });
        } catch (error) {
            console.error("Error adding/updating reaction:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to add/update reaction',
                error: error.message
            });
        }
    }
}

module.exports = communityPostController;
