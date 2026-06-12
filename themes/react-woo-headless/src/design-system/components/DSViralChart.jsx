/**
 * DSViralChart — viral-moment chart artifact for the /woocommerce hero.
 *
 * Tells the spike-and-scale story in one glance:
 *   - Smooth orange "requests/day" curve climbs left → right, peaking
 *     after a "viral moment" event marker at +8h on a 24h replay.
 *   - Volumetric gradient fills the area under the curve (orange fading
 *     to transparent) — the spike has body, not just a line.
 *   - Dashed near-black "PHP workers" stepped line tracks underneath,
 *     slightly behind the curve, telegraphing that workers respond to
 *     load (causality).
 *   - A scrubbing cursor sweeps left → right on a slow loop after the
 *     chart has drawn in — reads as "platform monitoring in real time".
 *   - A steady "now" cursor sits at the curve's end as the live anchor.
 *   - Header (domain · replay), legend, footer (peak · p99 · incidents
 *     + an auto-scale event line for product credibility).
 *
 * Pure SVG. The curve draws in via stroke-dashoffset; the fill fades in
 * just behind it; the scrub cursor uses SMIL animateTransform (avoids
 * CSS-vs-viewBox coordinate ambiguity). Honors prefers-reduced-motion
 * — every continuous animation is suppressed and the chart renders in
 * its final state.
 *
 * Default labels reference a representational platform scale event
 * (5.1M req/day peak). Override via props for customer-specific stories.
 */

import { useReducedMotion } from 'framer-motion';
import './DSViralChart.css';

