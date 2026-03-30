/**
 * Audit CTA Component
 * Call-to-action section for free WooCommerce audit
 *
 * @author Urumi.ai
 */

import React from 'react';
import LazyLottie from './LazyLottie';
import '../styles/AuditCTA.css';

const AuditCTA = () => {
  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';

  return (
    <section className="audit-cta-section">
      <div className="audit-cta-container">
        <div className="audit-cta-content">
          <div className="audit-cta-text">
            <h2 className="audit-cta-headline">Get a free WooCommerce performance audit</h2>
            <p className="audit-cta-subheading">
              We'll analyze your infrastructure, traffic patterns, and deployment workflow to identify critical performance and reliability risks, then show you exactly how to eliminate them.
            </p>
            <div className="audit-cta-button-wrapper">
              <a
                href="#demo-form-section"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('openDemoForm'));
                }}
                className="btn btn-primary"
              >
                Get Free Audit
              </a>
            </div>
          </div>
          <div className="audit-cta-animation">
            <div className="audit-cta-globe-placeholder">
              <LazyLottie
                animationUrl={`${themeUrl}/public/world-animation.json`}
                loop={true}
                className="audit-lottie-animation"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditCTA;
