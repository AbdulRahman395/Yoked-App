const express = require('express');
const router = express.Router();
const contactUsController = require('../controllers/contactController');

// Route to handle contact us form submission
router.post('/contact-us', contactUsController.sendContactMessage);

module.exports = router;
