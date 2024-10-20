const mongoose = require("mongoose");

// Schema banaya
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    otpExpire: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAthlete: {
        type: String,
        enum: ["Yes", "No"],
        default: "No"
    }
});

UserSchema.index({ otpExpire: 1 }, { expireAfterSeconds: 60 });

const User = mongoose.model("User", UserSchema);

module.exports = User;
