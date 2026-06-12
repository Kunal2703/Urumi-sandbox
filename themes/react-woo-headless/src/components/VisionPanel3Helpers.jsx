/**
 * VisionPanel3Helpers — Storefront Panorama, Panel 3: "Three helpers arrive"
 *
 * Picks up Panel 2's wide shop. Three bots fan from the URUMI mark down
 * to the awning above each window — visually committing to the "Three
 * AIs" count. Then the scene KEEPS LIVING: bots idle, antennae pulse,
 * eyes blink, the customer at each window bobs while being served, the
 * sign sways, the awning scallops ripple. The arrival cycle then loops
 * (~6s), so a casual viewer always sees motion.
 *
 * Two systems run in parallel:
 *
 *   1. Phase machine (arrival choreography, ~5.9s loop):
 *        Phase 0 (800ms)  — quiet, mark sits alone
 *        Phase 1 (800ms)  — three dashed beams fan out from URUMI mark
 *                           to landing spots above each window
 *        Phase 2 (1200ms) — three bots slide down their beams (stagger)
 *        Phase 3 (500ms)  — merchant nods once
 *        Phase 4 (600ms)  — beams fade
 *        Phase 5 (2000ms) — bots rest, then the cycle restarts
 *
 *   2. Continuous ambient loops (independent of phase):
 *        - URUMI mark pulses
 *        - Sun + rays in top-right pulse and rays extend/retract
 *        - Swallow drifts across the sky
 *        - Awning scallops ripple in a wave
 *        - Hanging sign sways
 *        - Merchant breathes (between explicit nods)
 *        - One customer per window bobs (being served)
 *        - Bots: antenna LEDs pulse in a wave, eyes blink, idle bob
 *        - Two flowerpots wiggle (left + right)
 *
 * prefers-reduced-motion freezes everything to a coherent still frame
 * (bots already on the roof, no beams, no pulses).
 */

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PHASE_DURATIONS_MS = [800, 800, 1200, 500, 600, 2000];

const LOGO_X = 22;
const LOGO_Y = 22;

const BOT_LANDINGS = [
    { x: 95,  y: 38 },
    { x: 183, y: 24 },
    { x: 271, y: 38 },
];

const BOT_STAGGER = [0, 0.12, 0.24];

// Awning scallops, left → right. Reused from Panel 2 — same shop.
const SCALLOPS_P3 = [
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
                    delay: (idx / SCALLOPS_P3.length) * 2,
                }
                : {}}
        />
    );
}

