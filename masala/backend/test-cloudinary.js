require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
    console.log('Testing Cloudinary Connection...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

    try {
        const result = await cloudinary.api.ping();
        console.log('✅ Cloudinary Connection Successful!');
        console.log('Result:', result);
        process.exit(0);
    } catch (error) {
        console.error('❌ Cloudinary Connection Failed!');
        console.error('Error Details:', error.message);
        process.exit(1);
    }
}

testCloudinary();
