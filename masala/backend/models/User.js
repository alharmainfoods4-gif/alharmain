/**
 * User Model
 * Roles: customer, admin, wholesale
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
        match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'wholesale'],
        default: 'customer'
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'Pakistan' }
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'Pakistan' }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
