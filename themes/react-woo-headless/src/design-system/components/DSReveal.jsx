/**
 * DSReveal — fade-up-on-enter wrapper.
 *
 * Wraps any child with a one-shot reveal: starts hidden + translated,
 * snaps to visible the first time it crosses the viewport (rootMargin
 * -10% bottom so it triggers slightly before the element fully appears).
 *
 * Previously implemented via framer-motion's `whileInView`, which
 * creates one IntersectionObserver per motion component — 50+ per page.
 * Now uses sharedIntersectionObserver so all DSReveals collapse to a
 * single observer keyed by their viewport margin.
 *
 * Honors prefers-reduced-motion automatically (children appear instantly
 * with no transform). Stagger children by passing `delay` (seconds);
 * 0.06–0.12 between siblings creates the cascade across the site.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { observeOnce } from '../utils/sharedIntersectionObserver.js';

export default function DSReveal({
    children,
    delay = 0,
    distance = 16,
    duration = 0.5,
    as: Component = 'div',
    ...rest
}) {
    const reduced = useReducedMotion();
    const ref = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (reduced) return; // No observer cost for reduced-motion users.
        if (revealed) return;
        return observeOnce(
            ref.current,
            () => setRevealed(true),
            { rootMargin: '0px 0px -10% 0px', threshold: 0 }
        );
    }, [reduced, revealed]);

    if (reduced) {
        return <Component ref={ref} {...rest}>{children}</Component>;
    }

    const MotionComponent = motion[Component] || motion.div;

    return (
        <MotionComponent
            ref={ref}
            initial={{ opacity: 0, y: distance }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1], // matches --ease-out token
            }}
            {...rest}
        >
            {children}
        </MotionComponent>
    );
}
