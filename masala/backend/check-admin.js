require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.model');
const connectDB = require('./src/config/db');

const checkAdmin = async () => {
    try {
        await connectDB();

        const email = 'admin@alharmainfoods.com';
        const password = 'Admin123!@';

        console.log(`Checking for user: ${email}`);
        let user = await User.findOne({ email });

        if (user) {
            console.log('User found. Updating role to admin and resetting password...');
            user.role = 'admin';
            user.password = password;
            user.isActive = true;
            await user.save();
            console.log('User updated successfully!');
        } else {
            console.log('User not found. Creating new admin user...');
            user = await User.create({
                name: 'System Admin',
                email: email,
                password: password,
                role: 'admin',
                isActive: true
            });
            console.log('Admin user created successfully!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkAdmin();
