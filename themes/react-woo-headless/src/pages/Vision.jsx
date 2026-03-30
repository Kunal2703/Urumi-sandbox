/**
 * Vision Page Component
 *
 * Showcases Urumi's vision for Agentic AI eCommerce
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-vision.php
 * When updating content, BOTH files must be kept in sync!
 *
 * @author Urumi.ai
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import VideoHeroBackground from '../components/VideoHeroBackground';
import FormCollapse from '../components/FormCollapse';
import TeamCredentials from '../components/TeamCredentials';
import '../styles/Vision.css';

function Vision() {
  const sectionsRef = useRef([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef(null);

  // Function to handle form toggle and scroll
  const handleDemoClick = (e) => {
    e.preventDefault();
    setIsFormOpen(true);

    // Scroll to form after a small delay to allow state update
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    document.title = 'Urumi - Agentic AI eCommerce Platform | Intelligent WooCommerce Infrastructure';
    window.scrollTo(0, 0);

    // Listen for custom event from header
    const handleHeaderDemoClick = () => {
      setIsFormOpen(true);
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    };

    window.addEventListener('openDemoForm', handleHeaderDemoClick);

    // Scroll-triggered animation observer
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vision-section-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sectionsRef.current.forEach(section => {
      if (section) {
        observer.observe(section);
      }
    });

    // Cleanup
    const currentSections = sectionsRef.current;

    // Preload WooCommerce page assets in the background
    const preloadWooCommercePage = () => {
      // Preload the route
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/urumi-for-woocommerce';
      link.as = 'document';
      document.head.appendChild(link);

      // Preload critical images from WooCommerce page
      const images = [
        '/wp-content/themes/react-woo-headless/public/urumi-logo.webp',
        '/wp-content/themes/react-woo-headless/dist/hero-background.mp4'
      ];

      images.forEach(src => {
        const imgLink = document.createElement('link');
        imgLink.rel = 'prefetch';
        imgLink.href = src;
        document.head.appendChild(imgLink);
      });
    };

    // Start preloading after a short delay to prioritize current page
    const preloadTimer = setTimeout(preloadWooCommercePage, 2000);

    return () => {
      clearTimeout(preloadTimer);
      currentSections.forEach(section => {
        if (section) {
          observer.unobserve(section);
        }
      });
      window.removeEventListener('openDemoForm', handleHeaderDemoClick);
    };
  }, []);


  return (
    <div className="vision-page">
      {/* Hero Section with Video */}
      <VideoHeroBackground className="vision-hero">
        <div className="vision-hero-content">
          <h1 className="vision-hero-title">
            <span className="vision-gradient-text">OK OK WORKSPACE</span><br />
            <span className="vision-dark-text">SEEMS TO BE WORKING</span>
          </h1>

          <p className="vision-hero-subtitle">
            eCommerce re-imagined and re-built for the AI era.
          </p>

          {/* CTA Buttons */}
          <div className="vision-hero-cta">
            <div className="vision-hero-cta-buttons">
              <Link
                to="/urumi-for-woocommerce"
                className="btn btn-primary"
              >
                For WooCommerce
              </Link>
              <a
                href="https://app.urumi.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Sign In
              </a>
            </div>

            {/* Case Study Logo CTA */}
            <Link to="/gruum-case-study" className="case-study-hero-link">
              <span className="case-study-hero-pill">
                READ THEIR STORY
                <span className="case-study-pill-arrow">↗</span>
              </span>
              <img
                src={`${window.wpData?.themePath || '/wp-content/themes/react-woo-headless'}/public/gruum-logo.svg`}
                alt="grüum"
                className="case-study-hero-logo"
              />
            </Link>
          </div>

          {/* Video Container with Glass Effect */}
          <div className="vision-video-wrapper">
            <video
              className="vision-video"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            >
              <source src="/wp-content/uploads/Demovideo-2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </VideoHeroBackground>

      {/* Vision Content Sections */}
      <section className="vision-content">
        <div className="vision-content-wrapper">

          {/* Section 1: Our Vision */}
          <div className="vision-section vision-scroll-section" ref={el => sectionsRef.current[0] = el}>
            <h2 className="vision-section-title">Our Vision</h2>
            <p className="vision-section-text">
              We believe eCommerce should be effortless. Today, launching and growing an online store
              takes weeks of your time, requires coordinating dozens of agencies and freelancers,
              and costs thousands of dollars before you even make your first sale.
            </p>
            <p className="vision-section-text">
              This shouldn't be the reality. Merchants should focus on what matters: growing their business
              and executing their ideas. Our deeply integrated AI platform handles the rest: infrastructure,
              optimization, scaling, technical decisions, and all the complexity that currently holds
              merchants back.
            </p>
            <p className="vision-section-text">
              That's the future we're building. Effortless eCommerce where AI takes care of the technical
              burden, so you can focus entirely on your customers and growth.
            </p>
            <p className="vision-section-text" style={{ marginTop: '2rem' }}>
              <Link to="/urumi-for-woocommerce" className="vision-inline-link">
                Check out how we are transforming WooCommerce →
              </Link>
            </p>
          </div>

          {/* Section 2: Three Pillars - COMMENTED OUT FOR NOW */}
          {/* <div className="vision-section">
            <h2 className="vision-section-title">Built on Three Pillars</h2>

            <div className="vision-pillars-grid">
              <div className="vision-pillar-card">
                <div className="vision-pillar-icon">🤖</div>
                <h3 className="vision-pillar-title">Agentic Intelligence</h3>
                <p className="vision-pillar-text">
                  AI that doesn't just assist—it acts. Our agents manage deployments,
                  optimize performance, and scale infrastructure autonomously while you focus on growth.
                </p>
              </div>

              <div className="vision-pillar-card">
                <div className="vision-pillar-icon">⚡</div>
                <h3 className="vision-pillar-title">Zero-Compromise Performance</h3>
                <p className="vision-pillar-text">
                  Sub-100ms response times, instant autoscaling, and 99.99% uptime aren't
                  aspirations—they're guarantees. Built on enterprise-grade infrastructure.
                </p>
              </div>

              <div className="vision-pillar-card">
                <div className="vision-pillar-icon">🚀</div>
                <h3 className="vision-pillar-title">Developer Experience</h3>
                <p className="vision-pillar-text">
                  Generate plugins in natural language. Deploy with git push. Monitor with
                  AI-powered insights. Like having a senior dev team on call 24/7.
                </p>
              </div>
            </div>
          </div> */}

          {/* Section 3: Why Now */}
          <div className="vision-section vision-scroll-section" ref={el => sectionsRef.current[1] = el}>
            <h2 className="vision-section-title">Why Now?</h2>

            <div className="vision-why-grid">
              <div className="vision-why-card">
                <h4 className="vision-why-heading">eCommerce is too complex</h4>
                <p className="vision-why-text">
                  Building and running an online store requires juggling multiple agencies, freelancers,
                  and platforms. Technical complexity takes time away from what matters: growing your business
                  and serving your customers.
                </p>
              </div>

              <div className="vision-why-card">
                <h4 className="vision-why-heading">AI is finally ready</h4>
                <p className="vision-why-text">
                  Breakthroughs in LLMs and autonomous agents mean AI can understand
                  complex systems, make nuanced decisions, and act with minimal supervision.
                  The technology to make eCommerce effortless finally exists.
                </p>
              </div>

              <div className="vision-why-card">
                <h4 className="vision-why-heading">Commerce platforms need evolution</h4>
                <p className="vision-why-text">
                  Modern commerce platforms deserve more than just hosting. They need intelligent systems
                  that understand your business, anticipate your needs, and handle the technical burden
                  so merchants can focus on growth.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: What We're Building */}
          <div className="vision-section vision-scroll-section" ref={el => sectionsRef.current[2] = el}>
            <h2 className="vision-section-title">What We're Building</h2>

            <div className="vision-timeline">
              <div className="vision-timeline-item">
                <div className="vision-timeline-label">Today</div>
                <h4 className="vision-timeline-heading">Transforming WooCommerce</h4>
                <p className="vision-timeline-text">
                  An intelligent platform that never slows down, combined with an AI Co-pilot that
                  increases your team's efficiency. Create themes, build plugins, and make changes in
                  minutes what used to take days.
                </p>
              </div>

              <div className="vision-timeline-item">
                <div className="vision-timeline-label">Next</div>
                <h4 className="vision-timeline-heading">Shop Assistant Agent</h4>
                <p className="vision-timeline-text">
                  The future of shopping is going to be: "I want badminton shoes delivered today."
                  Urumi will help power natural search, making it effortless for customers to find
                  exactly what they need.
                </p>
              </div>

              <div className="vision-timeline-item">
                <div className="vision-timeline-label">Future</div>
                <h4 className="vision-timeline-heading">Marketing Copilot</h4>
                <p className="vision-timeline-text">
                  Boost your creative team's productivity. Our system will tell you which kinds of ads
                  are working and help create assets, turning marketing insights into action automatically.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section - Moved before Team */}
      <section className="vision-cta vision-scroll-section" ref={el => sectionsRef.current[3] = el}>
        <div className="vision-cta-content">
          <h2 className="vision-cta-title">Ready for Effortless eCommerce?</h2>
          <p className="vision-cta-text">
            Join merchants who are tired of juggling agencies, fighting technical complexity,
            and wasting time on infrastructure. Focus on growing your business while our AI platform
            handles everything else.
          </p>
          <div className="vision-cta-buttons">
            <a
              href="/urumi-for-woocommerce"
              className="btn btn-primary btn-lg"
            >
              For WooCommerce
            </a>
            <a
              href="#demo-form-section"
              onClick={handleDemoClick}
              className="btn btn-outline btn-lg"
            >
              Demo with Founders
            </a>
          </div>
        </div>
      </section>

      {/* Footer Section with Pearl Gradient */}
      <div className="footer-section">
        <TeamCredentials />
      </div>

      {/* Demo Form Collapse Section */}
      <FormCollapse
        ref={formRef}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        formUrl="https://docs.google.com/forms/d/e/1FAIpQLScIEQm-Q80VoT3FLiWuk8XbRcLCbL1BxbZeLysd1ckBfDt3lw/viewform?embedded=true"
        title="Demo with Founders"
      />
    </div>
  );
}

export default Vision;
