/**
 * Main App Component - Enterprise Landing Page
 *
 * React WooCommerce Headless Theme
 * @author Urumi.ai
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { assetUrl } from './lib/assetUrl';
import './App.css';
import './styles/FaqCta.css';

import PageSkeleton from './components/PageSkeleton';

// Lazy-load all page components — each becomes its own JS chunk; only the
// code for the current page is downloaded.
//
// Each import factory is hoisted to its own const so the same `import()`
// can be triggered on Link hover/focus (see `prefetchOnHover` below) —
// the import is memoized by the module loader, so calling it twice
// resolves the same promise the second call gets a cache hit, while the
// first call has primed the browser to fetch the route chunk before
// the visitor clicks.
const importVision               = () => import('./pages/Vision');
const importUrumiForWooCommerce  = () => import('./pages/UrumiForWooCommerce');
const importBlog                 = () => import('./pages/Blog');
const importBlogPost             = () => import('./pages/BlogPost');
const importPage                 = () => import('./pages/Page');
const importCareers              = () => import('./pages/Careers');
const importCaseStudy            = () => import('./pages/CaseStudy');

const Vision               = lazy(importVision);
const UrumiForWooCommerce  = lazy(importUrumiForWooCommerce);
const Blog                 = lazy(importBlog);
const BlogPost             = lazy(importBlogPost);
const Page                 = lazy(importPage);
const Careers              = lazy(importCareers);
const CaseStudy            = lazy(importCaseStudy);

// Map route paths to their import factory so <Link> can trigger the
// chunk fetch on hover/focus. Pointer-coarse devices (mobile) hover
// rarely; the same map is used on touchstart for one-tap-ahead prefetch.
const ROUTE_PREFETCH = {
  '/':                     importVision,
  '/woocommerce':          importUrumiForWooCommerce,
  '/urumi-for-woocommerce': importUrumiForWooCommerce,
  '/blog':                 importBlog,
  '/careers':              importCareers,
  '/gruum-case-study':     importCaseStudy,
};

// Prefetch a route chunk if we recognize its path. Idempotent — the
// module loader memoizes, so repeat triggers are free. Schedule via
// requestIdleCallback so the prefetch never competes with whatever
// the page is doing when the visitor's mouse drifts past a link.
function prefetchRoute(to) {
  if (typeof to !== 'string') return;
  // Strip query/hash before lookup — `/blog?utm=…` should still match.
  const path = to.split('?')[0].split('#')[0];
  const factory = ROUTE_PREFETCH[path];
  if (!factory) return;
  const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
  schedule(() => { factory(); });
}

// Drop-in <Link> wrapper that prefetches its target on first hover/focus
// (also touchstart for mobile, where hover doesn't fire). After the
// first trigger, subsequent events are no-ops via a closure flag.
function PrefetchLink({ to, children, ...rest }) {
  let primed = false;
  const trigger = () => {
    if (primed) return;
    primed = true;
    prefetchRoute(to);
  };
  return (
    <Link
      to={to}
      onMouseEnter={trigger}
      onFocus={trigger}
      onTouchStart={trigger}
      {...rest}
    >
      {children}
    </Link>
  );
}

// Pages that already include the dentist credit in their own content
// (both URLs serve the WC page — new canonical /woocommerce + legacy /urumi-for-woocommerce)
const PAGES_WITH_DENTIST_CREDIT = ['/', '/woocommerce', '/urumi-for-woocommerce'];

function DentistFooter() {
  const location = useLocation();
  if (PAGES_WITH_DENTIST_CREDIT.includes(location.pathname)) return null;
  return (
    <footer className="site-footer-dentist">
      <p className="faqcta-dentist-credit">
        <span className="faqcta-dentist-credit__tooth">🦷</span>
        {' '}Can you believe it? This page was built by a dentist using{' '}
        <a href="https://urumi.ai" className="faqcta-dentist-credit__link" target="_blank" rel="noopener noreferrer">urumi.ai</a>
      </p>
    </footer>
  );
}

function Header() {
  const location = useLocation();
  // /woocommerce is the canonical URL; /urumi-for-woocommerce is the legacy alias.
  const isWooCommercePage = location.pathname === '/woocommerce' || location.pathname === '/urumi-for-woocommerce';
  const isVisionPage = location.pathname === '/';
  // Mobile menu sheet state — slides down from below the header on tap.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close on route change.
  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  // Lock body scroll when open + Esc to close.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setIsMobileMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleDemoClick = (e) => {
    if (isVisionPage || isWooCommercePage) {
      e.preventDefault();
      // Dispatch custom event for Vision and WooCommerce pages to handle
      window.dispatchEvent(new CustomEvent('openDemoForm'));
    }
    // For other pages, let default behavior happen (external link)
  };

  // Legacy fallback path for non-asset uses elsewhere in this component.
  // Asset paths now use assetUrl() (works in both Vite dev and WP prod).
  const themeUrl = window.wpData?.themePath || '/wp-content/themes/react-woo-headless';

  return (
    <header className="site-header">
      <div className="header-content">
        <Link to="/?utm_source=header&utm_medium=logo&utm_campaign=navigation" className="site-logo">
          <img src={assetUrl('urumi-logo.webp')} alt="Urumi" className="logo-image" width="250" height="250" decoding="async" />
          <span className="logo-text">Urumi</span>
        </Link>
        <nav className="site-nav">
          {isWooCommercePage ? (
            <>
              <a onClick={() => scrollToSection('features')} className="nav-link">Features</a>
              <a onClick={() => scrollToSection('benchmarks')} className="nav-link">Performance</a>
              <PrefetchLink to="/blog" className="nav-link nav-link-blog">Blog</PrefetchLink>
              <PrefetchLink to="/careers" className="nav-link">We're Hiring 🎉</PrefetchLink>
            </>
          ) : isVisionPage ? (
            <>
              <PrefetchLink to="/woocommerce" className="nav-link nav-link-woocommerce">For WooCommerce</PrefetchLink>
              <PrefetchLink to="/blog" className="nav-link nav-link-blog" aria-current={location.pathname === '/blog' ? 'page' : undefined}>Blog</PrefetchLink>
              <PrefetchLink to="/careers" className="nav-link" aria-current={location.pathname === '/careers' ? 'page' : undefined}>We're Hiring 🎉</PrefetchLink>
            </>
          ) : (
            <>
              <PrefetchLink to="/" className="nav-link" aria-current={location.pathname === '/' ? 'page' : undefined}>Home</PrefetchLink>
              <PrefetchLink to="/woocommerce" className="nav-link nav-link-woocommerce" aria-current={(location.pathname === '/woocommerce' || location.pathname === '/urumi-for-woocommerce') ? 'page' : undefined}>For WooCommerce</PrefetchLink>
              <PrefetchLink to="/blog" className="nav-link nav-link-blog" aria-current={location.pathname === '/blog' ? 'page' : undefined}>Blog</PrefetchLink>
              <PrefetchLink to="/careers" className="nav-link" aria-current={location.pathname === '/careers' ? 'page' : undefined}>We're Hiring 🎉</PrefetchLink>
            </>
          )}
          <a
            href={(isVisionPage || isWooCommercePage) ? "#demo-form-section" : "https://dashboard.urumi.ai/s/naman"}
            target={(isVisionPage || isWooCommercePage) ? "_self" : "_blank"}
            rel={(isVisionPage || isWooCommercePage) ? "" : "noopener noreferrer"}
            onClick={handleDemoClick}
            className="nav-link-cta"
          >
            Demo with Founders
          </a>
        </nav>

        {/* Mobile hamburger — visible only on small viewports via CSS. */}
        <button
          type="button"
          className={`mobile-menu-toggle${isMobileMenuOpen ? ' is-open' : ''}`}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu-sheet"
          onClick={() => setIsMobileMenuOpen((o) => !o)}
        >
          <span className="mobile-menu-toggle-line" />
          <span className="mobile-menu-toggle-line" />
          <span className="mobile-menu-toggle-line" />
        </button>
      </div>

      {/* Mobile sheet — slides down from below the header.
       * Always mounted; CSS transitions opacity/transform/visibility on
       * the data-open attribute. Replaces framer-motion AnimatePresence
       * so the entry chunk does not need to pull in the motion runtime. */}
      <div
        id="mobile-menu-sheet"
        className="mobile-menu-sheet"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileMenuOpen}
        aria-label="Site navigation"
        data-open={isMobileMenuOpen ? 'true' : 'false'}
      >
            <nav className="mobile-menu-nav">
              {!isVisionPage && (
                <PrefetchLink to="/" className="mobile-menu-link" onClick={closeMenu} aria-current={location.pathname === '/' ? 'page' : undefined}>
                  Home
                </PrefetchLink>
              )}
              {isWooCommercePage ? (
                <>
                  <a
                    onClick={() => { scrollToSection('features'); closeMenu(); }}
                    className="mobile-menu-link"
                  >
                    Features
                  </a>
                  <a
                    onClick={() => { scrollToSection('benchmarks'); closeMenu(); }}
                    className="mobile-menu-link"
                  >
                    Performance
                  </a>
                </>
              ) : (
                <PrefetchLink to="/woocommerce" className="mobile-menu-link" onClick={closeMenu} aria-current={(location.pathname === '/woocommerce' || location.pathname === '/urumi-for-woocommerce') ? 'page' : undefined}>
                  For WooCommerce
                </PrefetchLink>
              )}
              <PrefetchLink to="/blog" className="mobile-menu-link" onClick={closeMenu} aria-current={location.pathname === '/blog' ? 'page' : undefined}>
                Blog
              </PrefetchLink>
              <PrefetchLink to="/careers" className="mobile-menu-link" onClick={closeMenu} aria-current={location.pathname === '/careers' ? 'page' : undefined}>
                We&rsquo;re Hiring 🎉
              </PrefetchLink>
            </nav>

            <a
              href={(isVisionPage || isWooCommercePage) ? '#demo-form-section' : 'https://dashboard.urumi.ai/s/naman'}
              target={(isVisionPage || isWooCommercePage) ? '_self' : '_blank'}
              rel={(isVisionPage || isWooCommercePage) ? '' : 'noopener noreferrer'}
              onClick={(e) => { handleDemoClick(e); closeMenu(); }}
              className="mobile-menu-cta"
            >
              Demo with Founders
              <span className="ds-arrow" aria-hidden="true">→</span>
            </a>
      </div>
    </header>
  );
}

