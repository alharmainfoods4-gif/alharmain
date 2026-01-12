import React, { useState, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
    const { login, register } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login({ email: formData.email, password: formData.password });
            } else {
                if (register) {
                    await register(formData);
                } else {
                    // Fallback if register not in context yet
                    console.error('Logout or Register not implemented');
                }
            }
            onClose();
        } catch (err) {
            console.error('Auth Error:', err);
            if (err.errors && Array.isArray(err.errors)) {
                setError(err.errors[0].msg || 'Validation failed');
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(8px)'
        }} onClick={onClose}>
            <div style={{
                background: '#1A1A1A',
                padding: '2.5rem 3rem',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(201, 162, 77, 0.2)',
                color: '#fff'
            }} onClick={e => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '1.2rem',
                    right: '1.2rem',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: 'var(--brand-primary)',
                    transition: 'transform 0.2s',
                    padding: '5px'
                }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    <FaTimes />
                </button>

                <h2 style={{
                    fontSize: '2.5rem',
                    marginBottom: '2rem',
                    color: 'var(--brand-primary)', // Gold color
                    fontFamily: 'var(--font-heading)',
                    textAlign: 'center'
                }}>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </h2>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                    {error && (
                        <div style={{ color: '#ff4d4d', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(255, 77, 77, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '50px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                outline: 'none',
                                fontSize: '1rem',
                                color: 'white',
                                colorScheme: 'dark',
                                fontFamily: 'var(--font-body)'
                            }} />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                            padding: '1rem 1.5rem',
                            borderRadius: '50px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            outline: 'none',
                            fontSize: '1rem',
                            color: 'white',
                            colorScheme: 'dark',
                            fontFamily: 'var(--font-body)'
                        }} />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{
                            padding: '1rem 1.5rem',
                            borderRadius: '50px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            outline: 'none',
                            fontSize: '1rem',
                            color: 'white',
                            colorScheme: 'dark',
                            fontFamily: 'var(--font-body)'
                        }} />

                    {isLogin && (
                        <div style={{ textAlign: 'right' }}>
                            <a href="#" style={{ color: '#aaa', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.3s' }}
                                onMouseOver={(e) => e.target.style.color = 'var(--brand-primary)'}
                                onMouseOut={(e) => e.target.style.color = '#aaa'}
                            >Forgot password?</a>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: loading ? '#666' : 'var(--brand-primary)',
                            color: '#000',
                            padding: '1rem',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '0.5rem',
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '1px',
                            transition: 'transform 0.2s, background 0.2s',
                            boxShadow: '0 4px 15px rgba(201, 162, 77, 0.3)'
                        }}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.background = '#fff';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.background = 'var(--brand-primary)';
                            }
                        }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>

                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: '#888', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
                    {isLogin ? "Don't have an account ?" : "Already have an account ?"}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--brand-primary)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}
                    >
                        {isLogin ? 'Signup' : 'Signin'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
