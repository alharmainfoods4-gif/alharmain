/**
 * Category Controller
 */

const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
    try {
        const { all } = req.query;
        const filter = all === 'true' ? {} : { isActive: true };
        const categories = await Category.find(filter).sort('name');

        successResponse(res, 200, 'Categories retrieved successfully', { categories });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/categories
 * @desc    Create category (Admin)
 * @access  Private/Admin
 */
exports.createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
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

        const category = await Category.create({ ...req.body, slug });

        successResponse(res, 201, 'Category created successfully', { category });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category (Admin)
 * @access  Private/Admin
 */
exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }

        successResponse(res, 200, 'Category updated successfully', { category });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category (Admin)
 * @access  Private/Admin
 */
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }

        successResponse(res, 200, 'Category deleted successfully');
    } catch (error) {
        next(error);
    }
};
