/**
 * Upload Service
 * Cloudinary image upload handling - Optimized for Serverless
 */

const cloudinary = require('../config/cloudinary');

/**
 * Upload image buffer to Cloudinary (for serverless/memory storage)
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {object} Upload result
 */
const uploadImageBuffer = async (buffer, folder = 'products') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `al-harmain/${folder}`,
                resource_type: 'auto',
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            }
        );
        uploadStream.end(buffer);
    });
};

/**
 * Upload image to Cloudinary (file path - for local development)
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

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
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
 * Upload multiple image buffers (for serverless)
 * @param {array} buffers - Array of file buffers
 * @param {string} folder - Cloudinary folder
 * @returns {array} Upload results
 */
const uploadMultipleImageBuffers = async (buffers, folder = 'products') => {
    try {
        const uploadPromises = buffers.map(buffer => uploadImageBuffer(buffer, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw error;
    }
};

/**
 * Upload multiple images (file paths - for local development)
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
    uploadImageBuffer,
    deleteImage,
    uploadMultipleImages,
    uploadMultipleImageBuffers
};
