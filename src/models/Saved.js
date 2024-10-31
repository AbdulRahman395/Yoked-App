const mongoose = require('mongoose');
const { Schema } = mongoose;

const savedSchema = new Schema({
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

const Save = mongoose.model('Save', savedSchema);

module.exports = Save;
