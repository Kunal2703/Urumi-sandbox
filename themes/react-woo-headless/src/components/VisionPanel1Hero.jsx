/**
 * VisionPanel1Hero — Storefront Panorama, Panel 1: "Open"
 *
 * The opening shop scene. Many independent ambient loops with
 * deliberately faster cycles than the previous pass — the scene
 * should always have something moving in your peripheral vision.
 *
 * Layers (back → front):
 *   - Sun in top-left: pulses + rays grow/shrink
 *   - Two swallows on opposing paths (L→R high, R→L lower) so the
 *     sky never sits empty for long
 *   - Awning scallops ripple in a wave (per-scallop opacity pulse)
 *   - A "DING" sparkle pops above the shop sign
 *   - Hanging shop sign sways
 *   - Window display: two items slowly spin in place
 *   - Merchant breathes in the doorway
 *   - A cat sits at the merchant's feet, tail flicks
 *   - One customer walks IN from the right edge toward the door
 *   - One customer walks OUT of the door carrying a package, exits right
 *   - Flowers in the pot wiggle
 *
 * prefers-reduced-motion freezes everything to a coherent still frame.
 */

import { motion, useReducedMotion } from 'framer-motion';

const SCALLOPS = [
    'M 60 96 Q 67 102, 74 96',
    'M 74 96 Q 81 102, 88 96',
    'M 88 96 Q 95 102, 102 96',
    'M 102 96 Q 109 102, 116 96',
    'M 116 96 Q 123 102, 130 96',
    'M 130 96 Q 137 102, 144 96',
    'M 144 96 Q 151 102, 158 96',
    'M 158 96 Q 165 102, 172 96',
    'M 172 96 Q 179 102, 186 96',
    'M 186 96 Q 193 102, 200 96',
    'M 200 96 Q 207 102, 214 96',
    'M 214 96 Q 221 102, 228 96',
    'M 228 96 Q 235 102, 242 96',
    'M 242 96 Q 249 102, 256 96',
];

function ScallopRipple({ d, idx, reduced }) {
    return (
        <motion.path
            d={d}
            strokeWidth="0.9"
            animate={!reduced ? { opacity: [1, 0.25, 1] } : { opacity: 1 }}
            transition={!reduced
                ? {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (idx / SCALLOPS.length) * 1.8,
                }
                : {}}
        />
    );
}

