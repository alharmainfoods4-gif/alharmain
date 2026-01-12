/**
 * Upload Controller
 * Cloudinary image upload
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * @route   POST /api/upload
 * @desc    Upload single image
 * @access  Private/Admin
 */
exports.uploadSingle = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'al-harmain/products',
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto' }
            ]
        });

        // Delete local file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });

    } catch (error) {
        // Delete local file if upload fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading image',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images
 * @access  Private/Admin
 */
exports.uploadMultiple = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image'
            });
        }

        const uploadPromises = req.files.map(file =>
            cloudinary.uploader.upload(file.path, {
                folder: 'al-harmain/products',
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto' }
                ]
            }).then(result => {
                fs.unlinkSync(file.path);
                return {
                    url: result.secure_url,
                    publicId: result.public_id
                };
            })
        );

        const results = await Promise.all(uploadPromises);

        res.json({
            success: true,
            message: 'Images uploaded successfully',
            images: results
        });

    } catch (error) {
        // Delete local files if upload fails
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        console.error('Upload Multiple Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading images',
            error: error.message
        });
    }
};
