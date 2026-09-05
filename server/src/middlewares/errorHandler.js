const { sendError } = require('../utils/response');
const config = require('../config/env');

/**
 * Global Express Error Handling Middleware.
 * Catches all operational errors, Mongoose validation errors, and uncaught syntax exceptions.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for field: ${field}. Please use another value.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Failed';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Handle JWT Invalid Token
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authorization token. Access denied.';
  }

  // Handle JWT Token Expired
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authorization token has expired. Please log in again.';
  }

  // Log non-operational server errors in development
  if (config.nodeEnv === 'development' && statusCode === 500) {
    console.error('[UNHANDLED EXCEPTION STACK]:', err.stack);
  }

  return sendError(res, statusCode, message, errors);
};

module.exports = errorHandler;
