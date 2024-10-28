const User = require('../models/User');
const Chat = require('../models/Chat');

const chatController = {
    // Load the dashboard, displaying users excluding the current user
    loadDashboard: async (req, res) => {
        try {
            const users = await User.find({ _id: { $nin: [req.session.user._id] } });
            res.render('dashboard', { user: req.session.user, users: users });
        } catch (error) {
            console.error(error.message);
            res.status(500).send({ success: false, msg: 'Failed to load dashboard' });
        }
    },

    // Save a new chat message
    saveChat: async (req, res) => {
        try {
            const chat = new Chat({
                sender_id: req.body.sender_id,
                receiver_id: req.body.receiver_id,
                message: req.body.message,
            });

            const newChat = await chat.save();
            res.status(200).send({ success: true, msg: 'Chat saved successfully!', data: newChat });
        } catch (error) {
            console.error(error.message);
            res.status(400).send({ success: false, msg: 'Failed to save chat' });
        }
    },

    // Delete a chat message by ID
    deleteChat: async (req, res) => {
        try {
            await Chat.deleteOne({ _id: req.body.id });
            res.status(200).send({ success: true, msg: 'Chat deleted successfully' });
        } catch (error) {
            console.error(error.message);
            res.status(400).send({ success: false, msg: 'Failed to delete chat' });
        }
    },

    // Update an existing chat message
    updateChat: async (req, res) => {
        try {
            await Chat.findByIdAndUpdate(req.body.id, {
                $set: { message: req.body.message },
            });
            res.status(200).send({ success: true, msg: 'Chat updated successfully' });
        } catch (error) {
            console.error(error.message);
            res.status(400).send({ success: false, msg: 'Failed to update chat' });
        }
    }
}

module.exports = chatController;