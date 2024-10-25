const express = require('express');
const app = express();
app.use(express.json());

require('./config/databaseConfig');

// Routes
app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/athletes', require('./routes/athleteRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/follows', require('./routes/followRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/mutes', require('./routes/muteRoutes'));
app.use('/api/reels', require('./routes/reelRoutes'));

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
