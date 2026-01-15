/**
 * Product Model
 * Supports variants, reviews, ratings, badges
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, required: true },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const variantSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    basePrice: {
        type: Number,
        default: 0,
        min: 0
    },
    // Alias for backward compatibility
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    variants: [variantSchema],
    images: [{
        type: String,
        required: true
    }],
    badges: [{
        type: String
    }],
    ingredients: [{
        type: String
    }],
    nutrition: {
        calories: String,
        fat: String,
        carbs: String,
        protein: String
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isGiftBox: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Update rating when review is added
productSchema.methods.updateRating = function () {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.numReviews = 0;
    } else {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating = (totalRating / this.reviews.length).toFixed(1);
        this.numReviews = this.reviews.length;
    }
};

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
