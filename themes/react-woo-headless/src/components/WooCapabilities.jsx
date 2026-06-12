/**
 * WooCapabilities — section 02 of /woocommerce.
 *
 * Four pain-led capability sections, alternating L/R, each with a bespoke
 * artifact. Same scroll-tied choreography as VisionThreeAIs:
 *   - Per-section useSectionScroll progress
 *   - Artifact: y counter-parallax + breathing scale + opacity focal fade
 *   - Copy: gentler counter-parallax (anchored feel)
 *
 * Capabilities (in order, L/R alternating):
 *   01 Campaign spikes      → Auto-scaling          (DSEventLog)
 *   02 Single-zone outages  → Multi-zone reliability (DSZoneBoard)   FLIP
 *   03 Risky deploys        → Safe releases          (DSDeployStack)
 *   04 Perf decay           → Performance Watch      (DSAPMTrace)    FLIP
 */

import { useRef } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import DSReveal from '../design-system/components/DSReveal.jsx';
import DSEventLog from '../design-system/components/DSEventLog.jsx';
import DSZoneBoard from '../design-system/components/DSZoneBoard.jsx';
import DSDeployStack from '../design-system/components/DSDeployStack.jsx';
import DSAPMTrace from '../design-system/components/DSAPMTrace.jsx';
import { useSectionScroll } from '../design-system/hooks/useSectionScroll.js';

// ── Per-capability artifact factories ──────────────────────────────────

function ScalingArtifact() {
    return (
        <DSEventLog
            title="auto-scaler · zone eu-west-1"
            statusLabel="live"
            events={[
                { ts: '14:00:08', kind: 'info', text: 'launch · traffic baseline 1M/day' },
                { ts: '14:00:42', kind: 'info', text: 'spike detected · +220% in 30s' },
                { ts: '14:00:48', kind: 'ok',   text: 'auto-scaled to 2,000+ workers across zones' },
                { ts: '14:01:14', kind: 'ok',   text: 'p99 holding · 0.82s' },
                { ts: '14:01:30', kind: 'ok',   text: 'checkout success rate · 99.6%' },
                { ts: '15:14:00', kind: 'live', text: 'traffic normalized · scaling down' },
            ]}
        />
    );
}

function ReliabilityArtifact() {
    return (
        <DSZoneBoard
            title="us central · multi-zone"
            zones={[
                { id: 'us-central1-a', state: 'active',  meta: 'active · 99.99%' },
                { id: 'us-central1-b', state: 'active',  meta: 'active · 99.99%' },
                { id: 'us-central1-c', state: 'standby', meta: 'standby' },
            ]}
            lastFailover="never · 30d window"
            pitrWindow="30 days · file + db"
            lastBackup="✓ verified · eu-west · 4h ago"
        />
    );
}

function ReleasesArtifact() {
    return (
        <DSDeployStack
            staging={{
                id: '#4127',
                title: 'free-shipping banner mobile fix',
                prRef: 'PR #847',
                checks: ['tests', 'lint', 'visual'],
            }}
            production={{
                id: '#4126',
                title: 'checkout PayPal callback timeout',
                ageLabel: '14h ago',
            }}
            weeklyStats="14 deploys this week · 0 incidents"
        />
    );
}

function PerformanceArtifact() {
    return (
        <DSAPMTrace
            title="apm trace · /checkout"
            p99Label="480ms (p99)"
            frames={[
                { name: 'wp_loaded()',                                  ms: 120, depth: 0 },
                { name: 'woocommerce_init()',                           ms: 96,  depth: 1 },
                { name: "custom_filter('woocommerce_cart_loaded')",     ms: 236, depth: 2, isSlow: true },
                { name: 'add_to_cart()',                                ms: 28,  depth: 1 },
            ]}
            rootCauseText="custom_filter (woocommerce_cart_loaded)"
            prRef="PR #1284 · ready"
        />
    );
}

// ── Capability data ────────────────────────────────────────────────────

