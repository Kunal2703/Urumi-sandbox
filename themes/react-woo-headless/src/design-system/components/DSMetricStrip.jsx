/**
 * DSMetricStrip — N-cell horizontal stat strip used under the WC hero.
 *
 * Each cell is a labeled metric: small uppercase label + big value (with
 * optional "from → to" pair) + optional small note. Values that are
 * numbers count up via DSCountUp on viewport entry.
 *
 * Pattern (cells prop):
 *   { label, from?, to, unit?, decimals?, note? }
 *
 *   to: number (count-up) | string (rendered as-is, e.g. "5.7s → 0.4s")
 *   from: optional string label rendered to the left of the value with → arrow
 *   unit: appended to count-up value (e.g. "%", "s", " req/s")
 *   decimals: passed to DSCountUp
 *   note: small footnote line under the value
 *
 * Stacks to a 2-col grid on tablet, 1-col on mobile.
 */

import DSCountUp from './DSCountUp.jsx';
import './DSMetricStrip.css';

export default function DSMetricStrip({ cells }) {
    return (
        <div className="ds-metric-strip">
            {cells.map((c, i) => (
                <div className="ds-metric-strip__cell" key={i}>
                    <span className="ds-metric-strip__label">{c.label}</span>
                    <span className="ds-metric-strip__value">
                        {c.from && (
                            <>
                                <span className="ds-metric-strip__from">{c.from}</span>
                                <span className="ds-metric-strip__arrow" aria-hidden="true">→</span>
                            </>
                        )}
                        <span className="ds-metric-strip__to">
                            {typeof c.to === 'number' ? (
                                <DSCountUp
                                    to={c.to}
                                    decimals={c.decimals || 0}
                                    suffix={c.unit || ''}
                                />
                            ) : (
                                c.to
                            )}
                        </span>
                    </span>
                    {c.note && (
                        <span className="ds-metric-strip__note">{c.note}</span>
                    )}
                </div>
            ))}
        </div>
    );
}
