import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Upload, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { api } from '../utils/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        isActive: true,
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get('/categories?all=true');
            // Handle both array and object (nested or flat) responses
            const categoryList = Array.isArray(response)
                ? response
                : (response.data?.categories || response.categories || []);
            setCategories(categoryList);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // alert('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = () => {
        setModalMode('add');
        setSelectedCategory(null);
        setFormData({ name: '', isActive: true });
        setImage(null);
        setImagePreview('');
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setModalMode('edit');
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            isActive: category.isActive,
        });
        setImage(null);
        setImagePreview(category.image);
        setIsModalOpen(true);
    };

    const handleDelete = async (category) => {
        if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            try {
                await api.delete(`/categories/${category._id}`);
                alert('Category deleted successfully');
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert(error.message || 'Failed to delete category');
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let imageUrl = imagePreview;

            // Upload image if a new one is selected
            if (image) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', image);

                const token = localStorage.getItem('adminToken');
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const uploadResponse = await fetch(`${apiUrl}/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: uploadFormData
                });

                if (!uploadResponse.ok) throw new Error('Image upload failed');
                const uploadData = await uploadResponse.json();
                // backend SUCCESS response is { status: 'success', data: { url: '...', ... } }
                imageUrl = uploadData.data?.url || uploadData.url;
            }

            const categoryData = {
                ...formData,
                image: imageUrl
            };

            if (modalMode === 'add') {
                await api.post('/categories', categoryData);
                alert('Category created successfully');
            } else {
                await api.put(`/categories/${selectedCategory._id}`, categoryData);
                alert('Category updated successfully');
            }

            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            key: 'image',
            label: 'Image',
            render: (value) => (
                <img src={value} alt="Category" className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-slate-700" />
            )
        },
        { key: 'name', label: 'Name' },
        {
            key: 'isActive',
            label: 'Status',
            render: (value) => <StatusBadge status={value ? 'active' : 'inactive'} />
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your website's product categories
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-800">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading categories...</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="Category Name"
                        type="text"
                        placeholder="Enter category name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                            Category Image
                        </label>
                        <div className="flex items-center gap-4">
                            {imagePreview && (
                                <div className="relative w-20 h-20 rounded-lg border-2 border-gray-200 dark:border-slate-700 overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setImage(null); setImagePreview(''); }}
                                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                <Upload className="w-6 h-6 text-gray-400" />
                                <span className="text-[10px] text-gray-500 mt-1">Upload</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 dark:border-slate-700"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-900 dark:text-white">
                            Active Category
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
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
                            {modalMode === 'add' ? 'Create' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Categories;
