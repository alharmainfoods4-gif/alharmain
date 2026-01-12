import React, { useEffect, useRef } from 'react';
import SEO from '../components/SEO';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { FaSpa, FaStar, FaCertificate, FaMicroscope } from 'react-icons/fa';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Text Reveals
            gsap.from('.animate-text', {
                y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out'
            });

            // 2. Timeline Line
            gsap.fromTo('.timeline-line',
                { scaleY: 0 },
                {
                    scaleY: 1, duration: 2, ease: 'none',
                    scrollTrigger: {
                        trigger: '.timeline-section',
                        start: 'top center', end: 'bottom center', scrub: true
                    }
                }
            );

            // 3. Timeline Items
            document.querySelectorAll('.timeline-item').forEach((item, index) => {
                gsap.from(item, {
                    x: index % 2 === 0 ? -50 : 50, opacity: 0, duration: 1,
                    scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: "play none none reverse" }
                });
            });

            // 4. Stats Counter Animation
            gsap.utils.toArray(".stat-number").forEach(stat => {
                const target = parseInt(stat.getAttribute("data-target"));
                gsap.to(stat, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    scrollTrigger: { trigger: stat, start: "top 85%" }
                });
            });



        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef}>
            <SEO title="Our Legacy - Al-Harmain Premium" description="The story of Al-Harmain Foods, a journey of taste and tradition." />
            <div style={{ paddingTop: '100px', paddingBottom: '4rem', minHeight: '100vh', background: 'var(--surface-bg)', overflowX: 'hidden' }}>

                {/* HERO / STORY */}
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 4rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', fontSize: '10rem', color: 'var(--brand-primary)', opacity: 0.03, zIndex: 0, pointerEvents: 'none', display: 'flex', justifyContent: 'center' }}><FaSpa /></div>
                        <h5 className="animate-text" style={{ color: 'var(--brand-primary)', letterSpacing: '4px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem', fontSize: '0.9rem' }}>Since 2000</h5>
                        <h1 className="animate-text" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--text-main)', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif', lineHeight: '1.1', position: 'relative', zIndex: 1 }}>
                            Preserving the <br /> <span style={{ fontStyle: 'italic', color: 'var(--brand-primary)' }}>Art of Flavor</span>
                        </h1>
                        <p className="animate-text" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                            Al-Harmain Foods began with a sacred promise: to bring the authentic taste of tradition to every home.
                            From humble beginnings in the heart of the Orient, we have grown into a global symbol of purity, quality, and reverence for nature's bounty.
                        </p>
                    </div>

                    {/* IMAGE BANNER */}
                    <div className="animate-text" style={{
                        width: '100%', height: '400px', borderRadius: '30px', overflow: 'hidden', marginBottom: '5rem',
                        position: 'relative', border: '1px solid rgba(201, 162, 77, 0.2)'
                    }}>
                        <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80" alt="Spices" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface-bg), transparent 50%, rgba(0,0,0,0.3))' }} />
                        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', maxWidth: '400px' }}>
                            <h3 style={{ fontSize: '2rem', color: '#fff', fontFamily: 'Playfair Display, serif' }}>Nature's Finest</h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Sourced from the fertile valleys where tradition meets the sun.</p>
                        </div>
                    </div>

                    {/* LIVE STATS COUNTER */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '6rem', textAlign: 'center' }}>
                        {[
                            { label: "Years of Legacy", val: 26 },
                            { label: "Countries Served", val: 40 },
                            { label: "Products", val: 120 },
                            { label: "Global Partners", val: 500 }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div style={{ fontSize: '3.5rem', color: 'var(--brand-primary)', fontFamily: 'Playfair Display', lineHeight: 1 }}>
                                    <span className="stat-number" data-target={stat.val}>0</span>+
                                </div>
                                <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* TIMELINE */}
                    <div className="timeline-section" style={{ marginBottom: '6rem', position: 'relative' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <span style={{ color: 'var(--brand-primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>Our Heritage</span>
                            <h2 style={{ fontSize: '3rem', color: 'var(--text-main)', fontFamily: 'Playfair Display, serif' }}>A Journey through Time</h2>
                        </div>
                        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                            <div className="timeline-line" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, transparent, var(--brand-primary), transparent)', transform: 'translateX(-50%)', transformOrigin: 'top' }} />
                            {[
                                { year: '2000', title: 'The Beginning', text: 'Started as a small family spice business in the heart of Karachi, dedicated to pure blends.' },
                                { year: '2010', title: 'Global Expansion', text: 'Opened our first international hub in Dubai, bringing our sacred flavors to the Middle East.' },
                                { year: '2018', title: 'Innovation Era', text: 'Launched state-of-the-art automated manufacturing facilities with ISO certification.' },
                                { year: '2025', title: 'Market Leader', text: 'Celebrated as a premium global food brand, authentic to its roots and loved by millions.' }
                            ].map((item, i) => (
                                <div key={i} className="timeline-item" style={{
                                    display: 'flex', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
                                    marginBottom: '3rem', paddingRight: i % 2 === 0 ? '50%' : 0, paddingLeft: i % 2 !== 0 ? '50%' : 0, position: 'relative'
                                }}>
                                    <div className="card-modern" style={{
                                        padding: '2rem', width: '90%', marginLeft: i % 2 !== 0 ? '3rem' : 0, marginRight: i % 2 === 0 ? '3rem' : 0,
                                        textAlign: i % 2 === 0 ? 'right' : 'left', background: 'linear-gradient(145deg, #121212, #0e0e0e)', border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <span style={{ fontSize: '3rem', color: 'rgba(201, 162, 77, 0.1)', fontWeight: 'bold', display: 'block', lineHeight: 0.8, marginBottom: '0.5rem', fontFamily: 'serif' }}>{item.year}</span>
                                        <h4 style={{ fontSize: '1.3rem', color: 'var(--brand-primary)', margin: '0 0 1rem', fontFamily: 'Playfair Display, serif' }}>{item.title}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.text}</p>
                                    </div>
                                    <div className="timeline-dot" style={{
                                        position: 'absolute', left: '50%', top: '50%', width: '14px', height: '14px', background: '#000', border: '2px solid var(--brand-primary)', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px var(--brand-primary)'
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>



                    {/* VALUES SECTION */}
                    <div style={{ marginBottom: '4rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '3rem', color: 'var(--text-main)', fontFamily: 'Playfair Display, serif' }}>Our Core Values</h2>
                        </div>
                        <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                            {[
                                { title: 'Purity', icon: <FaStar />, desc: 'We source only the finest ingredients, ensuring zero compromises on quality to deliver the purest essence.' },
                                { title: 'Authenticity', icon: <FaCertificate />, desc: 'Our recipes are crafted to preserve the traditional tastes passed down through generations of culinary masters.' },
                                { title: 'Innovation', icon: <FaMicroscope />, desc: 'Embracing modern technology to deliver freshness, safety, and convenience to your kitchen.' }
                            ].map((item, i) => (
                                <div key={i} className="card-modern value-card" style={{ padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--brand-primary)' }}>{item.icon}</div>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--brand-primary)', fontFamily: 'Playfair Display, serif' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>{item.desc}</p>
                                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 100%, rgba(201, 162, 77, 0.05), transparent 60%)', pointerEvents: 'none' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GLOBAL FOOTPRINT */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '4rem' }}>
                            <h5 style={{ color: 'var(--brand-primary)', letterSpacing: '4px', fontStyle: 'italic', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Worldwide Presence</h5>
                            <h2 style={{ fontSize: '3.5rem', color: 'var(--text-main)', fontFamily: 'Playfair Display, serif' }}>Global Footprint</h2>
                        </div>
                        <div className="card-modern" style={{ position: 'relative', padding: '0', borderRadius: '30px', background: 'var(--surface-color)', overflow: 'hidden' }}>
                            <img src="/assets/global-footprint-map.jpg" alt="Global Footprint Map" style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, #0b0b0b 90%)' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
