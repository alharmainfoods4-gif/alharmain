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
} = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');

router.use(protect); // All cart routes require authentication

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCart);
router.delete('/remove/:productId', removeFromCart);

module.exports = router;
