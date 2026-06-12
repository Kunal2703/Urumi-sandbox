/**
 * VisionThreeAIs — the three-AI showcase section on the Vision page.
 *
 * Three stacked full-width sections (Builder · Revenue · Analytics),
 * alternating layout left/right. Each AI has its own bespoke artifact
 * built around the natural-language interaction example so the visitor
 * sees the product, not an abstract metaphor:
 *
 *   - BuilderArtifact   — chat/terminal showing a feature request →
 *                         AI generation → ship.
 *   - RevenueArtifact   — auto-generated weekly Revenue Watch report
 *                         with detected regressions + estimated impact.
 *   - AnalyticsArtifact — natural-language query above a generated
 *                         shareable chart.
 *
 * All scroll-revealed via DSReveal. Each section closes on its bullets;
 * deeper per-AI pages (/builder, /revenue, /analytics) don't exist yet,
 * and the page already has a single primary CTA at the bottom (DSFinalCTA).
 */

import { useRef } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import DSReveal from '../design-system/components/DSReveal.jsx';
import { useSectionScroll } from '../design-system/hooks/useSectionScroll.js';
import VisionPanel3Helpers from './VisionPanel3Helpers.jsx';
import VisionPanel4Revenue from './VisionPanel4Revenue.jsx';
import VisionPanel5Builder from './VisionPanel5Builder.jsx';
import VisionPanel6Analytics from './VisionPanel6Analytics.jsx';
import '../styles/VisionThreeAIs.css';

/* ── Builder AI artifact ──────────────────────────────────────────────── */

function BuilderArtifact() {
    return (
        <div className="vthree-art vthree-art-builder">
            <div className="vthree-builder-window">
                <div className="vthree-builder-chrome">
                    <span className="dot" /><span className="dot" /><span className="dot" />
                    <span className="vthree-builder-url">urumi · builder</span>
                </div>
                <div className="vthree-builder-stage">
                    <div className="vthree-builder-prompt">
                        <span className="prompt">▸</span>
                        <span className="you">Hey Urumi, please add the missing hero section, fetch and open-source the image.</span>
                    </div>
                    <div className="vthree-builder-output">
                        <div><span className="kw">→</span> analyzing existing hero patterns</div>
                        <div><span className="kw">→</span> generating <span className="file">HeroSection.jsx</span></div>
                        <div><span className="kw">→</span> fetching CC0 image (Unsplash · credited)</div>
                        <div><span className="kw">→</span> tested across <span className="ok">3 / 3</span> themes</div>
                        <div><span className="kw">→</span> staging deploy ready · <span className="ok">14s</span></div>
                    </div>
                    <div className="vthree-builder-prompt">
                        <span className="prompt">▸</span>
                        <span className="you typing">ship to production</span>
                    </div>
                </div>
            </div>
            <span className="vthree-art-label"><span className="dot" /> builder · staging · ready</span>
        </div>
    );
}

/* ── Revenue AI artifact ──────────────────────────────────────────────── */

function RevenueArtifact() {
    return (
        <div className="vthree-art vthree-art-revenue">
            <div className="vthree-report">
                <div className="vthree-report-head">
                    <span className="vthree-report-title">Revenue Watch · weekly</span>
                    <span className="vthree-report-stamp">SHIPPED · TUE 9:00 AM</span>
                </div>

                <div className="vthree-report-row alert">
                    <div className="vthree-report-row-icon">⚠</div>
                    <div className="vthree-report-row-body">
                        <div className="vthree-report-row-title">Checkout regression detected</div>
                        <div className="vthree-report-row-meta">
                            PayPal callback timeout · est <strong>$2,340</strong> impact (7d)
                        </div>
                    </div>
                    <div className="vthree-report-row-tag">PR #847 ready</div>
                </div>

                <div className="vthree-report-row alert">
                    <div className="vthree-report-row-icon">⚠</div>
                    <div className="vthree-report-row-body">
                        <div className="vthree-report-row-title">Cart abandonment +12% week-over-week</div>
                        <div className="vthree-report-row-meta">
                            free-shipping banner missing on mobile · A/B test running
                        </div>
                    </div>
                    <div className="vthree-report-row-tag">monitoring</div>
                </div>

                <div className="vthree-report-row ok">
                    <div className="vthree-report-row-icon">✓</div>
                    <div className="vthree-report-row-body">
                        <div className="vthree-report-row-title">p99 &lt; 1s sustained · 0 incidents this week</div>
                    </div>
                </div>

                <div className="vthree-report-foot">
                    <span>→ sent to: dev@store.com · slack <span className="kw">#ops</span></span>
                </div>
            </div>
            <span className="vthree-art-label"><span className="dot" /> recurring · weekly</span>
        </div>
    );
}

