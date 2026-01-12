/**
 * Role-Based Access Control Middleware
 * Restricts access based on user roles
 */

const { errorResponse } = require('../utils/responseFormatter');

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 401, 'Not authorized');
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(
                res,
                403,
                `User role '${req.user.role}' is not authorized to access this route`
            );
        }

        next();
    };
};

module.exports = { authorize };
