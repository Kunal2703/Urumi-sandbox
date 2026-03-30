/**
 * Video Hero Background Component
 * Reusable video background with interactive mesh gradient effect
 * @author Urumi.ai
 */

import React, { useState, useEffect, useRef } from 'react';
import '../styles/VideoHeroBackground.css';

const VideoHeroBackground = ({ children, className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const heroRef = useRef(null);
  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';

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
    <div className={`video-hero-background ${className}`} ref={heroRef}>
      {/* Background Video */}
      <video
        className="video-hero-bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={`${themeUrl}/dist/hero-background.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="video-hero-bg-overlay"></div>

      {/* Interactive Mesh Gradient */}
      <div
        className="video-hero-bg-mesh"
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`
        }}
      ></div>

      {/* Fade at bottom */}
      <div className="video-hero-bg-fade"></div>

      {/* Content */}
      <div className="video-hero-bg-content">
        {children}
      </div>
    </div>
  );
};

export default VideoHeroBackground;
