const Comment = require('../models/Comment');
const User = require('../models/User');

const commentController = {
    // Add a Comment or Reply
    addComment: async (req, res) => {
        try {
            const { postId } = req.params;
            const { comment, parentId } = req.body; // Accept parentId for nested comments
            const userId = req.user._id;

            // Create a new comment
            const newComment = new Comment({ userId, postId, comment, parentId });
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

    // Get All Top-Level Comments for a Post
    getTopCommentsByPost: async (req, res) => {
        try {
            const { postId } = req.params;

            // Find all top-level comments for the post
            const comments = await Comment.find({ postId, parentId: null })
                .populate('userId', 'username fullname profileImage') // Populate user details
                .sort({ createdAt: -1 });

            // Add replies count for each comment
            const commentsWithRepliesCount = await Promise.all(comments.map(async (comment) => {
                const repliesCount = await Comment.countDocuments({ parentId: comment._id });
                return {
                    ...comment.toObject(),
                    repliesCount
                };
            }));

            res.status(200).json({
                success: true,
                message: 'Top comments fetched successfully',
                comments: commentsWithRepliesCount
            });
        } catch (error) {
            console.error("Error fetching top comments:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch top comments',
                error: error.message
            });
        }
    },

    // Get All Child Comments for a Specific Comment
    getChildComments: async (req, res) => {
        try {
            const { commentId } = req.params;

            // Find all child comments for the specified comment
            const childComments = await Comment.find({ parentId: commentId })
                .populate('userId', 'username fullname profileImage') // Populate user details
                .sort({ createdAt: -1 });

            // Add replies count for each child comment
            const childCommentsWithRepliesCount = await Promise.all(childComments.map(async (comment) => {
                const repliesCount = await Comment.countDocuments({ parentId: comment._id });
                return {
                    ...comment.toObject(),
                    repliesCount
                };
            }));

            res.status(200).json({
                success: true,
                message: 'Child comments fetched successfully',
                comments: childCommentsWithRepliesCount
            });
        } catch (error) {
            console.error("Error fetching child comments:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch child comments',
                error: error.message
            });
        }
    }

};

module.exports = commentController;
