/**
 * DSZoneBoard — multi-zone reliability status board for WC capability 02.
 *
 * Renders N zone cells (active / standby / down) plus a small footer
 * with last-failover, PITR, and last-backup lines.
 *
 * Pattern (zones prop):
 *   { id, label, state: 'active'|'standby'|'down', meta? }
 */

import './DSZoneBoard.css';

const STATE_LABEL = {
    active: 'active',
    standby: 'standby',
    down: 'down',
};

export default function DSZoneBoard({
    title = 'us central · multi-zone',
    zones = [],
    lastFailover = 'never · 30d window',
    pitrWindow = '30 days · file + db',
    lastBackup = '✓ verified · 4h ago',
}) {
    return (
        <div className="ds-zone" role="img" aria-label={`Multi-zone status: ${zones.length} zones, last failover ${lastFailover}, PITR window ${pitrWindow}.`}>
            <div className="ds-zone__head">
                <span className="ds-zone__title">{title}</span>
                <span className="ds-zone__health">
                    <span className="ds-zone__health-dot" aria-hidden="true" />
                    healthy
                </span>
            </div>

            <div className="ds-zone__grid" data-cells={zones.length}>
                {zones.map((z) => (
                    <div
                        key={z.id}
                        className={`ds-zone__cell ds-zone__cell--${z.state}`}
                    >
                        <span className="ds-zone__cell-dot" aria-hidden="true" />
                        <span className="ds-zone__cell-id">{z.id}</span>
                        <span className="ds-zone__cell-state">
                            {z.meta || STATE_LABEL[z.state]}
                        </span>
                    </div>
                ))}
            </div>

            <dl className="ds-zone__lines">
                <div className="ds-zone__line">
                    <dt>last failover</dt>
                    <dd>{lastFailover}</dd>
                </div>
                <div className="ds-zone__line">
                    <dt>PITR window</dt>
                    <dd>{pitrWindow}</dd>
                </div>
                <div className="ds-zone__line">
                    <dt>offsite backup</dt>
                    <dd className="ds-zone__line--ok">{lastBackup}</dd>
                </div>
            </dl>
        </div>
    );
}
