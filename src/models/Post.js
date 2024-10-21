const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    image: {
        type: String,
        required: true,
    },
    caption: {
        type: String
    },
    location: {
        type: String
    },
    tags: {
        type: [String]
    },
    audience: {
        type: String,
        enum: ['everyone', 'only me'],
        default: 'everyone',
    },
    flair: {
        growthPhase: {
            type: String,
            enum: ['Bulking', 'Cutting', 'Maintaining'],
            required: true,
        },
        liftFocus: {
            type: String,
            enum: ['PowerLifting', 'BodyBuilding', 'General Fitness'],
            required: true,
        },
        foundation: {
            type: String,
            enum: ['Natural', 'Enhanced'],
            required: true,
        },
        workoutType: {
            type: String,
            enum: ['Competition Prep', 'Personal Record', 'Consistency', 'Strength'],
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;