function ServedCustomer({ x, y, idx, reduced }) {
    return (
        <motion.g
            strokeWidth="1"
            animate={!reduced ? { y: [0, -2, 0] } : { y: 0 }}
            transition={!reduced
                ? {
                    duration: 1.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: idx * 0.35,
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

/**
 * One AI helper. Outer motion.g handles the arrival slide (driven by
 * the phase machine). Inner motion.g handles the continuous idle bob
 * so the bot is never frozen. Antenna LED pulses with stagger across
 * the three bots so the row reads as a wave. Eyes blink occasionally.
 */
function Bot({ landing, idx, phase, botsVisible, reduced }) {
    return (
        <motion.g
            initial={{
                x: LOGO_X - 8,
                y: LOGO_Y - 4,
                opacity: 0,
            }}
            animate={{
                x: botsVisible ? landing.x - 8 : LOGO_X - 8,
                y: botsVisible ? landing.y - 14 : LOGO_Y - 4,
                opacity: botsVisible ? 1 : 0,
            }}
            transition={{
                x: {
                    duration: phase === 2 ? 0.95 : 0.001,
                    delay: phase === 2 ? BOT_STAGGER[idx] : 0,
                    ease: [0.65, 0, 0.35, 1],
                },
                y: {
                    duration: phase === 2 ? 0.95 : 0.001,
                    delay: phase === 2 ? BOT_STAGGER[idx] : 0,
                    ease: [0.65, 0, 0.35, 1],
                },
                opacity: {
                    duration: 0.2,
                    delay: phase === 2 ? BOT_STAGGER[idx] : 0,
                },
            }}
        >
            {/* Idle bob — tiny vertical breathe, runs continuously */}
            <motion.g
                animate={!reduced ? { y: [0, -1, 0] } : { y: 0 }}
                transition={!reduced
                    ? {
                        duration: 2.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: idx * 0.4,
                    }
                    : {}}
            >
                {/* Antenna stalk */}
                <path d="M 8 -6 L 8 -11" strokeWidth="0.9" />
                {/* Antenna LED — pulses scale + opacity, staggered across
                    the three bots so the row reads as a wave. */}
                <motion.circle
                    cx="8" cy="-12.5" r="1.2"
                    fill="currentColor" stroke="none"
                    animate={!reduced
                        ? { opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }
                        : { opacity: 1, scale: 1 }}
                    transition={!reduced
                        ? {
                            duration: 1.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: idx * 0.4,
                        }
                        : {}}
                    style={{
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                    }}
                />
                {/* Head */}
                <path d="M 0 -6 L 16 -6 L 16 8 L 0 8 Z" strokeWidth="1.3" />
                {/* Eyes — blink (squash to a slit) on a long, irregular beat */}
                <motion.circle
                    cx="5" cy="0" r="1.2"
                    fill="currentColor" stroke="none"
                    animate={!reduced ? { scaleY: [1, 0.1, 1] } : { scaleY: 1 }}
                    transition={!reduced
                        ? {
                            duration: 0.25,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            repeatDelay: 4 + idx * 0.7,
                        }
                        : {}}
                    style={{
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                    }}
                />
                <motion.circle
                    cx="11" cy="0" r="1.2"
                    fill="currentColor" stroke="none"
                    animate={!reduced ? { scaleY: [1, 0.1, 1] } : { scaleY: 1 }}
                    transition={!reduced
                        ? {
                            duration: 0.25,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            repeatDelay: 4 + idx * 0.7,
                        }
                        : {}}
                    style={{
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                    }}
                />
                {/* Mouth */}
                <path d="M 5 4 L 11 4" strokeWidth="0.7" />
                {/* Side bolts */}
                <path d="M 0 1 L -1.5 1" strokeWidth="0.6" />
                <path d="M 16 1 L 17.5 1" strokeWidth="0.6" />
            </motion.g>
        </motion.g>
    );
}

export default function VisionPanel3Helpers() {
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

    const beamsVisible    = phase >= 1 && phase < 4;
    const beamsFading     = phase === 4;
    const botsVisible     = phase >= 2;
    const merchantNodding = phase === 3;

    return (
        <svg
            className="vision-v2-helpers-sketch"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* ── Sky layer ───────────────────────────────────────── */}

            {/* Sun in top-RIGHT (URUMI mark already owns top-left). */}
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

            {/* Swallow — drifts right → left so it doesn't compete
                with the URUMI mark's left-side energy. */}
            <motion.g
                animate={!reduced
                    ? { x: [0, -380], opacity: [0, 1, 1, 0] }
                    : { x: 0, opacity: 0 }}
                transition={!reduced
                    ? {
                        duration: 6.5,
                        repeat: Infinity,
                        ease: 'linear',
                        times: [0, 0.1, 0.9, 1],
                        repeatDelay: 1.6,
                    }
                    : {}}
            >
                <path d="M 376 56 Q 372 52, 368 56 Q 364 52, 360 56" strokeWidth="0.7" />
            </motion.g>

            {/* ── URUMI mark + arrival beams ───────────────────────── */}

            <g>
                {/* Mark dot pulses softly — so the mark feels alive
                    even when no bots are launching. */}
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

            {BOT_LANDINGS.map((landing, i) => (
                <motion.line
                    key={`beam-${i}`}
                    x1={LOGO_X}
                    y1={LOGO_Y + 6}
                    x2={landing.x}
                    y2={landing.y}
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeDasharray="2 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: beamsVisible || beamsFading ? 1 : 0,
                        opacity:    beamsVisible ? 1 : 0,
                    }}
                    transition={{
                        pathLength: {
                            duration: 0.6,
                            delay: BOT_STAGGER[i],
                            ease: [0.16, 1, 0.3, 1],
                        },
                        opacity: {
                            duration: beamsFading ? 0.6 : 0.3,
                            ease: [0.4, 0, 0.6, 1],
                        },
                    }}
                />
            ))}

            {/* ── Architecture ─────────────────────────────────────── */}

            {/* Ground */}
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

            {SCALLOPS_P3.map((d, i) => (
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

            {/* Hanging sign — sways */}
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
                <path d="M 175 95 L 215 95 L 215 109 L 175 109 Z" strokeWidth="0.9" />
                <path d="M 182 99 L 208 99" strokeWidth="0.6" />
                <path d="M 182 105 L 208 105" strokeWidth="0.6" />
            </motion.g>

            {/* Merchant in middle window. Two animation modes:
                  - During phase 3, an explicit nod (acknowledges the bots).
                  - Otherwise, a continuous breathing bob. */}
            <motion.g
                strokeWidth="1"
                animate={merchantNodding
                    ? { y: [0, -2, 0] }
                    : !reduced ? { y: [0, -1.5, 0] } : { y: 0 }}
                transition={merchantNodding
                    ? { duration: 0.4, ease: 'easeInOut' }
                    : !reduced
                        ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                        : {}}
            >
                <circle cx="190" cy="116" r="2.8" />
                <path d="M 190 119 L 190 132" />
                <path d="M 186 124 L 194 124" />
                <path d="M 190 132 L 186 142" />
                <path d="M 190 132 L 194 142" />
            </motion.g>

            {/* One customer per window — being served. Bobs while
                waiting at the counter. */}
            <ServedCustomer x={95}  y={155} idx={0} reduced={reduced} />
            <ServedCustomer x={183} y={155} idx={1} reduced={reduced} />
            <ServedCustomer x={271} y={155} idx={2} reduced={reduced} />

            {/* Three AI helpers on the roof */}
            {BOT_LANDINGS.map((landing, i) => (
                <Bot
                    key={`bot-${i}`}
                    landing={landing}
                    idx={i}
                    phase={phase}
                    botsVisible={botsVisible}
                    reduced={reduced}
                />
            ))}

            {/* ── Flowerpots ───────────────────────────────────────── */}

            {/* Left flowerpot */}
            <path d="M 22 180 L 32 180 L 30 198 L 24 198 Z" strokeWidth="0.8" />
            <FlowerWiggle originX="50%" originY="100%">
                <path d="M 25 180 Q 25 172, 27 168" strokeWidth="0.7" />
                <path d="M 29 180 Q 30 174, 32 172" strokeWidth="0.7" />
                <circle cx="26.5" cy="168" r="1.8" strokeWidth="0.7" />
                <circle cx="32"   cy="172" r="1.5" strokeWidth="0.7" />
            </FlowerWiggle>

            {/* Right flowerpot — continuity from Panels 1 + 2 */}
            <path d="M 318 180 L 328 180 L 326 198 L 320 198 Z" strokeWidth="0.8" />
            <FlowerWiggle originX="50%" originY="100%">
                <path d="M 321 180 Q 321 172, 323 168" strokeWidth="0.7" />
                <path d="M 325 180 Q 326 174, 328 172" strokeWidth="0.7" />
                <circle cx="322.5" cy="168" r="1.8" strokeWidth="0.7" />
                <circle cx="328"   cy="172" r="1.5" strokeWidth="0.7" />
            </FlowerWiggle>
        </svg>
    );
}
