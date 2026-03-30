/**
 * Generic Page Component
 *
 * Displays WordPress pages (Terms, Privacy, Refund, etc.)
 * @author Urumi.ai
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Page.css';

function Page() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when component loads
    window.scrollTo(0, 0);

    // Try to load SSR data first (server-side rendered)
    const ssrDataElement = document.getElementById('ssr-page-data');

    if (ssrDataElement) {
      try {
        const ssrData = JSON.parse(ssrDataElement.textContent);
        if (ssrData) {
          setPage(ssrData);
          document.title = `${ssrData.title?.rendered || 'Page'} | Urumi`;
          setLoading(false);
          // Remove the SSR data element after reading
          ssrDataElement.remove();
          return;
        } else {
          setError('Page not found');
          document.title = 'Page Not Found | Urumi';
          setLoading(false);
          ssrDataElement.remove();
          return;
        }
      } catch (err) {
        console.error('Error parsing SSR data:', err);
      }
    }

    // Fallback to REST API if SSR data not available
    const restUrl = window.wpData?.restUrl || '/wp-json/';
    const apiUrl = restUrl.endsWith('/') ? `${restUrl}wp/v2/` : `${restUrl}/wp/v2/`;

    fetch(`${apiUrl}pages?slug=${slug}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch page');
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setPage(data[0]);
          document.title = `${data[0].title?.rendered || 'Page'} | Urumi`;
        } else {
          setError('Page not found');
          document.title = 'Page Not Found | Urumi';
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching page:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading page...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="page-error">
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="back-to-home">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <article className="page-article">
        <header className="page-header">
          <h1
            className="page-title"
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />
        </header>

        {/* Page Content */}
        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </article>
    </div>
  );
}

export default Page;
