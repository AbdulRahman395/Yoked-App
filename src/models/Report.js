const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
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
    reason: {
        type: String,
        enum: ['inappropriate content', 'offensive language', 'spam', 'hate speech'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
