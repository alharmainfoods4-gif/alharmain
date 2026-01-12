import api from './api';
import { API_ROUTES } from '../config/constants';

const orderService = {
    // Create order
    create: async (orderData) => {
        const response = await api.post(API_ROUTES.ORDERS.BASE, orderData);
        return response.data;
    },

    // Get user orders
    getUserOrders: async () => {
        const response = await api.get(API_ROUTES.ORDERS.BASE);
        return response.data;
    },

    // Get single order
    getById: async (id) => {
        const response = await api.get(API_ROUTES.ORDERS.BY_ID(id));
        return response.data;
    },

    // Track order by order number (Public)
    trackOrder: async (orderNumber) => {
        const response = await api.get(API_ROUTES.ORDERS.TRACK(orderNumber));
        return response.data;
    },

    // Get all orders (Admin only)
    getAllOrders: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams ? `${API_ROUTES.ORDERS.ADMIN_ALL}?${queryParams}` : API_ROUTES.ORDERS.ADMIN_ALL;
        const response = await api.get(url);
        return response.data;
    },

    // Update order status (Admin only)
    updateStatus: async (id, statusData) => {
        const response = await api.put(API_ROUTES.ORDERS.UPDATE_STATUS(id), statusData);
        return response.data;
    },
};

export default orderService;
