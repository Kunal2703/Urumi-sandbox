/**
 * Last Updated Footer Component
 * Renders last update timestamp as HTML comment for LLMs to read
 *
 * @author Urumi.ai
 */

import React from 'react';

const LastUpdated = () => {
  // Get current date in readable format
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div dangerouslySetInnerHTML={{
      __html: `<!-- Last updated: ${lastUpdated} -->`
    }} />
  );
};

export default LastUpdated;
