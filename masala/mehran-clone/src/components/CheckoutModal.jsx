import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/order.service';
import { FaCheckCircle, FaLock } from 'react-icons/fa';

const CheckoutModal = () => {
    const { showCheckoutModal, setShowCheckoutModal, cartItems, subTotal, clearCart, isGiftBoxOrder } = useContext(CartContext);
    const { isAuthenticated } = useContext(AuthContext);

    const [checkoutData, setCheckoutData] = useState({
        email: '',
        phone: '',
        fullName: '',
        address: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        paymentMethod: 'cod',
        notes: ''
    });

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const paymentOptions = [
        { id: 'bank', label: 'Bank Transfer' },
        { id: 'cod', label: 'Cash On Delivery' },
        { id: 'jazzcash', label: 'Pay by JazzCash' },
        { id: 'easypaisa', label: 'Pay By EasyPaisa' }
    ];

    const shipping = 300;
    const total = subTotal + shipping;

    const handleCompleteOrder = async () => {
        if (!isAuthenticated) {
            alert('Please sign in to complete your purchase.');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        if (!checkoutData.email || !checkoutData.phone || !checkoutData.fullName || !checkoutData.address || !checkoutData.city || !checkoutData.postalCode) {
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
                    name: checkoutData.fullName,
                    email: checkoutData.email,
                    phone: checkoutData.phone,
                    street: `${checkoutData.address}${checkoutData.addressLine2 ? ', ' + checkoutData.addressLine2 : ''}`,
                    city: checkoutData.city,
                    postalCode: checkoutData.postalCode,
                    country: 'Pakistan'
                },
                paymentMethod: checkoutData.paymentMethod.toUpperCase(),
                itemsPrice: subTotal,
                shippingPrice: shipping,
                taxPrice: 0,
                totalPrice: total,
                isGiftBox: isGiftBoxOrder,
                notes: checkoutData.notes
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

    if (!showCheckoutModal) return null;

    if (orderSuccess) {
        return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', background: 'rgba(20,20,20,0.98)', border: '1px solid var(--brand-primary)', padding: '4rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
                    <div style={{ width: '80px', height: '80px', background: 'var(--brand-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <span style={{ fontSize: '3rem', color: '#000', display: 'flex' }}><FaCheckCircle /></span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display, serif', color: 'var(--brand-primary)', marginBottom: '1rem' }}>
                        Order Confirmed! {isGiftBoxOrder && <span style={{ fontSize: '1.2rem', display: 'block' }}>(Gift Box Edition)</span>}
                    </h2>
                    <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your order number is <strong style={{ color: 'var(--brand-primary)' }}>{orderNumber}</strong></p>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>We've received your luxury order and are preparing it for delivery.</p>
                    <button onClick={() => { setShowCheckoutModal(false); setOrderSuccess(false); }} className="btn-primary-v2" style={{ padding: '1rem 3rem' }}>CONTINUE SHOPPING</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(10px)' }}
            onClick={() => setShowCheckoutModal(false)}>
            <div className="glass-panel" style={{ maxWidth: '1200px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'rgba(20,20,20,0.98)', border: '1px solid rgba(201,162,77,0.3)', padding: 0 }}
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '2rem 3rem', borderBottom: '1px solid rgba(201,162,77,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display, serif', color: 'var(--text-main)' }}>Complete Your Order</h2>
                    <button onClick={() => setShowCheckoutModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 0 }}>
                    {/* Left: Form */}
                    <div style={{ padding: '3rem', borderRight: '1px solid rgba(201,162,77,0.2)' }}>
                        {/* Contact Information */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Contact Information</h3>
                            <input type="email" placeholder="Enter your email" value={checkoutData.email}
                                onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', marginBottom: '1rem', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                            <input type="tel" placeholder="Enter your phone number" value={checkoutData.phone}
                                onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                        </div>

                        {/* Shipping Address */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Shipping Address</h3>
                            <input type="text" placeholder="Full Name" value={checkoutData.fullName}
                                onChange={(e) => setCheckoutData({ ...checkoutData, fullName: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', marginBottom: '1rem', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                            <input type="text" placeholder="Address" value={checkoutData.address}
                                onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', marginBottom: '1rem', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                            <input type="text" placeholder="Address Line 2 (Optional)" value={checkoutData.addressLine2}
                                onChange={(e) => setCheckoutData({ ...checkoutData, addressLine2: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', marginBottom: '1rem', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input type="text" placeholder="City" value={checkoutData.city}
                                    onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                                    style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                                <input type="text" placeholder="Zip / Postal Code" value={checkoutData.postalCode}
                                    onChange={(e) => setCheckoutData({ ...checkoutData, postalCode: e.target.value })}
                                    style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem', outline: 'none', borderRadius: '8px' }} />
                            </div>
                        </div>

                        {/* Shipping Methods */}
                        <div style={{ marginBottom: '3rem' }}>
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
                                        onClick={() => setCheckoutData({ ...checkoutData, paymentMethod: option.id })}
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
                                style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem', outline: 'none', borderRadius: '8px', resize: 'vertical', fontFamily: 'inherit' }} />
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div style={{ padding: '3rem', background: 'rgba(0,0,0,0.3)' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '2rem', color: 'var(--text-main)' }}>Order Summary</h3>

                        {/* Cart Items */}
                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '2rem' }}>
                            {cartItems.map((item, index) => (
                                <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#fff', borderRadius: '8px' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.3rem', color: 'var(--text-main)' }}>{item.product?.name || item.name}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            {item.variant?.size && <span>{item.variant.size} • </span>}
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <span style={{ color: 'var(--brand-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Rs. {(item.variant?.price || item.price) * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                <span>Sub Total</span>
                                <span>Rs. {subTotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                <span>Shipping</span>
                                <span>Rs. {shipping}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid rgba(201,162,77,0.3)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                                <span style={{ color: 'var(--text-main)' }}>Total</span>
                                <span style={{ color: 'var(--brand-primary)' }}>Rs. {total}</span>
                            </div>
                        </div>

                        {/* Discount Code */}
                        <input type="text" placeholder="Discount code or gift code"
                            style={{ width: '100%', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', marginBottom: '2rem', fontSize: '0.95rem', outline: 'none', borderRadius: '8px' }} />

                        {/* Complete Order Button */}
                        <button onClick={handleCompleteOrder} disabled={isSubmitting} className="btn-primary-v2" style={{ width: '100%', padding: '1.3rem', fontSize: '1.1rem' }}>
                            {isSubmitting ? 'Processing...' : 'COMPLETE ORDER'}
                        </button>

                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <FaLock /> Secure checkout powered by SSL encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
