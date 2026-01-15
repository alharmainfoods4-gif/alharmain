/**
 * Order Controller
 * Handles order creation, tracking, and management
 */

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { calculateOrderTotal, validateCartPrices } = require('../services/priceService');
const { sendOrderConfirmationEmail, sendOrderStatusEmail } = require('../services/emailService');

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, paymentMethod, notes, isGiftBox } = req.body;

        console.log('--- Order Creation Diagnostics ---');
        console.log('User ID:', req.user.id);
        console.log('Items:', JSON.stringify(items, null, 2));
        console.log('Shipping Address:', JSON.stringify(shippingAddress, null, 2));
        console.log('Is Gift Box:', isGiftBox);

        // Fetch products from database to validate prices
        const productIds = items.map(item => item.product);
        const dbProducts = await Product.find({ _id: { $in: productIds } });

        // Validate prices against database
        try {
            validateCartPrices(items, dbProducts);
        } catch (error) {
            console.error('Price Validation Error:', error.message);
            return errorResponse(res, 400, error.message);
        }

        // Calculate totals
        const shippingPrice = 200; // Fixed shipping or calculate based on logic
        const { itemsPrice, taxPrice, totalPrice } = calculateOrderTotal(items, shippingPrice, 0);

        console.log('Calculated Totals:', { itemsPrice, shippingPrice, taxPrice, totalPrice });

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            isGiftBox,
            notes,
            statusHistory: [{ status: 'Pending', note: 'Order placed' }]
        });

        console.log('Order created successfully:', order.orderNumber);

        // Clear cart after order
        try {
            await Cart.findOneAndUpdate(
                { user: req.user.id },
                { items: [] }
            );
        } catch (cartErr) {
            console.error('Non-fatal Cart Clear Error:', cartErr.message);
        }

        // Send confirmation email (background)
        sendOrderConfirmationEmail(req.user, order).catch(err => console.error('Email Error:', err));

        successResponse(res, 201, 'Order created successfully', { order });
    } catch (error) {
        console.error('CRITICAL Order Controller Error:', error);

        // Handle Mongoose Validation Errors specifically
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return errorResponse(res, 400, 'Validation failed', messages);
        }

        // Handle CastError (invalid ID format)
        if (error.name === 'CastError') {
            return errorResponse(res, 400, `Invalid ID format for field ${error.path}: ${error.value}`);
        }

        next(error);
    }
};

/**
 * @route   GET /api/orders
 * @desc    Get user order history
 * @access  Private
 */
exports.getUserOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user.id })
            .sort('-createdAt')
            .limit(limit)
            .skip(skip);

        const total = await Order.countDocuments({ user: req.user.id });

        paginatedResponse(res, 200, orders, page, limit, total);
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order
 * @access  Private
 */
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product', 'name images');

        if (!order) {
            return errorResponse(res, 404, 'Order not found');
        }

        // Check if user owns the order or is admin
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return errorResponse(res, 403, 'Not authorized to view this order');
        }

        successResponse(res, 200, 'Order retrieved successfully', { order });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/orders/track/:orderNumber
 * @desc    Track order by order number
 * @access  Public
 */
exports.trackOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber })
            .select('orderNumber status statusHistory createdAt');

        if (!order) {
            return errorResponse(res, 404, 'Order not found');
        }

        successResponse(res, 200, 'Order tracking retrieved', { order });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders (Admin)
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.status) {
            query.status = req.query.status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .sort('-createdAt')
            .limit(limit)
            .skip(skip);

        const total = await Order.countDocuments(query);

        paginatedResponse(res, 200, orders, page, limit, total);
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin)
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status, note } = req.body;

        const order = await Order.findById(req.params.id).populate('user');

        if (!order) {
            return errorResponse(res, 404, 'Order not found');
        }

        order.status = status;
        order.statusHistory.push({ status, note: note || `Status changed to ${status}` });

        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        // Send status update email (background)
        sendOrderStatusEmail(order.user, order).catch(err => console.error(err));

        successResponse(res, 200, 'Order status updated', { order });
    } catch (error) {
        next(error);
    }
};
