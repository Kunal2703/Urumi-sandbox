/**
 * WooCommerce REST API Helper
 *
 * @author Urumi.ai
 */

/**
 * Build API URL properly handling both pretty permalinks and index.php?rest_route=
 */
function buildApiUrl(endpoint) {
  const restUrl = window.wpData?.restUrl || '/wp-json/';

  // Check if using index.php?rest_route= format
  if (restUrl.includes('rest_route=')) {
    // Extract base URL and append endpoint to rest_route parameter
    const url = new URL(restUrl, window.location.origin);
    const currentRoute = url.searchParams.get('rest_route') || '/';
    const newRoute = currentRoute.endsWith('/') ? currentRoute + endpoint : currentRoute + '/' + endpoint;
    url.searchParams.set('rest_route', newRoute);
    return url.toString();
  } else {
    // Pretty permalinks - just append endpoint
    return restUrl + endpoint;
  }
}

/**
 * Fetch products from WooCommerce REST API
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of products
 */
export async function getProducts(params = {}) {
  const queryParams = new URLSearchParams({
    per_page: params.perPage || 12,
    page: params.page || 1,
    ...params
  });

  try {
    const apiUrl = buildApiUrl('wc/v3/products');
    const url = new URL(apiUrl);
    // Add query params
    queryParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpData?.nonce || ''
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch single product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object|null>} Product object
 */
export async function getProduct(productId) {
  try {
    const apiUrl = buildApiUrl(`wc/v3/products/${productId}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpData?.nonce || ''
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Format price with currency symbol
 * @param {string} price - Price string
 * @returns {string} Formatted price
 */
export function formatPrice(price) {
  return price ? `₹${parseFloat(price).toFixed(2)}` : 'N/A';
}
