const Save = require('../models/Saved');
const Reel = require('../models/Reel');

const bookmarkController = {
    // Add a reel to the user's saved list
    addToBookmark: async (req, res) => {
        try {
            const userId = req.user._id;
            const { reelId } = req.body;

            // Check if the reel is already saved by the user
            const existingSave = await Save.findOne({ userId, reelId });
            if (existingSave) {
                return res.status(400).json({
                    success: false,
                    message: 'Reel is already saved'
                });
            }

            // Create a new saved document
            const savedItem = new Save({ userId, reelId });
            await savedItem.save();

            res.status(201).json({
                success: true,
                message: 'Reel saved successfully',
                savedItem
            });
        } catch (error) {
            console.error("Error saving reel:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to save reel',
                error: error.message
            });
        }
    },

    // Get all saved reels for the authenticated user
    getBookmarks: async (req, res) => {
        try {
            const userId = req.user._id;

            // Find all saved items for this user and populate reel details
            const savedReels = await Save.find({ userId })
                .populate('reelId') // Populate reel details
                .sort({ createdAt: -1 }); // Sort by newest first

            res.status(200).json({
                success: true,
                message: 'Saved reels fetched successfully',
                savedReels
            });
        } catch (error) {
            console.error("Error fetching saved reels:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch saved reels',
                error: error.message
            });
        }
    },

    // Remove a reel from the user's saved list
    removeFromBookmark: async (req, res) => {
        try {
            const userId = req.user._id;
            const { id: reelId } = req.params;

            // Find and delete the saved item
            const deletedSave = await Save.findOneAndDelete({ userId, reelId });

            if (!deletedSave) {
                return res.status(404).json({
                    success: false,
                    message: 'Saved reel not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reel removed from saved successfully'
            });
        } catch (error) {
            console.error("Error removing saved reel:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to remove saved reel',
                error: error.message
            });
        }
    }
}

module.exports = bookmarkController;