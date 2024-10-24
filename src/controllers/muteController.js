const User = require('../models/User')
const jwt = require('jsonwebtoken');
const Mute = require('../models/Mute');

const secretKey = process.env.JWT_SECRET;

const muteController = {
    // Mute a user
    muteUser: async (req, res) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify and decode the token to extract the user ID (muter)
            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const muterId = decoded._id;
            if (!muterId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Extract muteeId from the request body
            const { muteeId } = req.body;

            // Prevent users from muting themselves
            if (muterId === muteeId) {
                return res.status(400).json({ message: 'You cannot mute yourself.' });
            }

            // Check if the user is already muted
            const alreadyMuted = await Mute.findOne({ muterId, muteeId });
            if (alreadyMuted) {
                return res.status(400).json({ message: 'You have already muted this user.' });
            }

            // Create a new mute document
            const newMute = new Mute({
                muterId,
                muteeId,
                mutedAt: new Date()
            });

            await newMute.save();

            return res.status(201).json({ message: 'Muted successfully', mute: newMute });
        } catch (error) {
            console.error('Error while muting user:', error);
            return res.status(500).json({ error: 'An error occurred while muting the user.' });
        }
    },

    // Unmute a user
    unmuteUser: async (req, res) => {
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

            const muterId = decoded._id;
            if (!muterId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Extract muteeId from the request body
            const { muteeId } = req.body;

            // Find and delete the mute relationship
            const muteRecord = await Mute.findOneAndDelete({ muterId, muteeId });
            if (!muteRecord) {
                return res.status(404).json({ message: 'Mute relationship not found.' });
            }

            return res.status(200).json({ message: 'Unmuted successfully' });
        } catch (err) {
            console.error('Error while unmuting user:', err);
            return res.status(500).json({ error: 'An error occurred while unmuting the user.' });
        }
    },

    // Get all muted users of a user with JWT
    getMyMutedUsers: async (req, res) => {
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

            // Fetch all muted users by the authenticated user (muter)
            const mutedUsers = await Mute.find({ muterId: userId }).populate('muteeId', 'fullname username profileImage');

            res.status(200).json(mutedUsers);
        } catch (err) {
            console.error('Error while fetching muted users:', err);
            res.status(500).json({ error: 'An error occurred while fetching muted users.' });
        }
    }
}

module.exports = muteController;
