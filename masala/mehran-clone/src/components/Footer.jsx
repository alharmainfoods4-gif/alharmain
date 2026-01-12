import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaGoogle } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    return (
        <footer style={{
            background: 'linear-gradient(to top, var(--brand-black), var(--surface-card))',
            padding: isMobile ? '3rem 0 2rem' : '6rem 0 3rem',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(201, 162, 77, 0.1)'
        }}>
            {/* Background Pattern */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.05,
                backgroundImage: 'repeating-linear-gradient(45deg, var(--brand-primary) 0, var(--brand-primary) 1px, transparent 0, transparent 50%)',
                backgroundSize: '30px 30px'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: isMobile ? '2rem' : '4rem', marginBottom: isMobile ? '3rem' : '5rem' }}>

                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <img src="/assets/al-harmain-logo.jpg" alt="Al-Harmain Foods" style={{ height: isMobile ? '60px' : '70px', borderRadius: '50%', border: '1px solid var(--brand-primary)' }} />
                            <h3 style={{ margin: 0, color: 'var(--brand-primary)', fontFamily: 'Playfair Display, serif', fontSize: isMobile ? '1.5rem' : '1.8rem' }}>Al Harmain Foods</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            A legacy of purity, bringing the sacred authentic flavors of tradition to your modern table.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 style={{ color: 'var(--brand-primary)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Explore</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Our Story', 'Premium Products', 'Culinary Recipes', 'Traceability'].map(item => (
                                <li key={item} style={{ color: 'var(--text-main)', cursor: 'pointer', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--brand-primary)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-main)'}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: 'var(--brand-primary)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
                            <li>Karachi, Pakistan</li>
                            <li>alharmainfoods4@gmail.com</li>
                            <li>03432309181</li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 style={{ color: 'var(--brand-primary)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {[FaFacebook, FaInstagram, FaYoutube, FaGoogle].map((Icon, i) => (
                                <div key={i} style={{
                                    width: isMobile ? '40px' : '45px',
                                    height: isMobile ? '40px' : '45px',
                                    borderRadius: '50%',
                                    border: '1px solid var(--brand-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--brand-primary)', cursor: 'pointer', transition: 'all 0.3s'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--brand-primary)';
                                        e.currentTarget.style.color = '#000';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--brand-primary)';
                                    }}>
                                    <Icon size={isMobile ? 16 : 18} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: isMobile ? '1.5rem' : '2rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: isMobile ? '0.8rem' : '0.9rem'
                }}>
                    <span>&copy; 2025 Al-Harmain Foods. With Respect & Authenticity.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
