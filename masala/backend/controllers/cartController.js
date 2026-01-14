/**
 * Cart Controller
 */

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * @route   GET /api/cart
 * @desc    Get user cart
 * @access  Private
 */
exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price images stock');

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        successResponse(res, 200, 'Cart retrieved successfully', { cart });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @access  Private
 */
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, variantSize } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return errorResponse(res, 404, 'Product not found');
        }

        let price = product.price || product.basePrice;
        let variant = null;

        // Check variant if specified
        if (variantSize) {
            variant = product.variants.find(v => v.size === variantSize);
            if (!variant) {
                return errorResponse(res, 404, 'Variant not found');
            }
            price = variant.price;
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId &&
                (!variantSize || item.variant?.size === variantSize)
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                name: product.name,
                image: product.images[0],
                price,
                quantity,
                variant: variant ? { size: variant.size, sku: variant.sku } : null
            });
        }

        await cart.save();
        await cart.populate('items.product', 'name price images stock');

        successResponse(res, 200, 'Item added to cart', { cart });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/cart/update
 * @desc    Update cart item quantity
 * @access  Private
 */
exports.updateCart = async (req, res, next) => {
    try {
        const { productId, quantity, variantSize } = req.body;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return errorResponse(res, 404, 'Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId &&
                (!variantSize || item.variant?.size === variantSize)
        );

        if (itemIndex === -1) {
            return errorResponse(res, 404, 'Item not found in cart');
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product', 'name price images stock');

        successResponse(res, 200, 'Cart updated successfully', { cart });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/cart/remove/:productId
 * @desc    Remove item from cart
 * @access  Private
 */
exports.removeFromCart = async (req, res, next) => {
    try {
        const { variantSize } = req.query;
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return errorResponse(res, 404, 'Cart not found');
        }

        cart.items = cart.items.filter(
            item => !(item.product.toString() === req.params.productId &&
                (!variantSize || item.variant?.size === variantSize))
        );

        await cart.save();
        await cart.populate('items.product', 'name price images stock');

        successResponse(res, 200, 'Item removed from cart', { cart });
    } catch (error) {
        next(error);
    }
};
