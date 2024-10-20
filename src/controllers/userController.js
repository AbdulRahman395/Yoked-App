const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
            isAthlete
        } = req.body;

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: "User already exists" });
            }

            // Generate hashed password and OTP
            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = generateOTP();

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
                otp,
                otpExpire: Date.now() + 300000,
                isVerified: false
            });

            // Send OTP to user's email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify Your Account - OTP',
                html: `<p>Dear ${fullname},</p>
                        <p>Here is your One-Time Password (OTP) to verify your account:</p>
                        <p><b>${otp}</b></p>
                        <p>This OTP is valid for 5 minutes.</p>`
            };

            await transporter.sendMail(mailOptions);

            return res.status(201).json({ message: "User registered. Please verify your email by entering the OTP sent to your email." });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
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
    }
}

module.exports = userController;
