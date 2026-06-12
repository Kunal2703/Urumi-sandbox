/**
 * VisionPanelByoAI — Storefront Panorama interlude: "Bring your AI"
 *
 * Slots between the Three AIs section (Panels 4–6) and Panel 7 (Bridge).
 * Communicates the BYO-AI / MCP story: the merchant plugs their
 * existing AI subscription (Claude / ChatGPT / Gemini) into a port
 * on the URUMI mark, and the platform routes through it.
 *
 * Same hand-drawn pen-line aesthetic as the rest of the panorama.
 *
 * Animation:
 *   - Active "AI subscription card" cycles every 3s through CLAUDE
 *     → CHATGPT → GEMINI. Card name crossfades on swap.
 *   - Data dots travel along the cable from the MCP port to the
 *     active card (continuous flow).
 *   - URUMI mark dot pulses (continuity with Panel 3).
 *   - "MCP · LIVE" indicator pulses green dot beside the socket.
 *   - Sun + flowers + sign sway + merchant breathing for ambient
 *     continuity with the rest of the panorama.
 *
 * prefers-reduced-motion freezes everything to a coherent still
 * frame (Claude shown plugged in, no cable flow).
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const AI_SUBSCRIPTIONS = ['CLAUDE', 'CHATGPT', 'GEMINI'];
const CARD_DURATION_MS = 3000;

const LOGO_X = 22;
const LOGO_Y = 22;

// Three "data dots" that travel along the cable from MCP port to the
// active card. Each starts at a different phase so they spread along
// the cable instead of bunching up.
const DATA_DOTS = [
    { delay: 0    },
    { delay: 0.7  },
    { delay: 1.4  },
];

export default function VisionPanelByoAI() {
    const reduced = useReducedMotion();
    const [cardIdx, setCardIdx] = useState(0);

    useEffect(() => {
        if (reduced) return;
        const id = setInterval(
            () => setCardIdx((i) => (i + 1) % AI_SUBSCRIPTIONS.length),
            CARD_DURATION_MS,
        );
        return () => clearInterval(id);
    }, [reduced]);

    return (
        <svg
            className="vision-v2-byoai-sketch"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* ── Sky layer ───────────────────────────────────────── */}

            {/* Sun + rays in top-right (URUMI owns top-left). */}
            <motion.circle
                cx="358" cy="28" r="5.5" strokeWidth="0.9"
                animate={!reduced ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.8 }}
                transition={!reduced
                    ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            />
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
                <path d="M 358 16 L 358 8" />
                <path d="M 358 40 L 358 48" />
                <path d="M 346 28 L 338 28" />
                <path d="M 370 28 L 378 28" />
                <path d="M 349 19 L 343 13" />
                <path d="M 367 19 L 373 13" />
                <path d="M 349 37 L 343 43" />
                <path d="M 367 37 L 373 43" />
            </motion.g>

            {/* ── URUMI mark + MCP port ────────────────────────────── */}

            <g>
                <motion.circle
                    cx={LOGO_X} cy={LOGO_Y} r="3"
                    fill="currentColor" stroke="none"
                    animate={!reduced
                        ? { scale: [1, 1.2, 1], opacity: [0.85, 1, 0.85] }
                        : { scale: 1, opacity: 1 }}
                    transition={!reduced
                        ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                        : {}}
                    style={{
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                    }}
                />
                <text
                    x={LOGO_X + 8}
                    y={LOGO_Y + 3}
                    fontSize="7"
                    fontFamily="JetBrains Mono, monospace"
                    fill="currentColor"
                    stroke="none"
                    letterSpacing="0.08em"
                >
                    URUMI
                </text>
            </g>

            {/* MCP socket — a small rectangular port with pins, sits
                to the right of the URUMI text. */}
            <g>
                {/* Socket frame */}
                <path d="M 78 16 L 124 16 L 124 30 L 78 30 Z" strokeWidth="0.9" />
                {/* Socket pin slots (the contacts inside the port) */}
                <path d="M 86 20 L 86 26" strokeWidth="0.6" />
                <path d="M 92 20 L 92 26" strokeWidth="0.6" />
                <path d="M 98 20 L 98 26" strokeWidth="0.6" />
                <path d="M 104 20 L 104 26" strokeWidth="0.6" />
                <path d="M 110 20 L 110 26" strokeWidth="0.6" />
                {/* MCP label */}
                <text x="80" y="40" fontSize="5" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.08em">
                    MCP · OPEN
                </text>
                {/* LIVE indicator — green dot + pulse */}
                <motion.circle
                    cx="132" cy="23" r="1.8"
                    fill="currentColor" stroke="none"
                    animate={!reduced
                        ? { opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }
                        : { opacity: 0.9, scale: 1 }}
                    transition={!reduced
                        ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                        : {}}
                    style={{
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                    }}
                />
                <text x="138" y="26" fontSize="5" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.08em">
                    LIVE
                </text>
            </g>

            {/* ── Cable from MCP port to the active AI card ──────── */}
            {/* Curves from socket exit (x=124, y=23) down to the
                card's left connector (x=220, y=88). */}
            <path
                d="M 124 23 C 160 23, 180 60, 220 88"
                strokeWidth="1.1"
                strokeDasharray="2 3"
            />

            {/* Data dots travelling along the cable, MCP → card */}
            {DATA_DOTS.map((dot, i) => (
                <motion.circle
                    key={`dot-${i}`}
                    r="1.6"
                    fill="currentColor" stroke="none"
                    animate={!reduced
                        ? {
                            offsetDistance: ['0%', '100%'],
                            opacity: [0, 1, 1, 0],
                        }
                        : { offsetDistance: '0%', opacity: 0 }}
                    transition={!reduced
                        ? {
                            duration: 2.1,
                            repeat: Infinity,
                            ease: 'linear',
                            times: [0, 0.05, 0.95, 1],
                            delay: dot.delay,
                        }
                        : {}}
                    style={{
                        offsetPath: 'path("M 124 23 C 160 23, 180 60, 220 88")',
                        offsetRotate: '0deg',
                    }}
                />
            ))}

            {/* ── AI subscription cards ────────────────────────────── */}

            {/* Stack of inactive cards peeking out behind the active */}
            <path d="M 234 76 L 314 76 L 314 116 L 234 116 Z" strokeWidth="0.8" />
            <path d="M 228 80 L 308 80 L 308 120 L 228 120 Z" strokeWidth="0.8" />

            {/* Active card frame */}
            <g>
                <path d="M 220 84 L 304 84 L 304 124 L 220 124 Z" strokeWidth="1.1" />
                {/* Connector pin sticking out the left edge — plugs
                    into the cable arriving from the MCP socket. */}
                <path d="M 220 92 L 214 92" strokeWidth="0.9" />
                <path d="M 220 96 L 214 96" strokeWidth="0.9" />

                {/* Card header: "subscription · active" */}
                <text x="226" y="94" fontSize="4.5" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none" letterSpacing="0.08em">
                    SUBSCRIPTION · ACTIVE
                </text>
                <path d="M 226 98 L 298 98" strokeWidth="0.3" />

                {/* Card name — crossfades between Claude / ChatGPT /
                    Gemini on the 3s cycle. AnimatePresence handles
                    the swap so old fades out as new fades in. */}
                <AnimatePresence mode="wait">
                    <motion.text
                        key={AI_SUBSCRIPTIONS[cardIdx]}
                        x="262" y="116"
                        textAnchor="middle"
                        fontSize="14"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight="700"
                        fill="currentColor"
                        stroke="none"
                        letterSpacing="0.1em"
                        initial={{ opacity: 0, y: 122 }}
                        animate={{ opacity: 1, y: 116 }}
                        exit={{ opacity: 0, y: 110 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        {AI_SUBSCRIPTIONS[cardIdx]}
                    </motion.text>
                </AnimatePresence>
            </g>

            {/* ── Shop facade continuity (compressed) ──────────────── */}
            {/* Awning — wider arc, narrower height so it fits below
                the AI section. */}
            <path d="M 50 152 Q 195 130, 340 152" strokeWidth="1.2" />
            <path d="M 50 152 L 340 152" strokeWidth="0.9" />

            {/* Walls */}
            <path d="M 50 154 L 50 200" strokeWidth="1.1" />
            <path d="M 340 154 L 340 200" strokeWidth="1.1" />

            {/* Three windows (compressed height) */}
            <path d="M 76 158 L 138 158 L 138 184 L 76 184 Z" strokeWidth="0.9" />
            <path d="M 159 158 L 221 158 L 221 184 L 159 184 Z" strokeWidth="0.9" />
            <path d="M 242 158 L 304 158 L 304 184 L 242 184 Z" strokeWidth="0.9" />

            {/* Merchant in middle window — breathing, looking up at
                the MCP port. */}
            <motion.g
                strokeWidth="1"
                animate={!reduced ? { y: [0, -1.5, 0] } : { y: 0 }}
                transition={!reduced
                    ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
            >
                <circle cx="190" cy="166" r="2.8" />
                <path d="M 190 169 L 190 180" />
                <path d="M 186 174 L 194 174" />
            </motion.g>

            {/* Hanging shop sign below the awning peak — sways */}
            <motion.g
                animate={!reduced ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
                transition={!reduced
                    ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                    : {}}
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'top center',
                }}
            >
                <path d="M 195 152 L 195 140" strokeWidth="0.6" />
                <path d="M 178 140 L 212 140 L 212 130 L 178 130 Z" strokeWidth="0.8" />
                <text x="195" y="137" textAnchor="middle" fontSize="4.5" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="none">
                    BYO · AI
                </text>
            </motion.g>

            {/* ── Floor + flowerpot ────────────────────────────────── */}
            <path d="M 12 200 C 100 202, 280 201, 368 202" strokeWidth="1.2" />

            <path d="M 318 184 L 330 184 L 328 200 L 320 200 Z" strokeWidth="0.8" />
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
                <path d="M 321 184 Q 320 178, 322 174" strokeWidth="0.7" />
                <path d="M 326 184 Q 327 176, 329 173" strokeWidth="0.7" />
                <circle cx="322"   cy="174" r="1.6" strokeWidth="0.7" />
                <circle cx="328.5" cy="173" r="1.4" strokeWidth="0.7" />
            </motion.g>
        </svg>
    );
}
