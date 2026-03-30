/**
 * FAQ Section Component
 * Frequently Asked Questions about Urumi WooCommerce Hosting
 *
 * @author Urumi.ai
 */

import React, { useState } from 'react';
import '../styles/FAQSection.css';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does Urumi's auto-scaling work for WooCommerce?",
      answer: "Urumi monitors your site's traffic in real-time and automatically scales server resources to match demand. Whether it's an expected spike like a flash sale or an unexpected surge from a viral moment, we scale horizontally to maintain fast page loads and stable checkout. This ensures your p99 latency stays under 1 second even during peak demand."
    },
    {
      question: "What makes Urumi different from traditional WooCommerce hosting?",
      answer: "Unlike traditional hosts that use fixed resources, Urumi provides enterprise-grade infrastructure with multi-zone redundancy, automatic failover, AI-powered performance monitoring, and staging environments with CI/CD pipelines. We also offer APM tracing to identify performance bottlenecks before they impact customers, plus rollback-ready deployments for safe releases."
    },
    {
      question: "Do you support HPOS (High-Performance Order Storage)?",
      answer: "Yes! Urumi fully supports WooCommerce HPOS. Our infrastructure is optimized for the custom tables architecture, providing faster order processing and better database performance compared to legacy post-based storage."
    },
    {
      question: "How long does migration to Urumi take?",
      answer: "Most WooCommerce migrations are completed within 24-48 hours. Our team handles the entire process including database migration, DNS updates, SSL setup, and performance optimization. We ensure zero downtime by coordinating the final cutover during your low-traffic period."
    },
    {
      question: "What kind of performance improvements can I expect?",
      answer: "Results vary by site, but customers typically see 50-300% improvements in page load times. For example, grüum saw cached response times drop from 4s to 0.3s and uncached from 5.7s to 2.7s, resulting in a 294% improvement in user satisfaction. We provide detailed APM traces so you can see exactly where the gains come from."
    },
    {
      question: "Does Urumi include staging environments?",
      answer: "Yes! Every Urumi plan includes a premium staging environment where you can test plugin updates, theme changes, and new features before deploying to production. We also support CI/CD pipelines for automated testing and deployment workflows."
    },
    {
      question: "How does the 99.99% uptime guarantee work?",
      answer: "Our infrastructure uses Google Cloud's multi-zone architecture with automatic failover. If one zone experiences issues, traffic automatically routes to healthy zones. We also maintain offsite backups and can restore your site within minutes. Our SLA guarantees 99.99% uptime with credits for any downtime beyond that threshold."
    },
    {
      question: "Can Urumi help debug performance issues on my current host?",
      answer: "Absolutely! We offer free WooCommerce performance audits where we analyze your infrastructure, traffic patterns, and deployment workflow to identify critical performance and reliability risks. We'll show you exactly what's causing slowdowns and how to eliminate them—whether you migrate to Urumi or not."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Everything you need to know about Urumi's WooCommerce hosting</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="faq-toggle">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <span className="faq-cta-text">Still have questions? </span>
          <a
            href="#demo-form-section"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('openDemoForm'));
            }}
            className="faq-cta-button"
          >
            Talk to our team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
