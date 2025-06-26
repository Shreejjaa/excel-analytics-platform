const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email but different auth provider
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Update existing user with Google ID
      user.googleId = profile.id;
      user.authProvider = 'google';
      user.profilePicture = profile.photos[0]?.value;
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    const newUser = new User({
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      profilePicture: profile.photos[0]?.value,
      authProvider: 'google'
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport; 