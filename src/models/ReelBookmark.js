const mongoose = require('mongoose');
const { Schema } = mongoose;

const reelbookmarkSchema = new Schema({
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

const ReelBookmark = mongoose.model('Reelbookmark', reelbookmarkSchema);

module.exports = ReelBookmark;
