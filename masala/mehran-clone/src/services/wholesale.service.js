import api from './api';
import { API_ROUTES } from '../config/constants';

const wholesaleService = {
    // Register wholesale account
    register: async (wholesaleData) => {
        const response = await api.post(API_ROUTES.WHOLESALE.REGISTER, wholesaleData);
        return response.data;
    },

    // Get wholesale account
    getAccount: async () => {
        const response = await api.get(API_ROUTES.WHOLESALE.ACCOUNT);
        return response.data;
    },

    // Get wholesale pricing
    getPricing: async () => {
        const response = await api.get(API_ROUTES.WHOLESALE.PRICING);
        return response.data;
    },

    // Approve wholesale account (Admin only)
    approve: async (id) => {
        const response = await api.put(API_ROUTES.WHOLESALE.APPROVE(id));
        return response.data;
    },
};

export default wholesaleService;