export default function DSViralChart({
    // Default header is Urumi-centric — mirrors Vision's DSOpsConsole
    // ("urumi · ops") so the two pages read as one product. The chart's
    // shape comes from a real customer scale event, but the customer
    // proof + attribution lives in the dedicated grüum section below;
    // putting their name in the hero would muddy whose page this is.
    domainLabel = 'urumi · scale event',
    replayLabel = '24h replay',
    peakLabel = '5.1M / day peak',
    p99Label = 'p99 < 1s',
    incidentsLabel = '0 incidents',
    eventLine = '▸ auto-scaled to 2,000+ workers · 14:00:48',
    ariaSummary = "Representative scale-event chart — daily request volume climbed to a 5.1M peak through a viral surge, the platform auto-scaled to 2,000+ PHP workers across zones underneath, p99 latency held under 1 second, zero incidents.",
}) {
    const reduce = useReducedMotion();

    // Closed path under the curve, dropping to the y=220 baseline + back to
    // the chart origin so the gradient fill renders as a proper area shape.
    //
    // The curve starts at y=178 — NOT at the y=220 floor — because a live
    // WooCommerce store always has baseline traffic. y=178 on this scale
    // represents ~1.0M req/day (~20% of the 5.1M peak), which is realistic
    // background traffic for a store that goes viral. The pre-viral
    // segment then rises gently from that baseline through "t-15m" → launch,
    // and the post-marker segment steepens through the spike.
    const fillPath =
        'M 40 178 ' +
        'C 100 175, 160 170, 220 162 ' +
        'C 260 152, 290 142, 320 130 ' +
        'C 360 95, 400 60, 440 50 ' +
        'C 490 44, 540 44, 600 46 ' +
        'L 600 220 L 40 220 Z';

    const curvePath =
        'M 40 178 ' +
        'C 100 175, 160 170, 220 162 ' +
        'C 260 152, 290 142, 320 130 ' +
        'C 360 95, 400 60, 440 50 ' +
        'C 490 44, 540 44, 600 46';

    return (
        <div
            className={`ds-viral${reduce ? ' is-reduced' : ''}`}
            role="img"
            aria-label={ariaSummary}
        >
            <div className="ds-viral__head">
                <span className="ds-viral__domain">
                    <span className="ds-viral__brand-mark" aria-hidden="true" />
                    {domainLabel}
                </span>
                <span className="ds-viral__replay">
                    <span className="ds-viral__replay-dot" aria-hidden="true" />
                    {replayLabel}
                </span>
            </div>

            <div className="ds-viral__legend" aria-hidden="true">
                <span>
                    <span className="ds-viral__legend-line ds-viral__legend-line--solid" />
                    {' '}requests/day
                </span>
                <span>
                    <span className="ds-viral__legend-line ds-viral__legend-line--dashed" />
                    {' '}PHP workers
                </span>
            </div>

            <svg
                className="ds-viral__svg"
                viewBox="0 0 600 260"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    {/* Volumetric fill under the requests curve. */}
                    <linearGradient id="ds-viral-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"  stopColor="#DC5000" stopOpacity="0.22" />
                        <stop offset="60%" stopColor="#DC5000" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#DC5000" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* gridlines */}
                <g stroke="rgba(16,9,4,0.08)" strokeDasharray="2 6">
                    <line x1="40" y1="40"  x2="600" y2="40"  />
                    <line x1="40" y1="100" x2="600" y2="100" />
                    <line x1="40" y1="160" x2="600" y2="160" />
                    <line x1="40" y1="220" x2="600" y2="220" />
                </g>

                {/* y-axis labels — requests per day (M = million). */}
                <g fontFamily="JetBrains Mono, monospace" fontSize="10"
                   fill="rgba(16,9,4,0.45)" textAnchor="end">
                    <text x="34" y="44">5.1M</text>
                    <text x="34" y="104">3.4M</text>
                    <text x="34" y="164">1.6M</text>
                    <text x="34" y="224">0</text>
                </g>

                {/* x-axis labels — 24h replay timeline. */}
                <g fontFamily="JetBrains Mono, monospace" fontSize="9"
                   fill="rgba(16,9,4,0.45)">
                    <text x="56"  y="248">t-4h</text>
                    <text x="180" y="248">launch</text>
                    <text x="312" y="248">+8h</text>
                    <text x="452" y="248">+16h</text>
                    <text x="560" y="248">+24h</text>
                </g>

                {/* viral marker — dashed vertical + label */}
                <line x1="320" y1="30" x2="320" y2="220"
                      stroke="#DC5000" strokeWidth="1"
                      strokeDasharray="4 4" opacity="0.7" />
                <g transform="translate(326, 36)">
                    <text x="0" y="0" fontFamily="JetBrains Mono, monospace"
                          fontSize="10" fill="#DC5000">
                        ▼ viral moment
                    </text>
                </g>

                {/* gradient fill under the requests curve */}
                <path
                    className="ds-viral__fill"
                    d={fillPath}
                    fill="url(#ds-viral-fill)"
                />

                {/* workers stepped line — dashed near-black.
                    Baseline starts at y=200 (≈4 workers always running) not
                    y=212 — a live store doesn't run on zero workers. Peak
                    steps are unchanged; the scale-up ratio shrinks to ~5×
                    (4 workers → ~20 workers), which is the realistic shape
                    for a baseline-aware autoscaler. */}
                <path
                    className="ds-viral__workers"
                    d="M 40 200 L 160 200 L 160 188 L 240 188 L 240 168 L 300 168 L 300 130 L 360 130 L 360 84 L 440 84 L 440 62 L 540 62 L 540 56 L 600 56"
                    fill="none"
                    stroke="#100904"
                    strokeWidth="1.6"
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                />

                {/* requests curve — smooth orange */}
                <path
                    className="ds-viral__curve"
                    d={curvePath}
                    fill="none"
                    stroke="#DC5000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />

                {/* Scrubbing cursor — vertical sweep line that travels left
                    → right on a slow loop, reading the chart in real time.
                    SMIL animateTransform avoids CSS-vs-viewBox coordinate
                    ambiguity. Suppressed under reduced-motion. */}
                {!reduce && (
                    <g className="ds-viral__scrub">
                        <line x1="0" y1="30" x2="0" y2="220"
                              stroke="rgba(220,80,0,0.55)"
                              strokeWidth="1.2"
                              strokeDasharray="3 4" />
                        <circle cx="0" cy="30" r="3" fill="#DC5000" opacity="0.85" />
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="40 0; 600 0; 40 0"
                            keyTimes="0; 0.5; 1"
                            keySplines="0.16 1 0.3 1; 0.16 1 0.3 1"
                            calcMode="spline"
                            dur="14s"
                            begin="3.5s"
                            repeatCount="indefinite"
                        />
                    </g>
                )}

                {/* "now" cursor at curve end — steady anchor showing where
                    the platform currently is in the replay timeline. */}
                <circle
                    className="ds-viral__cursor"
                    cx="600" cy="46" r="6"
                    fill="#DC5000" stroke="#FDFAF6" strokeWidth="2"
                />
            </svg>

            <div className="ds-viral__foot">
                <div className="ds-viral__foot-stats">
                    <span className="ds-viral__foot-peak">{peakLabel}</span>
                    <span className="ds-viral__sep" aria-hidden="true">·</span>
                    <span>{p99Label}</span>
                    <span className="ds-viral__sep" aria-hidden="true">·</span>
                    <span>{incidentsLabel}</span>
                </div>
                {eventLine && (
                    <div className="ds-viral__event">{eventLine}</div>
                )}
            </div>
        </div>
    );
}
