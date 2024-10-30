const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema creation
const UserSchema = new Schema({
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
    },
    dob: {
        type: Date, // Store date of birth for calculating age
        required: true
    },
    age: {
        type: Number // Store the calculated age
    },
    currentWeight: {
        type: Number,
        required: true
    },
    goalWeight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    profileImage: { type: String }
});

// Index for OTP expiration
UserSchema.index({ otpExpire: 1 }, { expireAfterSeconds: 60 });

// Virtual field to calculate age based on dob
UserSchema.virtual('calculatedAge').get(function () {
    if (this.dob) {
        const ageDifMs = Date.now() - this.dob.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    return null;
});

// Middleware to automatically calculate and set the 'age' before saving the user
UserSchema.pre('save', function (next) {
    if (this.dob) {
        this.age = this.calculatedAge;
    }
    next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