export default function VisionPanel1Hero() {
    const reduced = useReducedMotion();

    return (
        <svg
            className="vision-v2-hero-shop"
            viewBox="0 0 320 240"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* ── Sky layer ───────────────────────────────────────── */}

            {/* Sun disc — pulses opacity */}
            <motion.circle
                cx="32" cy="32" r="6" strokeWidth="0.9"
                animate={!reduced ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.8 }}
                transition={!reduced
                    ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            />
            {/* Sun rays — each ray group pulses + animates pathLength so
                the rays look like they extend and retract. */}
            <motion.g
                strokeWidth="0.7"
                initial={{ pathLength: 1 }}
                animate={!reduced
                    ? { pathLength: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }
                    : { pathLength: 1, opacity: 0.8 }}
                transition={!reduced
                    ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            >
                <path d="M 32 18 L 32 10" />
                <path d="M 32 46 L 32 54" />
                <path d="M 18 32 L 10 32" />
                <path d="M 46 32 L 54 32" />
                <path d="M 22 22 L 16 16" />
                <path d="M 42 22 L 48 16" />
                <path d="M 22 42 L 16 48" />
                <path d="M 42 42 L 48 48" />
            </motion.g>

            {/* Swallow 1 — left → right, high in the sky, fast loop */}
            <motion.g
                animate={!reduced
                    ? { x: [-20, 280], opacity: [0, 1, 1, 0] }
                    : { x: -100, opacity: 0 }}
                transition={!reduced
                    ? {
                        duration: 6,
                        repeat: Infinity,
                        ease: 'linear',
                        times: [0, 0.12, 0.88, 1],
                        repeatDelay: 1,
                    }
                    : {}}
            >
                <path d="M 0 50 Q 4 46, 8 50 Q 12 46, 16 50" strokeWidth="0.7" />
            </motion.g>

            {/* Swallow 2 — right → left, lower altitude, different timing */}
            <motion.g
                animate={!reduced
                    ? { x: [0, -290], opacity: [0, 1, 1, 0] }
                    : { x: 0, opacity: 0 }}
                transition={!reduced
                    ? {
                        duration: 7,
                        repeat: Infinity,
                        ease: 'linear',
                        times: [0, 0.15, 0.85, 1],
                        repeatDelay: 2,
                        delay: 1.2,
                    }
                    : {}}
            >
                <path d="M 290 68 Q 286 64, 282 68 Q 278 64, 274 68" strokeWidth="0.7" />
            </motion.g>

            {/* DING sparkle — pops above the shop sign on a quick beat */}
            <motion.g
                animate={!reduced
                    ? { opacity: [0, 1, 0], scale: [0.4, 1.1, 0.4] }
                    : { opacity: 0, scale: 1 }}
                transition={!reduced
                    ? {
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'easeOut',
                        repeatDelay: 2.4,
                    }
                    : {}}
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                }}
            >
                <path d="M 184 96 L 184 102" strokeWidth="0.9" />
                <path d="M 181 99 L 187 99" strokeWidth="0.9" />
                <path d="M 182 97 L 186 101" strokeWidth="0.7" />
                <path d="M 186 97 L 182 101" strokeWidth="0.7" />
            </motion.g>

            {/* ── Architecture: ground, awning, walls ────────────── */}

            {/* Ground line */}
            <path d="M 12 218 C 80 220, 220 219, 308 220" strokeWidth="1.2" />

            {/* Awning */}
            <path d="M 56 96 Q 160 32, 264 96" strokeWidth="1.4" />
            <path d="M 56 96 L 264 96" strokeWidth="1" />
            <path d="M 86 78  L 88 96"  strokeWidth="0.9" />
            <path d="M 116 65 L 116 96" strokeWidth="0.9" />
            <path d="M 146 58 L 145 96" strokeWidth="0.9" />
            <path d="M 176 58 L 176 96" strokeWidth="0.9" />
            <path d="M 206 65 L 206 96" strokeWidth="0.9" />
            <path d="M 236 78 L 234 96" strokeWidth="0.9" />

            {SCALLOPS.map((d, i) => (
                <ScallopRipple key={i} d={d} idx={i} reduced={reduced} />
            ))}

            {/* Walls */}
            <path d="M 56 100 L 56 218" strokeWidth="1.2" />
            <path d="M 264 100 L 264 218" strokeWidth="1.2" />

            {/* Window display frame */}
            <path d="M 76 120 L 144 120 L 144 178 L 76 178 Z" strokeWidth="1" />
            <path d="M 110 120 L 110 178" strokeWidth="0.7" />
            <path d="M 76 149 L 144 149"  strokeWidth="0.7" />

            {/* Window display items — slowly rotate so the display
                never feels frozen. Each item rotates around its own
                centre at a different speed. */}
            <motion.g
                animate={!reduced ? { rotate: 360 } : { rotate: 0 }}
                transition={!reduced
                    ? { duration: 14, repeat: Infinity, ease: 'linear' }
                    : {}}
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                }}
            >
                <circle cx="92" cy="138" r="3" strokeWidth="0.7" />
                <path d="M 89 138 L 95 138" strokeWidth="0.5" />
            </motion.g>
            <motion.g
                animate={!reduced ? { rotate: -360 } : { rotate: 0 }}
                transition={!reduced
                    ? { duration: 11, repeat: Infinity, ease: 'linear' }
                    : {}}
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                }}
            >
                <circle cx="126" cy="138" r="2.5" strokeWidth="0.7" />
                <path d="M 124 138 L 128 138" strokeWidth="0.5" />
            </motion.g>
            {/* Bottom-shelf items, static */}
            <path d="M 84 168 L 102 168"  strokeWidth="0.7" />
            <path d="M 118 165 L 138 165" strokeWidth="0.7" />
            <path d="M 122 172 L 134 172" strokeWidth="0.7" />

            {/* Door */}
            <path d="M 162 130 L 162 218" strokeWidth="1.2" />
            <path d="M 162 130 L 234 130" strokeWidth="1.2" />
            <path d="M 234 130 L 234 218" strokeWidth="1.2" />
            <path d="M 178 144 L 218 144 L 218 168 L 178 168 Z" strokeWidth="0.8" />
            <circle cx="225" cy="186" r="1.6" strokeWidth="0" fill="currentColor" />

            {/* ── Animated foreground ─────────────────────────────── */}

            {/* Hanging shop sign — sways faster */}
            <motion.g
                animate={!reduced ? { rotate: [-5, 5, -5] } : { rotate: 0 }}
                transition={!reduced
                    ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'top center',
                }}
            >
                <path d="M 158 100 L 158 116" strokeWidth="0.7" />
                <path d="M 138 116 L 178 116 L 178 132 L 138 132 Z" strokeWidth="0.9" />
                <path d="M 146 122 L 170 122" strokeWidth="0.6" />
                <path d="M 146 128 L 170 128" strokeWidth="0.6" />
            </motion.g>

            {/* Merchant — breathes */}
            <motion.g
                animate={!reduced ? { y: [0, -2.5, 0] } : { y: 0 }}
                transition={!reduced
                    ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            >
                <circle cx="198" cy="180" r="3.5" strokeWidth="0.9" />
                <path d="M 198 184 L 198 204" strokeWidth="1" />
                <path d="M 198 192 L 192 200" strokeWidth="0.9" />
                <path d="M 198 192 L 204 200" strokeWidth="0.9" />
                <path d="M 198 204 L 194 218" strokeWidth="1" />
                <path d="M 198 204 L 202 218" strokeWidth="1" />
            </motion.g>

            {/* Cat at merchant's feet — body static, tail flicks */}
            <g strokeWidth="0.7">
                {/* Body */}
                <path d="M 208 215 Q 213 211, 218 215" />
                <path d="M 208 215 Q 209 218, 212 218" />
                <path d="M 218 215 Q 217 218, 215 218" />
                {/* Head */}
                <circle cx="220" cy="213" r="1.8" />
                {/* Ears */}
                <path d="M 219 211 L 218.5 209" />
                <path d="M 221 211 L 221.5 209" />
            </g>
            {/* Tail flick */}
            <motion.path
                d="M 208 214 Q 204 212, 203 209"
                strokeWidth="0.7"
                animate={!reduced ? { rotate: [-12, 12, -12] } : { rotate: 0 }}
                transition={!reduced
                    ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'right center',
                }}
            />

            {/* Customer walking IN from the right edge → toward the
                door, then fades just before the door (entered the
                shop). Inner gait bob makes the walk read. */}
            <motion.g
                animate={!reduced
                    ? { x: [0, -85], opacity: [0, 1, 1, 0] }
                    : { x: 0, opacity: 0 }}
                transition={!reduced
                    ? {
                        duration: 6,
                        repeat: Infinity,
                        ease: 'linear',
                        times: [0, 0.12, 0.88, 1],
                        repeatDelay: 1.2,
                    }
                    : {}}
            >
                <motion.g
                    animate={!reduced ? { y: [0, -1.2, 0] } : { y: 0 }}
                    transition={!reduced
                        ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut' }
                        : {}}
                >
                    <circle cx="306" cy="194" r="3" strokeWidth="0.8" />
                    <path d="M 306 197 L 306 209" strokeWidth="0.9" />
                    <path d="M 302 203 L 310 203" strokeWidth="0.7" />
                    <path d="M 306 209 L 302 218" strokeWidth="0.9" />
                    <path d="M 306 209 L 310 218" strokeWidth="0.9" />
                </motion.g>
            </motion.g>

            {/* Customer walking OUT of the shop carrying a package —
                appears at the door, walks RIGHT off-screen. Different
                timing so it doesn't overlap with the arriving customer. */}
            <motion.g
                animate={!reduced
                    ? { x: [0, 90], opacity: [0, 1, 1, 0] }
                    : { x: 0, opacity: 0 }}
                transition={!reduced
                    ? {
                        duration: 6.5,
                        repeat: Infinity,
                        ease: 'linear',
                        times: [0, 0.12, 0.88, 1],
                        repeatDelay: 1.5,
                        delay: 3,
                    }
                    : {}}
            >
                <motion.g
                    animate={!reduced ? { y: [0, -1.2, 0] } : { y: 0 }}
                    transition={!reduced
                        ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                        : {}}
                >
                    {/* Body */}
                    <circle cx="220" cy="194" r="3" strokeWidth="0.8" />
                    <path d="M 220 197 L 220 209" strokeWidth="0.9" />
                    <path d="M 216 203 L 224 203" strokeWidth="0.7" />
                    <path d="M 220 209 L 216 218" strokeWidth="0.9" />
                    <path d="M 220 209 L 224 218" strokeWidth="0.9" />
                    {/* Package box being carried */}
                    <rect x="222" y="200" width="6" height="5" strokeWidth="0.7" />
                    <path d="M 222 202.5 L 228 202.5" strokeWidth="0.4" />
                    <path d="M 225 200 L 225 205" strokeWidth="0.4" />
                </motion.g>
            </motion.g>

            {/* Flowerpot — pot static, flowers wiggle (faster) */}
            <path d="M 244 196 L 254 196 L 252 214 L 246 214 Z" strokeWidth="0.8" />
            <motion.g
                animate={!reduced ? { rotate: [-7, 7, -7] } : { rotate: 0 }}
                transition={!reduced
                    ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'bottom center',
                }}
            >
                <path d="M 247 196 Q 247 188, 249 184" strokeWidth="0.7" />
                <path d="M 251 196 Q 252 190, 254 188" strokeWidth="0.7" />
                <circle cx="248.5" cy="184" r="1.8" strokeWidth="0.7" />
                <circle cx="254"   cy="188" r="1.5" strokeWidth="0.7" />
            </motion.g>
        </svg>
    );
}
