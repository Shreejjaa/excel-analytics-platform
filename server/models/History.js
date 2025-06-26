const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String, default: 'analyze' },
  details: { type: String, default: '' },
  analysis: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);
