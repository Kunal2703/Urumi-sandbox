/**
 * WooCommerce Configuration
 *
 * Supports two modes:
 * 1. Local mode: Running as WordPress theme (uses nonce)
 * 2. External mode: Connecting to remote store (uses API keys)
 *
 * @author Urumi.ai
 */

const config = {
  // Store URL (falls back to current origin if not set)
  storeUrl: import.meta.env.VITE_WC_STORE_URL || window.location.origin,

  // API credentials (only needed for external stores)
  consumerKey: import.meta.env.VITE_WC_CONSUMER_KEY || '',
  consumerSecret: import.meta.env.VITE_WC_CONSUMER_SECRET || '',

  // API version
  apiVersion: import.meta.env.VITE_WC_API_VERSION || 'wc/v3',

  // Local mode uses WordPress nonce, external mode uses OAuth
  isLocalMode: import.meta.env.VITE_LOCAL_MODE === 'true' || !import.meta.env.VITE_WC_CONSUMER_KEY,
};

/**
 * Generate OAuth 1.0a signature for WooCommerce
 */
function generateOAuthSignature(method, url, params) {
  // For simplicity, we'll use query parameters instead of full OAuth signature
  // WooCommerce accepts consumer_key and consumer_secret as query params
  return {
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret
  };
}

/**
 * Build complete API URL with authentication
 */
export function buildAuthenticatedUrl(endpoint, queryParams = {}) {
  const baseUrl = config.isLocalMode
    ? (window.wpData?.restUrl || '/wp-json/')
    : `${config.storeUrl}/wp-json/`;

  let apiUrl;

  // Handle index.php?rest_route= format (non-pretty permalinks)
  if (baseUrl.includes('rest_route=')) {
    const url = new URL(baseUrl, window.location.origin);
    const currentRoute = url.searchParams.get('rest_route') || '/';
    const newRoute = currentRoute.endsWith('/')
      ? currentRoute + endpoint
      : currentRoute + '/' + endpoint;
    url.searchParams.set('rest_route', newRoute);
    apiUrl = url;
  } else {
    // Pretty permalinks
    apiUrl = new URL(baseUrl + endpoint, config.storeUrl);
  }

  // Add query parameters
  Object.keys(queryParams).forEach(key => {
    apiUrl.searchParams.set(key, queryParams[key]);
  });

  // Add authentication for external stores
  if (!config.isLocalMode && config.consumerKey && config.consumerSecret) {
    apiUrl.searchParams.set('consumer_key', config.consumerKey);
    apiUrl.searchParams.set('consumer_secret', config.consumerSecret);
  }

  return apiUrl.toString();
}

/**
 * Get authentication headers
 */
export function getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };

  // In local mode, use WordPress nonce
  if (config.isLocalMode && window.wpData?.nonce) {
    headers['X-WP-Nonce'] = window.wpData.nonce;
  }

  return headers;
}

/**
 * Check if API is properly configured
 */
export function isConfigured() {
  if (config.isLocalMode) {
    return true; // Local mode always works
  }

  // External mode requires credentials
  return !!(config.consumerKey && config.consumerSecret);
}

/**
 * Get configuration info
 */
export function getConfigInfo() {
  return {
    mode: config.isLocalMode ? 'local' : 'external',
    storeUrl: config.storeUrl,
    hasCredentials: !!(config.consumerKey && config.consumerSecret),
    apiVersion: config.apiVersion
  };
}

export default config;
