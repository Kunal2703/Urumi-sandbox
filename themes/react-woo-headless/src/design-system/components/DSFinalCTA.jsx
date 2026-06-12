/**
 * DSFinalCTA — full-viewport closing section used at the bottom of
 * every long-scroll page. Includes scroll-tied glow opacity, scaling
 * title, primary pill, secondary text link, and an optional status row.
 *
 * Two variants:
 *   - default: glow + scale animation (used by Vision, Blog, Blog post,
 *     Case study).
 *   - "hire":  no glow ramp, no title scale (used by Careers — internal
 *     funnel, less theatrical).
 */

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useTransform } from 'framer-motion';
import DSReveal from './DSReveal.jsx';
import { useSectionScroll } from '../hooks/useSectionScroll.js';
import './DSFinalCTA.css';

export default function DSFinalCTA({
    numLabel = 'Next step',
    title,
    subtitle,
    primary,        // { to: string, label: string } — react-router Link (or { onClick, href?, label } for callback)
    secondary,      // { onClick?: fn, href?: string, label: string } or { to, label }
    status = [],    // array of strings or { dot?: bool, text: string }
    variant = 'default',
    snap = true,    // pass false on list/reading pages where Lenis snap feels coercive
}) {
    const ref = useRef(null);
    const progress = useSectionScroll(ref);
    const glowOpacity  = useTransform(progress, [0, 0.4, 0.6, 1], [0.15, 1, 1, 0.15]);
    const titleScale   = useTransform(progress, [0, 0.5, 1], [0.92, 1, 1.05]);

    const isHire = variant === 'hire';

    return (
        <section
            className={`ds-final-cta ${isHire ? 'ds-final-cta--hire' : ''}`}
            ref={ref}
            {...(snap ? { 'data-snap-section': '' } : {})}
        >
            {!isHire && (
                <motion.div
                    className="ds-final-cta-glow"
                    aria-hidden="true"
                    style={{ opacity: glowOpacity }}
                />
            )}
            <div className="ds-wrap ds-final-cta-inner">
                <DSReveal>
                    <span className="ds-num-label">{numLabel}</span>
                </DSReveal>
                <DSReveal delay={0.06}>
                    {isHire ? (
                        <h2 className="ds-h1 ds-final-cta-title">{title}</h2>
                    ) : (
                        <motion.h2
                            className="ds-h1 ds-final-cta-title"
                            style={{ scale: titleScale }}
                        >
                            {title}
                        </motion.h2>
                    )}
                </DSReveal>
                {subtitle && (
                    <DSReveal delay={0.12}>
                        <p className="ds-sub ds-final-cta-sub">{subtitle}</p>
                    </DSReveal>
                )}

                {primary && (
                    <DSReveal delay={0.18}>
                        {primary.onClick ? (
                            <a
                                href={primary.href || '#'}
                                onClick={primary.onClick}
                                className="ds-final-cta-pill"
                            >
                                <span>{primary.label}</span>
                                <span className="ds-final-cta-pill-arrow" aria-hidden="true">→</span>
                            </a>
                        ) : (
                            <Link to={primary.to} className="ds-final-cta-pill">
                                <span>{primary.label}</span>
                                <span className="ds-final-cta-pill-arrow" aria-hidden="true">→</span>
                            </Link>
                        )}
                    </DSReveal>
                )}

                {secondary && (
                    <DSReveal delay={0.24}>
                        {secondary.onClick ? (
                            <a
                                href={secondary.href || '#'}
                                onClick={secondary.onClick}
                                className="ds-final-cta-secondary"
                            >
                                {secondary.label} <span className="ds-arrow">→</span>
                            </a>
                        ) : (
                            <Link to={secondary.to} className="ds-final-cta-secondary">
                                {secondary.label} <span className="ds-arrow">→</span>
                            </Link>
                        )}
                    </DSReveal>
                )}

                {status.length > 0 && (
                    <DSReveal delay={0.30}>
                        <div className="ds-final-cta-status">
                            {status.map((item, i) => {
                                const isObj = typeof item === 'object';
                                const text = isObj ? item.text : item;
                                const dot  = isObj ? item.dot : false;
                                return (
                                    <span key={i} className="ds-final-cta-status-item">
                                        {dot && <span className="ds-final-cta-status-dot" aria-hidden="true" />}
                                        <span>{text}</span>
                                        {i < status.length - 1 && <span className="sep"> · </span>}
                                    </span>
                                );
                            })}
                        </div>
                    </DSReveal>
                )}
            </div>
        </section>
    );
}
