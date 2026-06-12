/**
 * Blog Listing Page — `/blog`
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-blog.php
 * When updating content/structure, BOTH files must be kept in sync.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import BlogHeroCanvas from '../components/BlogHeroCanvas';
import FormCollapse from '../components/FormCollapse';
import TeamCredentials from '../components/TeamCredentials';
import DSReveal from '../design-system/components/DSReveal.jsx';
import DSFinalCTA from '../design-system/components/DSFinalCTA.jsx';
import { useSectionScroll } from '../design-system/hooks/useSectionScroll.js';
import '../styles/Blog.css';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const formRef = useRef(null);

    // Hero parallax + cursor spotlight, lifted from Vision pattern.
    const heroRef = useRef(null);
    const heroProgress = useSectionScroll(heroRef, { offset: ['start start', 'end start'] });
    const heroTextY = useTransform(heroProgress, [0, 1], [0, -120]);

    const SPOT_SIZE = 700;
    const mouseX = useMotionValue(800);
    const mouseY = useMotionValue(280);
    const sx = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.6 });
    const sy = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.6 });
    const spotX = useTransform(sx, v => v - SPOT_SIZE / 2);
    const spotY = useTransform(sy, v => v - SPOT_SIZE / 2);
    // Cursor spotlight — skip on touch-only devices.
    const isCoarsePointerRef = useRef(false);
    useEffect(() => {
        isCoarsePointerRef.current = window.matchMedia('(pointer: coarse)').matches;
    }, []);
    const handleHeroMouseMove = (e) => {
        if (isCoarsePointerRef.current) return;
        const rect = heroRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleDemoClick = (e) => {
        e.preventDefault();
        setIsFormOpen(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    useEffect(() => {
        document.title = 'Urumi Blog — WooCommerce performance & infrastructure';

        const ssr = document.getElementById('ssr-blog-data');
        if (ssr) {
            try {
                setPosts(JSON.parse(ssr.textContent));
                setLoading(false);
                ssr.remove();
                return;
            } catch (err) {
                console.error('Error parsing SSR data:', err);
            }
        }

        const restUrl = window.wpData?.restUrl || '/wp-json/';
        const apiUrl = restUrl.endsWith('/') ? `${restUrl}wp/v2/` : `${restUrl}/wp/v2/`;
        fetch(`${apiUrl}posts?_embed&per_page=20&status=publish&orderby=date&order=desc`)
            .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
            .then(data => { setPosts(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    const formatDate = (s) => new Date(s).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const excerpt = (html, len = 140) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || '';
        return text.length > len ? text.slice(0, len) + '…' : text;
    };

    const featured = (post) =>
        post.featured_image ||
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        null;

    return (
        <div className="ds-page ds-page-blog">
            {/* HERO */}
            <header
                className="blog-hero"
                ref={heroRef}
                onMouseMove={handleHeroMouseMove}
            >
                <BlogHeroCanvas />
                <div className="blog-hero-corner" aria-hidden="true" />
                <motion.div
                    className="blog-hero-spotlight"
                    aria-hidden="true"
                    style={{ x: spotX, y: spotY, width: SPOT_SIZE, height: SPOT_SIZE }}
                />
                <motion.div className="ds-wrap blog-hero-inner" style={{ y: heroTextY }}>
                    <DSReveal>
                        <span className="ds-eyebrow">
                            <span className="ds-eyebrow-dot" />
                            Insights & updates
                        </span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h1 className="ds-h1 blog-hero-title">
                            Scaling WooCommerce <br/>without compromise.
                        </h1>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub blog-hero-sub">
                            Deep dives into WooCommerce performance, infrastructure, and scaling
                            insights from the Urumi team.
                        </p>
                    </DSReveal>
                </motion.div>
            </header>

            {/* POSTS GRID */}
            <section className="blog-grid-section">
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">01 / Articles</span>
                    </DSReveal>

                    {loading && <p className="ds-sub blog-grid-status">Loading articles…</p>}
                    {error && <p className="ds-sub blog-grid-status">Unable to load articles. Please try again later.</p>}

                    {!loading && !error && posts.length === 0 && (
                        <p className="ds-sub blog-grid-status">No articles published yet.</p>
                    )}

                    {!loading && !error && posts.length > 0 && (
                        <div className="blog-grid">
                            {posts.map((post, i) => (
                                <DSReveal key={post.id} delay={Math.min(0.04 * i, 0.4)}>
                                    <Link to={`/blog/${post.slug}`} className="blog-card ds-card">
                                        {featured(post) && (
                                            <div className="blog-card-image">
                                                <img src={featured(post)} alt={post.title.rendered} loading="lazy" decoding="async" />
                                            </div>
                                        )}
                                        <div className="blog-card-content">
                                            <span className="ds-mono blog-card-date">{formatDate(post.date)}</span>
                                            <h2
                                                className="ds-h3 blog-card-title"
                                                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                            />
                                            <p className="ds-body blog-card-excerpt">
                                                {excerpt(post.excerpt?.rendered || post.content?.rendered || '')}
                                            </p>
                                            <span className="blog-card-cta">Read article →</span>
                                        </div>
                                    </Link>
                                </DSReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* FINAL CTA */}
            <DSFinalCTA
                snap={false}
                title={<>Run your store on <span className="ds-accent">Urumi.</span></>}
                subtitle={<>Production-ready today. Built for high-traffic WooCommerce stores where downtime moves revenue.</>}
                primary={{ to: '/woocommerce', label: 'See the WooCommerce platform' }}
                secondary={{ onClick: handleDemoClick, label: 'or talk to founders' }}
                status={[
                    { dot: true, text: 'agent · live' },
                    '99.99% uptime',
                    'shipping today',
                ]}
            />

            {/* FOOTER */}
            <div className="footer-section">
                <TeamCredentials />
            </div>

            <FormCollapse
                ref={formRef}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                formUrl="https://docs.google.com/forms/d/e/1FAIpQLScIEQm-Q80VoT3FLiWuk8XbRcLCbL1BxbZeLysd1ckBfDt3lw/viewform?embedded=true"
                title="Demo with Founders"
            />
        </div>
    );
}

export default Blog;
