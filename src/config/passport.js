// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const path = require('path');
const User = require('../models/User');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize by user ID
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Find the user by ID
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: '515683825187-meii5tj1i0g8kvdphiebuldc7g959c97.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true
},
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            // Check if a user with this Google ID already exists
            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                // If user does not exist, create a new one
                user = new User({
                    googleId: profile.id,
                    fullname: profile.displayName,
                    email: profile.emails[0].value,
                    profileImage: profile.photos[0].value,
                    phone: "0", // Default values for fields required by schema
                    username: `user_${profile.id}`,
                    password: "N/A", // Placeholder password since Google login doesn't require one
                    dob: new Date(), // Placeholder date; customize if needed
                    currentWeight: 0,
                    goalWeight: 0,
                    height: 0,
                    isVerified: true
                });
                await user.save();
            }

            // Pass the user to the done callback
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
