/**
 * WooPanel1Hero — Operations Panorama, Panel 1: "The ops floor"
 *
 * Back-of-house counterpart to Vision's storefront panorama. Where
 * Vision shows the merchant + customers + AI helpers (front of house),
 * Woo shows the operations control room (back of house) — the people +
 * monitors + status boards that keep the store running.
 *
 * Same hand-drawn pen-line aesthetic as the Vision panels — currentColor
 * stroke, varied stroke widths, round caps, slightly imperfect curves.
 *
 * Layers (back → front):
 *   - Ceiling + cable runs
 *   - Status board on the back wall: 5 LEDs that pulse in sequence
 *   - Wall clock with a slowly rotating second hand
 *   - Three monitors on stands; each screen flickers on its own beat
 *   - Operator silhouette at the console, head bobs while typing
 *   - Coffee mug with a tiny steam wisp
 *   - Floor line + a potted plant (continuity with the storefront)
 *
 * prefers-reduced-motion freezes everything to a coherent still.
 */

import { motion, useReducedMotion } from 'framer-motion';

const STATUS_LEDS = [
    { cx: 192, cy: 36 },
    { cx: 204, cy: 36 },
    { cx: 216, cy: 36 },
    { cx: 228, cy: 36 },
    { cx: 240, cy: 36 },
];

