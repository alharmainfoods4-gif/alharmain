/**
 * Product Routes
 */

const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview,
    deleteReview,
    updateReview
} = require('../controllers/productController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');
const { validate } = require('../middlewares/validator');
const { createProductValidation, reviewValidation } = require('../validations/productValidation');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/:id/review', protect, reviewValidation, validate, addReview);

// Admin routes
router.post('/', protect, authorize('admin'), createProductValidation, validate, createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

// Review Management (Admin)
router.delete('/:id/reviews/:reviewId', protect, authorize('admin'), deleteReview);
router.put('/:id/reviews/:reviewId', protect, authorize('admin'), updateReview);

module.exports = router;
