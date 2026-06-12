/**
 * DSCountUp — number that counts from 0 to `to` once it enters viewport.
 *
 * Uses requestAnimationFrame, only animates the first time the element
 * comes into view (no re-trigger on scroll-back). Honors
 * prefers-reduced-motion (renders the final value immediately).
 *
 * Format options support common cases:
 *   - <DSCountUp to={358} suffix=" req/s" />
 *   - <DSCountUp to={5.7} decimals={1} suffix="s" />
 *   - <DSCountUp to={99.99} decimals={2} suffix="%" />
 *   - <DSCountUp to={187} prefix="" suffix="k" />        (treats "to" as already-divided)
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function DSCountUp({
    to,
    duration = 800,
    decimals = 0,
    prefix = '',
    suffix = '',
    className,
}) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const [value, setValue] = useState(reduced ? to : 0);

    useEffect(() => {
        if (reduced) {
            setValue(to);
            return;
        }

        const node = ref.current;
        if (!node) return;

        let started = false;
        let rafId = null;

        const tick = (start) => (now) => {
            const t = Math.min(1, (now - start) / duration);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(to * eased);
            if (t < 1) rafId = requestAnimationFrame(tick(start));
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    rafId = requestAnimationFrame(tick(performance.now()));
                    observer.disconnect();
                }
            });
        }, { threshold: 0.4 });

        observer.observe(node);

        return () => {
            observer.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [to, duration, reduced]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {value.toFixed(decimals)}
            {suffix}
        </span>
    );
}
