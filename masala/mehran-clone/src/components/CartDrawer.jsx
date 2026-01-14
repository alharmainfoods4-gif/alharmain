import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeItem, subTotal, setShowCheckoutModal } = useContext(CartContext);
    const { isAuthenticated, setIsAuthModalOpen } = useContext(AuthContext);
    const navigate = useNavigate();
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'flex-end',
            visibility: isCartOpen ? 'visible' : 'hidden'
        }}>
            {/* Backdrop */}
            <div
                onClick={() => setIsCartOpen(false)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(3px)',
                    opacity: isCartOpen ? 1 : 0,
                    transition: 'opacity 0.3s'
                }}
            />

            {/* Drawer */}
            <div style={{
                width: '100%',
                maxWidth: '400px',
                height: '100%',
                background: 'var(--bg-black)',
                borderLeft: '1px solid var(--gold-primary)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-out',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.8)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--gold-primary)', margin: 0 }}>Shopping Cart</h2>
                    <FaTimes
                        onClick={() => setIsCartOpen(false)}
                        style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
                    />
                </div>

                {/* Items List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cartItems.map((item, idx) => {
                            // Robust ID extraction handling both populated (object) and unpopulated (string) products
                            let productId;
                            if (item.product && typeof item.product === 'object') {
                                productId = item.product._id || item.product.id;
                            } else if (typeof item.product === 'string') {
                                productId = item.product;
                            } else {
                                productId = item._id || item.id;
                            }
                            return (
                                <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #333' }}>
                                    <div style={{ width: '80px', height: '80px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img
                                            src={(item.images?.[0] || item.image || item.img) && (item.images?.[0] || item.image || item.img).startsWith('http') ? (item.images?.[0] || item.image || item.img) : ((item.images?.[0] || item.image || item.img) && (item.images?.[0] || item.image || item.img).startsWith('/') ? (item.images?.[0] || item.image || item.img) : `/api/uploads/${(item.images?.[0] || item.image || item.img) || ''}`)}
                                            alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.product?.name || item.name}</h4>
                                            <FaTrash
                                                onClick={() => removeItem(productId, item.variant?.size)}
                                                style={{ cursor: 'pointer', color: '#ff4444', fontSize: '0.9rem' }}
                                            />
                                        </div>
                                        {item.variant?.size && (
                                            <p style={{ color: 'var(--gold-primary)', fontSize: '0.8rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                Weight: {item.variant.size}
                                            </p>
                                        )}
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>Rs. {item.variant?.price || item.basePrice || item.price}</p>

                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            border: '1px solid #333',
                                            borderRadius: '20px',
                                            background: 'var(--bg-dark)'
                                        }}>
                                            <button
                                                onClick={() => updateQuantity(productId, -1, item.variant?.size)}
                                                style={{ padding: '5px 12px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                                            ><FaMinus size={10} /></button>
                                            <span style={{ fontSize: '0.9rem', color: 'white', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(productId, 1, item.variant?.size)}
                                                style={{ padding: '5px 12px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                                            ><FaPlus size={10} /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })

                    )}
                </div>

                {/* Footer */}
                <div style={{ borderTop: '1px solid #333', paddingTop: '1.5rem', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span style={{ color: 'var(--text-primary)' }}>SubTotal</span>
                        <span style={{ color: 'var(--gold-primary)' }}>Rs. {subTotal}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <button
                            onClick={() => {
                                setIsCartOpen(false);
                                if (!isAuthenticated) {
                                    setIsAuthModalOpen(true);
                                    return;
                                }
                                // Open checkout modal instead of navigating
                                setTimeout(() => {
                                    setShowCheckoutModal(true);
                                }, 100);
                            }}
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, var(--gold-primary) 0%, #d4a853 100%)',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                boxShadow: '0 4px 15px rgba(201, 162, 77, 0.4)',
                                transition: 'all 0.3s ease',
                                fontFamily: 'var(--font-body)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 162, 77, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(201, 162, 77, 0.4)';
                            }}>
                            Buy Now
                        </button>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #b8935c 0%, var(--gold-primary) 100%)',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                boxShadow: '0 4px 15px rgba(184, 147, 92, 0.4)',
                                transition: 'all 0.3s ease',
                                fontFamily: 'var(--font-body)',
                                opacity: 0.9
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '1';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(184, 147, 92, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '0.9';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(184, 147, 92, 0.4)';
                            }}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
