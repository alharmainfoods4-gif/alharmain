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
} = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// Public route
router.get('/track/:orderNumber', trackOrder);

// Protected routes
router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrder);

// Admin routes
router.get('/admin/all', authMiddleware, isAdmin, getAllOrders);
router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
