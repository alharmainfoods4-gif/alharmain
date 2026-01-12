import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import categoryService from '../../services/category.service';
import productService from '../../services/product.service';
import orderService from '../../services/order.service';
import { FaFolder, FaBox, FaShoppingCart, FaBuilding } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalCategories: 0,
        totalProducts: 0,
        totalOrders: 0,
        loading: true,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [categories, products, orders] = await Promise.all([
                categoryService.getAll(),
                productService.getAll(),
                orderService.getAllOrders(),
            ]);

            setStats({
                totalCategories: categories.count || 0,
                totalProducts: products.count || 0,
                totalOrders: orders.count || 0,
                loading: false,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title="Total Categories"
                        value={stats.totalCategories}
                        loading={stats.loading}
                        icon={<FaFolder />}
                        color="bg-blue-500"
                    />
                    <StatsCard
                        title="Total Products"
                        value={stats.totalProducts}
                        loading={stats.loading}
                        icon={<FaBox />}
                        color="bg-green-500"
                    />
                    <StatsCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        loading={stats.loading}
                        icon={<FaShoppingCart />}
                        color="bg-orange-500"
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <ActionButton
                            label="Manage Categories"
                            icon={<FaFolder />}
                            onClick={() => navigate('/admin/categories')}
                        />
                        <ActionButton
                            label="Manage Products"
                            icon={<FaBox />}
                            onClick={() => navigate('/admin/products')}
                        />
                        <ActionButton
                            label="View Orders"
                            icon={<FaShoppingCart />}
                            onClick={() => navigate('/admin/orders')}
                        />
                        <ActionButton
                            label="Wholesale Accounts"
                            icon={<FaBuilding />}
                            onClick={() => navigate('/admin/wholesale')}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ title, value, loading, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600 mb-1">{title}</p>
                {loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                )}
            </div>
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl`}>
                {icon}
            </div>
        </div>
    </div>
);

// Action Button Component
const ActionButton = ({ label, icon, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition group"
    >
        <span className="text-3xl mb-2 group-hover:scale-110 transition">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
);

export default AdminDashboard;
