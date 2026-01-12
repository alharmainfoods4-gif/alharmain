/**
 * Wholesale Controller
 * B2B wholesale account management
 */

const Wholesale = require('../models/Wholesale.model');
const User = require('../models/User.model');

/**
 * @route   POST /api/wholesale/register
 * @desc    Register wholesale account
 * @access  Private
 */
exports.registerWholesale = async (req, res) => {
    try {
        const { businessName, businessType, taxId, businessAddress, contactPerson } = req.body;

        // Check if already has wholesale account
        const existing = await Wholesale.findOne({ user: req.user._id });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Wholesale account already exists'
            });
        }

        const wholesale = await Wholesale.create({
            user: req.user._id,
            businessName,
            businessType,
            taxId,
            businessAddress,
            contactPerson
        });

        res.status(201).json({
            success: true,
            message: 'Wholesale registration submitted. Awaiting admin approval.',
            wholesale
        });

    } catch (error) {
        console.error('Register Wholesale Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while registering wholesale',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/wholesale/account
 * @desc    Get wholesale account details
 * @access  Private
 */
exports.getWholesaleAccount = async (req, res) => {
    try {
        const wholesale = await Wholesale.findOne({ user: req.user._id });

        if (!wholesale) {
            return res.status(404).json({
                success: false,
                message: 'Wholesale account not found'
            });
        }

        res.json({
            success: true,
            wholesale
        });

    } catch (error) {
        console.error('Get Wholesale Account Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching wholesale account',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/wholesale/pricing
 * @desc    Get wholesale pricing (approved accounts only)
 * @access  Private/Wholesale
 */
exports.getWholesalePricing = async (req, res) => {
    try {
        const wholesale = await Wholesale.findOne({ user: req.user._id });

        if (!wholesale) {
            return res.status(404).json({
                success: false,
                message: 'Wholesale account not found'
            });
        }

        if (!wholesale.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Wholesale account not yet approved'
            });
        }

        const pricing = {
            discountTier: wholesale.discountTier,
            discountPercentage: wholesale.discountPercentage,
            minimumOrder: wholesale.minimumOrder
        };

        res.json({
            success: true,
            pricing
        });

    } catch (error) {
        console.error('Get Wholesale Pricing Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching pricing',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/wholesale/:id/approve
 * @desc    Approve wholesale account (Admin)
 * @access  Private/Admin
 */
exports.approveWholesale = async (req, res) => {
    try {
        const wholesale = await Wholesale.findById(req.params.id);

        if (!wholesale) {
            return res.status(404).json({
                success: false,
                message: 'Wholesale account not found'
            });
        }

        wholesale.isApproved = true;
        await wholesale.save();

        // Update user role to wholesale
        await User.findByIdAndUpdate(wholesale.user, { role: 'wholesale' });

        res.json({
            success: true,
            message: 'Wholesale account approved successfully',
            wholesale
        });

    } catch (error) {
        console.error('Approve Wholesale Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while approving wholesale',
            error: error.message
        });
    }
};
