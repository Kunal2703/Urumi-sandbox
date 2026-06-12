/**
 * VisionPanel5Builder — Storefront Panorama, Panel 5: "Builder AI"
 *
 * The Builder AI section of the Vision page. The metaphor: the human
 * merchant is talking to one of the robot helpers. A speech bubble
 * carries a natural-language request ("Add a hero section."). The
 * robot listens and acknowledges with a small ✓ — visualizing
 * "describe what you want, Builder ships it."
 *
 * Same hand-drawn pen-line aesthetic as Panels 1-4.
 *
 * Animation choreography (~6s loop):
 *   Phase 0 (700ms)  — idle: shop fragment, merchant + robot facing
 *                      each other, no speech bubble.
 *   Phase 1 (500ms)  — speech bubble scales in from the merchant's
 *                      mouth, reaches full size.
 *   Phase 2 (1800ms) — bubble visible with the request text inside.
 *   Phase 3 (500ms)  — robot eyes brighten + small ✓ check appears
 *                      next to robot, indicating it understood.
 *   Phase 4 (1700ms) — hold (full scene).
 *   Phase 5 (600ms)  — reset: bubble + check fade to opacity 0.
 *
 * Pure inline SVG + framer-motion. prefers-reduced-motion shows the
 * bubble + check static (no animation, no loop).
 */

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PHASE_DURATIONS_MS = [700, 500, 1800, 500, 1700, 600];

