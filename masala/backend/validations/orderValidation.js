/**
 * Order Validation Schemas
 */

const { body } = require('express-validator');

const createOrderValidation = [
    body('items')
        .isArray({ min: 1 }).withMessage('Order must contain at least one item'),

    body('items.*.product')
        .notEmpty().withMessage('Product ID is required')
        .isMongoId().withMessage('Invalid product ID'),

    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

    body('shippingAddress.name')
        .trim()
        .notEmpty().withMessage('Name is required'),

    body('shippingAddress.phone')
        .trim()
        .notEmpty().withMessage('Phone is required'),

    body('shippingAddress.email')
        .trim()
        .isEmail().withMessage('Valid email is required'),

    body('shippingAddress.street')
        .trim()
        .notEmpty().withMessage('Street address is required'),

    body('shippingAddress.city')
        .trim()
        .notEmpty().withMessage('City is required'),

    body('shippingAddress.postalCode')
        .trim()
        .notEmpty().withMessage('Postal code is required')
];

module.exports = {
    createOrderValidation
};
