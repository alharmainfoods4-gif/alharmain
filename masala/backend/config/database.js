/**
 * MongoDB Database Configuration
 * Optimized for Vercel Serverless Environment
 */

const mongoose = require('mongoose');

// Cache the connection across serverless invocations
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    // Return cached connection if available
    if (cached.conn) {
        console.log('✅ Using cached MongoDB connection');
        return cached.conn;
    }

    // Return pending connection promise if one exists
    if (cached.promise) {
        console.log('⏳ Waiting for existing connection promise');
        cached.conn = await cached.promise;
        return cached.conn;
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('🔌 Creating new MongoDB connection...');

    // Create connection with optimized settings for serverless
    cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 25000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        family: 4 // Force IPv4
    });

    try {
        cached.conn = await cached.promise;
        console.log(`✅ MongoDB Connected: ${cached.conn.connection.host}`);
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
