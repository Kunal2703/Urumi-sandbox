/**
 * Urumi For WooCommerce — full page revamp aligned with the Vision page.
 *
 * Route: /woocommerce (canonical) + /urumi-for-woocommerce (backward-compat alias).
 * Both URLs serve the same content; canonical_url in functions.php points to
 * /woocommerce so search engines consolidate signals on the new slug.
 *
 * Design notes:
 *   - Operations Panorama runs alongside the marketing copy: five
 *     hand-drawn pen-line vignettes (WooPanel1Hero…WooPanel5FinalCTA)
 *     anchored bottom-left in their host sections at low opacity, the
 *     back-of-house counterpart to Vision's storefront panorama.
 *   - Cursor-tracked spotlight in the hero (parity with Vision).
 *   - Per-section scroll-tied parallax (copyY) so the copy "breathes"
 *     as the section moves through the viewport.
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚠️ COPY-SYNC RULE — read before editing customer-facing copy
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Numbers, quotes, taglines, product claims, and capability statements on
 * this page must match what we say everywhere else they appear, or the
 * site contradicts itself across audiences. Every edit needs FOUR sweeps:
 *
 *   1. THIS FILE — hydrated React app (what humans see post-takeover)
 *   2. template-parts/ssr-woocommerce.php — SSR HTML (crawlers, no-JS users)
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
 *
 * @author Urumi.ai
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';

import DSReveal from '../design-system/components/DSReveal.jsx';
import DSViralChart from '../design-system/components/DSViralChart.jsx';
import DSMetricStrip from '../design-system/components/DSMetricStrip.jsx';
import DSComparisonTable from '../design-system/components/DSComparisonTable.jsx';
import DSCompetitorCard from '../design-system/components/DSCompetitorCard.jsx';
import DSFaqAccordion from '../design-system/components/DSFaqAccordion.jsx';
import DSFinalCTA from '../design-system/components/DSFinalCTA.jsx';
import { useSectionScroll } from '../design-system/hooks/useSectionScroll.js';

import WooCapabilities from '../components/WooCapabilities.jsx';
import TeamCredentials from '../components/TeamCredentials';
import FormCollapse from '../components/FormCollapse';

import WooPanel1Hero      from '../components/WooPanel1Hero.jsx';
import WooPanel4Gruum     from '../components/WooPanel4Gruum.jsx';
import WooPanel5FinalCTA  from '../components/WooPanel5FinalCTA.jsx';

import '../design-system/tokens.css';
import '../design-system/utilities.css';
import '../styles/Woo-v2.css';
import '../styles/FaqCta.css';

/* ── Static content data ─────────────────────────────────────────────── */

const COMPETITORS = [
    {
        competitor: 'Kinsta',
        tagline: 'WooCommerce-native vs general WordPress',
        paragraph: 'Kinsta runs solid WordPress hosting, but cache tuning, scale planning, and incident response are still your team\'s problem. Urumi is built by ex-WooCommerce core engineers — we know every query and every bottleneck because we wrote them.',
        bullets: [
            { label: 'Scaling',     contrast: 'horizontal auto-scaling vs vertical resource limits' },
            { label: 'Performance', contrast: 'continuous APM + recurring fixes vs manual tuning' },
            { label: 'Deploys',     contrast: 'staging + CI/CD with rollback vs manual deploys' },
        ],
    },
    {
        competitor: 'SiteGround',
        tagline: 'Enterprise infrastructure vs shared hosting',
        paragraph: 'SiteGround works while you\'re small. Once you start outgrowing shared CPU and IO, single-zone hosting becomes the bottleneck. Urumi runs you on isolated containers across multiple Google Cloud zones from day one.',
        bullets: [
            { label: 'Infrastructure', contrast: 'isolated containers on Google Cloud vs shared hosting' },
            { label: 'Reliability',    contrast: '99.99% uptime + auto-failover vs single-zone hosting' },
            { label: 'Operations',     contrast: 'fully managed by ex-WooCommerce team vs self-managed cPanel' },
        ],
    },
    {
        competitor: 'Cloudways',
        tagline: 'Managed operations vs DIY cloud',
        paragraph: 'Cloudways gives you cloud infrastructure — and the responsibility for tuning, optimizing, and maintaining it. Urumi runs the entire operations stack so the platform stops being a project for your team.',
        bullets: [
            { label: 'Management',  contrast: 'complete managed operations vs manual server config' },
            { label: 'WooCommerce', contrast: 'purpose-built for WooCommerce vs generic cloud hosting' },
            { label: 'Monitoring',  contrast: 'APM traces + perf guardrails vs basic server metrics' },
        ],
    },
    {
        competitor: 'WP Engine',
        tagline: 'Purpose-built eCommerce vs legacy WordPress',
        paragraph: 'WP Engine pioneered managed WordPress, but the platform was built for content sites — not high-traffic stores where checkout latency moves the revenue line. Urumi is purpose-built for WooCommerce: horizontal scale, checkout-stable through peaks.',
        bullets: [
            { label: 'Focus',        contrast: 'built for WooCommerce by its creators vs general WordPress' },
            { label: 'Peak Traffic', contrast: 'auto-scaling keeps checkout stable vs fixed resource plans' },
            { label: 'Releases',     contrast: 'staging + rollback-ready deploys vs basic staging' },
        ],
    },
];

