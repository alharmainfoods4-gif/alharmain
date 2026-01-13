import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2, Gift } from 'lucide-react';
import FormInput from '../components/FormInput';
import { api } from '../utils/api';

const AddGiftBox = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        status: 'active',
        featured: false,
        isGiftBox: true // Forced for this page
    });

    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories?all=true');
                const categoryList = Array.isArray(response)
                    ? response
                    : (response.data?.categories || response.categories || []);
                setCategories(categoryList);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchProduct = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/products/admin/${id}`);
                const productData = response.data?.product || response.product || response;

                setFormData({
                    name: productData.name || '',
                    description: productData.description || '',
                    category: productData.category?._id || productData.category || '',
                    price: productData.basePrice || '',
                    stock: productData.stock || 0,
                    status: productData.isActive ? 'active' : 'draft',
                    featured: productData.isFeatured || false,
                    isGiftBox: true
                });

                if (productData.variants && productData.variants.length > 0) {
                    setVariants(productData.variants.map(v => ({
                        size: v.size,
                        price: v.price.toString()
                    })));
                } else {
                    setVariants([]);
                }
                setImages((productData.images || []).map(url => ({ url, file: null })));
            } catch (error) {
                console.error('Error fetching gift box:', error);
                alert('Failed to load gift box data');
            } finally {
                setFetching(false);
            }
        };

        fetchCategories();
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addVariant = () => {
        setVariants([...variants, { size: '', price: '' }]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => {
            const item = prev[index];
            if (item.url.startsWith('blob:')) {
                URL.revokeObjectURL(item.url);
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e, isDraft = false) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newImageItems = images.filter(img => img.file !== null);
            let finalImages = images.filter(img => img.file === null).map(img => img.url);

            if (newImageItems.length > 0) {
                const uploadFormData = new FormData();
                newImageItems.forEach(item => uploadFormData.append('images', item.file));

                const token = localStorage.getItem('adminToken');
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const uploadResponse = await fetch(`${apiUrl}/upload/multiple`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: uploadFormData
                });

                if (!uploadResponse.ok) throw new Error('Image upload failed');
                const uploadData = await uploadResponse.json();
                const newUploadedUrls = (uploadData.data?.images || uploadData.images || [])
                    .map(img => typeof img === 'string' ? img : img.url);

                finalImages = [...finalImages, ...newUploadedUrls];
            }

            const finalVariants = variants
                .filter(v => v.size !== '' && v.price !== '')
                .map(v => ({
                    size: v.size,
                    price: parseFloat(v.price)
                }));

            const productData = {
                ...formData,
                basePrice: parseFloat(formData.price) || (finalVariants.length > 0 ? finalVariants[0].price : 0),
                stock: parseInt(formData.stock) || 0,
                isActive: isDraft ? false : (formData.status === 'active'),
                isFeatured: formData.featured,
                images: finalImages,
                variants: finalVariants,
                isGiftBox: true
            };

            if (isEdit) {
                await api.put(`/products/${id}`, productData);
            } else {
                await api.post('/products', productData);
            }
            alert(`Gift Box ${isDraft ? 'saved as draft' : (isEdit ? 'updated' : 'published')} successfully!`);
            navigate('/gift-boxes');
        } catch (error) {
            console.error('Error sharing gift box:', error);
            alert(error.message || 'Failed to save gift box');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-800">
                <Loader2 className="w-12 h-12 text-pink-600 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading gift box details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/gift-boxes')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-white" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Gift className="w-6 h-6 text-pink-500" />
                        {isEdit ? 'Edit Gift Box' : 'Add New Gift Box'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {isEdit ? `Update details for "${formData.name}"` : 'Create a new luxury gift box'}
                    </p>
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            General Information
                        </h3>
                        <div className="space-y-4">
                            <FormInput
                                label="Box Name"
                                type="text"
                                name="name"
                                placeholder="Enter box name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    placeholder="Describe the box contents and experience"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="input resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                                    Collection / Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Pricing
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Base Price (Rs.)"
                                type="number"
                                name="price"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                label="Available Stock"
                                type="number"
                                name="stock"
                                placeholder="0"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Variants Section - Simplified for Boxes */}
                        <div className="mt-6 border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Custom Sizes (Optional)</h4>
                                <button type="button" onClick={addVariant} className="text-sm font-bold text-pink-600 hover:pink-700">+ Add Option</button>
                            </div>
                            <div className="space-y-3">
                                {variants.map((v, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input type="text" placeholder="e.g. Medium Size" value={v.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} className="input flex-1" />
                                        <input type="number" placeholder="Price" value={v.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} className="input w-32" />
                                        <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-500"><X className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Box Images
                        </h3>
                        <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-6 text-center">
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <label className="cursor-pointer">
                                <span className="text-sm text-pink-600 font-semibold hover:underline">Upload Box Images</span>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                        {images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {images.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img src={img.url} className="w-full h-24 object-cover rounded-lg" />
                                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Publish</h3>
                        <div className="space-y-4">
                            <select name="status" value={formData.status} onChange={handleChange} className="input">
                                <option value="active">Active (Visible)</option>
                                <option value="draft">Draft (Hidden)</option>
                            </select>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded border-gray-300" />
                                <span className="text-sm font-medium">Feature on Homepage</span>
                            </label>
                        </div>
                    </div>

                    <div className="card p-6 space-y-3">
                        <button type="button" onClick={() => navigate('/gift-boxes')} className="w-full btn-secondary">Cancel</button>
                        <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? 'Update Gift Box' : 'Publish Gift Box'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddGiftBox;
