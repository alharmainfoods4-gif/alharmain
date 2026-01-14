/**
 * Upload Routes
 * Image upload using Multer (Memory Storage) + Cloudinary
 * Optimized for Vercel Serverless
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');
const { uploadImageBuffer, uploadMultipleImageBuffers } = require('../services/uploadService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Configure multer with MEMORY storage (for serverless compatibility)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (ext && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter
});

/**
 * @route   POST /api/upload
 * @desc    Upload single image
 * @access  Private/Admin
 */
router.post('/', protect, authorize('admin'), upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            return errorResponse(res, 400, 'Please upload an image');
        }

        // Use buffer upload for serverless
        const result = await uploadImageBuffer(req.file.buffer, 'products');

        successResponse(res, 200, 'Image uploaded successfully', result);
    } catch (error) {
        console.error('Upload error:', error);
        next(error);
    }
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images
 * @access  Private/Admin
 */
router.post('/multiple', protect, authorize('admin'), upload.array('images', 5), async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return errorResponse(res, 400, 'Please upload at least one image');
        }

        // Extract buffers and upload
        const buffers = req.files.map(file => file.buffer);
        const results = await uploadMultipleImageBuffers(buffers, 'products');

        successResponse(res, 200, 'Images uploaded successfully', { images: results });
    } catch (error) {
        console.error('Multiple upload error:', error);
        next(error);
    }
});

module.exports = router;
