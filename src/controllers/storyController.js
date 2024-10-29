const Story = require('../models/Story');
const Follow = require('../models/Follow');
const Mute = require('../models/Mute');
const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const storyController = {
    // Add a new story and notify followers
    addStory: async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const userId = decoded._id;
            if (!userId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const storyPic = req.file.filename;
            const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

            const newStory = new Story({
                userId: userId,
                mediaUrl: storyPic,
                mediaType: mediaType
            });

            const savedStory = await newStory.save();

            // Get followers from the followers collection
            const followers = await Follow.find({ followeeId: userId });

            if (followers && followers.length > 0) {
                // Retrieve the user's full name for the notification message
                const user = await User.findById(userId);

                // Debug logs to verify the user and fullName field
                console.log("User retrieved:", user);
                console.log("User fullName:", user ? user.fullname : "User not found");

                const userName = user ? user.fullname : "Someone";  // Use fullName instead of name

                // Create notifications for each follower
                const notifications = followers.map(follower => ({
                    userId: follower.followerId,  // Notify each follower
                    title: "New Story",
                    message: `${userName} has uploaded a new story.`,
                    timestamp: new Date()
                }));

                // Insert all notifications at once
                await Notification.insertMany(notifications);
            }

            res.status(200).json({ message: 'Story added successfully', story: savedStory });
        } catch (err) {
            console.error('Error adding story:', err);
            return res.status(500).json({ message: 'Error adding story', error: err });
        }
    },

    // Get my Stories ✅
    getMyStories: async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const userId = decoded._id;
            if (!userId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Fetch stories that have not expired
            const stories = await Story.find({
                userId: userId,
                expirationDate: { $gte: new Date() } // Ensure the story hasn't expired yet
            }).sort({ createdAt: -1 });

            res.status(200).json({
                message: 'Stories fetched successfully',
                stories: stories
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching stories', error: error });
        }
    },

    // Get User's Stories with Params ✅
    getUserStories: async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            // Extract token from the authorization header to check muted users
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Decode the JWT to get the current user's ID
            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const currentUserId = decoded._id;
            if (!currentUserId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Check if the userId being requested has been muted by the current user
            const mutedUser = await Mute.findOne({ muterId: currentUserId, muteeId: userId });

            if (mutedUser) {
                return res.status(403).json({ message: "You have muted this user and cannot view their stories" });
            }

            // Extract query parameters for pagination or filtering
            const { limit, offset } = req.query;
            const parsedLimit = parseInt(limit) || 10;
            const parsedOffset = parseInt(offset) || 0;

            // Fetch stories that haven't expired
            const stories = await Story.find({
                userId: userId,
                expirationDate: { $gte: new Date() } // Only fetch non-expired stories
            })
                .sort({ createdAt: -1 })
                .skip(parsedOffset)
                .limit(parsedLimit);

            res.status(200).json({
                message: 'Stories fetched successfully',
                total: stories.length,
                stories: stories,
                limit: parsedLimit,
                offset: parsedOffset
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching stories', error: error });
        }
    },

    // Get Stories of Users the Current User Follows and skipping muted user's stories ✅
    getAllStories: async (req, res) => {
        try {
            // Step 1: Extract token from the authorization header
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Step 2: Decode the JWT to get the current user's ID
            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const currentUserId = decoded._id;
            if (!currentUserId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Step 3: Get the list of users that the current user follows
            const followedUsers = await Follow.find({ followerId: currentUserId }).select('followeeId');
            const followeeIds = followedUsers.map(follow => follow.followeeId);

            if (followeeIds.length === 0) {
                return res.status(200).json({ message: 'No stories to display', stories: [] });
            }

            // Step 4: Get the list of users that the current user has muted
            const mutedUsers = await Mute.find({ muterId: currentUserId }).select('muteeId');
            const mutedUserIds = mutedUsers.map(mute => mute.muteeId);

            // Step 5: Exclude muted users from the list of followees by comparing ObjectIds properly
            const nonMutedFolloweeIds = followeeIds.filter(followeeId =>
                !mutedUserIds.some(mutedId => mutedId.equals(followeeId))
            );

            if (nonMutedFolloweeIds.length === 0) {
                return res.status(200).json({ message: 'No stories to display', stories: [] });
            }

            // Step 6: Extract query parameters for pagination or filtering
            const { limit, offset } = req.query;
            const parsedLimit = parseInt(limit) || 10;
            const parsedOffset = parseInt(offset) || 0;

            console.log(nonMutedFolloweeIds)
            // Step 7: Fetch active stories from the non-muted users that the current user follows
            const stories = await Story.find({
                userId: { $in: nonMutedFolloweeIds },
                expirationDate: { $gte: new Date() } // Only fetch non-expired stories
            })
                .sort({ createdAt: -1 })
                .skip(parsedOffset)
                .limit(parsedLimit);

            // Step 8: Return the fetched stories
            res.status(200).json({
                message: 'Active stories fetched successfully',
                total: stories.length,
                stories: stories,
                limit: parsedLimit,
                offset: parsedOffset
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching stories', error: error });
        }
    },

    // Delete story by ID ✅
    deleteStory: async (req, res) => {
        try {
            // Extract userId from token
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Decode the JWT to get the current user's ID
            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const userId = decoded._id;
            if (!userId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Extract the story ID from the request parameters
            const { storyId } = req.params;
            if (!storyId) {
                return res.status(400).json({ message: "Story ID is required" });
            }

            // Find and delete the story if it belongs to the user
            const story = await Story.findOneAndDelete({ _id: storyId, userId: userId });

            // Check if the story was found and deleted
            if (!story) {
                return res.status(404).json({ message: "Story not found or you are not authorized to delete this story" });
            }

            res.status(200).json({ message: "Story deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting story", error: error });
        }
    }

}
module.exports = storyController;