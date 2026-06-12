import React, { memo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { assetUrl } from '../lib/assetUrl';
import '../styles/TeamCredentials.css';

// Founders list is stable — hoist to module scope so it's not
// recreated on every render and so future shallow-compare optimizations
// see identical references.
const FOUNDERS = [
  {
    name: 'Naman Malhotra',
    photo: assetUrl('naman-team.webp'),
    linkedin: 'https://www.linkedin.com/in/naman03malhotra'
  },
  {
    name: 'Vedanshu Jain',
    photo: assetUrl('vedanshu-team.webp'),
    linkedin: 'https://www.linkedin.com/in/vedanshuj/'
  }
];

const TeamCredentials = memo(function TeamCredentials() {
  const location = useLocation();
  const isVisionPage = location.pathname === '/';
  const founders = FOUNDERS;

  return (
    <section className="team-credentials-section">
      <div className="team-credentials-container">
        {/* Team Content & Visual Grid */}
        <div className="team-grid">
          <div className="team-content">
            <h2 className="team-headline">
              {isVisionPage
                ? "The Founders' Vision"
                : "Built by ex-Automattic WooCommerce core engineers"
              }
            </h2>
            <p className="team-subheading">
              {isVisionPage
                ? "We built WooCommerce core at Automattic — the parts that matter in production: performance, payments, reliability. Earlier we were founding-era engineers at HackerRank (Y Combinator), where the team scaled the company from $2M to $30M ARR. Together, we're using that experience to reimagine eCommerce from the ground up, making it effortless through AI. Our vision is simple: merchants should focus on their customers and growth, while intelligent systems handle everything else."
                : "We built WooCommerce core at Automattic — the parts that matter in production: performance, payments, reliability. Earlier we were founding-era engineers at HackerRank (Y Combinator), where the team scaled the company from $2M to $30M ARR. That's why we can operate your store end-to-end, not just host it."
              }
            </p>
          </div>

          <div className="team-visual">
            <div className="founders-grid">
              {founders.map((founder, index) => (
                <div key={index} className="founder-card">
                  <div className="founder-photo-wrapper">
                    <img src={founder.photo} alt={founder.name} className="founder-photo" loading="lazy" decoding="async" width="640" height="780" />
                  </div>
                  <div className="founder-info">
                    <h3 className="founder-name">{founder.name}</h3>
                    <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="founder-linkedin">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation - Integrated into Team Section */}
        <div className="integrated-footer">
          <div className="footer-links-grid">
            {/* Column 1: Product */}
            <div className="footer-column">
              <h3 className="footer-column-title">PRODUCT</h3>
              <nav className="footer-nav">
                <Link to="/woocommerce">For WooCommerce</Link>
                <a href="https://docs.urumi.ai/" target="_blank" rel="noopener noreferrer">Docs</a>
                <Link to="/blog">Blog</Link>
              </nav>
            </div>

            {/* Column 2: Company */}
            <div className="footer-column">
              <h3 className="footer-column-title">COMPANY</h3>
              <nav className="footer-nav">
                <Link to="/careers">Careers</Link>
              </nav>
            </div>

            {/* Column 3: Case Studies */}
            <div className="footer-column">
              <h3 className="footer-column-title">CASE STUDIES</h3>
              <nav className="footer-nav">
                <Link to="/gruum-case-study">Gruum</Link>
              </nav>
            </div>
          </div>

          {/* Legal Links */}
          <div className="footer-legal">
            <Link to="/privacy-policy-2">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms of Service</Link>
            <span className="footer-copyright">© {new Date().getFullYear()} Urumi. All Rights Reserved</span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default TeamCredentials;
