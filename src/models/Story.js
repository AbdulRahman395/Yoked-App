const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    mediaUrl: { 
        type: String, 
        required: true 
    },
    mediaType: { 
        type: String, 
        enum: ['image', 'video'], 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    expirationDate: {
        type: Date, 
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // Expire after 24 hours
    }
});

// TTL Index - Automatically delete stories 24 hours after creation
storySchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
