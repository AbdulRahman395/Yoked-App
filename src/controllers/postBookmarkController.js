const PostBookmark = require('../models/PostBookmark');
const Post = require('../models/Post'); // Assuming Post model exists for reference

const postBookmarkController = {
    // Add a post to the user's bookmark list
    addToPostBookmark: async (req, res) => {
        try {
            const userId = req.user._id;
            const { postId } = req.body;

            // Check if the post is already bookmarked by the user
            const existingBookmark = await PostBookmark.findOne({ userId, postId });
            if (existingBookmark) {
                return res.status(400).json({
                    success: false,
                    message: 'Post is already bookmarked'
                });
            }

            // Create a new bookmark document
            const bookmarkedPost = new PostBookmark({ userId, postId });
            await bookmarkedPost.save();

            res.status(201).json({
                success: true,
                message: 'Post bookmarked successfully',
                bookmarkedPost
            });
        } catch (error) {
            console.error("Error bookmarking post:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to bookmark post',
                error: error.message
            });
        }
    },

    // Get all bookmarked posts for the authenticated user
    getPostBookmarks: async (req, res) => {
        try {
            const userId = req.user._id;

            // Find all bookmarks for this user and populate post details
            const bookmarkedPosts = await PostBookmark.find({ userId })
                .populate('postId', 'title content media') // Populate specific fields from Post
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                message: 'Bookmarked posts fetched successfully',
                bookmarkedPosts
            });
        } catch (error) {
            console.error("Error fetching bookmarked posts:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch bookmarked posts',
                error: error.message
            });
        }
    },

    // Remove a post from the user's bookmark list
    removeFromPostBookmark: async (req, res) => {
        try {
            const userId = req.user._id;
            const { id: postId } = req.params;

            // Find and delete the bookmark
            const deletedBookmark = await PostBookmark.findOneAndDelete({ userId, postId });

            if (!deletedBookmark) {
                return res.status(404).json({
                    success: false,
                    message: 'Bookmarked post not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post removed from bookmarks successfully'
            });
        } catch (error) {
            console.error("Error removing bookmarked post:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to remove bookmarked post',
                error: error.message
            });
        }
    }
};

module.exports = postBookmarkController;
