const express = require('express');
const app = express();
app.use(express.json());
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

require('./config/databaseConfig');

// Import and initialize Socket.IO with `io`
const socketSetup = require('./utils/socketSetup');
socketSetup(io);

// Routes
app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/athletes', require('./routes/athleteRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/follows', require('./routes/followRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/mutes', require('./routes/muteRoutes'));
app.use('/api/reels', require('./routes/reelRoutes'));
app.use('/api/storylikes', require('./routes/storyLikeRoutes'));
app.use('/api/communityposts', require('./routes/communityPostRoutes'));
app.use('/api/reacts', require('./routes/reactRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/saves', require('./routes/savedRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
