/**
 * DSComparisonTable — restyled "Typical Host vs Urumi" table.
 *
 * Replaces the legacy <ComparisonTable /> with the design-system look.
 * Each row reveals on viewport entry (40ms stagger) via framer-motion's
 * whileInView. Reduced-motion path renders all rows immediately.
 *
 * Pattern (rows prop):
 *   { feature, typical, urumi }
 */

import { motion, useReducedMotion } from 'framer-motion';
import './DSComparisonTable.css';

const DEFAULT_ROWS = [
    { feature: 'Viral-ready scaling',         typical: 'Not available', urumi: 'Included' },
    { feature: 'Multi-zone reliability',       typical: 'Paid add-on',   urumi: 'Included' },
    { feature: 'Staging + CI/CD',              typical: 'Paid add-on',   urumi: 'Included' },
    { feature: 'Weekly performance audits',    typical: 'Not available', urumi: 'Included' },
    { feature: 'Root-cause performance fixes', typical: 'Not available', urumi: 'Included' },
    { feature: 'Traffic spikes included',      typical: 'Paid add-on',   urumi: 'Included' },
    { feature: 'Clear incident ownership',     typical: 'Not available', urumi: 'Included' },
    { feature: 'APM + monitoring',     typical: 'Paid add-on',   urumi: 'Included' },
];

export default function DSComparisonTable({
    rows = DEFAULT_ROWS,
    typicalLabel = 'Typical Host',
    urumiLabel = 'Urumi',
}) {
    const reduce = useReducedMotion();
    return (
        <div className="ds-cmp-table-wrap">
            <table className="ds-cmp-table" role="table">
                <thead>
                    <tr>
                        <th scope="col">Feature</th>
                        <th scope="col" className="ds-cmp-table__col-typical">{typicalLabel}</th>
                        <th scope="col" className="ds-cmp-table__col-urumi">{urumiLabel}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <motion.tr
                            key={r.feature}
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                            transition={{
                                duration: 0.4,
                                delay: i * 0.04,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <th scope="row">{r.feature}</th>
                            <td className={`ds-cmp-table__cell ds-cmp-table__cell--${cellTone(r.typical)}`}>
                                {r.typical}
                            </td>
                            <td className="ds-cmp-table__cell ds-cmp-table__cell--ok">
                                <span aria-hidden="true">✓ </span>{r.urumi}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function cellTone(v) {
    if (typeof v !== 'string') return 'neutral';
    const s = v.toLowerCase();
    if (s.includes('not available') || s.includes('no')) return 'neg';
    if (s.includes('paid add-on') || s.includes('add-on')) return 'paid';
    if (s.includes('included') || s.includes('yes')) return 'ok';
    return 'neutral';
}
