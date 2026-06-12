/**
 * Case Study — `/gruum-case-study`
 *
 * Cinematic hero (eyebrow + headline + sub + CTAs + cursor spotlight +
 * corner gradient — same DNA as Vision and WC heroes), then a metric
 * strip with the headline numbers, then the four-section narrative,
 * then DSFinalCTA + team footer.
 *
 * The five-section narrative + George quotes are hardcoded JSX
 * (CaseStudy is the source of truth, not WP page content). The fetched
 * WP page supplies featured_image and title only.
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚠️ COPY-SYNC RULE — read before editing customer-facing copy
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Numbers, quotes, taglines, product claims, and capability statements on
 * this page must match what we say everywhere else they appear, or the
 * site contradicts itself across audiences. Every edit needs FOUR sweeps:
 *
 *   1. THIS FILE — hydrated React app (what humans see post-takeover)
 *   2. template-parts/ssr-case-study.php — SSR HTML (crawlers, no-JS users)
 *   3. llms.txt (repo root) — AEO answer file (ChatGPT, Claude, Perplexity,
 *                              Google AI Overviews cite this verbatim)
 *   4. SEO/schema layer — inc/ssr-schema.php (JSON-LD: Organization,
 *      Service, Review, FAQPage, HowTo) + functions.php brand functions
 *      (urumi_brand_description, urumi_organization_schema, founder bios)
 *
 * Before editing a number or quote, grep the repo for it so you catch
 * every surface. PR #22 (req/day standardization) and PR #23 (llms.txt
 * follow-up) are reference precedents for what a four-surface sweep
 * looks like in practice.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import FormCollapse from '../components/FormCollapse';
import TeamCredentials from '../components/TeamCredentials';
import DSReveal from '../design-system/components/DSReveal.jsx';
import DSFinalCTA from '../design-system/components/DSFinalCTA.jsx';
import DSMetricStrip from '../design-system/components/DSMetricStrip.jsx';
import { useSectionScroll } from '../design-system/hooks/useSectionScroll.js';
import '../styles/CaseStudy.css';

function CaseStudy() {
    const location = useLocation();
    const [page, setPage] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const formRef = useRef(null);

    /* Hero scroll choreography (mirrors Vision + WC). */
    const heroRef = useRef(null);
    const heroProgress = useSectionScroll(heroRef, {
        offset: ['start start', 'end start'],
    });
    const heroTextY = useTransform(heroProgress, [0, 1], [0, -120]);

    /* Cursor-tracked spotlight in the hero (parity with Vision + WC). */
    const SPOT_SIZE = 700;
    const mouseX = useMotionValue(800);
    const mouseY = useMotionValue(280);
    const sx = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.6 });
    const sy = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.6 });
    const spotX = useTransform(sx, (v) => v - SPOT_SIZE / 2);
    const spotY = useTransform(sy, (v) => v - SPOT_SIZE / 2);
    const handleHeroMouseMove = (e) => {
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
        window.scrollTo(0, 0);
        const slug = location.pathname.replace(/^\//, '').replace(/\/$/, '');

        const ssr = document.getElementById('ssr-page-data');
        if (ssr) {
            try {
                const data = JSON.parse(ssr.textContent);
                if (data) {
                    setPage(data);
                    document.title = `${data.title?.rendered || 'Case Study'} | Urumi Case Study`;
                    ssr.remove();
                    return;
                }
            } catch (err) {
                console.error('Error parsing SSR data:', err);
            }
        }

        const restUrl = window.wpData?.restUrl || '/wp-json/';
        const apiUrl = restUrl.endsWith('/') ? `${restUrl}wp/v2/` : `${restUrl}/wp/v2/`;
        fetch(`${apiUrl}pages?slug=${slug}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                if (data.length > 0) {
                    setPage(data[0]);
                    document.title = `${data[0].title?.rendered || 'Case Study'} | Urumi Case Study`;
                }
            })
            .catch(() => {/* no-op — body content is hardcoded; we just lose the cover image */});
    }, [location.pathname]);

    const featured = () =>
        page?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        '/wp-content/uploads/2025/02/gruum-case-study-cover.webp';

    return (
        <div className="ds-page ds-page-case-study">
            {/* HERO — cinematic intro (Vision DNA) */}
            <header
                className="case-study-hero"
                ref={heroRef}
                onMouseMove={handleHeroMouseMove}
                data-snap-section
            >
                <div className="case-study-hero-corner" aria-hidden="true" />
                <motion.div
                    className="case-study-hero-spotlight"
                    aria-hidden="true"
                    style={{
                        x: spotX, y: spotY,
                        width:  SPOT_SIZE,
                        height: SPOT_SIZE,
                    }}
                />
                <motion.div
                    className="ds-wrap case-study-hero-inner"
                    style={{ y: heroTextY }}
                >
                    <DSReveal>
                        <span className="ds-eyebrow case-study-hero-eyebrow">
                            <span className="ds-eyebrow-dot" />
                            Case study · gr&uuml;um
                        </span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h1 className="ds-h1 case-study-hero-title">
                            How Urumi increased gr&uuml;um&rsquo;s user satisfaction by{' '}
                            <span className="ds-accent">294%.</span>
                        </h1>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub case-study-hero-sub">
                            Cached requests went 4s &rarr; 0.3s. Uncached 5.7s &rarr; 0.4s.
                            The platform held 1.2M req/day in production. The team stopped
                            losing checkouts to timeouts and started shipping through
                            their busiest weeks without an incident. Here&rsquo;s how.
                        </p>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <div className="case-study-hero-ctas">
                            <a
                                href="#demo-form-section"
                                onClick={handleDemoClick}
                                className="ds-pill ds-pill-solid"
                            >
                                Get a free audit <span className="ds-arrow">&rarr;</span>
                            </a>
                        </div>
                    </DSReveal>
                </motion.div>
            </header>

            {/* COVER */}
            <DSReveal delay={0.06}>
                <div className="ds-wrap case-study-cover">
                    <img src={featured()} alt="grüum case study cover" loading="lazy" decoding="async" />
                </div>
            </DSReveal>

            {/* HEADLINE METRICS — replaces the old "Key results" bullet list */}
            <div className="ds-wrap case-study-metrics">
                <DSReveal>
                    <DSMetricStrip
                        cells={[
                            { label: 'User satisfaction',   to: 294, unit: '%' },
                            { label: 'Cached response',     from: '4s',   to: '0.3s' },
                            { label: 'Uncached response',   from: '5.7s', to: '0.4s' },
                            { label: 'Daily traffic',       to: 1.2, decimals: 1, unit: 'M req/day' },
                        ]}
                    />
                </DSReveal>
            </div>

            {/* ENGAGEMENT TIMELINE — 4-step journey from discovery to migration.
                Answers the buyer's "how long does this take?" question before
                they read the narrative. */}
            <div className="ds-wrap case-study-timeline">
                <DSReveal>
                    <h2 className="case-study-timeline-title">Engagement timeline</h2>
                </DSReveal>
                <DSReveal delay={0.06}>
                    <ol className="case-study-timeline-steps">
                        <li className="case-study-timeline-step">
                            <span className="case-study-timeline-step-week">Week 0</span>
                            <h3 className="case-study-timeline-step-title">Discovery + audit</h3>
                            <p className="case-study-timeline-step-body">Founders walked gr&uuml;um&rsquo;s store with George &mdash; traffic patterns, plugin stack, the cold starts. Written audit + fix plan delivered.</p>
                        </li>
                        <li className="case-study-timeline-step">
                            <span className="case-study-timeline-step-week">Week 1&ndash;2</span>
                            <h3 className="case-study-timeline-step-title">Cache + server config</h3>
                            <p className="case-study-timeline-step-body">Cloudflare misconfig fixed, server tuned, PHP worker config rebuilt. Cached responses dropped <strong>4s &rarr; 0.3s</strong>.</p>
                        </li>
                        <li className="case-study-timeline-step">
                            <span className="case-study-timeline-step-week">Week 3&ndash;4</span>
                            <h3 className="case-study-timeline-step-title">Hot paths + N+1 fixes</h3>
                            <p className="case-study-timeline-step-body">Application hot paths optimised, N+1 queries eliminated, WooCommerce Product Bundles patch shipped. Uncached <strong>5.7s &rarr; 0.4s</strong>.</p>
                        </li>
                        <li className="case-study-timeline-step">
                            <span className="case-study-timeline-step-week">Week 5+</span>
                            <h3 className="case-study-timeline-step-title">Migration + ongoing ops</h3>
                            <p className="case-study-timeline-step-body">Migrated to Urumi.ai infrastructure with zero downtime. P99 to <strong>&lt;900ms</strong>. Engagement ongoing.</p>
                        </li>
                    </ol>
                </DSReveal>
            </div>

            {/* NARRATIVE SECTIONS */}
            <div className="case-study-body">
                <Section num="01 / The context" heading="The context">
                    <div className="ds-prose">
                        <p>When Urumi engaged with <a href="https://gruum.com" target="_blank" rel="noopener noreferrer">grüum.com</a>, the team wanted to resolve performance instability that was directly affecting customer experience. Cached LCP would climb to 5–7 seconds, and intermittent cold starts could take up to ~40 seconds.</p>
                    </div>
                    <div className="ds-stat-callout">
                        <p className="ds-stat-callout-quote">&ldquo;I&rsquo;m very happy with the results. The biggest performance improvements we&rsquo;ve seen is from you guys.&rdquo;</p>
                        <p className="ds-stat-callout-attr">George Lagonikas · Founder &amp; CTO, gr&uuml;um</p>
                    </div>
                </Section>

                <Section num="02 / The shift" heading="The shift">
                    <p className="case-study-section-tldr">
                        In plain English: their site got fast and stayed fast. The engineer&rsquo;s view of what we found and what we fixed is below.
                    </p>
                    <div className="ds-prose">
                        <p>Urumi worked directly with George and the grüum team to identify root causes across caching, server configuration, and application hot paths. The focus was on fixing both the &ldquo;everyday&rdquo; slow paths and the unpredictable extremes that make a site feel unreliable.</p>
                        <p>From this work, grüum saw a shift around:</p>
                        <ul>
                            <li>Cloudflare + caching misconfigurations were identified and fixed</li>
                            <li>Performance hot paths were identified and fixed, with a patch provided to the WooCommerce Product Bundles team</li>
                            <li>Server configuration was optimized so workers could use the available infra more effectively</li>
                            <li>Latency-inducing N+1 query issues were fixed (traces went to almost 0 post-deploy)</li>
                            <li>Cold starts caused by unoptimized PHP worker config were eliminated</li>
                        </ul>
                        <p>The grüum team immediately saw the difference. Cached requests went from <strong>4s to 0.3s</strong>. Uncached requests dropped from <strong>5.7s to 0.4s</strong>.</p>
                    </div>
                </Section>

                <Section num="03 / The outcomes" heading="The outcomes">
                    <div className="ds-prose">
                        <p>After Urumi&rsquo;s changes were deployed, grüum&rsquo;s New Relic data showed <strong>~294% improvement</strong> in % satisfied users.</p>
                        <p>The grüum team validated the improvements with stress tests mimicking real user journeys (browse → login → add to cart → order):</p>
                        <ul>
                            <li>Average response time: 740ms with p95 at 3.03s</li>
                            <li>Stress testing: Avg 770.09ms, Median 314.14ms, P90 1620ms</li>
                            <li>Sustained well beyond grüum&rsquo;s 1.2M req/day production load, with p90 under ~2s at 300 VU</li>
                        </ul>
                        <p>They went from customers abandoning checkout due to timeouts to completing orders without friction.</p>
                    </div>
                </Section>

                <Section num="04 / For stores like yours" heading="What this means for stores like yours.">
                    <div className="ds-prose">
                        <p>gr&uuml;um&rsquo;s numbers came from fixing the things that quietly slow every high-traffic WooCommerce store &mdash; misconfigured caching, N+1 database queries, untuned PHP workers, cold starts that the team only notices when checkout drops.</p>
                        <p>The free audit starts with the same diagnostic. We look at your traffic patterns, your plugin stack, your custom code, and the exact moments your store slows down for customers. Within a week you have a written audit + fix plan &mdash; yours to share internally, whether or not we end up running your operations.</p>
                    </div>
                    <div className="ds-stat-callout">
                        <p className="ds-stat-callout-quote">&ldquo;The results speak for themselves&mdash;I&rsquo;m really happy we worked with Urumi.&rdquo;</p>
                        <p className="ds-stat-callout-attr">George Lagonikas · Founder &amp; CTO, gr&uuml;um</p>
                    </div>
                </Section>
            </div>

            {/* FINAL CTA */}
            <DSFinalCTA
                title={<>Run your store on <span className="ds-accent">Urumi.</span></>}
                subtitle={<>Production-ready today. Built for high-traffic WooCommerce stores where downtime moves revenue.</>}
                primary={{ onClick: handleDemoClick, label: 'Get a free audit' }}
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

function Section({ num, heading, children }) {
    return (
        <section className="case-study-section">
            <div className="ds-wrap">
                <DSReveal>
                    <span className="ds-num-label">{num}</span>
                </DSReveal>
                <DSReveal delay={0.06}>
                    <h2 className="ds-h2 case-study-section-heading">{heading}</h2>
                </DSReveal>
                <DSReveal delay={0.12}>
                    {children}
                </DSReveal>
            </div>
        </section>
    );
}

export default CaseStudy;
