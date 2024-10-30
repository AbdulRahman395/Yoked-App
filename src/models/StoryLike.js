// models/Like.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storyId: {
        type: Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
}, { timestamps: true });

const StoryLike = mongoose.model('Storylike', likeSchema);

module.exports = StoryLike;
