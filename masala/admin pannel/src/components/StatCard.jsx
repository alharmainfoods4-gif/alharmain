import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, trend, icon: Icon, color = 'primary' }) => {
    const colorClasses = {
        primary: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50',
        green: 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50',
        yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50',
        red: 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50',
    };

    return (
        <div className="bg-transparent border-0 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-white/90 mb-2 uppercase tracking-wider">
                        {title}
                    </p>
                    <p className="text-4xl font-bold text-white mb-3 drop-shadow-sm">
                        {value}
                    </p>
                    <div className="flex items-center text-sm">
                        {trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-white/90 mr-1" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-white/90 mr-1" />
                        )}
                        <span className="font-bold text-white">
                            {change}
                        </span>
                        <span className="text-white/80 ml-1">vs last month</span>
                    </div>
                </div>
                {Icon && (
                    <div className={`p-5 rounded-2xl ${colorClasses[color]} transform transition-transform duration-300 hover:scale-110`}>
                        <Icon className="w-8 h-8" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
