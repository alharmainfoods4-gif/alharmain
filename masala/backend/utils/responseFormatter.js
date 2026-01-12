/**
 * API Response Formatter
 * Standardized response structure
 */

/**
 * Success response
 */
const successResponse = (res, statusCode, message, data = null) => {
    const response = {
        status: 'success',
        message
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Error response
 */
const errorResponse = (res, statusCode, message, errors = null) => {
    const response = {
        status: 'error',
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

/**
 * Paginated response
 */
const paginatedResponse = (res, statusCode, data, page, limit, total) => {
    return res.status(statusCode).json({
        status: 'success',
        data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse
};
