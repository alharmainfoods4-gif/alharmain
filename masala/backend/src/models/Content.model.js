/**
 * Content Model (CMS)
 * For managing static content
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);
