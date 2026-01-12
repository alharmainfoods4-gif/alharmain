/**
 * Product Routes
 * Admin create/update/delete, public read, authenticated reviews
 */

const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    addReview
} = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const {
    createProductValidation,
    updateProductValidation,
    addReviewValidation
} = require('../validations/product.validation');

// Public routes
router.get('/', getProducts);
router.get('/admin/:id', authMiddleware, isAdmin, getProductById);
router.get('/:slug', getProduct);

// Authenticated routes
router.post('/:id/review', authMiddleware, addReviewValidation, addReview);

// Admin routes
router.post('/', authMiddleware, isAdmin, createProductValidation, createProduct);
router.put('/:id', authMiddleware, isAdmin, updateProductValidation, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;
