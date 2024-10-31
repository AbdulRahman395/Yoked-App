const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: '916045238748-ioe54blmnragdbecbjts89qn4fbq03mf.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create user in the database
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({ googleId: profile.id, displayName: profile.displayName });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