/* ── Analytics AI artifact ────────────────────────────────────────────── */

function AnalyticsArtifact() {
    return (
        <div className="vthree-art vthree-art-analytics">
            <div className="vthree-analytics">
                <div className="vthree-analytics-prompt">
                    <span className="prompt">▸</span>
                    <span className="you">Map my gross margins for the best-selling product</span>
                </div>

                <div className="vthree-analytics-chart">
                    <svg viewBox="0 0 320 140" preserveAspectRatio="none">
                        {/* gridlines */}
                        <g stroke="rgba(16,9,4,0.08)" strokeDasharray="2 4">
                            <line x1="24" y1="20" x2="320" y2="20" />
                            <line x1="24" y1="60" x2="320" y2="60" />
                            <line x1="24" y1="100" x2="320" y2="100" />
                        </g>
                        {/* axis labels */}
                        <g fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(16,9,4,0.45)" textAnchor="end">
                            <text x="20" y="24">60%</text>
                            <text x="20" y="64">40%</text>
                            <text x="20" y="104">20%</text>
                        </g>
                        {/* bars — gross margin per month */}
                        <g fill="#DC5000">
                            <rect x="40"  y="55" width="22" height="55" rx="2" />
                            <rect x="76"  y="48" width="22" height="62" rx="2" />
                            <rect x="112" y="40" width="22" height="70" rx="2" />
                            <rect x="148" y="35" width="22" height="75" rx="2" />
                            <rect x="184" y="32" width="22" height="78" rx="2" />
                            <rect x="220" y="28" width="22" height="82" rx="2" />
                            <rect x="256" y="22" width="22" height="88" rx="2" fillOpacity="0.92" />
                            <rect x="292" y="18" width="22" height="92" rx="2" fillOpacity="1.0" />
                        </g>
                        {/* trend line */}
                        <path d="M 51 65 L 87 58 L 123 50 L 159 45 L 195 42 L 231 38 L 267 32 L 303 28"
                              fill="none" stroke="#100904" strokeWidth="1.2" strokeLinecap="round" />
                        {/* highlight the latest */}
                        <circle cx="303" cy="28" r="3.5" fill="#DC5000" stroke="#FDFAF6" strokeWidth="1.5" />
                    </svg>
                    <div className="vthree-analytics-axis">
                        <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span>
                        <span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span>
                    </div>
                </div>

                <div className="vthree-analytics-share">
                    <span className="link">analytics.urumi.ai/store/dashboard-march</span>
                </div>
            </div>
            <span className="vthree-art-label"><span className="dot" /> chart generated · 1.2s</span>
        </div>
    );
}

/* ── Page-level component ─────────────────────────────────────────────── */

const AIS = [
    {
        num: '01 / Revenue AI',
        title: 'Catch bugs that cost revenue.',
        accent: 'cost revenue.',
        tagline: 'Finds business-logic bugs and performance regressions that hit revenue before customers do. Recurring reports go to your team — never to a dashboard nobody reads.',
        bullets: [
            'Detects regressions in checkout, cart, pricing, payments',
            'Recurring reports to email + Slack, prioritized by $ impact',
            'PRs surfaced with the fix, not just the alert',
        ],
        Artifact: RevenueArtifact,
        Vignette: VisionPanel4Revenue,
        flip: false,
    },
    {
        num: '02 / Builder AI',
        title: 'Build features in English.',
        accent: 'English.',
        // strip the trailing period on accent + assemble in render
        tagline: 'Complex features in plain English. Describe what you want; Builder ships safe, tested code through your review pipeline.',
        bullets: [
            'Plugins, themes, custom blocks, full features',
            'Tested across themes · staging + one-click rollback',
            'Ships through your existing review workflow',
        ],
        Artifact: BuilderArtifact,
        Vignette: VisionPanel5Builder,
        flip: true,
    },
    {
        num: '03 / Analytics AI',
        title: 'Ask your store anything.',
        accent: 'anything.',
        tagline: 'Talk to your store in plain English. Generate charts your team can share — no SQL, no dashboards to build.',
        bullets: [
            'Plain-English queries against live store + GA + Stripe',
            'Custom chart generation with one-click team share',
            'Anomaly explanations: "what changed last week?"',
        ],
        Artifact: AnalyticsArtifact,
        Vignette: VisionPanel6Analytics,
        flip: false,
    },
];

