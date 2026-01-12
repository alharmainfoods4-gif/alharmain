/**
 * Admin Controller
 * Handles user management and dashboard statistics
 */

const User = require('../models/User.model');
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort('-createdAt');
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user details/role
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const activeOrders = await Order.countDocuments({ status: { $ne: 'Delivered' } });

        // Total Sales (from Delivered orders)
        const salesData = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
        ]);
        const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

        // Monthly Revenue (Current Month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyRevenueData = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered',
                    createdAt: { $gte: startOfMonth }
                }
            },
            { $group: { _id: null, revenue: { $sum: '$totalPrice' } } }
        ]);
        const monthlyRevenue = monthlyRevenueData.length > 0 ? monthlyRevenueData[0].revenue : 0;

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalOrders,
                activeOrders,
                totalSales,
                monthlyRevenue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message
        });
    }
};
