const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Communitypost',
        required: true
    },
    reaction: {
        type: String,
        enum: ['like', 'love', 'fire', 'muscle'],
        required: true
    }
}, { timestamps: true });

const React = mongoose.model('React', likeSchema);

module.exports = React;
