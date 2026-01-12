/**
 * Vercel Serverless Function Entry Point
 * Al-Harmain Premium Foods E-Commerce Backend
 */

// Fix for querySrv EREFUSED error by overriding default DNS resolver
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

require('dotenv').config();
const connectDB = require('../config/database');
const app = require('../app');

// Connect to database on cold start
connectDB().catch(err => console.error('DB Connection Error:', err.message));

// Export the Express app as a Vercel serverless function
module.exports = app;

