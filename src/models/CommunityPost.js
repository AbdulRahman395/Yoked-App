const mongoose = require('mongoose');

// Define the Community Post schema
const communityPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Community Post model
const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

module.exports = CommunityPost;
