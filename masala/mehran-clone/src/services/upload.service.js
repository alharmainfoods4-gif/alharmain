import api from './api';
import { API_ROUTES } from '../config/constants';

const uploadService = {
    // Upload single image
    uploadSingle: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post(API_ROUTES.UPLOAD.SINGLE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Upload multiple images
    uploadMultiple: async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const response = await api.post(API_ROUTES.UPLOAD.MULTIPLE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default uploadService;
