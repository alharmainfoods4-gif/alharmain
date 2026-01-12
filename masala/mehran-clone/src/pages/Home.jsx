import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO';
import productsMock, { categories as categoriesMock } from '../data/products';
import productService from '../services/product.service';
import categoryService from '../services/category.service';
import { FaGlobe, FaAward, FaCertificate, FaHandshake, FaLeaf, FaHandPaper, FaBolt, FaBox, FaMicroscope, FaClock, FaLock, FaCheck } from 'react-icons/fa';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const mainRef = useRef(null);
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    // Keeping isMobile for JS-based logic (GSAP) if needed, but styling is now CSS-driven
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // Get one product from each category for "Signatures"
    const bestSellers = React.useMemo(() => {
        if (!products.length) return [];

        const signatureSet = new Set();
        const result = [];

        categories.forEach(cat => {
            const product = products.find(p => {
                const catName = typeof p.category === 'object' ? p.category.name : p.category;
                return catName === cat.name;
            });

            if (product && !signatureSet.has(product._id || product.id)) {
                signatureSet.add(product._id || product.id);
                result.push(product);
            }
        });

        return result;
    }, [products, categories]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodsData, catsData] = await Promise.all([
                    productService.getAll(),
                    categoryService.getAll()
                ]);
                setProducts(Array.isArray(prodsData) ? prodsData : (prodsData.products || []));
                setCategories(Array.isArray(catsData) ? catsData : (catsData.categories || []));
            } catch (error) {
                console.error('Error fetching home data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!bestSellers.length) return;

        const ctx = gsap.context(() => {
            // 1. Hero Entrance (Only on mount)
            const heroTl = gsap.timeline();
            heroTl
                .from(".hero-char", {
                    yPercent: 110,
                    duration: 1.5,
                    stagger: 0.05,
                    ease: "power3.out"
                })
                .from(".hero-fade", {
                    opacity: 0,
                    y: 20,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power2.out"
                }, "-=0.2");

            // 2. Horizontal Scroll Section - Desktop only
            if (window.innerWidth > 768) {
                const horizontalContent = document.querySelector(".horizontal-content");
                // Use a slight delay to ensure the DOM has updated with the products
                setTimeout(() => {
                    const width = horizontalContent?.offsetWidth;
                    if (width && width > window.innerWidth) {
                        gsap.to(".horizontal-content", {
                            x: () => -(width - window.innerWidth),
                            ease: "none",
                            scrollTrigger: {
                                trigger: "#horizontal-scroll",
                                pin: true,
                                scrub: 1,
                                invalidateOnRefresh: true,
                                end: () => "+=" + (width - window.innerWidth)
                            }
                        });
                        ScrollTrigger.refresh();
                    }
                }, 100);
            }

            // 3. Section Headers Reveal
            gsap.utils.toArray(".section-header").forEach(header => {
                gsap.from(header, {
                    y: 50, opacity: 0, duration: 1,
                    scrollTrigger: {
                        trigger: header,
                        start: "top 85%"
                    }
                });
            });

            // 4. Awards Stagger
            gsap.from(".award-card", {
                y: 50, opacity: 0, duration: 0.8, stagger: 0.15,
                scrollTrigger: {
                    trigger: ".awards-grid",
                    start: "top 80%"
                }
            });

            // 5. Global Presence Parallax
            gsap.to(".globe-bg", {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: ".global-section",
                    scrub: true
                }
            });

        }, mainRef);

        return () => ctx.revert();
    }, [bestSellers.length]);

    return (
        <div ref={mainRef} style={{ background: 'var(--surface-bg)', overflowX: 'hidden' }}>
            <SEO title="Home - Al-Harmain Premium" description="Experience the sacred taste of authentic premium foods." />

            {/* 1. HERO SECTION */}
            <section className="hero-section">
                {/* Video Background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }}
                    >
                        <source src="/images/Al Harmain Foods_Clip.mp4" type="video/mp4" />
                    </video>
                    {/* Dark overlay for text readability */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35))',
                        zIndex: 1
                    }}></div>
                </div>

                <div className="container z-layer-2" style={{ textAlign: 'center', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <h5 className="hero-fade hero-subtitle">
                        Since 2000
                    </h5>

                    <div style={{ overflow: 'hidden', marginBottom: '1rem' }}>
                        <h1 className="hero-title">
                            <div className="text-reveal-mask" style={{ display: 'block' }}>
                                {"SACRED".split("").map((char, i) => <span key={i} className="char hero-char" style={{ display: 'inline-block' }}>{char}</span>)}
                            </div>
                            <div className="text-reveal-mask" style={{ display: 'block' }}>
                                {"ORIGINS".split("").map((char, i) => <span key={i} className="char hero-char shimmer-gold" style={{ fontStyle: 'italic', display: 'inline-block' }}>{char}</span>)}
                            </div>
                        </h1>
                    </div>

                    {/* Spacer to push buttons down */}
                    <div style={{ flex: 1 }}></div>

                    {/* Buttons - positioned above scroll indicator */}
                    <div className="hero-fade hero-buttons">
                        <Link to="/products" className="btn-primary-v2" style={{ padding: '0.75rem 2rem', textDecoration: 'none' }}>Explore Collection</Link>
                        <Link to="/about" className="btn-outline-v2" style={{ padding: '0.65rem 2rem', textDecoration: 'none' }}>Our Legacy</Link>
                    </div>
                </div>
            </section>

            {/* 2. PINNED HORIZONTAL SCROLL (SIGNATURES) */}
            <section id="horizontal-scroll" className="signatures-section">
                <div className="horizontal-content">

                    {/* Intro Block */}
                    <div className="signature-intro">
                        <span style={{ color: 'var(--brand-primary)', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '1rem' }}>Curated Selection</span>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontFamily: 'Playfair Display, serif', lineHeight: '1.1', margin: '1rem 0' }}>
                            Our Finest <br /> <span className="shimmer-gold" style={{ fontStyle: 'italic' }}>Signatures</span>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            Products that have defined our legacy for over 40 years, representing our diverse premium ranges.
                        </p>
                    </div>

                    {bestSellers.map((product, i) => (
                        <Link to="/products" key={product.id || product._id} className="card-modern signature-card">
                            <div className="signature-img-container">
                                <img src={(product.images?.[0] || product.image) && (product.images?.[0] || product.image).startsWith('http') ? (product.images?.[0] || product.image) : ((product.images?.[0] || product.image) && (product.images?.[0] || product.image).startsWith('/') ? (product.images?.[0] || product.image) : `/api/uploads/${(product.images?.[0] || product.image) || ''}`)} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain', transition: 'transform 0.5s' }}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                />
                                {product.badges?.[0] && (
                                    <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'rgba(201, 162, 77, 0.1)', color: 'var(--brand-primary)', padding: '0.4rem 0.8rem', fontSize: '0.75rem', backdropFilter: 'blur(5px)', border: '1px solid rgba(201, 162, 77, 0.2)' }}>
                                        {product.badges[0]}
                                    </div>
                                )}
                            </div>
                            <div className="signature-details">
                                <div>
                                    <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontFamily: 'Playfair Display, serif', minHeight: '3.2rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{typeof product.category === 'object' ? product.category.name : product.category}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '1.4rem', color: 'var(--brand-primary)', fontWeight: 'bold' }}>Rs. {product.basePrice || product.price}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Shop Now →</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    <div style={{ minWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Link to="/products" className="btn-outline-v2">View All Collection</Link>
                    </div>
                </div>
            </section>

            {/* 3. AWARDS & CERTIFICATIONS (New Section) */}
            <section className="awards-section">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h5 style={{ color: 'var(--brand-primary)', letterSpacing: '3px' }}>WORLD CLASS STANDARDS</h5>
                        <h2 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif' }}>Certified Excellence</h2>
                    </div>

                    <div className="awards-grid">
                        {[
                            { icon: <FaAward />, title: "Brand of the Year", desc: "Awarded for 5 consecutive years" },
                            { icon: <FaCertificate />, title: "ISO 22000 Certified", desc: "Highest food safety standards" },
                            { icon: <FaHandshake />, title: "Halal Certified", desc: "100% Shariah Compliant" },
                            { icon: <FaGlobe />, title: "Top Exporter", desc: "Serving 40+ countries globally" }
                        ].map((item, i) => (
                            <div key={i} className="award-card glass-panel">
                                <div style={{ fontSize: '3rem', color: 'var(--brand-primary)', opacity: 0.8 }}>{item.icon}</div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. EXPORT & GLOBAL PRESENCE (New Section) */}
            <section className="global-section">
                <div className="globe-bg" style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', opacity: 0.1, zIndex: 0 }}>
                    <img src="/assets/globe_grid.png" onError={(e) => e.target.style.display = 'none'} alt="" style={{ width: '100%' }} />
                    {/* Fallback geometric shape if image fails */}
                    <div style={{ width: '600px', height: '600px', border: '1px solid var(--brand-primary)', borderRadius: '50%', position: 'absolute' }}></div>
                </div>

                <div className="container z-layer-1 global-grid">
                    <div className="section-header">
                        <h5 style={{ color: 'var(--brand-primary)', letterSpacing: '3px', marginBottom: '1rem', fontSize: '1rem' }}>GLOBAL FOOTPRINT</h5>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'Playfair Display, serif', lineHeight: '1.1', marginBottom: '2rem' }}>
                            From Our Soil <br /> to the <span style={{ fontStyle: 'italic', color: 'var(--brand-primary)' }}>World</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '3rem' }}>
                            Al-Harmain Foods is a proud ambassador of Pakistani flavor. With a robust supply chain spanning 4 continents, we ensure that the taste of home is never far away, no matter where you are.
                        </p>
                        <div className="global-stats">
                            <div>
                                <h3 style={{ fontSize: '3rem', color: '#fff', marginBottom: '0.5rem' }}>40+</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Countries Served</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '3rem', color: '#fff', marginBottom: '0.5rem' }}>500+</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Global Distributors</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-modern global-image-card">
                        <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80" alt="Shipping" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                        <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '2rem', background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}>
                            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Logistics Excellence</h4>
                            <p style={{ color: 'var(--text-muted)' }}>State-of-the-art warehousing ensuring freshness on arrival.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. ENHANCED PHILOSOPHY SECTION */}
            <section className="philosophy-wrapper philosophy-section">
                <div className="container">
                    {/* Main Philosophy Block */}
                    <div className="philosophy-main-grid">
                        <div className="section-header">
                            <h5 style={{ color: 'var(--brand-primary)', marginBottom: '2rem', letterSpacing: '2px' }}>OUR PHILOSOPHY</h5>
                            <h2 style={{ fontSize: '3.5rem', lineHeight: '1.2', fontFamily: 'Playfair Display, serif', marginBottom: '2rem' }}>
                                Rooted in <br /> <span style={{ fontStyle: 'italic', color: 'var(--brand-secondary)' }}>Spiritual Purity.</span>
                            </h2>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
                                We believe that food is not just sustenance—it is a blessing. Every product we source honors the earth it grew in and the hands that harvested it.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '2' }}>
                                <li style={{ marginBottom: '1rem', display: 'flex', items: 'center', gap: '8px' }}><FaCheck color="var(--brand-primary)" /> Ethically sourced from trusted farmers</li>
                                <li style={{ marginBottom: '1rem', display: 'flex', items: 'center', gap: '8px' }}><FaCheck color="var(--brand-primary)" /> Traditional methods meet modern standards</li>
                                <li style={{ marginBottom: '1rem', display: 'flex', items: 'center', gap: '8px' }}><FaCheck color="var(--brand-primary)" /> Preserving ancient recipes and techniques</li>
                            </ul>
                        </div>

                        {/* Image Grid */}
                        <div className="philosophy-images-grid">
                            <div className="card-modern philosophy-img-card">
                                <img src="/images/Post 3.jpg" alt="Spices"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="card-modern philosophy-img-card" style={{ marginTop: '2rem' }}>
                                <img src="/images/Post 2.jpg" alt="Grinding"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="card-modern philosophy-img-card" style={{ marginTop: '-2rem' }}>
                                <img src="/images/Dry Fruit_Post1.jpg" alt="Packaging"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="card-modern philosophy-img-card">
                                <img src="/images/Honey_Post2.jpg" alt="Quality Check"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>
                    </div>

                    {/* Sustainability Block */}
                    <div className="glass-panel sustainability-block">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--brand-primary)' }}><FaGlobe /></div>
                            <h3 style={{ fontSize: '2rem', fontFamily: 'Playfair Display, serif', marginBottom: '1rem', color: 'var(--text-main)' }}>Sustainable Sourcing</h3>
                        </div>
                        <div>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                Our commitment to sustainability goes beyond just quality. We partner directly with farmers, ensuring fair wages and supporting their communities. Every purchase helps preserve traditional farming methods while protecting our planet.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', marginTop: '2rem', justifyContent: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '2rem', color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>100%</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Organic Certified</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '2rem', color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>500+</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Partner Farmers</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '2rem', color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>Zero</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Waste Policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. THE TREASURY (CATEGORIES) */}
            <section className="treasury-section">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ width: '60px', height: '2px', background: 'var(--brand-primary)', margin: '0 auto 2rem', opacity: 0.5 }}></div>
                        <h2 style={{ fontSize: '4rem', fontFamily: 'Playfair Display, serif', color: 'var(--text-main)' }}>The Treasury</h2>
                        <p style={{ color: 'var(--text-muted)', letterSpacing: '4px', textTransform: 'uppercase' }}>Explore Our Collections</p>
                    </div>

                    <div className="categories-grid grid-asymmetric treasury-grid">
                        {categories.map((cat, i) => (
                            <Link to={`/products?category=${encodeURIComponent(cat.name)}${cat.name.toLowerCase().includes('box') || cat.name.toLowerCase().includes('gift') ? '&giftbox=true' : ''}`} key={i} className="cat-card card-modern">
                                <img src={cat.image && cat.image.startsWith('http') ? cat.image : (cat.image && cat.image.startsWith('/') ? cat.image : `/api/uploads/${cat.image || ''}`)} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)' }} />
                                <div className="cat-card-content">
                                    <h3 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>{cat.desc}</p>
                                    <span style={{ marginTop: '2rem', display: 'inline-block', color: 'var(--brand-primary)', borderBottom: '1px solid var(--brand-primary)', paddingBottom: '5px' }}>Discover Collection</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