const CAPABILITIES = [
    {
        eyebrowNum: '01',
        eyebrowLabel: 'scale',
        title: "Black Friday is just another Tuesday.",
        accent: "another Tuesday.",
        tagline: 'Real-time horizontal scaling across zones — checkout stays stable when traffic surges 200%+ in 30 seconds.',
        bullets: [
            'Spike detection in <30s → workers added across zones',
            'Scaled grüum to 16× their baseline load · p99 held under 1s',
            'Scale-down automatic when traffic normalizes (no surprise bills)',
        ],
        Artifact: ScalingArtifact,
        flip: false,
    },
    {
        eyebrowNum: '02',
        eyebrowLabel: 'reliability',
        title: "When something tries to break, it doesn't reach customers.",
        accent: "it doesn't reach customers.",
        tagline: 'Active-active across two zones, hot standby in a third. PITR + 30-day backups verified hourly.',
        bullets: [
            'Active-active multi-zone on Google Cloud with auto-failover',
            'PITR + 30-day file-system + db backups (verified hourly)',
            '99.99% uptime SLA — last failover in 30-day window: never',
        ],
        Artifact: ReliabilityArtifact,
        flip: true,
    },
    {
        eyebrowNum: '03',
        eyebrowLabel: 'releases',
        title: 'Deploys ship daily without anyone holding their breath.',
        accent: "holding their breath.",
        tagline: 'Every change goes through staging with full test + visual regression. One-click promote to prod, one-click revert.',
        bullets: [
            'Isolated staging per branch · CI/CD pipeline included',
            'Visual regression + smoke tests run before promote',
            'One-click rollback — 14 deploys/week, 0 incidents',
        ],
        Artifact: ReleasesArtifact,
        flip: false,
    },
    {
        eyebrowNum: '04',
        eyebrowLabel: 'performance',
        title: 'Slow becomes a bug we own, not one you find.',
        accent: 'not one you find.',
        tagline: 'Our APM stack traces every request. When a custom filter or plugin update introduces a regression, we surface the trace and the PR with the fix — not just the alert.',
        bullets: [
            'Managed APM + logs + alerts',
            'Recurring perf reports go to your team email + Slack',
            'Root-cause shipped as a PR (with the fix, not just the symptom)',
        ],
        Artifact: PerformanceArtifact,
        flip: true,
    },
];

// Split a title at its accent suffix so the accent can be color-styled.
function splitTitle(full, accent) {
    if (!accent || !full.endsWith(accent)) return { head: full, accent: '' };
    return { head: full.slice(0, full.length - accent.length), accent };
}

// ── Per-capability section ─────────────────────────────────────────────

