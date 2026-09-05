const authService = require('../services/authService');
const { sendSuccess } = require('../utils/response');

/**
 * Register User Controller
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, currency } = req.body;
    const result = await authService.registerUser({ name, email, password, currency });
    return sendSuccess(res, 201, 'User account registered successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Login User Controller
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return sendSuccess(res, 200, 'Authentication successful', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Authenticated User Profile Controller
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user._id);
    return sendSuccess(res, 200, 'User profile fetched successfully', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
