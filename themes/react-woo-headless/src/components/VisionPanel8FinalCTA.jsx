/**
 * VisionPanel8FinalCTA — Storefront Panorama, Panel 8: "Run your store on Urumi"
 *
 * The thriving close. Same shop as Panel 1 (closes the visual loop —
 * Panel 1 and Panel 8 are bookends of the same shop, transformed).
 *
 * Visual: shop with awning, window display, door. Merchant at the door
 * waving goodbye to a customer who's just left with a package. A second
 * customer arriving from the right. Sun rays from above. Three flower
 * pots in bloom (visual abundance).
 *
 * Subtle continuous motion: the merchant waves (small back-and-forth),
 * the leaving customer walks left, the arriving customer walks left,
 * sun rays pulse. Continuous loop, no phase machine.
 *
 * prefers-reduced-motion freezes everything at end positions.
 */

import { motion, useReducedMotion } from 'framer-motion';

export default function VisionPanel8FinalCTA() {
    const reduced = useReducedMotion();

    return (
        <svg
            className="vision-v2-final-cta-sketch"
            viewBox="0 0 380 220"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Sun rays — top right corner, soft pulse */}
            <motion.g
                strokeWidth="0.7"
                animate={!reduced ? { opacity: [0.4, 0.75, 0.4] } : { opacity: 0.6 }}
                transition={!reduced ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
                <circle cx="346" cy="18" r="6" strokeWidth="1" />
                <path d="M 346 4 L 346 8" />
                <path d="M 346 28 L 346 32" />
                <path d="M 332 18 L 336 18" />
                <path d="M 356 18 L 360 18" />
                <path d="M 336 8 L 339 11" />
                <path d="M 353 25 L 356 28" />
                <path d="M 356 8 L 353 11" />
                <path d="M 336 28 L 339 25" />
            </motion.g>

            {/* Same shop as Panel 1 (close-up) */}
            {/* Awning */}
            <path d="M 56 96 Q 160 32, 264 96" strokeWidth="1.4" />
            <path d="M 56 96 L 264 96" strokeWidth="1" />
            <path d="M 86 78  L 88 96" strokeWidth="0.9" />
            <path d="M 116 65 L 116 96" strokeWidth="0.9" />
            <path d="M 146 58 L 145 96" strokeWidth="0.9" />
            <path d="M 176 58 L 176 96" strokeWidth="0.9" />
            <path d="M 206 65 L 206 96" strokeWidth="0.9" />
            <path d="M 236 78 L 234 96" strokeWidth="0.9" />
            {/* Awning scallops */}
            <path d="M 60 96 Q 67 102, 74 96" strokeWidth="0.9" />
            <path d="M 74 96 Q 81 102, 88 96" strokeWidth="0.9" />
            <path d="M 88 96 Q 95 102, 102 96" strokeWidth="0.9" />
            <path d="M 102 96 Q 109 102, 116 96" strokeWidth="0.9" />
            <path d="M 116 96 Q 123 102, 130 96" strokeWidth="0.9" />
            <path d="M 130 96 Q 137 102, 144 96" strokeWidth="0.9" />
            <path d="M 144 96 Q 151 102, 158 96" strokeWidth="0.9" />
            <path d="M 158 96 Q 165 102, 172 96" strokeWidth="0.9" />
            <path d="M 172 96 Q 179 102, 186 96" strokeWidth="0.9" />
            <path d="M 186 96 Q 193 102, 200 96" strokeWidth="0.9" />
            <path d="M 200 96 Q 207 102, 214 96" strokeWidth="0.9" />
            <path d="M 214 96 Q 221 102, 228 96" strokeWidth="0.9" />
            <path d="M 228 96 Q 235 102, 242 96" strokeWidth="0.9" />
            <path d="M 242 96 Q 249 102, 256 96" strokeWidth="0.9" />
            {/* Walls */}
            <path d="M 56 100 L 56 218" strokeWidth="1.2" />
            <path d="M 264 100 L 264 218" strokeWidth="1.2" />
            {/* Window display */}
            <path d="M 76 120 L 144 120 L 144 178 L 76 178 Z" strokeWidth="1" />
            <path d="M 110 120 L 110 178" strokeWidth="0.7" />
            <path d="M 76 149 L 144 149" strokeWidth="0.7" />
            <circle cx="92"  cy="138" r="3"   strokeWidth="0.7" />
            <circle cx="126" cy="138" r="2.5" strokeWidth="0.7" />
            <path   d="M 84 168 L 102 168" strokeWidth="0.7" />
            <path   d="M 118 165 L 138 165" strokeWidth="0.7" />
            <path   d="M 122 172 L 134 172" strokeWidth="0.7" />
            {/* Door */}
            <path d="M 162 130 L 162 218" strokeWidth="1.2" />
            <path d="M 162 130 L 234 130" strokeWidth="1.2" />
            <path d="M 234 130 L 234 218" strokeWidth="1.2" />
            <path d="M 178 144 L 218 144 L 218 168 L 178 168 Z" strokeWidth="0.8" />
            <circle cx="225" cy="186" r="1.6" fill="currentColor" stroke="none" />
            {/* Hanging shop sign */}
            <path d="M 158 100 L 158 116" strokeWidth="0.7" />
            <path d="M 138 116 L 178 116 L 178 132 L 138 132 Z" strokeWidth="0.9" />
            <path d="M 146 122 L 170 122" strokeWidth="0.6" />
            <path d="M 146 128 L 170 128" strokeWidth="0.6" />

            {/* Merchant in doorway, waving — arm bobs back and forth */}
            <g strokeWidth="1">
                <circle cx="198" cy="180" r="3.5" />
                {/* Body + legs */}
                <path d="M 198 184 L 198 204" />
                <path d="M 198 192 L 192 200" />
                <path d="M 198 204 L 194 218" />
                <path d="M 198 204 L 202 218" />
                {/* Waving arm — animates */}
                <motion.path
                    d="M 198 192 L 207 188"
                    animate={!reduced ? { rotate: [-12, 12, -12] } : { rotate: 0 }}
                    transition={!reduced ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
                    style={{ transformOrigin: '198px 192px' }}
                />
            </g>

            {/* Customer leaving with a package — walks left */}
            <motion.g
                strokeWidth="1"
                animate={!reduced ? { x: [0, -50, -50] } : { x: -25 }}
                transition={!reduced ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
                <circle cx="290" cy="178" r="3" />
                <path d="M 290 181 L 290 196" />
                <path d="M 286 188 L 294 188" />
                {/* Package under arm */}
                <path d="M 282 186 L 288 186 L 288 192 L 282 192 Z" strokeWidth="0.8" />
                {/* Bow on package */}
                <path d="M 285 186 L 285 184" strokeWidth="0.6" />
                <path d="M 285 184 L 283 182" strokeWidth="0.6" />
                <path d="M 285 184 L 287 182" strokeWidth="0.6" />
                {/* Legs */}
                <path d="M 290 196 L 286 210" />
                <path d="M 290 196 L 294 210" />
            </motion.g>

            {/* Customer arriving from the right — slower, smaller */}
            <motion.g
                strokeWidth="0.9"
                animate={!reduced ? { x: [0, -40, -40] } : { x: -20 }}
                transition={!reduced
                    ? { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
                    : {}}
            >
                <circle cx="350" cy="184" r="2.5" />
                <path d="M 350 186 L 350 198" />
                <path d="M 347 191 L 353 191" />
                <path d="M 350 198 L 347 210" />
                <path d="M 350 198 L 353 210" />
            </motion.g>

            {/* Ground line */}
            <path d="M 12 218 C 80 220, 220 219, 308 220" strokeWidth="1.2" />

            {/* THREE flowerpots in full bloom — visual abundance vs Panel 1 */}
            {/* Pot 1 (closer, larger) */}
            <g strokeWidth="0.8">
                <path d="M 244 196 L 256 196 L 254 214 L 246 214 Z" />
                <path d="M 247 196 Q 247 186, 249 180" strokeWidth="0.7" />
                <path d="M 251 196 Q 252 188, 254 184" strokeWidth="0.7" />
                <circle cx="248.5" cy="178" r="2.4" strokeWidth="0.7" />
                <circle cx="248.5" cy="178" r="0.7" fill="var(--color-accent)" stroke="none" />
                <circle cx="254" cy="183" r="2" strokeWidth="0.7" />
                <circle cx="254" cy="183" r="0.6" fill="var(--color-accent)" stroke="none" />
            </g>
            {/* Pot 2 (left side) */}
            <g strokeWidth="0.8">
                <path d="M 30 200 L 42 200 L 40 216 L 32 216 Z" />
                <path d="M 33 200 Q 33 192, 35 188" strokeWidth="0.7" />
                <path d="M 38 200 Q 39 194, 41 192" strokeWidth="0.7" />
                <circle cx="34.5" cy="186" r="2" strokeWidth="0.7" />
                <circle cx="34.5" cy="186" r="0.6" fill="var(--color-accent)" stroke="none" />
                <circle cx="41" cy="190" r="1.7" strokeWidth="0.7" />
                <circle cx="41" cy="190" r="0.5" fill="var(--color-accent)" stroke="none" />
            </g>
            {/* Pot 3 (back left of door, hanging from awning maybe — keep simple, on ground) */}
            <g strokeWidth="0.8">
                <path d="M 268 202 L 278 202 L 277 216 L 269 216 Z" />
                <path d="M 271 202 Q 271 195, 273 191" strokeWidth="0.7" />
                <circle cx="272.5" cy="189" r="1.8" strokeWidth="0.7" />
                <circle cx="272.5" cy="189" r="0.5" fill="var(--color-accent)" stroke="none" />
            </g>
        </svg>
    );
}
