/**
 * Case Study CTA Component
 * Displays case study logos with hover-to-reveal pill CTAs
 * @author Urumi.ai
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CaseStudyCTA.css';

function CaseStudyCTA() {
  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';

  const caseStudies = [
    {
      id: 'gruum',
      name: 'grüum',
      logo: `${themeUrl}/public/gruum-logo.svg`,
      url: '/gruum-case-study',
      ctaText: 'READ THEIR STORY'
    }
    // Add more case studies here in the future
  ];

  return (
    <section className="case-study-cta-section">
      <div className="case-study-cta-container">
        <h2 className="case-study-cta-heading">Trusted by leading brands</h2>

        <div className="case-study-logos-grid">
          {caseStudies.map((study) => (
            <div key={study.id} className="case-study-logo-item">
              <Link to={study.url} className="case-study-logo-link">
                <span className="case-study-pill">
                  {study.ctaText}
                  <span className="case-study-pill-arrow">↗</span>
                </span>
                <img
                  src={study.logo}
                  alt={study.name}
                  className="case-study-logo"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CaseStudyCTA;
