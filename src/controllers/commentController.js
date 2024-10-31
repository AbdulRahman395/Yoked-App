const Comment = require('../models/Comment');
const User = require('../models/User');

const commentController = {
    // Add a Comment
    addComment: async (req, res) => {
        try {
            const { postId } = req.params;
            const { comment } = req.body;
            const userId = req.user._id;

            // Create a new comment
            const newComment = new Comment({ userId, postId, comment });
            await newComment.save();

            res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                comment: newComment
            });
        } catch (error) {
            console.error("Error adding comment:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to add comment',
                error: error.message
            });
        }
    },

    // Update a Comment
    updateComment: async (req, res) => {
        try {
            const { commentId } = req.params;
            const { comment } = req.body;
            const userId = req.user._id;

            // Find and update the comment if the user is the owner
            const updatedComment = await Comment.findOneAndUpdate(
                { _id: commentId, userId },
                { comment },
                { new: true }
            );

            if (!updatedComment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found or unauthorized'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Comment updated successfully',
                comment: updatedComment
            });
        } catch (error) {
            console.error("Error updating comment:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to update comment',
                error: error.message
            });
        }
    },

    // Delete a Comment
    deleteComment: async (req, res) => {
        try {
            const { commentId } = req.params;
            const userId = req.user._id;

            // Find and delete the comment if the user is the owner
            const deletedComment = await Comment.findOneAndDelete({ _id: commentId, userId });

            if (!deletedComment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found or unauthorized'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Comment deleted successfully'
            });
        } catch (error) {
            console.error("Error deleting comment:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete comment',
                error: error.message
            });
        }
    },

    // Get All Comments for a Post
    getCommentsByPost: async (req, res) => {
        try {
            const { postId } = req.params;

            // Find all comments for the post, sorted by creation date, and populate user details
            const comments = await Comment.find({ postId })
                .populate('userId', 'username fullname profileImage') // Populate username of the user who commented
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                message: 'Comments fetched successfully',
                comments
            });
        } catch (error) {
            console.error("Error fetching comments:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch comments',
                error: error.message
            });
        }
    }
}

module.exports = commentController;