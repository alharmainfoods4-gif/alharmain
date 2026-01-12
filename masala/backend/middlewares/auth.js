/**
 * JWT Authentication Middleware
 * Verifies and decodes JWT token
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseFormatter');

/**
 * Protect routes - Verify JWT token
 */
const protect = async (req, res, next) => {
    let token;

    // Check for Bearer token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return errorResponse(res, 401, 'Not authorized, no token provided');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return errorResponse(res, 401, 'User not found');
        }

        if (!req.user.isActive) {
            return errorResponse(res, 401, 'User account is deactivated');
        }

        next();
    } catch (error) {
        return errorResponse(res, 401, 'Not authorized, token failed');
    }
};

module.exports = { protect };
