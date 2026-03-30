/**
 * Testimonial Section Component
 * Elegant editorial-style testimonial with serif quote typography
 *
 * @author Urumi.ai
 */

import React from 'react';
import '../styles/TestimonialSection.css';

const TestimonialSection = () => {
  const themePath = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        {/* Decorative accent */}
        <div className="testimonial-accent-line" aria-hidden="true"></div>

        {/* Section label */}
        <p className="testimonial-label">What Our Clients Say</p>

        {/* The Quote */}
        <p className="testimonial-quote">
          "I'm very happy with the results. The biggest performance improvements we've seen from you guys. The results speak for themselves—I'm really happy we worked with Urumi."
        </p>

        {/* Attribution */}
        <div className="testimonial-attribution">
          <div className="testimonial-author">
            <div className="testimonial-avatar">
              <span className="avatar-initial">G</span>
            </div>
            <div className="testimonial-author-info">
              <p className="testimonial-author-name">George Lagonikas</p>
              <p className="testimonial-author-title">Founder, CTO</p>
            </div>
          </div>
          <div className="testimonial-brand">
            <a href="https://gruum.com" target="_blank" rel="noopener noreferrer" className="brand-logo-link">
              <img
                src={`${themePath}/public/gruum-logo.svg`}
                alt="grüum"
                className="testimonial-logo-img"
              />
            </a>
          </div>
        </div>

        {/* Results strip */}
        <div className="testimonial-results">
          <div className="result-item">
            <span className="result-value">294%</span>
            <span className="result-label">User Satisfaction</span>
          </div>
          <div className="result-divider"></div>
          <div className="result-item">
            <span className="result-value">4s → 0.3s</span>
            <span className="result-label">Cached Response</span>
          </div>
          <div className="result-divider"></div>
          <div className="result-item">
            <span className="result-value">5.7s → 2.7s</span>
            <span className="result-label">Uncached Response</span>
          </div>
        </div>

        {/* Case study CTA */}
        <a href="/gruum-case-study" className="testimonial-cta">
          Read the full case study
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default TestimonialSection;
