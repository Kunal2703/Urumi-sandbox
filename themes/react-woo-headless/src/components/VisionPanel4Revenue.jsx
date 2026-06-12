/**
 * VisionPanel4Revenue — Storefront Panorama, Panel 4: "Revenue AI"
 *
 * Revenue AI's job: catch bugs that cost money. The vignette shows
 * one of the robot helpers presenting a small "alert card" to the
 * merchant — caught a checkout regression, money saved.
 *
 * Mirror of Panel 5 (Builder): where Builder is merchant → robot
 * (a request), Revenue is robot → merchant (a finding). Different
 * visual element (an alert card with content vs a speech bubble) so
 * the two panels read distinctly even though both involve a
 * 2-character interaction.
 *
 * Animation choreography (~6s loop):
 *   Phase 0 (700ms)  — idle: shop fragment, merchant + robot, no card
 *   Phase 1 (500ms)  — alert card scales in next to robot
 *   Phase 2 (2000ms) — card visible (alert + savings amount)
 *   Phase 3 (500ms)  — small "!" appears above merchant (acknowledged)
 *   Phase 4 (1700ms) — hold (full scene)
 *   Phase 5 (600ms)  — card + indicator fade out
 *
 * Pure inline SVG + framer-motion. prefers-reduced-motion shows the
 * end state (card visible, no animation).
 */

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PHASE_DURATIONS_MS = [700, 500, 2000, 500, 1700, 600];

