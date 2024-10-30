const StoryLike = require('../models/StoryLike');
const Story = require('../models/Story');
const Notification = require('../models/Notification');

const storyLikeController = {
    // When user likes story, other user should be notified... and should also be display likes of the stories while user hits getMyStory API
    likeStory: async (req, res) => {
        try {
            const { storyId } = req.params;
            const userId = req.user._id;
    
            // Check if the user already likes the story
            const existingLike = await StoryLike.findOne({ storyId, userId });
            if (existingLike) {
                return res.status(400).json({
                    success: false,
                    message: "You have already liked this story"
                });
            }
    
            // Create a new like
            const like = new StoryLike({ storyId, userId });
            await like.save();
    
            // Update the story's like count in the Story model
            const updatedStory = await Story.findByIdAndUpdate(
                storyId,
                { $inc: { likesCount: 1 } },
                { new: true }
            );
    
            // Notify the story owner
            const storyOwner = updatedStory.userId;
            if (storyOwner.toString() !== userId.toString()) {
                const notification = new Notification({
                    userId: storyOwner,
                    title: "New Story Like",
                    message: `Your story was liked by a user.`,
                    isRead: false
                });
                await notification.save();
            }
    
            res.status(200).json({
                success: true,
                message: "Story liked successfully",
                data: updatedStory
            });
        } catch (error) {
            console.error("Error liking story:", error);
            res.status(500).json({
                success: false,
                message: "Failed to like the story",
                error: error.message
            });
        }
    }    

}

module.exports = storyLikeController;