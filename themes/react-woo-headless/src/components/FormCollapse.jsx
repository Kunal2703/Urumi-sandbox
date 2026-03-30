/**
 * FormCollapse Component
 *
 * Collapsible section for embedding Google Forms or other forms
 * @author Urumi.ai
 */

import React, { forwardRef } from 'react';
import '../styles/FormCollapse.css';

const FormCollapse = forwardRef(({ isOpen, onClose, formUrl, title = "Schedule a Demo" }, ref) => {
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
          <iframe
            src={formUrl}
            width="100%"
            height="1465"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Demo Request Form"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
});

FormCollapse.displayName = 'FormCollapse';

export default FormCollapse;
