/**
 * Token Utility
 * Helper functions for JWT token operations
 */

const { generateToken, verifyToken } = require('../config/jwt');

/**
 * Create and send token response
 */
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

module.exports = {
    sendTokenResponse,
    generateToken,
    verifyToken
};
