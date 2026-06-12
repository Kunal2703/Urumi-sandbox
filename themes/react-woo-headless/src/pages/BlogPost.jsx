/**
 * Blog Post — `/blog/:slug`
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-blog-post.php + components/BlogPostTOC.jsx
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FormCollapse from '../components/FormCollapse';
import TeamCredentials from '../components/TeamCredentials';
import BlogPostTOC from '../components/BlogPostTOC.jsx';
import DSReveal from '../design-system/components/DSReveal.jsx';
import DSFinalCTA from '../design-system/components/DSFinalCTA.jsx';
import '../styles/BlogPost.css';

const TOC_MIN_HEADINGS = 3;

function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const formRef = useRef(null);
    const bodyRef = useRef(null);

    const handleDemoClick = (e) => {
        e.preventDefault();
        setIsFormOpen(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    useEffect(() => {
        // Respect deep-links to in-page anchors (e.g. /blog/foo#toc-bar).
        // Without this guard, scrolling to (0,0) would silently kill every
        // TOC fragment link the moment React hydrates.
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }

        const ssr = document.getElementById('ssr-blog-post-data');
        if (ssr) {
            try {
                const data = JSON.parse(ssr.textContent);
                if (data) {
                    setPost(data);
                    document.title = `${data.title?.rendered || 'Blog Post'} | Urumi Blog`;
                    setLoading(false);
                    ssr.remove();
                    return;
                }
            } catch (err) {
                console.error('Error parsing SSR data:', err);
            }
        }

        setLoading(true);
        const restUrl = window.wpData?.restUrl || '/wp-json/';
        const apiUrl = restUrl.endsWith('/') ? `${restUrl}wp/v2/` : `${restUrl}/wp/v2/`;
        fetch(`${apiUrl}posts?slug=${slug}&_embed`)
            .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
            .then(data => {
                if (data.length > 0) {
                    setPost(data[0]);
                    document.title = `${data[0].title?.rendered || 'Blog Post'} | Urumi Blog`;
                } else {
                    setError('Post not found');
                }
                setLoading(false);
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [slug]);

    // After content paints, honor any inbound #fragment by scrolling
    // the target heading into view. rAF defers until paint so the
    // target element exists in the DOM.
    useEffect(() => {
        if (!post || !window.location.hash) return;
        const id = decodeURIComponent(window.location.hash.replace('#', ''));
        if (!id) return;
        requestAnimationFrame(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ block: 'start' });
        });
    }, [post]);

    const formatDate = (s) => new Date(s).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const featured = (p) =>
        p?.featured_image ||
        p?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        null;

    const author = (p) =>
        p?.author?.name ||
        p?._embedded?.author?.[0]?.name ||
        'Urumi Team';

    const ssrContentExists = document.getElementById('ssr-content');
    if (loading) return ssrContentExists ? null : <div className="ds-page ds-page-blogpost"><p className="ds-sub blogpost-status">Loading article…</p></div>;
    if (error || !post) return ssrContentExists ? null : (
        <div className="ds-page ds-page-blogpost">
            <div className="ds-wrap blogpost-error">
                <h2 className="ds-h2">Article not found</h2>
                <p className="ds-sub">The article you're looking for doesn't exist or has been removed.</p>
                <Link to="/blog" className="blogpost-back-link">← All articles</Link>
            </div>
        </div>
    );

    return (
        <div className="ds-page ds-page-blogpost">
            {/* TOP NAV */}
            <div className="ds-wrap blogpost-topnav">
                <Link to="/blog" className="blogpost-back-link">← All articles</Link>
            </div>

            {/* ARTICLE HEADER */}
            <header className="blogpost-header">
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-mono blogpost-meta">
                            {formatDate(post.date)} · {author(post)}
                        </span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h1
                            className="ds-h1 blogpost-title"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                    </DSReveal>
                    {post.excerpt?.rendered && (
                        <DSReveal delay={0.12}>
                            <div
                                className="ds-sub blogpost-excerpt"
                                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                            />
                        </DSReveal>
                    )}
                </div>
            </header>

            {/* FEATURED IMAGE */}
            {featured(post) && (
                <DSReveal delay={0.18}>
                    <div className="ds-wrap blogpost-image-wrap">
                        <img
                            className="blogpost-featured-image"
                            src={featured(post)}
                            alt={post.title.rendered}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </DSReveal>
            )}

            {/* BODY */}
            <article className="blogpost-body">
                <div className="blogpost-body-grid">
                    <div
                        ref={bodyRef}
                        className="ds-prose blogpost-prose"
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                    />
                    {Array.isArray(post.toc) && post.toc.length >= TOC_MIN_HEADINGS && (
                        <aside className="blogpost-toc-rail">
                            <BlogPostTOC toc={post.toc} contentRef={bodyRef} />
                        </aside>
                    )}
                </div>
            </article>

            <div className="ds-wrap blogpost-bottomnav">
                <Link to="/blog" className="blogpost-back-link">← Back to all articles</Link>
            </div>

            {/* FINAL CTA */}
            <DSFinalCTA
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

            <div className="footer-section" data-snap-section>
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

export default BlogPost;
