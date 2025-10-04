const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: Map,
    of: String,
  },
  correctAnswers: [{
    type: String,
  }],
  explanation: {
    type: String,
  },
  discussion: {
    type: String,
  },
  exam: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topics: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Question', questionSchema);