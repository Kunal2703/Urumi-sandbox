/**
 * DSOpsConsole — full operations-console artifact for the Vision hero.
 *
 * Matches the "operations layer for modern commerce" tagline by literally
 * showing what an ops console looks like for a live store: header, live
 * throughput sparkline, status metrics row, agent activity ticker.
 *
 * Pure inline SVG + CSS — zero JS for the visuals. The activity ticker
 * uses framer-motion AnimatePresence (same pattern as the older
 * DSAgentActivity).
 *
 * Replaces the simpler single-ticker DSAgentActivity in the Vision hero.
 * DSAgentActivity stays in the codebase for other surfaces that might
 * want the lighter treatment.
 */

import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './DSOpsConsole.css';

const ACTIVITY_POOL = [
    { ai: 'Builder',   action: 'shipped HeroSection.jsx' },
    { ai: 'Revenue',   action: 'cart abandonment +12% w/w', alert: true },
    { ai: 'Analytics', action: 'daily report → ops@store.com' },
    { ai: 'Builder',   action: 'generated SearchPanel.jsx' },
    { ai: 'Revenue',   action: 'PayPal callback timeout', alert: true },
    { ai: 'Analytics', action: 'chart shared (3 teammates)' },
    { ai: 'Builder',   action: 'rolled back Plugin v3.2.1 in 8s' },
    { ai: 'Revenue',   action: '$2.3K saved this week' },
];

function relativeTime(ms) {
    const s = Math.max(1, Math.floor(ms / 1000));
    if (s < 60)  return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60)  return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
}

let counter = 0;

export default function DSOpsConsole({
    intervalMs = 2800,
    maxVisible = 4,
}) {
    const reduced = useReducedMotion();
    const [now, setNow] = useState(() => Date.now());
    const cursorRef = useRef(0);

    const [events, setEvents] = useState(() => {
        const base = Date.now();
        return Array.from({ length: maxVisible }, (_, i) => ({
            id: counter++,
            ...ACTIVITY_POOL[i % ACTIVITY_POOL.length],
            addedAt: base - i * intervalMs,
        }));
    });

    useEffect(() => {
        if (reduced) return;
        cursorRef.current = maxVisible;
        const push = setInterval(() => {
            setEvents((prev) => {
                const next = {
                    id: counter++,
                    ...ACTIVITY_POOL[cursorRef.current % ACTIVITY_POOL.length],
                    addedAt: Date.now(),
                };
                cursorRef.current += 1;
                return [next, ...prev].slice(0, maxVisible);
            });
        }, intervalMs);
        return () => clearInterval(push);
    }, [intervalMs, maxVisible, reduced]);

    useEffect(() => {
        if (reduced) return;
        const tick = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(tick);
    }, [reduced]);

    return (
        <div className="ds-ops" role="img" aria-label="Live operations console for an example Urumi store">
            {/* ── Header bar ─────────────────────────────────────────────── */}
            <header className="ds-ops__header">
                <span className="ds-ops__brand">
                    <span className="ds-ops__brand-mark" />
                    URUMI &middot; OPERATIONS
                </span>
                {/* Generic placeholder rather than a specific customer name —
                    grüum lives in Section 2's case study where it's properly
                    framed; in the hero we want visitors projecting themselves
                    onto the dashboard, not reading it as someone else's data.
                    See feedback memory: feedback_gruum_approved_metrics.md. */}
                <span className="ds-ops__live">
                    <span className="ds-ops__live-dot" />
                    LIVE &middot; YOUR-STORE.COM
                </span>
            </header>

            {/* ── Throughput panel ───────────────────────────────────────── */}
            <section className="ds-ops__throughput">
                <div className="ds-ops__throughput-meta">
                    <span className="ds-ops__label">Requests / day</span>
                    <span className="ds-ops__throughput-value">
                        5.1M<span className="ds-ops__unit">req/day</span>
                    </span>
                    <span className="ds-ops__throughput-sub">
                        sustained &middot; peak load
                    </span>
                </div>
                <div className="ds-ops__sparkline">
                    <svg viewBox="0 0 220 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Baseline */}
                        <line x1="0" y1="60" x2="220" y2="60"
                              stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
                        {/* Area fill under the line */}
                        <path d="M 0 50 L 16 48 L 32 52 L 48 44 L 64 47 L 80 38 L 96 42 L 112 30
                                 L 128 36 L 144 24 L 160 28 L 176 18 L 192 22 L 208 14 L 220 18 L 220 70 L 0 70 Z"
                              fill="color-mix(in srgb, var(--color-accent) 14%, transparent)" />
                        {/* Line */}
                        <path d="M 0 50 L 16 48 L 32 52 L 48 44 L 64 47 L 80 38 L 96 42 L 112 30
                                 L 128 36 L 144 24 L 160 28 L 176 18 L 192 22 L 208 14 L 220 18"
                              fill="none" stroke="var(--color-accent)"
                              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Live cursor at end */}
                        <circle className="ds-ops__cursor" cx="220" cy="18" r="3.5" fill="var(--color-accent)" />
                        <circle className="ds-ops__cursor-halo" cx="220" cy="18" r="6" fill="none"
                                stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
                    </svg>
                </div>
            </section>

            {/* ── Status row ─────────────────────────────────────────────── */}
            <section className="ds-ops__status">
                <div className="ds-ops__status-cell">
                    <span className="ds-ops__status-dot ds-ops__status-dot--ok" />
                    <div className="ds-ops__status-body">
                        <span className="ds-ops__status-val">p99 &lt; 1s</span>
                        <span className="ds-ops__status-key">latency · sustained</span>
                    </div>
                </div>
                <div className="ds-ops__status-cell">
                    <span className="ds-ops__status-dot ds-ops__status-dot--ok" />
                    <div className="ds-ops__status-body">
                        <span className="ds-ops__status-val">99.99%</span>
                        <span className="ds-ops__status-key">uptime · multi-zone</span>
                    </div>
                </div>
            </section>

            {/* ── Agent activity ticker ──────────────────────────────────── */}
            <section className="ds-ops__activity">
                <header className="ds-ops__activity-head">
                    <span className="ds-ops__label">Agent activity</span>
                    <span className="ds-ops__activity-meta">24h · all 3 AIs</span>
                </header>
                <ul className="ds-ops__activity-list">
                    <AnimatePresence initial={false}>
                        {events.map((ev) => (
                            <motion.li
                                key={ev.id}
                                className={`ds-ops__row${ev.alert ? ' ds-ops__row--alert' : ''}`}
                                layout={!reduced}
                                initial={reduced ? false : { opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.25 } }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.16, 1, 0.3, 1],
                                    layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                                }}
                            >
                                <span className="ds-ops__row-icon">
                                    {ev.alert ? '⚠' : '●'}
                                </span>
                                <span className="ds-ops__row-ai">{ev.ai}</span>
                                <span className="ds-ops__row-action">{ev.action}</span>
                                <span className="ds-ops__row-time">{relativeTime(now - ev.addedAt)}</span>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer className="ds-ops__footer">
                <span className="ds-ops__footer-mark">
                    <span className="ds-ops__footer-dot" />
                    AGENT &middot; CONTINUOUS &middot; NO DASHBOARD REQUIRED
                </span>
            </footer>
        </div>
    );
}
