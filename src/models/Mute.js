const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const muteSchema = new Schema({
    muterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    muteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mutedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mute', muteSchema);
