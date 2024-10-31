const ContactUs = require('../models/Contact');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const contactUsController = {
    sendContactMessage: async (req, res) => {
        try {
            const { fullName, email, message } = req.body;

            // Save the message to the database
            const contactMessage = new ContactUs({ fullName, email, message });
            await contactMessage.save();

            // Configure mail options to send from user email to your fixed email
            const mailOptions = {
                from: email,
                to: process.env.EMAIL_USER,
                subject: 'New Contact Us Message',
                text: `You have received a new message from ${fullName} (${email}):\n\n${message}`
            };

            // Send the email
            await transporter.sendMail(mailOptions);

            res.status(200).json({
                success: true,
                message: 'Message sent and saved successfully!'
            });
        } catch (error) {
            console.error("Error sending contact message:", error);
            res.status(500).json({
                success: false,
                message: 'Failed to send and save message',
                error: error.message
            });
        }
    }
};

module.exports = contactUsController;
