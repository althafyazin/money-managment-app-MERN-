const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user account
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & get JWT token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current logged in user profile
 * @access  Private (Protected)
 */
router.get('/me', protect, getMe);

module.exports = router;
