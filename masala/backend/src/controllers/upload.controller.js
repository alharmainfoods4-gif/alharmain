/**
 * Upload Controller
 * Cloudinary image upload - Optimized for Serverless
 */

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload buffer to Cloudinary using stream
 */
const uploadBufferToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

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

        // Upload to Cloudinary using buffer (serverless compatible)
        const result = await uploadBufferToCloudinary(req.file.buffer, 'al-harmain/products');

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });

    } catch (error) {
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
            uploadBufferToCloudinary(file.buffer, 'al-harmain/products')
                .then(result => ({
                    url: result.secure_url,
                    publicId: result.public_id
                }))
        );

        const results = await Promise.all(uploadPromises);

        res.json({
            success: true,
            message: 'Images uploaded successfully',
            images: results
        });

    } catch (error) {
        console.error('Upload Multiple Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading images',
            error: error.message
        });
    }
};
