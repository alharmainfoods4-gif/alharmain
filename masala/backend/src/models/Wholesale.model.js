/**
 * Wholesale Model
 * B2B wholesale accounts
 */

const mongoose = require('mongoose');

const wholesaleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    businessName: {
        type: String,
        required: [true, 'Business name is required'],
        trim: true
    },
    businessType: {
        type: String,
        enum: ['Retailer', 'Distributor', 'Restaurant', 'Hotel', 'Other'],
        required: true
    },
    taxId: {
        type: String,
        required: [true, 'Tax ID/NTN is required']
    },
    businessAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: String,
        postalCode: String,
        country: { type: String, default: 'Pakistan' }
    },
    contactPerson: {
        name: String,
        phone: String,
        email: String
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    discountTier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        default: 'Bronze'
    },
    discountPercentage: {
        type: Number,
        default: 5,
        min: 0,
        max: 50
    },
    minimumOrder: {
        type: Number,
        default: 10000
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Wholesale || mongoose.model('Wholesale', wholesaleSchema);
