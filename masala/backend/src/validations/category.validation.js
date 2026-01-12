/**
 * Category Validation
 * Input validation for category operations
 */

const { body } = require('express-validator');

const createCategoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('image')
        .trim()
        .notEmpty().withMessage('Category image URL is required')
        .isURL().withMessage('Please provide a valid image URL')
];

const updateCategoryValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('image')
        .optional()
        .trim()
        .isURL().withMessage('Please provide a valid image URL'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean')
];

module.exports = {
    createCategoryValidation,
    updateCategoryValidation
};
