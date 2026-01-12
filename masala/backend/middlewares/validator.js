/**
 * Input Validation Middleware
 * Uses express-validator
 */

const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseFormatter');

/**
 * Validate request
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }));

        return errorResponse(res, 400, 'Validation failed', extractedErrors);
    }

    next();
};

module.exports = { validate };
