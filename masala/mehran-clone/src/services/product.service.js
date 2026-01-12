import api from './api';
import { API_ROUTES } from '../config/constants';

const productService = {
    // Get all products with filters
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams ? `${API_ROUTES.PRODUCTS.BASE}?${queryParams}` : API_ROUTES.PRODUCTS.BASE;
        const response = await api.get(url);
        return response.data;
    },

    // Get single product by slug
    getBySlug: async (slug) => {
        const response = await api.get(API_ROUTES.PRODUCTS.BY_SLUG(slug));
        return response.data;
    },

    // Get single product by ID
    getById: async (id) => {
        const response = await api.get(API_ROUTES.PRODUCTS.BY_ID(id));
        return response.data;
    },

    // Create product (Admin only)
    create: async (productData) => {
        const response = await api.post(API_ROUTES.PRODUCTS.BASE, productData);
        return response.data;
    },

    // Update product (Admin only)
    update: async (id, productData) => {
        const response = await api.put(API_ROUTES.PRODUCTS.BY_ID(id), productData);
        return response.data;
    },

    // Delete product (Admin only)
    delete: async (id) => {
        const response = await api.delete(API_ROUTES.PRODUCTS.BY_ID(id));
        return response.data;
    },

    // Add review (Authenticated users)
    addReview: async (productId, reviewData) => {
        const response = await api.post(API_ROUTES.PRODUCTS.REVIEWS(productId), reviewData);
        return response.data;
    },
};

export default productService;
