import React from 'react';
import '../styles/EverythingIncluded.css';

const EverythingIncluded = () => {
  return (
    <section className="everything-included-section">
      <div className="everything-included-container">
        <h2 className="everything-headline">Everything you need, included</h2>
        <p className="everything-subheading">
          Urumi is not just hosting. It's a complete enterprise operations bundle: scaling, security, observability, backups, safe releases, and support, operated end-to-end.
        </p>

        <div className="features-grid">
          {/* Quadrant 1: Reliability + recovery */}
          <div className="feature-quadrant">
            <h3 className="quadrant-title">Reliability + recovery</h3>
            <ul className="quadrant-list">
              <li>PITR + 30-day backups (file system + DB)</li>
              <li>Multi-zone infrastructure + failover tolerance</li>
            </ul>
          </div>

          {/* Quadrant 2: Performance + observability */}
          <div className="feature-quadrant">
            <h3 className="quadrant-title">Performance + observability</h3>
            <ul className="quadrant-list">
              <li>Datadog (APM + logs + alerts), fully managed</li>
              <li>Recurring performance improvements on performance hot paths</li>
            </ul>
          </div>

          {/* Quadrant 3: Scale + edge */}
          <div className="feature-quadrant">
            <h3 className="quadrant-title">Scale + edge</h3>
            <ul className="quadrant-list">
              <li>Cloudflare Enterprise (CDN + WAF), fully managed</li>
              <li>Horizontal autoscaling for campaigns and traffic spikes</li>
              <li>Unexpected traffic spikes included (no surprise compute bills)</li>
            </ul>
          </div>

          {/* Quadrant 4: Release safety + support */}
          <div className="feature-quadrant">
            <h3 className="quadrant-title">Release safety + support</h3>
            <ul className="quadrant-list">
              <li>CI/CD + rollback-ready deploys + isolated staging</li>
              <li>24×7 incident escalation + dedicated support chat</li>
              <li>Founder hotline</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EverythingIncluded;
