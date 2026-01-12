import React from 'react';
import { Calendar, FileText } from 'lucide-react';

const Reports = () => {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports / Analytics</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Detailed insights and analytics
                    </p>
                </div>
                <button
                    className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-slate-700 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-600 dark:hover:border-blue-500 active:bg-blue-100 active:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 disabled:text-gray-400 disabled:border-gray-400 transition-colors"
                >
                    <Calendar className="w-4 h-4" />
                    Date Range
                </button>
            </div>

            {/* Empty State for Reports */}
            <div className="card">
                <div className="text-center py-20">
                    <FileText className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Report Data Available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                        Analytics and reports will be generated once you have transaction data from your backend.
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                        Charts and graphs will appear here automatically
                    </p>
                </div>
            </div>

            {/* Export Section */}
            <div className="card p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Export Reports</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Download reports in various formats (available once data is connected)
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-secondary" disabled>Export as CSV</button>
                        <button className="btn-secondary" disabled>Export as PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
