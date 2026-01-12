/**
 * Email Service
 * Handles all email sending operations
 */

const transporter = require('../config/email');

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (user) => {
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: user.email,
        subject: 'Welcome to Al-Harmain Premium Foods',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #C9A24D;">Welcome to Al-Harmain Foods!</h2>
                <p>Dear ${user.name},</p>
                <p>Thank you for joining Al-Harmain Premium Foods - where sacred quality meets premium taste.</p>
                <p>Your account has been successfully created. You can now:</p>
                <ul>
                    <li>Browse our premium product collection</li>
                    <li>Add items to your cart</li>
                    <li>Place orders with ease</li>
                    <li>Track your orders</li>
                </ul>
                <p style="margin-top: 30px;">Happy Shopping!</p>
                <p><strong>Al-Harmain Foods Team</strong></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent to:', user.email);
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
    }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetUrl) => {
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #C9A24D;">Password Reset Request</h2>
                <p>Dear ${user.name},</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #C9A24D; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                    Reset Password
                </a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p><strong>Al-Harmain Foods Team</strong></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent to:', user.email);
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw error;
    }
};

/**
 * Send order confirmation email
 */
const sendOrderConfirmationEmail = async (user, order) => {
    const itemsList = order.items.map(item =>
        `<li>${item.name} x ${item.quantity} - Rs. ${item.price * item.quantity}</li>`
    ).join('');

    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: user.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #C9A24D;">Order Confirmed!</h2>
                <p>Dear ${user.name},</p>
                <p>Thank you for your order. Your order has been confirmed.</p>
                
                <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
                    <h3>Order Details</h3>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                </div>

                <h3>Items Ordered:</h3>
                <ul>${itemsList}</ul>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #C9A24D;">
                    <p><strong>Total Amount: Rs. ${order.totalPrice}</strong></p>
                </div>

                <p style="margin-top: 30px;">You can track your order using the order number above.</p>
                <p><strong>Al-Harmain Foods Team</strong></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Order confirmation email sent to:', user.email);
    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error);
    }
};

/**
 * Send order status update email
 */
const sendOrderStatusEmail = async (user, order) => {
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: user.email,
        subject: `Order ${order.orderNumber} - Status Updated`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #C9A24D;">Order Status Update</h2>
                <p>Dear ${user.name},</p>
                <p>Your order status has been updated.</p>
                
                <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>New Status:</strong> <span style="color: #C9A24D; font-weight: bold;">${order.status}</span></p>
                </div>

                <p>Thank you for choosing Al-Harmain Foods!</p>
                <p><strong>Al-Harmain Foods Team</strong></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Order status email sent to:', user.email);
    } catch (error) {
        console.error('❌ Error sending order status email:', error);
    }
};

module.exports = {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail
};
