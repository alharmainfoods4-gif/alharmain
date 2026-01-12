export const mockData = {
    stats: [
        { id: 1, title: 'Total Users', value: '8,234', change: '+12.5%', trend: 'up' },
        { id: 2, title: 'Total Sales', value: '$45,678', change: '+8.2%', trend: 'up' },
        { id: 3, title: 'Monthly Revenue', value: '$123,456', change: '+23.1%', trend: 'up' },
        { id: 4, title: 'Active Orders', value: '342', change: '-4.3%', trend: 'down' },
    ],

    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2024-02-20' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Pending', joinDate: '2024-03-10' },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Moderator', status: 'Active', joinDate: '2024-01-28' },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Blocked', joinDate: '2024-02-14' },
    ],

    products: [
        { id: 1, name: 'Product A', category: 'Electronics', price: '$299', stock: 45, status: 'Active' },
        { id: 2, name: 'Product B', category: 'Clothing', price: '$49', stock: 120, status: 'Active' },
        { id: 3, name: 'Product C', category: 'Electronics', price: '$599', stock: 8, status: 'Active' },
        { id: 4, name: 'Product D', category: 'Home & Garden', price: '$89', stock: 0, status: 'Blocked' },
        { id: 5, name: 'Product E', category: 'Electronics', price: '$399', stock: 23, status: 'Active' },
    ],

    orders: [
        { id: '#ORD-001', customer: 'John Doe', total: '$299', status: 'Active', date: '2024-12-15' },
        { id: '#ORD-002', customer: 'Jane Smith', total: '$149', status: 'Pending', date: '2024-12-16' },
        { id: '#ORD-003', customer: 'Bob Johnson', total: '$599', status: 'Active', date: '2024-12-16' },
        { id: '#ORD-004', customer: 'Alice Williams', total: '$89', status: 'Blocked', date: '2024-12-17' },
        { id: '#ORD-005', customer: 'Charlie Brown', total: '$449', status: 'Pending', date: '2024-12-17' },
    ],

    payments: [
        { id: 'PAY-001', orderId: '#ORD-001', amount: '$299', method: 'Credit Card', status: 'Active', date: '2024-12-15' },
        { id: 'PAY-002', orderId: '#ORD-002', amount: '$149', method: 'PayPal', status: 'Pending', date: '2024-12-16' },
        { id: 'PAY-003', orderId: '#ORD-003', amount: '$599', method: 'Credit Card', status: 'Active', date: '2024-12-16' },
        { id: 'PAY-004', orderId: '#ORD-005', amount: '$449', method: 'Bank Transfer', status: 'Pending', date: '2024-12-17' },
    ],

    chartData: {
        monthlySales: [
            { month: 'Jan', sales: 4000 },
            { month: 'Feb', sales: 3000 },
            { month: 'Mar', sales: 5000 },
            { month: 'Apr', sales: 4500 },
            { month: 'May', sales: 6000 },
            { month: 'Jun', sales: 5500 },
        ],
        revenueData: [
            { month: 'Jan', revenue: 12000 },
            { month: 'Feb', revenue: 15000 },
            { month: 'Mar', revenue: 18000 },
            { month: 'Apr', revenue: 16000 },
            { month: 'May', revenue: 22000 },
            { month: 'Jun', revenue: 25000 },
        ],
    },
};
