const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for Google OAuth users
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
  profilePicture: { type: String }, // Google profile picture
  role: { type: String, enum: ["user", "admin"], default: "user" },
  authProvider: { type: String, enum: ["local", "google"], default: "local" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
