/**
 * CMS Controller
 * Content management and contact form
 */

const Content = require('../models/Content.model');
const sendEmail = require('../utils/sendEmail');

/**
 * @route   GET /api/cms/content/:slug
 * @desc    Get content by slug
 * @access  Public
 */
exports.getContent = async (req, res) => {
    try {
        const content = await Content.findOne({
            slug: req.params.slug,
            isActive: true
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Content not found'
            });
        }

        res.json({
            success: true,
            content
        });

    } catch (error) {
        console.error('Get Content Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching content',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/cms/content/:slug
 * @desc    Update content (Admin)
 * @access  Private/Admin
 */
exports.updateContent = async (req, res) => {
    try {
        const content = await Content.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true, runValidators: true, upsert: true }
        );

        res.json({
            success: true,
            message: 'Content updated successfully',
            content
        });

    } catch (error) {
        console.error('Update Content Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating content',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/cms/contact
 * @desc    Submit contact form
 * @access  Public
 */
exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and message'
            });
        }

        // Send email to Admin
        try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
                message: `
                    Name: ${name}
                    Email: ${email}
                    Phone: ${phone || 'N/A'}
                    Subject: ${subject || 'N/A'}
                    
                    Message:
                    ${message}
                `,
                html: `
                    <h3>New Contact Form Submission</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                    <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                    <br/>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `
            });
        } catch (emailError) {
            console.error('Email Sending Error (Contact Form):', emailError);
            // We don't necessarily want to fail the request if email fails, 
            // but we might want to log it or handle it.
        }

        res.json({
            success: true,
            message: 'Contact form submitted successfully. We will get back to you soon!'
        });

    } catch (error) {
        console.error('Contact Form Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting contact form',
            error: error.message
        });
    }
};
