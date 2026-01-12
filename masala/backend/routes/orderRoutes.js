/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getOrder,
    trackOrder,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');
const { validate } = require('../middlewares/validator');
const { createOrderValidation } = require('../validations/orderValidation');

// Public route
router.get('/track/:orderNumber', trackOrder);

// Protected routes
router.post('/', protect, createOrderValidation, validate, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
