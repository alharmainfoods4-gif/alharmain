import React, { useState } from 'react';
import SEO from '../components/SEO';
import { FaTruck, FaSearch, FaBoxOpen, FaCheckCircle } from 'react-icons/fa';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = (e) => {
        e.preventDefault();
        if (!orderId) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStatus({
                id: orderId,
                state: 'In Transit',
                location: 'Lahore Distribution Center',
                estimated: '2 Days'
            });
        }, 1500);
    };

    return (
        <div style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--surface-bg)' }}>
            <SEO title="Track Order - Al-Harmain Premium" description="Track the status of your premium shipment." />

            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h5 style={{ color: 'var(--brand-primary)', letterSpacing: '3px', marginBottom: '1rem' }}>LOGISTICS</h5>
                    <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3.5rem', color: 'var(--text-main)' }}>Track Your Shipment</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>
                        Enter your Order ID to see the realtime status of your delivery.
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem' }}>
                    <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Order ID (e.g., AH-8921)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '1rem',
                                color: '#fff',
                                borderRadius: '4px',
                                outline: 'none'
                            }}
                        />
                        <button type="submit" className="btn-primary-v2" style={{ padding: '0 2rem' }}>
                            {loading ? 'Tracking...' : 'Track'}
                        </button>
                    </form>
                </div>

                {status && (
                    <div className="fade-in" style={{ borderLeft: '2px solid var(--brand-primary)', paddingLeft: '2rem' }}>
                        <h3 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)', marginBottom: '1rem' }}>Order Status: {status.state}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201, 162, 77, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                                    <FaCheckCircle />
                                </div>
                                <div>
                                    <h6 style={{ color: '#fff', marginBottom: '0.2rem' }}>Order Confirmed</h6>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yesterday, 10:00 AM</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201, 162, 77, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                                    <FaTruck />
                                </div>
                                <div>
                                    <h6 style={{ color: '#fff', marginBottom: '0.2rem' }}>In Transit - {status.location}</h6>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Today, 02:30 PM</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                    <FaBoxOpen />
                                </div>
                                <div>
                                    <h6 style={{ color: '#fff', marginBottom: '0.2rem' }}>Expected Delivery</h6>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{status.estimated}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