export default function WooPanel1Hero() {
    const reduced = useReducedMotion();

    return (
        <svg
            className="woo-v2-hero-vignette"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* ── Ceiling + cable runs ─────────────────────────────── */}
            <path d="M 12 12 L 368 12" strokeWidth="1.2" />
            {/* Cable runs that drop from the ceiling toward each monitor */}
            <path d="M 70  12 Q 72  30, 70  60" strokeWidth="0.6" />
            <path d="M 165 12 Q 168 28, 168 58" strokeWidth="0.6" />
            <path d="M 270 12 Q 268 30, 268 60" strokeWidth="0.6" />

            {/* ── Back wall: status board + clock ──────────────────── */}
            {/* Status board frame */}
            <path d="M 180 22 L 252 22 L 252 50 L 180 50 Z" strokeWidth="0.9" />
            {/* Status board legend */}
            <text x="186" y="30" fontSize="4" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.05em">
                STATUS · ALL OK
            </text>
            {/* Five LED rounds — pulse in sequence to read as a wave */}
            {STATUS_LEDS.map((led, i) => (
                <motion.circle
                    key={`led-${i}`}
                    cx={led.cx} cy={led.cy} r="2"
                    fill="currentColor" stroke="none"
                    animate={!reduced
                        ? { opacity: [0.35, 1, 0.35], scale: [0.85, 1.25, 0.85] }
                        : { opacity: 0.9, scale: 1 }}
                    transition={!reduced
                        ? {
                            duration: 1.4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.18,
                        }
                        : {}}
                    style={{
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                    }}
                />
            ))}
            {/* Status board label below */}
            <path d="M 186 44 L 246 44" strokeWidth="0.5" />

            {/* Wall clock */}
            <circle cx="320" cy="36" r="14" strokeWidth="0.9" />
            <circle cx="320" cy="36" r="0.9" fill="currentColor" stroke="none" />
            {/* Hour ticks */}
            <path d="M 320 24 L 320 26" strokeWidth="0.6" />
            <path d="M 320 46 L 320 48" strokeWidth="0.6" />
            <path d="M 308 36 L 310 36" strokeWidth="0.6" />
            <path d="M 330 36 L 332 36" strokeWidth="0.6" />
            {/* Hour hand (static) */}
            <path d="M 320 36 L 326 30" strokeWidth="0.8" />
            {/* Second hand — rotates once per cycle */}
            <motion.line
                x1="320" y1="36" x2="320" y2="22"
                stroke="currentColor" strokeWidth="0.5"
                animate={!reduced ? { rotate: 360 } : { rotate: 0 }}
                transition={!reduced
                    ? { duration: 12, repeat: Infinity, ease: 'linear' }
                    : {}}
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: '320px 36px',
                }}
            />

            {/* ── Three monitors on stands ─────────────────────────── */}
            {/* Monitor 1 (left) */}
            <path d="M 40 60 L 100 60 L 100 110 L 40 110 Z" strokeWidth="1" />
            <motion.rect
                x="44" y="64" width="52" height="42" rx="0.5"
                strokeWidth="0.5"
                animate={!reduced ? { opacity: [0.55, 1, 0.55] } : { opacity: 0.85 }}
                transition={!reduced
                    ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            />
            {/* Screen content: little waveform */}
            <path d="M 48 86 L 54 82 L 60 88 L 66 80 L 72 90 L 78 84 L 84 92 L 90 86 L 96 90"
                  strokeWidth="0.5" />
            {/* Stand */}
            <path d="M 70 110 L 70 120" strokeWidth="0.7" />
            <path d="M 60 122 L 80 122" strokeWidth="0.7" />

            {/* Monitor 2 (centre, larger) */}
            <path d="M 138 58 L 200 58 L 200 116 L 138 116 Z" strokeWidth="1.1" />
            <motion.rect
                x="142" y="62" width="54" height="50" rx="0.5"
                strokeWidth="0.5"
                animate={!reduced ? { opacity: [0.55, 1, 0.55] } : { opacity: 0.85 }}
                transition={!reduced
                    ? { duration: 2.1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }
                    : {}}
            />
            {/* Screen content: bar chart */}
            <g strokeWidth="0.7">
                <path d="M 148 100 L 148 92" />
                <path d="M 156 100 L 156 86" />
                <path d="M 164 100 L 164 80" />
                <path d="M 172 100 L 172 74" />
                <path d="M 180 100 L 180 70" />
                <path d="M 188 100 L 188 76" />
            </g>
            <path d="M 146 102 L 192 102" strokeWidth="0.5" />
            {/* Stand */}
            <path d="M 168 116 L 168 126" strokeWidth="0.7" />
            <path d="M 156 128 L 180 128" strokeWidth="0.7" />

            {/* Monitor 3 (right) */}
            <path d="M 240 60 L 300 60 L 300 110 L 240 110 Z" strokeWidth="1" />
            <motion.rect
                x="244" y="64" width="52" height="42" rx="0.5"
                strokeWidth="0.5"
                animate={!reduced ? { opacity: [0.55, 1, 0.55] } : { opacity: 0.85 }}
                transition={!reduced
                    ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }
                    : {}}
            />
            {/* Screen content: tabular log lines */}
            <g strokeWidth="0.5">
                <path d="M 248 72 L 290 72" />
                <path d="M 248 80 L 286 80" />
                <path d="M 248 88 L 292 88" />
                <path d="M 248 96 L 282 96" />
            </g>
            {/* Stand */}
            <path d="M 270 110 L 270 120" strokeWidth="0.7" />
            <path d="M 260 122 L 280 122" strokeWidth="0.7" />

            {/* ── Console / desk (foreground) ──────────────────────── */}
            <path d="M 20 170 L 360 170" strokeWidth="1.2" />
            <path d="M 20 170 L 20 184" strokeWidth="0.8" />
            <path d="M 360 170 L 360 184" strokeWidth="0.8" />
            <path d="M 20 184 L 360 184" strokeWidth="0.8" />

            {/* ── Operator silhouette ──────────────────────────────── */}
            {/* The operator sits behind the centre monitor area. Outer
                motion.g does the typing bob; head + body inside. */}
            <motion.g
                strokeWidth="1"
                animate={!reduced ? { y: [0, -1, 0] } : { y: 0 }}
                transition={!reduced
                    ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            >
                {/* Head */}
                <circle cx="168" cy="142" r="4" />
                {/* Shoulders / torso top, peeking above the desk */}
                <path d="M 158 158 Q 168 152, 178 158" strokeWidth="1" />
                {/* Arms reaching toward the keyboard */}
                <path d="M 162 158 L 158 166" strokeWidth="0.8" />
                <path d="M 174 158 L 178 166" strokeWidth="0.8" />
            </motion.g>

            {/* ── Coffee mug with tiny steam wisps ─────────────────── */}
            <g strokeWidth="0.7">
                <path d="M 300 158 L 314 158 L 312 170 L 302 170 Z" />
                {/* Handle */}
                <path d="M 314 161 Q 318 164, 314 168" />
            </g>
            {/* Steam wisp — drifts up + fades */}
            <motion.path
                d="M 305 156 Q 307 152, 305 148 Q 303 144, 305 140"
                strokeWidth="0.5"
                animate={!reduced
                    ? { opacity: [0, 0.8, 0], y: [0, -6, -10] }
                    : { opacity: 0, y: 0 }}
                transition={!reduced
                    ? {
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeOut',
                        times: [0, 0.5, 1],
                    }
                    : {}}
            />
            <motion.path
                d="M 309 156 Q 311 152, 309 148"
                strokeWidth="0.5"
                animate={!reduced
                    ? { opacity: [0, 0.8, 0], y: [0, -6, -10] }
                    : { opacity: 0, y: 0 }}
                transition={!reduced
                    ? {
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeOut',
                        times: [0, 0.5, 1],
                        delay: 0.8,
                    }
                    : {}}
            />

            {/* ── Floor + potted plant (continuity with storefront) ── */}
            <path d="M 12 200 C 100 202, 280 201, 368 202" strokeWidth="1.2" />

            <path d="M 30 184 L 42 184 L 40 198 L 32 198 Z" strokeWidth="0.8" />
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
                <path d="M 33 184 Q 32 178, 34 174" strokeWidth="0.7" />
                <path d="M 38 184 Q 39 176, 41 173" strokeWidth="0.7" />
                <circle cx="34"   cy="174" r="1.6" strokeWidth="0.7" />
                <circle cx="40.5" cy="173" r="1.4" strokeWidth="0.7" />
            </motion.g>
        </svg>
    );
}
