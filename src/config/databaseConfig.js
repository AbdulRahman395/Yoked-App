const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 
const connect = mongoose.connect(process.env.MONGO_URI);

// mongoose ko promise sy handle kia
connect.then(
    () => {
        console.log("Database has been connected successfully.")
    }
).catch(
    () => {
        console.log("Database couldn't connect.")
    }
)