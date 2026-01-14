/**
 * Vercel Serverless Function Entry Point
 * Al-Harmain Premium Foods E-Commerce Backend
 */

// Fix for querySrv EREFUSED error by overriding default DNS resolver
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

require('dotenv').config();

const express = require('express');
const connectDB = require('../config/database');

// Create a wrapper handler that ensures DB connection
let appModule;
let dbConnectionPromise = null;

const handler = async (req, res) => {
    try {
        // Ensure database is connected
        if (!dbConnectionPromise) {
            dbConnectionPromise = connectDB();
        }
        await dbConnectionPromise;

        // Load app module after DB connection is confirmed
        if (!appModule) {
            appModule = require('../app');
        }

        // Handle the request
        return appModule(req, res);
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(503).json({
            status: 'error',
            message: 'Service temporarily unavailable',
            details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        });
    }
};

// Export the handler
module.exports = handler;
