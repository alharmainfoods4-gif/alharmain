/**
 * Upload Routes
 * Image upload using Multer + Cloudinary
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');
const { uploadImage, uploadMultipleImages } = require('../services/uploadService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'backend/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

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

        const result = await uploadImage(req.file.path, 'products');

        successResponse(res, 200, 'Image uploaded successfully', result);
    } catch (error) {
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

        const filePaths = req.files.map(file => file.path);
        const results = await uploadMultipleImages(filePaths, 'products');

        successResponse(res, 200, 'Images uploaded successfully', { images: results });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