function App() {
  // Page-wide smooth scroll via Lenis. Replaces the browser's native
  // scroll engine with a tunable smooth animation. Layered on top:
  // magnetic snap-to-section — when scrolling stops near a section
  // boundary (within 35% of viewport height), Lenis smooth-scrolls
  // the rest of the way. Premium "settle into the next moment" feel
  // without coercive CSS scroll-snap mandatory.
  //
  // Snap targets opt in via data-snap-section="" on a section element.
  // Other pages with no opted-in sections just get smooth scroll.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Lenis + Snap are dynamic-imported so their ~30KB runtime is NOT in
    // the entry chunk. Smooth scroll engages once the modules resolve
    // (a few frames after first paint) — the browser uses native scroll
    // until then, which is fine since the visitor hasn't begun scrolling.
    let cancelled = false;
    let rafId, registerRaf, pendingRaf, mutationObserver, lenis, snap;

    (async () => {
      const [{ default: Lenis }, { default: Snap }] = await Promise.all([
        import('lenis'),
        import('lenis/snap'),
      ]);
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false, // native momentum on touch
      });

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      // ── Snap layer (Lenis's official Snap module) ──────────────────
      // type: 'proximity' (not 'mandatory') — 'mandatory' kicks the
      // visitor out of long reference sections (Compared, FAQ when
      // expanded, BlogPost article body). 'proximity' only engages
      // when scroll rests near a boundary.
      snap = new Snap(lenis, {
        type: 'proximity',
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        velocityThreshold: 1,
        lerp: 0.1,
      });

      const registerSnapSections = () => {
        const els = Array.from(document.querySelectorAll('[data-snap-section]'));
        els.forEach((el) =>
          snap.addElement(el, { align: 'start', ignoreSticky: true })
        );
      };

      registerRaf = requestAnimationFrame(() => {
        registerRaf = requestAnimationFrame(registerSnapSections);
      });

      // Re-register snap targets when the routed page swaps. childList
      // only, no subtree, scoped to the route container. Plus rAF
      // debouncing so multiple mutations in one frame (route swap)
      // collapse into a single re-register.
      const mainEl = document.querySelector('.main-content') || document.body;
      mutationObserver = new MutationObserver(() => {
        if (pendingRaf) return;
        pendingRaf = requestAnimationFrame(() => {
          pendingRaf = null;
          registerSnapSections();
        });
      });
      mutationObserver.observe(mainEl, { childList: true });
    })();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (registerRaf) cancelAnimationFrame(registerRaf);
      if (pendingRaf) cancelAnimationFrame(pendingRaf);
      if (mutationObserver) mutationObserver.disconnect();
      if (snap) snap.destroy();
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="app luxury-theme">
        <Header />
        <main className="main-content">
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/" element={<Vision />} /> {/* Homepage - Vision page */}
              {/* /woocommerce is the canonical slug; /urumi-for-woocommerce is preserved as a
                  backward-compat alias so existing inbound links + bookmarks don't break.
                  Both routes render the same component; canonical_url in the SSR head points
                  to /woocommerce so search engines consolidate signals on the new URL. */}
              <Route path="/woocommerce" element={<UrumiForWooCommerce />} />
              <Route path="/urumi-for-woocommerce" element={<UrumiForWooCommerce />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/gruum-case-study" element={<CaseStudy />} />
              <Route path="/terms-and-conditions" element={<Page />} />
              <Route path="/refund-policy" element={<Page />} />
              <Route path="/privacy-policy-2" element={<Page />} />
            </Routes>
          </Suspense>
        </main>
        <DentistFooter />
      </div>
    </Router>
  );
}

export default App;
