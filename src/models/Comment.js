const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    parentId: {
        type: Schema.Types.ObjectId,
        refPath: 'Comment',
        default: null
    },
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
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
