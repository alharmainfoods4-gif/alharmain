const mongoose = require('mongoose');
require('dotenv').config();

const checkSpices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await mongoose.connection.db.collection('products').find({ name: 'spices' }).toArray();
        console.log(JSON.stringify(products, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error('DB Error:', err);
    }
};

checkSpices();
