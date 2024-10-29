### **Namespace and Authentication**

**Namespace**: `/user-namespace`  
**Authentication**: The frontend developer should connect to the socket using the user’s token as part of the authentication header.

**Example**:
```javascript
const socket = io('/user-namespace', {
  auth: { token: userToken } // Pass the user token for authentication
});


### **Listening to Events**

1. **getOnlineUser**  
   - **Description**: Receives an object `{ user_id: <userId> }` when a user comes online. Use this event to update the online status of other users in the UI.
   - **Example**:
     ```javascript
     socket.on('getOnlineUser', (data) => {
       // Handle online status update in the UI
       console.log(`${data.user_id} is online`);
     });
     ```

2. **getOfflineUser**  
   - **Description**: Receives an object `{ user_id: <userId> }` when a user goes offline.
   - **Example**:
     ```javascript
     socket.on('getOfflineUser', (data) => {
       // Handle offline status update in the UI
       console.log(`${data.user_id} is offline`);
     });
     ```

3. **loadNewChat**  
   - **Description**: Triggered when a new message is sent. Receives the new message data, which should be displayed in the chat interface in real-time.
   - **Example**:
     ```javascript
     socket.on('loadNewChat', (message) => {
       // Display new message in chat UI
       console.log('New chat received:', message);
     });
     ```

4. **loadChats**  
   - **Description**: Receives an array of previous chats between two users. This is useful when a user opens a chat to load the chat history.
   - **Example**:
     ```javascript
     socket.on('loadChats', (data) => {
       // Load chat history into the chat UI
       console.log('Chat history:', data.chats);
     });
     ```

5. **chatMessageDeleted**  
   - **Description**: Receives the ID of a deleted message to remove it from the chat UI.
   - **Example**:
     ```javascript
     socket.on('chatMessageDeleted', (messageId) => {
       // Remove deleted message from chat UI
       console.log(`Message ${messageId} deleted`);
     });
     ```

---


### **Emitting Events**

1. **newChat**  
   - **Description**: Used to send a new message. The frontend should emit this event with the message data whenever a user sends a chat.
   - **Data Format**:
     ```javascript
     socket.emit('newChat', {
       sender_id: <senderId>,
       receiver_id: <receiverId>,
       message: <messageContent>,
       message_type: <'text' | 'image' | 'video'>
     });
     ```

2. **existsChat**  
   - **Description**: When a user opens a chat with another user, the frontend can emit this event with `{ sender_id, receiver_id }` to request the chat history.
   - **Data Format**:
     ```javascript
     socket.emit('existsChat', {
       sender_id: <senderId>,
       receiver_id: <receiverId>
     });
     ```

3. **chatDeleted**  
   - **Description**: When a message is deleted, the frontend can emit this event with the message ID.
   - **Data Format**:
     ```javascript
     socket.emit('chatDeleted', messageId);
     ```

---


### **Documentation Summary for the Frontend**

Provide the frontend developer with this document, detailing:

- **Namespace**: `/user-namespace`
- **Authentication**: User token in the `auth` header.
- **Event Overview**:
   - Purpose of each event
   - Data format for each emitted and received event

With this setup, the frontend developer can integrate real-time functionality effectively using the specified socket events.