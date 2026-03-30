/**
 * Footer Component
 * Site-wide footer with links and branding
 *
 * @author Urumi.ai
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const themeUrl = window.wpData?.themePath || '';
  const location = useLocation();
  const isVisionPage = location.pathname === '/';

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Centered Brand Section */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={`${themeUrl}/public/urumi-logo.webp`} alt="Urumi" className="footer-logo-image" />
            <span className="footer-logo-text">Urumi</span>
          </Link>
          <p className="footer-tagline">
            {isVisionPage
              ? "The first AI-native eCommerce platform. Effortless commerce where intelligent systems handle the complexity, so you can focus on growing your business."
              : "Ultra-fast managed WooCommerce hosting with autoscaling, multi-zone reliability, and performance guardrails. Built for stores that can't afford downtime."
            }
          </p>
        </div>

        {/* Links Grid - 3 Columns */}
        <div className="footer-links-grid">
          {/* Column 1: Product */}
          <div className="footer-column">
            <h3 className="footer-column-title">PRODUCT</h3>
            <nav className="footer-nav">
              <Link to="/urumi-for-woocommerce">For WooCommerce</Link>
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

        {/* Bottom Row - Legal Links + Copyright */}
        <div className="footer-bottom">
          <div className="footer-legal">
            <Link to="/privacy-policy-2">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms of Service</Link>
          </div>
          <div className="footer-copyright">
            © {currentYear} Urumi. All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
