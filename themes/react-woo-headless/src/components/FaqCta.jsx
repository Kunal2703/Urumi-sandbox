/**
 * FAQ + Final CTA Component
 * Playful pastel FAQ blocks stacked like playing blocks
 * with a bold "Let's build it!" CTA
 *
 * @author Urumi.ai
 */

import React, { useState, useEffect, useRef } from 'react';
import '../styles/FaqCta.css';

const FAQ_ITEMS = [
  {
    question: "How is Urumi different from regular WooCommerce hosting?",
    answer:
      "Most hosts just give you a server and wish you luck. Urumi is an agentic AI platform built specifically for WooCommerce — we handle performance tuning, deployment safety, and store monitoring so your team can focus on building, not firefighting.",
    rotate: -1.2,
    color: 'lavender',
  },
  {
    question: "Will Urumi work with my existing plugins and custom code?",
    answer:
      "Absolutely. Urumi runs standard WordPress + WooCommerce under the hood. Your plugins, custom themes, and integrations all work — we just make everything faster and safer with AI-powered guardrails around every deploy.",
    rotate: 0.8,
    color: 'mint',
  },
  {
    question: "What happens if a deploy breaks something?",
    answer:
      "That's the beauty of Performance Guardrails. Every change is benchmarked before and after. If we detect a regression, you get alerted instantly with the exact cause — and one-click rollback is always available.",
    rotate: -0.6,
    color: 'peach',
  },
  {
    question: "Can agencies white-label or manage multiple stores?",
    answer:
      "Yes! Our agency dashboard lets you manage all your client stores from one place — monitor performance, push updates, and get AI insights across your entire portfolio. Your clients see your brand, not ours.",
    rotate: 1.0,
    color: 'sky',
  },
  {
    question: "How fast can we migrate an existing store?",
    answer:
      "Most migrations take under 24 hours. We handle the heavy lifting — database, media, DNS — and run a full performance audit on arrival so your store launches faster than it was before.",
    rotate: -0.4,
    color: 'rose',
  },
];

const COLOR_MAP = {
  lavender: { bg: '#F0EAFF', border: '#D4C4F7', accent: '#B49AEA' },
  mint:     { bg: '#E6FFF4', border: '#B3E8D0', accent: '#6DCBA1' },
  peach:    { bg: '#FFF3EB', border: '#FACCAA', accent: '#F5A263' },
  sky:      { bg: '#EAF4FF', border: '#B4D7F5', accent: '#6DB3E8' },
  rose:     { bg: '#FFF0F3', border: '#F5BDC8', accent: '#E87D93' },
};

/* ---- Single FAQ Block ---- */
const FaqBlock = ({ item, index, isOpen, onToggle, isVisible }) => {
  const colors = COLOR_MAP[item.color];
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <button
      className={`faq-block ${isOpen ? 'faq-block--open' : ''} ${isVisible ? 'faq-block--visible' : ''}`}
      style={{
        '--block-bg': colors.bg,
        '--block-border': colors.border,
        '--block-accent': colors.accent,
        '--block-rotate': `${item.rotate}deg`,
        '--stagger': `${index * 0.1}s`,
      }}
      onClick={() => onToggle(index)}
      aria-expanded={isOpen}
    >
      <div className="faq-block__header">
        <span className="faq-block__question">{item.question}</span>
        <span className={`faq-block__icon ${isOpen ? 'faq-block__icon--open' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line
              x1="11" y1="4" x2="11" y2="18"
              stroke={colors.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="faq-icon-v"
            />
            <line
              x1="4" y1="11" x2="18" y2="11"
              stroke={colors.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>

      <div
        className="faq-block__body"
        style={{ maxHeight: isOpen ? contentHeight + 24 : 0 }}
      >
        <p ref={contentRef} className="faq-block__answer">
          {item.answer}
        </p>
      </div>
    </button>
  );
};

/* ---- Main Section ---- */
const FaqCta = ({ onCtaClick }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleToggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="faqcta-section" ref={sectionRef}>
      {/* Decorative floating blobs */}
      <div className="faqcta-blob faqcta-blob--1" />
      <div className="faqcta-blob faqcta-blob--2" />
      <div className="faqcta-blob faqcta-blob--3" />

      <div className={`faqcta-inner ${isVisible ? 'faqcta-inner--visible' : ''}`}>
        {/* Title */}
        <h2 className="faqcta-title">
          <span className="faqcta-title__fun">Got questions?</span>
          <br />
          <span className="faqcta-title__sub">We've got answers</span>
        </h2>

        {/* FAQ Stack */}
        <div className="faq-stack">
          {FAQ_ITEMS.map((item, i) => (
            <FaqBlock
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={handleToggle}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Final CTA */}
        <div className={`faqcta-cta-wrap ${isVisible ? 'faqcta-cta-wrap--visible' : ''}`}>
          <button
            className="faqcta-cta-btn"
            onClick={() => {
              if (onCtaClick) {
                onCtaClick();
              } else {
                const formSection = document.querySelector('.form-collapse-section');
                if (formSection) {
                  formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  window.dispatchEvent(new CustomEvent('openDemoForm'));
                }
              }
            }}
          >
            <span className="faqcta-cta-btn__text">Let's build it!</span>
            <span className="faqcta-cta-btn__arrow">&rarr;</span>
          </button>
          <p className="faqcta-cta-sub">Book a free walkthrough with our founders</p>
        </div>
      </div>

      {/* Subtle dentist credit line */}
      <p className="faqcta-dentist-credit">
        <span className="faqcta-dentist-credit__tooth">🦷</span>
        {' '}Can you believe it? This page was built by a dentist using{' '}
        <a href="https://urumi.ai" className="faqcta-dentist-credit__link" target="_blank" rel="noopener noreferrer">urumi.ai</a>
      </p>
    </section>
  );
};

export default FaqCta;
