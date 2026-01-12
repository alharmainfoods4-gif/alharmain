import React, { useState } from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const handleProfileClick = () => {
        setShowProfile(false);
        navigate('/settings');
    };

    const handleLogout = () => {
        setShowProfile(false);
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    };



    const notifications = [
        { id: 1, text: 'New order received', time: '5 min ago' },
        { id: 2, text: 'User registration', time: '10 min ago' },
        { id: 3, text: 'Payment processed', time: '1 hour ago' },
    ];

    return (
        <header className="sticky top-0 z-20 h-16 bg-white dark:bg-slate-950 border-b-2 border-gray-200 dark:border-slate-800">
            <div className="h-full px-4 flex items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-700 dark:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden sm:block flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-white" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:outline-none focus:border-primary-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">


                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-700 dark:text-white"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {showNotifications && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowNotifications(false)}
                                />
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-lg border-2 border-gray-200 dark:border-slate-800 z-20">
                                    <div className="p-4 border-b-2 border-gray-200 dark:border-slate-800">
                                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className="p-4 border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                            >
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.text}</p>
                                                <p className="text-xs text-gray-600 dark:text-white/80 mt-1">
                                                    {notif.time}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="hidden md:block text-sm font-semibold text-gray-900 dark:text-white">
                                {user?.name || 'Admin User'}
                            </span>
                        </button>

                        {showProfile && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border-2 border-gray-200 dark:border-slate-800 z-20">
                                    <div className="p-2">
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            Settings
                                        </button>
                                        <hr className="my-2 border-gray-200 dark:border-slate-700" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
