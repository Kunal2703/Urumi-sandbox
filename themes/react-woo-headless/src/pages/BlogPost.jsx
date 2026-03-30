/**
 * Individual Blog Post Page Component
 *
 * Displays a single blog post with full content
 *
 * ⚠️ PAIRED WITH: template-parts/ssr-blog-post.php
 * When updating content structure, BOTH files must be kept in sync!
 *
 * @author Urumi.ai
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/BlogPost.css';

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when component loads
    window.scrollTo(0, 0);

    // Try to load SSR data first (server-side rendered)
    const ssrDataElement = document.getElementById('ssr-blog-post-data');

    if (ssrDataElement) {
      try {
        const ssrData = JSON.parse(ssrDataElement.textContent);
        if (ssrData) {
          setPost(ssrData);
          document.title = `${ssrData.title?.rendered || 'Blog Post'} | Urumi Blog`;
          setLoading(false);
          // Remove the SSR data element after reading
          ssrDataElement.remove();
          return;
        } else {
          setError('Post not found');
          document.title = 'Post Not Found | Urumi Blog';
          setLoading(false);
          ssrDataElement.remove();
          return;
        }
      } catch (err) {
        console.error('Error parsing SSR data:', err);
      }
    }

    // Fallback to REST API if SSR data not available (client-side navigation)
    // Show loading spinner only when fetching from API
    setLoading(true);

    const restUrl = window.wpData?.restUrl || '/wp-json/';
    const apiUrl = restUrl.endsWith('/') ? `${restUrl}wp/v2/` : `${restUrl}/wp/v2/`;

    fetch(`${apiUrl}posts?slug=${slug}&_embed`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setPost(data[0]);
          document.title = `${data[0].title?.rendered || 'Blog Post'} | Urumi Blog`;
        } else {
          setError('Post not found');
          document.title = 'Post Not Found | Urumi Blog';
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching post:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

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

  const getAuthor = (post) => {
    // Check for SSR data format
    if (post.author && post.author.name) {
      return post.author.name;
    }
    // Check for REST API format
    if (post._embedded && post._embedded.author) {
      return post._embedded.author[0].name;
    }
    return 'Urumi Team';
  };

  // Check if SSR content exists on initial load - if it does, don't show loading/error
  const ssrContentExists = document.getElementById('ssr-content');

  if (loading) {
    // Don't show loading spinner if SSR content is still on the page
    if (ssrContentExists) {
      return null; // Render nothing, let SSR content show
    }
    return (
      <div className="blogpost-loading">
        <div className="spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    // Don't show error if SSR content is still on the page
    if (ssrContentExists) {
      return null; // Render nothing, let SSR content show
    }
    return (
      <div className="blogpost-error">
        <h2>Article Not Found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="blogpost-page">
      {/* Back Navigation */}
      <div className="blogpost-nav">
        <Link to="/blog" className="back-link">← All Articles</Link>
      </div>

      {/* Article Header */}
      <article className="blogpost-article">
        <header className="blogpost-header">
          <div className="blogpost-meta">
            <span className="blogpost-date">{formatDate(post.date)}</span>
            <span className="blogpost-separator">•</span>
            <span className="blogpost-author">{getAuthor(post)}</span>
          </div>
          <h1
            className="blogpost-title"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          {post.excerpt && post.excerpt.rendered && (
            <div
              className="blogpost-excerpt"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
          )}
        </header>

        {/* Featured Image */}
        {getFeaturedImage(post) && (
          <div className="blogpost-featured-image">
            <img
              src={getFeaturedImage(post)}
              alt={post.title.rendered}
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="blogpost-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Article Footer */}
        <footer className="blogpost-footer">
          <Link to="/blog" className="back-to-blog-btn">← Back to All Articles</Link>
        </footer>
      </article>

      {/* CTA Section */}
      <section className="blogpost-cta">
        <div className="blogpost-cta-content">
          <h3>Ready to scale your WooCommerce store?</h3>
          <p>Get a free performance audit from the Urumi team.</p>
          <a
            href="https://dashboard.urumi.ai/s/naman"
            target="_blank"
            rel="noopener noreferrer"
            className="blogpost-cta-btn"
          >
            Get Free Audit
          </a>
        </div>
      </section>
    </div>
  );
}

export default BlogPost;
