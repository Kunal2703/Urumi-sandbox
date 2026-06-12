/**
 * WooCommerce Checkout API Helper
 *
 * @author Urumi.ai
 */

/**
 * Build API URL properly handling both pretty permalinks and index.php?rest_route=
 */
function buildApiUrl(endpoint) {
  const restUrl = window.wpData?.restUrl || '/wp-json/';

  if (restUrl.includes('rest_route=')) {
    const url = new URL(restUrl, window.location.origin);
    const currentRoute = url.searchParams.get('rest_route') || '/';
    const newRoute = currentRoute.endsWith('/') ? currentRoute + endpoint : currentRoute + '/' + endpoint;
    url.searchParams.set('rest_route', newRoute);
    return url.toString();
  } else {
    return restUrl + endpoint;
  }
}

/**
 * Create a new order in WooCommerce
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} Created order
 */
export async function createOrder(orderData) {
  try {
    const apiUrl = buildApiUrl('wc/v3/orders');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpData?.nonce || ''
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export async function getOrder(orderId) {
  try {
    const apiUrl = buildApiUrl(`wc/v3/orders/${orderId}`);

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

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

/**
 * Update order status
 * @param {number} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const apiUrl = buildApiUrl(`wc/v3/orders/${orderId}`);

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpData?.nonce || ''
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * Get payment gateways
 * @returns {Promise<Array>} Available payment gateways
 */
export async function getPaymentGateways() {
  try {
    const apiUrl = buildApiUrl('wc/v3/payment_gateways');

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

    const gateways = await response.json();
    return gateways.filter(gateway => gateway.enabled);
  } catch (error) {
    console.error('Error fetching payment gateways:', error);
    return [];
  }
}

/**
 * Validate checkout fields
 * @param {Object} data - Checkout form data
 * @returns {Object} Validation errors
 */
export function validateCheckoutForm(data) {
  const errors = {};

  // Billing validation
  if (!data.billing.first_name?.trim()) {
    errors.billing_first_name = 'First name is required';
  }

  if (!data.billing.last_name?.trim()) {
    errors.billing_last_name = 'Last name is required';
  }

  if (!data.billing.email?.trim()) {
    errors.billing_email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.billing.email)) {
    errors.billing_email = 'Invalid email format';
  }

  if (!data.billing.phone?.trim()) {
    errors.billing_phone = 'Phone number is required';
  }

  if (!data.billing.address_1?.trim()) {
    errors.billing_address_1 = 'Address is required';
  }

  if (!data.billing.city?.trim()) {
    errors.billing_city = 'City is required';
  }

  if (!data.billing.state?.trim()) {
    errors.billing_state = 'State is required';
  }

  if (!data.billing.postcode?.trim()) {
    errors.billing_postcode = 'Postcode is required';
  }

  if (!data.billing.country?.trim()) {
    errors.billing_country = 'Country is required';
  }

  return errors;
}
