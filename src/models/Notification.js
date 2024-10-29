const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    additionalData: { type: Map, of: String }
});

const Notification = mongoose.model('Notification', notificationSchema);
