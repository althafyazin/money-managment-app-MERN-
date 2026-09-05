/**
 * Formats and sends a standardized success HTTP JSON response.
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (Default: 200)
 * @param {String} message - Human-readable success message
 * @param {Object|Array} data - Payload data
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const responsePayload = {
    success: true,
    message,
  };

  if (data !== null) {
    responsePayload.data = data;
  }

  return res.status(statusCode).json(responsePayload);
};

/**
 * Formats and sends a standardized error HTTP JSON response.
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (Default: 500)
 * @param {String} message - Error description message
 * @param {Array|null} errors - Array of validation or detailed error strings
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const responsePayload = {
    success: false,
    message,
  };

  if (errors) {
    responsePayload.errors = errors;
  }

  return res.status(statusCode).json(responsePayload);
};

module.exports = {
  sendSuccess,
  sendError,
};
