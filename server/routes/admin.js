const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Get all users (admin only)
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// (Optional) Delete a user
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

router.get('/dashboard', verifyToken, adminOnly, (req, res) => { /* ... */ });

module.exports = router;
