import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    CreditCard,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    Wallet,
    Gift,
    Star,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const menuItems = [
    { id: 1, label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 2, label: 'Users Management', icon: Users, path: '/users' },
    { id: 9, label: 'Categories', icon: LayoutDashboard, path: '/categories' },
    { id: 3, label: 'Products / Listings', icon: Package, path: '/products' },
    { id: 10, label: 'Gift Boxes', icon: Gift, path: '/gift-boxes' },
    { id: 4, label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { id: 11, label: 'Reviews', icon: Star, path: '/reviews' },
    { id: 5, label: 'Company Payment', icon: Wallet, path: '/saved' },
    { id: 7, label: 'Reports / Analytics', icon: BarChart3, path: '/reports' },
    { id: 8, label: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { logout } = useAuth();
    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    };


    const closeMobile = () => {
        if (window.innerWidth < 768) {
            setIsMobileOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:sticky top-0 left-0 h-screen bg-gray-50 dark:bg-slate-950 border-r-2 border-gray-200 dark:border-slate-800 transition-all duration-300 z-40 ${isCollapsed ? 'md:w-20' : 'md:w-64'
                    } ${isMobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b-2 border-gray-200 dark:border-slate-800">
                        {!isCollapsed && (
                            <h1 className="text-xl font-bold text-primary-600 dark:text-white">
                                Admin Panel
                            </h1>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden md:flex p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-700 dark:text-white"
                        >
                            <ChevronLeft
                                className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2">
                        <ul className="space-y-1">
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    <NavLink
                                        to={item.path}
                                        onClick={closeMobile}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${isActive
                                                ? 'bg-primary-600 text-white'
                                                : 'text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-800'
                                            } ${isCollapsed ? 'justify-center' : ''}`
                                        }
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t-2 border-gray-200 dark:border-slate-800">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium ${isCollapsed ? 'justify-center' : ''
                                }`}
                            title={isCollapsed ? 'Logout' : ''}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
