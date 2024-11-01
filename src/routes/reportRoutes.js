const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to handle contact us form submission
router.post('/report-post', authMiddleware, reportController.reportPost);

// Route to see reports of a post
router.get('/get-reports/:postId', reportController.getReportsByPost);

module.exports = router;