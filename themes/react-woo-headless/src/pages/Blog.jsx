/**
 * Blog Listing Page Component
 *
 * Displays all blog posts in a card grid layout
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-blog.php
 * When updating content structure, BOTH files must be kept in sync!
 *
 * @author Urumi.ai
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogHeroCanvas from '../components/BlogHeroCanvas';
import '../styles/Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Scaling WooCommerce Without Compromise - Urumi Blog';

    // Try to load SSR data first (server-side rendered)
    const ssrDataElement = document.getElementById('ssr-blog-data');

    if (ssrDataElement) {
      try {
        const ssrData = JSON.parse(ssrDataElement.textContent);
        setPosts(ssrData);
        setLoading(false);
        // Remove the SSR data element after reading
        ssrDataElement.remove();
        return;
      } catch (err) {
        console.error('Error parsing SSR data:', err);
      }
    }

    // Fallback to REST API if SSR data not available
    const restUrl = window.wpData?.restUrl || '/wp-json/';
    const apiUrl = restUrl.endsWith('/') ? `${restUrl}wp/v2/` : `${restUrl}/wp/v2/`;

    fetch(`${apiUrl}posts?_embed&per_page=20&status=publish&orderby=date&order=desc`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const extractExcerpt = (content, length = 150) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFeaturedImage = (post) => {
    // Check for SSR data format
    if (post.featured_image) {
      return post.featured_image;
    }
    // Check for REST API format
    if (post._embedded && post._embedded['wp:featuredmedia']) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="blog-loading">
        <div className="spinner"></div>
        <p>Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-error">
        <p>Unable to load blog posts. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <BlogHeroCanvas />
        <div className="blog-hero-content">
          <div className="blog-hero-label">INSIGHTS & UPDATES —</div>
          <h1 className="blog-hero-title">Scaling WooCommerce Without Compromise</h1>
          <p className="blog-hero-subtitle">
            Deep dives into WooCommerce performance, infrastructure, and scaling insights from the Urumi team.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="blog-grid-section">
        <div className="blog-grid">
          {posts.map((post) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.id}
              className="blog-card"
            >
              {getFeaturedImage(post) && (
                <div className="blog-card-image">
                  <img
                    src={getFeaturedImage(post)}
                    alt={post.title.rendered}
                  />
                </div>
              )}
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="blog-card-date">{formatDate(post.date)}</span>
                </div>
                <h2
                  className="blog-card-title"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <p className="blog-card-excerpt">
                  {post.excerpt.rendered
                    ? extractExcerpt(post.excerpt.rendered, 120)
                    : extractExcerpt(post.content.rendered, 120)
                  }
                </p>
                <div className="blog-card-cta">
                  Read Article →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="blog-empty">
            <p>No blog posts available yet. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Blog;
