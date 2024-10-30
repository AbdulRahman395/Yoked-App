const React = require('../models/React');
const CommunityPost = require('../models/CommunityPost');

const reactController = {
    // Add a Reaction
    addReaction: async (req, res) => {
        try {
            const { postId } = req.params;
            const { reaction } = req.body;
            const userId = req.user._id;

            // Validate reaction type
            if (!['like', 'love', 'fire', 'muscle'].includes(reaction)) {
                return res.status(400).json({ message: "Invalid reaction type" });
            }

            // Check if user has already reacted to this post
            const existingReaction = await React.findOne({ postId, userId });

            if (existingReaction) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already reacted to this post. Use updateReaction instead.'
                });
            }

            // Create a new reaction
            const newReaction = new React({ userId, postId, reaction });
            await newReaction.save();

            res.status(201).json({
                success: true,
                message: 'Reaction added successfully',
                reaction: newReaction
            });
        } catch (error) {
            console.error("Error adding reaction:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to add reaction',
                error: error.message
            });
        }
    },

    // Update a Reaction
    updateReaction: async (req, res) => {
        try {
            const { postId } = req.params;
            const { reaction } = req.body;
            const userId = req.user._id;

            // Validate reaction type
            if (!['like', 'love', 'fire', 'muscle'].includes(reaction)) {
                return res.status(400).json({ message: "Invalid reaction type" });
            }

            // Find and update the user's reaction on the post
            const updatedReaction = await React.findOneAndUpdate(
                { postId, userId },
                { reaction },
                { new: true }
            );

            if (!updatedReaction) {
                return res.status(404).json({
                    success: false,
                    message: 'Reaction not found. Use addReaction instead.'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reaction updated successfully',
                reaction: updatedReaction
            });
        } catch (error) {
            console.error("Error updating reaction:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to update reaction',
                error: error.message
            });
        }
    },

    // Remove a Reaction
    removeReaction: async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.user._id;

            const deletedReaction = await React.findOneAndDelete({ postId, userId });

            if (!deletedReaction) {
                return res.status(404).json({
                    success: false,
                    message: 'Reaction not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reaction removed successfully'
            });
        } catch (error) {
            console.error("Error removing reaction:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to remove reaction',
                error: error.message
            });
        }
    }
}

module.exports = reactController;