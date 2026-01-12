import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { FaLock, FaShieldAlt, FaTruck } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/order.service';

const Checkout = () => {
    const { cartItems, subTotal, clearCart, isGiftBoxOrder, loading: cartLoading } = useContext(CartContext);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('COD');
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [isGiftBox, setIsGiftBox] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        phone: '',
        notes: ''
    });

    const paymentMethods = [
        {
            id: 'bank',
            label: 'Bank Transfer',
            title: 'Bank Transfer Instructions',
            details: (
                <div style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        <p style={{ marginBottom: '0.8rem', color: 'var(--brand-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>Dubai Islamic Bank</p>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                            <p style={{ marginBottom: '0.4rem', fontSize: '0.95rem' }}><strong style={{ color: 'var(--brand-primary)' }}>Account Title:</strong> Muhammad Tariq</p>
                            <p style={{ fontSize: '0.95rem' }}><strong style={{ color: 'var(--brand-primary)' }}>Account #:</strong> 0282874002</p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ marginBottom: '0.8rem', color: 'var(--brand-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>Meezan Bank</p>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                            <p style={{ marginBottom: '0.4rem', fontSize: '0.95rem' }}><strong style={{ color: 'var(--brand-primary)' }}>Account Title:</strong> Muhammad Tariq</p>
                            <p style={{ fontSize: '0.95rem' }}><strong style={{ color: 'var(--brand-primary)' }}>Account #:</strong> 0030-0113901052</p>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
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

    const currentMethod = paymentMethods.find(m => m.label === selectedMethod) || paymentMethods[0];

    // Calculate totals
    const shipping = 300;
    const total = subTotal + shipping;

    useEffect(() => {
        window.scrollTo(0, 0);
        const params = new URLSearchParams(window.location.search);
        if (params.get('giftbox') === 'true' || isGiftBoxOrder) {
            setIsGiftBox(true);
        }
        gsap.from(".checkout-anim", {
            y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
        });

        // Debug logging
        console.log('Checkout - Cart Items:', cartItems);
        console.log('Checkout - Cart Loading:', cartLoading);
        console.log('Checkout - Is Authenticated:', isAuthenticated);
    }, [isGiftBoxOrder, cartItems, cartLoading, isAuthenticated]);

    const handleCompleteOrder = async () => {
        if (!isAuthenticated) {
            alert('Please sign in to complete your purchase.');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.postalCode || !formData.phone) {
            alert('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.product?._id || item._id,
                    name: item.product?.name || item.name,
                    price: item.variant?.price || item.basePrice || item.price,
                    quantity: item.quantity,
                    variant: {
                        size: item.variant?.size,
                        price: item.variant?.price || item.basePrice || item.price
                    }
                })),
                shippingAddress: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    street: `${formData.address}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}`,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: 'Pakistan'
                },
                paymentMethod: selectedMethod === 'COD' ? 'COD' : selectedMethod,
                itemsPrice: subTotal,
                shippingPrice: shipping,
                taxPrice: 0,
                totalPrice: total,
                isGiftBox: isGiftBox,
                notes: formData.notes
            };

            const response = await orderService.create(orderData);
            setOrderNumber(response.order.orderNumber);
            setOrderSuccess(true);
            clearCart();
        } catch (error) {
            console.error('Checkout error:', error);
            alert(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '1.2rem',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
        marginBottom: '1rem',
        borderRadius: '12px',
        outline: 'none',
        fontSize: '1rem',
        transition: 'border-color 0.3s'
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = 'var(--brand-primary)';
        e.target.style.background = 'rgba(255, 255, 255, 0.12)';
    };
    const handleBlur = (e) => {
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
    };

    return (
        <div style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh', background: 'var(--surface-bg)', color: 'var(--text-main)' }}>
            <div className="container">
                <button
                    onClick={() => navigate('/products')}
                    className="btn-outline-v2"
                    style={{
                        marginBottom: '2rem',
                        padding: '0.8rem 1.5rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: 'fit-content'
                    }}
                >
                    ← Continue Shopping
                </button>

                <h1 className="checkout-anim" style={{ color: 'var(--brand-primary)', fontSize: '3rem', marginBottom: '4rem', textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
                    Secure Checkout
                </h1>

                {cartLoading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-main)' }}>
                        <p style={{ fontSize: '1.2rem' }}>Loading your cart...</p>
                    </div>
                ) : orderSuccess ? (
                    <div className="checkout-anim card-modern" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0a0a0a', border: '1px solid var(--brand-primary)', borderRadius: '24px', maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ width: '80px', height: '80px', background: 'var(--brand-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <FaLock size={40} color="#000" />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display, serif', color: 'var(--brand-primary)', marginBottom: '1rem' }}>
                            Order Confirmed! {isGiftBox && <span style={{ fontSize: '1.2rem', display: 'block' }}>(Gift Box Edition)</span>}
                        </h2>
                        <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your order number is <strong style={{ color: 'var(--brand-primary)' }}>{orderNumber}</strong></p>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>We've received your luxury order and are preparing it for delivery.</p>
                        <button onClick={() => navigate('/products')} className="btn-primary-v2" style={{ padding: '1rem 3rem' }}>CONTINUE SHOPPING</button>
                    </div>
                ) : (
                    <div className="grid-asymmetric" style={{ alignItems: 'start', gap: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                        {/* Left: Combined Form */}
                        <div style={{ flex: '2' }}>
                            {/* Contact Info */}
                            <div className="checkout-anim" style={{ marginBottom: '4rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Contact Information</h2>
                                    {!isAuthenticated && <button onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontSize: '0.9rem' }}>Log in</button>}
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email or mobile phone number"
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <input type="checkbox" style={{ accentColor: 'var(--brand-primary)', width: '18px', height: '18px' }} />
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email me with news and offers</span>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="checkout-anim" style={{ marginBottom: '4rem' }}>
                                <h2 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Shipping Address</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <select style={{ ...inputStyle, appearance: 'none' }} onFocus={handleFocus} onBlur={handleBlur}>
                                        <option style={{ background: '#000' }}>Pakistan</option>
                                    </select>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input placeholder="First name" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                        <input placeholder="Last name" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                    </div>
                                    <input placeholder="Address" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                    <input placeholder="Apartment, suite, etc. (optional)" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input placeholder="City" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                        <input placeholder="Postal code" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
                                    </div>
                                    <input placeholder="Phone" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="checkout-anim">
                                <h2 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Payment</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>All transactions are secure and encrypted.</p>

                                <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => {
                                                setSelectedMethod(method.label);
                                                setShowModal(true);
                                            }}
                                            className="payment-method-row"
                                            style={{
                                                padding: '1.8rem',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                background: selectedMethod === method.label ? 'rgba(201, 162, 77, 0.08)' : 'transparent',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    border: `2px solid ${selectedMethod === method.label ? 'var(--brand-primary)' : 'rgba(255,255,255,0.2)'}`,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    transition: 'all 0.3s'
                                                }}>
                                                    {selectedMethod === method.label && (
                                                        <div style={{
                                                            width: '12px',
                                                            height: '12px',
                                                            borderRadius: '50%',
                                                            background: 'var(--brand-primary)',
                                                            boxShadow: '0 0 10px var(--brand-primary)'
                                                        }} />
                                                    )}
                                                </div>
                                                <span style={{
                                                    color: selectedMethod === method.label ? 'var(--brand-primary)' : 'var(--text-main)',
                                                    fontWeight: selectedMethod === method.label ? '700' : '400',
                                                    fontSize: '1.1rem',
                                                    transition: 'all 0.3s'
                                                }}>
                                                    {method.label}
                                                </span>
                                            </div>
                                            <div style={{
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '20px',
                                                background: 'rgba(255,255,255,0.05)',
                                                fontSize: '0.75rem',
                                                color: 'rgba(255,255,255,0.5)',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                Click to view details
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="checkout-anim card-modern" style={{ flex: '1', padding: '2.5rem', position: 'sticky', top: '140px', background: '#121212', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h2 style={{ color: 'var(--brand-primary)', marginBottom: '2rem', fontSize: '1.8rem', fontFamily: 'Playfair Display, serif' }}>Order Summary</h2>

                            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '2rem', paddingRight: '0.5rem' }}>
                                {cartItems.length === 0 ? (
                                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Your cart is empty.</div>
                                ) : (
                                    cartItems.map((item, index) => {
                                        const productId = item.product?._id || item._id || item.id;
                                        const productName = item.product?.name || item.name;
                                        const itemPrice = item.variant?.price || item.basePrice || item.price || 0;
                                        return (
                                            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                                <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', background: '#fff' }}>
                                                    <img
                                                        src={(item.images?.[0] || item.image || item.img) && (item.images?.[0] || item.image || item.img).startsWith('http') ? (item.images?.[0] || item.image || item.img) : ((item.images?.[0] || item.image || item.img) && (item.images?.[0] || item.image || item.img).startsWith('/') ? (item.images?.[0] || item.image || item.img) : `/api/uploads/${(item.images?.[0] || item.image || item.img) || ''}`)}
                                                        alt={item.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                    <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--brand-secondary)', color: 'white', borderBottomLeftRadius: '8px', padding: '2px 6px', fontSize: '0.7rem' }}>x{item.quantity}</span>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ color: 'var(--text-main)', margin: '0 0 0.4rem 0', fontSize: '1rem' }}>{productName}</h4>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                        {item.variant?.size && <span>{item.variant.size} • </span>}
                                                        Rs. {itemPrice}
                                                    </p>
                                                </div>
                                                <div style={{ color: 'var(--brand-primary)', fontWeight: 'bold' }}>Rs. {itemPrice * item.quantity}</div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                <input placeholder="Discount code" style={{ ...inputStyle, marginBottom: 0 }} onFocus={handleFocus} onBlur={handleBlur} />
                                <button className="btn-outline-v2" style={{ padding: '0 1.5rem', height: 'auto', fontSize: '0.9rem' }}>Apply</button>
                            </div>

                            <div style={{ marginBottom: '2rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span style={{ color: 'var(--text-main)' }}>Rs. {subTotal}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span style={{ color: 'var(--text-main)' }}>Rs. {shipping}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', color: 'var(--brand-primary)', fontWeight: 'bold', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}><span>Total</span><span>Rs. {total}</span></div>
                            </div>

                            <button
                                disabled={isSubmitting}
                                onClick={handleCompleteOrder}
                                className="btn-primary-v2"
                                style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', marginBottom: '1.5rem' }}
                            >
                                {isSubmitting ? 'Processing...' : 'Complete Order'}
                            </button>

                            {/* Trust Signals */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem', opacity: 0.7 }}>
                                <div style={{ textAlign: 'center', color: '#fff' }}>
                                    <FaLock size={16} color="var(--brand-primary)" style={{ marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SSL Secure</p>
                                </div>
                                <div style={{ textAlign: 'center', color: '#fff' }}>
                                    <FaShieldAlt size={16} color="var(--brand-primary)" style={{ marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Data Privacy</p>
                                </div>
                                <div style={{ textAlign: 'center', color: '#fff' }}>
                                    <FaTruck size={16} color="var(--brand-primary)" style={{ marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Traceable</p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><FaLock /> 256-bit Encryption Guaranteed</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Details Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '20px',
                        backdropFilter: 'blur(8px)'
                    }}>
                        <div className="card-modern" style={{
                            background: '#0a0a0a',
                            padding: '2.5rem',
                            borderRadius: '24px',
                            width: '100%',
                            maxWidth: '500px',
                            border: '1px solid var(--brand-primary)',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: '1.8rem',
                                    cursor: 'pointer',
                                    transition: 'color 0.3s'
                                }}
                                onMouseOver={(e) => e.target.style.color = '#fff'}
                                onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}
                            >
                                ×
                            </button>

                            <h3 style={{
                                color: 'var(--brand-primary)',
                                fontSize: '1.8rem',
                                marginBottom: '1.5rem',
                                fontFamily: 'Playfair Display, serif',
                                textAlign: 'center'
                            }}>
                                {currentMethod.title}
                            </h3>

                            <div style={{ color: '#fff', fontSize: '1.05rem', lineHeight: '1.6' }}>
                                {currentMethod.details}
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="btn-primary-v2"
                                style={{
                                    marginTop: '2.5rem',
                                    width: '100%',
                                    padding: '1.2rem',
                                    fontSize: '1rem',
                                    letterSpacing: '1px'
                                }}
                            >
                                CONTINUE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
