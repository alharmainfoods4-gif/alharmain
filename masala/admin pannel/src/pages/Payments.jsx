import React from 'react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

const Payments = () => {
    // Empty data - no mock payments
    const emptyPayments = [];

    const columns = [
        { key: 'id', label: 'Payment ID' },
        { key: 'orderId', label: 'Order ID' },
        { key: 'amount', label: 'Amount' },
        { key: 'method', label: 'Payment Method' },
        { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
        { key: 'date', label: 'Date' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Track payment transactions and methods
                </p>
            </div>

            {/* Payments Table - Empty State */}
            <DataTable
                columns={columns}
                data={emptyPayments}
                onView={(item) => alert(`View payment details: ${item.id}`)}
            />
        </div>
    );
};

export default Payments;
