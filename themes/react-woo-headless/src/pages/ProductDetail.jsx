/**
 * Product Detail Page - Luxury Design
 *
 * @author Urumi.ai
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/woocommerce';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    // Check for SSR data first
    const ssrDataElement = document.getElementById('ssr-product-data');

    if (ssrDataElement) {
      try {
        const ssrData = JSON.parse(ssrDataElement.textContent);
        setProduct(ssrData);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Failed to parse SSR data:', err);
      }
    }

    // Fallback to API fetch if no SSR data
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to load product details.');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (addedToCart) {
      // If already added, navigate to cart
      navigate('/cart');
    } else {
      // Add to cart and keep button as "PROCEED TO CART"
      addToCart(product, quantity);
      setAddedToCart(true);
      // Don't reset - keep it as "PROCEED TO CART"
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>LOADING</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-state">
        <p>{error || 'Product not found'}</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          RETURN TO COLLECTION
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImageIndex]?.src || 'https://via.placeholder.com/800x1000?text=No+Image';
  const price = parseFloat(product.price).toFixed(2);

  return (
    <div className="product-detail-page">
      <button className="back-link" onClick={() => navigate('/')}>
        ← BACK TO COLLECTION
      </button>

      <div className="product-detail-container">
        <div className="product-image-section">
          <div className="main-image-wrapper">
            <img src={currentImage} alt={product.name} className="main-product-image" loading="lazy" decoding="async" />
          </div>

          {images.length > 1 && (
            <div className="thumbnail-gallery">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image.src} alt={`${product.name} - View ${index + 1}`} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price-detail">₹{price}</div>
          </div>

          <div className="product-divider"></div>

          <div className="product-description">
            <h3>DESCRIPTION</h3>
            <div
              dangerouslySetInnerHTML={{ __html: product.description || product.short_description }}
            />
          </div>

          <div className="quantity-selector">
            <label>QUANTITY</label>
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="qty-btn"
              >
                +
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="add-to-bag-btn"
              onClick={handleAddToCart}
            >
              {addedToCart ? 'PROCEED TO CART' : 'ADD TO BAG'}
            </button>
            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
            >
              BUY NOW
            </button>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">SKU:</span>
              <span className="meta-value">{product.sku || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">CATEGORY:</span>
              <span className="meta-value">
                {product.categories?.map(cat => cat.name).join(', ') || 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
