const mongoose = require('mongoose');

// Define the Reel schema
const reelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        require: true
    },
    video: {
        type: String,
        required: true,
    },
    flair: {
        type: String,
        enum: ['Cutting', 'General Fitness'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Reel model
const Reel = mongoose.model('Reel', reelSchema);

module.exports = Reel;
