const mongoose = require('mongoose');

// Fix for querySrv EREFUSED error by overriding default DNS resolver
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

require('dotenv').config();

const checkCart = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- DB Check ---');

        const carts = await mongoose.connection.db.collection('carts').find({}).toArray();
        console.log(`Found ${carts.length} carts`);
        carts.forEach(cart => {
            console.log(`Cart for User ${cart.user}:`);
            cart.items.forEach(item => {
                console.log(` - Product ID: ${item.product}, Name: ${item.name}, Qty: ${item.quantity}`);
            });
        });

        const products = await mongoose.connection.db.collection('products').find({}).toArray();
        console.log(`\nAll Products (${products.length}):`);
        products.forEach(p => {
            console.log(` - ${p._id}: ${p.name}`);
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error('DB Error:', err);
    }
};

checkCart();
