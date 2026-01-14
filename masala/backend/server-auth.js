/**
 * Main Server File with Auth Integration
 * Al-Harmain Foods - Authentication System
 */

// Fix for querySrv EREFUSED error by overriding default DNS resolver
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://alharmain-dun.vercel.app'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for now to debug, but preferably restrict
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Routes
app.use('/api/auth', authRoutes);

// Category Routes (Phase 2)
const categoryRoutes = require('./src/routes/category.routes');
app.use('/api/categories', categoryRoutes);

// Product Routes (Phase 2)
const productRoutes = require('./src/routes/product.routes');
app.use('/api/products', productRoutes);

// Cart Routes (Phase 3)
const cartRoutes = require('./src/routes/cart.routes');
app.use('/api/cart', cartRoutes);

// Order Routes (Phase 3)
const orderRoutes = require('./src/routes/order.routes');
app.use('/api/orders', orderRoutes);

// Wholesale Routes (Phase 3)
const wholesaleRoutes = require('./src/routes/wholesale.routes');
app.use('/api/wholesale', wholesaleRoutes);

// Upload Routes (Phase 3)
const uploadRoutes = require('./src/routes/upload.routes');
app.use('/api/upload', uploadRoutes);

// CMS Routes (Phase 3)
const cmsRoutes = require('./src/routes/cms.routes');
app.use('/api/cms', cmsRoutes);

// Admin Routes (Extra)
const adminRoutes = require('./src/routes/admin.routes');
app.use('/api/admin', adminRoutes);

// Transaction Routes (Extra)
const transactionRoutes = require('./src/routes/transaction.routes');
app.use('/api/transactions', transactionRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🌟 Al-Harmain Foods Auth API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login'
        },
        documentation: 'See AUTH_SYSTEM.md for API docs',
        postman: 'Import Al-Harmain-Auth.postman_collection.json'
    });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Al-Harmain Auth API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    console.log(`✅ Auth endpoints ready:`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login\n`);
});

module.exports = app;
