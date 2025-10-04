const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getUserQuestions,
} = require('../controllers/questionController');
const { protect, moderator } = require('../middleware/authMiddleware');

router.route('/')
  .get(getQuestions)
  .post(protect, createQuestion);

router.route('/my-questions')
  .get(protect, getUserQuestions);

router.route('/:id')
  .get(getQuestionById)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

module.exports = router;