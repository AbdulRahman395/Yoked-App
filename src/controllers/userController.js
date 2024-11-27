const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const generateOTP = require('../utils/generateOtp');
const nodemailer = require('nodemailer');

const secretKey = process.env.JWT_SECRET;

const userController = {
    // Register User and Send OTP
    registerUser: async (req, res) => {
        const {
            fullname,
            username,
            email,
            password,
            phone,
            postCode,
            address,
            gender,
            isAthlete,
            dob,
            currentWeight,
            goalWeight,
            height
        } = req.body;

        try {
            // Check if a user with the same email or username already exists
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) {
                return res.status(400).json({ error: "Email is already in use. Please use a different email." });
            }

            const existingUserByUsername = await User.findOne({ username });
            if (existingUserByUsername) {
                return res.status(400).json({ error: "Username is already taken. Please choose a different username." });
            }

            // Generate hashed password and OTP
            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = generateOTP();

            // Get the profile image path if uploaded
            const profileImage = req.file ? req.file.filename : null;

            // Configure email transport
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Define email options
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify Your Account - OTP',
                html: `<p>Dear ${fullname},</p>
            <p>Here is your One-Time Password (OTP) to verify your account:</p>
            <p><b>${otp}</b></p>
            <p>This OTP is valid for 5 minutes.</p>`
            };

            // Send the OTP email first
            await transporter.sendMail(mailOptions);

            // Create new user with isVerified set to false
            const newUser = await User.create({
                fullname,
                username,
                email,
                password: hashedPassword,
                phone,
                postCode,
                address,
                gender,
                isAthlete,
                dob,
                currentWeight: Number(currentWeight),
                goalWeight: Number(goalWeight),
                height: Number(height),
                profileImage,
                otp,
                otpExpire: Date.now() + 300000, // OTP expiration time (5 minutes)
                isVerified: false
            });

            return res.status(201).json({ message: "User registered. Please verify your email by entering the OTP sent to your email." });
        } catch (error) {
            console.error("Error during registration:", error);

            // If the error is caused by the email sending process
            if (error.response) {
                return res.status(500).json({ error: "Failed to send OTP email. Please try again later." });
            }

            // Handle other internal errors
            return res.status(500).json({ error: "Internal server error. Please try again later." });
        }
    },


    // Verify OTP
    verifyOTP: async (req, res) => {
        const { email, otp } = req.body;

        try {
            const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });
            if (!user) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            // Mark user as verified
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save();

            return res.status(200).json({ message: "Account verified successfully." });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // Login User
    loginUser: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ error: "User not found" });

            // Check if user is verified
            if (!user.isVerified) {
                return res.status(403).json({ error: "Account not verified. Please verify your email." });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) return res.status(401).json({ error: "Wrong password" });

            const token = jwt.sign({ email: user.email, _id: user._id }, secretKey, { expiresIn: '90d' });
            res.status(200).json({ message: "Welcome to Homepage", token });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // Change password for authenticated user
    changePassword: async (req, res) => {
        const { oldPassword, newPassword } = req.body;

        try {
            // Extract the JWT token from the Authorization header
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify the token and extract the userId from it
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded._id;

            // Find the user by the extracted userId
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if the old password is correct
            const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: "Old password is incorrect" });
            }

            // Hash the new password and update the user's password
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            return res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // // Forget Password
    forgetPassword: async (req, res) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: "This email does not exist" });

            // Generate a random OTP
            const otp = generateOTP();

            // Update user with OTP and expiry time
            user.otp = otp;
            user.otpExpire = Date.now() + 300000;
            await user.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset OTP',
                html: `<p>Dear ${user.fullname},</p>
               <p>Here is your One-Time Password (OTP) to reset your password:</p>
               <p><b>${otp}</b></p>
               <p>This OTP is valid for 5 minutes.</p>`
            };

            await transporter.sendMail(mailOptions);
            res.status(200).send({ message: "OTP sent to your email" });
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: "Error processing request" });
        }
    },

    // // Reset Password (with OTP verification)
    resetPassword: async (req, res) => {
        const { otp, newPassword } = req.body;

        try {
            const user = await User.findOne({ otp, otpExpire: { $gt: Date.now() } });
            if (!user) return res.status(400).send({ message: 'Invalid or expired OTP' });

            // Verify OTP and update password
            if (user.otp === otp) {
                user.password = await bcrypt.hash(newPassword, 10);
                user.otp = undefined;
                user.otpExpire = undefined;
                await user.save();

                res.status(200).send({ message: 'Password has been reset' });
            } else {
                res.status(400).send({ message: 'Invalid OTP' });
            }
        } catch (error) {
            res.status(500).send({ message: 'Server error' });
        }
    },

    // Update isAthlete status
    updateAthleteStatus: async (req, res) => {
        const { isAthlete } = req.body;

        try {
            // Extract the JWT token from the Authorization header
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify the token and extract the userId from it
            const decoded = jwt.verify(token, secretKey);
            const userId = decoded._id;

            // Find the user by the extracted userId
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update the isAthlete status only if the value is "Yes" or "No"
            if (isAthlete === "Yes" || isAthlete === "No") {
                user.isAthlete = isAthlete;
                await user.save();

                // Set notification message based on isAthlete value
                const notificationMessage = isAthlete === "Yes"
                    ? "Your athlete status has been enabled."
                    : "Your athlete status has been disabled.";

                // Create a notification for the isAthlete status update
                const notification = new Notification({
                    userId: userId,
                    title: "Athlete Status Updated",
                    message: notificationMessage,
                    timestamp: new Date()
                });
                await notification.save();

                return res.status(200).json({ message: "isAthlete status updated successfully.", isAthlete: user.isAthlete });
            } else {
                return res.status(400).json({ message: "Invalid value for isAthlete. Use 'Yes' or 'No'." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // Get user by ID (For admin or user profile viewing by ID)
    getUserById: async (req, res) => {
        const { userId } = req.params; // Extract userId from the URL params

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Return the user data formatted like in the provided image
            return res.status(200).json({
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                phone: user.phone,
                email: user.email,
                isVerified: user.isVerified,
                isAthlete: user.isAthlete ? 'Yes' : 'No', // Display as "Yes" or "No"
                dob: user.dob,
                currentWeight: user.currentWeight,
                goalWeight: user.goalWeight,
                height: user.height,
                posts: user.posts || [],
                followers: user.followers || [],
                following: user.following || [],
                age: user.age || null
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // Get the logged-in user's profile (Authenticated)
    getMyProfile: async (req, res) => {
        try {
            // Extract the JWT token from the Authorization header
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify the token and extract the userId from it
            const decoded = jwt.verify(token, secretKey);
            const userId = decoded._id;

            // Find the user by the extracted userId
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Return the logged-in user's profile data formatted like in the provided image
            return res.status(200).json({
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                phone: user.phone,
                email: user.email,
                isVerified: user.isVerified,
                isAthlete: user.isAthlete ? 'Yes' : 'No',
                dob: user.dob,
                currentWeight: user.currentWeight,
                goalWeight: user.goalWeight,
                height: user.height,
                posts: user.posts || [],
                followers: user.followers || [],
                following: user.following || [],
                age: user.age || null
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // Search for users by name (case-insensitive, partial matching)
    searchUsers: async (req, res) => {
        try {
            const { name } = req.query;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name query parameter is required'
                });
            }

            // Case-insensitive regex to match any part of fullname or username
            const regex = new RegExp(name, 'i'); // 'i' flag makes it case-insensitive
            const users = await User.find({
                $or: [
                    { fullname: { $regex: regex } },
                    { username: { $regex: regex } }
                ]
            }).select('fullname username email profileImage'); // Adjust fields to return relevant data

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No users found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Users fetched successfully',
                users
            });
        } catch (error) {
            console.error("Error searching users:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users',
                error: error.message
            });
        }
    }
}

module.exports = userController;
