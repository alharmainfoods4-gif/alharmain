import React, { useEffect, useState, useRef } from 'react';
import SEO from '../components/SEO';
import gsap from 'gsap';
import api from '../services/api';
import { API_ROUTES } from '../config/constants';

import { FaPlane, FaShip, FaCheckCircle } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const canvasRef = useRef(null);
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // Removed problematic GSAP animation that was causing fade issues

    // Confetti Effect
    useEffect(() => {
        if (isSubmitted && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];
            const colors = ['#C9A24D', '#F5F1E8', '#FFFFFF', '#D4AF37'];

            for (let i = 0; i < 150; i++) {
                particles.push({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    vx: (Math.random() - 0.5) * 20,
                    vy: (Math.random() - 0.5) * 20,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 5 + 2,
                    alpha: 1
                });
            }

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach((p, i) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.2; // Gravity
                    p.alpha -= 0.01;

                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();

                    if (p.alpha <= 0) particles.splice(i, 1);
                });

                if (particles.length > 0) requestAnimationFrame(draw);
            }
            draw();
        }
    }, [isSubmitted]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await api.post(API_ROUTES.CMS.CONTACT, {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                message: formData.message
            });

            if (response.data.success) {
                setIsSubmitted(true);
                setFormData({ firstName: '', lastName: '', email: '', message: '' });
                // Reset after 5 seconds
                setTimeout(() => setIsSubmitted(false), 5000);
            } else {
                setError(response.data.message || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Contact Form Error:', err);
            setError(err.message || 'Failed to connect to server. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: isMobile ? '1rem' : '1.2rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'var(--text-main)',
        outline: 'none',
        fontSize: isMobile ? '0.9rem' : '1rem',
        transition: 'all 0.3s',
        marginBottom: '0.5rem'
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = 'var(--brand-primary)';
        e.target.style.boxShadow = '0 0 15px rgba(201, 162, 77, 0.2)';
        e.target.style.background = 'rgba(201, 162, 77, 0.05)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.target.style.boxShadow = 'none';
        e.target.style.background = 'rgba(255, 255, 255, 0.03)';
    };

    return (
        <>
            <SEO title="Contact - Al-Harmain Premium" description="Get in touch with Al-Harmain Foods." />
            <div style={{ paddingTop: isMobile ? '100px' : '140px', paddingBottom: isMobile ? '3rem' : '6rem', minHeight: '100vh', background: 'var(--surface-bg)', position: 'relative', overflow: 'hidden' }}>

                {/* Floating Particles Background */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    {[...Array(isMobile ? 10 : 20)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            background: 'var(--brand-primary)',
                            opacity: 0.2,
                            borderRadius: '50%',
                            animation: `float ${10 + Math.random() * 10}s infinite linear`
                        }} />
                    ))}
                </div>

                {isSubmitted && <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }} />}

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>

                    {!isSubmitted ? (
                        <>
                            <div className="contact-anim" style={{ textAlign: 'center', marginBottom: isMobile ? '3rem' : '5rem' }}>
                                <h5 style={{ color: 'var(--brand-primary)', letterSpacing: isMobile ? '2px' : '4px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem', fontSize: isMobile ? '0.75rem' : '0.9rem' }}>Get In Touch</h5>
                                <h1 style={{ fontSize: isMobile ? 'clamp(2rem, 8vw, 2.5rem)' : '3.5rem', color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>
                                    We'd Love to <span style={{ color: 'var(--brand-primary)', fontStyle: 'italic' }}>Hear From You</span>
                                </h1>
                                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: isMobile ? '1rem' : '1.1rem', padding: isMobile ? '0 1rem' : '0' }}>
                                    Whether you have a question about our premium blends, pricing, or heritage, our team is ready to assist.
                                </p>
                            </div>

                            <div className="grid-asymmetric" style={{ alignItems: 'start', gap: isMobile ? '2rem' : '3rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                                {/* Left Side: Contact Info */}
                                <div className="contact-anim">
                                    {/* Global Offices */}


                                    {/* Export & Logistics */}


                                    {/* Direct Contact */}
                                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Priority Support</p>
                                        <h3 style={{ color: 'var(--brand-primary)', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>03432309181</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>alharmainfoods4@gmail.com</p>
                                    </div>
                                </div>

                                {/* Right Side: Form */}
                                <div className="card-modern contact-anim" style={{ padding: isMobile ? '2rem 1.5rem' : '2.5rem', background: '#121212', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--text-main)', fontSize: '0.9rem', letterSpacing: '1px' }}>FIRST NAME</label>
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} placeholder="John" required onFocus={handleFocus} onBlur={handleBlur} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--text-main)', fontSize: '0.9rem', letterSpacing: '1px' }}>LAST NAME</label>
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} placeholder="Doe" required onFocus={handleFocus} onBlur={handleBlur} />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--text-main)', fontSize: '0.9rem', letterSpacing: '1px' }}>EMAIL ADDRESS</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="john@example.com" required onFocus={handleFocus} onBlur={handleBlur} />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--text-main)', fontSize: '0.9rem', letterSpacing: '1px' }}>MESSAGE</label>
                                            <textarea name="message" value={formData.message} onChange={handleChange} rows="5" style={{ ...inputStyle, resize: 'none' }} placeholder="How can we help you?" required onFocus={handleFocus} onBlur={handleBlur}></textarea>
                                        </div>

                                        {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                                        <button type="submit" disabled={isSubmitting} className="btn-primary-v2" style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', opacity: isSubmitting ? 0.7 : 1 }}>
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontSize: '5rem', marginBottom: '2rem', animation: 'bounce 1s', color: 'var(--brand-primary)' }}><FaCheckCircle /></div>
                            <h2 style={{ fontSize: '3rem', color: 'var(--brand-primary)', fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>Message Received</h2>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '500px' }}>
                                Thank you for contacting Al-Harmain Premium. Our concierge team will review your inquiry and respond within 24 hours.
                            </p>
                            <button onClick={() => setIsSubmitted(false)} className="btn-outline-v2" style={{ marginTop: '3rem' }}>Send Another Message</button>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Contact;
