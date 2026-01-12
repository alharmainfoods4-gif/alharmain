/**
 * Upload Routes
 * Image upload with Multer + Cloudinary
 */

const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple } = require('../controllers/upload.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

// All upload routes require admin authentication
router.use(authMiddleware, isAdmin);

router.post('/', upload.single('image'), uploadSingle);
router.post('/multiple', upload.array('images', 5), uploadMultiple);

module.exports = router;
