const passport = require('passport');

exports.loginWithGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/profile'
});

exports.logout = (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect('/');
    });
};

exports.getProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('profile', { user: req.user });
};
