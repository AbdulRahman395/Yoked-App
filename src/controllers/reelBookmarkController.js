const ReelBookmark = require('../models/ReelBookmark');
const Reel = require('../models/Reel'); // Assuming Reel model exists for reference

const reelBookmarkController = {
    // Add a reel to the user's bookmark list
    addToReelBookmark: async (req, res) => {
        try {
            const userId = req.user._id;
            const { reelId } = req.body;

            // Check if the reel is already bookmarked by the user
            const existingBookmark = await ReelBookmark.findOne({ userId, reelId });
            if (existingBookmark) {
                return res.status(400).json({
                    success: false,
                    message: 'Reel is already bookmarked'
                });
            }

            // Create a new bookmark document
            const bookmarkedReel = new ReelBookmark({ userId, reelId });
            await bookmarkedReel.save();

            res.status(201).json({
                success: true,
                message: 'Reel bookmarked successfully',
                bookmarkedReel
            });
        } catch (error) {
            console.error("Error bookmarking reel:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to bookmark reel',
                error: error.message
            });
        }
    },

    // Get all bookmarked reels for the authenticated user
    getReelBookmarks: async (req, res) => {
        try {
            const userId = req.user._id;

            // Find all bookmarks for this user and populate reel details
            const bookmarkedReels = await ReelBookmark.find({ userId })
                .populate('reelId', 'title description media') // Populate specific fields from Reel
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                message: 'Bookmarked reels fetched successfully',
                bookmarkedReels
            });
        } catch (error) {
            console.error("Error fetching bookmarked reels:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch bookmarked reels',
                error: error.message
            });
        }
    },

    // Remove a reel from the user's bookmark list
    removeFromReelBookmark: async (req, res) => {
        try {
            const userId = req.user._id;
            const { id: reelId } = req.params;

            // Find and delete the bookmark
            const deletedBookmark = await ReelBookmark.findOneAndDelete({ userId, reelId });

            if (!deletedBookmark) {
                return res.status(404).json({
                    success: false,
                    message: 'Bookmarked reel not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reel removed from bookmarks successfully'
            });
        } catch (error) {
            console.error("Error removing bookmarked reel:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to remove bookmarked reel',
                error: error.message
            });
        }
    }
};

module.exports = reelBookmarkController;
