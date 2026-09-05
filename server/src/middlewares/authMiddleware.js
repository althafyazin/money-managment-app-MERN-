const User = require('../models/User');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

/**
 * Authentication Protection Middleware.
 * Verifies JWT token from HTTP Authorization header and attaches authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract Bearer token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Access denied. No authorization token provided.', 401));
    }

    // 2. Verify Token
    const decoded = verifyToken(token);

    // 3. Check if user still exists in database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4. Grant access by attaching user object to request
    req.user = currentUser;
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  protect,
};
