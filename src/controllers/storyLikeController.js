const StoryLike = require('../models/StoryLike');
const Story = require('../models/Story');
const Notification = require('../models/Notification');
const User = require('../models/User');

const storyLikeController = {
    // Like a Story
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

            // Fetch the username of the user who liked the story
            const likingUser = await User.findById(userId);
            if (!likingUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
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
                    message: `${likingUser.fullname} has liked your story.`,
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
    },

    // Unlike a Story
    unlikeStory: async (req, res) => {
        try {
            const { storyId } = req.params;
            const userId = req.user._id;

            // Fetch the like
            const like = await StoryLike.findOneAndDelete({ storyId, userId });
            if (!like) {
                return res.status(404).json({
                    success: false,
                    message: "Like not found"
                });
            }

            // Update the story's like count in the Story model
            const updatedStory = await Story.findByIdAndUpdate(
                storyId,
                { $inc: { likesCount: -1 } },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: "Story unliked successfully",
                data: updatedStory
            });
        } catch (error) {
            console.error("Error unliking");
        }
    },

    // Get Liked Stories
    getStoryLikes: async (req, res) => {
        try {
            const { storyId } = req.params;

            // Find all likes for the specified story and populate user details
            const likes = await StoryLike.find({ storyId }).populate('userId', 'username fullname');

            // Calculate the number of likes
            const likesCount = likes.length;

            // Prepare a list of liked users with relevant data
            const likedUsers = likes.map(like => ({
                userId: like.userId._id,
                username: like.userId.username,
                fullname: like.userId.fullname
            }));

            res.status(200).json({
                success: true,
                message: 'Liked users fetched successfully',
                likes: likesCount,
                likedUsers: likedUsers
            });
        } catch (error) {
            console.error("Error fetching liked users:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch liked users',
                error: error.message
            });
        }
    }
}

module.exports = storyLikeController;