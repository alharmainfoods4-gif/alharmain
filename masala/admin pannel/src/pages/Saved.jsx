import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2, EyeOff, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

const Saved = () => {
    const navigate = useNavigate();
    const [savedTransactions, setSavedTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/transactions');
            // Handle both array and object (nested or flat) responses
            const transactionList = Array.isArray(response)
                ? response
                : (response.data?.transactions || response.transactions || []);
            setSavedTransactions(transactionList);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                alert('Transaction deleted successfully');
                fetchTransactions();
            } catch (error) {
                console.error('Error deleting transaction:', error);
                alert(error.message || 'Failed to delete transaction');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-800">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading transactions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Payments</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage private company sales, ledger, and payments
                    </p>
                </div>
                <button
                    onClick={() => navigate('/saved/add')}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Payment
                </button>
            </div>

            {/* Transactions Table or Empty State */}
            {savedTransactions.length === 0 ? (
                <div className="card">
                    <div className="text-center py-20">
                        <EyeOff className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Transactions Yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                            You haven't added any company transactions yet. These records won't appear on your website and are perfect for B2B sales and ledger management.
                        </p>
                        <button
                            onClick={() => navigate('/saved/add')}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Transaction
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                        Company Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                        Total Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                                {savedTransactions.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatDate(transaction.date)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {transaction.companyName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {transaction.items}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {transaction.itemQuantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                Rs. {parseFloat(transaction.totalPrice).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {transaction.transactionType === 'debit' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                    <TrendingDown className="w-3 h-3" />
                                                    Debit
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Credit
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        const details = `
Transaction Details:
━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${formatDate(transaction.date)}
Company: ${transaction.companyName}
Items: ${transaction.items}
Quantity: ${transaction.itemQuantity}
Total Price: Rs. ${parseFloat(transaction.totalPrice).toLocaleString()}
Type: ${transaction.transactionType === 'debit' ? 'Debit (Receivable)' : 'Credit (Paid)'}
${transaction.notes ? `Notes: ${transaction.notes}` : ''}
                                                        `;
                                                        alert(details.trim());
                                                    }}
                                                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(transaction._id)}
                                                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete Transaction"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer with Summary */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Showing <span className="font-semibold text-gray-900 dark:text-white">{savedTransactions.length}</span> transaction{savedTransactions.length !== 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Total Debit: </span>
                                    <span className="font-semibold text-red-600 dark:text-red-400">
                                        Rs. {savedTransactions
                                            .filter(t => t.transactionType === 'debit')
                                            .reduce((sum, t) => sum + parseFloat(t.totalPrice), 0)
                                            .toLocaleString()}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Total Credit: </span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        Rs. {savedTransactions
                                            .filter(t => t.transactionType === 'credit')
                                            .reduce((sum, t) => sum + parseFloat(t.totalPrice), 0)
                                            .toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Saved;
