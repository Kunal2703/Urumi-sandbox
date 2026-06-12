/**
 * DSDeployStack — staged-deploy visual for WC capability 03.
 *
 * Two stacked deploy cards:
 *   - staging  (with promote button affordance + checks)
 *   - production (with revert button affordance + age)
 * Plus a small footer counter (deploys this week / incidents this week).
 */

import './DSDeployStack.css';

export default function DSDeployStack({
    staging = {
        id: '#4127',
        title: 'free-shipping banner mobile fix',
        prRef: 'PR #847',
        checks: ['tests', 'lint', 'visual'],
    },
    production = {
        id: '#4126',
        title: 'checkout PayPal callback timeout',
        ageLabel: '14h ago',
    },
    weeklyStats = '14 deploys this week · 0 incidents',
}) {
    return (
        <div className="ds-deploy" role="img" aria-label={`Deploy stack: staging deploy ${staging.id} ready for promotion, production ${production.id} live ${production.ageLabel}. ${weeklyStats}.`}>
            <div className="ds-deploy__head">
                <span className="ds-deploy__title">deploys · main</span>
                <span className="ds-deploy__live">
                    <span className="ds-deploy__live-dot" aria-hidden="true" />
                    1 ready
                </span>
            </div>

            {/* Staging card */}
            <div className="ds-deploy__card ds-deploy__card--staging">
                <div className="ds-deploy__card-row ds-deploy__card-row--top">
                    <span className="ds-deploy__card-id">
                        <strong>{staging.id}</strong>
                        <span className="ds-deploy__card-env">staging</span>
                    </span>
                    <span className="ds-deploy__checks">
                        {staging.checks.map((c) => (
                            <span key={c} className="ds-deploy__check">
                                <span aria-hidden="true">✓</span> {c}
                            </span>
                        ))}
                    </span>
                </div>
                <div className="ds-deploy__card-meta">
                    {staging.prRef} · "{staging.title}"
                </div>
                <div className="ds-deploy__card-action">
                    <span className="ds-deploy__promote">
                        <span aria-hidden="true">▸</span> promote to prod
                    </span>
                </div>
            </div>

            {/* Production card */}
            <div className="ds-deploy__card ds-deploy__card--prod">
                <div className="ds-deploy__card-row ds-deploy__card-row--top">
                    <span className="ds-deploy__card-id">
                        <strong>{production.id}</strong>
                        <span className="ds-deploy__card-env">production</span>
                        <span className="ds-deploy__card-live">live</span>
                    </span>
                    <span className="ds-deploy__age">{production.ageLabel}</span>
                </div>
                <div className="ds-deploy__card-meta">
                    "{production.title}"
                </div>
                <div className="ds-deploy__card-action">
                    <span className="ds-deploy__revert">
                        <span aria-hidden="true">↶</span> rollback · 1 click
                    </span>
                </div>
            </div>

            <div className="ds-deploy__foot">{weeklyStats}</div>
        </div>
    );
}
