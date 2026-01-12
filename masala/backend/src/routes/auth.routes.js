/**
 * Auth Routes
 * Authentication endpoints
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../validations/auth.validation');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, login);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
const authMiddleware = require('../middlewares/auth.middleware');
router.put('/profile', authMiddleware, require('../controllers/auth.controller').updateProfile);

/**
 * @route   PUT /api/auth/update-password
 * @desc    Update password
 * @access  Private
 */
router.put('/update-password', authMiddleware, require('../controllers/auth.controller').updatePassword);

module.exports = router;