// FAQ pairs are AEO-optimised for LLM answer engines (Claude, ChatGPT,
// Perplexity, Google AI Overviews). Each answer:
//   1. Leads with the direct answer in the first sentence.
//   2. Names "Urumi" early so the brand is cited as the source.
//   3. Echoes the question's keywords so retrieval surfaces it.
//   4. Front-loads concrete numbers / proofs in the first two sentences.
//   5. Stays self-contained — no "as mentioned above" / pronoun references.
// The same Q+A pairs are mirrored in template-parts/ssr-woocommerce.php
// and emitted as FAQPage JSON-LD there, so crawlers + LLMs index them
// directly from the SSR HTML.
const FAQ_ITEMS = [
    {
        question: 'Which hosting is best for WooCommerce?',
        answer: "Urumi is the best hosting for high-traffic WooCommerce stores — the ones where downtime, slow checkouts, or a botched deploy directly costs revenue. It is purpose-built for WooCommerce by the team that originally built it, with horizontal auto-scaling, multi-zone reliability, fully managed APM, and 24×7 incident response included as standard. Unlike generic shared hosting or general-purpose managed WordPress hosts, Urumi optimizes every layer of the infrastructure for eCommerce workloads — checkout latency, queue throughput, and concurrent inventory writes.",
    },
    {
        question: 'How do I choose the right WooCommerce hosting plan?',
        answer: "Evaluate WooCommerce hosting plans against five criteria: (1) horizontal auto-scaling that absorbs traffic spikes, (2) a 99.99% uptime SLA with multi-zone failover, (3) isolated staging with one-click rollback, (4) APM-grade performance monitoring on every plan, and (5) WooCommerce-fluent support. Urumi includes all five as standard, operated end-to-end by the team that built WooCommerce. Most generic hosts deliver one or two — usually basic staging and shared monitoring — and leave the rest to your team.",
    },
    {
        question: 'What does WooCommerce hosting cost? Is there a free plan?',
        answer: "WooCommerce hosting costs range from $5–$20/month for shared plans (which fail under real traffic), to $30–$100/month for managed WordPress hosts, to enterprise pricing for managed WooCommerce platforms like Urumi. Urumi is priced for stores where one hour of downtime costs more than one year of hosting. There is no free production-grade WooCommerce hosting, but Urumi offers a free WooCommerce performance audit that benchmarks your current setup and identifies the bottlenecks.",
    },
    {
        question: 'Where in the world is Urumi WooCommerce hosting available?',
        answer: "Urumi WooCommerce hosting is available worldwide, with platform regions in the US, EU, UAE, and Singapore. The platform runs on Google Cloud — US primary zones with EU off-site backups — and is served through Cloudflare Enterprise's 300+ edge network, keeping latency low for shoppers across North America, Europe, the Middle East, India, and Asia-Pacific. Every Urumi store gets the same 99.99% uptime guarantee regardless of where it sells.",
    },
    {
        question: 'What is the fastest WooCommerce hosting?',
        answer: "Urumi is among the fastest WooCommerce hosting platforms available. In real shopping-journey stress tests (browse, login, add to cart, checkout), Urumi sustains 236ms median cart response and 321ms median checkout response while clearing 7,861 orders in under two minutes — well past grüum's 1.2M request/day production load. After migrating to Urumi, grüum's cached page loads dropped from 4 seconds to 0.3 seconds (a 13× improvement) and user satisfaction increased 294%.",
    },
    {
        question: 'How does Urumi handle Black Friday and flash sales?',
        answer: "Urumi handles Black Friday and flash sales with horizontal auto-scaling that activates the moment traffic curves up — whether the surge is a planned campaign or unexpected viral traffic. Capacity expands across multiple zones in real time to keep checkout p99 latency under one second through the peak, then scales back down when traffic normalizes. No manual intervention is required, no surprise compute bill is generated, and no sales are lost at the moments that matter most.",
    },
    {
        question: 'How long does migrating my WooCommerce store to Urumi take?',
        answer: "Migrating a WooCommerce store to Urumi takes 24 to 48 hours, end-to-end. The Urumi team handles the database migration, DNS updates, SSL setup, Cloudflare configuration, performance optimization, and the production cutover — timed to the store's lowest-traffic window for zero downtime. Store owners and developers do not need to touch anything technical; Urumi runs the entire migration.",
    },
    {
        question: 'Are staging environments and performance monitoring included with Urumi?',
        answer: "Yes — staging environments and performance monitoring are included on every Urumi plan as standard. Each Urumi store gets a fully isolated staging environment for testing plugin updates, theme changes, and new features, paired with CI/CD pipelines and one-click rollback. Performance monitoring is fully managed APM with distributed traces, logs, and alerts — Urumi pinpoints and fixes the exact plugin, hook, or query slowing a store down before customers notice.",
    },
];

