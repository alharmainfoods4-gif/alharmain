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
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
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

// Generate slug before saving
productSchema.pre('save', async function (next) {
    if (!this.isModified('name')) return next();

    // Simple slug generator
    const slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Trim hyphens

    // Ensure uniqueness
    let uniqueSlug = slug;
    let counter = 1;

    // Check if slug exists (excluding current document)
    // We need to access the model constructor to query
    const Model = this.constructor;

    while (await Model.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    this.slug = uniqueSlug;
    next();
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
