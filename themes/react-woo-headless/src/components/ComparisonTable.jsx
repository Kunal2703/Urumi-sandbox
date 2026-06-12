/**
 * Comparison Table Component
 * Why Urumi vs Typical Host/Agency
 *
 * @author Urumi.ai
 */

import React from 'react';
import '../styles/ComparisonTable.css';

const ComparisonTable = () => {
  const comparisons = [
    {
      category: 'Viral-ready scaling',
      typical: 'x', // Not available
      urumi: 'check'
    },
    {
      category: 'Multi-zone reliability',
      typical: 'paid',
      urumi: 'check'
    },
    {
      category: 'Staging + CI/CD',
      typical: 'paid',
      urumi: 'check'
    },
    {
      category: 'Weekly performance audits',
      typical: 'x',
      urumi: 'check'
    },
    {
      category: 'Root-cause performance fixes',
      typical: 'x',
      urumi: 'check'
    },
    {
      category: 'Traffic spikes included',
      typical: 'paid',
      urumi: 'check'
    },
    {
      category: 'Clear incident ownership',
      typical: 'x',
      urumi: 'check'
    },
    {
      category: 'APM + monitoring',
      typical: 'paid',
      urumi: 'check'
    }
  ];

  return (
    <section className="comparison-section">
      <div className="comparison-container">
        <h2 className="comparison-headline">Why Urumi vs Typical Host/Agency</h2>
        <p className="comparison-subheading">
          Urumi is a managed operations + performance team, not a host that sells compute.
        </p>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="col-category"></th>
                <th className="col-typical">TYPICAL HOST</th>
                <th className="col-urumi">Urumi</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, index) => (
                <tr key={index} className="comparison-row">
                  <td className="cell-category">{item.category}</td>
                  <td className="cell-typical cell-icon">
                    {item.typical === 'check' && (
                      <svg className="icon-check" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 12l2.5 2.5 5.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {item.typical === 'x' && (
                      <svg className="icon-x" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                    {item.typical === 'paid' && (
                      <span className="icon-dollar">$</span>
                    )}
                  </td>
                  <td className="cell-urumi cell-icon">
                    {item.urumi === 'check' && (
                      <svg className="icon-check" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 12l2.5 2.5 5.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
