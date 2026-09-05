const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Signs a new JSON Web Token.
 * @param {Object} payload - Object containing payload data (e.g. { id: user._id })
 * @returns {String} Signed JWT token string
 */
const signToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Verifies a JSON Web Token string.
 * @param {String} token - JWT token string
 * @returns {Object} Decoded payload object
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = {
  signToken,
  verifyToken,
};
