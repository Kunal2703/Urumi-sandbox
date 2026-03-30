import React from 'react';
import '../styles/PerformanceGuardrails.css';

const PerformanceGuardrails = () => {
  return (
    <section className="performance-guardrails-section">
      <div className="performance-guardrails-container">
        <div className="guardrails-content">
          <h2 className="guardrails-headline">Performance guardrails that fix root causes</h2>

          <ul className="guardrails-list">
            <li className="guardrails-item">
              <span className="item-bullet">•</span>
              <span className="item-text">Audit the application layer using Datadog telemetry to spot slow queries, cache misses, and regressions early</span>
            </li>
            <li className="guardrails-item">
              <span className="item-bullet">•</span>
              <span className="item-text">Weekly performance reviews that turn findings into actionable fixes</span>
            </li>
            <li className="guardrails-item">
              <span className="item-bullet">•</span>
              <span className="item-text">Direct PRs for regressions and bottlenecks, not "add more servers"</span>
            </li>
          </ul>
        </div>

        <div className="guardrails-visual">
          <div className="process-card">
            <div className="process-placeholder">
              [Datadog pulse icon]
              →
              [Magnifier icon]
              →
              [PR card icon]
              →
              [Deploy icon]

              Inspection → Fix
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceGuardrails;
