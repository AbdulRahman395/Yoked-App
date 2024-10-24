const Story = require('../models/Story');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const storyController = {
    // Add a new story
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

            res.status(200).json({ message: 'Story added successfully', story: savedStory });
        } catch (err) {
            return res.status(500).json({ message: 'Error adding story', error: err });
        }
    },

    // Get my Stories
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

            // Define the expiration time for stories (24 hours)
            const expirationTime = 24 * 60 * 60 * 1000;
            const currentTime = Date.now();

            // Fetch stories where the createdAt timestamp is within the last 24 hours
            const stories = await Story.find({
                userId: userId,
                createdAt: { $gte: new Date(currentTime - expirationTime) }
            }).sort({ createdAt: -1 });

            res.status(200).json({ message: 'Stories fetched successfully', stories: stories });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching stories', error: error });
        }
    }

}
module.exports = storyController;
