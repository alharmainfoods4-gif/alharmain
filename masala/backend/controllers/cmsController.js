/**
 * CMS Controller
 * Content management and contact form
 */

const Content = require('../models/Content');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const transporter = require('../config/email');

/**
 * @route   GET /api/cms/content/:slug
 * @desc    Get content by slug
 * @access  Public
 */
exports.getContent = async (req, res, next) => {
    try {
        const content = await Content.findOne({
            slug: req.params.slug,
            isActive: true
        });

        if (!content) {
            return errorResponse(res, 404, 'Content not found');
        }

        successResponse(res, 200, 'Content retrieved successfully', { content });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/cms/content/:slug
 * @desc    Update content (Admin)
 * @access  Private/Admin
 */
exports.updateContent = async (req, res, next) => {
    try {
        const content = await Content.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true, runValidators: true, upsert: true }
        );

        successResponse(res, 200, 'Content updated successfully', { content });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/cms/contact
 * @desc    Submit contact form
 * @access  Public
 */
exports.submitContactForm = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Send email to admin
        const mailOptions = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Send confirmation to user
        const confirmationOptions = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: email,
            subject: 'Thank you for contacting Al-Harmain Foods',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #C9A24D;">Thank You!</h2>
                    <p>Dear ${name},</p>
                    <p>We have received your message and will get back to you shortly.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #C9A24D; margin: 20px 0;">
                        <p style="margin-top: 0; color: #555;"><strong>Your Query:</strong></p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong><br/>${message}</p>
                    </div>

                    <p><strong>Al-Harmain Foods Team</strong></p>
                </div>
            `
        };

        await transporter.sendMail(confirmationOptions);

        successResponse(res, 200, 'Contact form submitted successfully');
    } catch (error) {
        console.error('Contact form error:', error);
        return errorResponse(res, 500, 'Failed to send message. Please try again.');
    }
};

/**
 * @route   POST /api/cms/chatbot
 * @desc    Chatbot endpoint (placeholder)
 * @access  Public
 */
exports.chatbot = async (req, res, next) => {
    try {
        const { message } = req.body;

        // Placeholder response - integrate with AI service later
        const response = {
            reply: "Thank you for your message. Our chatbot integration is coming soon. Please contact us via the contact form for immediate assistance."
        };

        successResponse(res, 200, 'Chatbot response', response);
    } catch (error) {
        next(error);
    }
};
