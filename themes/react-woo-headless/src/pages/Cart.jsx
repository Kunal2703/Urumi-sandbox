/**
 * Cart Page - Luxury Shopping Bag
 *
 * @author Urumi.ai
 */

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h1>SHOPPING BAG</h1>
          <div className="title-divider"></div>
        </div>

        <div className="empty-cart">
          <p>Your shopping bag is empty</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping for luxury items
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>SHOPPING BAG</h1>
        <div className="title-divider"></div>
        <p className="cart-count">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</p>
      </div>

      <div className="cart-container">
        <div className="cart-items-section">
          {cart.map((item) => {
            const imageUrl = item.images?.[0]?.src || 'https://via.placeholder.com/150x200?text=No+Image';
            const price = parseFloat(item.price);
            const itemTotal = price * item.quantity;

            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={imageUrl} alt={item.name} loading="lazy" />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">₹{price.toFixed(2)}</p>

                  <div className="cart-item-quantity">
                    <label>QUANTITY</label>
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    REMOVE
                  </button>
                </div>

                <div className="cart-item-total">
                  <p>₹{itemTotal.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary-section">
          <div className="cart-summary">
            <h2>ORDER SUMMARY</h2>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-line">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-line total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              PROCEED TO CHECKOUT
            </button>

            <button className="continue-shopping-btn" onClick={() => navigate('/')}>
              CONTINUE SHOPPING
            </button>

            <button className="clear-cart-btn" onClick={clearCart}>
              CLEAR BAG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
