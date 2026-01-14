import React, { useEffect, useState, useRef, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes, FaChevronRight, FaCircle } from 'react-icons/fa';
import gsap from 'gsap';
import AuthModal from './AuthModal';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import productsMock from '../data/products';
import categoryService from '../services/category.service';
import productService from '../services/product.service';
import './Header.css';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount, setIsCartOpen } = useContext(CartContext);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsData, prodsData] = await Promise.all([
                    categoryService.getAll(),
                    productService.getAll()
                ]);
                // Match backend response format: { status: "success", data: [...] or { status: "success", data: { products/categories: [...] } }
                const categoryData = Array.isArray(catsData) ? catsData : (catsData.data || catsData.categories || []);
                setCategories(Array.isArray(categoryData) ? categoryData : (categoryData.categories || []));

                const productData = Array.isArray(prodsData) ? prodsData : (prodsData.data || prodsData.products || []);
                setProducts(Array.isArray(productData) ? productData : (productData.products || []));
            } catch (error) {
                console.error('Error fetching header data:', error);
            }
        };
        fetchData();
    }, []);

    // Prevent body scroll & Animate Menu
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';

            const ctx = gsap.context(() => {
                const tl = gsap.timeline();

                tl.fromTo(".menu-overlay",
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5 }
                )
                    .fromTo(".menu-line",
                        { scaleY: 0, transformOrigin: "top" },
                        { scaleY: 1, duration: 0.6, ease: "power3.inOut" },
                        "-=0.3"
                    )
                    .fromTo(".menu-item-primary",
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
                        "-=0.4"
                    )
                    .fromTo(".menu-item-secondary",
                        { x: 30, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" },
                        "-=0.6"
                    );
            }, menuRef);

            return () => ctx.revert();
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.overflowX = 'hidden';
        }
    }, [isMenuOpen]);

    const handleNavClick = (path) => {
        setIsMenuOpen(false);
        setTimeout(() => navigate(path), 300); // Slight delay for closing animation if we implemented one
    };

    // Search functionality
    const filteredProducts = searchQuery.trim()
        ? products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof product.category === 'object' ? product.category.name : product.category).toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : [];

    const handleProductClick = (productId) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        navigate(`/products`);
    };

    return (
        <>
            <header className={`header ${isScrolled ? 'scrolled' : ''}`} style={{
                position: 'fixed', top: 0, width: '100%', zIndex: 1000,
                background: isScrolled ? 'rgba(11, 11, 11, 0.8)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(15px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(201, 162, 77, 0.1)' : 'none',
                transition: 'all 0.5s ease'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isScrolled ? '0.8rem 2rem' : '1.5rem 2rem', transition: 'padding 0.5s ease' }}>

                    {/* MENU TOGGLE (Left) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>

                        <button onClick={() => setIsMenuOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            <FaBars /> <span className="hide-mobile">Menu</span>
                        </button>
                    </div>

                    {/* LOGO (Center) */}
                    <NavLink to="/" className="logo" style={{ flex: 1, display: 'flex', justifySelf: 'center', justifyContent: 'center' }}>
                        <img src="/assets/al-harmain-logo.jpg" alt="Al-Harmain Foods" style={{
                            height: isScrolled ? '45px' : '65px',
                            borderRadius: '50%',
                            border: '2px solid var(--brand-primary)',
                            transition: 'all 0.4s ease'
                        }} />
                    </NavLink>

                    {/* ICONS (Right) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--brand-primary)', flex: 1, justifyContent: 'flex-end' }}>
                        <FaSearch onClick={() => setIsSearchOpen(true)} style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            {user ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', display: window.innerWidth > 768 ? 'block' : 'none' }}>Hi, {user.name?.split(' ')[0] || 'User'}</span>
                                    <FaUser
                                        onClick={() => {
                                            if (window.confirm('Do you want to logout?')) {
                                                logout();
                                            }
                                        }}
                                        style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'var(--brand-primary)' }}
                                        title="Logout"
                                    />
                                </div>
                            ) : (
                                <FaUser onClick={() => setIsAuthOpen(true)} style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                            )}
                        </div>
                        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
                        <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
                            <FaShoppingCart style={{ fontSize: '1.2rem' }} />
                            {cartCount > 0 && <span style={{
                                position: 'absolute', top: -8, right: -8,
                                background: 'var(--brand-primary)', color: '#000',
                                fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                            }}>{cartCount}</span>}
                        </div>
                    </div>
                </div>
            </header>

            {/* FULL SCREEN MENU OVERLAY */}
            {isMenuOpen && (
                <div ref={menuRef} className="menu-overlay" style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(5, 5, 5, 0.85)',
                    backdropFilter: 'blur(25px)',
                    zIndex: 2000,
                    display: 'flex', color: '#fff'
                }}>
                    {/* Close Button */}
                    <button onClick={() => setIsMenuOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', zIndex: 10, transition: 'transform 0.3s', opacity: 0.8 }}>
                        <FaTimes />
                    </button>

                    <div className="container menu-container">
                        {/* LEFT COLUMN - PRIMARY NAV */}
                        <div className="menu-column-left">
                            {[
                                { label: 'Home', path: '/', sub: 'Back to Start' },
                                { label: 'All Products', path: '/products', sub: 'View Full Range' },
                                { label: 'About Us', path: '/about', sub: 'Our Success Story' },
                                { label: 'Gift Boxes', path: '/products?giftbox=true', sub: 'Premium Packaging', dot: true },
                                { label: 'Contact Us', path: '/contact', sub: 'Customer Support' }
                            ].map((item, i) => (
                                <div key={i}
                                    className="menu-item-primary"
                                    onClick={() => handleNavClick(item.path)}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.color = 'var(--brand-primary)';
                                        e.currentTarget.style.transform = 'translateX(10px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {item.dot && <FaCircle style={{ fontSize: '0.6rem', marginRight: '1rem', color: 'var(--brand-primary)' }} />}
                                        {item.label}
                                    </div>
                                    {/* Sub-label for extra context */}
                                    <span className="menu-item-sub">
                                        {item.sub}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* VERTICAL DIVIDER */}
                        <div className="menu-line menu-divider"></div>

                        {/* RIGHT COLUMN - SECONDARY NAV */}
                        <div className="menu-column-right">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {categories.map((cat, i) => (
                                    <span key={i} className="menu-item-secondary"
                                        onClick={() => handleNavClick(`/products?category=${encodeURIComponent(cat.name)}`)}
                                        style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        onMouseEnter={e => {
                                            e.target.style.color = 'var(--brand-primary)';
                                            e.target.style.paddingLeft = '5px';
                                        }}
                                        onMouseLeave={e => {
                                            e.target.style.color = 'rgba(255,255,255,0.6)';
                                            e.target.style.paddingLeft = '0';
                                        }}
                                    >
                                        <FaChevronRight size={10} style={{ opacity: 0.5 }} /> <span className="menu-item-secondary-text">{cat.name}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SEARCH MODAL */}
            {isSearchOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 3000,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem',
                    backdropFilter: 'blur(20px)'
                }} onClick={() => setIsSearchOpen(false)}>
                    {/* Close Button */}
                    <button onClick={() => setIsSearchOpen(false)} style={{
                        position: 'absolute', top: '2rem', right: '2rem', background: 'none',
                        border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer',
                        zIndex: 10, opacity: 0.8
                    }}>
                        <FaTimes />
                    </button>

                    {/* Search Input */}
                    <div onClick={(e) => e.stopPropagation()} style={{
                        width: '100%', maxWidth: '800px', marginTop: '10vh'
                    }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)',
                            border: '2px solid var(--brand-primary)', borderRadius: '50px',
                            padding: '1.5rem 2rem', marginBottom: '3rem'
                        }}>
                            <FaSearch style={{ color: 'var(--brand-primary)', fontSize: '1.5rem', marginRight: '1rem' }} />
                            <input
                                type="text"
                                placeholder="Search products, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                style={{
                                    flex: 1, background: 'none', border: 'none', outline: 'none',
                                    color: '#fff', fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif'
                                }}
                            />
                        </div>

                        {/* Search Results */}
                        <div style={{
                            maxHeight: '60vh', overflowY: 'auto',
                            display: 'flex', flexDirection: 'column', gap: '1rem'
                        }}>
                            {searchQuery.trim() === '' ? (
                                <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '3rem', fontSize: '1.1rem' }}>
                                    Start typing to search products...
                                </p>
                            ) : filteredProducts.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '3rem', fontSize: '1.1rem' }}>
                                    No products found matching "{searchQuery}"
                                </p>
                            ) : (
                                filteredProducts.slice(0, 10).map((product, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleProductClick(product.id)}
                                        style={{
                                            display: 'flex', gap: '1.5rem', padding: '1.5rem',
                                            background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                                            border: '1px solid rgba(201,162,77,0.2)',
                                            cursor: 'pointer', transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(201,162,77,0.1)';
                                            e.currentTarget.style.borderColor = 'var(--brand-primary)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                            e.currentTarget.style.borderColor = 'rgba(201,162,77,0.2)';
                                        }}
                                    >
                                        <img
                                            src={(product.images?.[0] || product.image) && (product.images?.[0] || product.image).startsWith('http') ? (product.images?.[0] || product.image) : ((product.images?.[0] || product.image) && (product.images?.[0] || product.image).startsWith('/') ? (product.images?.[0] || product.image) : `/api/uploads/${(product.images?.[0] || product.image) || ''}`)}
                                            alt={product.name}
                                            style={{
                                                width: '80px', height: '80px', objectFit: 'contain',
                                                background: '#000', borderRadius: '8px'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                                                {product.name}
                                            </h4>
                                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                                {typeof product.category === 'object' ? product.category.name : product.category}
                                            </p>
                                            <p style={{ color: 'var(--brand-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                Rs. {product.basePrice || product.price}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
