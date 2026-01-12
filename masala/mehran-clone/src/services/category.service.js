import api from './api';
import { API_ROUTES } from '../config/constants';

const categoryService = {
    // Get all categories
    getAll: async () => {
        const response = await api.get(API_ROUTES.CATEGORIES.BASE);
        return response.data;
    },

    // Get single category
    getById: async (id) => {
        const response = await api.get(API_ROUTES.CATEGORIES.BY_ID(id));
        return response.data;
    },

    // Create category (Admin only)
    create: async (categoryData) => {
        const response = await api.post(API_ROUTES.CATEGORIES.BASE, categoryData);
        return response.data;
    },

    // Update category (Admin only)
    update: async (id, categoryData) => {
        const response = await api.put(API_ROUTES.CATEGORIES.BY_ID(id), categoryData);
        return response.data;
    },

    // Delete category (Admin only)
    delete: async (id) => {
        const response = await api.delete(API_ROUTES.CATEGORIES.BY_ID(id));
        return response.data;
    },
};

export default categoryService;
