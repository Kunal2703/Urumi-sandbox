/**
 * VisionPanel6Analytics — Storefront Panorama, Panel 6: "Analytics AI"
 *
 * Analytics AI's job: ask the store anything in plain English. The
 * vignette shows: merchant asks a question via speech bubble, robot
 * responds by holding up a small chart whose bars grow as if being
 * computed.
 *
 * Animation choreography (~7s loop):
 *   Phase 0 (700ms)  — idle: shop fragment, merchant + robot
 *   Phase 1 (500ms)  — merchant's question bubble scales in
 *   Phase 2 (1500ms) — question text visible
 *   Phase 3 (500ms)  — robot's chart-board scales in
 *   Phase 4 (1200ms) — chart bars grow from 0 to full height (staggered)
 *   Phase 5 (1700ms) — hold (full scene)
 *   Phase 6 (700ms)  — bubble + chart fade out
 *
 * Pure inline SVG + framer-motion. prefers-reduced-motion shows the
 * end state (bubble + chart filled, no animation).
 */

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PHASE_DURATIONS_MS = [700, 500, 1500, 500, 1200, 1700, 700];

// Chart bars — final heights (px from base).
const BARS = [16, 22, 30, 38, 26, 44, 50];
const BAR_BASE_Y = 138;
const BAR_X_START = 210;
const BAR_W = 8;
const BAR_GAP = 4;

export default function VisionPanel6Analytics() {
    const reduced = useReducedMotion();
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        if (reduced) {
            setPhase(5);
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

    const bubbleVisible = phase >= 1 && phase < 6;
    const bubbleScaling = phase === 1;
    const chartVisible  = phase >= 3 && phase < 6;
    const chartScaling  = phase === 3;
    const barsGrowing   = phase >= 4 && phase < 6;

    return (
        <svg
            className="vision-v2-analytics-sketch"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Shop fragment on left */}
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
            <path d="M 50 110 L 50 198" strokeWidth="1.2" />
            <path d="M 90 110 L 90 198" strokeWidth="1.2" />
            <path d="M 50 110 L 90 110" strokeWidth="1.2" />
            <circle cx="83" cy="158" r="1.2" fill="currentColor" stroke="none" />

            <path d="M 8 200 C 100 202, 280 201, 372 202" strokeWidth="1.2" />

            {/* Merchant on the left, gesturing toward robot */}
            <g strokeWidth="1.1">
                <circle cx="135" cy="148" r="3.5" />
                <path d="M 135 152 L 135 178" />
                <path d="M 135 160 L 148 154" />
                <path d="M 135 160 L 128 168" />
                <path d="M 135 178 L 130 196" />
                <path d="M 135 178 L 140 196" />
            </g>

            {/* Merchant's question bubble */}
            <motion.g
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{
                    scale: bubbleVisible ? 1 : 0.4,
                    opacity: bubbleVisible ? 1 : 0,
                }}
                transition={{
                    scale: {
                        duration: bubbleScaling ? 0.4 : 0.3,
                        ease: bubbleScaling ? [0.16, 1, 0.3, 1] : [0.4, 0, 0.6, 1],
                    },
                    opacity: { duration: 0.3 },
                }}
                style={{ transformOrigin: '170px 124px' }}
            >
                <path
                    d="M 152 102 L 198 102 Q 208 102, 208 112 L 208 130 Q 208 140, 198 140 L 162 140 L 152 148 L 156 140 L 152 140 Q 142 140, 142 130 L 142 112 Q 142 102, 152 102 Z"
                    strokeWidth="1.2"
                    fill="var(--color-bg)"
                />
                <text
                    x="175"
                    y="125"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fill="currentColor"
                    stroke="none"
                    textAnchor="middle"
                    letterSpacing="0.02em"
                >
                    Top sellers?
                </text>
            </motion.g>

            {/* Robot on the right, holding a chart-board */}
            <g transform="translate(310, 152)">
                <path d="M 8 -6 L 8 -11" strokeWidth="0.9" />
                <circle cx="8" cy="-12.5" r="1.2" fill="currentColor" stroke="none" />
                <path d="M 0 -6 L 16 -6 L 16 8 L 0 8 Z" strokeWidth="1.3" />
                <circle cx="5" cy="0" r="1.4" fill="currentColor" stroke="none" />
                <circle cx="11" cy="0" r="1.4" fill="currentColor" stroke="none" />
                <path d="M 5 4 L 11 4" strokeWidth="0.7" />
                <path d="M 0 1 L -1.5 1" strokeWidth="0.6" />
                <path d="M 16 1 L 17.5 1" strokeWidth="0.6" />
                <path d="M 2 8 L 14 8 L 14 22 L 2 22 Z" strokeWidth="1.1" />
                {/* Both arms extended UP holding chart */}
                <path d="M 2 12 L -8 6" strokeWidth="0.9" />
                <path d="M 14 12 L 19 16" strokeWidth="0.9" />
                <path d="M 5 22 L 4 30" strokeWidth="0.9" />
                <path d="M 11 22 L 12 30" strokeWidth="0.9" />
            </g>

            {/* Chart-board held up by robot */}
            <motion.g
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{
                    scale: chartVisible ? 1 : 0.4,
                    opacity: chartVisible ? 1 : 0,
                }}
                transition={{
                    scale: {
                        duration: chartScaling ? 0.4 : 0.3,
                        ease: chartScaling ? [0.16, 1, 0.3, 1] : [0.4, 0, 0.6, 1],
                    },
                    opacity: { duration: 0.3 },
                }}
                style={{ transformOrigin: '258px 124px' }}
            >
                {/* Board frame */}
                <path
                    d="M 198 96 L 318 96 L 318 148 L 198 148 Z"
                    strokeWidth="1.2"
                    fill="var(--color-bg)"
                />
                {/* Title */}
                <text
                    x="208"
                    y="108"
                    fontSize="7"
                    fontFamily="JetBrains Mono, monospace"
                    fill="var(--color-fg-dim)"
                    stroke="none"
                    letterSpacing="0.08em"
                >
                    TOP 7 PRODUCTS · LAST 30D
                </text>
                {/* Baseline */}
                <path
                    d={`M ${BAR_X_START - 2} ${BAR_BASE_Y + 1} L ${BAR_X_START + BARS.length * (BAR_W + BAR_GAP)} ${BAR_BASE_Y + 1}`}
                    strokeWidth="0.7"
                    stroke="var(--color-border)"
                />
                {/* Chart bars — grow on phase 4 */}
                {BARS.map((h, i) => {
                    const x = BAR_X_START + i * (BAR_W + BAR_GAP);
                    return (
                        <motion.rect
                            key={i}
                            x={x}
                            width={BAR_W}
                            fill="var(--color-accent)"
                            stroke="none"
                            initial={{ height: 0, y: BAR_BASE_Y }}
                            animate={{
                                height: barsGrowing ? h : 0,
                                y: barsGrowing ? BAR_BASE_Y - h : BAR_BASE_Y,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.06,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        />
                    );
                })}
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
