// const passport = require('passport');
// const express = require('express');
// const router = express.Router();

// // Google OAuth routes
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//         res.redirect('/profile');
//     });

// // Profile route - secured route
// router.get('/profile', (req, res) => {
//     if (!req.isAuthenticated()) {
//         return res.redirect('/');
//     }
//     res.send(`Hello ${req.user.displayName}`);
// });

// // Home route
// router.get('/', (req, res) => {
//     res.send('<a href="/auth/google">Login with Google</a>');
// });

// module.exports = router;