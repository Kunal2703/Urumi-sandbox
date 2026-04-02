/**
 * Main App Component - Enterprise Landing Page
 *
 * React WooCommerce Headless Theme
 * @author Urumi.ai
 */

import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Lazy-load all page components — each becomes its own JS chunk
// Only the code for the current page is downloaded
const Vision = lazy(() => import('./pages/Vision'));
const UrumiForWooCommerce = lazy(() => import('./pages/UrumiForWooCommerce'));
const WooCommerceAgencyPage = lazy(() => import('./pages/WooCommerceAgencyPage'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Page = lazy(() => import('./pages/Page'));
const Careers = lazy(() => import('./pages/Careers'));
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const EnvVar = lazy(() => import('./pages/EnvVar'));

function Header({ agencyLaunchProgress = 0 }) {
  const location = useLocation();
  const isWooCommercePage = location.pathname === '/urumi-for-woocommerce';
  const isVisionPage = location.pathname === '/';
  const isAgencyPage = location.pathname === '/woocommerce-agency-page';

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleDemoClick = (e) => {
    if (isVisionPage || isWooCommercePage) {
      e.preventDefault();
      // Dispatch custom event for Vision and WooCommerce pages to handle
      window.dispatchEvent(new CustomEvent('openDemoForm'));
    }
    // For other pages, let default behavior happen (external link)
  };

  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';

  // Calculate background color based on launch progress (same as AgencyHero)
  const getLaunchBackground = (progress) => {
    const colorStops = [
      { pos: 0, color: '#A7D8F5' },     // light sky
      { pos: 0.25, color: '#4A90E2' },  // mid blue
      { pos: 0.42, color: '#0B2D5C' },  // deep navy
      { pos: 0.58, color: '#020B1A' },  // near black
      { pos: 0.75, color: '#000000' },  // space
      { pos: 1.0, color: '#000000' }    // stay black through end
    ];

    // Clamp to last stop when beyond range
    if (progress >= colorStops[colorStops.length - 1].pos) {
      return colorStops[colorStops.length - 1].color;
    }
    if (progress <= colorStops[0].pos) {
      return colorStops[0].color;
    }

    let lowerStop = colorStops[0];
    let upperStop = colorStops[1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (progress >= colorStops[i].pos && progress <= colorStops[i + 1].pos) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }

    const range = upperStop.pos - lowerStop.pos;
    const localProgress = range > 0 ? (progress - lowerStop.pos) / range : 0;

    const lerp = (c1, c2, t) => {
      const r1 = parseInt(c1.slice(1, 3), 16);
      const g1 = parseInt(c1.slice(3, 5), 16);
      const b1 = parseInt(c1.slice(5, 7), 16);
      const r2 = parseInt(c2.slice(1, 3), 16);
      const g2 = parseInt(c2.slice(3, 5), 16);
      const b2 = parseInt(c2.slice(5, 7), 16);
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      return `rgb(${r}, ${g}, ${b})`;
    };

    return lerp(lowerStop.color, upperStop.color, localProgress);
  };

  const headerBackgroundColor = isAgencyPage ? getLaunchBackground(agencyLaunchProgress) : undefined;
  const isDarkMode = isAgencyPage && agencyLaunchProgress > 0.4;

  // Dynamic text colors for agency page
  const navLinkStyle = isDarkMode ? { color: 'rgba(255, 255, 255, 0.95)' } : undefined;
  const ctaStyle = isDarkMode ? {
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.3)'
  } : undefined;

  return (
    <header
      className="site-header"
      style={{ backgroundColor: headerBackgroundColor }}
      data-dark-mode={isDarkMode ? "true" : "false"}
    >
      <div className="header-content">
        <Link to="/?utm_source=header&utm_medium=logo&utm_campaign=navigation" className="site-logo">
          <img src={`${themeUrl}/public/urumi-logo.webp`} alt="Urumi" className="logo-image" />
          <span className="logo-text" style={navLinkStyle}>Urumi</span>
        </Link>
        <nav className="site-nav">
          {isWooCommercePage ? (
            <>
              <a onClick={() => scrollToSection('features')} className="nav-link" style={navLinkStyle}>Features</a>
              <a onClick={() => scrollToSection('benchmarks')} className="nav-link" style={navLinkStyle}>Performance</a>
              <Link to="/blog" className="nav-link nav-link-blog" style={navLinkStyle}>Blog</Link>
              <Link to="/careers" className="nav-link" style={navLinkStyle}>We're Hiring 🎉</Link>
            </>
          ) : isVisionPage ? (
            <>
              <Link to="/urumi-for-woocommerce" className="nav-link nav-link-woocommerce" style={navLinkStyle}>For WooCommerce</Link>
              <Link to="/blog" className="nav-link nav-link-blog" style={navLinkStyle}>Blog</Link>
              <Link to="/careers" className="nav-link" style={navLinkStyle}>We're Hiring 🎉</Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link" style={navLinkStyle}>Home</Link>
              <Link to="/urumi-for-woocommerce" className="nav-link nav-link-woocommerce" style={navLinkStyle}>For WooCommerce</Link>
              <Link to="/blog" className="nav-link nav-link-blog" style={navLinkStyle}>Blog</Link>
              <Link to="/careers" className="nav-link" style={navLinkStyle}>We're Hiring 🎉</Link>
            </>
          )}
          <a
            href={(isVisionPage || isWooCommercePage) ? "#demo-form-section" : "https://dashboard.urumi.ai/s/naman"}
            target={(isVisionPage || isWooCommercePage) ? "_self" : "_blank"}
            rel={(isVisionPage || isWooCommercePage) ? "" : "noopener noreferrer"}
            onClick={handleDemoClick}
            className="nav-link-cta"
            style={ctaStyle}
          >
            Demo with Founders
          </a>
        </nav>
      </div>
    </header>
  );
}

function App() {
  const [agencyLaunchProgress, setAgencyLaunchProgress] = useState(0);

  return (
    <Router>
      <div className="app luxury-theme">
        <Header agencyLaunchProgress={agencyLaunchProgress} />
        <main className="main-content">
          <Suspense fallback={<div className="page-loading" />}>
            <Routes>
              <Route path="/" element={<Vision />} /> {/* Homepage - Vision page */}
              <Route path="/urumi-for-woocommerce" element={<UrumiForWooCommerce />} />
              <Route path="/woocommerce-agency-page" element={<WooCommerceAgencyPage onLaunchProgressChange={setAgencyLaunchProgress} />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/gruum-case-study" element={<CaseStudy />} />
              <Route path="/var1" element={<EnvVar />} />
              <Route path="/var2" element={<EnvVar />} />
              <Route path="/var3" element={<EnvVar />} />
              <Route path="/terms-and-conditions" element={<Page />} />
              <Route path="/refund-policy" element={<Page />} />
              <Route path="/privacy-policy-2" element={<Page />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
