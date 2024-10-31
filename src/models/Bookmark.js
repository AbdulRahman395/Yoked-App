const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookmarkSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reelId: {
        type: Schema.Types.ObjectId,
        ref: 'Reel',
        required: true
    }
}, { timestamps: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
