/**
 * CMS Routes
 */

const express = require('express');
const router = express.Router();
const {
    getContent,
    updateContent,
    submitContactForm
} = require('../controllers/cms.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// Public routes
router.get('/content/:slug', getContent);
router.post('/contact', submitContactForm);

// Admin routes
router.put('/content/:slug', authMiddleware, isAdmin, updateContent);

module.exports = router;
