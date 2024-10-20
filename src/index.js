const express = require('express');
const app = express();
app.use(express.json());

require('./config/databaseConfig');

// Routes
app.use('/api/users', require('./routes/userRoutes'));

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
