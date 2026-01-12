/**
 * Category Controller
 * CRUD operations for product categories
 */

const Category = require('../models/Category.model');
const { validationResult } = require('express-validator');

/**
 * @route   POST /api/categories
 * @desc    Create new category (Admin only)
 * @access  Private/Admin
 */
exports.createCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, image } = req.body;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Check if category name or slug already exists
        const existingCategory = await Category.findOne({
            $or: [{ name }, { slug }]
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: existingCategory.name === name
                    ? 'Category with this name already exists'
                    : `Slug conflict: "${slug}" is already used by category "${existingCategory.name}"`
            });
        }

        const category = await Category.create({ name, image, slug });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });

    } catch (error) {
        console.error('Create Category Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating category',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/categories
 * @desc    Get all active categories
 * @access  Public
 */
exports.getCategories = async (req, res) => {
    try {
        const { all } = req.query;
        const filter = all === 'true' ? {} : { isActive: true };

        const categories = await Category.find(filter)
            .select('-__v')
            .sort('name');

        res.json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching categories',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category
 * @access  Public
 */
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            category
        });

    } catch (error) {
        console.error('Get Category Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching category',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category (Admin only)
 * @access  Private/Admin
 */
exports.updateCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category updated successfully',
            category
        });

    } catch (error) {
        console.error('Update Category Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating category',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/categories/:id
 * @desc    Soft delete category (Admin only)
 * @access  Private/Admin
 */
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.error('Delete Category Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting category',
            error: error.message
        });
    }
};
