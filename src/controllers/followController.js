const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const Follow = require('../models/Follow');

const secretKey = process.env.JWT_SECRET;

const followController = {
    // Follow a user
    followUser: async (req, res) => {
        try {
            const followerId = req.user._id;
            if (!followerId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Extract followeeId from the request body
            const { followeeId } = req.body;

            // Prevent users from following themselves
            if (followerId === followeeId) {
                return res.status(400).json({ message: 'You cannot follow yourself.' });
            }

            // Check if the user is already following the followee
            const alreadyFollowing = await Follow.findOne({ followerId, followeeId });
            if (alreadyFollowing) {
                return res.status(400).json({ message: 'You are already following this user.' });
            }

            // Create a new follow document
            const newFollow = new Follow({
                followerId,
                followeeId,
                followedAt: new Date()
            });

            await newFollow.save();

            // Fetch the follower's name
            const follower = await User.findById(followerId);
            if (!follower) {
                console.error(`User with ID ${followerId} not found.`);
                return res.status(404).json({ message: 'Follower not found' });
            }

            const followerName = follower.name || "Someone";  // Use default if name is not found

            // Create a follow notification with the follower's name
            const notification = new Notification({
                userId: followeeId,
                title: "New Follower",
                message: `${followerName} has started following you.`,
                timestamp: new Date()
            });
            await notification.save();


            return res.status(201).json({ message: 'Followed successfully', follow: newFollow });
        } catch (error) {
            console.error('Error while following user:', error);
            return res.status(500).json({ error: 'An error occurred while following the user.' });
        }
    },

    // Unfollow a user
    unfollowUser: async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify and decode the token to extract the user ID
            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const followerId = decoded._id;
            if (!followerId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Extract followeeId from the request body
            const { followeeId } = req.body;

            // Find and delete the follow relationship
            const followRecord = await Follow.findOneAndDelete({ followerId, followeeId });
            if (!followRecord) {
                return res.status(404).json({ message: 'Follow relationship not found.' });
            }

            // Success response
            return res.status(200).json({ message: 'Unfollowed successfully' });
        } catch (err) {
            console.error('Error while unfollowing user:', err);
            return res.status(500).json({ error: 'An error occurred while unfollowing the user.' });
        }
    },


    // Get all followers of a user with JWT
    getMyFollowers: async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify and decode the token to extract the user ID
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

            // Fetch all followers of the authenticated user (followee)
            const followers = await Follow.find({ followeeId: userId }).populate('followerId', 'fullname username profileImage');

            // Success response
            res.status(200).json(followers);
        } catch (err) {
            console.error('Error while fetching followers:', err);
            res.status(500).json({ error: 'An error occurred while fetching followers.' });
        }
    },

    // Get all followings of a user with JWT
    getMyFollowing: async (req, res) => {
        try {
            // Extract JWT from the Authorization header
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify and decode the token to extract the user ID
            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const userId = decoded._id;  // Extract userId from the decoded token
            if (!userId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Fetch all followees (users the authenticated user is following)
            const following = await Follow.find({ followerId: userId }).populate('followeeId', 'fullname username profileImage');

            // Success response
            res.status(200).json(following);
        } catch (err) {
            console.error('Error while fetching followees:', err);
            res.status(500).json({ error: 'An error occurred while fetching followees.' });
        }
    },

    // Get all followers of a user by userId
    getFollowers: async (req, res) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            const followers = await Follow.find({ followeeId: userId }).populate('followerId', 'fullname username profileImage');

            res.status(200).json(followers);
        } catch (err) {
            console.error('Error while fetching followers:', err);
            res.status(500).json({ error: 'An error occurred while fetching followers.' });
        }
    },

    // Get all followings by userId
    getFollowing: async (req, res) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            const following = await Follow.find({ followerId: userId }).populate('followeeId', 'fullname username profileImage');

            res.status(200).json(following);
        } catch (err) {
            console.error('Error while fetching followees:', err);
            res.status(500).json({ error: 'An error occurred while fetching followees.' });
        }
    }
}

module.exports = followController;