/**
 * Case Study Page Component
 *
 * Displays detailed customer success stories
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-case-study.php
 * When updating content, BOTH files must be kept in sync!
 *
 * @author Urumi.ai
 */

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import TeamCredentials from '../components/TeamCredentials';
import '../styles/CaseStudy.css';

function CaseStudy() {
  const location = useLocation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when component loads
    window.scrollTo(0, 0);

    // Extract slug from path (e.g., /gruum-case-study -> gruum-case-study)
    const slug = location.pathname.replace(/^\//, '').replace(/\/$/, '');

    // Try to load SSR data first (server-side rendered)
    const ssrDataElement = document.getElementById('ssr-page-data');

    if (ssrDataElement) {
      try {
        const ssrData = JSON.parse(ssrDataElement.textContent);
        if (ssrData) {
          setPage(ssrData);
          document.title = `${ssrData.title?.rendered || 'Case Study'} | Urumi`;
          setLoading(false);
          ssrDataElement.remove();
          return;
        }
      } catch (err) {
        console.error('Error parsing SSR data:', err);
      }
    }

    // Fallback to REST API if SSR data not available
    const restUrl = window.wpData?.restUrl || '/wp-json/';
    const apiUrl = restUrl.endsWith('/') ? `${restUrl}wp/v2/` : `${restUrl}/wp/v2/`;

    fetch(`${apiUrl}pages?slug=${slug}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch page');
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setPage(data[0]);
          document.title = `${data[0].title?.rendered || 'Case Study'} | Urumi`;
        } else {
          setError('Page not found');
          document.title = 'Page Not Found | Urumi';
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching page:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="case-study-loading">
        <div className="spinner"></div>
        <p>Loading case study...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="case-study-error">
        <h2>Case Study Not Found</h2>
        <p>The case study you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="back-to-home">← Back to Home</Link>
      </div>
    );
  }

  // Get featured image from _embedded data
  const getFeaturedImage = () => {
    if (page._embedded && page._embedded['wp:featuredmedia']) {
      return page._embedded['wp:featuredmedia'][0].source_url;
    }
    // Fallback to gruum cover if no featured image
    return '/wp-content/uploads/2025/02/gruum-case-study-cover.webp';
  };

  return (
    <div className="case-study-page">
      {/* Case Study Content */}
      <article className="case-study-article">
        <div className="case-study-container">
          {/* Main Headline */}
          <header className="case-study-header">
            <h1 className="case-study-headline">
              How Urumi increased grüum's user satisfaction rate by 294%
            </h1>
          </header>

          {/* Cover Image after headline */}
          <section className="case-study-hero">
            <div className="case-study-hero-image">
              <img
                src={getFeaturedImage()}
                alt={page.title.rendered}
              />
            </div>
          </section>

          {/* The Context */}
          <section className="case-study-section">
            <h2 className="case-study-section-title">The Context</h2>

            <p className="case-study-body">
              When Urumi engaged with <a href="https://gruum.com" target="_blank" rel="noopener noreferrer">grüum.com</a>, the team wanted to resolve performance instability that was directly affecting customer experience. Cached LCP would climb to 5–7 seconds, and intermittent cold starts could take up to ~40 seconds.
            </p>

            <div className="case-study-stat-callout">
              "I'm very happy with the results," says George, founder of grüum. "The biggest performance improvements we've seen from you guys."
            </div>
          </section>

          {/* The Shift */}
          <section className="case-study-section">
            <h2 className="case-study-section-title">The Shift</h2>

            <p className="case-study-body">
              Urumi worked directly with George and the grüum team to identify root causes across caching, server configuration, and application hot paths. The focus was on fixing both the "everyday" slow paths and the unpredictable extremes that make a site feel unreliable.
            </p>

            <p className="case-study-body">
              From this work, grüum saw a shift around:
            </p>

            <ul className="case-study-list">
              <li>Cloudflare + caching misconfigurations were identified and fixed</li>
              <li>Performance hot paths were identified and fixed, with a patch provided to the WooCommerce Product Bundles team</li>
              <li>Server configuration was optimized so workers could use the available infra more effectively</li>
              <li>Latency-inducing N+1 query issues were fixed (traces went to almost 0 post-deploy)</li>
              <li>Cold starts caused by unoptimized PHP worker config were eliminated</li>
            </ul>

            <p className="case-study-body">
              The grüum team immediately saw the difference. Cached requests went from <strong>4s to 0.3s</strong>. Uncached requests dropped from <strong>5.7s to 2.7s</strong>.
            </p>
          </section>

          {/* The Outcomes */}
          <section className="case-study-section">
            <h2 className="case-study-section-title">The Outcomes</h2>

            <p className="case-study-body">
              After Urumi's changes were deployed, grüum's New Relic data showed <strong>~294% improvement</strong> in % satisfied users.
            </p>

            <p className="case-study-body">
              The grüum team validated the improvements with stress tests mimicking real user journeys (browse → login → add to cart → order):
            </p>

            <ul className="case-study-list">
              <li>Average response time: 740ms with p95 at 3.03s</li>
              <li>Stress testing: Avg 770.09ms, Median 314.14ms, P90 1620ms</li>
              <li>Peak throughput: 358.49 req/s (uncached), p90 under ~2s at 300 VU</li>
            </ul>

            <p className="case-study-body">
              They went from customers abandoning checkout due to timeouts to completing orders without friction.
            </p>
          </section>

          {/* What's Next */}
          <section className="case-study-section">
            <h2 className="case-study-section-title">What's Next</h2>

            <p className="case-study-body">
              Our engagement with grüum is ongoing for further optimization to improve performance and stability. We also ran a GCP POC vs their current Hetzner setup, which brought P99 to <strong>&lt;900ms</strong> (uncached) and showed improvements like avg <strong>740ms → 378ms</strong> and p95 <strong>3.03s → 1.27s</strong>.
            </p>

            <div className="case-study-stat-callout">
              "The results speak for themselves—I'm really happy we worked with Urumi," says George, founder of grüum.
            </div>
          </section>

          {/* Key Results Summary */}
          <section className="case-study-section">
            <h2 className="case-study-section-title">Key Results</h2>
            <ul className="case-study-list">
              <li><strong>294%</strong> improvement in user satisfaction</li>
              <li><strong>4s → 0.3s</strong> cached response time</li>
              <li><strong>5.7s → 2.7s</strong> uncached response time</li>
              <li><strong>358 req/s</strong> peak throughput (uncached)</li>
              <li><strong>Checkout fixed</strong> — no more abandoned orders from timeouts</li>
            </ul>
            <p className="case-study-body" style={{ marginTop: '2rem' }}>
              <Link to="/urumi-for-woocommerce" className="case-study-cta-link">Learn more about Urumi for WooCommerce →</Link>
            </p>
          </section>
        </div>
      </article>

      {/* CTA Section */}
      <section className="case-study-cta">
        <div className="case-study-cta-content">
          <h3>Ready to scale your WooCommerce store?</h3>
          <p>Get a free performance audit from the Urumi team. We'll analyze your infrastructure, traffic patterns, and deployment workflow to identify critical performance and reliability risks.</p>
          <a
            href="https://dashboard.urumi.ai/s/naman"
            target="_blank"
            rel="noopener noreferrer"
            className="case-study-cta-btn"
          >
            Get a free audit →
          </a>
        </div>
      </section>

      {/* Team Credentials Footer */}
      <div className="footer-section">
        <TeamCredentials />
      </div>
    </div>
  );
}

export default CaseStudy;
