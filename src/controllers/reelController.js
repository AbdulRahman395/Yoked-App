const Reel = require('../models/Reel');
const Notification = require('../models/Notification');
const Follow = require('../models/Follow');
const User = require('../models/User');

const reelController = {
    // Create a new reel and notify followers
    createReel: async (req, res) => {
        try {
            const { title, flair } = req.body;

            // Extract userId from JWT
            const userId = req.user._id;

            // Ensure all required fields are provided, including the video file
            if (!title || !flair || !req.file) {
                return res.status(400).json({ message: 'Title, filter, and video are required' });
            }

            // Create the reel object
            const newReel = new Reel({
                userId,
                title,
                video: req.file.filename,
                flair
            });

            // Save the reel in the database
            const savedReel = await newReel.save();

            // Get followers of the user who created the reel
            const followers = await Follow.find({ followeeId: userId });

            if (followers && followers.length > 0) {
                // Retrieve the user's full name for the notification message
                const user = await User.findById(userId);
                const userName = user ? user.fullname : "Someone";

                // Create notifications for each follower
                const notifications = followers.map(follower => ({
                    userId: follower.followerId,
                    title: "New Reel",
                    message: `${userName} has uploaded a new reel titled "${title}".`,
                    timestamp: new Date()
                }));

                // Insert all notifications at once
                await Notification.insertMany(notifications);
            }

            // Return a success response
            return res.status(201).json({
                message: 'Reel created successfully',
                reel: savedReel
            });
        } catch (error) {
            console.error('Error creating reel:', error);
            return res.status(500).json({
                message: 'An error occurred while creating the reel',
                details: error.message
            });
        }
    },

    // Get all reels of a user (with JWT)
    getMyReels: async (req, res) => {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', flair } = req.query;

            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const userId = req.user._id;

            // Define query to filter reels based on flair condition
            const query = { userId };

            // Apply flair filtering logic
            if (flair) {
                if (flair === 'Cutting') {
                    query.flair = 'Cutting';
                } else if (flair === 'General Fitness') {
                    query.flair = 'General Fitness';
                }
            }

            const myReels = await Reel.find(query)
                .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limitNumber);

            const totalMyReels = await Reel.countDocuments(query);

            if (!myReels.length) {
                return res.status(404).json({ message: 'No reels found for this user' });
            }

            return res.status(200).json({
                message: 'Reels fetched successfully',
                totalMyReels,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalMyReels / limitNumber),
                reels: myReels
            });
        } catch (error) {
            console.error('Error fetching reels:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

    // Get a single reel by ID
    getSingleReel: async (req, res) => {
        try {
            const reelId = req.params.id;

            const reel = await Reel.findById(reelId);

            if (!reel) {
                return res.status(404).json({ message: 'Reel not found' });
            }

            return res.status(200).json({
                message: 'Reel fetched successfully',
                reel
            });
        } catch (error) {
            console.error('Error fetching reel:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

    // Get all reels in the collection
    getAllReels: async (req, res) => {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', flair } = req.query;

            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const skip = (pageNumber - 1) * limitNumber;

            // Define query to filter reels based on flair condition
            const query = {};

            // Apply flair filtering logic
            if (flair) {
                if (flair === 'Cutting') {
                    query.flair = 'Bulking';
                } else if (flair === 'General Fitness') {
                    query.flair = 'General Fitness';
                }
            }

            const allReels = await Reel.find(query)
                .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limitNumber);

            const totalReels = await Reel.countDocuments(query);

            if (!allReels.length) {
                return res.status(404).json({ message: 'No reels found' });
            }

            return res.status(200).json({
                message: 'All reels fetched successfully',
                totalReels,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalReels / limitNumber),
                reels: allReels
            });
        } catch (error) {
            console.error('Error fetching reels:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },

    // Delete a reel by ID
    deleteReel: async (req, res) => {
        try {
            const reelId = req.params.id;

            const deletedReel = await Reel.findByIdAndDelete(reelId);

            if (!deletedReel) {
                return res.status(404).json({ message: 'Reel not found' });
            }

            return res.status(200).json({
                message: 'Reel deleted successfully',
                reel: deletedReel
            });
        } catch (error) {
            console.error('Error deleting reel:', error);
            return res.status(500).json({ message: 'An error occurred', details: error.message });
        }
    },
};

module.exports = reelController;