function splitTitle(full, accent) {
    if (!accent || !full.endsWith(accent)) return { head: full, accent: '' };
    return { head: full.slice(0, full.length - accent.length), accent };
}

/**
 * Per-AI section. Has its own scroll-tied transforms so the artifact
 * "breathes" — slight Y drift + subtle scale tied to scroll position
 * within the section. The artifact peaks (1.04 scale, full opacity)
 * when the section is centered in the viewport.
 */
function AISection({ num, title, accent, tagline, bullets, Artifact, Vignette, flip }) {
    const sectionRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const progress = useSectionScroll(sectionRef);
    // Counter-parallax on the artifact (drifts up while section scrolls
    // down through viewport). Values amped 2-3x so motion is clearly
    // perceptible — this is the cinematic moment of the page.
    // Reduced-motion users get all zero ranges → no movement, no per-frame work.
    const artY     = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [80, -80]);
    const artScale = useTransform(progress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [0.88, 1.08, 0.88]);
    const artOpac  = useTransform(progress, [0, 0.35, 0.65, 1], reduceMotion ? [1, 1, 1, 1] : [0.25, 1, 1, 0.25]);
    // Copy gets a gentler counter-parallax (slower drift) so it feels
    // anchored, not racing.
    const copyY    = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [32, -32]);

    const { head, accent: accentText } = splitTitle(title, accent);

    return (
        <div
            ref={sectionRef}
            className={`vthree-ai${flip ? ' vthree-ai--flip' : ''}`}
            data-snap-section
        >
            {/* Storefront Panorama vignette — same hand-drawn pen-line
                style as the hero shop. Optional, per-AI section. */}
            {Vignette && <Vignette />}

            <div className="ds-wrap vthree-ai-grid">
                <motion.div className="vthree-ai-copy" style={{ y: copyY }}>
                    <DSReveal>
                        <span className="ds-num-label">{num}</span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h3 className="ds-h2 vthree-ai-title">
                            {head}<span className="vthree-accent">{accentText}</span>
                        </h3>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub vthree-ai-tagline">{tagline}</p>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <ul className="vthree-ai-bullets">
                            {bullets.map((b) => (
                                <li key={b}>{b}</li>
                            ))}
                        </ul>
                    </DSReveal>
                </motion.div>

                <motion.div
                    className="vthree-ai-art-wrap"
                    style={{ y: artY, scale: artScale, opacity: artOpac }}
                >
                    <DSReveal delay={0.18}>
                        <Artifact />
                    </DSReveal>
                </motion.div>
            </div>
        </div>
    );
}

/**
 * TriadConstellation — visual metaphor for the intro section.
 *
 * Three labeled AI nodes (Builder · Revenue · Analytics) arranged in
 * an equilateral triangle around a central Urumi core. Connecting
 * lines pulse with a traveling gradient. Slow rotation on the outer
 * ring. Each node has its own breathing pulse.
 *
 * Pure SVG + CSS. Honors prefers-reduced-motion.
 */
