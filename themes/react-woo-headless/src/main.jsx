/**
 * React Application Entry Point - SSR + Client Rendering
 *
 * Server provides full semantic HTML for bots/crawlers (AEO).
 * React takes over for interactive users, removing SSR content
 * AFTER the first commit so there's no flash of blank page.
 *
 * @author Urumi.ai
 */

import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// Design system — two files, loaded globally:
//   tokens.css     → :root variables (palette, type, spacing, motion)
//   utilities.css  → class layer + global treatments (paper grain,
//                    selection, type rhythm, ds-* helpers)
// Anything that reads var(--color-*), var(--font-*), or uses a .ds-* class
// inherits the editorial-premium foundation. Legacy index.css tokens still
// load for unrevamped pages until they migrate.
import './design-system/tokens.css';
import './design-system/utilities.css';

// Make React available globally for any code that needs it
window.React = React;

const rootElement = document.getElementById('root');

/**
 * Removes the server-rendered #ssr-content node after React has
 * committed its first render. Schedules removal in the next paint
 * frame so React has a paintable tree before SSR disappears —
 * eliminates the flash-of-blank that the previous wall-clock
 * setTimeout(100) caused on slow devices.
 */
function SSRCleanup({ children }) {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const ssr = document.getElementById('ssr-content');
      if (ssr) ssr.remove();
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  return children;
}

createRoot(rootElement).render(
  <StrictMode>
    <SSRCleanup>
      <App />
    </SSRCleanup>
  </StrictMode>
);
