/**
 * Vertical Stacked Cards Section Component
 *
 * Three cards stacked vertically, all visible at once.
 * Scroll-driven focus: as user scrolls, each card sequentially gets
 * a glow border + slight zoom while the others blur out.
 * The section stays sticky until all three cards have been highlighted.
 *
 * Cards: Case Study | Testimonials | Core Expertise
 *
 * @author Urumi.ai
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import GrowthGraph from './GrowthGraph';
import FloatingBubbles from './FloatingBubbles';
import '../styles/HorizontalSwipeSection.css';
import '../styles/FloatingBubbles.css';
import '../styles/GrowthGraph.css';

const testimonials = [
  {
    quote: "The results speak for themselves — our store has never been faster or more reliable. The Urumi team understood WooCommerce at a level we hadn't seen before.",
    author: "Sarah Chen",
    role: "Head of E-commerce, grüum",
    avatar: null,
  },
  {
    quote: "Moving to Urumi was the best decision we made. Page loads dropped dramatically and our conversion rate climbed steadily from day one.",
    author: "James Morton",
    role: "CTO, Wellness Co.",
    avatar: null,
  },
];

const HorizontalSwipeSection = () => {
  const sectionRef = useRef(null);
  // -1 = all visible (no focus), 0/1/2 = individual card focused
  const [activeCard, setActiveCard] = useState(-1);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Scroll-driven card focus
  // Zones: 0–0.08 = all visible | 0.08–0.36 = card 1 | 0.36–0.66 = card 2 | 0.66–1 = card 3
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = null;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollableDistance = sectionHeight - viewportHeight;
        if (scrollableDistance <= 0) return;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
        setScrollProgress(progress);

        // 4 zones: brief all-visible → card 1 → card 2 → card 3
        if (progress < 0.08) {
          setActiveCard(-1); // all visible, no focus
        } else if (progress < 0.36) {
          setActiveCard(0);
        } else if (progress < 0.66) {
          setActiveCard(1);
        } else {
          setActiveCard(2);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const getCardClassName = (index) => {
    const base = 'vstack-card';
    const variant =
      index === 0 ? 'vstack-card--casestudy' :
      index === 1 ? 'vstack-card--testimonial' :
      'vstack-card--expertise';

    let state;
    if (activeCard === -1) {
      // All-visible phase: every card is neutral (no blur, no glow)
      state = 'vstack-card-neutral';
    } else if (index === activeCard) {
      state = 'vstack-card-focused';
    } else {
      state = 'vstack-card-blurred';
    }
    return `${base} ${variant} ${state}`;
  };

  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';

  return (
    <section className="hswipe-section" ref={sectionRef}>
      <div className="hswipe-sticky">
        {/* Section header */}
        <div className="hswipe-header">
          <span className="hswipe-eyebrow">Why merchants choose us ✦</span>
        </div>

        {/* Vertical stacked cards */}
        <div className="vstack-cards-container">
          {/* Card 1: Case Study */}
          <div className={getCardClassName(0)}>
            <div className="vstack-card-inner">
              <span className="hswipe-tag">Case Study</span>
              <div className="hswipe-casestudy-logo-row">
                <span className="hswipe-casestudy-phonetic">/gr-oo-m/</span>
              </div>
              <div className="hswipe-stats-row">
                <div className="hswipe-stat">
                  <span className="hswipe-stat-number">3×</span>
                  <span className="hswipe-stat-label">Faster page loads</span>
                </div>
                <div className="hswipe-stat">
                  <span className="hswipe-stat-number">99.99%</span>
                  <span className="hswipe-stat-label">Uptime achieved</span>
                </div>
                <div className="hswipe-stat">
                  <span className="hswipe-stat-number">+30%</span>
                  <span className="hswipe-stat-label">Conversion lift</span>
                </div>
              </div>
              <p className="hswipe-casestudy-desc">
                grüum migrated to Urumi and saw immediate improvements in speed,
                reliability, and revenue performance.
              </p>
              <div className="hswipe-casestudy-bottom">
                <GrowthGraph />
                <Link to="/gruum-case-study" className="hswipe-casestudy-link">
                  See full case study →
                </Link>
              </div>
            </div>
          </div>          {/* Card 2: Testimonials - Sticker Board */}
          <div className={getCardClassName(1)}>
            <div className="vstack-card-inner testimonial-card-alive sticker-board">
              {/* Testimonial heading */}
              <span className="hswipe-tag sticker-board-tag">Testimonial</span>
              {/* Cork board texture overlay */}
              <div className="sticker-board-texture" aria-hidden="true"></div>
              
              {/* Sticky Note 1 - Top, offset left */}
              <div className="sticky-note sticky-note--top sticky-note--tilt-left">
                <div className="sticky-note-tape" aria-hidden="true"></div>
                <div className="sticky-note-content">
                  <div className="sticky-note-stars">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="sticky-note-star">{String.fromCharCode(9733)}</span>
                    ))}
                  </div>
                  <blockquote className="sticky-note-quote">&ldquo;{testimonials[0].quote}&rdquo;</blockquote>
                  <div className="sticky-note-author">
                    <span className="sticky-note-author-name">&mdash; {testimonials[0].author}</span>
                    <span className="sticky-note-author-role">{testimonials[0].role}</span>
                  </div>
                </div>
              </div>

              {/* Sticky Note 2 - Bottom */}
              <div className="sticky-note sticky-note--bottom sticky-note--tilt-right">
                <div className="sticky-note-tape" aria-hidden="true"></div>
                <div className="sticky-note-content">
                  <div className="sticky-note-stars">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="sticky-note-star">{String.fromCharCode(9733)}</span>
                    ))}
                  </div>
                  <blockquote className="sticky-note-quote">&ldquo;{testimonials[1].quote}&rdquo;</blockquote>
                  <div className="sticky-note-author">
                    <span className="sticky-note-author-name">&mdash; {testimonials[1].author}</span>
                    <span className="sticky-note-author-role">{testimonials[1].role}</span>
                  </div>
                </div>
              </div>

              {/* Decorative push pins */}
              <div className="push-pin push-pin--1" aria-hidden="true"></div>
              <div className="push-pin push-pin--2" aria-hidden="true"></div>
            </div>
          </div>


          {/* Card 3: Expertise */}
          <div className={getCardClassName(2)}>
            <div className="vstack-card-inner">
              <span className="hswipe-tag">Our Team</span>
              <h3 className="hswipe-expertise-heading">
                Core-level WooCommerce expertise
              </h3>
              <p className="hswipe-expertise-desc">
                Our engineers contribute to WooCommerce core. We don't just use the platform —
                we help build it. That means faster debugging, better architecture, and solutions
                others simply can't offer.
              </p>
              <div className="hswipe-expertise-badges">
                <span className="hswipe-badge">WooCommerce Core</span>
                <span className="hswipe-badge">Gutenberg Blocks</span>
                <span className="hswipe-badge">REST API</span>
                <span className="hswipe-badge">Performance</span>
                <span className="hswipe-badge">HPOS</span>
              </div>
              {/* Floating team & logo bubbles */}
              <FloatingBubbles themeUrl={themeUrl} />
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="vstack-cta-row">
          <span className="vstack-cta-text">Want results like this?</span>
          <Link to="/contact" className="vstack-cta-button">Get a free audit</Link>
        </div>
      </div>
    </section>
  );
};

export default HorizontalSwipeSection;
