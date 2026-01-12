/**
 * Wholesale Routes
 */

const express = require('express');
const router = express.Router();
const {
    registerWholesale,
    getWholesaleAccount,
    getWholesalePricing,
    approveWholesale
} = require('../controllers/wholesale.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/register', registerWholesale);
router.get('/account', getWholesaleAccount);
router.get('/pricing', getWholesalePricing);
router.put('/:id/approve', isAdmin, approveWholesale);

module.exports = router;
