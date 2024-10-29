==================== Listening to Events ====================

1...
getOnlineUser: Receives an object { user_id: <userId> } when a user comes online. Use this event to update the online status of other users in the UI.

socket.on('getOnlineUser', (data) => {
  // Handle online status update in the UI
  console.log(`${data.user_id} is online`);
});



2...
getOfflineUser: Receives an object { user_id: <userId> } when a user goes offline.

socket.on('getOfflineUser', (data) => {
  // Handle offline status update in the UI
  console.log(`${data.user_id} is offline`);
});



3...
loadNewChat: Triggered when a new message is sent. Receives the new message data, which should be displayed in the chat interface in real-time.

socket.on('loadNewChat', (message) => {
  // Display new message in chat UI
  console.log('New chat received:', message);
});



4...
loadChats: Receives an array of previous chats between two users. This is useful when a user opens a chat to load the chat history.

socket.on('loadChats', (data) => {
  // Load chat history into the chat UI
  console.log('Chat history:', data.chats);
});



5...
chatMessageDeleted: Receives the ID of a deleted message to remove it from the chat UI.

socket.on('chatMessageDeleted', (messageId) => {
  // Remove deleted message from chat UI
  console.log(`Message ${messageId} deleted`);
});



==================== Emitting Events ====================

1...
newChat: Used to send a new message. The frontend should emit this event with the message data whenever a user sends a chat.

socket.emit('newChat', {
  sender_id: <senderId>,
  receiver_id: <receiverId>,
  message: <messageContent>,
  message_type: <'text' | 'image' | 'video'>
});



2...
existsChat: When a user opens a chat with another user, the frontend can emit this event with { sender_id, receiver_id } to request the chat history.

socket.emit('existsChat', {
  sender_id: <senderId>,
  receiver_id: <receiverId>
});



3...
chatDeleted: When a message is deleted, the frontend can emit this event with the message ID.

socket.emit('chatDeleted', messageId);



=============== Documentation Summary for the Frontend ===============

Provide the frontend developer with a document containing:

The namespace to connect to.
Authentication details (such as passing the user token in the auth header).
Each event’s purpose, what to emit, what to listen to, and the expected data format for each event.
With this setup, the frontend developer will know how to properly integrate real-time functionality using the provided socket events.