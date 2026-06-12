/**
 * VisionPanel2Scale — Storefront Panorama, Panel 2: "Scale arrives"
 *
 * Three service windows + queues, with deliberately fast cycles so the
 * scene reads as a viral surge.
 *
 * Layers (back → front):
 *   - Sun in top-left: pulses + rays grow/retract
 *   - Swallow drifts across the sky on a quick loop
 *   - Awning scallops ripple in a wave
 *   - Hanging shop sign sways
 *   - 9 queue customers bob, each on its own delay
 *   - A package box pops out of each window AND a "+1" floats up
 *     above each window (orders being filled, counter ticking)
 *   - A new customer walks IN from the right edge to join queue 3
 *   - A satisfied customer walks OUT toward the LEFT carrying a
 *     package (queue throughput is visible — orders go out)
 *   - Two flowerpots wiggle (left + right of the shop)
 */

import { motion, useReducedMotion } from 'framer-motion';

const CUSTOMER_STAGGER = [
    0,    0.3,  0.6,
    0.15, 0.45, 0.75,
    0.05, 0.35, 0.65,
];

const SCALLOPS_P2 = [
    'M 54 78 Q 61 84, 68 78',
    'M 68 78 Q 75 84, 82 78',
    'M 82 78 Q 89 84, 96 78',
    'M 96 78 Q 103 84, 110 78',
    'M 110 78 Q 117 84, 124 78',
    'M 124 78 Q 131 84, 138 78',
    'M 138 78 Q 145 84, 152 78',
    'M 152 78 Q 159 84, 166 78',
    'M 166 78 Q 173 84, 180 78',
    'M 180 78 Q 187 84, 194 78',
    'M 194 78 Q 201 84, 208 78',
    'M 208 78 Q 215 84, 222 78',
    'M 222 78 Q 229 84, 236 78',
    'M 236 78 Q 243 84, 250 78',
    'M 250 78 Q 257 84, 264 78',
    'M 264 78 Q 271 84, 278 78',
    'M 278 78 Q 285 84, 292 78',
    'M 292 78 Q 299 84, 306 78',
    'M 306 78 Q 313 84, 320 78',
    'M 320 78 Q 327 84, 334 78',
];

function ScallopRipple({ d, idx, reduced }) {
    return (
        <motion.path
            d={d}
            strokeWidth="0.9"
            animate={!reduced ? { opacity: [1, 0.25, 1] } : { opacity: 1 }}
            transition={!reduced
                ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (idx / SCALLOPS_P2.length) * 2,
                }
                : {}}
        />
    );
}

function StickCustomer({ x, y, idx }) {
    const reduced = useReducedMotion();
    return (
        <motion.g
            strokeWidth="1"
            animate={!reduced ? { y: [0, -3, 0] } : { y: 0 }}
            transition={!reduced
                ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: CUSTOMER_STAGGER[idx] || 0,
                }
                : {}}
        >
            <circle cx={x} cy={y} r="3" />
            <path d={`M ${x} ${y + 3} L ${x} ${y + 17}`} />
            <path d={`M ${x - 4} ${y + 9} L ${x + 4} ${y + 9}`} />
            <path d={`M ${x} ${y + 17} L ${x - 4} ${y + 29}`} />
            <path d={`M ${x} ${y + 17} L ${x + 4} ${y + 29}`} />
        </motion.g>
    );
}

/**
 * Package box that emerges from a window and arcs upward, then fades.
 */
function WindowPackage({ x, y, delay, reduced }) {
    return (
        <motion.g
            strokeWidth="0.9"
            animate={!reduced
                ? { y: [0, -14, -14], opacity: [0, 1, 0] }
                : { y: 0, opacity: 0 }}
            transition={!reduced
                ? {
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeOut',
                    times: [0, 0.45, 1],
                    delay,
                    repeatDelay: 1.2,
                }
                : {}}
        >
            <rect x={x - 4} y={y - 4} width="8" height="8" rx="0.5" />
            <path d={`M ${x - 4} ${y} L ${x + 4} ${y}`} strokeWidth="0.5" />
            <path d={`M ${x} ${y - 4} L ${x} ${y + 4}`} strokeWidth="0.5" />
        </motion.g>
    );
}

/**
 * "+1" text that floats up above a window each time the window fires
 * a package — communicates a counter ticking up. Synced to the window
 * package timing via the same delay.
 */
