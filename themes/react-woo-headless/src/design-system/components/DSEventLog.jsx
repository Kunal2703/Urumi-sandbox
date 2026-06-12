/**
 * DSEventLog — auto-scaling event timeline for the WC capability 01.
 *
 * Renders a list of timestamped events with a glyph + body. The most
 * recent row gets a "live" pulse on its glyph. Used for the auto-scaling
 * artifact (spike detected → workers added → p99 holding → scale-down).
 *
 * Pattern (events prop):
 *   { ts, kind: 'info'|'ok'|'live', text }
 *
 * "live" kind pulses (most-recent / current state).
 */

import './DSEventLog.css';

export default function DSEventLog({
    title = 'auto-scaler · zone eu-west-1',
    statusLabel = 'live',
    events = [],
}) {
    return (
        <div className="ds-evlog" role="img" aria-label={`${title}: ${events.length} events`}>
            <div className="ds-evlog__head">
                <span className="ds-evlog__title">{title}</span>
                <span className="ds-evlog__status">
                    <span className="ds-evlog__status-dot" aria-hidden="true" />
                    {statusLabel}
                </span>
            </div>
            <ol className="ds-evlog__list">
                {events.map((e, i) => (
                    <li
                        key={i}
                        className={`ds-evlog__row ds-evlog__row--${e.kind || 'info'}`}
                    >
                        <span className="ds-evlog__ts">{e.ts}</span>
                        <span className="ds-evlog__glyph" aria-hidden="true">
                            {e.kind === 'ok' ? '✓' : e.kind === 'live' ? '●' : '▸'}
                        </span>
                        <span className="ds-evlog__text">{e.text}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
