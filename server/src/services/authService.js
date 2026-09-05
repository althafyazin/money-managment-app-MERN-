const User = require('../models/User');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

class AuthService {
  /**
   * Registers a new user account.
   * @param {Object} userData - { name, email, password, currency }
   * @returns {Object} Created user object and JWT token
   */
  async registerUser({ name, email, password, currency }) {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    // 2. Create new user record
    const user = await User.create({
      name,
      email,
      password,
      currency: currency || 'USD',
    });

    // 3. Generate JWT Token
    const token = signToken({ id: user._id });

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Authenticates user login credentials.
   * @param {Object} credentials - { email, password }
   * @returns {Object} User profile object and JWT token
   */
  async loginUser({ email, password }) {
    // 1. Check if email & password are provided
    if (!email || !password) {
      throw new AppError('Please provide both email and password.', 400);
    }

    // 2. Find user by email and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    // 3. Verify password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    // 4. Generate JWT Token
    const token = signToken({ id: user._id });

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Fetches user profile by ID.
   * @param {String} userId - User Mongo ObjectId
   * @returns {Object} User profile object
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User profile not found.', 404);
    }
    return user.toJSON();
  }
}

module.exports = new AuthService();