function CapabilitySection({
    eyebrowNum,
    eyebrowLabel,
    title,
    accent,
    tagline,
    bullets,
    Artifact,
    flip,
}) {
    const sectionRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const progress = useSectionScroll(sectionRef);
    // Reduced-motion users get zero-range transforms → no per-frame work.
    const artY     = useTransform(progress, [0, 1],            reduceMotion ? [0, 0] : [80, -80]);
    const artScale = useTransform(progress, [0, 0.5, 1],       reduceMotion ? [1, 1, 1] : [0.88, 1.08, 0.88]);
    const artOpac  = useTransform(progress, [0, 0.35, 0.65, 1], reduceMotion ? [1, 1, 1, 1] : [0.25, 1, 1, 0.25]);
    const copyY    = useTransform(progress, [0, 1],            reduceMotion ? [0, 0] : [32, -32]);

    const { head, accent: accentText } = splitTitle(title, accent);

    return (
        <div
            ref={sectionRef}
            className={`woo-cap${flip ? ' woo-cap--flip' : ''}`}
            data-snap-section
        >
            <div className="ds-wrap woo-cap-grid">
                <motion.div className="woo-cap-copy" style={{ y: copyY }}>
                    <DSReveal>
                        <span className="ds-num-label">
                            {eyebrowNum} <span className="woo-cap-eyebrow-sep">·</span> {eyebrowLabel}
                        </span>
                    </DSReveal>
                    <DSReveal delay={0.06}>
                        <h3 className="ds-h2 woo-cap-title">
                            {head}
                            <span className="woo-cap-accent">{accentText}</span>
                        </h3>
                    </DSReveal>
                    <DSReveal delay={0.12}>
                        <p className="ds-sub woo-cap-tagline">{tagline}</p>
                    </DSReveal>
                    <DSReveal delay={0.18}>
                        <ul className="woo-cap-bullets">
                            {bullets.map((b) => (
                                <li key={b}>{b}</li>
                            ))}
                        </ul>
                    </DSReveal>
                    <DSReveal delay={0.24}>
                        <a
                            href="#demo-form-section"
                            className="woo-cap-cta"
                            onClick={(e) => {
                                e.preventDefault();
                                window.dispatchEvent(new CustomEvent('openDemoForm'));
                            }}
                        >
                            Get a free audit <span className="ds-arrow">&rarr;</span>
                        </a>
                    </DSReveal>
                </motion.div>

                <motion.div
                    className="woo-cap-art-wrap"
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
 * OpsConstellation — visual metaphor for the WooCapabilities intro band.
 *
 * Four labeled operational pillars (Scaling · Reliability · Releases ·
 * Performance) ride on a slowly-rotating diamond around a central Urumi
 * core. Spokes pulse with a traveling gradient. Each node has its own
 * breathing halo. Core breathes independently of the rotation.
 *
 * Counterpart to Vision's TriadConstellation (3 AI nodes around a triangle).
 * Same rhythm, four points instead of three — diamond vs triangle keeps
 * the two pages visually rhyming without copying.
 *
 * Pure SVG + CSS. Honors prefers-reduced-motion (rotation + halos freeze).
 */
function OpsConstellation() {
    return (
        <div className="woo-quad" aria-hidden="true">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                {/* ── Concentric guide rings (very faint, depth) ── */}
                <g className="woo-quad-rings">
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

                {/* ── Slow-rotating quad geometry ── */}
                <g className="woo-quad-spin" style={{ transformOrigin: '200px 200px' }}>
                    {/* Outer diamond (square rotated 45°) — vertices at top/right/bottom/left */}
                    <polygon points="200,40 360,200 200,360 40,200"
                             fill="none"
                             stroke="color-mix(in srgb, var(--color-accent) 22%, transparent)"
                             strokeWidth="1" strokeDasharray="3 6" />

                    {/* Spokes from center to each node — these "pulse" via a gradient. */}
                    <line x1="200" y1="200" x2="200" y2="40"
                          stroke="url(#woo-quad-spoke)" strokeWidth="1.5" />
                    <line x1="200" y1="200" x2="360" y2="200"
                          stroke="url(#woo-quad-spoke)" strokeWidth="1.5" />
                    <line x1="200" y1="200" x2="200" y2="360"
                          stroke="url(#woo-quad-spoke)" strokeWidth="1.5" />
                    <line x1="200" y1="200" x2="40" y2="200"
                          stroke="url(#woo-quad-spoke)" strokeWidth="1.5" />

                    {/* Outer nodes — breathing halo + solid core dot. */}
                    <g className="woo-quad-node woo-quad-node--top">
                        <circle cx="200" cy="40" r="22"
                                fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                        <circle cx="200" cy="40" r="7" fill="var(--color-accent)" />
                    </g>
                    <g className="woo-quad-node woo-quad-node--right">
                        <circle cx="360" cy="200" r="22"
                                fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                        <circle cx="360" cy="200" r="7" fill="var(--color-accent)" />
                    </g>
                    <g className="woo-quad-node woo-quad-node--bottom">
                        <circle cx="200" cy="360" r="22"
                                fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                        <circle cx="200" cy="360" r="7" fill="var(--color-accent)" />
                    </g>
                    <g className="woo-quad-node woo-quad-node--left">
                        <circle cx="40" cy="200" r="22"
                                fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                        <circle cx="40" cy="200" r="7" fill="var(--color-accent)" />
                    </g>
                </g>

                {/* ── Central Urumi core (does NOT rotate — anchor) ── */}
                <g className="woo-quad-core">
                    <circle cx="200" cy="200" r="34"
                            fill="color-mix(in srgb, var(--color-accent) 9%, transparent)" />
                    <circle cx="200" cy="200" r="22"
                            fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                    <circle cx="200" cy="200" r="13" fill="var(--color-accent)" />
                </g>

                <defs>
                    <linearGradient id="woo-quad-spoke" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="var(--color-accent)" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.15" />
                    </linearGradient>
                </defs>
            </svg>

            {/* HTML labels — ride with the SVG aspect ratio + reuse design-system type. */}
            <span className="woo-quad-label woo-quad-label--top">
                <span className="ds-num-label">01</span> Scaling
            </span>
            <span className="woo-quad-label woo-quad-label--right">
                <span className="ds-num-label">02</span> Reliability
            </span>
            <span className="woo-quad-label woo-quad-label--bottom">
                <span className="ds-num-label">03</span> Releases
            </span>
            <span className="woo-quad-label woo-quad-label--left">
                <span className="ds-num-label">04</span> Performance
            </span>
            {/* No center label — the four outer pills make the core read as
                the focal point without text floating off the orange dot onto
                the cream canvas. */}
        </div>
    );
}

// ── Section wrapper ────────────────────────────────────────────────────

export default function WooCapabilities() {
    const introRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const introProgress = useSectionScroll(introRef);
    const introOpac = useTransform(introProgress, [0, 0.4, 0.6, 1], reduceMotion ? [1, 1, 1, 1] : [0.3, 1, 1, 0.3]);
    const introY    = useTransform(introProgress, [0, 1],            reduceMotion ? [0, 0] : [48, -48]);

    return (
        <section id="the-platform" className="woo-caps">
            <motion.div
                className="woo-caps-intro"
                ref={introRef}
                style={{ opacity: introOpac, y: introY }}
                data-snap-section
            >
                <div className="ds-wrap woo-caps-intro-grid">
                    <div className="woo-caps-intro-copy">
                        <DSReveal>
                            <span className="ds-num-label">01 / The platform</span>
                        </DSReveal>
                        <DSReveal delay={0.06}>
                            <h2 className="ds-h2 woo-caps-intro-title">
                                Four jobs. <span className="woo-cap-accent">One operations layer.</span>
                            </h2>
                        </DSReveal>
                        <DSReveal delay={0.12}>
                            <p className="ds-sub woo-caps-intro-sub">
                                Stores should run themselves. Here&rsquo;s how yours does &mdash; across
                                four jobs that used to need a team.
                            </p>
                        </DSReveal>
                    </div>
                    <DSReveal delay={0.20} className="woo-caps-intro-art">
                        <OpsConstellation />
                    </DSReveal>
                </div>
            </motion.div>

            {CAPABILITIES.map((c, i) => (
                <CapabilitySection key={i} {...c} />
            ))}
        </section>
    );
}
