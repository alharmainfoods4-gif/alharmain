import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, EyeOff, Calendar, Building2, Package, Loader2 } from 'lucide-react';
import FormInput from '../components/FormInput';
import { api } from '../utils/api';

const AddPrivateProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        companyName: '',
        items: '',
        itemQuantity: '',
        totalPrice: '',
        transactionType: 'debit', // debit or credit
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const transactionData = {
                ...formData,
                totalPrice: parseFloat(formData.totalPrice) || 0,
                itemQuantity: parseFloat(formData.itemQuantity) || 0,
                isPrivate: true,
            };

            await api.post('/transactions', transactionData);
            alert('Payment saved successfully!');
            navigate('/saved');
        } catch (error) {
            console.error('Error saving transaction:', error);
            alert(error.message || 'Failed to save transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/saved')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-white" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Company Payment</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Record manual company sales, payments, and ledger entries
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Privacy Notice */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <EyeOff className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Private Payment Record</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                    This record will be saved for internal records only and will not appear on your website.
                                    Perfect for B2B sales, manual company orders, and ledger management.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Payment Information
                        </h3>
                        <div className="space-y-4">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                />
                            </div>

                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                                    <Building2 className="w-4 h-4 inline mr-2" />
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Enter company name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                />
                            </div>

                            {/* Items */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                                    <Package className="w-4 h-4 inline mr-2" />
                                    Items / Products
                                </label>
                                <textarea
                                    name="items"
                                    rows="3"
                                    placeholder="Enter item details (e.g., Rice 50kg, Oil 20L, etc.)"
                                    value={formData.items}
                                    onChange={handleChange}
                                    required
                                    className="input resize-none"
                                />
                            </div>

                            {/* Item Quantity & Total Price */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormInput
                                    label="Item Quantity"
                                    type="number"
                                    name="itemQuantity"
                                    placeholder="Enter quantity"
                                    value={formData.itemQuantity}
                                    onChange={handleChange}
                                    required
                                />
                                <FormInput
                                    label="Total Price (Rs.)"
                                    type="number"
                                    name="totalPrice"
                                    placeholder="0.00"
                                    value={formData.totalPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Notes (Optional) */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    rows="2"
                                    placeholder="Any additional information..."
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="input resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Right Side */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Transaction Type */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Payment Type
                        </h3>
                        <div className="space-y-3">
                            {/* Debit Option */}
                            <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.transactionType === 'debit'
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'border-gray-200 dark:border-slate-700 hover:border-red-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="transactionType"
                                    value="debit"
                                    checked={formData.transactionType === 'debit'}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                                <div className="flex-1 text-sm">
                                    Debit (Receivable)
                                </div>
                            </label>

                            {/* Credit Option */}
                            <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.transactionType === 'credit'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-slate-700 hover:border-green-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="transactionType"
                                    value="credit"
                                    checked={formData.transactionType === 'credit'}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                                <div className="flex-1 text-sm">
                                    Credit (Paid)
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="card p-6 space-y-3">
                        <button
                            type="button"
                            onClick={() => navigate('/saved')}
                            className="w-full btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Payment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddPrivateProduct;
