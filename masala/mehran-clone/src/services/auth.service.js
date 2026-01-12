import api from './api';
import { API_ROUTES, TOKEN_KEY, USER_KEY } from '../config/constants';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post(API_ROUTES.AUTH.REGISTER, userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post(API_ROUTES.AUTH.LOGIN, credentials);
        const { token, user } = response.data;

        // Store token and user in localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return response.data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    // Check if user is admin
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user && user.role === 'admin';
    },
};

export default authService;
