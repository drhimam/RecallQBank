const express = require('express');
const router = express.Router();
const {
  getUserContributions,
  getModeratorDashboard,
} = require('../controllers/userController');
const { protect, moderator } = require('../middleware/authMiddleware');

router.route('/contributions/:id')
  .get(getUserContributions);

router.route('/moderator/dashboard')
  .get(protect, moderator, getModeratorDashboard);

module.exports = router;