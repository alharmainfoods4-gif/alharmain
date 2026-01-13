const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('adminToken');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        // Handle express-validator errors or generic message
        const errorMessage = data.errors
            ? data.errors.map(err => err.msg).join(', ')
            : (data.message || 'Something went wrong');
        throw new Error(errorMessage);
    }
    return data;
};

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    put: async (endpoint, data) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};
