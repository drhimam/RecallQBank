const User = require('../models/User');
const Question = require('../models/Question');

// Get user contributions
const getUserContributions = async (req, res) => {
  try {
    const questions = await Question.find({ submittedBy: req.params.id })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get moderator dashboard data
const getModeratorDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const pendingCount = await Question.countDocuments({ status: 'pending' });
    const approvedCount = await Question.countDocuments({ status: 'approved' });
    const rejectedCount = await Question.countDocuments({ status: 'rejected' });
    
    const recentPending = await Question.find({ status: 'pending' })
      .populate('submittedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      pendingCount,
      approvedCount,
      rejectedCount,
      recentPending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserContributions,
  getModeratorDashboard,
};