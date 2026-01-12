/**
 * Authentication Controller
 * Handles user registration, login, password reset
 */

const crypto = require('crypto');
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        // Send welcome email (background)
        sendWelcomeEmail(user).catch(err => console.error(err));

        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        successResponse(res, 200, 'Profile retrieved successfully', { user });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            shippingAddress: req.body.shippingAddress,
            billingAddress: req.body.billingAddress
        };

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        );

        successResponse(res, 200, 'Profile updated successfully', { user });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return errorResponse(res, 404, 'No user found with that email');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await sendPasswordResetEmail(user, resetUrl);
            successResponse(res, 200, 'Password reset email sent');
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return errorResponse(res, 500, 'Email could not be sent');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return errorResponse(res, 400, 'Invalid or expired reset token');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        successResponse(res, 200, 'Password reset successful');
    } catch (error) {
        next(error);
    }
};
