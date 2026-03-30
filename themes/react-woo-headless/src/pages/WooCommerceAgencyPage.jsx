/**
 * WooCommerce Agency Page Component
 *
 * Enterprise WooCommerce hosting features and benefits
 * Route: /woocommerce-agency-page
 *
 * Note: The actual homepage (/) is the Vision page (Vision.jsx)
 *
 * @author Urumi.ai
 */

import { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import FaqCta from '../components/FaqCta';
import PainpointFlipCards from '../components/PainpointFlipCards';
import PerformanceGuardrails from '../components/PerformanceGuardrails';
import HorizontalSwipeSection from '../components/HorizontalSwipeSection';
import FormCollapse from '../components/FormCollapse';
// Lottie import removed — handled by LazyLottie in child components
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

// Cache reduced-motion preference once at module level (avoids per-frame DOM query)
const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Static cloud data — defined outside component to avoid re-creation on every render
const CLOUDS = [
  {
    id: 1,
    headline: 'CSAT score increase',
    metric: '+294% (post-fix)',
    start: 0.05,
    end: 0.30,
    xPosition: '50%',
    zIndex: 1,
    drift: -4
  },
  {
    id: 2,
    headline: 'Cached requests',
    metric: '4s to 0.3s',
    start: 0.09,
    end: 0.34,
    xPosition: '55%',
    zIndex: 3,
    drift: 5
  },
  {
    id: 3,
    headline: 'Uncached requests',
    metric: '5.7 to 2.7s',
    start: 0.13,
    end: 0.38,
    xPosition: '42%',
    zIndex: 1,
    drift: -3
  },
  {
    id: 4,
    headline: 'Checkout fixed',
    metric: 'No more failed orders',
    start: 0.17,
    end: 0.42,
    xPosition: '50%',
    zIndex: 3,
    drift: 4
  }
];

// Easing function — pure, no allocation
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Cloud Layer Component - Memoized to skip re-renders when progress hasn't meaningfully changed
const CloudLayer = memo(({ progress, heroHeight }) => {
  const height = heroHeight || window.innerHeight;

  if (PREFERS_REDUCED_MOTION) {
    return (
      <div className="cloud-layer cloud-layer-static">
        {CLOUDS.map((cloud) => (
          <div key={cloud.id} className="launch-cloud launch-cloud-static" data-cloud={cloud.id}>
            <span className="cloud-text">
              <span className="cloud-headline">{cloud.headline}</span>
              <span className="cloud-metric">{cloud.metric}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="cloud-layer">
      {CLOUDS.map((cloud) => {
        const cloudProgress = Math.max(0, Math.min(1, (progress - cloud.start) / (cloud.end - cloud.start)));

        // Opacity: fade in 0->0.15, hold 0.15->0.75, fade out 0.75->1.0 (max 0.9 for slight transparency)
        let cloudOpacity = 0;
        if (cloudProgress > 0 && cloudProgress < 0.15) {
          cloudOpacity = (cloudProgress / 0.15) * 0.9;
        } else if (cloudProgress >= 0.15 && cloudProgress < 0.75) {
          cloudOpacity = 0.9;
        } else if (cloudProgress >= 0.75 && cloudProgress <= 1) {
          cloudOpacity = 0.9 * (1 - ((cloudProgress - 0.75) / 0.25));
        }

        // Skip invisible clouds entirely (no DOM = no composite cost)
        if (cloudOpacity <= 0) return null;

        const easedProgress = easeInOutCubic(cloudProgress);
        const yPos = -0.3 * height + 1.3 * height * easedProgress;
        const xDrift = cloud.drift * Math.sin(easedProgress * Math.PI);
        const scale = 1 + 0.01 * easedProgress;

        return (
          <div
            key={cloud.id}
            className="launch-cloud"
            data-cloud={cloud.id}
            style={{
              transform: `translate3d(${xDrift}px, ${yPos}px, 0) scale(${scale})`,
              left: cloud.xPosition,
              zIndex: cloud.zIndex,
              opacity: cloudOpacity
            }}
          >
            <span className="cloud-text">
              <span className="cloud-headline">{cloud.headline}</span>
              <span className="cloud-metric">{cloud.metric}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
});

// Rocket with Thrust Component - Scroll-driven launch behavior
const RocketWithThrust = ({ progress, themeUrl }) => {
  const rocketRef = useRef(null);

  // Calculate thrust based on scroll progress
  const getThrustIntensity = (progress) => {
    if (progress <= 0.45) {
      return 1; // Full thrust
    } else if (progress <= 0.58) {
      // Smooth fade out from 0.45 to 0.58
      const fadeProgress = (progress - 0.45) / 0.13;
      const smoothstep = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
      return 1 - smoothstep;
    }
    return 0; // Engine off in space
  };

  const thrust = getThrustIntensity(progress);
  const isThrusting = thrust > 0;

  // Use cached reduced motion preference (module-level constant)
  const prefersReducedMotion = PREFERS_REDUCED_MOTION;

  // Vibration replaced with CSS animation (rocket-vibrate) — zero JS overhead

  // Focus shift phase: rocket drifts to bottom-right and scales up (0.58 → 0.78)
  // Simulates passing by the rocket as we approach the moon
  const spaceP = progress >= 0.58 ? Math.min((progress - 0.58) / 0.20, 1) : 0;
  const smoothSpaceP = spaceP * spaceP * (3 - 2 * spaceP); // smoothstep easing

  // Rocket drift behavior during focus shift
  const driftTranslateX = isThrusting
    ? 0
    : 350 * smoothSpaceP; // Drift right out of frame
  const driftTranslateY = isThrusting
    ? -15 * (thrust * 0.5) // Upward during thrust
    : 400 * smoothSpaceP; // Drift down out of frame

  const driftScale = 1 + (1.5 * smoothSpaceP); // Scale UP from 1.0 to 2.5 (getting closer/bigger)
  const driftOpacity = 1 - (0.9 * smoothSpaceP); // Fade to 0.1
  const driftBlur = 12 * smoothSpaceP; // Blur up to 12px (focus shifts to moon)

  return (
    <div
      className={`agency-rocket-container${isThrusting && !prefersReducedMotion ? ' rocket-thrusting' : ''}`}
      ref={rocketRef}
      style={{
        transform: prefersReducedMotion
          ? `scale(${driftScale})`
          : `translate(${driftTranslateX}px, ${driftTranslateY}px) scale(${driftScale})`,
        opacity: driftOpacity,
        filter: driftBlur > 0 ? `blur(${driftBlur}px)` : 'none',
        transition: isThrusting ? 'none' : 'transform 0.3s ease-out, opacity 0.6s ease-out, filter 0.3s ease-out'
      }}
    >
      {/* Rocket wrapper - contains image and flame together */}
      <div className="rocket-wrap">
        {/* Rocket Body */}
        <img
          src={`${themeUrl}/public/agency-rocket-launch.webp`}
          alt="Agency Rocket Launch"
          className="rocket-img"
          style={{
            filter: `drop-shadow(0 10px 30px rgba(255, 255, 255, ${progress * 0.3}))
                     drop-shadow(0 -5px ${15 + thrust * 20}px rgba(255, 180, 80, ${thrust * 0.4}))`
          }}
        />

        {/* Rocket Flame - anchored to bottom-center of rocket */}
        <img
          src={`${themeUrl}/public/rocket-flame.webp`}
          alt=""
          className="rocket-flame-img"
          aria-hidden="true"
          style={{
            opacity: thrust,
            transform: `translateX(-50%) translateY(-175px) scaleY(${0.8 + thrust * 0.4})`, // Center, pull up flush against rocket nozzle, scale with thrust
            filter: `brightness(${0.9 + thrust * 0.3})`
          }}
        />
      </div>
    </div>
  );
};

// Custom Hero Component for Agency Page with Rocket Launch Effect
const AgencyHero = ({ onLaunchProgressChange }) => {
  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';
  const rotatingWords = ['fast', 'stable', 'reliable'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState('fade-in');
  // animationData state removed — Lottie is now lazy-loaded by child components
  // mousePosition state removed — was causing re-renders on every mouse move but never used in render
  const [launchProgress, setLaunchProgress] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0);
  const heroWrapperRef = useRef(null);
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

  // world-animation.json fetch removed — now lazy-loaded by LazyLottie in child components

  // mousemove listener removed — mousePosition was never used in render output

  // Handle scroll for rocket launch effect — throttled with rAF
  // Uses a ref to track last progress and avoid unnecessary React re-renders
  const lastProgressRef = useRef(0);
  const heroHeightRef = useRef(window.innerHeight);

  useEffect(() => {
    let scrollRafId = null;
    const handleScroll = () => {
      if (scrollRafId) return; // Skip if a frame is already pending
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        if (!heroWrapperRef.current || !heroRef.current) return;

        const wrapperTop = heroWrapperRef.current.offsetTop;
        const wrapperHeight = heroWrapperRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        // Only update hero height on resize (not every scroll frame)
        const currentHeroHeight = heroRef.current.offsetHeight || viewportHeight;
        if (Math.abs(heroHeightRef.current - currentHeroHeight) > 10) {
          heroHeightRef.current = currentHeroHeight;
          setHeroHeight(currentHeroHeight);
        }

        // Calculate progress based on scroll position within wrapper
        const scrollableDistance = wrapperHeight - viewportHeight;
        const scrolledDistance = scrollTop - wrapperTop;
        const progress = Math.max(0, Math.min(1, scrolledDistance / scrollableDistance));

        // Set CSS variable always (no re-render cost)
        document.documentElement.style.setProperty('--launch-progress', progress.toString());

        // Only trigger React re-render if progress changed meaningfully (> 0.002 ≈ sub-pixel)
        if (Math.abs(progress - lastProgressRef.current) > 0.002) {
          lastProgressRef.current = progress;
          setLaunchProgress(progress);
        }
      });
    };

    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      document.documentElement.style.removeProperty('--launch-progress');
    };
  }, []);

  // Notify parent component whenever launch progress changes
  useEffect(() => {
    if (onLaunchProgressChange) {
      onLaunchProgressChange(launchProgress);
    }
  }, [launchProgress, onLaunchProgressChange]);

  // Calculate background color based on launch progress with smooth transitions
  const getLaunchBackground = (progress) => {
    // Color stops: 0% light sky → 25% mid blue → 42% navy → 58% near black → 75%+ space (black)
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

    // Find the two stops we're between
    let lowerStop = colorStops[0];
    let upperStop = colorStops[1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (progress >= colorStops[i].pos && progress <= colorStops[i + 1].pos) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }

    // Interpolate between the two stops
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

  const launchBackground = getLaunchBackground(launchProgress);
  const starOpacity = Math.max(0, (launchProgress - 0.5) / 0.3); // Fade in stars after 50%

  // Space testimonial parallax calculations
  const spaceProgress = Math.max(0, Math.min(1, (launchProgress - 0.60) / 0.18));
  // Use cached reduced motion preference (module-level constant)
  const prefersReducedMotion = PREFERS_REDUCED_MOTION;

  // Parallax layer transforms (disabled if prefers-reduced-motion)
  const starsParallax = prefersReducedMotion ? {} : {
    transform: `translate(${10 * spaceProgress}px, ${24 * spaceProgress}px)`
  };

  const dustParallax = prefersReducedMotion ? {} : {
    transform: `translate(${-15 * spaceProgress}px, ${45 * spaceProgress}px)`,
    opacity: 0.35 * spaceProgress
  };

  // Moon approach animation (0.60 → 0.78) - starts tiny and grows as if approaching
  const cardProgress = Math.max(0, Math.min(1, (launchProgress - 0.60) / 0.18));
  // Ease-out cubic for a decelerating approach feel
  const easedCard = 1 - Math.pow(1 - cardProgress, 3);
  const cardOpacity = Math.min(1, cardProgress * 2.5); // Fade in faster in first 40%
  const moonScale = 0.1 + 0.9 * easedCard; // Scale from 0.1 (tiny dot) to 1.0 (full size)
  const cardTransform = prefersReducedMotion
    ? `scale(${moonScale})`
    : `scale(${moonScale})`;

  return (
    <div className="agency-hero-wrapper" ref={heroWrapperRef}>
      <div className="hero-section agency-hero-sky agency-hero-pinned" ref={heroRef}>
        {/* Dynamic launch background */}
        <div
          className="agency-launch-background"
          style={{
            backgroundColor: launchBackground
          }}
        ></div>

        {/* Star field overlay with parallax */}
        <div
          className="agency-star-field"
          style={{
            opacity: starOpacity,
            ...starsParallax
          }}
        ></div>

        {/* Space dust layer (mid-layer parallax) */}
        <div
          className="space-dust-layer"
          style={dustParallax}
        ></div>

        {/* Cloud Layer - Scroll-driven rocket going up illusion */}
        <CloudLayer progress={launchProgress} heroHeight={heroHeight} />

        {/* Subtle cloud animations - fade out as we go to space */}
        <div className="agency-clouds" style={{ opacity: Math.max(0, 1 - launchProgress * 2) }}>
          <div className="agency-cloud agency-cloud-1"></div>
          <div className="agency-cloud agency-cloud-2"></div>
          <div className="agency-cloud agency-cloud-3"></div>
        </div>

        <div className="hero-overlay"></div>
        <div className="hero-fade"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-dark" style={{ color: launchProgress > 0.4 ? `rgba(255, 255, 255, ${0.95 - launchProgress * 0.1})` : undefined }}>
                Built for your business. Handcrafted by the people who made WooCommerce.
              </span>
            </h1>
            <p className="hero-subtitle" style={{ color: launchProgress > 0.4 ? `rgba(255, 255, 255, ${0.9 - launchProgress * 0.15})` : undefined }}>
              Ex–WooCommerce Core + ex–Google/Meta engineers shipping higher-quality improvements faster
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
                style={{
                  color: launchProgress > 0.4 ? `rgba(255, 255, 255, ${0.95})` : undefined,
                  backgroundColor: launchProgress > 0.4 ? `rgba(47, 42, 140, ${0.8})` : undefined
                }}
              >
                Get Free Audit
              </a>
              <Link
                to="/gruum-case-study"
                className="btn btn-outline"
                style={{
                  color: launchProgress > 0.4 ? `rgba(255, 255, 255, ${0.95})` : undefined,
                  backgroundColor: launchProgress > 0.4 ? `rgba(255, 255, 255, ${0.1})` : undefined,
                  borderColor: launchProgress > 0.4 ? `rgba(255, 255, 255, ${0.3})` : undefined
                }}
              >
                See Gruum case study
              </Link>
            </div>
            <Link
              to="/gruum-case-study"
              className="hero-case-study-link"
              style={{
                opacity: launchProgress > 0.4 ? 0.9 : 1
              }}
            >
              <span
                className="hero-case-study-pill"
                style={{
                  color: launchProgress > 0.4 ? `rgba(255, 255, 255, ${0.95})` : undefined,
                  backgroundColor: launchProgress > 0.4 ? `rgba(255, 255, 255, ${0.15})` : undefined
                }}
              >
                READ THEIR STORY
                <span className="case-study-pill-arrow">↗</span>
              </span>
              <img
                src={`${themeUrl}/public/gruum-logo.svg`}
                alt="grüum"
                className="hero-case-study-logo"
                style={{
                  filter: launchProgress > 0.4 ? 'brightness(0) invert(1) opacity(0.9)' : undefined
                }}
              />
            </Link>
            </div>
          </div>
          <div className="hero-animation">
            <RocketWithThrust progress={launchProgress} themeUrl={themeUrl} />
          </div>
        </div>

        {/* Moon Focus Shift Scene - appears after engine cutoff */}
        {launchProgress >= 0.58 && (
          <div className="space-moon-scene">
            {/* Moon with integrated testimonial */}
            <div
              className="moon-wrap"
              style={{
                opacity: cardOpacity,
                transform: cardTransform
              }}
            >
              {/* Moon Image */}
              <img
                src={`${themeUrl}/public/moon-v2.webp`}
                alt="Moon"
                className="space-moon"
                loading="lazy"
              />

              {/* Testimonial integrated on moon surface */}
              <div className="moon-testimonial-overlay">
                <blockquote className="moon-testimonial-text">
                  "The results speak for themselves—I'm really happy we worked with Urumi," says George, founder of grüum.
                </blockquote>
              </div>
            </div>
          </div>
        )}

        {/* Logo Marquee Section */}
        <div className="hero-marquee-section">
        <div className="hero-marquee">
          {/* Repeat content enough times to guarantee seamless looping at any viewport width */}
          {[0, 1, 2, 3].map((i) => (
          <div className="hero-marquee-content" key={i} aria-hidden={i > 0 ? "true" : undefined}>
            <img
              src={`${themeUrl}/public/gruum-logo.svg`}
              alt="Gruum"
              className="marquee-logo"
            />
            <span className="marquee-separator">•</span>
            <span className="marquee-text">WooCommerce Core alumni</span>
            <span className="marquee-separator">•</span>
            <span className="marquee-text">Millions req/min scaling experience</span>
            <span className="marquee-separator">•</span>
          </div>
          ))}
          </div>
        </div>
      </div>

      {/* Scroll spacer for launch animation */}
      <div className="agency-launch-spacer"></div>
    </div>
  );
};

function WooCommerceAgencyPage({ onLaunchProgressChange }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef(null);

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Use callback ref to avoid re-creating on every render
  const handleLaunchProgressChange = useCallback((progress) => {
    if (onLaunchProgressChange) {
      onLaunchProgressChange(progress);
    }
  }, [onLaunchProgressChange]);

  useEffect(() => {
    document.title = 'WooCommerce Agency Page - Enterprise Auto-Scaling Hosting | 99.99% Uptime Guarantee';

    // Add class to body for agency page styling
    document.body.classList.add('agency-page');

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

    return () => {
      document.body.classList.remove('agency-page');
      window.removeEventListener('openDemoForm', handleHeaderDemoClick);
    };
  }, []);

  // Sky color scroll handler removed — was causing a blue screen after the
  // space section.  The hero launch-background already handles the sky→black
  // transition via launchProgress; no additional page-level color change needed.

  return (
    <div className="home-page">
      <AgencyHero onLaunchProgressChange={handleLaunchProgressChange} />

      {/* Horizontal Swipe Section: Case Study | Testimonials | Expertise */}
      <HorizontalSwipeSection />

      <div id="features"></div>

      {/* Painpoint Flip Cards — Pastel playful section */}
      <PainpointFlipCards />

      {/* FAQ + Final CTA Section — playful pastel FAQ blocks */}
      <FaqCta onCtaClick={() => {
        setIsFormOpen(true);
        setTimeout(() => {
          const formSection = document.querySelector('.form-collapse-section');
          if (formSection) formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }} />

      {/* Benchmarks Section - Removed */}

      {/* Performance Guardrails Section */}
      {/* <PerformanceGuardrails /> */}

      {/* Demo Form Collapse Section */}
      <FormCollapse
        ref={formRef}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        formUrl="https://docs.google.com/forms/d/e/1FAIpQLScIEQm-Q80VoT3FLiWuk8XbRcLCbL1BxbZeLysd1ckBfDt3lw/viewform?embedded=true"
        title="Demo with Founders"
      />

      {/* Everything Included Section - Removed */}

      {/* Comparison Table Section - Removed */}

      {/* Audit CTA Section - Removed */}
    </div>
  );
}

export default WooCommerceAgencyPage;
