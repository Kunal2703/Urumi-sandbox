/**
 * ProductList Component
 *
 * Fetches and displays WooCommerce products
 * @author Urumi.ai
 */

import { useState, useEffect } from 'react';
import { getProducts } from '../api/woocommerce';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for SSR data first
    const ssrDataElement = document.getElementById('ssr-products-data');

    if (ssrDataElement) {
      try {
        const ssrData = JSON.parse(ssrDataElement.textContent);
        setProducts(ssrData);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Failed to parse SSR data:', err);
      }
    }

    // Fallback to API fetch if no SSR data
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts({ per_page: 12 });
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products found. Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="collection-title">
        <h2>THE MÉTIERS D'ART COLLECTION</h2>
        <div className="title-divider"></div>
      </div>

      <div className="product-grid luxury-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
