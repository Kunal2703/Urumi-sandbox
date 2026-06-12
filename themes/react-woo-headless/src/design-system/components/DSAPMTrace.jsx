/**
 * DSAPMTrace — flame-graph-style APM trace artifact for WC capability 04.
 *
 * Renders a stack of bars where one (the "slow" one) is highlighted in
 * accent. Below: a "root cause" line and a "PR ready" pill — the story is
 * "we caught the regression and shipped the fix, not just the alert."
 *
 * Pattern (frames prop):
 *   { name, ms, depth, isSlow? }
 *
 *   depth: 0..N — controls left padding (visual call-stack depth)
 *   isSlow: true on exactly ONE row to highlight as the regression
 */

import './DSAPMTrace.css';

export default function DSAPMTrace({
    title = 'apm trace · /checkout',
    p99Label = '480ms (p99)',
    frames = [],
    rootCauseText = 'custom_filter (woocommerce_cart_loaded)',
    prRef = 'PR #1284 · ready',
}) {
    return (
        <div className="ds-apm" role="img" aria-label={`APM trace for /checkout: p99 ${p99Label}, root cause ${rootCauseText}, fix ready as ${prRef}.`}>
            <div className="ds-apm__head">
                <span className="ds-apm__title">{title}</span>
                <span className="ds-apm__p99">{p99Label}</span>
            </div>

            <div className="ds-apm__frames" role="presentation">
                {frames.map((f, i) => (
                    <div
                        key={i}
                        className={`ds-apm__frame${f.isSlow ? ' ds-apm__frame--slow' : ''}`}
                        style={{ marginLeft: `${(f.depth || 0) * 12}px` }}
                    >
                        <span className="ds-apm__frame-name">
                            {f.isSlow ? <strong>{f.name}</strong> : f.name}
                        </span>
                        <span className="ds-apm__frame-ms">
                            {f.ms}ms
                            {f.isSlow && (
                                <span aria-hidden="true"> ⚠</span>
                            )}
                        </span>
                    </div>
                ))}
            </div>

            <div className="ds-apm__foot">
                <div className="ds-apm__root">
                    <span className="ds-apm__root-label">root cause</span>
                    <span className="ds-apm__root-name">{rootCauseText}</span>
                </div>
                <span className="ds-apm__pr">{prRef}</span>
            </div>
        </div>
    );
}
