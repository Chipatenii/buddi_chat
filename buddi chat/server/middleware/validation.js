const Joi = require('joi');
const { logger } = require('../utils/logger');

/**
 * Joi validation middleware
 */
const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/['"]/g, ''),
    }));

    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors,
    });
  }

  // Replace req.body with validated value
  req.body = value;
  next();
};

/**
 * Validate URL parameters
 */
const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      param: detail.path.join('.'),
      message: detail.message.replace(/['"]/g, ''),
    }));

    return res.status(400).json({
      code: 'INVALID_PARAMS',
      message: 'Invalid URL parameters',
      errors,
    });
  }

  req.params = value;
  next();
};

/**
 * Validate query parameters
 */
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    allowUnknown: false,
    convert: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      param: detail.path.join('.'),
      message: detail.message.replace(/['"]/g, ''),
    }));

    return res.status(400).json({
      code: 'INVALID_QUERY',
      message: 'Invalid query parameters',
      errors,
    });
  }

  req.query = value;
  next();
};

/**
 * Joi error handler middleware
 */
const joiErrorHandler = (err, req, res, next) => {
  if (err && err instanceof Joi.ValidationError) {
    const errors = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/['"]/g, ''),
      type: detail.type,
    }));

    logger.warn('Validation error:', {
      path: req.path,
      method: req.method,
      errors,
    });

    return res.status(422).json({
      code: 'VALIDATION_FAILED',
      message: 'Request validation failed',
      errors,
    });
  }
  next(err);
};

module.exports = {
  validateRequest,
  validateParams,
  validateQuery,
  joiErrorHandler,
};