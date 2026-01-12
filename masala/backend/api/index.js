/**
 * Vercel Serverless Function Entry Point
 * Al-Harmain Premium Foods E-Commerce Backend
 */

// Fix for querySrv EREFUSED error by overriding default DNS resolver
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

require('dotenv').config();

let app;

try {
    const connectDB = require('../config/database');
    app = require('../app');

    // Connect to database on cold start
    connectDB().catch(err => console.error('DB Connection Error:', err.message));
} catch (error) {
    console.error('Module loading error:', error);

    // Return a minimal express app with error message
    const express = require('express');
    app = express();
    app.use('*', (req, res) => {
        res.status(500).json({
            error: 'Server initialization failed',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    });
}

// Export the Express app as a Vercel serverless function
module.exports = app;

