/**
 * Vision Page Component
 *
 * Showcases Urumi's vision for Agentic AI eCommerce
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚠️ COPY-SYNC RULE — read before editing customer-facing copy
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Numbers, quotes, taglines, product claims, and capability statements on
 * this page must match what we say everywhere else they appear, or the
 * site contradicts itself across audiences. Every edit needs FOUR sweeps:
 *
 *   1. THIS FILE — hydrated React app (what humans see post-takeover)
 *   2. template-parts/ssr-vision.php — SSR HTML (crawlers, no-JS users)
 *   3. llms.txt (repo root) — AEO answer file (ChatGPT, Claude, Perplexity,
 *                              Google AI Overviews cite this verbatim)
 *   4. SEO/schema layer — inc/ssr-schema.php (JSON-LD: Organization,
 *      Service, Review, FAQPage, HowTo) + functions.php brand functions
 *      (urumi_brand_description, urumi_organization_schema, founder bios)
 *
 * Before editing a number or quote, grep the repo for it so you catch
 * every surface. PR #22 (req/day standardization) and PR #23 (llms.txt
 * follow-up) are reference precedents for what a four-surface sweep
 * looks like in practice.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * @author Urumi.ai
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import FormCollapse from '../components/FormCollapse';
import TeamCredentials from '../components/TeamCredentials';
import VisionThreeAIs from '../components/VisionThreeAIs.jsx';
import DSReveal from '../design-system/components/DSReveal.jsx';
import DSOpsConsole from '../design-system/components/DSOpsConsole.jsx';
import DSFinalCTA from '../design-system/components/DSFinalCTA.jsx';
import VisionPanel1Hero from '../components/VisionPanel1Hero.jsx';
import VisionPanel2Scale from '../components/VisionPanel2Scale.jsx';
import VisionPanel7Bridge from '../components/VisionPanel7Bridge.jsx';
import VisionPanelByoAI from '../components/VisionPanelByoAI.jsx';
import VisionPanel8FinalCTA from '../components/VisionPanel8FinalCTA.jsx';
import { useSectionScroll } from '../design-system/hooks/useSectionScroll.js';
import '../styles/Vision.css';
import '../styles/Vision-v2.css';
import '../styles/FaqCta.css';

function Vision() {
  const sectionsRef = useRef([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef(null);

  // Scroll-tied choreography refs + transforms.
  // Hero: text drifts up with parallax velocity, artifact has breathing
  // scale + counter-parallax.
  // Offset note: hero is the first section, so we use ['start start',
  // 'end start'] — progress=0 at page load (hero top at viewport top),
  // progress=1 when hero has fully exited viewport top. The default
  // ['start end', 'end start'] would put us partway through progress
  // at page load (because the hero is already visible) which would
  // push the eyebrow off-screen under the fixed navbar.
  const heroRef = useRef(null);
  const heroProgress = useSectionScroll(heroRef, {
    offset: ['start start', 'end start'],
  });
  const heroTextY    = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroArtY     = useTransform(heroProgress, [0, 1], [0, -60]);
  const heroArtScale = useTransform(heroProgress, [0, 0.5, 1], [1.0, 1.04, 0.94]);

  // BYO-AI section scroll-tied parallax (mirrors VisionThreeAIs's
  // AISection pattern — copy drifts slightly so it breathes through
  // the viewport, artifact gets a counter-parallax with a small scale
  // bump near the section's centre).
  const byoaiRef     = useRef(null);
  const byoaiProg    = useSectionScroll(byoaiRef);
  const byoaiCopyY   = useTransform(byoaiProg, [0, 1], [32, -32]);
  const byoaiArtY    = useTransform(byoaiProg, [0, 1], [80, -80]);
  const byoaiArtScale= useTransform(byoaiProg, [0, 0.5, 1], [0.92, 1.04, 0.92]);
  const byoaiArtOpac = useTransform(byoaiProg, [0, 0.35, 0.65, 1], [0.35, 1, 1, 0.35]);

  // Hero cursor spotlight — a single warm glow follows the cursor with
  // spring physics. The cursor IS the visible source of motion. Initial
  // position offset to top-right so it's visible before any mouse input.
  // Paired with the static .vision-v2-hero-corner gradient.
  const SPOT_SIZE = 700; // px diameter
  const mouseX = useMotionValue(800);  // initial: top-right area
  const mouseY = useMotionValue(280);
  const sx = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.6 });
  const sy = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.6 });
  const spotX = useTransform(sx, (v) => v - SPOT_SIZE / 2);
  const spotY = useTransform(sy, (v) => v - SPOT_SIZE / 2);
  // Cursor spotlight — skip on touch-only devices (no cursor exists,
  // any synthetic mouse events from hybrid input would just waste a
  // getBoundingClientRect + spring update on every move).
  const isCoarsePointerRef = useRef(false);
  useEffect(() => {
    isCoarsePointerRef.current = window.matchMedia('(pointer: coarse)').matches;
  }, []);
  const handleHeroMouseMove = (e) => {
    if (isCoarsePointerRef.current) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

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
    document.title = 'Urumi — Agentic AI for WooCommerce';
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

    // Preload the WooCommerce route document so the WC page click is fast.
    // Asset prefetches removed — they pointed at hardcoded WP paths that
    // didn't resolve in dev; the WC page bundle pulls them in any case.
    const preloadWooCommercePage = () => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/woocommerce';
      link.as = 'document';
      document.head.appendChild(link);
    };

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
    <div className="vision-page vision-v2">
      {/* ============== HERO (clean modern, design-system v1) ============== */}
      <header
        className="vision-v2-hero"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        data-snap-section
      >
        {/* Background:
            - .vision-v2-hero-shop  = hand-drawn line illustration of a
              small storefront with a tiny figure at the door — the
              "real shop, real person" image. Sits bottom-left at low
              opacity like a chapter ornament.
            - .vision-v2-hero-corner = small static warm gradient
              top-right (sets the mood).
            - .vision-v2-hero-spotlight = cursor-tracked warm glow. */}
        <VisionPanel1Hero />

        <div className="vision-v2-hero-corner" aria-hidden="true" />
        <motion.div
          className="vision-v2-hero-spotlight"
          aria-hidden="true"
          style={{
            x: spotX,
            y: spotY,
            width:  SPOT_SIZE,
            height: SPOT_SIZE,
          }}
        />
        <div className="ds-wrap vision-v2-hero-grid">
          <motion.div
            className="vision-v2-hero-left"
            style={{ y: heroTextY }}
          >
            <DSReveal>
              <span className="ds-eyebrow vision-v2-hero-eyebrow">
                <span className="ds-eyebrow-dot" />
                The operations layer for modern commerce
              </span>
            </DSReveal>
            <DSReveal delay={0.06}>
              <h1 className="ds-h1 vision-v2-hero-title">
                eCommerce, on <span className="ds-accent">autopilot.</span>
              </h1>
            </DSReveal>
            <DSReveal delay={0.12}>
              <p className="ds-sub vision-v2-hero-sub">
                We run the operations layer of your store &mdash; performance, infrastructure,
                analytics, and the engineering work that used to require a team. Built by the
                people who built WooCommerce.
              </p>
            </DSReveal>
            <DSReveal delay={0.18}>
              <div className="vision-v2-hero-ctas">
                <Link to="/woocommerce" className="ds-pill ds-pill-solid">
                  See the WooCommerce platform <span className="ds-arrow">→</span>
                </Link>
              </div>
            </DSReveal>
            <DSReveal delay={0.24}>
              <Link to="/gruum-case-study" className="vision-v2-hero-proof">
                <span className="ds-accent">grüum</span> scaled <strong>14×</strong> with Urumi <span className="ds-arrow">→</span>
              </Link>
            </DSReveal>
          </motion.div>

          <motion.div
            className="vision-v2-hero-right"
            style={{ y: heroArtY, scale: heroArtScale }}
          >
            <DSReveal delay={0.24}>
              <DSOpsConsole />
            </DSReveal>
          </motion.div>
        </div>
      </header>

      {/* ============== SECTION 2 — Already shipping (case-study teaser) ============== */}
      <section className="ds-section vision-v2-shipping" data-snap-section>
        {/* Hand-drawn vignette: same shop as hero, but now scaled —
            three service windows side by side with customers queued in
            front of each. Visual metaphor for "your store goes viral, we
            take care of the scale." Same loose pen-line style as the
            hero storefront. Sits bottom-left, low opacity. */}
        <VisionPanel2Scale />

        <div className="ds-wrap">
          <DSReveal>
            <span className="ds-num-label">01 / Already shipping</span>
          </DSReveal>
          <DSReveal delay={0.06}>
            <h2 className="ds-h2 vision-v2-shipping-title">
              When your store goes viral, our platform takes care of the
              <span className="ds-accent"> scale.</span>
            </h2>
          </DSReveal>
          <DSReveal delay={0.12}>
            <p className="ds-sub vision-v2-shipping-lede">
              How we kept gr&uuml;um fast and shipping orders through their busiest weeks.
            </p>
          </DSReveal>

          <DSReveal delay={0.18}>
            <blockquote className="vision-v2-shipping-quote">
              <p className="vision-v2-shipping-quote-text">
                &ldquo;The biggest performance improvements we&rsquo;ve seen is from you guys.&rdquo;
              </p>
              <footer className="vision-v2-shipping-quote-who">
                <strong>George Lagonikas</strong>, Founder &amp; CTO, gr&uuml;um
              </footer>
            </blockquote>
          </DSReveal>

          <DSReveal delay={0.24}>
            <div className="vision-v2-shipping-stats">
              <span><strong>&minus;93%</strong> mobile load</span>
              <span className="sep">&middot;</span>
              <span><strong>99.99%</strong> uptime</span>
              <span className="sep">&middot;</span>
              <span><strong>16&times;</strong> baseline load absorbed</span>
              <span className="sep">&middot;</span>
              <span><strong>0 incidents</strong> through peak weeks</span>
            </div>
          </DSReveal>

          <DSReveal delay={0.30}>
            <div className="vision-v2-shipping-ctas">
              <Link to="/woocommerce" className="ds-pill ds-pill-solid">
                See the WooCommerce platform <span className="ds-arrow">&rarr;</span>
              </Link>
              <Link to="/gruum-case-study" className="vision-v2-shipping-cta">
                Read the gr&uuml;um case study <span className="ds-arrow">&rarr;</span>
              </Link>
            </div>
          </DSReveal>
        </div>
      </section>

      {/* ============== Section 3 — Three AIs running your store ============== */}
      <VisionThreeAIs />

      {/* ============== Section 04 — Your AI (BYO via MCP) ==============
          Reframes Urumi as the platform layer: the merchant brings their
          existing Claude / ChatGPT / Gemini subscription and plugs it
          into Urumi over MCP. Same hand-drawn ambient vignette in the
          background; foreground holds a small "MCP connection" artifact
          mirroring the AI-section pattern. */}
      <section
        className="ds-section vision-v2-byoai"
        ref={byoaiRef}
        data-snap-section
      >
        <VisionPanelByoAI />
        <div className="ds-wrap vision-v2-byoai-grid">
          <motion.div
            className="vision-v2-byoai-copy"
            style={{ y: byoaiCopyY }}
          >
            <DSReveal>
              <span className="ds-num-label">04 / Your AI</span>
            </DSReveal>
            <DSReveal delay={0.06}>
              <h2 className="ds-h2 vision-v2-byoai-title">
                Bring your Claude.{' '}
                <span className="ds-accent">Plug it in.</span>
              </h2>
            </DSReveal>
            <DSReveal delay={0.12}>
              <p className="ds-sub vision-v2-byoai-tagline">
                Connect your Claude, ChatGPT, or Gemini subscription to
                Urumi over the Model Context Protocol (MCP). Your
                contract, your spend, our platform &mdash; zero AI
                markup, no lock-in.
              </p>
            </DSReveal>
            <DSReveal delay={0.18}>
              <ul className="vision-v2-byoai-bullets">
                <li>Your subscription. Your contract. Your spend.</li>
                <li>Open via MCP &mdash; no proprietary lock-in.</li>
                <li>Drop-in with Claude, ChatGPT, Gemini, your-own-LLM.</li>
              </ul>
            </DSReveal>
            <DSReveal delay={0.24}>
              <p className="vision-v2-byoai-proof">
                <span className="vision-v2-byoai-proof-mark">$</span>
                Save <strong>~$400/mo</strong> vs platforms that resell
                AI usage at 2&ndash;3&times; markup.
              </p>
            </DSReveal>
          </motion.div>

          <motion.div
            className="vision-v2-byoai-art-wrap"
            style={{
              y: byoaiArtY,
              scale: byoaiArtScale,
              opacity: byoaiArtOpac,
            }}
          >
            <DSReveal delay={0.18}>
              <div className="vision-v2-byoai-mcp-card">
                <div className="vision-v2-byoai-mcp-head">
                  <span className="vision-v2-byoai-mcp-head-title">
                    &rarr; urumi &middot; mcp
                  </span>
                  <span className="vision-v2-byoai-mcp-head-live">
                    <span className="vision-v2-byoai-mcp-dot" />
                    live
                  </span>
                </div>

                <div className="vision-v2-byoai-mcp-section-label">
                  YOUR SUBSCRIPTIONS
                </div>

                <ul className="vision-v2-byoai-mcp-rows">
                  <li className="vision-v2-byoai-mcp-row is-connected">
                    <span className="mark">&#9679;</span>
                    <span className="name">claude</span>
                    <span className="state">connected</span>
                  </li>
                  <li className="vision-v2-byoai-mcp-row">
                    <span className="mark">&#9675;</span>
                    <span className="name">chatgpt</span>
                    <span className="state">available</span>
                  </li>
                  <li className="vision-v2-byoai-mcp-row">
                    <span className="mark">&#9675;</span>
                    <span className="name">gemini</span>
                    <span className="state">available</span>
                  </li>
                  <li className="vision-v2-byoai-mcp-row vision-v2-byoai-mcp-row-byo">
                    <span className="mark">+</span>
                    <span className="name">bring-your-own-llm</span>
                    <span className="state">open spec</span>
                  </li>
                </ul>

                <div className="vision-v2-byoai-mcp-foot">
                  <span>0 markup</span>
                  <span className="sep">&middot;</span>
                  <span>your contract</span>
                  <span className="sep">&middot;</span>
                  <span>MCP open spec</span>
                </div>
              </div>
            </DSReveal>
          </motion.div>
        </div>
      </section>

      {/* ============== Section 4 — Our Vision (single paragraph bridge) ============== */}
      <section className="ds-section vision-v2-vision-bridge" data-snap-section>
        {/* Panorama Panel 7 — bustling autonomous shop vignette. */}
        <VisionPanel7Bridge />
        <div className="ds-wrap">
          <DSReveal>
            <span className="ds-num-label">Our vision</span>
          </DSReveal>
          <DSReveal delay={0.06}>
            <h3 className="ds-h3 vision-v2-vision-bridge-text">
              We believe stores should run themselves. These three AIs are
              the start.
            </h3>
          </DSReveal>
        </div>
      </section>

      {/* ============== Final CTA — push to /woocommerce ============== */}
      {/* Panorama Panel 8 — thriving close vignette. Wrapped in a div so
          the SVG can absolute-position inside the same visual region as
          the DSFinalCTA composition. DSFinalCTA itself owns the section
          element. */}
      <div className="vision-v2-final-cta-wrap">
        <VisionPanel8FinalCTA />
        <DSFinalCTA
          title={<>Run your store on <span className="ds-accent">Urumi.</span></>}
          subtitle={<>Production-ready today. Built for high-traffic WooCommerce stores where downtime moves revenue.</>}
          primary={{ to: '/woocommerce', label: 'See the WooCommerce platform' }}
          status={[
              { dot: true, text: 'agent · live' },
              '99.99% uptime',
              'shipping today',
          ]}
        />
      </div>

      {/* Footer Section with Pearl Gradient */}
      <div className="footer-section" data-snap-section>
        <TeamCredentials />
        {/* Subtle dentist credit line */}
        <p className="faqcta-dentist-credit">
          <span className="faqcta-dentist-credit__tooth">🦷</span>
          {' '}Can you believe it? This page was built by a dentist using{' '}
          <a href="https://urumi.ai" className="faqcta-dentist-credit__link" target="_blank" rel="noopener noreferrer">urumi.ai</a>
        </p>
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
