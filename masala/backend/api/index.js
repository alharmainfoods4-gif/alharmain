/**
 * Vercel Serverless Function Entry Point
 * Al-Harmain Premium Foods E-Commerce Backend
 */

// Fix for querySrv EREFUSED error by overriding default DNS resolver
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

require('dotenv').config();
const app = require('../app');
const connectDB = require('../config/database');

// Connect to database
let isConnected = false;

const connectOnce = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
};

// Ensure DB is connected before handling requests
connectOnce();

// Export the Express app as a Vercel serverless function
module.exports = app;
