import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '../config/constants';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('API Request:', config.url, 'Token attached:', token.substring(0, 10) + '...');
        } else {
            console.log('API Request:', config.url, 'No token found');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            const { status, data } = error.response;

            if (status === 401) {
                console.error('API 401 Unauthorized:', { url: error.config.url, data });
                // Unauthorized - clear token
                // console.log('DEBUG: Keeping token despite 401 to trace error');
                // localStorage.removeItem(TOKEN_KEY);
                // localStorage.removeItem(USER_KEY);
            }

            return Promise.reject(data);
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({ message: 'No response from server. Please check backend.' });
        } else {
            // Something else happened
            return Promise.reject({ message: error.message });
        }
    }
);

export default api;
