/**
 * FloatingBubbles Component
 *
 * Renders floating, pulsing circles in the lower half of the "Our Team" card.
 * Shows team member photos (founders bigger) and company logos they've worked with,
 * plus decorative empty bubbles of various sizes.
 *
 * Each bubble floats gently (translateX/Y oscillation) and pulses (scale breathing).
 * All animations use CSS keyframes with randomized durations/delays for organic feel.
 *
 * @author Urumi.ai
 */

import React, { useMemo } from 'react';

const FloatingBubbles = ({ themeUrl }) => {
  const basePath = `${themeUrl}/public/team-bubbles`;

  // Bubble definitions — evenly distributed to fill space without gaps or overlaps
  const bubbles = useMemo(() => [
    // ── Founders — biggest bubbles ──
    {
      id: 'naman',
      type: 'founder',
      src: `${basePath}/naman.png`,
      alt: 'Naman – Co-founder',
      size: 74,
      top: '10%',
      left: '5%',
    },
    {
      id: 'vedanshu',
      type: 'founder',
      src: `${basePath}/vedanshu.png`,
      alt: 'Vedanshu – Co-founder',
      size: 70,
      top: '58%',
      left: '58%',
    },

    // ── Company logos — repositioned to prevent overlap ──
    {
      id: 'google',
      type: 'logo',
      src: `${basePath}/google-logo.jpg`,
      alt: 'Google',
      size: 48,
      top: '38%',
      left: '48%',
    },
    {
      id: 'meta',
      type: 'logo',
      src: `${basePath}/meta-logo.png`,
      alt: 'Meta',
      size: 46,
      top: '52%',
      left: '12%',
    },
    {
      id: 'gruum',
      type: 'logo',
      src: `${basePath}/gruum-logo.svg`,
      alt: 'grüum',
      size: 62,
      top: '12%',
      left: '58%',
    },
    {
      id: 'webflow',
      type: 'logo',
      src: `${basePath}/webflow-logo.png`,
      alt: 'Webflow',
      size: 40,
      top: '68%',
      left: '82%',
    },
    {
      id: 'wordpress',
      type: 'logo',
      src: `${basePath}/wordpress-logo.png`,
      alt: 'WordPress',
      size: 44,
      top: '78%',
      left: '32%',
    },
    {
      id: 'antler',
      type: 'logo',
      src: `${basePath}/antler-logo.jpg`,
      alt: 'Antler',
      size: 42,
      top: '25%',
      left: '85%',
    },

    // ── Decorative empty bubbles — fill gaps throughout ──
    { id: 'e1',  type: 'empty', size: 18, top: '5%',  left: '32%' },
    { id: 'e2',  type: 'empty', size: 10, top: '20%', left: '88%' },
    { id: 'e3',  type: 'empty', size: 14, top: '48%', left: '72%' },
    { id: 'e4',  type: 'empty', size: 8,  top: '65%', left: '42%' },
    { id: 'e6',  type: 'empty', size: 6,  top: '28%', left: '32%' },
    { id: 'e7',  type: 'empty', size: 16, top: '88%', left: '65%' },
    { id: 'e8',  type: 'empty', size: 11, top: '32%', left: '8%'  },
    { id: 'e9',  type: 'empty', size: 7,  top: '68%', left: '15%' },
    { id: 'e10', type: 'empty', size: 14, top: '78%', left: '52%' },
    { id: 'e11', type: 'empty', size: 5,  top: '12%', left: '75%' },
    { id: 'e12', type: 'empty', size: 9,  top: '92%', left: '18%' },
    { id: 'e13', type: 'empty', size: 12, top: '8%',  left: '85%' },
    { id: 'e14', type: 'empty', size: 4,  top: '58%', left: '28%' },
    { id: 'e15', type: 'empty', size: 13, top: '88%', left: '38%' },
  ], [basePath]);

  // Each bubble gets a unique, seeded random animation config
  const getAnimStyle = (index, size) => {
    const floatDur  = 10 + (index * 1.3) % 8;       // 10–18s float cycle (slow, dreamy)
    const pulseDur  = 8  + (index * 0.9) % 6;        // 8–14s pulse cycle (gentle breathing)
    const delay     = -(index * 1.4) % 10;            // stagger start
    const floatX    = 4 + (index * 1.1) % 6;          // px drift range (subtle)
    const floatY    = 3 + (index * 0.9) % 7;          // px drift range (subtle)

    return {
      '--float-x': `${floatX}px`,
      '--float-y': `${floatY}px`,
      '--float-dur': `${floatDur.toFixed(1)}s`,
      '--pulse-dur': `${pulseDur.toFixed(1)}s`,
      '--anim-delay': `${delay.toFixed(1)}s`,
      width: size,
      height: size,
    };
  };

  return (
    <div className="floating-bubbles-container" aria-hidden="true">
      {bubbles.map((b, i) => {
        const style = {
          ...getAnimStyle(i, b.size),
          top: b.top,
          left: b.left,
        };

        if (b.type === 'empty') {
          return (
            <span
              key={b.id}
              className="floating-bubble floating-bubble--empty"
              style={style}
            />
          );
        }

        return (
          <span
            key={b.id}
            className={`floating-bubble floating-bubble--${b.type}`}
            data-logo={b.id}
            style={style}
          >
            <img src={b.src} alt={b.alt} draggable="false" />
          </span>
        );
      })}
    </div>
  );
};

export default FloatingBubbles;