export default function VisionPanel5Builder() {
    const reduced = useReducedMotion();
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        if (reduced) {
            // End-of-Phase-3 snapshot: bubble + check both visible.
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

    const bubbleVisible = phase >= 1 && phase < 5;
    const bubbleScaling = phase === 1;
    const checkVisible  = phase >= 3 && phase < 5;
    const robotAlert    = phase >= 3;

    return (
        <svg
            className="vision-v2-builder-sketch"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* ── Shop fragment on the left (partial — just enough context) ── */}
            {/* Awning fragment */}
            <path d="M 8 70 Q 60 28, 110 70" strokeWidth="1.4" />
            <path d="M 8 70 L 110 70" strokeWidth="1" />
            {/* Awning stripes */}
            <path d="M 24 56 L 26 70" strokeWidth="0.9" />
            <path d="M 44 46 L 44 70" strokeWidth="0.9" />
            <path d="M 64 41 L 64 70" strokeWidth="0.9" />
            <path d="M 84 46 L 84 70" strokeWidth="0.9" />
            <path d="M 100 56 L 98 70" strokeWidth="0.9" />
            {/* Awning scallops */}
            <path d="M 12 70 Q 19 76, 26 70" strokeWidth="0.9" />
            <path d="M 26 70 Q 33 76, 40 70" strokeWidth="0.9" />
            <path d="M 40 70 Q 47 76, 54 70" strokeWidth="0.9" />
            <path d="M 54 70 Q 61 76, 68 70" strokeWidth="0.9" />
            <path d="M 68 70 Q 75 76, 82 70" strokeWidth="0.9" />
            <path d="M 82 70 Q 89 76, 96 70" strokeWidth="0.9" />
            <path d="M 96 70 Q 103 76, 110 70" strokeWidth="0.9" />
            {/* Shop wall + door */}
            <path d="M 8 74 L 8 198" strokeWidth="1.2" />
            <path d="M 110 74 L 110 198" strokeWidth="1.2" />
            {/* A door */}
            <path d="M 50 110 L 50 198" strokeWidth="1.2" />
            <path d="M 90 110 L 90 198" strokeWidth="1.2" />
            <path d="M 50 110 L 90 110" strokeWidth="1.2" />
            <circle cx="83" cy="158" r="1.2" fill="currentColor" stroke="none" />

            {/* ── Ground line ───────────────────────────────────────── */}
            <path d="M 8 200 C 100 202, 280 201, 372 202" strokeWidth="1.2" />

            {/* ── Merchant (human stick figure), in front of shop, gesturing right ── */}
            <g strokeWidth="1.1">
                {/* Head */}
                <circle cx="135" cy="148" r="3.5" />
                {/* Body */}
                <path d="M 135 152 L 135 178" />
                {/* Arms — one extended right toward robot (gesturing) */}
                <path d="M 135 160 L 148 154" />
                <path d="M 135 160 L 128 168" />
                {/* Legs */}
                <path d="M 135 178 L 130 196" />
                <path d="M 135 178 L 140 196" />
            </g>

            {/* ── Speech bubble (natural-language request) ──────────── */}
            <motion.g
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{
                    scale: bubbleVisible ? 1 : 0.4,
                    opacity: bubbleVisible ? 1 : 0,
                }}
                transition={{
                    scale: {
                        duration: bubbleScaling ? 0.45 : 0.3,
                        ease: bubbleScaling ? [0.16, 1, 0.3, 1] : [0.4, 0, 0.6, 1],
                    },
                    opacity: { duration: 0.3 },
                }}
                style={{ transformOrigin: '152px 144px' }}
            >
                {/* Bubble body — rounded rectangle */}
                <path
                    d="M 152 102 L 268 102 Q 278 102, 278 112 L 278 138 Q 278 148, 268 148 L 162 148 L 152 156 L 156 148 L 152 148 Q 142 148, 142 138 L 142 112 Q 142 102, 152 102 Z"
                    strokeWidth="1.2"
                />
                {/* Request text inside bubble — actual shop-owner
                    language. Matches the "FreeShippingBanner" example
                    referenced in the ops console artifact above. */}
                <text
                    x="210"
                    y="120"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fill="currentColor"
                    stroke="none"
                    textAnchor="middle"
                    letterSpacing="0.02em"
                >
                    Add a free shipping
                </text>
                <text
                    x="210"
                    y="135"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fill="currentColor"
                    stroke="none"
                    textAnchor="middle"
                    letterSpacing="0.02em"
                >
                    banner above $75.
                </text>
            </motion.g>

            {/* ── Robot (Builder bot) — listening, on the right ─────── */}
            <g transform="translate(305, 152)">
                {/* Antenna */}
                <path d="M 8 -6 L 8 -11" strokeWidth="0.9" />
                <circle cx="8" cy="-12.5" r="1.2" fill="currentColor" stroke="none" />
                {/* Head outline */}
                <path d="M 0 -6 L 16 -6 L 16 8 L 0 8 Z" strokeWidth="1.3" />
                {/* Eyes — brighten when robot acknowledges */}
                <motion.circle
                    cx="5" cy="0" r="1.4"
                    fill="currentColor" stroke="none"
                    animate={{ scale: robotAlert ? 1.3 : 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: '5px 0px', transformBox: 'fill-box' }}
                />
                <motion.circle
                    cx="11" cy="0" r="1.4"
                    fill="currentColor" stroke="none"
                    animate={{ scale: robotAlert ? 1.3 : 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: '11px 0px', transformBox: 'fill-box' }}
                />
                {/* Mouth */}
                <path d="M 5 4 L 11 4" strokeWidth="0.7" />
                {/* Side bolts */}
                <path d="M 0 1 L -1.5 1" strokeWidth="0.6" />
                <path d="M 16 1 L 17.5 1" strokeWidth="0.6" />
                {/* Body — small rectangle below head */}
                <path d="M 2 8 L 14 8 L 14 22 L 2 22 Z" strokeWidth="1.1" />
                {/* Arms (small lines extending) */}
                <path d="M 2 12 L -3 16" strokeWidth="0.9" />
                <path d="M 14 12 L 19 16" strokeWidth="0.9" />
                {/* Legs */}
                <path d="M 5 22 L 4 30" strokeWidth="0.9" />
                <path d="M 11 22 L 12 30" strokeWidth="0.9" />
            </g>

            {/* ── Acknowledgment check mark next to robot ────────────── */}
            <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: checkVisible ? 1 : 0,
                    opacity: checkVisible ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '335px 138px' }}
            >
                {/* Check mark */}
                <path
                    d="M 328 140 L 333 145 L 342 132"
                    strokeWidth="1.6"
                    stroke="var(--color-accent)"
                />
            </motion.g>

            {/* ── Flowerpot continuity element (far right) ──────────── */}
            <path d="M 354 178 L 364 178 L 362 198 L 356 198 Z" strokeWidth="0.8" />
            <path d="M 357 178 Q 357 170, 359 166" strokeWidth="0.7" />
            <path d="M 361 178 Q 362 172, 364 170" strokeWidth="0.7" />
            <circle cx="358.5" cy="166" r="1.8" strokeWidth="0.7" />
            <circle cx="364"   cy="170" r="1.5" strokeWidth="0.7" />
        </svg>
    );
}
