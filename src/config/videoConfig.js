const multer = require('multer');
const path = require('path');

// < ========== Using multer for videoUploading videos ========== >
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to only accept video files
const fileFilter = (req, file, cb) => {
    // Check if the videoUploaded file is a video
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Not a video! Please videoUpload a video.'), false);
    }
};

// upload videos destination with file filter
const videoUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = videoUpload;
