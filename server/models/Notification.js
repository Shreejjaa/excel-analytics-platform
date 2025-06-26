const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // null for global
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['update', 'news', 'delete'], default: 'news' },
  read: { type: Boolean, default: false },
  link: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema); 