function PlusOneFloat({ x, y, delay, reduced }) {
    return (
        <motion.g
            animate={!reduced
                ? { y: [0, -22, -22], opacity: [0, 1, 0] }
                : { y: 0, opacity: 0 }}
            transition={!reduced
                ? {
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeOut',
                    times: [0, 0.5, 1],
                    delay,
                    repeatDelay: 1.2,
                }
                : {}}
        >
            <text
                x={x} y={y}
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="6"
                fontWeight="600"
                fill="currentColor"
                stroke="none"
            >
                +1
            </text>
        </motion.g>
    );
}

function FlowerWiggle({ children, originX, originY }) {
    const reduced = useReducedMotion();
    return (
        <motion.g
            animate={!reduced ? { rotate: [-7, 7, -7] } : { rotate: 0 }}
            transition={!reduced
                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                : {}}
            style={{
                transformBox: 'fill-box',
                transformOrigin: `${originX} ${originY}`,
            }}
        >
            {children}
        </motion.g>
    );
}

export default function VisionPanel2Scale() {
    const reduced = useReducedMotion();

    return (
        <svg
            className="vision-v2-shipping-sketch"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* ── Sky layer ───────────────────────────────────────── */}

            {/* Sun disc — pulses */}
            <motion.circle
                cx="32" cy="28" r="5.5" strokeWidth="0.9"
                animate={!reduced ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.8 }}
                transition={!reduced
                    ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            />
            {/* Sun rays — extend/retract via pathLength */}
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
                <path d="M 32 16 L 32 8" />
                <path d="M 32 40 L 32 48" />
                <path d="M 20 28 L 12 28" />
                <path d="M 44 28 L 52 28" />
                <path d="M 23 19 L 17 13" />
                <path d="M 41 19 L 47 13" />
                <path d="M 23 37 L 17 43" />
                <path d="M 41 37 L 47 43" />
            </motion.g>

            {/* Swallow drifting across the sky */}
            <motion.g
                animate={!reduced
                    ? { x: [-20, 380], opacity: [0, 1, 1, 0] }
                    : { x: -100, opacity: 0 }}
                transition={!reduced
                    ? {
                        duration: 6,
                        repeat: Infinity,
                        ease: 'linear',
                        times: [0, 0.1, 0.9, 1],
                        repeatDelay: 1.5,
                    }
                    : {}}
            >
                <path d="M 0 50 Q 4 46, 8 50 Q 12 46, 16 50" strokeWidth="0.7" />
            </motion.g>

            {/* ── Architecture ─────────────────────────────────────── */}

            {/* Ground line */}
            <path d="M 12 200 C 100 202, 280 201, 368 202" strokeWidth="1.2" />

            {/* Awning */}
            <path d="M 50 78 Q 195 22, 340 78" strokeWidth="1.4" />
            <path d="M 50 78 L 340 78" strokeWidth="1" />
            <path d="M 80 60 L 82 78" strokeWidth="0.9" />
            <path d="M 115 48 L 115 78" strokeWidth="0.9" />
            <path d="M 155 41 L 155 78" strokeWidth="0.9" />
            <path d="M 195 38 L 195 78" strokeWidth="0.9" />
            <path d="M 235 41 L 235 78" strokeWidth="0.9" />
            <path d="M 275 48 L 275 78" strokeWidth="0.9" />
            <path d="M 310 60 L 308 78" strokeWidth="0.9" />

            {SCALLOPS_P2.map((d, i) => (
                <ScallopRipple key={i} d={d} idx={i} reduced={reduced} />
            ))}

            {/* Walls */}
            <path d="M 50 82 L 50 200" strokeWidth="1.2" />
            <path d="M 340 82 L 340 200" strokeWidth="1.2" />

            {/* Three service windows */}
            <path d="M 76 100 L 138 100 L 138 142 L 76 142 Z" strokeWidth="1" />
            <path d="M 107 100 L 107 142" strokeWidth="0.7" />
            <path d="M 76 121 L 138 121" strokeWidth="0.7" />

            <path d="M 159 100 L 221 100 L 221 142 L 159 142 Z" strokeWidth="1" />
            <path d="M 190 100 L 190 142" strokeWidth="0.7" />
            <path d="M 159 121 L 221 121" strokeWidth="0.7" />

            <path d="M 242 100 L 304 100 L 304 142 L 242 142 Z" strokeWidth="1" />
            <path d="M 273 100 L 273 142" strokeWidth="0.7" />
            <path d="M 242 121 L 304 121" strokeWidth="0.7" />

            {/* Hanging shop sign — sways */}
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
                <path d="M 195 82 L 195 95" strokeWidth="0.7" />
                <path d="M 175 95 L 215 95 L 215 109 L 175 109 Z" strokeWidth="0.9" rx="2" />
                <path d="M 182 99 L 208 99" strokeWidth="0.6" />
                <path d="M 182 105 L 208 105" strokeWidth="0.6" />
            </motion.g>

            {/* ── Queues ───────────────────────────────────────────── */}

            <StickCustomer x={107} y={155} idx={0} />
            <StickCustomer x={88}  y={157} idx={1} />
            <StickCustomer x={68}  y={159} idx={2} />

            <StickCustomer x={190} y={155} idx={3} />
            <StickCustomer x={171} y={157} idx={4} />
            <StickCustomer x={151} y={159} idx={5} />

            <StickCustomer x={273} y={155} idx={6} />
            <StickCustomer x={254} y={157} idx={7} />
            <StickCustomer x={234} y={159} idx={8} />

            {/* ── Packages + counter ticks per window ──────────────── */}
            <WindowPackage  x={107} y={132} delay={0}   reduced={reduced} />
            <PlusOneFloat   x={107} y={96}  delay={0}   reduced={reduced} />
            <WindowPackage  x={190} y={132} delay={0.5} reduced={reduced} />
            <PlusOneFloat   x={190} y={96}  delay={0.5} reduced={reduced} />
            <WindowPackage  x={273} y={132} delay={1.0} reduced={reduced} />
            <PlusOneFloat   x={273} y={96}  delay={1.0} reduced={reduced} />

            {/* ── Arriving customer (right → joins queue 3) ────────── */}
            <motion.g
                animate={!reduced
                    ? { x: [0, -50], opacity: [0, 1, 1, 0] }
                    : { x: 0, opacity: 0 }}
                transition={!reduced
                    ? {
                        duration: 4.5,
                        repeat: Infinity,
                        ease: 'linear',
                        times: [0, 0.18, 0.85, 1],
                        repeatDelay: 1.2,
                    }
                    : {}}
            >
                <motion.g
                    strokeWidth="1"
                    animate={!reduced ? { y: [0, -1.4, 0] } : { y: 0 }}
                    transition={!reduced
                        ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut' }
                        : {}}
                >
                    <circle cx="358" cy="158" r="3" />
                    <path d="M 358 161 L 358 175" />
                    <path d="M 354 167 L 362 167" />
                    <path d="M 358 175 L 354 187" />
                    <path d="M 358 175 L 362 187" />
                </motion.g>
            </motion.g>

            {/* ── Departing customer (left, carrying package) ──────── */}
            <motion.g
                animate={!reduced
                    ? { x: [0, -55], opacity: [0, 1, 1, 0] }
                    : { x: 0, opacity: 0 }}
                transition={!reduced
                    ? {
                        duration: 5,
                        repeat: Infinity,
                        ease: 'linear',
                        times: [0, 0.15, 0.85, 1],
                        repeatDelay: 1.5,
                        delay: 2,
                    }
                    : {}}
            >
                <motion.g
                    strokeWidth="1"
                    animate={!reduced ? { y: [0, -1.4, 0] } : { y: 0 }}
                    transition={!reduced
                        ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                        : {}}
                >
                    <circle cx="48" cy="158" r="3" />
                    <path d="M 48 161 L 48 175" />
                    <path d="M 44 167 L 52 167" />
                    <path d="M 48 175 L 44 187" />
                    <path d="M 48 175 L 52 187" />
                    {/* Package being carried */}
                    <rect x="38" y="164" width="6" height="5" strokeWidth="0.7" />
                    <path d="M 38 166.5 L 44 166.5" strokeWidth="0.4" />
                    <path d="M 41 164 L 41 169" strokeWidth="0.4" />
                </motion.g>
            </motion.g>

            {/* ── Flowerpots ───────────────────────────────────────── */}

            <path d="M 318 180 L 328 180 L 326 198 L 320 198 Z" strokeWidth="0.8" />
            <FlowerWiggle originX="50%" originY="100%">
                <path d="M 321 180 Q 321 172, 323 168" strokeWidth="0.7" />
                <path d="M 325 180 Q 326 174, 328 172" strokeWidth="0.7" />
                <circle cx="322.5" cy="168" r="1.8" strokeWidth="0.7" />
                <circle cx="328"   cy="172" r="1.5" strokeWidth="0.7" />
            </FlowerWiggle>

            <path d="M 22 180 L 32 180 L 30 198 L 24 198 Z" strokeWidth="0.8" />
            <FlowerWiggle originX="50%" originY="100%">
                <path d="M 25 180 Q 25 172, 27 168" strokeWidth="0.7" />
                <path d="M 29 180 Q 30 174, 32 172" strokeWidth="0.7" />
                <circle cx="26.5" cy="168" r="1.8" strokeWidth="0.7" />
                <circle cx="32"   cy="172" r="1.5" strokeWidth="0.7" />
            </FlowerWiggle>
        </svg>
    );
}
