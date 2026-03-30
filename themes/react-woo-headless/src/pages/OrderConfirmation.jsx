/**
 * Order Confirmation Page
 *
 * @author Urumi.ai
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../api/checkout';
import '../styles/OrderConfirmation.css';

function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const orderData = await getOrder(orderId);
        setOrder(orderData);
        setError(null);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error loading order:', err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>LOADING ORDER DETAILS</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="error-state">
        <p>{error || 'Order not found'}</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          RETURN TO COLLECTION
        </button>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-header">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1>THANK YOU FOR YOUR ORDER</h1>
        <p className="order-number">Order #{order.number}</p>
        <div className="title-divider"></div>
      </div>

      <div className="confirmation-container">
        <div className="confirmation-message">
          <p>
            Your order has been received and is being processed. We'll send you an email confirmation shortly.
          </p>
        </div>

        <div className="order-details-grid">
          {/* Order Info */}
          <div className="detail-section">
            <h3>ORDER INFORMATION</h3>
            <div className="detail-item">
              <span className="label">Order Number:</span>
              <span className="value">{order.number}</span>
            </div>
            <div className="detail-item">
              <span className="label">Date:</span>
              <span className="value">{new Date(order.date_created).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className="value status">{order.status.toUpperCase()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Payment Method:</span>
              <span className="value">{order.payment_method_title}</span>
            </div>
          </div>

          {/* Billing Address */}
          <div className="detail-section">
            <h3>BILLING ADDRESS</h3>
            <div className="address">
              <p>{order.billing.first_name} {order.billing.last_name}</p>
              <p>{order.billing.address_1}</p>
              {order.billing.address_2 && <p>{order.billing.address_2}</p>}
              <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
              <p>{order.billing.country}</p>
              <p className="contact-info">{order.billing.email}</p>
              <p className="contact-info">{order.billing.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="detail-section">
            <h3>SHIPPING ADDRESS</h3>
            <div className="address">
              <p>{order.shipping.first_name} {order.shipping.last_name}</p>
              <p>{order.shipping.address_1}</p>
              {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
              <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</p>
              <p>{order.shipping.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h3>ORDER ITEMS</h3>
          <div className="order-items-table">
            <div className="table-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {order.line_items.map(item => (
              <div key={item.id} className="table-row">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">× {item.quantity}</span>
                <span className="item-total">₹{parseFloat(item.total).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>₹{parseFloat(order.total - order.shipping_total).toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>{order.shipping_total === '0.00' ? 'Free' : `₹${order.shipping_total}`}</span>
            </div>
            <div className="total-line grand-total">
              <span>Total:</span>
              <span>₹{parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="continue-btn" onClick={() => navigate('/')}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
