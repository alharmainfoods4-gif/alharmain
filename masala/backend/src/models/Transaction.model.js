/**
 * Transaction Model
 * Internal company transactions (manual sales, ledgers)
 */

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    items: {
        type: String,
        required: [true, 'Items details are required'],
        trim: true
    },
    itemQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    transactionType: {
        type: String,
        enum: ['debit', 'credit'],
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
