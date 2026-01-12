/**
 * Category Routes
 * Admin-only create/update/delete, public read
 */

const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const {
    createCategoryValidation,
    updateCategoryValidation
} = require('../validations/category.validation');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes
router.post('/', authMiddleware, isAdmin, createCategoryValidation, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategoryValidation, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

module.exports = router;
