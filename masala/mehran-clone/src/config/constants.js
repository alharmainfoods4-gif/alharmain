// API Configuration Constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ROUTES = {
    // Auth
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
    },

    // Categories
    CATEGORIES: {
        BASE: '/categories',
        BY_ID: (id) => `/categories/${id}`,
    },

    // Products
    PRODUCTS: {
        BASE: '/products',
        BY_ID: (id) => `/products/${id}`,
        BY_SLUG: (slug) => `/products/${slug}`,
        REVIEWS: (id) => `/products/${id}/review`,
    },

    // Cart
    CART: {
        BASE: '/cart',
        ADD: '/cart/add',
        UPDATE: '/cart/update',
        REMOVE: (productId, variantSize) => `/cart/remove/${productId}${variantSize ? `?variantSize=${variantSize}` : ''}`,
    },

    // Orders
    ORDERS: {
        BASE: '/orders',
        BY_ID: (id) => `/orders/${id}`,
        TRACK: (orderNumber) => `/orders/track/${orderNumber}`,
        ADMIN_ALL: '/admin/orders',
        UPDATE_STATUS: (id) => `/orders/${id}/status`,
    },

    // Wholesale
    WHOLESALE: {
        REGISTER: '/wholesale/register',
        ACCOUNT: '/wholesale/account',
        PRICING: '/wholesale/pricing',
        APPROVE: (id) => `/wholesale/${id}/approve`,
    },

    // Upload
    UPLOAD: {
        SINGLE: '/upload',
        MULTIPLE: '/upload/multiple',
    },

    // CMS
    CMS: {
        CONTENT: (slug) => `/cms/content/${slug}`,
        CONTACT: '/cms/contact',
    },
};

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';
