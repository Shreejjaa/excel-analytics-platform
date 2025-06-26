const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { verifyToken, isAdmin, adminOnly } = require("../middleware/authMiddleware");
=======
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
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

<<<<<<< HEAD
router.get('/dashboard', verifyToken, adminOnly, (req, res) => { /* ... */ });

=======
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
module.exports = router;
