/**
 * ProductCard Component with Carousel
 *
 * Displays individual product information with image carousel on hover
 * @author Urumi.ai
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../api/woocommerce';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  const images = product.images || [];
  const productName = product.name || 'Untitled Product';
  const productPrice = formatPrice(product.price);

  // Calculate current image based on index and available images
  const actualImageIndex = images.length > 0 ? currentImageIndex % images.length : 0;
  const currentImageUrl = images[actualImageIndex]?.src || 'https://via.placeholder.com/300x300?text=No+Image';

  // Always show exactly 3 dots regardless of image count
  const totalDots = 3;
  const hasMultipleImages = images.length > 0;

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Auto-rotate through 3 positions on hover - instant rotation
  useEffect(() => {
    if (isHovering && hasMultipleImages) {
      // Start immediately
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalDots);

      // Then continue rotating through 3 positions
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalDots);
      }, 800); // Change every 0.8 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setCurrentImageIndex(0); // Reset to first position when not hovering
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, hasMultipleImages, totalDots]);

  const handleDotClick = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div
      className="product-card luxury-card"
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="product-image-wrapper luxury-image">
        <img
          src={currentImageUrl}
          alt={productName}
          className="product-image"
          loading="lazy"
        />
        <div className="image-overlay">
          <button
            className="view-details-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            VIEW DETAILS
          </button>
        </div>

        {hasMultipleImages && (
          <div className="carousel-dots">
            {[...Array(totalDots)].map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={(e) => handleDotClick(index, e)}
                aria-label={`View position ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info luxury-info">
        <h3 className="product-name luxury-name">{productName}</h3>
        <div className="product-price luxury-price">
          <span className="current-price">{productPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
