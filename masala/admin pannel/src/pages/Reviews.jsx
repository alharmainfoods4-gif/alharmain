import React, { useState, useEffect } from 'react';
import { Loader2, Star, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { api } from '../utils/api';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState({ products: 0, reviews: 0, error: null });

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        rating: 5,
        comment: ''
    });

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products?limit=1000&includeReviews=true');
            // Handle { status: 'success', data: { products: [...] } }
            const products = Array.isArray(response)
                ? response
                : (response.data?.products || response.products || (Array.isArray(response.data) ? response.data : []));

            const allReviews = products.flatMap(product =>
                (product.reviews || []).map(review => ({
                    ...review,
                    productName: product.name,
                    productImage: product.images?.[0] || product.image,
                    productId: product._id || product.id,
                    _id: review._id || `${product._id}-${Math.random()}`
                }))
            );

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

    const handleDelete = async (review) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                // DELETE /api/products/:id/reviews/:reviewId
                await api.delete(`/products/${review.productId}/reviews/${review._id}`);
                alert('Review deleted successfully');
                fetchReviews();
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('Failed to delete review');
            }
        }
    };

    const handleEditClick = (review) => {
        setEditingReview(review);
        setFormData({
            name: review.name || 'Anonymous',
            rating: review.rating,
            comment: review.comment
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/products/${editingReview.productId}/reviews/${editingReview._id}`, formData);
            alert('Review updated successfully');
            setIsEditModalOpen(false);
            fetchReviews();
        } catch (error) {
            console.error('Error updating review:', error);
            alert('Failed to update review');
        } finally {
            setSubmitting(false);
        }
    };

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
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEditClick(row)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-blue-600"
                        title="Edit Review"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-red-600"
                        title="Delete Review"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage customer feedback (Edit or Delete)
                    </p>
                </div>
            </div>

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

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Review"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    <FormInput
                        label="Customer Name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                            Rating (1-5)
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className={`text-2xl transition-colors ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                            Review Comment
                        </label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="btn-secondary"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex items-center justify-center gap-2 min-w-[120px]"
                            disabled={submitting}
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Reviews;
