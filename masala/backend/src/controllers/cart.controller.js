/**
 * Cart Controller
 * Shopping cart management
 */

const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

/**
 * @route   GET /api/cart
 * @desc    Get user cart
 * @access  Private
 */
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name images basePrice isActive');

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        res.json({
            success: true,
            cart
        });

    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching cart',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @access  Private
 */
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, variantSize } = req.body;

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or inactive'
            });
        }

        let price = product.basePrice;
        let variant = null;

        // Check variant if specified
        if (variantSize) {
            variant = product.variants.find(v => v.size === variantSize);
            if (!variant) {
                return res.status(404).json({
                    success: false,
                    message: 'Variant not found'
                });
            }
            price = variant.price;
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
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
                variant: variant ? { size: variant.size, price: variant.price } : null
            });
        }

        await cart.save();
        await cart.populate('items.product', 'name images basePrice');

        res.json({
            success: true,
            message: 'Item added to cart',
            cart
        });

    } catch (error) {
        console.error('Add to Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding to cart',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/cart/update
 * @desc    Update cart item quantity
 * @access  Private
 */
exports.updateCart = async (req, res) => {
    try {
        const { productId, quantity, variantSize } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId &&
                (!variantSize || item.variant?.size === variantSize)
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product', 'name images basePrice');

        res.json({
            success: true,
            message: 'Cart updated successfully',
            cart
        });

    } catch (error) {
        console.error('Update Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating cart',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/cart/remove/:productId
 * @desc    Remove item from cart
 * @access  Private
 */
exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const { variantSize } = req.query;

        cart.items = cart.items.filter(
            item => !(item.product.toString() === req.params.productId &&
                (!variantSize || item.variant?.size === variantSize))
        );

        await cart.save();

        res.json({
            success: true,
            message: 'Item removed from cart',
            cart
        });

    } catch (error) {
        console.error('Remove from Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing from cart',
            error: error.message
        });
    }
};
