/**
 * Order Controller
 * Order management and tracking
 */

const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const sendEmail = require('../utils/sendEmail');

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 */
exports.createOrder = async (req, res) => {
    try {
        console.log('--- Create Order Started ---');
        console.log('Request User:', req.user ? req.user._id : 'UNDEFINED');
        console.log('Request Body:', JSON.stringify(req.body, null, 2));

        const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, notes, isGiftBox } = req.body;
        console.log('>>> [GIFTBOX DEBUG] isGiftBox value from request:', isGiftBox);

        if (!items || items.length === 0) {
            console.error('Order Error: No items provided');
            return res.status(400).json({
                success: false,
                message: 'No items in order'
            });
        }

        // Calculate totals with fallbacks to body values
        const calculatedItemsPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const finalItemsPrice = itemsPrice || calculatedItemsPrice;
        const finalShippingPrice = shippingPrice !== undefined ? shippingPrice : 200;
        const finalTaxPrice = taxPrice !== undefined ? taxPrice : 0;
        const finalTotalPrice = totalPrice || (finalItemsPrice + finalShippingPrice + finalTaxPrice);

        const orderData = {
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            itemsPrice: finalItemsPrice,
            shippingPrice: finalShippingPrice,
            taxPrice: finalTaxPrice,
            totalPrice: finalTotalPrice,
            notes,
            isGiftBox,
            statusHistory: [{ status: 'Pending', note: 'Order placed' }]
        };

        console.log('Constructed Order Data:', JSON.stringify(orderData, null, 2));

        const order = await Order.create(orderData);
        console.log('Order created successfully:', order._id);

        // Send email notification to Admin
        try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: `New Order Received: #${order.orderNumber}`,
                message: `
                    New order received from ${shippingAddress.name}.
                    Total: Rs. ${finalTotalPrice}
                    Payment Method: ${paymentMethod}
                    Items: ${items.length}
                `,
                html: `
                    <h3>New Order Received</h3>
                    <p><strong>Order Number:</strong> #${order.orderNumber}</p>
                    <p><strong>Customer:</strong> ${shippingAddress.name}</p>
                    <p><strong>Total Amount:</strong> Rs. ${finalTotalPrice}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <br/>
                    <p>View full details in the Admin Panel.</p>
                `
            });
        } catch (emailError) {
            console.error('Email Sending Error (Order Confirmation):', emailError);
        }

        // Clear cart after order
        try {
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { items: [] }
            );
            console.log('Cart cleared for user:', req.user._id);
        } catch (cartError) {
            console.error('Error clearing cart (non-fatal):', cartError);
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });

    } catch (error) {
        console.error('CRITICAL Order Creation Error:');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);

        let errorDetails = null;
        if (error.errors) {
            console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
            errorDetails = Object.keys(error.errors).map(key => error.errors[key].message);
        } else if (error.name === 'CastError') {
            errorDetails = [`Invalid ${error.path}: ${error.value}`];
        }

        console.error('Stack Trace:', error.stack);

        res.status(500).json({
            success: false,
            message: 'Server error while creating order',
            error: error.message,
            errorType: error.name,
            details: errorDetails
        });
    }
};

/**
 * @route   GET /api/orders
 * @desc    Get user orders
 * @access  Private
 */
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort('-createdAt')
            .select('-statusHistory');

        res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error('Get User Orders Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching orders',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order
 * @access  Private
 */
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order or is admin
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching order',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/orders/track/:orderNumber
 * @desc    Track order by order number (Public)
 * @access  Public
 */
exports.trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber })
            .select('orderNumber status statusHistory createdAt deliveredAt');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Track Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while tracking order',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders (Admin)
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort('-createdAt')
            .limit(Number(limit))
            .skip(skip);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            count: orders.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            orders
        });

    } catch (error) {
        console.error('Get All Orders Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching orders',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin)
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        order.statusHistory.push({
            status,
            note: note || `Status updated to ${status}`
        });

        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
            order.paymentStatus = 'Paid';
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });

    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating order status',
            error: error.message
        });
    }
};
