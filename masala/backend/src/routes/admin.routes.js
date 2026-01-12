/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const {
    getUsers,
    updateUser,
    deleteUser,
    getDashboardStats
} = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// All admin routes require admin authentication
router.use(authMiddleware, isAdmin);

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/stats', getDashboardStats);

module.exports = router;
