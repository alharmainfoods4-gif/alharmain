/**
 * Product Validation
 * Input validation for product operations
 */

const { body } = require('express-validator');

const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category ID'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

    body('basePrice')
        .notEmpty().withMessage('Base price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('images')
        .isArray({ min: 1 }).withMessage('At least one image is required'),

    body('images.*')
        .isURL().withMessage('Each image must be a valid URL'),

    body('variants')
        .optional()
        .isArray().withMessage('Variants must be an array'),

    body('badges')
        .optional()
        .isArray().withMessage('Badges must be an array')
];

const updateProductValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('category')
        .optional()
        .isMongoId().withMessage('Invalid category ID'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

    body('basePrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('images')
        .optional()
        .isArray({ min: 1 }).withMessage('At least one image required'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock cannot be negative'),

    body('isFeatured')
        .optional()
        .isBoolean().withMessage('isFeatured must be a boolean'),

    body('variants')
        .optional()
        .isArray().withMessage('Variants must be an array'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean')
];

const addReviewValidation = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

    body('comment')
        .trim()
        .notEmpty().withMessage('Comment is required')
        .isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters')
];

module.exports = {
    createProductValidation,
    updateProductValidation,
    addReviewValidation
};
