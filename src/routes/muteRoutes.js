const express = require('express');
const muteController = require('../controllers/muteController');
const router = express.Router();

// Mute routes
router.post('/mute', muteController.muteUser);
router.post('/unmute', muteController.unmuteUser);
router.get('/muted-users', muteController.getMyMutedUsers);

module.exports = router;
