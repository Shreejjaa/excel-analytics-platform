const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Get notifications for user (or global)
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch global and user-specific notifications
    const notifications = await Notification.find({
      $or: [
        { user: null },
        { user: userId }
      ]
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: create a notification (global or user-specific)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, message, type, user, link } = req.body;
    const notification = new Notification({
      title,
      message,
      type,
      user: user || null,
      link
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Not found' });
    // Only allow user to mark their own or global notifications
    if (notification.user && notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 