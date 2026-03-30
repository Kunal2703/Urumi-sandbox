/**
 * PainpointFlipCards Component
 *
 * Pastel, playful flip-card section showing agency painpoints
 * vs Urumi solutions. Cards flip on hover with a 3D rotation.
 *
 * @author Urumi.ai
 */

import React, { useState } from 'react';
import '../styles/PainpointFlipCards.css';

const CARDS = [
  {
    id: 1,
    emoji: '🐌',
    solutionEmoji: '⚡',
    painLabel: 'PAINPOINT',
    painHeading: 'Weeks of Waiting',
    painDescription:
      'Traditional agencies run on bloated timelines—endless discovery phases, slow feedback loops, and "we\'ll get back to you next sprint." A simple storefront change can take weeks.',
    solutionLabel: 'HOW URUMI SOLVES IT',
    solutionHeading: 'Ship in Days, Not Weeks',
    solutionDescription:
      'Urumi\'s agentic AI platform automates the heavy lifting—code generation, testing, deployment. What used to take agencies weeks now ships in days with continuous delivery built in.',
    accentColor: '#FFD6E0',   // soft pink
    accentDark: '#E8506A',
  },
  {
    id: 2,
    emoji: '😬',
    solutionEmoji: '✨',
    painLabel: 'PAINPOINT',
    painHeading: 'Substandard Quality',
    painDescription:
      'Outsourced dev teams, junior contractors, copy-paste templates. The result? A store that looks generic, breaks on mobile, and tanks your Core Web Vitals.',
    solutionLabel: 'HOW URUMI SOLVES IT',
    solutionHeading: 'Enterprise-Grade Quality',
    solutionDescription:
      'Every Urumi build is performance-optimised from day one—sub-second load times, flawless mobile UX, and clean architecture. We deliver Google Cloud-backed infrastructure with p99 latency under 1 second.',
    accentColor: '#D4F0FF',   // soft blue
    accentDark: '#3B82F6',
  },
  {
    id: 3,
    emoji: '💸',
    solutionEmoji: '🤝',
    painLabel: 'PAINPOINT',
    painHeading: 'Hidden Fees & Vague Scopes',
    painDescription:
      'Agencies quote low, then pile on change requests, "out-of-scope" charges, and mysterious line items. You never know the real cost until the invoice lands.',
    solutionLabel: 'HOW URUMI SOLVES IT',
    solutionHeading: 'Transparent, Honest Pricing',
    solutionDescription:
      'Urumi offers clear, upfront pricing—no hidden fees, no surprise invoices. You see exactly what you\'re paying for: infrastructure, support, and performance, all included from the start.',
    accentColor: '#E2D6FF',   // soft lavender
    accentDark: '#8B5CF6',
  },
];

const FlipCard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="pfc-card-wrapper"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`pfc-card-inner ${isFlipped ? 'pfc-flipped' : ''}`}>
        {/* -------- FRONT — Pain Point -------- */}
        <div
          className="pfc-card-face pfc-card-front"
          style={{
            '--card-accent': card.accentColor,
            '--card-accent-dark': card.accentDark,
          }}
        >
          <span className="pfc-card-emoji">{card.emoji}</span>
          <span className="pfc-card-label pfc-label-pain">{card.painLabel}</span>
          <h3 className="pfc-card-heading">{card.painHeading}</h3>
          <p className="pfc-card-description">{card.painDescription}</p>
          <span className="pfc-flip-hint">Hover to see how Urumi fixes this →</span>
        </div>

        {/* -------- BACK — Solution -------- */}
        <div
          className="pfc-card-face pfc-card-back"
          style={{
            '--card-accent': card.accentColor,
            '--card-accent-dark': card.accentDark,
          }}
        >
          <span className="pfc-card-emoji">{card.solutionEmoji}</span>
          <span className="pfc-card-label pfc-label-solution">{card.solutionLabel}</span>
          <h3 className="pfc-card-heading pfc-heading-solution">{card.solutionHeading}</h3>
          <p className="pfc-card-description">{card.solutionDescription}</p>
        </div>
      </div>
    </div>
  );
};

const PainpointFlipCards = () => (
  <section className="pfc-section">
    {/* Decorative blobs */}
    <div className="pfc-blob pfc-blob-1" />
    <div className="pfc-blob pfc-blob-2" />
    <div className="pfc-blob pfc-blob-3" />

    <div className="pfc-inner">
      <p className="pfc-eyebrow">WHY URUMI? —</p>
      <h2 className="pfc-headline">
        We're not an old-school agency—
        <br />
        <span className="pfc-headline-accent">so you don't get old-school problems.</span>
      </h2>
      <p className="pfc-subtext">Hover each card to see the Urumi difference.</p>

      <div className="pfc-cards-stack">
        {CARDS.map((card) => (
          <FlipCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  </section>
);

export default PainpointFlipCards;
