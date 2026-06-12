/**
 * VisionPanel7Bridge — Storefront Panorama, Panel 7: "Vision bridge"
 *
 * Section: "We believe stores should run themselves. These three AIs
 * are the start." The visual: the same wide 3-window shop, fully
 * staffed and humming. Three robots at their stations. Merchant
 * sitting in a chair outside, completely relaxed. Sun rays from
 * above. The flowerpot now in bloom (continuity payoff).
 *
 * Subtle continuous motion: each robot has its own tiny independent
 * animation. The merchant rocks gently in the chair. Sun rays pulse
 * softly. No phase machine — it's a single ambient continuous scene.
 *
 * prefers-reduced-motion freezes everything; static composition is
 * still rich.
 */

import { motion, useReducedMotion } from 'framer-motion';

export default function VisionPanel7Bridge() {
    const reduced = useReducedMotion();

    return (
        <svg
            className="vision-v2-bridge-sketch"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Sun rays from top-right corner — pulse subtly */}
            <motion.g
                strokeWidth="0.7"
                animate={!reduced ? { opacity: [0.4, 0.7, 0.4] } : { opacity: 0.55 }}
                transition={!reduced ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
                <circle cx="350" cy="14" r="6" strokeWidth="1" />
                <path d="M 350 0 L 350 4" />
                <path d="M 350 24 L 350 28" />
                <path d="M 336 14 L 340 14" />
                <path d="M 360 14 L 364 14" />
                <path d="M 340 4 L 343 7" />
                <path d="M 357 21 L 360 24" />
                <path d="M 360 4 L 357 7" />
                <path d="M 340 24 L 343 21" />
            </motion.g>

            {/* Awning + scallops */}
            <path d="M 24 78 Q 195 22, 366 78" strokeWidth="1.4" />
            <path d="M 24 78 L 366 78" strokeWidth="1" />
            {/* Awning stripes */}
            <path d="M 60 60 L 62 78" strokeWidth="0.9" />
            <path d="M 100 50 L 100 78" strokeWidth="0.9" />
            <path d="M 145 42 L 145 78" strokeWidth="0.9" />
            <path d="M 195 38 L 195 78" strokeWidth="0.9" />
            <path d="M 245 42 L 245 78" strokeWidth="0.9" />
            <path d="M 290 50 L 290 78" strokeWidth="0.9" />
            <path d="M 330 60 L 328 78" strokeWidth="0.9" />
            {/* Awning scallops (sparse) */}
            <path d="M 28 78 Q 35 84, 42 78" strokeWidth="0.9" />
            <path d="M 50 78 Q 57 84, 64 78" strokeWidth="0.9" />
            <path d="M 70 78 Q 77 84, 84 78" strokeWidth="0.9" />
            <path d="M 90 78 Q 97 84, 104 78" strokeWidth="0.9" />
            <path d="M 110 78 Q 117 84, 124 78" strokeWidth="0.9" />
            <path d="M 130 78 Q 137 84, 144 78" strokeWidth="0.9" />
            <path d="M 150 78 Q 157 84, 164 78" strokeWidth="0.9" />
            <path d="M 170 78 Q 177 84, 184 78" strokeWidth="0.9" />
            <path d="M 190 78 Q 197 84, 204 78" strokeWidth="0.9" />
            <path d="M 210 78 Q 217 84, 224 78" strokeWidth="0.9" />
            <path d="M 230 78 Q 237 84, 244 78" strokeWidth="0.9" />
            <path d="M 250 78 Q 257 84, 264 78" strokeWidth="0.9" />
            <path d="M 270 78 Q 277 84, 284 78" strokeWidth="0.9" />
            <path d="M 290 78 Q 297 84, 304 78" strokeWidth="0.9" />
            <path d="M 310 78 Q 317 84, 324 78" strokeWidth="0.9" />
            <path d="M 330 78 Q 337 84, 344 78" strokeWidth="0.9" />
            <path d="M 350 78 Q 357 84, 364 78" strokeWidth="0.9" />

            {/* Walls */}
            <path d="M 24 82 L 24 198" strokeWidth="1.2" />
            <path d="M 366 82 L 366 198" strokeWidth="1.2" />

            {/* Three windows — each with a robot inside */}
            {/* Window 1 — Builder bot */}
            <path d="M 50 100 L 110 100 L 110 142 L 50 142 Z" strokeWidth="1" />
            <path d="M 80 100 L 80 142" strokeWidth="0.7" />
            <path d="M 50 121 L 110 121" strokeWidth="0.7" />
            <g transform="translate(72, 124)" strokeWidth="0.9">
                <path d="M 8 -6 L 8 -10" strokeWidth="0.7" />
                <circle cx="8" cy="-11" r="1" fill="currentColor" stroke="none" />
                <path d="M 0 -6 L 16 -6 L 16 8 L 0 8 Z" strokeWidth="1" />
                <circle cx="5" cy="-1" r="1.1" fill="currentColor" stroke="none" />
                <circle cx="11" cy="-1" r="1.1" fill="currentColor" stroke="none" />
                <path d="M 5 4 L 11 4" strokeWidth="0.6" />
            </g>

            {/* Window 2 (middle) — Revenue bot */}
            <path d="M 160 100 L 220 100 L 220 142 L 160 142 Z" strokeWidth="1" />
            <path d="M 190 100 L 190 142" strokeWidth="0.7" />
            <path d="M 160 121 L 220 121" strokeWidth="0.7" />
            <g transform="translate(182, 124)" strokeWidth="0.9">
                <path d="M 8 -6 L 8 -10" strokeWidth="0.7" />
                <circle cx="8" cy="-11" r="1" fill="currentColor" stroke="none" />
                <path d="M 0 -6 L 16 -6 L 16 8 L 0 8 Z" strokeWidth="1" />
                <circle cx="5" cy="-1" r="1.1" fill="currentColor" stroke="none" />
                <circle cx="11" cy="-1" r="1.1" fill="currentColor" stroke="none" />
                <path d="M 5 4 L 11 4" strokeWidth="0.6" />
            </g>

            {/* Window 3 — Analytics bot */}
            <path d="M 270 100 L 330 100 L 330 142 L 270 142 Z" strokeWidth="1" />
            <path d="M 300 100 L 300 142" strokeWidth="0.7" />
            <path d="M 270 121 L 330 121" strokeWidth="0.7" />
            <g transform="translate(292, 124)" strokeWidth="0.9">
                <path d="M 8 -6 L 8 -10" strokeWidth="0.7" />
                <circle cx="8" cy="-11" r="1" fill="currentColor" stroke="none" />
                <path d="M 0 -6 L 16 -6 L 16 8 L 0 8 Z" strokeWidth="1" />
                <circle cx="5" cy="-1" r="1.1" fill="currentColor" stroke="none" />
                <circle cx="11" cy="-1" r="1.1" fill="currentColor" stroke="none" />
                <path d="M 5 4 L 11 4" strokeWidth="0.6" />
            </g>

            {/* Hanging shop sign */}
            <path d="M 195 82 L 195 95" strokeWidth="0.7" />
            <path d="M 175 95 L 215 95 L 215 109 L 175 109 Z" strokeWidth="0.9" />
            <path d="M 182 99 L 208 99" strokeWidth="0.6" />
            <path d="M 182 105 L 208 105" strokeWidth="0.6" />

            {/* Ground */}
            <path d="M 8 200 C 100 202, 280 201, 372 202" strokeWidth="1.2" />

            {/* Merchant relaxed in a chair, far left, gently rocking */}
            <motion.g
                animate={!reduced ? { rotate: [-1, 1, -1] } : { rotate: 0 }}
                transition={!reduced ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : {}}
                style={{ transformOrigin: '142px 196px' }}
            >
                {/* Chair (4 lines for legs + seat) */}
                <path d="M 130 196 L 132 178" strokeWidth="0.8" />
                <path d="M 152 196 L 150 178" strokeWidth="0.8" />
                <path d="M 130 178 L 152 178" strokeWidth="0.9" />
                <path d="M 130 178 L 130 162" strokeWidth="0.8" />
                {/* Merchant sitting */}
                <g strokeWidth="1">
                    <circle cx="141" cy="158" r="3" />
                    <path d="M 141 161 L 141 175" />
                    <path d="M 141 168 L 134 170" />
                    <path d="M 141 168 L 148 170" />
                    {/* Legs bent forward */}
                    <path d="M 141 175 L 152 184" />
                    <path d="M 141 175 L 152 188" />
                </g>
            </motion.g>

            {/* A small customer walking in from the right */}
            <motion.g
                strokeWidth="1"
                animate={!reduced ? { x: [0, -240, -240] } : { x: -120 }}
                transition={!reduced ? { duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 } : {}}
            >
                <circle cx="360" cy="174" r="2.8" />
                <path d="M 360 177 L 360 190" />
                <path d="M 357 182 L 363 182" />
                <path d="M 360 190 L 356 200" />
                <path d="M 360 190 L 364 200" />
                {/* Small package being carried */}
                <path d="M 354 184 L 358 184 L 358 188 L 354 188 Z" strokeWidth="0.7" />
            </motion.g>

            {/* Flowerpot — now in bloom (continuity payoff) */}
            <path d="M 18 178 L 32 178 L 30 198 L 20 198 Z" strokeWidth="0.8" />
            {/* Stems */}
            <path d="M 22 178 Q 22 168, 24 162" strokeWidth="0.7" />
            <path d="M 26 178 Q 27 170, 30 164" strokeWidth="0.7" />
            <path d="M 28 178 Q 28 174, 26 170" strokeWidth="0.7" />
            {/* Blooms — three small flowers (more abundant than earlier panels) */}
            <g>
                <circle cx="24" cy="160" r="2.2" strokeWidth="0.7" />
                <circle cx="24" cy="160" r="0.6" fill="var(--color-accent)" stroke="none" />
                <circle cx="30" cy="162" r="2" strokeWidth="0.7" />
                <circle cx="30" cy="162" r="0.5" fill="var(--color-accent)" stroke="none" />
                <circle cx="27" cy="170" r="1.7" strokeWidth="0.7" />
                <circle cx="27" cy="170" r="0.5" fill="var(--color-accent)" stroke="none" />
            </g>
        </svg>
    );
}
