/**
 * Upload Service
 * Cloudinary image upload handling
 */

const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder name
 * @returns {object} Upload result
 */
const uploadImage = async (filePath, folder = 'products') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `al-harmain/${folder}`,
            resource_type: 'auto',
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        // Delete local file after upload
        fs.unlinkSync(filePath);

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        // Delete local file if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log('✅ Image deleted from Cloudinary');
    } catch (error) {
        console.error('❌ Error deleting image from Cloudinary:', error);
        throw error;
    }
};

/**
 * Upload multiple images
 * @param {array} filePaths - Array of file paths
 * @param {string} folder - Cloudinary folder
 * @returns {array} Upload results
 */
const uploadMultipleImages = async (filePaths, folder = 'products') => {
    try {
        const uploadPromises = filePaths.map(path => uploadImage(path, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    uploadImage,
    deleteImage,
    uploadMultipleImages
};