/* The three platform differentiators that don't appear on any competitor's
 * page. These show up between grüum proof and the head-to-head Compared
 * table — the "why our four jobs actually work at scale" answer. */
const DIFFERENTIATORS = [
    {
        num: '01',
        label: 'cache',
        title: "A cache that knows it's running a store.",
        body: "Generic CDNs cache pages. They don't know an A/B test is running. They don't know a customer came from Instagram vs organic. Ours does — A/B variants ship to the right cohort, and cache rules tune per distribution channel.",
        meta: 'cohort-aware · A/B aware · IG / FB / direct aware',
    },
    {
        num: '02',
        label: 'compute',
        title: 'The newest Google silicon, refreshed every cycle.',
        body: "Direct Google Cloud partnership puts every store on the latest CPU generation as soon as it ships. Every launch cycle, the fleet moves. No aging hardware silently dragging your p99 down.",
        meta: 'latest-gen Intel + AMD · refreshed per launch cycle',
    },
    {
        num: '03',
        label: 'resilience',
        title: 'Multi-region by default. Backups too.',
        body: "Most managed hosts give you multi-zone within one region. We deploy across regions. Off-site backups go to a separate region — so a regional outage on your primary doesn't take your recovery path with it.",
        meta: 'multi-region deploy · off-site multi-region backups · 30-day PITR',
    },
];

/* Migration timeline — 4 steps, days 0 → 8. Buyer's #1 unspoken
 * question is "how risky is this for me?" — putting this story on
 * the page (instead of buried in the FAQ) answers it before the FAQ. */
