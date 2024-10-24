// const session = require('express-session');
// const passport = require('passport');       // Import passport
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// // Session setup
// app.use(session({
//     secret: 'secretkey',
//     resave: false,
//     saveUninitialized: true,
// }));

// // Initialize passport and session
// app.use(passport.initialize());
// app.use(passport.session());

// // Passport configuration
// passport.use(new GoogleStrategy({
//     clientID: '916045238748-ioe54blmnragdbecbjts89qn4fbq03mf.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: 'http://localhost:5000/auth/google/callback'
// }, (accessToken, refreshToken, profile, done) => {
//     // In a real app, you would save the user profile to the database
//     return done(null, profile);
// }));

// // Serialize and deserialize user
// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });

// module.exports = passport;