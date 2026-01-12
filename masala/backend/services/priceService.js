/**
 * Price Service
 * Handles price calculations and wholesale discounts
 */

/**
 * Calculate wholesale discount
 * @param {number} price - Base price
 * @param {number} discountPercentage - Discount percentage
 * @returns {number} Discounted price
 */
const calculateWholesalePrice = (price, discountPercentage) => {
    const discount = (price * discountPercentage) / 100;
    return Math.round(price - discount);
};

/**
 * Calculate order total
 * @param {array} items - Order items
 * @param {number} shippingPrice - Shipping cost
 * @param {number} taxPercentage - Tax percentage
 * @returns {object} Price breakdown
 */
const calculateOrderTotal = (items, shippingPrice = 0, taxPercentage = 0) => {
    const itemsPrice = items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const taxPrice = Math.round((itemsPrice * taxPercentage) / 100);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    };
};

/**
 * Validate cart prices against database
 * @param {array} cartItems - Items from cart
 * @param {array} dbProducts - Products from database
 * @returns {boolean} True if prices match
 */
const validateCartPrices = (cartItems, dbProducts) => {
    for (const cartItem of cartItems) {
        const dbProduct = dbProducts.find(p => p._id.toString() === cartItem.product.toString());

        if (!dbProduct) {
            throw new Error(`Product ${cartItem.product} not found`);
        }

        // Check variant price if specified
        if (cartItem.variant && (cartItem.variant.sku || cartItem.variant.size)) {
            const variant = dbProduct.variants.find(v =>
                (cartItem.variant.sku && v.sku === cartItem.variant.sku) ||
                (cartItem.variant.size && v.size === cartItem.variant.size)
            );
            if (!variant) {
                throw new Error(`Variant ${cartItem.variant.sku || cartItem.variant.size} not found for ${dbProduct.name}`);
            }
            if (variant.price !== cartItem.price) {
                throw new Error(`Price mismatch for ${dbProduct.name} variant ${variant.size}`);
            }
        } else {
            // Check base price
            const dbPrice = dbProduct.basePrice || dbProduct.price;
            if (dbPrice !== cartItem.price) {
                throw new Error(`Price mismatch for ${dbProduct.name}. Expected ${dbPrice}, got ${cartItem.price}`);
            }
        }
    }

    return true;
};

module.exports = {
    calculateWholesalePrice,
    calculateOrderTotal,
    validateCartPrices
};
