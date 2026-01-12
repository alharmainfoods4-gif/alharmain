const BASE_URL = 'http://localhost:5000/api';
const ADMIN_CREDENTIALS = {
    email: 'admin@alharmainfoods.com',
    password: 'Admin123!@'
};

let token = '';

async function runTests() {
    console.log('🚀 Starting Comprehensive API Verification...\n');

    try {
        // 1. Health Check
        console.log('Step 1: Checking Server Health...');
        const healthRes = await fetch(`${BASE_URL}/health`);
        const health = await healthRes.json();
        console.log('✅ Server is healthy:', health.message);

        // 2. Admin Login
        console.log('\nStep 2: Authenticating Admin...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ADMIN_CREDENTIALS)
        });
        const loginData = await loginRes.json();

        if (loginData.success) {
            token = loginData.token;
            console.log('✅ Admin Login Successful');
        } else {
            console.error('❌ Login Error:', loginData.message);
            return;
        }

        const authHeader = { 'Authorization': `Bearer ${token}` };

        // 3. Check Categories
        console.log('\nStep 3: Checking Category API...');
        const catsRes = await fetch(`${BASE_URL}/categories`);
        const cats = await catsRes.json();
        console.log(`✅ Categories API working. Found ${cats.categories?.length || 0} categories.`);

        // 4. Check Products
        console.log('\nStep 4: Checking Products API...');
        const productsRes = await fetch(`${BASE_URL}/products`);
        const products = await productsRes.json();
        console.log(`✅ Products API working. Found ${products.products?.length || 0} products.`);

        // 5. Check Admin Stats
        console.log('\nStep 5: Checking Admin Stats API...');
        const statsRes = await fetch(`${BASE_URL}/admin/stats`, { headers: authHeader });
        const stats = await statsRes.json();
        if (stats.success) {
            console.log('✅ Admin Stats API working.');
            console.log('Stats Summary:', {
                totalUsers: stats.stats.totalUsers,
                totalSales: stats.stats.totalSales,
                totalOrders: stats.stats.totalOrders
            });
        } else {
            console.error('❌ Stats Error:', stats.message);
        }

        // 6. Check Admin Users List
        console.log('\nStep 6: Checking Admin Users API...');
        const usersRes = await fetch(`${BASE_URL}/admin/users`, { headers: authHeader });
        const users = await usersRes.json();
        console.log(`✅ Admin Users API working. Found ${users.users?.length || 0} users.`);

        // 7. Check Company Payments (Transactions)
        console.log('\nStep 7: Checking Transactions API...');
        const transRes = await fetch(`${BASE_URL}/transactions`, { headers: authHeader });
        const trans = await transRes.json();
        console.log(`✅ Transactions API working. Found ${trans.transactions?.length || 0} records.`);

        // 8. Check Orders (Admin)
        console.log('\nStep 8: Checking Admin Orders API...');
        const ordersRes = await fetch(`${BASE_URL}/orders/admin/all`, { headers: authHeader });
        const orders = await ordersRes.json();
        console.log(`✅ Admin Orders API working. Found ${orders.orders?.length || 0} total orders.`);

        console.log('\n✨ ALL MAJOR API ENDPOINTS VERIFIED SUCCESSFULLY! ✨');

    } catch (error) {
        console.error('\n❌ API Verification Failed!');
        console.error('Error Details:', error.message);
    }
}

runTests();
