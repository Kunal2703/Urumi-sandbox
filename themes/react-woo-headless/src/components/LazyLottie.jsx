/**
 * LazyLottie Component
 * 
 * Only loads and renders Lottie animations when they scroll into view.
 * Prevents downloading 2+ MB JSON files until they're actually needed.
 *
 * @author Urumi.ai
 */

import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';

const LazyLottie = ({ animationUrl, className = '', loop = true, style = {} }) => {
  const [animationData, setAnimationData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Detect if running in an iframe (e.g., dashboard preview)
  const isInIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true; // If we can't check, assume iframe for safety
    }
  };

  // Watch for element entering viewport
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // If in iframe (dashboard preview), bypass lazy loading
    if (isInIframe()) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to trigger once
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Fetch animation JSON only when visible
  useEffect(() => {
    if (!isVisible || !animationUrl) return;

    fetch(animationUrl)
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading Lottie animation:', error));
  }, [isVisible, animationUrl]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {animationData && (
        <Lottie animationData={animationData} loop={loop} className={className} />
      )}
    </div>
  );
};

export default LazyLottie;
