/**
 * Wholesale Routes
 */

const express = require('express');
const router = express.Router();
const {
    registerWholesale,
    getWholesalePricing,
    getWholesaleAccount,
    approveWholesale
} = require('../controllers/wholesaleController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');

router.use(protect); // All routes require authentication

router.post('/register', registerWholesale);
router.get('/account', getWholesaleAccount);
router.get('/pricing', authorize('wholesale', 'admin'), getWholesalePricing);
router.put('/:id/approve', authorize('admin'), approveWholesale);

module.exports = router;
