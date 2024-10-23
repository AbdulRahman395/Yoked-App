const express = require('express');
const app = express();
app.use(express.json());
const session = require('express-session');
const passport = require('passport');       // Import passport
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('./config/databaseConfig');

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/athletes', require('./routes/athleteRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/follows', require('./routes/followRoutes'));

// Session setup
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: '916045238748-ioe54blmnragdbecbjts89qn4fbq03mf.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // In a real app, you would save the user profile to the database
    return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google OAuth routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    });

// Profile route - secured route
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send(`Hello ${req.user.displayName}`);
});

// Home route
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Login with Google</a>');
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
