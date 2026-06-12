/**
 * WooPanel5FinalCTA — Operations Panorama, Panel 5: "Console ready"
 *
 * Closing scene: a single console with the cursor blinking and a
 * "READY" indicator pulsing. The operator stands at the desk, lights
 * on. Visual invitation matching the "Run your store on Urumi." copy.
 *
 * Layers:
 *   - Single big monitor with a terminal-like screen content
 *   - Blinking cursor inside the terminal (opacity flicker)
 *   - "READY" indicator pulses
 *   - Operator silhouette standing at the console (idle bob)
 *   - Pendant light overhead with a soft pulse
 *   - Floor + potted plant continuity
 */

import { motion, useReducedMotion } from 'framer-motion';

export default function WooPanel5FinalCTA() {
    const reduced = useReducedMotion();

    return (
        <svg
            className="woo-v2-finalcta-vignette"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* ── Pendant light overhead ──────────────────────────── */}
            <path d="M 190 8 L 190 22" strokeWidth="0.7" />
            <path d="M 178 22 L 202 22 L 198 38 L 182 38 Z" strokeWidth="0.9" />
            {/* Light cone underneath, pulses */}
            <motion.path
                d="M 178 38 L 168 70 L 212 70 L 202 38 Z"
                strokeWidth="0.4"
                strokeDasharray="2 3"
                animate={!reduced ? { opacity: [0.25, 0.65, 0.25] } : { opacity: 0.45 }}
                transition={!reduced
                    ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            />

            {/* ── Big single monitor ───────────────────────────────── */}
            <path d="M 110 50 L 270 50 L 270 140 L 110 140 Z" strokeWidth="1.2" />
            {/* Screen surface */}
            <motion.rect
                x="116" y="56" width="148" height="78" rx="0.8"
                strokeWidth="0.5"
                animate={!reduced ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.9 }}
                transition={!reduced
                    ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            />
            {/* Terminal "prompt" lines on the screen */}
            <text x="124" y="74" fontSize="6" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.04em">
                $ urumi status
            </text>
            <text x="124" y="86" fontSize="5" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.04em">
                ✓ infra · 99.99% · 12 zones
            </text>
            <text x="124" y="96" fontSize="5" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.04em">
                ✓ checkout · 0 errors · 5.1M/day
            </text>
            <text x="124" y="106" fontSize="5" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.04em">
                ✓ release · main · auto-deploy on
            </text>
            <text x="124" y="120" fontSize="6" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.04em">
                $ ready_
            </text>
            {/* Blinking cursor block */}
            <motion.rect
                x="158" y="115" width="4" height="6"
                fill="currentColor" stroke="none"
                animate={!reduced ? { opacity: [1, 0, 1] } : { opacity: 1 }}
                transition={!reduced
                    ? { duration: 1, repeat: Infinity, ease: 'steps(2)' }
                    : {}}
            />
            {/* Stand */}
            <path d="M 190 140 L 190 156" strokeWidth="0.9" />
            <path d="M 168 158 L 212 158" strokeWidth="0.9" />

            {/* ── "READY" indicator beside the monitor ────────────── */}
            <motion.g
                animate={!reduced ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.9 }}
                transition={!reduced
                    ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            >
                <circle cx="288" cy="60" r="2.6" fill="currentColor" stroke="none" />
                <text x="296" y="63" fontSize="6" fontFamily="JetBrains Mono, monospace" fontWeight="700" fill="currentColor" stroke="none" letterSpacing="0.1em">
                    READY
                </text>
            </motion.g>

            {/* ── Desk ─────────────────────────────────────────────── */}
            <path d="M 30 168 L 350 168" strokeWidth="1.2" />
            <path d="M 30 168 L 30 178" strokeWidth="0.7" />
            <path d="M 350 168 L 350 178" strokeWidth="0.7" />
            <path d="M 30 178 L 350 178" strokeWidth="0.7" />

            {/* ── Operator standing at the console ────────────────── */}
            <motion.g
                strokeWidth="1"
                animate={!reduced ? { y: [0, -1.4, 0] } : { y: 0 }}
                transition={!reduced
                    ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            >
                {/* Head */}
                <circle cx="74" cy="148" r="3.5" />
                {/* Body — full silhouette behind the desk */}
                <path d="M 74 151 L 74 176" />
                <path d="M 70 158 L 78 158" strokeWidth="0.8" />
                {/* Hand resting on the desk */}
                <path d="M 78 162 L 88 168" strokeWidth="0.8" />
            </motion.g>

            {/* Floor */}
            <path d="M 12 210 C 100 212, 280 211, 368 212" strokeWidth="1.2" />

            {/* Potted plant continuity, far right */}
            <path d="M 322 196 L 334 196 L 332 210 L 324 210 Z" strokeWidth="0.8" />
            <motion.g
                animate={!reduced ? { rotate: [-6, 6, -6] } : { rotate: 0 }}
                transition={!reduced
                    ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'bottom center',
                }}
            >
                <path d="M 325 196 Q 324 190, 326 186" strokeWidth="0.7" />
                <path d="M 330 196 Q 331 188, 333 185" strokeWidth="0.7" />
                <circle cx="326"   cy="186" r="1.6" strokeWidth="0.7" />
                <circle cx="332.5" cy="185" r="1.4" strokeWidth="0.7" />
            </motion.g>
        </svg>
    );
}
