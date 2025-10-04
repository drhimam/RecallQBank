const Question = require('../models/Question');
const User = require('../models/User');

// Get all questions (with filters)
const getQuestions = async (req, res) => {
  try {
    const { exam, subject, status } = req.query;
    let query = {};

    if (exam) query.exam = exam;
    if (subject) query.subject = subject;
    if (status) query.status = status;

    const questions = await Question.find(query)
      .populate('submittedBy', 'username')
      .populate('reviewedBy', 'username')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('submittedBy', 'username')
      .populate('reviewedBy', 'username');

    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new question
const createQuestion = async (req, res) => {
  try {
    const {
      question,
      options,
      correctAnswers,
      explanation,
      discussion,
      exam,
      subject,
      topics,
      tags,
    } = req.body;

    const newQuestion = new Question({
      question,
      options,
      correctAnswers,
      explanation,
      discussion,
      exam,
      subject,
      topics,
      tags,
      submittedBy: req.user._id,
    });

    const savedQuestion = await newQuestion.save();

    // Update user contributions
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { contributions: 1, pending: 1 }
    });

    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update question
const updateQuestion = async (req, res) => {
  try {
    const {
      question,
      options,
      correctAnswers,
      explanation,
      discussion,
      exam,
      subject,
      topics,
      tags,
      status,
    } = req.body;

    const questionToUpdate = await Question.findById(req.params.id);

    if (!questionToUpdate) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is authorized to update
    if (questionToUpdate.submittedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'moderator' && 
        req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    questionToUpdate.question = question || questionToUpdate.question;
    questionToUpdate.options = options || questionToUpdate.options;
    questionToUpdate.correctAnswers = correctAnswers || questionToUpdate.correctAnswers;
    questionToUpdate.explanation = explanation || questionToUpdate.explanation;
    questionToUpdate.discussion = discussion || questionToUpdate.discussion;
    questionToUpdate.exam = exam || questionToUpdate.exam;
    questionToUpdate.subject = subject || questionToUpdate.subject;
    questionToUpdate.topics = topics || questionToUpdate.topics;
    questionToUpdate.tags = tags || questionToUpdate.tags;
    
    if (status && (req.user.role === 'moderator' || req.user.role === 'admin')) {
      questionToUpdate.status = status;
      questionToUpdate.reviewedBy = req.user._id;
      
      // Update user stats if status changed
      if (status === 'approved') {
        await User.findByIdAndUpdate(questionToUpdate.submittedBy, {
          $inc: { approved: 1, pending: -1 }
        });
      }
    }

    const updatedQuestion = await questionToUpdate.save();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is authorized to delete
    if (question.submittedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'moderator' && 
        req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await question.remove();
    res.json({ message: 'Question removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's questions
const getUserQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ submittedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getUserQuestions,
};