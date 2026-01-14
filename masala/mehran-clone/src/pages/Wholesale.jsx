import React, { useState } from 'react';
import SEO from '../components/SEO';
import { FaBuilding, FaHandshake, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import wholesaleService from '../services/wholesale.service';

const Wholesale = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        requirements: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await wholesaleService.register({
                companyName: formData.companyName,
                name: formData.contactPerson,
                email: formData.email,
                businessType: 'Wholesale', // Default for this form
                requirements: formData.requirements
            });

            setIsSubmitted(true);
            setFormData({ companyName: '', contactPerson: '', email: '', requirements: '' });
        } catch (err) {
            console.error('Wholesale Form Error:', err);
            setError(err.message || 'Failed to send inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--surface-bg)' }}>
            <SEO title="Wholesale & Bulk - Al-Harmain Premium" description="Partner with us for premium bulk supplies." />

            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h5 style={{ color: 'var(--brand-primary)', letterSpacing: '3px', marginBottom: '1rem' }}>PARTNERSHIP</h5>
                    <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3.5rem', color: 'var(--text-main)' }}>Global Wholesale</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
                        Supply your restaurant, retail chain, or distribution network with the world's finest ingredients.
                    </p>
                </div>

                <div className="grid-asymmetric" style={{ gap: '3rem', alignItems: 'start' }}>
                    {/* Benefits Column */}
                    <div>
                        <div className="card-modern" style={{ padding: '3rem', marginBottom: '2rem' }}>
                            <h3 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)', marginBottom: '2rem' }}>Why Partner With Us?</h3>

                            <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ fontSize: '2rem', color: 'var(--brand-primary)' }}><FaGlobe /></div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Global Logistics</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>We ship to 40+ countries with cold-chain verified transportation.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ fontSize: '2rem', color: 'var(--brand-primary)' }}><FaBuilding /></div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Custom Packaging</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>White-label solutions available for enterprise clients.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ fontSize: '2rem', color: 'var(--brand-primary)' }}><FaHandshake /></div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Competitive Pricing</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Direct-from-farm sourcing ensures better margins for you.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inquiry Form */}
                    <div className="glass-panel" style={{ padding: '3rem' }}>
                        {!isSubmitted ? (
                            <>
                                <h3 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)', marginBottom: '2rem' }}>Inquiry Form</h3>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Company Name</label>
                                            <input required name="companyName" value={formData.companyName} onChange={handleChange} type="text" style={{ width: '100%', padding: '0.8rem', background: '#0e0e0e', border: '1px solid #333', color: '#fff' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contact Person</label>
                                            <input required name="contactPerson" value={formData.contactPerson} onChange={handleChange} type="text" style={{ width: '100%', padding: '0.8rem', background: '#0e0e0e', border: '1px solid #333', color: '#fff' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                                        <input required name="email" value={formData.email} onChange={handleChange} type="email" style={{ width: '100%', padding: '0.8rem', background: '#0e0e0e', border: '1px solid #333', color: '#fff' }} />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Requirement Details</label>
                                        <textarea required name="requirements" value={formData.requirements} onChange={handleChange} rows="5" style={{ width: '100%', padding: '0.8rem', background: '#0e0e0e', border: '1px solid #333', color: '#fff', resize: 'none' }}></textarea>
                                    </div>

                                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem' }}>{error}</p>}

                                    <button type="submit" disabled={isSubmitting} className="btn-primary-v2" style={{ marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                                        {isSubmitting ? 'Sending...' : 'Request Quote'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '4rem', color: 'var(--brand-primary)', marginBottom: '1.5rem' }}><FaCheckCircle /></div>
                                <h3 style={{ fontFamily: 'Playfair Display', color: 'var(--text-main)', marginBottom: '1rem' }}>Inquiry Received</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Our wholesale department will contact you within 24-48 hours with a customized quotation.</p>
                                <button onClick={() => setIsSubmitted(false)} className="btn-outline-v2">Send Another Inquiry</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wholesale;
