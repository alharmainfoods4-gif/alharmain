import api from './api';
import { API_ROUTES } from '../config/constants';

const cartService = {
    // Get user cart
    getCart: async () => {
        const response = await api.get(API_ROUTES.CART.BASE);
        return response.data;
    },

    // Add item to cart
    addToCart: async (productId, quantity, variantSize) => {
        const response = await api.post(API_ROUTES.CART.ADD, {
            productId,
            quantity,
            variantSize
        });
        return response.data;
    },

    // Update cart item quantity
    updateQuantity: async (productId, quantity, variantSize) => {
        const response = await api.put(API_ROUTES.CART.UPDATE, {
            productId,
            quantity,
            variantSize
        });
        return response.data;
    },

    // Remove item from cart
    removeProduct: async (productId, variantSize) => {
        const response = await api.delete(API_ROUTES.CART.REMOVE(productId, variantSize));
        return response.data;
    }
};

export default cartService;
