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
    storyDate: { 
        type: Date, 
        default: Date.now 
    },
    expirationDate: { 
        type: Date, 
        default: () => Date.now() + 24 * 60 * 60 * 1000 
    }
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
