const expressAsyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const generateOTP = require('./otpService');
dotenv.config();

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

const sendEmail = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    const otp = generateOTP();

    var mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "OTP from Abdul Rahman",
        text: `Your OTP is ${otp}, kindly use within the next 60 seconds`
    }

    transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
            return res.status(500).send('Error sending email');
        }
        res.send('Email sent successfully');
    })
    
});

module.exports = { sendEmail };