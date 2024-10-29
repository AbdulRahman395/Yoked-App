// models/Like.js
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
        ref: 'Post',
        required: true
    },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
