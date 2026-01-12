import React, { useState, useEffect } from 'react';
import { Loader2, Eye, Edit, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { api } from '../utils/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [statusNote, setStatusNote] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders/admin/all');
            // Handle both array and object (nested or flat) responses
            const orderList = Array.isArray(response)
                ? response
                : (response.data?.orders || response.data || response.orders || []);
            setOrders(orderList);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleView = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setSubmitting(true);
        try {
            await api.put(`/orders/${orderId}/status`, {
                status: newStatus,
                note: statusNote || `Status updated to ${newStatus}`
            });
            alert('Order status updated successfully');
            setStatusNote('');
            setIsModalOpen(false);
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            alert(error.message || 'Failed to update status');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            key: 'orderNumber',
            label: 'Order #',
            render: (value, row) => (
                <div className="flex items-center gap-2">
                    {value}
                    {row.isGiftBox && (
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 rounded text-[10px] font-bold uppercase tracking-wider">
                            Gift
                        </span>
                    )}
                </div>
            )
        },
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        View and manage customer orders
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-800">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading orders...</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={orders}
                    onView={handleView}
                />
            )}

            {/* Order Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Order Details: ${selectedOrder?.orderNumber}`}
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer</h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedOrder.user?.name}</p>
                                <p className="text-xs text-gray-500">{selectedOrder.user?.email}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment</h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedOrder.paymentMethod}</p>
                                <StatusBadge status={selectedOrder.paymentStatus} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gift Box</h4>
                                <p className={`text-sm font-bold ${selectedOrder.isGiftBox ? 'text-pink-600' : 'text-gray-500'}`}>
                                    {selectedOrder.isGiftBox ? 'YES' : 'NO'}
                                </p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Shipping Address</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}<br />
                                {selectedOrder.shippingAddress?.postalCode}, {selectedOrder.shippingAddress?.phone}
                            </p>
                        </div>

                        {/* Items */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Items</h4>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            {item.image && <img src={item.image} className="w-8 h-8 rounded object-cover" />}
                                            <span>{item.name} x {item.quantity}</span>
                                        </div>
                                        <span className="font-medium">Rs. {item.price * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between font-bold pt-2">
                                    <span>Total Amount</span>
                                    <span className="text-blue-600">Rs. {selectedOrder.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Update */}
                        <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Update Order Status</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                                        disabled={submitting || selectedOrder.status === status}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                                            ${selectedOrder.status === status
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                placeholder="Add a note about this status change..."
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                                className="input h-20 resize-none text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;
