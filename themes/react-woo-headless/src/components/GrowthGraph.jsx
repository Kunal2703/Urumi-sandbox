/**
 * GrowthGraph – Minimal animated SVG line graph
 *
 * A smooth upward-trending line with a subtle gradient fill beneath it.
 * Draws on with a stroke-dashoffset animation and loops infinitely.
 * No text, no axes labels – pure visual.
 *
 * @author Urumi.ai
 */

import React from 'react';

const GrowthGraph = () => {
  // Upward-trending path with natural dips
  const linePath = 'M0,90 C20,88 35,85 50,78 C65,71 75,74 90,65 C105,56 115,60 130,48 C145,36 155,40 170,30 C185,20 195,24 210,15 C225,6 235,10 250,4';

  return (
    <div className="growth-graph-wrapper">
      <svg
        className="growth-graph-svg"
        viewBox="0 0 250 100"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          {/* Clip that reveals left-to-right in sync with the line draw */}
          <clipPath id="revealClip">
            <rect className="growth-graph-reveal" x="0" y="0" width="250" height="100" />
          </clipPath>
        </defs>

        {/* Filled area beneath the line – revealed with clip */}
        <path
          d={`${linePath} L250,100 L0,100 Z`}
          fill="url(#growthFill)"
          clipPath="url(#revealClip)"
        />

        {/* The animated line itself */}
        <path
          className="growth-graph-line"
          d={linePath}
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Dot at the end of the line */}
        <circle
          className="growth-graph-dot"
          cx="250"
          cy="4"
          r="3.5"
          fill="#6366f1"
        />
      </svg>
    </div>
  );
};

export default GrowthGraph;
