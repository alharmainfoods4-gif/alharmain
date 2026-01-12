import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, ShoppingBag, Loader2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { api } from '../utils/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        activeOrders: 0,
        totalSales: 0,
        monthlyRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch Stats (from src/ controllers which use direct success: true)
            const statsRes = await api.get('/admin/stats');
            if (statsRes.success || statsRes.status === 'success') {
                setStats(statsRes.data?.stats || statsRes.stats);
            }

            // Fetch Recent Orders (from main controllers which use data wrapping)
            const ordersRes = await api.get('/orders/admin/all?limit=5');
            // Handle both array and object (nested or flat) responses
            const recentOrdersList = Array.isArray(ordersRes)
                ? ordersRes
                : (ordersRes.data?.orders || ordersRes.data || ordersRes.orders || []);
            setRecentOrders(recentOrdersList);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const orderColumns = [
        { key: 'orderNumber', label: 'Order ID' },
        {
            key: 'user',
            label: 'Customer',
            render: (value) => value?.name || 'Guest'
        },
        {
            key: 'totalPrice',
            label: 'Total',
            render: (value) => `Rs. ${value}`
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <StatusBadge status={value} />
        },
        {
            key: 'createdAt',
            label: 'Date',
            render: (value) => new Date(value).toLocaleDateString()
        },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-800">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers.toString()}
                        change="Live"
                        trend="up"
                        icon={Users}
                        color="primary"
                    />
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <StatCard
                        title="Total Sales"
                        value={`Rs. ${stats.totalSales.toLocaleString()}`}
                        change="Overall"
                        trend="up"
                        icon={DollarSign}
                        color="green"
                    />
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
                    <StatCard
                        title="Monthly Revenue"
                        value={`Rs. ${stats.monthlyRevenue.toLocaleString()}`}
                        change="This Month"
                        trend="up"
                        icon={TrendingUp}
                        color="yellow"
                    />
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                    <StatCard
                        title="Active Orders"
                        value={stats.activeOrders.toString()}
                        change="Pending"
                        trend="up"
                        icon={ShoppingBag}
                        color="red"
                    />
                </div>
            </div>

            {/* Recent Orders Table */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Recent Orders
                </h3>
                <DataTable
                    columns={orderColumns}
                    data={recentOrders}
                />
            </div>
        </div>
    );
};

export default Dashboard;