export default function VisionPanel4Revenue() {
    const reduced = useReducedMotion();
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        if (reduced) {
            setPhase(4);
            return;
        }
        let idx = 0;
        let timer;
        const tick = () => {
            const next = (idx + 1) % PHASE_DURATIONS_MS.length;
            setPhase(next);
            timer = setTimeout(tick, PHASE_DURATIONS_MS[next]);
            idx = next;
        };
        timer = setTimeout(tick, PHASE_DURATIONS_MS[0]);
        return () => clearTimeout(timer);
    }, [reduced]);

    const cardVisible        = phase >= 1 && phase < 5;
    const cardScaling        = phase === 1;
    const indicatorVisible   = phase >= 3 && phase < 5;

    return (
        <svg
            className="vision-v2-revenue-sketch"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* ── Shop fragment on the left ─────────────────────────── */}
            <path d="M 8 70 Q 60 28, 110 70" strokeWidth="1.4" />
            <path d="M 8 70 L 110 70" strokeWidth="1" />
            <path d="M 24 56 L 26 70" strokeWidth="0.9" />
            <path d="M 44 46 L 44 70" strokeWidth="0.9" />
            <path d="M 64 41 L 64 70" strokeWidth="0.9" />
            <path d="M 84 46 L 84 70" strokeWidth="0.9" />
            <path d="M 100 56 L 98 70" strokeWidth="0.9" />
            <path d="M 12 70 Q 19 76, 26 70" strokeWidth="0.9" />
            <path d="M 26 70 Q 33 76, 40 70" strokeWidth="0.9" />
            <path d="M 40 70 Q 47 76, 54 70" strokeWidth="0.9" />
            <path d="M 54 70 Q 61 76, 68 70" strokeWidth="0.9" />
            <path d="M 68 70 Q 75 76, 82 70" strokeWidth="0.9" />
            <path d="M 82 70 Q 89 76, 96 70" strokeWidth="0.9" />
            <path d="M 96 70 Q 103 76, 110 70" strokeWidth="0.9" />
            <path d="M 8 74 L 8 198" strokeWidth="1.2" />
            <path d="M 110 74 L 110 198" strokeWidth="1.2" />
            {/* Door */}
            <path d="M 50 110 L 50 198" strokeWidth="1.2" />
            <path d="M 90 110 L 90 198" strokeWidth="1.2" />
            <path d="M 50 110 L 90 110" strokeWidth="1.2" />
            <circle cx="83" cy="158" r="1.2" fill="currentColor" stroke="none" />

            {/* Ground */}
            <path d="M 8 200 C 100 202, 280 201, 372 202" strokeWidth="1.2" />

            {/* ── Merchant on left-middle, looking toward robot ────── */}
            <g strokeWidth="1.1">
                <circle cx="160" cy="148" r="3.5" />
                <path d="M 160 152 L 160 178" />
                <path d="M 160 160 L 152 158" />
                <path d="M 160 160 L 168 158" />
                <path d="M 160 178 L 155 196" />
                <path d="M 160 178 L 165 196" />
            </g>

            {/* ── Indicator above merchant (appears when notified) ──── */}
            <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: indicatorVisible ? 1 : 0,
                    opacity: indicatorVisible ? 1 : 0,
                    y: indicatorVisible ? [-2, -4, -2] : -2,
                }}
                transition={{
                    scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.3 },
                    y: indicatorVisible
                        ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                        : {},
                }}
                style={{ transformOrigin: '160px 138px' }}
            >
                <circle cx="160" cy="138" r="4"
                        stroke="var(--color-accent)" strokeWidth="0.9" fill="none" />
                <path d="M 160 136 L 160 139" stroke="var(--color-accent)" strokeWidth="1" />
                <circle cx="160" cy="141" r="0.6" fill="var(--color-accent)" stroke="none" />
            </motion.g>

            {/* ── Robot (Revenue bot) on the right, holding card ─── */}
            <g transform="translate(280, 152)">
                <path d="M 8 -6 L 8 -11" strokeWidth="0.9" />
                <circle cx="8" cy="-12.5" r="1.2" fill="currentColor" stroke="none" />
                <path d="M 0 -6 L 16 -6 L 16 8 L 0 8 Z" strokeWidth="1.3" />
                <circle cx="5" cy="0" r="1.4" fill="currentColor" stroke="none" />
                <circle cx="11" cy="0" r="1.4" fill="currentColor" stroke="none" />
                <path d="M 5 4 L 11 4" strokeWidth="0.7" />
                <path d="M 0 1 L -1.5 1" strokeWidth="0.6" />
                <path d="M 16 1 L 17.5 1" strokeWidth="0.6" />
                <path d="M 2 8 L 14 8 L 14 22 L 2 22 Z" strokeWidth="1.1" />
                {/* Arms — left arm extended UP holding the card */}
                <path d="M 2 12 L -8 4" strokeWidth="0.9" />
                <path d="M 14 12 L 19 16" strokeWidth="0.9" />
                <path d="M 5 22 L 4 30" strokeWidth="0.9" />
                <path d="M 11 22 L 12 30" strokeWidth="0.9" />
            </g>

            {/* ── Alert card held by robot ──────────────────────────── */}
            <motion.g
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{
                    scale: cardVisible ? 1 : 0.4,
                    opacity: cardVisible ? 1 : 0,
                }}
                transition={{
                    scale: {
                        duration: cardScaling ? 0.45 : 0.3,
                        ease: cardScaling ? [0.16, 1, 0.3, 1] : [0.4, 0, 0.6, 1],
                    },
                    opacity: { duration: 0.3 },
                }}
                style={{ transformOrigin: '252px 130px' }}
            >
                {/* Card body — rectangle with a small folded corner */}
                <path
                    d="M 198 96 L 296 96 L 296 144 L 198 144 Z"
                    strokeWidth="1.1"
                    fill="var(--color-bg)"
                />
                {/* Folded corner detail */}
                <path d="M 286 96 L 296 106 L 286 106 Z" strokeWidth="0.8" />
                <path d="M 286 96 L 286 106" strokeWidth="0.8" />

                {/* Header strip */}
                <path d="M 198 110 L 296 110" strokeWidth="0.7" />

                {/* ⚠ Alert text */}
                <text
                    x="208"
                    y="106"
                    fontSize="8"
                    fontFamily="JetBrains Mono, monospace"
                    fill="var(--color-accent)"
                    stroke="none"
                    letterSpacing="0.06em"
                >
                    ⚠ ALERT
                </text>

                {/* Body — caught bug message */}
                <text
                    x="208"
                    y="123"
                    fontSize="8"
                    fontFamily="JetBrains Mono, monospace"
                    fill="currentColor"
                    stroke="none"
                    letterSpacing="0.02em"
                >
                    Checkout bug caught
                </text>

                {/* Big saved amount */}
                <text
                    x="247"
                    y="138"
                    fontSize="13"
                    fontFamily="Inter, system-ui, sans-serif"
                    fill="var(--color-accent)"
                    stroke="none"
                    fontWeight="700"
                    textAnchor="middle"
                    letterSpacing="-0.01em"
                >
                    $2.3K saved
                </text>
            </motion.g>

            {/* Flowerpot continuity */}
            <path d="M 354 178 L 364 178 L 362 198 L 356 198 Z" strokeWidth="0.8" />
            <path d="M 357 178 Q 357 170, 359 166" strokeWidth="0.7" />
            <path d="M 361 178 Q 362 172, 364 170" strokeWidth="0.7" />
            <circle cx="358.5" cy="166" r="1.8" strokeWidth="0.7" />
            <circle cx="364"   cy="170" r="1.5" strokeWidth="0.7" />
        </svg>
    );
}
