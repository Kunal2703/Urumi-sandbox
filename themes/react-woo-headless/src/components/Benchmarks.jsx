import React, { useState, useEffect, useRef } from 'react';
import '../styles/Benchmarks.css';

const CountUpMetric = ({ value, suffix = '', useComma = false }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const targetValue = parseFloat(value);
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = targetValue / steps;
            const stepDuration = duration / steps;

            let currentStep = 0;

            const timer = setInterval(() => {
              currentStep++;
              const newValue = Math.min(increment * currentStep, targetValue);
              setCount(newValue);

              if (currentStep >= steps) {
                clearInterval(timer);
                setCount(targetValue);
              }
            }, stepDuration);

            return () => clearInterval(timer);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value, hasAnimated]);

  let formattedValue;
  if (suffix === ' ms') {
    formattedValue = count.toFixed(2);
  } else {
    const roundedValue = Math.round(count);
    formattedValue = useComma ? roundedValue.toLocaleString() : roundedValue;
  }

  return (
    <div className="metric-value" ref={elementRef}>
      {formattedValue}<span className="metric-unit">{suffix}</span>
    </div>
  );
};

// Sparkline SVG Component
const Sparkline = ({ variant = 'default' }) => {
  // Generate subtle wave pattern based on variant
  const paths = {
    cart: 'M0,18 Q25,12 50,14 T100,16 T150,12 T200,15',
    checkout: 'M0,16 Q25,14 50,18 T100,14 T150,16 T200,14',
    account: 'M0,15 Q25,16 50,12 T100,15 T150,14 T200,16',
    throughput: 'M0,14 Q25,10 50,16 T100,12 T150,14 T200,13'
  };

  const path = paths[variant] || paths.default;

  return (
    <div className="metric-sparkline">
      <svg viewBox="0 0 200 24" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`sparklineGradient-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Optional baseline */}
        <line x1="0" y1="20" x2="200" y2="20" className="sparkline-baseline" />
        {/* Fill under line */}
        <path d={`${path} L200,24 L0,24 Z`} fill={`url(#sparklineGradient-${variant})`} />
        {/* Sparkline path */}
        <path d={path} className="sparkline-path" />
      </svg>
    </div>
  );
};

const Benchmarks = () => {
  return (
    <section className="benchmarks-section">
      <div className="benchmarks-container">
        <div className="benchmarks-text-block">
          <h2 className="benchmarks-headline">Enterprise-grade performance, proven</h2>
          <p className="benchmarks-subheading">
            We stress-tested end-to-end shopping journeys (browse → login → add to cart → checkout) using the official WooCommerce k6 tests adapted for this store.
          </p>
          <p className="benchmarks-note">Note: Cloudflare cache disabled to measure raw server performance.</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-tile">
            <div className="metric-label">Cart</div>
            <CountUpMetric value="236.22" suffix=" ms" />
            <div className="metric-caption">median response time</div>
            <Sparkline variant="cart" />
          </div>

          <div className="metric-tile">
            <div className="metric-label">Checkout</div>
            <CountUpMetric value="321.23" suffix=" ms" />
            <div className="metric-caption">median response time</div>
            <Sparkline variant="checkout" />
          </div>

          <div className="metric-tile">
            <div className="metric-label">My Account</div>
            <CountUpMetric value="246.35" suffix=" ms" />
            <div className="metric-caption">median response time</div>
            <Sparkline variant="account" />
          </div>

          <div className="metric-tile">
            <div className="metric-label">Peak throughput</div>
            <CountUpMetric value="524" suffix=" rps" useComma={false} />
            <div className="metric-caption">requests per second</div>
            <Sparkline variant="throughput" />
          </div>
        </div>

        <div className="benchmarks-badge">
          <span className="badge-icon">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,8 6,11 13,4" />
            </svg>
          </span>
          Load test: 7,861 orders in &lt; 2 minutes
        </div>
      </div>
    </section>
  );
};

export default Benchmarks;
