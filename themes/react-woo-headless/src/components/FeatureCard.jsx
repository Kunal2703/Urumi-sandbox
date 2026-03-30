import React, { useRef } from 'react';
import LazyLottie from './LazyLottie';
import '../styles/FeatureCard.css';

const FeatureCard = ({ painPoint, problem, solutionLabel, solutionHeading, solutionDescription, placeholder, lottieAnimation, svgImage, image, video, variant = 'pastel' }) => {
  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  return (
    <section className={`feature-card-section feature-card-${variant}`} ref={cardRef}>
      <div className={`feature-card-container${video ? ' has-video' : ''}`}>
        <div className="feature-content">
          <div className="painpoint-section">
            <span className="pain-point-label">{painPoint}</span>
            <p className="problem-text">{problem}</p>
          </div>
          <span className="solution-label">{solutionLabel}</span>
          <h2 className="solution-heading">{solutionHeading}</h2>
          <p className="solution-description">{solutionDescription}</p>
        </div>

        <div className="feature-visual">
          <div className="metric-card" ref={containerRef}>
            {video ? (
              <div className="video-container">
                <video src={`${themeUrl}/public/${video}?v=${Date.now()}`} className="feature-video" autoPlay loop muted playsInline />
              </div>
            ) : image ? (
              <div className="image-container">
                <img src={`${themeUrl}/public/${image}`} alt={solutionHeading} className="feature-image" loading="lazy" />
              </div>
            ) : svgImage ? (
              <div className="svg-container">
                <img src={`${themeUrl}/public/${svgImage}`} alt={solutionHeading} className="feature-svg-image" loading="lazy" />
              </div>
            ) : lottieAnimation ? (
              <div className="lottie-container">
                <LazyLottie
                  animationUrl={`${themeUrl}/dist/${lottieAnimation}`}
                  loop={true}
                  className="feature-lottie-animation"
                />
              </div>
            ) : (
              <div className="metric-placeholder">
                {placeholder}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCard;
