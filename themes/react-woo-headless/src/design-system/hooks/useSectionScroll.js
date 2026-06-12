/**
 * useSectionScroll(ref)
 *
 * Tracks scroll progress through a section's viewport intersection.
 * Returns 0 when the section's top edge is at the bottom of the viewport
 * (about to enter), 1 when the section's bottom edge is at the top
 * (just left). Reduced-motion safe — returns a static MotionValue of 0.5
 * so transforms collapse to their midpoint.
 *
 * Use it for:
 *   - Parallax: useTransform(progress, [0, 1], [0, -60])
 *   - Breathing scale: useTransform(progress, [0, 0.5, 1], [0.96, 1.04, 0.96])
 *   - Focal fades: useTransform(progress, [0, 0.5, 1], [0.4, 1, 0.4])
 *   - Ambient glow ramps: useTransform(progress, [0, 0.5, 1], [0, 1, 0])
 *
 * Pattern matches the impact page's scroll choreography
 * (urumi-admin/src/components/ImpactPage/slides/DiscussionSlide.jsx).
 */

import { useScroll, useReducedMotion, useMotionValue } from 'framer-motion';

export function useSectionScroll(ref, { offset = ['start end', 'end start'] } = {}) {
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset });

    // When reduced motion is on, return a constant 0.5 so transforms land
    // on their midpoint (their "settled" / focal value) instead of moving.
    const staticHalf = useMotionValue(0.5);
    return reduced ? staticHalf : scrollYProgress;
}
