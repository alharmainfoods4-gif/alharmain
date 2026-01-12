import React, { useState, useEffect } from 'react';
import { Loader2, Star, MessageSquare } from 'lucide-react';
import DataTable from '../components/DataTable';
import { api } from '../utils/api';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState({ products: 0, reviews: 0, error: null, sample: null });

    const fetchReviews = async () => {
        setLoading(true);
        try {
            // Fetch all products to get their reviews
            const response = await api.get('/products?limit=1000&includeReviews=true');
            console.log('API Response:', response);
            // Handle { status: 'success', data: [...] } or direct array
            const products = Array.isArray(response) ? response : (response.data || response.products || []);
            console.log('Products fetched:', products.length);

            // Extract reviews from all products
            const allReviews = products.flatMap(product =>
                (product.reviews || []).map(review => ({
                    ...review,
                    productName: product.name,
                    productImage: product.images?.[0] || product.image,
                    productId: product._id || product.id,
                    // Ensure ID is unique for key
                    _id: review._id || `${product._id}-${Math.random()}`
                }))
            );
            console.log('Total reviews extracted:', allReviews.length);

            // Sort by date descending
            allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setDebugInfo({ products: products.length, reviews: allReviews.length, error: null });

            setReviews(allReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setDebugInfo(prev => ({ ...prev, error: error.message }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const columns = [
        {
            key: 'productName',
            label: 'Product',
            render: (value, row) => (
                <div className="flex items-center gap-2">
                    {row.productImage && <img src={row.productImage} alt="" className="w-8 h-8 rounded object-cover" />}
                    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                </div>
            )
        },
        {
            key: 'name',
            label: 'Customer',
            render: (value) => (
                <span className="font-medium text-gray-700 dark:text-gray-300">
                    {value || 'Anonymous'}
                </span>
            )
        },
        {
            key: 'rating',
            label: 'Rating',
            render: (value) => (
                <div className="flex text-yellow-500">
                    {'★'.repeat(value || 0)}
                    <span className="text-gray-300 dark:text-gray-600">{'★'.repeat(5 - (value || 0))}</span>
                </div>
            )
        },
        {
            key: 'comment',
            label: 'Review',
            render: (value) => <div className="max-w-md truncate text-gray-600 dark:text-gray-400" title={value}>{value}</div>
        },
        {
            key: 'createdAt',
            label: 'Date',
            render: (value) => <span className="text-gray-500 dark:text-gray-400">{new Date(value).toLocaleDateString()}</span>
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        View feedback and ratings from your customers
                    </p>
                </div>
            </div>

            {/* Debug Info Alert */}
            {reviews.length === 0 && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-blue-800 dark:text-blue-300">Debug Information</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                        Products Fetched: {debugInfo.products}<br />
                        Reviews Found: {debugInfo.reviews}<br />
                        Error: {debugInfo.error || 'None'}<br />
                        Timestamp: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-800">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading reviews...</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={reviews}
                />
            )}
        </div>
    );
};

export default Reviews;
