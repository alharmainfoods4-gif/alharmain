import React, { useState, useEffect } from 'react';
import { Plus, Grid, List, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { api } from '../utils/api';

const Products = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('list');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Fetch products - get all for now to let DataTable handle local filtering/pagination
            const response = await api.get('/products?isGiftBox=false&limit=1000');
            // Handle both array and object (nested or flat) responses
            const productList = Array.isArray(response)
                ? response
                : (response.data?.products || response.products || (Array.isArray(response.data) ? response.data : []));
            setProducts(productList);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            try {
                await api.delete(`/products/${product._id}`);
                alert('Product deleted successfully');
                fetchProducts();
            } catch (err) {
                console.error('Error deleting product:', err);
                alert(err.message || 'Failed to delete product');
            }
        }
    };

    const columns = [
        { key: 'name', label: 'Product Name' },
        {
            key: 'category',
            label: 'Category',
            render: (value) => value?.name || 'Uncategorized'
        },
        {
            key: 'basePrice',
            label: 'Price',
            render: (value) => `Rs. ${value}`
        },
        { key: 'stock', label: 'Stock' },
        {
            key: 'isActive',
            label: 'Status',
            render: (value) => <StatusBadge status={value ? 'active' : 'draft'} />
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products / Listings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your product inventory
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex border-2 border-gray-300 dark:border-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/products/add')}
                        className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30 disabled:bg-blue-300 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Products View */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-800">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading products...</p>
                </div>
            ) : viewMode === 'list' ? (
                <DataTable
                    columns={columns}
                    data={products}
                    onEdit={(item) => navigate(`/products/edit/${item._id}`)}
                    onDelete={handleDelete}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className="card overflow-hidden group">
                                <div className="aspect-square bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Grid className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <StatusBadge status={product.isActive ? 'active' : 'draft'} />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{product.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.category?.name || 'Uncategorized'}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">Rs. {product.basePrice}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Stock: {product.stock}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full card py-20">
                            <div className="text-center">
                                <div className="text-gray-500 dark:text-gray-400">
                                    <Grid className="w-16 h-16 mx-auto mb-4 opacity-40" />
                                    <p className="text-lg font-medium">No products found</p>
                                    <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">
                                        Try adding a product to see it here
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Products;

