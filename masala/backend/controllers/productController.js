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

        paginatedResponse(res, 200, products, page, limit, total);
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
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        product.updateRating();

        try {
            await product.save();
            console.log(`Review added successfully for product ${product._id} by user ${req.user._id}`);
            successResponse(res, 201, 'Review added successfully', { product });
        } catch (saveError) {
            console.error('Error saving review to product:', saveError);
            return errorResponse(res, 500, 'Failed to save review to database', saveError.message);
        }
    } catch (error) {
        next(error);
    }
};
