const mongoose = require('mongoose');
const { Schema } = mongoose;

const postbookmarkSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, { timestamps: true });

const PostBookmark = mongoose.model('Postbookmark', postbookmarkSchema);

module.exports = PostBookmark;
