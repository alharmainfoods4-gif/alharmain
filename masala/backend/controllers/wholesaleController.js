/**
 * Wholesale Controller
 * B2B wholesale account management
 */

const Wholesale = require('../models/Wholesale');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { calculateWholesalePrice } = require('../services/priceService');

/**
 * @route   POST /api/wholesale/register
 * @desc    Register wholesale account
 * @access  Private
 */
exports.registerWholesale = async (req, res, next) => {
    try {
        const { businessName, businessType, taxId, businessAddress, contactPerson } = req.body;

        // Check if user already has wholesale account
        const existing = await Wholesale.findOne({ user: req.user.id });
        if (existing) {
            return errorResponse(res, 400, 'Wholesale account already exists');
        }

        const wholesale = await Wholesale.create({
            user: req.user.id,
            businessName,
            businessType,
            taxId,
            businessAddress,
            contactPerson
        });

        successResponse(res, 201, 'Wholesale registration submitted. Awaiting approval.', { wholesale });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/wholesale/pricing
 * @desc    Get wholesale pricing (for approved accounts)
 * @access  Private/Wholesale
 */
exports.getWholesalePricing = async (req, res, next) => {
    try {
        const wholesale = await Wholesale.findOne({ user: req.user.id });

        if (!wholesale) {
            return errorResponse(res, 404, 'Wholesale account not found');
        }

        if (!wholesale.isApproved) {
            return errorResponse(res, 403, 'Wholesale account not yet approved');
        }

        const pricing = {
            discountTier: wholesale.discountTier,
            discountPercentage: wholesale.discountPercentage,
            minimumOrder: wholesale.minimumOrder,
            creditLimit: wholesale.creditLimit
        };

        successResponse(res, 200, 'Wholesale pricing retrieved', { pricing });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/wholesale/account
 * @desc    Get wholesale account details
 * @access  Private
 */
exports.getWholesaleAccount = async (req, res, next) => {
    try {
        const wholesale = await Wholesale.findOne({ user: req.user.id });

        if (!wholesale) {
            return errorResponse(res, 404, 'Wholesale account not found');
        }

        successResponse(res, 200, 'Wholesale account retrieved', { wholesale });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/wholesale/:id/approve
 * @desc    Approve wholesale account (Admin)
 * @access  Private/Admin
 */
exports.approveWholesale = async (req, res, next) => {
    try {
        const wholesale = await Wholesale.findById(req.params.id);

        if (!wholesale) {
            return errorResponse(res, 404, 'Wholesale account not found');
        }

        wholesale.isApproved = true;
        await wholesale.save();

        // Update user role to wholesale
        await User.findByIdAndUpdate(wholesale.user, { role: 'wholesale' });

        successResponse(res, 200, 'Wholesale account approved', { wholesale });
    } catch (error) {
        next(error);
    }
};
