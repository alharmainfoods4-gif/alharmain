/**
 * Content Model (CMS)
 * For managing static pages like About, Philosophy, etc.
 */

const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['page', 'section', 'banner'],
        default: 'page'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        description: String,
        keywords: [String],
        image: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Content || mongoose.model('Content', contentSchema);
