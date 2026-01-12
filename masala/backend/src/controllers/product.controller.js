/**
 * Product Controller
 * CRUD operations and review management for products
 */

const Product = require('../models/Product.model');
const { validationResult } = require('express-validator');

/**
 * @route   POST /api/products
 * @desc    Create new product (Admin only)
 * @access  Private/Admin
 */
exports.createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });

    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating product',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/products
 * @desc    Get all products with filters
 * @access  Public
 */
exports.getProducts = async (req, res) => {
    try {
        const { category, badge, minPrice, maxPrice, isGiftBox, page = 1, limit = 12 } = req.query;

        // Build query
        const query = { isActive: true };

        // Default to not showing gift boxes in common lists
        if (isGiftBox === 'true') {
            query.isGiftBox = true;
        } else {
            // Include products where isGiftBox is false OR doesn't exist (legacy data)
            query.isGiftBox = { $ne: true };
        }

        if (category) query.category = category;
        if (badge) query.badges = badge;
        if (minPrice || maxPrice) {
            query.basePrice = {};
            if (minPrice) query.basePrice.$gte = Number(minPrice);
            if (maxPrice) query.basePrice.$lte = Number(maxPrice);
        }

        const skip = (page - 1) * limit;

        const productsQuery = Product.find(query)
            .populate('category', 'name slug')
            .sort('-createdAt')
            .limit(Number(limit))
            .skip(skip);

        // Only exclude reviews if not explicitly requested
        if (req.query.includeReviews !== 'true') {
            productsQuery.select('-reviews');
        }

        const products = await productsQuery;

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            count: products.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            products
        });

    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/products/:slug
 * @desc    Get single product by slug
 * @access  Public
 */
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug, isActive: true })
            .populate('category', 'name slug')
            .populate('reviews.user', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product
        });

    } catch (error) {
        console.error('Get Product Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching product',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/products/admin/:id
 * @desc    Get single product by ID (Admin only)
 * @access  Private/Admin
 */
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('reviews.user', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product
        });

    } catch (error) {
        console.error('Get Product By ID Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching product',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (Admin only)
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating product',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Soft delete product (Admin only)
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting product',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Add product review
 * @access  Private (Authenticated users)
 */
exports.addReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = {
            user: req.user._id,
            userName: req.user.name,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        product.updateRating();

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review
        });

    } catch (error) {
        console.error('Add Review Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding review',
            error: error.message
        });
    }
};
