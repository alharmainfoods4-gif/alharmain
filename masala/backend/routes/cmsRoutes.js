/**
 * CMS Routes
 */

const express = require('express');
const router = express.Router();
const {
    getContent,
    updateContent,
    submitContactForm,
    chatbot
} = require('../controllers/cmsController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');

// Public routes
router.get('/content/:slug', getContent);
router.post('/contact', submitContactForm);
router.post('/chatbot', chatbot);

// Admin routes
router.put('/content/:slug', protect, authorize('admin'), updateContent);

module.exports = router;
