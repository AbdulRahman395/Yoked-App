const User = require('../models/User');
const Chat = require('../models/Chat');

const socketSetup = (io) => {
  const usp = io.of('/user-namespace');

  usp.on('connection', async (socket) => {
    console.log('User Connected');
    const userId = socket.handshake.auth.token;

    await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { is_online: '1' } }
    );

    socket.broadcast.emit('getOnlineUser', { user_id: userId });

    socket.on('disconnect', async () => {
      console.log('User Disconnected');
      await User.findByIdAndUpdate(
        { _id: userId },
        { $set: { is_online: '0' } }
      );
      socket.broadcast.emit('getOfflineUser', { user_id: userId });
    });

    socket.on('newChat', (data) => {
      socket.broadcast.emit('loadNewChat', data);
    });

    socket.on('existsChat', async (data) => {
      const chats = await Chat.find({
        $or: [
          { sender_id: data.sender_id, receiver_id: data.receiver_id },
          { sender_id: data.receiver_id, receiver_id: data.sender_id },
        ]
      });
      socket.emit('loadChats', { chats });
    });

    socket.on('chatDeleted', (id) => {
      socket.broadcast.emit('chatMessageDeleted', id);
    });
  });
};

module.exports = socketSetup;