const MIGRATION_STEPS = [
    {
        day: 'Day 0',
        title: 'Discovery call',
        body: "Founders walk your store with you — traffic patterns, plugin stack, custom code, your team's biggest pain points. Free, no commitment.",
    },
    {
        day: 'Day 1–3',
        title: 'Audit + migration plan',
        body: 'Written performance audit and step-by-step migration plan. Yours to share internally before anyone touches anything.',
    },
    {
        day: 'Day 4–7',
        title: 'Staging mirror',
        body: 'Your store runs in parallel on Urumi staging. We tune cache, validate the plugin stack, smoke-test the checkout flow.',
    },
    {
        day: 'Day 8',
        title: 'Zero-downtime cutover',
        body: 'DNS flip during your quietest hour. No downtime. Your team can stay asleep.',
    },
];

/* SLA + contract commitments — buyer wants to see written-down terms,
 * not just the "Founder hotline" perk. Each commitment is a guarantee,
 * not a feature. */
const COMMITMENTS = [
    {
        title: '99.99% uptime SLA',
        body: 'Measured monthly. Service credits applied to your account if we miss it.',
    },
    {
        title: '<15 min incident response',
        body: 'From page to engineer, 24×7. Founder hotline (direct Slack DM to Naman or Vedanshu) for high-priority escalation.',
    },
    {
        title: '30-day PITR + off-site backups',
        body: 'Point-in-time recovery against any moment in the last 30 days. Backups stored in a separate region from your primary.',
    },
    {
        title: 'Your data, exportable any time',
        body: 'Full database + filesystem export on request. Standard WordPress format — no lock-in. You can leave whenever.',
    },
    {
        title: 'Human-first support — no bots, no queues',
        body: 'Every request reaches a member of our engineering team. No first-line outsourcing, no AI deflection. The hotline goes to founders; acknowledgments come from someone who can actually fix the problem.',
    },
];

/* ── Component ───────────────────────────────────────────────────────── */

