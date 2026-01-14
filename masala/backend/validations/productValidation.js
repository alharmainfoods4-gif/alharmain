/**
 * Product Validation Schemas
 */

const { body } = require('express-validator');

const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category ID'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required'),

    // Accept either price or basePrice (both optional with default 0)
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('basePrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('Base price must be a positive number'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a positive number')
];

const reviewValidation = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

    body('comment')
        .trim()
        .notEmpty().withMessage('Comment is required')
        .isLength({ min: 10 }).withMessage('Comment must be at least 10 characters')
];

module.exports = {
    createProductValidation,
    reviewValidation
};