function TriadConstellation() {
    return (
        <div className="vthree-triad" aria-hidden="true">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                {/* ── Concentric guide rings (very faint, depth) ── */}
                <g className="vthree-triad-rings">
                    <circle cx="200" cy="200" r="170" fill="none"
                            stroke="var(--color-border)" strokeWidth="1"
                            strokeDasharray="2 6" />
                    <circle cx="200" cy="200" r="120" fill="none"
                            stroke="var(--color-border)" strokeWidth="1"
                            strokeDasharray="2 5" opacity="0.6" />
                    <circle cx="200" cy="200" r="70" fill="none"
                            stroke="var(--color-border)" strokeWidth="1"
                            strokeDasharray="2 4" opacity="0.4" />
                </g>

                {/* ── Slow-rotating triad geometry ── */}
                <g className="vthree-triad-spin" style={{ transformOrigin: '200px 200px' }}>
                    {/* Outer triangle (very subtle) */}
                    <polygon points="200,55 75,275 325,275"
                             fill="none"
                             stroke="color-mix(in srgb, var(--color-accent) 22%, transparent)"
                             strokeWidth="1" strokeDasharray="3 6" />

                    {/* Spokes from center to each node — these "pulse" via a
                        gradient that travels along the line. */}
                    <line x1="200" y1="200" x2="200" y2="55"
                          stroke="url(#vthree-spoke)" strokeWidth="1.5" />
                    <line x1="200" y1="200" x2="75" y2="275"
                          stroke="url(#vthree-spoke)" strokeWidth="1.5" />
                    <line x1="200" y1="200" x2="325" y2="275"
                          stroke="url(#vthree-spoke)" strokeWidth="1.5" />

                    {/* Outer nodes — each gets a breathing halo + a solid core dot. */}
                    <g className="vthree-triad-node vthree-triad-node--top">
                        <circle cx="200" cy="55" r="22"
                                fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                        <circle cx="200" cy="55" r="7" fill="var(--color-accent)" />
                    </g>
                    <g className="vthree-triad-node vthree-triad-node--left">
                        <circle cx="75" cy="275" r="22"
                                fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                        <circle cx="75" cy="275" r="7" fill="var(--color-accent)" />
                    </g>
                    <g className="vthree-triad-node vthree-triad-node--right">
                        <circle cx="325" cy="275" r="22"
                                fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                        <circle cx="325" cy="275" r="7" fill="var(--color-accent)" />
                    </g>
                </g>

                {/* ── Central Urumi core (does NOT rotate — it's the anchor) ── */}
                <g className="vthree-triad-core">
                    <circle cx="200" cy="200" r="34"
                            fill="color-mix(in srgb, var(--color-accent) 9%, transparent)" />
                    <circle cx="200" cy="200" r="22"
                            fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                    <circle cx="200" cy="200" r="13" fill="var(--color-accent)" />
                </g>

                {/* ── Spoke gradient (used by the lines above) ── */}
                <defs>
                    <linearGradient id="vthree-spoke" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="var(--color-accent)" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.15" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Labels are HTML (not SVG <text>) so they reuse design-system
                typography and stay crisp at any size. Positioned absolutely
                in % so they ride with the SVG aspect ratio. */}
            <span className="vthree-triad-label vthree-triad-label--top">
                <span className="ds-num-label">01</span> Revenue AI
            </span>
            <span className="vthree-triad-label vthree-triad-label--left">
                <span className="ds-num-label">03</span> Analytics AI
            </span>
            <span className="vthree-triad-label vthree-triad-label--right">
                <span className="ds-num-label">02</span> Builder AI
            </span>
            {/* No center label — keeps the orange core as a clean focal
                point. White-on-cream text overflowed the small center dot
                onto the page background and vanished. */}
        </div>
    );
}

export default function VisionThreeAIs() {
    // Intro band gets a focal fade — title brightest when band crosses
    // viewport center.
    const introRef = useRef(null);
    const introProgress = useSectionScroll(introRef);
    const introOpac     = useTransform(introProgress, [0, 0.4, 0.6, 1], [0.3, 1, 1, 0.3]);
    const introY        = useTransform(introProgress, [0, 1], [48, -48]);

    return (
        <section id="three-ais" className="vthree">
            <motion.div
                className="vthree-intro"
                ref={introRef}
                style={{ opacity: introOpac, y: introY }}
                data-snap-section
            >
                {/* Panorama Panel 3 — animated robot arrival vignette
                    in the bottom-left, matching the hand-drawn style of
                    the hero shop and Section 2's queued shop. */}
                <VisionPanel3Helpers />
                <div className="ds-wrap vthree-intro-grid">
                    <div className="vthree-intro-copy">
                        <DSReveal>
                            <span className="ds-num-label">Live today</span>
                        </DSReveal>
                        <DSReveal delay={0.06}>
                            <h2 className="ds-h2 vthree-intro-title">
                                Three AIs running your store.
                            </h2>
                        </DSReveal>
                        <DSReveal delay={0.12}>
                            <p className="ds-sub vthree-intro-sub">
                                Each one does one thing exceptionally well. They handle
                                the dashboards, on-call shifts, and late-night escalations &mdash;
                                so your team can focus on what only they can do.
                            </p>
                        </DSReveal>
                    </div>

                    <DSReveal delay={0.20} className="vthree-intro-art">
                        <TriadConstellation />
                    </DSReveal>
                </div>
            </motion.div>

            {AIS.map((ai) => (
                <AISection key={ai.num} {...ai} />
            ))}
        </section>
    );
}
