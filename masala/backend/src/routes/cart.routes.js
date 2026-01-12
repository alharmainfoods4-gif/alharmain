/**
 * Cart Routes
 */

const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart
} = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCart);
router.delete('/remove/:productId', removeFromCart);

module.exports = router;
