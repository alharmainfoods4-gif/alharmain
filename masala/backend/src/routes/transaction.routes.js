/**
 * Transaction Routes
 */

const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getTransactions,
    deleteTransaction
} = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// All transaction routes require admin authentication
router.use(authMiddleware, isAdmin);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.delete('/:id', deleteTransaction);

module.exports = router;
