/**
 * Checkout Page - Luxury Fashion Checkout
 *
 * @author Urumi.ai
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, validateCheckoutForm, getPaymentGateways } from '../api/checkout';
import '../styles/Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentGateways, setPaymentGateways] = useState([]);

  const [formData, setFormData] = useState({
    billing: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'IN'
    },
    shipping: {
      first_name: '',
      last_name: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'IN'
    },
    payment_method: 'razorpay',
    customer_note: '',
    ship_to_different_address: false
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }

    // Fetch payment gateways
    async function fetchGateways() {
      const gateways = await getPaymentGateways();
      setPaymentGateways(gateways);
      if (gateways.length > 0) {
        setFormData(prev => ({ ...prev, payment_method: gateways[0].id }));
      }
    }
    fetchGateways();
  }, [cart, navigate]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${section}_${field}`];
      return newErrors;
    });
  };

  const handleCheckboxChange = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));

    // Copy billing to shipping when unchecked
    if (field === 'ship_to_different_address' && formData.ship_to_different_address) {
      setFormData(prev => ({
        ...prev,
        shipping: { ...prev.billing }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateCheckoutForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        payment_method: formData.payment_method,
        payment_method_title: paymentGateways.find(g => g.id === formData.payment_method)?.title || 'Razorpay',
        set_paid: false,
        billing: formData.billing,
        shipping: formData.ship_to_different_address ? formData.shipping : formData.billing,
        line_items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        customer_note: formData.customer_note
      };

      // Create order via WooCommerce API
      const order = await createOrder(orderData);

      // Clear cart
      clearCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.id}`);

    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create order. Please try again.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>CHECKOUT</h1>
        <div className="title-divider"></div>
      </div>

      {errors.submit && (
        <div className="error-banner">
          {errors.submit}
        </div>
      )}

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="checkout-container">
          {/* Left Column - Forms */}
          <div className="checkout-forms-section">
            {/* Billing Details */}
            <section className="checkout-section">
              <h2>BILLING DETAILS</h2>

              <div className="form-row">
                <div className="form-field">
                  <label>FIRST NAME *</label>
                  <input
                    type="text"
                    value={formData.billing.first_name}
                    onChange={(e) => handleInputChange('billing', 'first_name', e.target.value)}
                    className={errors.billing_first_name ? 'error' : ''}
                  />
                  {errors.billing_first_name && (
                    <span className="field-error">{errors.billing_first_name}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>LAST NAME *</label>
                  <input
                    type="text"
                    value={formData.billing.last_name}
                    onChange={(e) => handleInputChange('billing', 'last_name', e.target.value)}
                    className={errors.billing_last_name ? 'error' : ''}
                  />
                  {errors.billing_last_name && (
                    <span className="field-error">{errors.billing_last_name}</span>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label>EMAIL ADDRESS *</label>
                <input
                  type="email"
                  value={formData.billing.email}
                  onChange={(e) => handleInputChange('billing', 'email', e.target.value)}
                  className={errors.billing_email ? 'error' : ''}
                />
                {errors.billing_email && (
                  <span className="field-error">{errors.billing_email}</span>
                )}
              </div>

              <div className="form-field">
                <label>PHONE *</label>
                <input
                  type="tel"
                  value={formData.billing.phone}
                  onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                  className={errors.billing_phone ? 'error' : ''}
                />
                {errors.billing_phone && (
                  <span className="field-error">{errors.billing_phone}</span>
                )}
              </div>

              <div className="form-field">
                <label>ADDRESS *</label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={formData.billing.address_1}
                  onChange={(e) => handleInputChange('billing', 'address_1', e.target.value)}
                  className={errors.billing_address_1 ? 'error' : ''}
                />
                {errors.billing_address_1 && (
                  <span className="field-error">{errors.billing_address_1}</span>
                )}
              </div>

              <div className="form-field">
                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.billing.address_2}
                  onChange={(e) => handleInputChange('billing', 'address_2', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>CITY *</label>
                  <input
                    type="text"
                    value={formData.billing.city}
                    onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                    className={errors.billing_city ? 'error' : ''}
                  />
                  {errors.billing_city && (
                    <span className="field-error">{errors.billing_city}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>STATE *</label>
                  <input
                    type="text"
                    value={formData.billing.state}
                    onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
                    className={errors.billing_state ? 'error' : ''}
                  />
                  {errors.billing_state && (
                    <span className="field-error">{errors.billing_state}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>POSTCODE *</label>
                  <input
                    type="text"
                    value={formData.billing.postcode}
                    onChange={(e) => handleInputChange('billing', 'postcode', e.target.value)}
                    className={errors.billing_postcode ? 'error' : ''}
                  />
                  {errors.billing_postcode && (
                    <span className="field-error">{errors.billing_postcode}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>COUNTRY *</label>
                  <select
                    value={formData.billing.country}
                    onChange={(e) => handleInputChange('billing', 'country', e.target.value)}
                  >
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Order Notes */}
            <section className="checkout-section">
              <h2>ORDER NOTES (OPTIONAL)</h2>
              <div className="form-field">
                <textarea
                  rows="4"
                  placeholder="Notes about your order, e.g. special delivery instructions"
                  value={formData.customer_note}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_note: e.target.value }))}
                />
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-summary-section">
            <div className="order-summary">
              <h2>YOUR ORDER</h2>

              <div className="order-items">
                {cart.map(item => {
                  const itemTotal = parseFloat(item.price) * item.quantity;
                  return (
                    <div key={item.id} className="order-item">
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">× {item.quantity}</span>
                      </div>
                      <span className="item-total">₹{itemTotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="order-totals">
                <div className="total-line">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="total-line grand-total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods">
                <h3>PAYMENT METHOD</h3>
                {paymentGateways.map(gateway => (
                  <label key={gateway.id} className="payment-option">
                    <input
                      type="radio"
                      name="payment_method"
                      value={gateway.id}
                      checked={formData.payment_method === gateway.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                    />
                    <span>{gateway.title}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? 'PROCESSING...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
