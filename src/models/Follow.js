const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Follow', followSchema);