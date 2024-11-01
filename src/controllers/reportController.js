const Report = require('../models/Report');

const reportController = {
    // Existing reportPost method
    reportPost: async (req, res) => {
        try {
            const userId = req.user._id;
            const { postId, reason } = req.body;

            if (!postId || !reason) {
                return res.status(400).json({ message: 'Post ID and reason are required.' });
            }

            const newReport = new Report({
                userId,
                postId,
                reason
            });

            await newReport.save();
            res.status(201).json({ message: 'Report submitted successfully.', report: newReport });
        } catch (error) {
            console.error('Error reporting post:', error);
            res.status(500).json({ message: 'An error occurred while reporting the post.' });
        }
    },

    // New getReportsByPost method
    getReportsByPost: async (req, res) => {
        try {
            const { postId } = req.params;

            const reports = await Report.find({ postId })
                .populate('userId', 'fullname email') // Populate user details if needed
                .populate('postId', 'title content'); // Populate post details if needed

            res.status(200).json({ message: `Reports for post ${postId} fetched successfully.`, reports });
        } catch (error) {
            console.error('Error fetching reports for post:', error);
            res.status(500).json({ message: 'An error occurred while fetching reports for the post.' });
        }
    }
};

module.exports = reportController;
