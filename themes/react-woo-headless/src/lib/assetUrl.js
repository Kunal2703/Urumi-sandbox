/**
 * assetUrl(filename) — resolve a public-asset path that works in both
 * Vite dev and WordPress production.
 *
 * Vite dev: serves `themes/react-woo-headless/public/<file>` at the URL
 * root → `/<file>`.
 *
 * WordPress prod: serves `themes/react-woo-headless/public/<file>` at
 * `/wp-content/themes/react-woo-headless/public/<file>`. The exact theme
 * URL is injected by WordPress as `window.wpData.themePath`; falls back
 * to the canonical path if the global isn't set.
 *
 *   import { assetUrl } from '../lib/assetUrl';
 *   <img src={assetUrl('urumi-logo.webp')} alt="Urumi" />
 */

export function assetUrl(filename) {
    // Strip leading slash so callers can pass either form.
    const clean = String(filename || '').replace(/^\/+/, '');

    if (import.meta.env.DEV) {
        // Vite dev — public dir is served at URL root.
        return `/${clean}`;
    }

    const themePath =
        (typeof window !== 'undefined' && window.wpData?.themePath) ||
        '/wp-content/themes/react-woo-headless';
    return `${themePath}/public/${clean}`;
}
