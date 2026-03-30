/**
 * Competitor Comparison Component
 * Detailed comparisons with major hosting competitors
 *
 * @author Urumi.ai
 */

import React from 'react';
import '../styles/CompetitorComparison.css';

const CompetitorComparison = () => {
  const competitors = [
    {
      name: 'Kinsta',
      headline: 'WooCommerce-Native vs General WordPress',
      description: 'Kinsta offers premium WordPress hosting, but performance tuning, cache configuration, and scaling are still on you. Urumi is built by ex-WooCommerce core developers who understand every query and bottleneck.',
      features: [
        { label: 'Scaling', urumi: 'Horizontal auto-scaling', them: 'vertical resource limits' },
        { label: 'Performance', urumi: 'Continuous monitoring with APM', them: 'manual tuning' },
        { label: 'Deploys', urumi: 'Staging + CI/CD with rollback', them: 'manual deploys' }
      ]
    },
    {
      name: 'SiteGround',
      headline: 'Enterprise Infrastructure vs Shared Hosting',
      description: 'SiteGround works for getting started, but growing stores quickly outgrow shared resources. Urumi delivers isolated containers, multi-zone redundancy, and auto-scaling from day one.',
      features: [
        { label: 'Infrastructure', urumi: 'Isolated containers on Google Cloud', them: 'shared hosting' },
        { label: 'Reliability', urumi: '99.99% uptime with auto-failover', them: 'single-zone hosting' },
        { label: 'Operations', urumi: 'Fully managed by ex-WooCommerce team', them: 'self-managed via cPanel' }
      ]
    },
    {
      name: 'Cloudways',
      headline: 'Managed Operations vs DIY Cloud',
      description: 'Cloudways gives you cloud flexibility but requires technical knowledge to configure, optimize, and maintain servers. Urumi handles the full operations stack so you can focus on your business.',
      features: [
        { label: 'Management', urumi: 'Complete managed operations', them: 'manual server config' },
        { label: 'WooCommerce', urumi: 'Purpose-built for WooCommerce', them: 'generic cloud hosting' },
        { label: 'Monitoring', urumi: 'APM traces + performance guardrails', them: 'basic server metrics' }
      ]
    },
    {
      name: 'WP Engine',
      headline: 'Purpose-Built eCommerce vs Legacy WordPress',
      description: 'WP Engine pioneered managed WordPress hosting, but their platform was designed for content sites, not high-traffic WooCommerce stores. Urumi is purpose-built for eCommerce with horizontal scaling and checkout stability.',
      features: [
        { label: 'Focus', urumi: 'Built for WooCommerce by its creators', them: 'general WordPress' },
        { label: 'Peak Traffic', urumi: 'Auto-scaling keeps checkout stable', them: 'fixed resource plans' },
        { label: 'Releases', urumi: 'Staging + rollback-ready deploys', them: 'basic staging' }
      ]
    }
  ];

  return (
    <section className="competitor-comparison-section">
      <div className="competitor-comparison-container">
        <h2 className="competitor-comparison-headline">
          Why Choose <span className="highlight">Urumi</span> Over Traditional Hosts?
        </h2>
        <p className="competitor-comparison-subheading">
          Most hosts sell compute. Urumi delivers managed WooCommerce operations, built by the team that created WooCommerce and scaled systems at Google and Meta.
        </p>

        <div className="competitor-grid">
          {competitors.map((competitor, index) => (
            <div key={index} className="competitor-card">
              <div className="competitor-accent"></div>
              <h3 className="competitor-name">Urumi vs {competitor.name}</h3>
              <h4 className="competitor-headline">{competitor.headline}</h4>
              <p className="competitor-description">{competitor.description}</p>

              <ul className="competitor-features">
                {competitor.features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <strong>{feature.label}:</strong> {feature.urumi} <span className="vs">vs</span> {feature.them}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The Urumi Difference Summary */}
        <div className="urumi-difference">
          <h3 className="difference-headline">
            The Urumi Difference
          </h3>

          <div className="difference-grid">
            <div className="difference-item">
              <h4>Built by WooCommerce Core</h4>
              <p>Founded by engineers who built WooCommerce. We understand every query, hook, and bottleneck because we wrote them.</p>
            </div>

            <div className="difference-item">
              <h4>Google-Scale Infrastructure</h4>
              <p>Our team has operated systems handling millions of requests per minute at Google and Meta. Your store gets the same engineering rigor.</p>
            </div>

            <div className="difference-item">
              <h4>AI That Understands WooCommerce</h4>
              <p>Not a generic chatbot. An AI assistant built on deep WooCommerce knowledge that optimizes, monitors, and manages your store through simple conversations.</p>
            </div>
          </div>

          <div className="difference-cta">
            <a
              href="#demo-form-section"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('openDemoForm'));
              }}
              className="btn btn-primary"
            >
              Experience the Urumi Advantage →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitorComparison;
