/**
 * Environment Variable Display Page
 *
 * Displays a single environment variable value from wp-config-local.php.
 * Reads from wpData.envVars (injected server-side) with REST API fallback.
 *
 * @author Urumi.ai
 */

import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

function EnvVar() {
  const location = useLocation();
  const name = location.pathname.replace('/', '');
  const varKey = name?.toUpperCase();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${varKey} | Urumi`;

    // Try wpData first (already injected by PHP)
    const injected = window.wpData?.envVars?.[varKey];
    if (injected !== undefined) {
      setValue(injected);
      setLoading(false);
      return;
    }

    // Fallback: fetch from REST API
    const restUrl = window.wpData?.restUrl || '/wp-json/';
    const base = restUrl.endsWith('/') ? restUrl : restUrl + '/';

    fetch(`${base}urumi/v1/${name}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setValue(data.value);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error fetching ${varKey}:`, err);
        setError(err.message);
        setLoading(false);
      });
  }, [name, varKey]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <h2>Error</h2>
        <p>Could not load {varKey}: {error}</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <article className="page-article">
        <header className="page-header">
          <h1 className="page-title">{varKey}</h1>
        </header>
        <div className="page-content">
          <p><strong>Value:</strong> {value !== null ? value : <em>Not set</em>}</p>
        </div>
      </article>
    </div>
  );
}

export default EnvVar;
