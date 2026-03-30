/**
 * React Application Entry Point - SSR + Client Rendering
 *
 * Server provides full semantic HTML for bots/crawlers (AEO).
 * React takes over for interactive users, removing SSR content.
 *
 * @author Urumi.ai
 */

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Make React available globally for any code that needs it
window.React = React;

const rootElement = document.getElementById('root');

// Client-side rendering — React handles all interactivity
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Remove SSR content AFTER React has mounted (give it a moment)
// This prevents flash of blank page before React renders
setTimeout(() => {
  const ssrContent = document.getElementById('ssr-content');
  if (ssrContent) {
    ssrContent.remove();
  }
}, 100);
