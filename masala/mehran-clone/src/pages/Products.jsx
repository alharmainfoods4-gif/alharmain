import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import productService from '../services/product.service';
import categoryService from '../services/category.service';
import orderService from '../services/order.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaBalanceScale, FaTimes, FaCheck, FaShoppingCart, FaStar, FaShieldAlt, FaLeaf, FaBoxOpen } from 'react-icons/fa';

import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Products.css';

gsap.registerPlugin(ScrollTrigger);

const Products = () => {
    const { addToCart, setIsGiftBoxOrder, clearCart } = useContext(CartContext);
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const containerRef = useRef(null);
    const isMobile = window.innerWidth <= 768;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [compareList, setCompareList] = useState([]);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutData, setCheckoutData] = useState({
        email: '',
        phone: '',
        fullName: '',
        address: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        paymentMethod: 'bank_transfer',
        notes: ''
    });
    const [isGiftBox, setIsGiftBox] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [orderSummary, setOrderSummary] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams(location.search);
                const isGiftBoxParam = params.get('giftbox') === 'true';

                const [productsRes, categoriesRes] = await Promise.all([
                    productService.getAll({ isGiftBox: isGiftBoxParam }),
                    categoryService.getAll()
                ]);

                // Match backend response format: { status: "success", data: [...] or { status: "success", data: { products/categories: [...] } }
                const productData = Array.isArray(productsRes) ? productsRes : (productsRes.data || productsRes.products || []);
                setProducts(Array.isArray(productData) ? productData : (productData.products || []));

                const categoryData = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes.data || categoriesRes.categories || []);
                setCategories(Array.isArray(categoryData) ? categoryData : (categoryData.categories || []));
            } catch (error) {
                console.error('Error fetching products/categories:', error);
                // Fallback to empty or toast if needed
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [location.search]);


    const paymentOptions = [
        {
            id: 'bank_transfer',
            label: 'Bank Transfer',
            title: 'Bank Transfer Instructions',
            details: (
                <div style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                        <p style={{ marginBottom: '0.5rem', color: 'var(--brand-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>Dubai Islamic Bank</p>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px' }}>
                            <p style={{ marginBottom: '0.3rem', fontSize: '0.9rem' }}><strong style={{ color: 'var(--brand-primary)' }}>Account Title:</strong> Muhammad Tariq</p>
                            <p style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--brand-primary)' }}>Account #:</strong> 0282874002</p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.2rem' }}>
                        <p style={{ marginBottom: '0.5rem', color: 'var(--brand-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>Meezan Bank</p>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px' }}>
                            <p style={{ marginBottom: '0.3rem', fontSize: '0.9rem' }}><strong style={{ color: 'var(--brand-primary)' }}>Account Title:</strong> Muhammad Tariq</p>
                            <p style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--brand-primary)' }}>Account #:</strong> 0030-0113901052</p>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem' }}>
                        Kindly Pay and whatsapp Screenshot of Payment Receipt on <strong style={{ color: 'var(--brand-primary)' }}>03432309181</strong> for Confirmation.
                    </p>
                </div>
            )
        },
        {
            id: 'cod',
            label: 'Cash On Delivery',
            title: 'Cash On Delivery',
            details: (
                <div style={{ textAlign: 'left' }}>
                    <p>Pay with cash when your luxury order arrives at your doorstep.</p>
                    <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Please keep the exact amount ready for a smooth transaction.</p>
                </div>
            )
        },
        {
            id: 'jazzcash',
            label: 'Pay by JazzCash',
            title: 'JazzCash Payment',
            details: (
                <div style={{ textAlign: 'left' }}>
                    <p style={{ marginBottom: '1rem' }}>Please transfer the total amount to our JazzCash account:</p>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                        <p style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--brand-primary)' }}>JazzCash #:</strong> 03432309181</p>
                        <p><strong style={{ color: 'var(--brand-primary)' }}>Name:</strong> Muhammad Tariq</p>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Send the transaction confirmation screenshot to our WhatsApp after payment.</p>
                </div>
            )
        },
        {
            id: 'easypaisa',
            label: 'Pay By EasyPaisa',
            title: 'EasyPaisa Payment',
            details: (
                <div style={{ textAlign: 'left' }}>
                    <p style={{ marginBottom: '1rem' }}>Please transfer the total amount to our EasyPaisa account:</p>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                        <p style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--brand-primary)' }}>EasyPaisa #:</strong> 03432309181</p>
                        <p><strong style={{ color: 'var(--brand-primary)' }}>Name:</strong> Muhammad Tariq</p>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Send the transaction confirmation screenshot to our WhatsApp after payment.</p>
                </div>
            )
        }
    ];

    const currentPaymentInfo = paymentOptions.find(o => o.id === checkoutData.paymentMethod) || paymentOptions[0];

    // Scroll to top on mount and Parse Query Params
    useEffect(() => {
        window.scrollTo(0, 0);
        const params = new URLSearchParams(location.search);
        const isGiftBoxParam = params.get('giftbox') === 'true';
        const catParam = params.get('category');
        if (catParam) {
            setSelectedCategory(catParam);
        }
        setIsGiftBox(isGiftBoxParam);
        setIsGiftBoxOrder(isGiftBoxParam);
    }, [location]);

    // Filter Logic
    const filteredProducts = products.filter(p => {
        // 1. Category Filter
        const matchesCategory = !selectedCategory || (typeof p.category === 'object' ? p.category?.name : p.category) === selectedCategory;

        // 2. Gift Box Filter (Strict)
        // If we are on Gift Box page, ONLY show items with isGiftBox === true
        // If we are NOT on Gift Box page, ONLY show items with isGiftBox !== true (false or undefined)
        const matchesType = isGiftBox ? (p.isGiftBox === true) : (p.isGiftBox !== true);

        return matchesCategory && matchesType;
    });

    // Animate cards on filter change
    // Animate cards on filter change
    useEffect(() => {
        if (loading) return;

        if (!selectedProduct) {
            const targets = document.querySelectorAll(".product-card-anim");
            if (targets.length > 0) {
                gsap.fromTo(targets,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out", overwrite: true }
                );
            }
        } else {
            // Reset selected variant when product changes to first available or null
            setSelectedVariant(selectedProduct.variants?.[0] || null);
            setQuantity(1); // Also reset quantity to 1
        }
    }, [selectedCategory, selectedProduct, loading]);

    // Handle Add to Compare
    const toggleCompare = (e, product) => {
        e.stopPropagation();
        if (compareList.find(p => p.id === product.id)) {
            setCompareList(compareList.filter(p => p.id !== product.id));
        } else {
            if (compareList.length < 3) {
                setCompareList([...compareList, product]);
            } else {
                alert("You can compare up to 3 items.");
            }
        }
    };

    // Handle Add to Cart with Animation
    const handleAddToCart = (e, product, qty = 1) => {
        e.stopPropagation();
        // If product has variants and we're on grid view (no selectedVariant), use first variant
        const variantToUse = product.variants && product.variants.length > 0
            ? (selectedVariant || product.variants[0])
            : selectedVariant;

        addToCart(product, qty, variantToUse);

        const btn = e.currentTarget;
        const originalContent = btn.innerHTML;
        btn.innerHTML = `<span style="display: flex; align-items: center; justify-content: center; gap: 0.5rem"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg> Added</span>`;
        btn.style.background = "#fff";
        btn.style.color = "#000";
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = "";
            btn.style.color = "";
        }, 1500);
    };

    const handleCompleteOrder = async () => {
        if (!isAuthenticated) {
            alert('Please sign in to complete your order.');
            setShowCheckout(false);
            window.scrollTo(0, 0);
            return;
        }

        // Validate required fields
        if (!checkoutData.email || !checkoutData.phone || !checkoutData.fullName ||
            !checkoutData.address || !checkoutData.city || !checkoutData.postalCode) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate Product Selection
        if (!selectedProduct) {
            alert("Error: No product selected.");
            return;
        }

        const productId = selectedProduct._id || selectedProduct.id;
        if (!productId) {
            console.error("Critical Error: Product ID missing in selectedProduct:", selectedProduct);
            alert(`System Error: Selected product data is incomplete (ID missing).\nPlease refresh the page and try again.\n\nDebug Info: ${JSON.stringify(selectedProduct, null, 2)}`);
            return;
        }

        try {
            // Calculate total using variant price
            const itemPrice = selectedVariant ? selectedVariant.price : (selectedProduct.basePrice || selectedProduct.price);

            // Log for debugging
            console.log("Preparing Order Payload:", {
                productId,
                name: selectedProduct.name,
                price: itemPrice,
                variant: selectedVariant
            });

            const subTotal = itemPrice * quantity;
            const shipping = 300;
            const gst = Math.round((subTotal + shipping) * 0.10);
            const total = subTotal + shipping + gst;

            // Prepare order data for backend
            const orderData = {
                items: [{
                    product: productId,
                    name: selectedProduct.name,
                    price: itemPrice,
                    quantity: quantity,
                    variant: {
                        size: selectedVariant?.size,
                        price: selectedVariant?.price || itemPrice
                    }
                }],
                shippingAddress: {
                    name: checkoutData.fullName,
                    email: checkoutData.email,
                    phone: checkoutData.phone,
                    street: checkoutData.address,
                    city: checkoutData.city,
                    postalCode: checkoutData.postalCode,
                    country: 'Pakistan'
                },
                paymentMethod: checkoutData.paymentMethod === 'cod' ? 'COD' : (checkoutData.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : (checkoutData.paymentMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa')),
                itemsPrice: subTotal,
                shippingPrice: shipping,
                taxPrice: gst,
                totalPrice: total,
                isGiftBox: isGiftBox,
                notes: checkoutData.notes
            };

            const response = await orderService.create(orderData);
            const orderNumber = response.data?.order?.orderNumber || response.order?.orderNumber || 'N/A';

            // ... strict validation logic continues ...

            // Show success message with customer info
            setOrderSummary({
                orderNumber,
                productName: `${isGiftBox ? 'Gift Box ' : ''}${selectedProduct.name}`,
                size: selectedVariant?.size,
                quantity: quantity,
                total: total,
                paymentMethod: checkoutData.paymentMethod,
                customerName: checkoutData.fullName,
                address: `${checkoutData.address}${checkoutData.addressLine2 ? `, ${checkoutData.addressLine2}` : ''}`,
                city: `${checkoutData.city} - ${checkoutData.postalCode}`,
                isGiftBox: isGiftBox
            });
            setShowSuccessCard(true);

            // Close modal
            setShowCheckout(false);

            // Reset form
            setCheckoutData({
                email: '',
                phone: '',
                fullName: '',
                address: '',
                addressLine2: '',
                city: '',
                postalCode: '',
                paymentMethod: 'bank_transfer',
                notes: ''
            });
            // Clear cart and show success alert
            if (typeof clearCart === 'function') {
                console.log('Clearing cart after successful order...');
                clearCart();
            } else {
                console.warn('clearCart function not available in context');
            }
            alert(`Order Placed Successfully!${isGiftBox ? '\n(Gift Boxes included in your order)' : ''}\nOrder Number: ${orderNumber}`);

        } catch (error) {
            console.error('Error creating order:', error);

            let displayMsg = 'Failed to place order';

            // Handle unwrapped error from api.js interceptor
            const errorData = error.response?.data || error;

            if (errorData) {
                const { message, details, errors } = errorData;
                displayMsg = message || displayMsg;

                if (Array.isArray(errors) && errors.length > 0) {
                    displayMsg += `\n\nValidation Errors:\n- ${errors.map(e => typeof e === 'object' ? (e.message || JSON.stringify(e)) : e).join('\n- ')}`;
                } else if (details) {
                    displayMsg += `\n\n${Array.isArray(details) ? details.join('\n') : details}`;
                }
            } else {
                displayMsg = error.message || String(error);
            }

            alert(displayMsg);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return;

        setIsSubmittingReview(true);
        setReviewError(null);
        try {
            const response = await productService.addReview(selectedProduct._id || selectedProduct.id, reviewForm);
            if (response.success || response.product) {
                // Update local product state with the fresh product data from backend
                const updatedProduct = response.product || response.data?.product || {
                    ...selectedProduct,
                    reviews: [...(selectedProduct.reviews || []), response.review], // Fallback
                };

                setSelectedProduct(updatedProduct);
                setReviewForm({ rating: 5, comment: '' });
                alert('Review added successfully!');
            }
        } catch (error) {
            console.error('Review Error:', error);
            setReviewError(
                error.errors && Array.isArray(error.errors)
                    ? error.errors.map(e => e.message).join('. ')
                    : (error.message || 'Failed to add review')
            );
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <>
            <SEO title="The Collection - Al-Harmain Premium" description="Browse our complete collection of premium spices and dry fruits." />

            <div ref={containerRef} style={{ paddingTop: isMobile ? '100px' : '120px', minHeight: '100vh', background: 'var(--surface-bg)', paddingBottom: isMobile ? '10rem' : '8rem' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <div style={{ width: '50px', height: '50px', border: '3px solid rgba(201, 162, 77, 0.1)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <>

                        {/* 1. HEADER & FILTERS */}
                        {!selectedProduct && !isCompareOpen && (
                            <div className="container">
                                <div style={{ textAlign: 'center', margin: isMobile ? '1rem 0 2rem' : '2rem 0 4rem' }}>
                                    <h5 style={{ color: 'var(--brand-primary)', letterSpacing: isMobile ? '2px' : '3px', fontSize: isMobile ? '0.75rem' : '0.9rem', marginBottom: '1rem' }}>THE TREASURY</h5>
                                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 'clamp(2rem, 8vw, 2.5rem)' : '3.5rem', color: 'var(--text-main)' }}>
                                        {isGiftBox ? "Gift Boxes" : (selectedCategory || "Complete Collection")}
                                    </h1>
                                </div>

                                {/* Sticky Filter Bar */}
                                <div style={{ position: 'sticky', top: isMobile ? '70px' : '70px', zIndex: 50, background: 'rgba(11, 11, 11, 0.95)', backdropFilter: 'blur(15px)', padding: isMobile ? '0.75rem 0' : '1rem 0', margin: isMobile ? '0 -1rem 2rem' : '0 -2rem 4rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(201, 162, 77, 0.1)' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', padding: isMobile ? '0 0.5rem' : '0' }}>
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            style={{
                                                padding: isMobile ? '0.5rem 1rem' : '0.6rem 1.5rem',
                                                borderRadius: '50px',
                                                border: `1px solid ${selectedCategory === null ? 'var(--brand-primary)' : 'rgba(255,255,255,0.2)'}`,
                                                background: selectedCategory === null ? 'var(--brand-primary)' : 'transparent',
                                                color: selectedCategory === null ? '#000' : 'var(--text-muted)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                fontSize: isMobile ? '0.8rem' : '1rem'
                                            }}
                                        >
                                            All Items
                                        </button>
                                        {categories.map((cat, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedCategory(cat.name)}
                                                style={{
                                                    padding: isMobile ? '0.5rem 1rem' : '0.6rem 1.5rem',
                                                    borderRadius: '50px',
                                                    border: `1px solid ${selectedCategory === cat.name ? 'var(--brand-primary)' : 'rgba(255,255,255,0.2)'}`,
                                                    background: selectedCategory === cat.name ? 'var(--brand-primary)' : 'transparent',
                                                    color: selectedCategory === cat.name ? '#000' : 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    fontSize: isMobile ? '0.8rem' : '1rem'
                                                }}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* PRODUCT GRID */}
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: isMobile ? '1.5rem' : '2rem' }}>
                                    {filteredProducts.map((product) => (
                                        <div key={product.id || product._id} className="card-modern product-card-anim"
                                            onClick={async () => {
                                                // Optimistic update for immediate feedback
                                                setSelectedProduct(product);
                                                try {
                                                    // Fetch full details including reviews
                                                    console.log('Fetching full details for:', product.slug);
                                                    const fullProduct = await productService.getBySlug(product.slug);
                                                    console.log('Full product details:', fullProduct);

                                                    // Handle various response structures:
                                                    // 1. { data: { product: {...} } } - Standard API response
                                                    // 2. { product: {...} } - Direct object
                                                    // 3. { ...productFields } - Flat object
                                                    const actualProduct = fullProduct.data?.product || fullProduct.product || fullProduct.data || fullProduct;

                                                    if (actualProduct) {
                                                        setSelectedProduct(actualProduct);
                                                    }
                                                } catch (err) {
                                                    console.error('Error fetching full product details:', err);
                                                }
                                            }}
                                            style={{ cursor: 'pointer', padding: '0', position: 'relative', height: isMobile ? 'auto' : '480px', display: 'flex', flexDirection: 'column' }}
                                        >
                                            {/* Image Area */}
                                            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: isMobile ? '1.5rem' : '2rem', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? '300px' : '350px' }}>
                                                <img
                                                    src={(product.images?.[0] || product.image) && (product.images?.[0] || product.image).startsWith('http') ? (product.images?.[0] || product.image) : ((product.images?.[0] || product.image) && (product.images?.[0] || product.image).startsWith('/') ? (product.images?.[0] || product.image) : `/api/uploads/${(product.images?.[0] || product.image) || ''}`)}
                                                    alt={product.name}
                                                    style={{ width: '95%', height: '95%', objectFit: 'contain', transition: 'transform 0.5s', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
                                                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                                                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                                                />
                                                {/* Compare Button (Top Right) */}


                                                {/* Badges */}
                                                <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {product.badges?.map((badge, idx) => (
                                                        <span key={idx} style={{ background: 'rgba(201, 162, 77, 0.2)', color: 'var(--brand-primary)', padding: '0.3rem 0.8rem', fontSize: '0.7rem', fontWeight: 'bold', backdropFilter: 'blur(5px)', borderRadius: '4px' }}>
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Info Area */}
                                            <div style={{ padding: isMobile ? '1rem' : '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#161616' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                    <div>
                                                        <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontFamily: 'Playfair Display, serif', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{product.name}</h3>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{typeof product.category === 'object' ? product.category.name : product.category}</p>
                                                    </div>
                                                    <span style={{ color: 'var(--brand-primary)', fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>Rs. {product.basePrice || product.price}</span>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                                    <span style={{ fontSize: '0.8rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <FaStar color="var(--brand-primary)" /> {product.rating?.toFixed(1) || '5.0'}
                                                    </span>
                                                    <button
                                                        className="btn-primary-v2"
                                                        style={{ padding: isMobile ? '0.5rem 0.8rem' : '0.6rem 1rem', fontSize: isMobile ? '0.75rem' : '0.8rem' }}
                                                        onClick={(e) => handleAddToCart(e, product)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. ADVANCED DETAIL VIEW */}
                        {selectedProduct && (
                            <div className="container" style={{ animation: 'fadeIn 0.5s' }}>
                                <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1rem', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ← Back to Gallery
                                </button>

                                <div className="grid-asymmetric" style={{ alignItems: 'start', gap: isMobile ? '2rem' : '5rem', marginBottom: isMobile ? '3rem' : '6rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                                    {/* Visual Side - Sticky on Desktop, Normal on Mobile */}
                                    <div className="card-modern" style={{
                                        padding: isMobile ? '2rem' : '4rem',
                                        background: 'radial-gradient(circle at center, #222 0%, #0e0e0e 70%)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: isMobile ? '300px' : '550px',
                                        position: isMobile ? 'relative' : 'sticky',
                                        top: isMobile ? '0' : '120px',
                                        alignSelf: 'start'
                                    }}>
                                        <img
                                            src={(selectedProduct.images?.[0] || selectedProduct.image) && (selectedProduct.images?.[0] || selectedProduct.image).startsWith('http') ? (selectedProduct.images?.[0] || selectedProduct.image) : ((selectedProduct.images?.[0] || selectedProduct.image) && (selectedProduct.images?.[0] || selectedProduct.image).startsWith('/') ? (selectedProduct.images?.[0] || selectedProduct.image) : `/api/uploads/${(selectedProduct.images?.[0] || selectedProduct.image) || ''}`)}
                                            alt={selectedProduct.name}
                                            style={{ width: isMobile ? '80%' : '90%', maxHeight: isMobile ? '300px' : '500px', objectFit: 'contain', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))' }}
                                        />
                                    </div>

                                    {/* Info Side - Scrollable on Desktop, Normal on Mobile */}
                                    <div style={{
                                        maxHeight: isMobile ? 'none' : 'calc(100vh - 200px)',
                                        overflowY: isMobile ? 'visible' : 'auto',
                                        paddingRight: isMobile ? '0' : '1rem'
                                    }}>
                                        <h4 style={{ color: 'var(--brand-primary)', letterSpacing: '2px', fontSize: isMobile ? '0.75rem' : '0.9rem', marginBottom: isMobile ? '0.5rem' : '1rem' }}>
                                            {typeof selectedProduct.category === 'object' ? selectedProduct.category.name.toUpperCase() : (selectedProduct.category ? selectedProduct.category.toUpperCase() : '')}
                                        </h4>
                                        <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', color: 'var(--text-main)', fontFamily: 'Playfair Display, serif', marginBottom: '1rem', lineHeight: '1.2' }}>{selectedProduct.name}</h1>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '1rem' : '2rem', marginBottom: isMobile ? '1.5rem' : '2rem', paddingBottom: isMobile ? '1.5rem' : '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Rs. {selectedVariant ? selectedVariant.price : (selectedProduct.basePrice || selectedProduct.price)}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', fontSize: isMobile ? '0.8rem' : '1rem', color: '#ffb400', gap: '2px' }}>
                                                {[...Array(Math.floor(selectedProduct.rating || 5))].map((_, i) => <FaStar key={i} />)} <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({selectedProduct.reviewsCount ?? selectedProduct.reviews?.length ?? 0} {isMobile ? '' : 'Reviews'})</span>
                                            </div>
                                        </div>

                                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                                            {selectedProduct.description}
                                        </p>

                                        {/* Variants */}
                                        {selectedProduct.variants && (
                                            <div style={{ marginBottom: '2rem' }}>
                                                <h5 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '0.9rem' }}>SELECT SIZE{selectedVariant && `: ${selectedVariant.size}`}</h5>
                                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                    {selectedProduct.variants.map((v, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setSelectedVariant(v)}
                                                            style={{
                                                                padding: '0.8rem 1.5rem',
                                                                background: selectedVariant?.size === v.size ? 'var(--brand-primary)' : '#1a1a1a',
                                                                border: selectedVariant?.size === v.size ? '1px solid var(--brand-primary)' : '1px solid rgba(255,255,255,0.1)',
                                                                color: selectedVariant?.size === v.size ? '#000' : '#fff',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            {v.size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Stock & Delivery */}
                                        <div style={{ display: 'flex', gap: '2rem', color: '#888', fontSize: '0.9rem', marginBottom: '3rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', background: '#4caf50', borderRadius: '50%' }}></div> In Stock</span>
                                        </div>

                                        {/* Cart Action */}
                                        <div style={{ display: 'flex', gap: '1rem', height: isMobile ? 'auto' : '60px', flexDirection: isMobile ? 'column' : 'row' }}>
                                            <div style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '30px', padding: '0 1rem', border: '1px solid #333', height: isMobile ? '50px' : 'auto' }}>
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', padding: '0 1rem', cursor: 'pointer' }}>-</button>
                                                <span style={{ color: '#fff', width: '30px', textAlign: 'center' }}>{quantity}</span>
                                                <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', padding: '0 1rem', cursor: 'pointer' }}>+</button>
                                            </div>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(selectedProduct, quantity, selectedVariant);

                                                const btn = e.currentTarget;
                                                const originalContent = btn.innerHTML;
                                                btn.innerHTML = `<span style="display: flex; align-items: center; justify-content: center; gap: 0.5rem"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg> Added</span>`;
                                                btn.style.background = "#fff";
                                                btn.style.color = "#000";
                                                setTimeout(() => {
                                                    btn.innerHTML = originalContent;
                                                    btn.style.background = "";
                                                    btn.style.color = "";
                                                }, 1500);
                                            }} className="btn-primary-v2" style={{ flex: 1, height: isMobile ? '50px' : 'auto' }}>Add to Cart</button>
                                            <button onClick={() => setShowCheckout(true)} className="btn-outline-v2" style={{ flex: 1, height: isMobile ? '50px' : 'auto' }}>BUY NOW</button>
                                        </div>

                                        {/* Confidence Block */}
                                        <div style={{ marginTop: isMobile ? '1.5rem' : '2.5rem', display: 'flex', gap: isMobile ? '1.5rem' : '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', flexDirection: isMobile ? 'column' : 'row' }}>
                                            {[
                                                { icon: <FaShieldAlt />, text: "100% Halal Certified" },
                                                { icon: <FaLeaf />, text: "Sourced from Origin" },
                                                { icon: <FaBoxOpen />, text: "Premium Packaging" }
                                            ].map((item, i) => (
                                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', textAlign: isMobile ? 'left' : 'center', gap: '1rem', opacity: 0.8 }}>
                                                    <div style={{ color: 'var(--brand-primary)', fontSize: isMobile ? '1.5rem' : '1.2rem', minWidth: isMobile ? '30px' : 'auto' }}>{item.icon}</div>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.2' }}>{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. DETAILS & REVIEWS */}
                                <div style={{ marginBottom: isMobile ? '3rem' : '6rem' }}>

                                    <div className="fade-in">
                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: '3rem' }}>
                                            {/* Review Form Area */}
                                            <div>
                                                <h3 style={{ fontFamily: 'Playfair Display', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Add a Review</h3>
                                                {isAuthenticated ? (
                                                    <form onSubmit={handleReviewSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                                        <div>
                                                            <label style={{ display: 'block', color: 'var(--brand-primary)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Your Rating</label>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                {[1, 2, 3, 4, 5].map(num => (
                                                                    <FaStar
                                                                        key={num}
                                                                        onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                                                                        style={{ cursor: 'pointer', color: num <= reviewForm.rating ? 'var(--brand-primary)' : 'rgba(255,255,255,0.1)', fontSize: '1.5rem', transition: 'all 0.2s' }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', color: 'var(--brand-primary)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Your Comment</label>
                                                            <textarea
                                                                required
                                                                value={reviewForm.comment}
                                                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                                placeholder="Write your experience..."
                                                                style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: 'var(--font-body)', outline: 'none' }}
                                                            />
                                                        </div>
                                                        {reviewError && <p style={{ color: '#ff4d4d', fontSize: '0.85rem' }}>{reviewError}</p>}
                                                        <button
                                                            disabled={isSubmittingReview}
                                                            type="submit"
                                                            className="btn-primary-v2"
                                                            style={{ width: '100%' }}
                                                        >
                                                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please sign in to share your experience with this product.</p>
                                                        <button onClick={() => window.scrollTo(0, 0)} className="btn-outline-v2" style={{ width: '100%' }}>SIGN IN TO REVIEW</button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Reviews List Area */}
                                            <div>
                                                <h3 style={{ fontFamily: 'Playfair Display', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Customer Experiences</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                    {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                                                        selectedProduct.reviews.slice().reverse().map((review, i) => (
                                                            <div key={i} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--brand-primary)' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                                    <h5 style={{ color: '#fff', margin: 0, textTransform: 'capitalize' }}>{review.userName || review.user?.name || 'Customer'}</h5>
                                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
                                                                </div>
                                                                <div style={{ color: 'var(--brand-primary)', marginBottom: '0.8rem', fontSize: '0.8rem', display: 'flex', gap: '2px' }}>{[...Array(review.rating)].map((_, idx) => <FaStar key={idx} />)}</div>
                                                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>{review.comment}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                                            <FaStar size={30} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                                            <p>No reviews yet. Be the first to review!</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. PERFECT PAIRINGS (You May Also Like) */}
                                <div style={{ marginBottom: '4rem' }}>
                                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)' }}>Perfect Pairings</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2rem' }}>
                                        {products.filter(p => (typeof p.category === 'object' ? p.category.name : p.category) === (typeof selectedProduct.category === 'object' ? selectedProduct.category.name : selectedProduct.category) && (p._id || p.id) !== (selectedProduct._id || selectedProduct.id)).slice(0, 4).map(product => (
                                            <div key={product.id || product._id} className="card-modern" onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}>
                                                <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#121212', overflow: 'hidden' }}>
                                                    <img
                                                        src={(product.images?.[0] || product.image) && (product.images?.[0] || product.image).startsWith('http') ? (product.images?.[0] || product.image) : ((product.images?.[0] || product.image) && (product.images?.[0] || product.image).startsWith('/') ? (product.images?.[0] || product.image) : `/api/uploads/${(product.images?.[0] || product.image) || ''}`)}
                                                        alt={product.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                </div>
                                                <div style={{ padding: '1rem' }}>
                                                    <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{product.name}</h5>
                                                    <span style={{ color: 'var(--brand-primary)' }}>Rs. {product.basePrice || product.price}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. COMPARISON FLOATING BAR */}
                        {compareList.length > 0 && !isCompareOpen && (
                            <div style={{
                                position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                                background: 'rgba(11, 11, 11, 0.95)', border: '1px solid var(--brand-primary)',
                                padding: '1rem 2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '2rem',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, backdropFilter: 'blur(10px)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {compareList.map(p => (
                                        <img key={p.id} src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#fff', borderRadius: '50%' }} />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => setIsCompareOpen(true)} className="btn-primary-v2" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>Compare ({compareList.length})</button>
                                    <button onClick={() => setCompareList([])} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.8rem' }}>Clear</button>
                                </div>
                            </div>
                        )}

                        {/* 6. COMPARISON MODAL */}
                        {isCompareOpen && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 200, padding: '4rem', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display' }}>Product Comparison</h2>
                                    <button onClick={() => setIsCompareOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}><FaTimes /></button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareList.length}, 1fr)`, gap: '2rem', flex: 1, overflowY: 'auto' }}>
                                    {compareList.map(item => (
                                        <div key={item.id} style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '2rem' }}>
                                            <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#121212', borderRadius: '12px', marginBottom: '2rem' }}>
                                                <img src={item.image} alt={item.name} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                                            </div>
                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                                            <h4 style={{ color: 'var(--brand-primary)', marginBottom: '2rem' }}>Rs. {item.price}</h4>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                <div>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Category</span>
                                                    <p>{item.category}</p>
                                                </div>
                                                <div>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Origin</span>
                                                    <p>{item.origin}</p>
                                                </div>
                                                <div>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rating</span>
                                                    <p>{item.rating.toFixed(1)} ★</p>
                                                </div>
                                                <div>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ingredients</span>
                                                    <p style={{ fontSize: '0.9rem' }}>{item.ingredients?.join(", ")}</p>
                                                </div>
                                                <button onClick={(e) => handleAddToCart(e, item)} className="btn-primary-v2" style={{ width: '100%', marginTop: '1rem' }}>Add to Cart</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* CHECKOUT MODAL */}
                        {showCheckout && selectedProduct && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(10px)' }}
                                onClick={() => setShowCheckout(false)}>
                                <div className="glass-panel" style={{ maxWidth: '1200px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'rgba(20,20,20,0.98)', border: '1px solid rgba(201,162,77,0.3)', padding: 0 }}
                                    onClick={(e) => e.stopPropagation()}>

                                    {/* Header */}
                                    <div style={{ padding: '2rem 3rem', borderBottom: '1px solid rgba(201,162,77,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display, serif', color: 'var(--text-main)' }}>Complete Your Order</h2>
                                        <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer' }}>×</button>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 0 }}>
                                        {/* Left: Form */}
                                        <div style={{ padding: '3rem', borderRight: '1px solid rgba(201,162,77,0.2)' }}>
                                            {/* Contact Information */}
                                            <div style={{ marginBottom: '3rem' }}>
                                                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Contact Information</h3>
                                                <input type="email" placeholder="Enter your email" value={checkoutData.email}
                                                    onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                                                    style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                                                <input type="tel" placeholder="Enter your phone number" value={checkoutData.phone}
                                                    onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                                                    style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                                            </div>

                                            {/* Shipping Address */}
                                            <div style={{ marginBottom: '3rem' }}>
                                                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Shipping Address</h3>
                                                <input type="text" placeholder="Full Name" value={checkoutData.fullName}
                                                    onChange={(e) => setCheckoutData({ ...checkoutData, fullName: e.target.value })}
                                                    style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                                                <input type="text" placeholder="Address" value={checkoutData.address}
                                                    onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                                                    style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                                                <input type="text" placeholder="Address Line 2 (Optional)" value={checkoutData.addressLine2}
                                                    onChange={(e) => setCheckoutData({ ...checkoutData, addressLine2: e.target.value })}
                                                    style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                    <input type="text" placeholder="City" value={checkoutData.city}
                                                        onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                                                        style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                                                    <input type="text" placeholder="Zip / Postal Code" value={checkoutData.postalCode}
                                                        onChange={(e) => setCheckoutData({ ...checkoutData, postalCode: e.target.value })}
                                                        style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                                                </div>
                                            </div>

                                            {/* Shipping Methods */}
                                            <div>
                                                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Shipping Methods</h3>
                                                <div style={{ padding: '1.5rem', background: 'rgba(201,162,77,0.05)', border: '1px solid rgba(201,162,77,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ color: 'var(--text-main)' }}>Standard (5-8 Working Days)</span>
                                                    <span style={{ color: 'var(--brand-primary)', fontWeight: 'bold' }}>Rs. 300</span>
                                                </div>
                                            </div>

                                            {/* Payment Methods */}
                                            <div style={{ marginBottom: '3rem' }}>
                                                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Payment</h3>

                                                <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                                                    {paymentOptions.map((option) => (
                                                        <div
                                                            key={option.id}
                                                            onClick={() => {
                                                                setCheckoutData({ ...checkoutData, paymentMethod: option.id });
                                                                setShowPaymentModal(true);
                                                            }}
                                                            style={{
                                                                padding: '1.5rem',
                                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                                background: checkoutData.paymentMethod === option.id ? 'rgba(201, 162, 77, 0.08)' : 'transparent',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s'
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <div style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    borderRadius: '50%',
                                                                    border: `2px solid ${checkoutData.paymentMethod === option.id ? 'var(--brand-primary)' : 'rgba(255,255,255,0.2)'}`,
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    {checkoutData.paymentMethod === option.id && (
                                                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brand-primary)' }} />
                                                                    )}
                                                                </div>
                                                                <span style={{ color: checkoutData.paymentMethod === option.id ? 'var(--brand-primary)' : 'var(--text-main)', fontWeight: checkoutData.paymentMethod === option.id ? 'bold' : 'normal' }}>
                                                                    {option.label}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                                                                Instructions
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Additional Information */}
                                            <div>
                                                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Additional Information</h3>
                                                <textarea placeholder="Special Instructions / Notes" value={checkoutData.notes}
                                                    onChange={(e) => setCheckoutData({ ...checkoutData, notes: e.target.value })}
                                                    rows={4}
                                                    style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', outline: 'none', borderRadius: '8px', resize: 'vertical', fontFamily: 'inherit' }} />
                                            </div>
                                        </div>

                                        {/* Right: Order Summary */}
                                        <div style={{ padding: '3rem', background: 'rgba(0,0,0,0.3)' }}>
                                            <h3 style={{ fontSize: '1.3rem', marginBottom: '2rem', color: 'var(--textmain)' }}>Order Summary</h3>

                                            {/* Product Item */}
                                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                <img
                                                    src={(selectedProduct.images?.[0] || selectedProduct.image) && (selectedProduct.images?.[0] || selectedProduct.image).startsWith('http') ? (selectedProduct.images?.[0] || selectedProduct.image) : ((selectedProduct.images?.[0] || selectedProduct.image) && (selectedProduct.images?.[0] || selectedProduct.image).startsWith('/') ? (selectedProduct.images?.[0] || selectedProduct.image) : `/api/uploads/${(selectedProduct.images?.[0] || selectedProduct.image) || ''}`)}
                                                    alt={selectedProduct.name}
                                                    style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#000', borderRadius: '8px' }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{selectedProduct.name}</h4>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                        {selectedVariant?.size && <span>{selectedVariant.size} • </span>}
                                                        Quantity: {quantity}
                                                    </p>
                                                </div>
                                                <span style={{ color: 'var(--brand-primary)', fontWeight: 'bold' }}>Rs. {(selectedVariant ? selectedVariant.price : selectedProduct.price) * quantity}</span>
                                            </div>

                                            {/* Price Breakdown */}
                                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                                    <span>Sub Total</span>
                                                    <span>Rs. {(selectedVariant ? selectedVariant.price : selectedProduct.price) * quantity}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                                    <span>Shipping</span>
                                                    <span>Rs. 300</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid rgba(201,162,77,0.3)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                                                    <span style={{ color: 'var(--text-main)' }}>Total</span>
                                                    <span style={{ color: 'var(--brand-primary)' }}>Rs. {Math.round(((selectedVariant ? selectedVariant.price : selectedProduct.price) * quantity + 300))}</span>
                                                </div>
                                            </div>

                                            {/* Discount Code */}
                                            <input type="text" placeholder="Discount code or gift code"
                                                style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '2rem', fontSize: '0.95rem', outline: 'none', borderRadius: '8px' }} />

                                            {/* Complete Order Button */}
                                            <button onClick={handleCompleteOrder} className="btn-primary-v2" style={{ width: '100%', padding: '1.3rem', fontSize: '1.1rem' }}>
                                                Complete Order
                                            </button>

                                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
                                                🔒 Secure checkout powered by SSL encryption
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* ORDER SUCCESS CARD */}
                        {showSuccessCard && orderSummary && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(10px)' }}>
                                <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', background: 'rgba(20,20,20,1)', border: '1px solid var(--brand-primary)', borderRadius: '24px', overflow: 'hidden', animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                    <div style={{ background: 'var(--brand-primary)', padding: '1.5rem', textAlign: 'center', position: 'relative' }}>
                                        <div style={{ width: '80px', height: '80px', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '2px solid rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                            <img src="/assets/al-harmain-logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <h2 style={{ color: '#000', fontSize: '1.5rem', fontFamily: 'Playfair Display, serif', marginBottom: '0.2rem' }}>Order Placed!</h2>
                                        <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Thank you for your purchase</p>
                                    </div>

                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
                                            <h4 style={{ color: 'var(--brand-primary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Order Details</h4>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Product</span>
                                                <span style={{ color: '#fff', textAlign: 'right', maxWidth: '150px' }}>{orderSummary.productName}</span>
                                            </div>
                                            {orderSummary.size && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                    <span style={{ color: 'var(--text-muted)' }}>Size</span>
                                                    <span style={{ color: '#fff' }}>{orderSummary.size}</span>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Quantity</span>
                                                <span style={{ color: '#fff' }}>{orderSummary.quantity}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Total Amount</span>
                                                <span style={{ color: 'var(--brand-primary)', fontWeight: 'bold' }}>Rs. {orderSummary.total}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Payment</span>
                                                <span style={{ color: '#fff' }}>{orderSummary.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : orderSummary.paymentMethod === 'cod' ? 'Cash on Delivery' : orderSummary.paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'}</span>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <h4 style={{ color: 'var(--brand-primary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Shipping To</h4>
                                            <p style={{ color: '#fff', marginBottom: '0.2rem', fontWeight: 'bold', fontSize: '0.9rem' }}>{orderSummary.customerName}</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>{orderSummary.address}</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{orderSummary.city}</p>
                                        </div>

                                        <button onClick={() => setShowSuccessCard(false)} className="btn-primary-v2" style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', borderRadius: '12px' }}>
                                            Continue Shopping
                                        </button>

                                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '1.5rem' }}>
                                            We've sent a confirmation email to you.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* PAYMENT INSTRUCTIONS MODAL */}
                        {showPaymentModal && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 30000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(10px)' }}>
                                <div className="card-modern" style={{ maxWidth: '450px', width: '100%', background: '#0a0a0a', border: '1px solid var(--brand-primary)', borderRadius: '24px', padding: '2.5rem', position: 'relative' }}>
                                    <button onClick={() => setShowPaymentModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.8rem', cursor: 'pointer' }}>×</button>
                                    <h3 style={{ color: 'var(--brand-primary)', fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem', textAlign: 'center' }}>{currentPaymentInfo.title}</h3>
                                    <div style={{ color: '#fff', fontSize: '1rem' }}>{currentPaymentInfo.details}</div>
                                    <button onClick={() => setShowPaymentModal(false)} className="btn-primary-v2" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}>CONTINUE</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div >
        </>
    );
};

export default Products;
