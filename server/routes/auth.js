const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      email, 
      password: hashed,
      authProvider: 'local'
    });
    await newUser.save();

    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error. Try again." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    // Check if user is a Google OAuth user
    if (user.authProvider === 'google') {
      return res.status(400).json({ message: "Please use Google login for this account" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "shreejaSecretKey");
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Try again." });
  }
});

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect to frontend with token
    const token = jwt.sign({ id: req.user._id }, "shreejaSecretKey");
    const userData = {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      profilePicture: req.user.profilePicture
    };
    
    // Redirect to frontend with token and user data
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth-success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    res.redirect(redirectUrl);
  }
);

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
