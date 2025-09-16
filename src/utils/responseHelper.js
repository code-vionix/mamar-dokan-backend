// src/utils/responseHelper.js

/**
 * Create a standardized API response
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {any} data - Response data (optional)
 * @param {any} errors - Error details (optional)
 * @returns {object} Standardized response object
 */
export const createResponse = (
  success,
  message,
  data = null,
  errors = null
) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) response.data = data;
  if (errors !== null) response.errors = errors;

  return response;
};

/**
 * Create a paginated response
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {any} data - Response data
 * @param {object} pagination - Pagination info
 * @returns {object} Paginated response object
 */
export const createPaginatedResponse = (success, message, data, pagination) => {
  return {
    success,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  };
};
