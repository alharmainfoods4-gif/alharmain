import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import FormInput from '../components/FormInput';
import { api } from '../utils/api';

const AddProduct = () => {
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
    });

    // Dynamic weight-based pricing state
    const [variants, setVariants] = useState([]);

    // images will be an array of: { url: string, file: File | null }
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // New state for existing images

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
                    price: productData.basePrice || '', // Changed from 'price' to 'basePrice'
                    stock: productData.stock || 0, // Default to 0
                    status: productData.isActive ? 'active' : 'draft', // Keep existing status logic
                    featured: productData.isFeatured || false,
                    // New fields from the instruction
                    isGramPricing: productData.isGramPricing || false,
                    gramOptions: productData.gramOptions || [],
                    isActive: productData.isActive !== undefined ? productData.isActive : true, // This seems redundant with 'status'
                    badges: productData.badges || []
                });

                // Populate variants
                if (productData.variants && productData.variants.length > 0) {
                    setVariants(productData.variants.map(v => ({
                        size: v.size.replace('g', ''),
                        price: v.price.toString()
                    })));
                } else {
                    setVariants([]);
                }
                setImages((productData.images || []).map(url => ({ url, file: null })));
                setExistingImages(productData.images || []); // Set existing images
            } catch (error) {
                console.error('Error fetching product:', error);
                alert('Failed to load product data'); // Keep existing alert
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
            // First, upload new images
            const newImageItems = images.filter(img => img.file !== null);
            let finalImages = images.filter(img => img.file === null).map(img => img.url);

            if (newImageItems.length > 0) {
                const uploadFormData = new FormData();
                newImageItems.forEach(item => uploadFormData.append('images', item.file));

                const token = localStorage.getItem('adminToken');
                const uploadResponse = await fetch('http://localhost:5000/api/upload/multiple', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: uploadFormData
                });

                if (!uploadResponse.ok) throw new Error('Image upload failed');
                const uploadData = await uploadResponse.json();

                // Active backend returns { success: true, images: [{ url, publicId }, ...] }
                // We handle both nested 'data' and flat response for resilience
                const newUploadedUrls = (uploadData.data?.images || uploadData.images || [])
                    .map(img => typeof img === 'string' ? img : img.url);

                // Also handle single image fallback if backend returned that
                if (newUploadedUrls.length === 0 && (uploadData.data?.url || uploadData.url)) {
                    newUploadedUrls.push(uploadData.data?.url || uploadData.url);
                }

                finalImages = [...finalImages, ...newUploadedUrls];
            }

            // Prepare variants from dynamic inputs
            const finalVariants = variants
                .filter(v => v.size !== '' && v.price !== '')
                .map(v => ({
                    size: v.size.includes('g') ? v.size : `${v.size}g`,
                    price: parseFloat(v.price),
                    sku: `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${v.size}g`,
                    stock: parseInt(formData.stock) || 0
                }));

            const productData = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                basePrice: parseFloat(formData.price) || (finalVariants.length > 0 ? finalVariants[0].price : 0),
                stock: parseInt(formData.stock) || 0,
                isActive: isDraft ? false : (formData.status === 'active'),
                isFeatured: formData.featured,
                images: finalImages,
                variants: finalVariants
            };

            if (isEdit) {
                await api.put(`/products/${id}`, productData);
            } else {
                await api.post('/products', productData);
            }
            alert(`Product ${isDraft ? 'saved as draft' : (isEdit ? 'updated' : 'published')} successfully!`);
            navigate('/products');
        } catch (error) {
            console.error('Error creating product:', error);
            alert(error.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-800">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading product details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/products')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-white" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {isEdit ? `Update details for "${formData.name}"` : 'Manually add a product to your inventory'}
                    </p>
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Basic Information
                        </h3>
                        <div className="space-y-4">
                            <FormInput
                                label="Product Name"
                                type="text"
                                name="name"
                                placeholder="Enter product name"
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
                                    placeholder="Enter product description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="input resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                                        Category
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
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Pricing & Inventory
                        </h3>

                        {/* Dynamic Variants */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                                    Price by Weight (Gram)
                                </h4>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    + Add New Variant
                                </button>
                            </div>

                            <div className="space-y-3">
                                {variants.length === 0 && (
                                    <p className="text-sm text-gray-500 italic py-2">No variants added yet. Click "+ Add New Variant" to begin.</p>
                                )}
                                {variants.map((v, index) => (
                                    <div key={index} className="flex items-end gap-3 group animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                Weight (Gram)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 100"
                                                value={v.size}
                                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                                className="input"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                Price (Rs)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={v.price}
                                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                className="input"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="p-2.5 mb-0.5 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remove Variant"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Base Price (if no variants)"
                                type="number"
                                name="price"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                            />
                            <FormInput
                                label="Stock Quantity"
                                type="number"
                                name="stock"
                                placeholder="0"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Product Images
                        </h3>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-6 text-center">
                                <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                                <label className="cursor-pointer">
                                    <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                        Click to upload
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400"> or drag and drop</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>

                            {/* Image Preview */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={img.url}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-slate-700"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Right Side */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Product Status */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Product Status
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 dark:border-slate-700"
                                />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Featured Product
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="card p-6 space-y-3">
                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="w-full btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            className="w-full h-10 px-5 text-sm font-semibold text-gray-700 dark:text-white bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                            ) : (
                                'Save as Draft'
                            )}
                        </button>
                        <button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? 'Update Product' : 'Publish Product'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;

