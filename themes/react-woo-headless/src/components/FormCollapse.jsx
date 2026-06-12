/**
 * FormCollapse Component
 *
 * Collapsible section for embedding Google Forms or other forms
 * @author Urumi.ai
 */

import React, { forwardRef, useState, useEffect } from 'react';
import '../styles/FormCollapse.css';

const FormCollapse = forwardRef(({ isOpen, onClose, formUrl, title = "Schedule a Demo" }, ref) => {
  // Latch the iframe to "load it once we have ever been open". Without
  // this, every Vision/WC visitor downloads the Google Forms iframe
  // (~50KB + GF runtime) even when they never click "Demo with
  // Founders". The latch (instead of toggling on isOpen) means closing
  // the form does not tear down the iframe and re-fetch it on reopen.
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  return (
    <div ref={ref} className={`form-collapse ${isOpen ? 'form-collapse-open' : ''}`} id="demo-form-section">
      <div className="form-collapse-content">
        <div className="form-collapse-header">
          <h3 className="form-collapse-title">{title}</h3>
          <button
            className="form-collapse-close"
            onClick={onClose}
            aria-label="Close form"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="form-collapse-body">
          {hasOpened ? (
            <iframe
              src={formUrl}
              width="100%"
              height="1465"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              loading="lazy"
              title="Demo Request Form"
            >
              Loading…
            </iframe>
          ) : null}
        </div>
      </div>
    </div>
  );
});

FormCollapse.displayName = 'FormCollapse';

export default FormCollapse;
