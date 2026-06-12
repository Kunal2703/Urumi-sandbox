/**
 * DSCompetitorCard — per-competitor breakout for the Compared section.
 *
 * Editorial card layout:
 *   - Faint monogram backdrop (first letter of competitor name, big and
 *     low-opacity) for visual texture without trademarked logos.
 *   - "vs" eyebrow + competitor name title.
 *   - h4 tagline (positioning headline).
 *   - 1-paragraph differentiator.
 *   - 3-bullet contrast list (label: contrast pairs).
 *
 * Props:
 *   competitor — e.g. "Kinsta"
 *   tagline    — short positioning headline (h4)
 *   paragraph  — single differentiator paragraph
 *   bullets    — 3 contrast points: { label, contrast } | string
 *   monogram?  — override the auto-derived backdrop letter (rarely needed)
 */

import './DSCompetitorCard.css';

export default function DSCompetitorCard({
    competitor,
    tagline,
    paragraph,
    bullets = [],
    monogram,
}) {
    const mark = (monogram || competitor || '').charAt(0).toUpperCase();
    return (
        <article className="ds-cmpcard">
            <span className="ds-cmpcard__backdrop" aria-hidden="true">{mark}</span>
            <header className="ds-cmpcard__head">
                <span className="ds-cmpcard__num">vs</span>
                <h3 className="ds-cmpcard__title">{competitor}</h3>
            </header>
            <h4 className="ds-cmpcard__tagline">{tagline}</h4>
            <p className="ds-cmpcard__para">{paragraph}</p>
            <ul className="ds-cmpcard__bullets">
                {bullets.map((b, i) => (
                    <li key={i}>
                        {typeof b === 'string' ? (
                            b
                        ) : (
                            <>
                                <strong>{b.label}:</strong> {b.contrast}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </article>
    );
}
