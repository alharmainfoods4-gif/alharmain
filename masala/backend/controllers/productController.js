/**
 * Product Controller
 * Handles product CRUD, filtering, reviews
 */

const Product = require('../models/Product');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, sorting, pagination
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build query
        let query = { isActive: true };

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Search by name
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }

        // Filter by price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseInt(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = parseInt(req.query.maxPrice);
        }

        // Featured products
        if (req.query.featured === 'true') {
            query.isFeatured = true;
        }

        // Filter by isGiftBox
        if (req.query.isGiftBox !== undefined) {
            query.isGiftBox = req.query.isGiftBox === 'true';
        }

        // Sort
        let sort = {};
        if (req.query.sort) {
            const sortField = req.query.sort;
            sort[sortField] = req.query.order === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1; // Default: newest first
        }

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sort)
            .limit(limit)
            .skip(skip);

        console.log(`[getProducts] Fetched ${products.length} products`);
        if (products.length > 0) {
            const productsWithReviews = products.filter(p => p.reviews && p.reviews.length > 0);
            console.log(`[getProducts] Products with reviews: ${productsWithReviews.length}`);
            if (productsWithReviews.length > 0) {
                console.log(`[getProducts] First product reviews:`, JSON.stringify(productsWithReviews[0].reviews, null, 2));
            }
        }

        const total = await Product.countDocuments(query);

        paginatedResponse(res, 200, { products }, page, limit, total);
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Public
 */
exports.getProduct = async (req, res, next) => {
    try {
        let product;
        const id = req.params.id;

        // Check if id is a valid mongoose ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id)
                .populate('category', 'name slug')
                .populate('reviews.user', 'name');
        } else {
            // If not ObjectId, try finding by slug
            product = await Product.findOne({ slug: id })
                .populate('category', 'name slug')
                .populate('reviews.user', 'name');
        }

        if (!product) {
            return errorResponse(res, 404, 'Product not found');
        }

        successResponse(res, 200, 'Product retrieved successfully', { product });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/products
 * @desc    Create product (Admin only)
 * @access  Private/Admin
 */
const Category = require('../models/Category');

exports.createProduct = async (req, res, next) => {
    try {
        console.log('[createProduct] Incoming Request Body:', JSON.stringify(req.body, null, 2));

        // Force removal of slug to ensure auto-generation works
        delete req.body.slug;

        // Auto-detect Gift Box based on Referer (Admin Panel Context)
        const referer = req.get('Referer') || '';
        if (referer.includes('/gift-boxes') || referer.includes('gift-box')) {
            console.log('[createProduct] Detected Gift Box page via Referer. Setting isGiftBox = true');
            req.body.isGiftBox = true;
        }

        const product = await Product.create(req.body);

        successResponse(res, 201, 'Product created successfully', { product });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (Admin only)
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return errorResponse(res, 404, 'Product not found');
        }

        successResponse(res, 200, 'Product updated successfully', { product });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (Admin only)
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return errorResponse(res, 404, 'Product not found');
        }

        successResponse(res, 200, 'Product deleted successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/products/:id/review
 * @desc    Add product review
 * @access  Private
 */
exports.addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return errorResponse(res, 404, 'Product not found');
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            r => r.user.toString() === req.user.id.toString()
        );

        if (alreadyReviewed) {
            return errorResponse(res, 400, 'Product already reviewed');
        }

        const review = {
            user: req.user.id,
            name: req.user.name || 'Anonymous',
            rating: Number(rating),
            comment
        };

        // Calculate new rating manually to avoid saving the whole document
        const newReviews = [...product.reviews, review];
        const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
        const newRating = (totalRating / newReviews.length).toFixed(1);
        const newNumReviews = newReviews.length;

        // Use findOneAndUpdate to bypass validation on other fields (like variants)
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $push: { reviews: review },
                $set: {
                    rating: newRating,
                    numReviews: newNumReviews
                }
            },
            { new: true, runValidators: false } // Important: runValidators: false
        );

        console.log(`Review added successfully for product ${updatedProduct._id} by user ${req.user._id}`);
        successResponse(res, 201, 'Review added successfully', { product: updatedProduct });

    } catch (error) {
        console.error('Error adding review:', error);
        next(error);
    }
};

/**
 * @route   DELETE /api/products/:id/reviews/:reviewId
 * @desc    Delete review (Admin only)
 * @access  Private/Admin
 */
exports.deleteReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;

        // 1. Remove Review using $pull (bypasses validation)
        const productAfterPull = await Product.findByIdAndUpdate(
            id,
            { $pull: { reviews: { _id: reviewId } } },
            { new: true }
        );

        if (!productAfterPull) {
            return errorResponse(res, 404, 'Product not found');
        }

        // 2. Recalculate Rating
        const reviews = productAfterPull.reviews;
        let rating = 0;
        let numReviews = 0;

        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            rating = (totalRating / reviews.length).toFixed(1);
            numReviews = reviews.length;
        }

        // 3. Update Rating (bypasses validation)
        await Product.findByIdAndUpdate(
            id,
            { $set: { rating, numReviews } },
            { new: true, runValidators: false }
        );

        successResponse(res, 200, 'Review deleted successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/products/:id/reviews/:reviewId
 * @desc    Update review (Admin only)
 * @access  Private/Admin
 */
exports.updateReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const { rating, comment, name } = req.body; // Allow name update too

        // 1. Update specific review fields using array filters (bypasses validation)
        const updateFields = {};
        if (rating) updateFields['reviews.$.rating'] = Number(rating);
        if (comment) updateFields['reviews.$.comment'] = comment;
        if (name) updateFields['reviews.$.name'] = name;

        const productAfterUpdate = await Product.findOneAndUpdate(
            { _id: id, "reviews._id": reviewId },
            { $set: updateFields },
            { new: true }
        );

        if (!productAfterUpdate) {
            return errorResponse(res, 404, 'Product or review not found');
        }

        // 2. Recalculate Rating (if rating changed)
        if (rating) {
            const reviews = productAfterUpdate.reviews;
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            const newRating = (totalRating / reviews.length).toFixed(1);

            await Product.findByIdAndUpdate(
                id,
                { $set: { rating: newRating } },
                { new: true, runValidators: false }
            );
        }

        successResponse(res, 200, 'Review updated successfully');
    } catch (error) {
        next(error);
    }
};
