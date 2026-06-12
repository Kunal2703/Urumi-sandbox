/**
 * WooPanel4Gruum — Operations Panorama, Panel 4: "Peak day, all green"
 *
 * What the ops floor looks like during one of grüum's peak weeks: a
 * sustained-high traffic line, no incidents, three operators present
 * but calm.
 *
 * Layers:
 *   - Wide status board on the back wall reading "0 INCIDENTS"
 *   - Big chart frame with a sustained-high traffic line that subtly
 *     breathes (small wave on top of a high baseline — not a spike,
 *     it's *holding* up there)
 *   - Three operator silhouettes at the desk, each with a small
 *     idle bob on its own stagger
 *   - Three monitors above the operators, screens flicker on their
 *     own beats
 *   - "PEAK WEEK" stamp pulses below the board
 *   - Floor + potted plant continuity
 */

import { motion, useReducedMotion } from 'framer-motion';

const OPERATORS = [
    { x: 88,  delay: 0    },
    { x: 188, delay: 0.45 },
    { x: 288, delay: 0.85 },
];

const SCREEN_DELAYS = [0, 0.6, 1.2];

export default function WooPanel4Gruum() {
    const reduced = useReducedMotion();

    return (
        <svg
            className="woo-v2-gruum-vignette"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* ── Back wall: status board "0 INCIDENTS" ────────────── */}
            <path d="M 30 14 L 350 14 L 350 50 L 30 50 Z" strokeWidth="1.1" />
            <text x="42" y="28" fontSize="5" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.06em">
                STATUS BOARD · grüum · 30d
            </text>
            <motion.text
                x="120" y="44"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
                fill="currentColor"
                stroke="none"
                letterSpacing="0.12em"
                animate={!reduced ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
                transition={!reduced
                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            >
                0 INCIDENTS · 99.99% UP
            </motion.text>

            {/* ── Big traffic chart on the wall (right of board) ──── */}
            {/* Chart background frame removed in favor of an inline
                "ribbon" shape that the line tucks into. */}
            <path d="M 30 60 L 350 60" strokeWidth="0.5" strokeDasharray="2 4" />
            <path d="M 30 100 L 350 100" strokeWidth="0.5" strokeDasharray="2 4" />

            {/* Sustained-high traffic line — base shape is high (small
                amplitude, around y=70). Subtle vertical breathing
                animation makes the whole line feel "live". */}
            <motion.path
                d="M 30 78 L 60 72 L 90 76 L 120 70 L 150 74 L 180 68 L 210 72 L 240 70 L 270 74 L 300 70 L 330 72 L 350 70"
                strokeWidth="1.3"
                animate={!reduced ? { y: [0, -2, 0, 2, 0] } : { y: 0 }}
                transition={!reduced
                    ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            />
            <text x="30" y="56" fontSize="5" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.05em">
                req/day · sustained · peak week
            </text>

            {/* ── Three monitors above the desk, flickering ─────────── */}
            {OPERATORS.map((op, i) => (
                <g key={`mon-${i}`}>
                    <path d={`M ${op.x - 22} 110 L ${op.x + 22} 110 L ${op.x + 22} 142 L ${op.x - 22} 142 Z`} strokeWidth="0.9" />
                    <motion.rect
                        x={op.x - 19} y="113" width="38" height="26" rx="0.5"
                        strokeWidth="0.4"
                        animate={!reduced ? { opacity: [0.55, 1, 0.55] } : { opacity: 0.85 }}
                        transition={!reduced
                            ? {
                                duration: 1.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: SCREEN_DELAYS[i],
                            }
                            : {}}
                    />
                    {/* Tiny content lines on each screen */}
                    <path d={`M ${op.x - 16} 122 L ${op.x + 16} 122`} strokeWidth="0.4" />
                    <path d={`M ${op.x - 16} 128 L ${op.x + 12} 128`} strokeWidth="0.4" />
                    <path d={`M ${op.x - 16} 134 L ${op.x + 16} 134`} strokeWidth="0.4" />
                    {/* Stand */}
                    <path d={`M ${op.x} 142 L ${op.x} 152`} strokeWidth="0.7" />
                    <path d={`M ${op.x - 8} 154 L ${op.x + 8} 154`} strokeWidth="0.7" />
                </g>
            ))}

            {/* ── Desk surface ─────────────────────────────────────── */}
            <path d="M 20 168 L 360 168" strokeWidth="1.2" />
            <path d="M 20 168 L 20 178" strokeWidth="0.7" />
            <path d="M 360 168 L 360 178" strokeWidth="0.7" />
            <path d="M 20 178 L 360 178" strokeWidth="0.7" />

            {/* ── Three operators at the desk ──────────────────────── */}
            {OPERATORS.map((op, i) => (
                <motion.g
                    key={`op-${i}`}
                    strokeWidth="1"
                    animate={!reduced ? { y: [0, -1.2, 0] } : { y: 0 }}
                    transition={!reduced
                        ? {
                            duration: 2.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: op.delay,
                        }
                        : {}}
                >
                    {/* Head */}
                    <circle cx={op.x} cy="156" r="3.5" />
                    {/* Shoulders peeking above the desk */}
                    <path d={`M ${op.x - 8} 168 Q ${op.x} 162, ${op.x + 8} 168`} strokeWidth="0.9" />
                </motion.g>
            ))}

            {/* ── "PEAK WEEK" stamp under the desk ─────────────────── */}
            <motion.g
                animate={!reduced ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.9 }}
                transition={!reduced
                    ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            >
                <path d="M 152 184 L 228 184 L 228 196 L 152 196 Z" strokeWidth="0.9" />
                <text x="160" y="193" fontSize="6" fontFamily="JetBrains Mono, monospace" fontWeight="600" fill="currentColor" stroke="none" letterSpacing="0.08em">
                    PEAK WEEK · HOLDING
                </text>
            </motion.g>

            {/* Floor */}
            <path d="M 12 210 C 100 212, 280 211, 368 212" strokeWidth="1.2" />

            {/* Potted plant in the corner */}
            <path d="M 30 196 L 42 196 L 40 210 L 32 210 Z" strokeWidth="0.8" />
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
                <path d="M 33 196 Q 32 190, 34 186" strokeWidth="0.7" />
                <path d="M 38 196 Q 39 188, 41 185" strokeWidth="0.7" />
                <circle cx="34"   cy="186" r="1.6" strokeWidth="0.7" />
                <circle cx="40.5" cy="185" r="1.4" strokeWidth="0.7" />
            </motion.g>
        </svg>
    );
}
