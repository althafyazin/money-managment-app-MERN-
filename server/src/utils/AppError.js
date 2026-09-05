/**
 * Custom Operational Error Class for handling application-specific exceptions.
 */
class AppError extends Error {
  /**
   * @param {String} message - Error description
   * @param {Number} statusCode - HTTP Status Code (4xx / 5xx)
   * @param {Array} errors - Optional detailed error items (e.g. form validation errors)
   */
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
