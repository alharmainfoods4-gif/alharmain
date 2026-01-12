/**
 * Transaction Controller
 * Handles manual/private company transactions
 */

const Transaction = require('../models/Transaction.model');

/**
 * @route   POST /api/transactions
 * @desc    Create new transaction
 * @access  Private/Admin
 */
exports.createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Transaction saved successfully',
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving transaction',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions
 * @access  Private/Admin
 */
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({}).sort('-date');
        res.json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 * @access  Private/Admin
 */
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error: error.message
        });
    }
};
