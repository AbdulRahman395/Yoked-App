const express = require('express');
const router = express();
const passport = require('passport');
require('../config/passport');

router.use(passport.initialize());
router.use(passport.session());

const userController = require('../controllers/authController');

router.get('/', userController.loadAuth);

// Auth
router.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));

// Auth Callback
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/success',
        failureRedirect: '/failure'
    })
);

// Success
router.get('/success', userController.successGoogleLogin);

// Failure
router.get('/failure', userController.failureGoogleLogin);

module.exports = router;
