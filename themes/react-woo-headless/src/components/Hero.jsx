import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LazyLottie from './LazyLottie';
import '../styles/Hero.css';

const Hero = () => {
  // Get theme directory URL from WordPress
  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';

  // Rotating words for enterprise messaging
  const rotatingWords = ['fast', 'stable', 'reliable'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass('fade-out');

      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
        setFadeClass('fade-in');
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Track mouse movement for mesh effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div className="hero-section" ref={heroRef}>
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={`${themeUrl}/dist/hero-background.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="hero-overlay"></div>

      {/* Interactive Mesh Gradient */}
      <div
        className="hero-mesh"
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`
        }}
      ></div>

      <div className="hero-fade"></div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="hero-title-dark">Enterprise WooCommerce hosting, that </span>
            <span className="hero-title-light">we guarantee</span>
            <span className="hero-title-dark"> never slows down</span>
          </h1>

          <p className="hero-subtitle">
            Not just hosting. We operate WooCommerce like a mission-critical system: scale for spikes, ship safely, and stay{' '}
            <span className={`rotating-word ${fadeClass}`}>
              {rotatingWords[currentWordIndex]}
            </span>{' '}
            over time.
          </p>

          <div className="hero-cta-wrapper">
            <div className="hero-cta">
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
              <a
                href="#demo-form-section"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('openDemoForm'));
                }}
                className="btn btn-outline"
              >
                Demo with Founders
              </a>
            </div>

            {/* Case Study Logo CTA */}
            <Link to="/gruum-case-study" className="hero-case-study-link">
              <span className="hero-case-study-pill">
                READ THEIR STORY
                <span className="case-study-pill-arrow">↗</span>
              </span>
              <img
                src={`${themeUrl}/public/gruum-logo.svg`}
                alt="grüum"
                className="hero-case-study-logo"
              />
            </Link>
          </div>
        </div>

        <div className="hero-animation">
          <div className="hero-svg-placeholder">
            <LazyLottie
              animationUrl={`${themeUrl}/public/world-animation.json`}
              loop={true}
              className="lottie-animation"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