function UrumiForWooCommerce() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const formRef = useRef(null);

    /* Hero scroll choreography (matches Vision hero pattern) */
    const heroRef = useRef(null);
    const heroProgress = useSectionScroll(heroRef, {
        offset: ['start start', 'end start'],
    });
    const heroTextY    = useTransform(heroProgress, [0, 1], [0, -120]);
    const heroArtY     = useTransform(heroProgress, [0, 1], [0, -60]);
    const heroArtScale = useTransform(heroProgress, [0, 0.5, 1], [1.0, 1.04, 0.94]);

    /* Hero cursor spotlight (parity with Vision). The spotlight is the
       visible source of motion in the hero background — a single warm
       glow that springs after the cursor. Initial position offset so
       it's visible before any mouse input. */
    const SPOT_SIZE = 700;
    const mouseX = useMotionValue(800);
    const mouseY = useMotionValue(280);
    const sx = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.6 });
    const sy = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.6 });
    const spotX = useTransform(sx, (v) => v - SPOT_SIZE / 2);
    const spotY = useTransform(sy, (v) => v - SPOT_SIZE / 2);
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

    /* Per-section scroll-tied copy parallax — gentle drift so the grüum
       proof section's copy feels anchored but breathes as it moves through
       the viewport (mirrors Vision AISection pattern). */
    const gruumRef    = useRef(null);
    const gruumProg   = useSectionScroll(gruumRef);
    const gruumCopyY  = useTransform(gruumProg, [0, 1], [32, -32]);

    /* Final CTA is rendered by <DSFinalCTA /> — it owns its own scroll-tied
       glow + title scale. The wrap div below positions WooPanel5FinalCTA
       against the same visual region. */

    const openDemoForm = (e) => {
        if (e) e.preventDefault();
        setIsFormOpen(true);
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };
    const closeDemoForm = () => setIsFormOpen(false);

    useEffect(() => {
        document.title = 'WooCommerce, on autopilot — Urumi';
        const handleOpen = () => openDemoForm();
        window.addEventListener('openDemoForm', handleOpen);
        window.scrollTo(0, 0);
        return () => window.removeEventListener('openDemoForm', handleOpen);
    }, []);

    return (
        <div className="woo-v2">
            {/* ============== HERO ============== */}
            <header
                className="woo-v2-hero"
                ref={heroRef}
                onMouseMove={handleHeroMouseMove}
                data-snap-section
            >
                {/* Background composition (parity with Vision hero):
                     - corner gradient (static warm wash)
                     - cursor-tracked spotlight (springs after the mouse)
                     - hand-drawn ops vignette (bottom-left, ink-on-paper) */}
                <div className="woo-v2-hero-corner" aria-hidden="true" />
                <motion.div
                    className="woo-v2-hero-spotlight"
                    aria-hidden="true"
                    style={{
                        x: spotX,
                        y: spotY,
                        width:  SPOT_SIZE,
                        height: SPOT_SIZE,
                    }}
                />
                <WooPanel1Hero />

                <div className="ds-wrap woo-v2-hero-grid">
                    <motion.div className="woo-v2-hero-left" style={{ y: heroTextY }}>
                        <DSReveal>
                            <span className="ds-eyebrow woo-v2-hero-eyebrow">
                                <span className="ds-eyebrow-dot" />
                                Urumi for WooCommerce
                            </span>
                        </DSReveal>
                        <DSReveal delay={0.06}>
                            <h1 className="ds-h1 woo-v2-hero-title">
                                WooCommerce, on <span className="woo-v2-accent">autopilot.</span>
                            </h1>
                        </DSReveal>
                        <DSReveal delay={0.12}>
                            <p className="ds-sub woo-v2-hero-sub">
                                We run the operations layer of your store &mdash; scaling,
                                reliability, releases, performance, and the on-call work
                                that used to need a team. Built by the people who built WooCommerce.
                            </p>
                        </DSReveal>
                        <DSReveal delay={0.18}>
                            <div className="woo-v2-hero-ctas">
                                <a
                                    href="#demo-form-section"
                                    onClick={openDemoForm}
                                    className="ds-pill ds-pill-solid"
                                >
                                    Get a free audit <span className="ds-arrow">&rarr;</span>
                                </a>
                            </div>
                        </DSReveal>
                        <DSReveal delay={0.24}>
                            <Link to="/gruum-case-study" className="woo-v2-hero-proof">
                                <span className="ds-accent">gr&uuml;um</span> scaled <strong>14&times;</strong> with Urumi <span className="ds-arrow">&rarr;</span>
                            </Link>
                        </DSReveal>
                    </motion.div>

                    <motion.div
                        className="woo-v2-hero-art"
                        style={{ y: heroArtY, scale: heroArtScale }}
                    >
                        <DSReveal delay={0.24}>
                            <DSViralChart />
                        </DSReveal>
                    </motion.div>
                </div>
            </header>

            {/* ============== 01 / THE PLATFORM ============== */}
            <WooCapabilities />

            {/* ============== 02 / WHAT GRÜUM SAW ==============
                Single proof moment: grüum migration story + raw benchmarks
                + George quote + customer-impact stats + CTAs. Replaces what
                used to be a "01 / The spike" section that was effectively
                grüum's numbers presented anonymously — proof now lives where
                it's attributed. */}
            <section className="woo-v2-shipping" ref={gruumRef} data-snap-section>
                <WooPanel4Gruum />
                <motion.div className="ds-wrap" style={{ y: gruumCopyY }}>
                    <DSReveal>
                        <span className="ds-num-label">02 / What gr&uuml;um saw</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 woo-v2-shipping-title">
                            When their store went viral, the platform
                            <span className="woo-v2-accent"> took care of the scale.</span>
                        </h2>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub woo-v2-shipping-lede">
                            <a href="https://gruum.com" target="_blank" rel="noopener noreferrer" className="woo-v2-shipping-cta">gr&uuml;um</a>{' '}
                            migrated to Urumi during the busiest stretch of
                            their year &mdash; and shipped through it without an incident.
                            Numbers below are from the official WooCommerce k6 stress
                            suite, edge cache disabled (raw server perf, no CDN cushion).
                        </p>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <DSMetricStrip
                            cells={[
                                { label: 'Cold load',            from: '5.7s', to: '0.4s' },
                                { label: 'Cached load',          from: '4.0s', to: '0.3s' },
                                { label: 'Daily traffic',        to: 1.2, decimals: 1, unit: 'M req/day' },
                                { label: 'Uptime · 30d',         to: 99.99, decimals: 2, unit: '%' },
                            ]}
                        />
                    </DSReveal>
                    <DSReveal delay={0.24}>
                        <blockquote className="woo-v2-shipping-quote">
                            <p className="woo-v2-shipping-quote-text">
                                &ldquo;The biggest performance improvements we&rsquo;ve seen is from you guys.&rdquo;
                            </p>
                            <footer className="woo-v2-shipping-quote-who">
                                <strong>George Lagonikas</strong>, Founder &amp; CTO, gr&uuml;um
                            </footer>
                        </blockquote>
                    </DSReveal>
                    <DSReveal delay={0.30}>
                        <div className="woo-v2-shipping-stats">
                            <span><strong>&minus;93%</strong> mobile load</span>
                            <span className="sep">&middot;</span>
                            <span><strong>16&times;</strong> baseline load absorbed</span>
                            <span className="sep">&middot;</span>
                            <span><strong>0 incidents</strong> through peak weeks</span>
                            <span className="sep">&middot;</span>
                            <span><strong>294%</strong> better user satisfaction</span>
                        </div>
                    </DSReveal>
                    <DSReveal delay={0.36}>
                        <div className="woo-v2-shipping-ctas">
                            <a
                                href="#demo-form-section"
                                onClick={openDemoForm}
                                className="ds-pill ds-pill-solid"
                            >
                                Get a free audit <span className="ds-arrow">&rarr;</span>
                            </a>
                            <Link to="/gruum-case-study" className="woo-v2-shipping-cta">
                                Read the gr&uuml;um case study <span className="ds-arrow">&rarr;</span>
                            </Link>
                        </div>
                    </DSReveal>
                </motion.div>
            </section>

            {/* ============== 03 / WHAT'S DIFFERENT UNDER THE HOOD ============== */}
            <section className="woo-v2-different" data-snap-section>
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">03 / What&rsquo;s different under the hood</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 woo-v2-different-title">
                            Three things in the platform that aren&rsquo;t
                            <span className="woo-v2-accent"> in anyone else&rsquo;s.</span>
                        </h2>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub woo-v2-different-lede">
                            The four jobs above are what you see. These three are why they
                            actually work at scale.
                        </p>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <div className="woo-v2-different-grid">
                            {DIFFERENTIATORS.map((d) => (
                                <article key={d.num} className="woo-v2-different-card">
                                    <span className="woo-v2-different-num">
                                        {d.num} <span className="sep">·</span> {d.label}
                                    </span>
                                    <h3 className="woo-v2-different-card-title">{d.title}</h3>
                                    <p className="woo-v2-different-card-body">{d.body}</p>
                                    <span className="woo-v2-different-card-meta">
                                        <span className="woo-v2-different-card-meta-dot" aria-hidden="true" />
                                        {d.meta}
                                    </span>
                                </article>
                            ))}
                        </div>
                    </DSReveal>
                </div>
            </section>

            {/* ============== 04 / COMPARED ============== */}
            {/* No data-snap-section — Compared is reference content (table +
                per-competitor breakouts) that's denser than a single 100vh
                beat. Letting it flow naturally instead of being a snap target
                avoids Lenis snapping the visitor into a long-scroll section. */}
            <section className="woo-v2-compared">
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">04 / Compared</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 woo-v2-compared-title">
                            Most hosts sell compute.{' '}
                            <span className="woo-v2-accent">Urumi delivers operations.</span>
                        </h2>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <div className="woo-v2-compared-table-wrap">
                            <DSComparisonTable />
                        </div>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <h3 className="woo-v2-compared-subhead">Compared to specific hosts</h3>
                    </DSReveal>
                    <DSReveal delay={0.24}>
                        <div className="woo-v2-compared-cards">
                            {COMPETITORS.map((c) => (
                                <DSCompetitorCard key={c.competitor} {...c} />
                            ))}
                        </div>
                    </DSReveal>
                </div>
            </section>

            {/* ============== 05 / MIGRATION ============== */}
            <section className="woo-v2-migration" data-snap-section>
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">05 / Migration</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 woo-v2-migration-title">
                            Move once. <span className="woo-v2-accent">Stay live.</span>
                        </h2>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub woo-v2-migration-lede">
                            Most stores complete migration in 24&ndash;48 hours with zero downtime.
                            We do the work; your team watches.
                        </p>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <ol className="woo-v2-migration-steps">
                            {MIGRATION_STEPS.map((s, i) => (
                                <li key={i} className="woo-v2-migration-step">
                                    <span className="woo-v2-migration-step-day">{s.day}</span>
                                    <h3 className="woo-v2-migration-step-title">{s.title}</h3>
                                    <p className="woo-v2-migration-step-body">{s.body}</p>
                                </li>
                            ))}
                        </ol>
                    </DSReveal>
                </div>
            </section>

            {/* ============== 06 / OUR COMMITMENTS ============== */}
            <section className="woo-v2-commitments" data-snap-section>
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">06 / Our commitments</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 woo-v2-commitments-title">
                            On the hook for outcomes.
                            <span className="woo-v2-accent"> Not just uptime.</span>
                        </h2>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub woo-v2-commitments-lede">
                            What you&rsquo;re getting in writing &mdash; not just on our blog.
                        </p>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <ul className="woo-v2-commitments-list">
                            {COMMITMENTS.map((c, i) => (
                                <li key={i} className="woo-v2-commitments-item">
                                    <h3 className="woo-v2-commitments-item-title">{c.title}</h3>
                                    <p className="woo-v2-commitments-item-body">{c.body}</p>
                                </li>
                            ))}
                        </ul>
                    </DSReveal>
                </div>
            </section>

            {/* ============== 07 / QUESTIONS ============== */}
            <section id="faq" className="woo-v2-faq" data-snap-section>
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">07 / Questions</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h2 className="ds-h2 woo-v2-faq-title">
                            Frequently asked, directly answered.
                        </h2>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub woo-v2-faq-lede">
                            Eight questions buyers ask before signing &mdash; in
                            founder voice, not marketing voice.
                        </p>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <DSFaqAccordion items={FAQ_ITEMS} />
                    </DSReveal>
                </div>
            </section>

            {/* ============== 05 / WHO BUILT THIS ============== */}
            <section className="woo-v2-team" data-snap-section>
                <div className="ds-wrap">
                    <DSReveal>
                        <span className="ds-num-label">08 / Who built this</span>
                    </DSReveal>
                </div>
                <TeamCredentials />
                <p className="faqcta-dentist-credit">
                    <span className="faqcta-dentist-credit__tooth">🦷</span>
                    {' '}Can you believe it? This page was built by a dentist using{' '}
                    <a href="https://urumi.ai" className="faqcta-dentist-credit__link" target="_blank" rel="noopener noreferrer">urumi.ai</a>
                </p>
            </section>

            {/* ============== FINAL CTA ============== */}
            <div className="woo-v2-final-cta-wrap">
                <WooPanel5FinalCTA />
                <DSFinalCTA
                    title={<>Run your store on <span className="woo-v2-accent">Urumi.</span></>}
                    subtitle={<>Production-ready today. Built for high-traffic WooCommerce stores where downtime moves revenue.</>}
                    primary={{ onClick: openDemoForm, label: 'Get a free audit' }}
                    status={[
                        { dot: true, text: 'agent · live' },
                        '99.99% uptime',
                        'shipping today',
                    ]}
                />
            </div>

            {/* Demo Form Collapse */}
            <FormCollapse
                ref={formRef}
                isOpen={isFormOpen}
                onClose={closeDemoForm}
                formUrl="https://docs.google.com/forms/d/e/1FAIpQLScIEQm-Q80VoT3FLiWuk8XbRcLCbL1BxbZeLysd1ckBfDt3lw/viewform?embedded=true"
                title="Demo with Founders"
            />
        </div>
    );
}

export default UrumiForWooCommerce;
