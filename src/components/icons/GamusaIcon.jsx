import React from 'react';
import { motion } from 'framer-motion';

/**
 * Traditional Animated Waving Assamese Gamusa (Gamosa) Flag Icon
 * Features S-curve fabric waving contours, 3D fold highlights,
 * red woven borders (Pori), traditional Phulam motifs, and animated wind wave effect.
 */
export function GamusaIcon({ size = 28, className = '', style = {}, animated = true }) {
  const width = size;
  const height = Math.round(size * 0.75);

  return (
    <motion.div
      className={`gamusa-waving-wrapper ${className}`}
      animate={animated ? {
        y: [0, -1.5, 1, -0.5, 0],
        rotate: [0, 1.5, -1, 0.5, 0],
        scale: [1, 1.02, 0.99, 1]
      } : {}}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justify: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 3px 6px rgba(220, 38, 38, 0.4))',
        flexShrink: 0,
        ...style
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 46 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <g clipPath="url(#gamusa-wave-clip)">
          {/* Crisp White Woven Cloth Base with S-Curve Wave Contour */}
          <rect width="46" height="32" fill="#FAF9F6" />

          {/* Top & Bottom Red Woven Stripes (Pori) */}
          <path d="M 0 0 C 12 1.5, 24 0, 46 1.5 L 46 5.5 C 24 4, 12 5.5, 0 4 Z" fill="#DC2626" />
          <path d="M 0 26.5 C 12 28, 24 26.5, 46 28 L 46 32 C 24 30.5, 12 32, 0 30.5 Z" fill="#DC2626" />

          {/* Inner Red Dash Weave Lines */}
          <path d="M 0 6.5 Q 23 8, 46 6.5" stroke="#B91C1C" strokeWidth="0.8" strokeDasharray="1.5 1" fill="none" />
          <path d="M 0 25.5 Q 23 27, 46 25.5" stroke="#B91C1C" strokeWidth="0.8" strokeDasharray="1.5 1" fill="none" />

          {/* Left End Phulam Panel (Woven Red Motif Strip) */}
          <rect x="2" y="4" width="6" height="23" fill="#FEE2E2" opacity="0.6" />
          <rect x="4" y="6" width="2.5" height="19" fill="#DC2626" />

          {/* Right End Phulam Panel (Woven Red Motif Strip) */}
          <rect x="36" y="4" width="6" height="23" fill="#FEE2E2" opacity="0.6" />
          <rect x="37.5" y="6" width="2.5" height="19" fill="#DC2626" />

          {/* Traditional Center Phulam (Assamese Diamond Flower Motif) */}
          <g transform="translate(22, 16) scale(0.95)">
            {/* Diamond Outer Frame */}
            <polygon points="0,-7.5 7.5,0 0,7.5 -7.5,0" fill="none" stroke="#DC2626" strokeWidth="1.3" />
            {/* Inner Floral Petals */}
            <path d="M 0,-5.5 Q 2.5,-2.5 5.5,0 Q 2.5,2.5 0,5.5 Q -2.5,2.5 -5.5,0 Q -2.5,-2.5 0,-5.5 Z" fill="#DC2626" />
            <circle cx="0" cy="0" r="1.3" fill="#FFF" />
            {/* Red Diamond Accent Dots */}
            <circle cx="0" cy="-10" r="1" fill="#DC2626" />
            <circle cx="0" cy="10" r="1" fill="#DC2626" />
            <circle cx="-10" cy="0" r="1" fill="#DC2626" />
            <circle cx="10" cy="0" r="1" fill="#DC2626" />
          </g>

          {/* 3D Wave Crease Shadows & Glossy Highlights */}
          <rect width="46" height="32" fill="url(#gamusa-fold-shading)" style={{ mixBlendMode: 'multiply', opacity: 0.55 }} />
          <rect width="46" height="32" fill="url(#gamusa-fold-highlight)" style={{ mixBlendMode: 'overlay', opacity: 0.45 }} />
        </g>

        {/* Right Edge Fluttering Fringe Tassels (Anchali Fringes) */}
        <path d="M 44.5 1 L 44.5 31" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="1.2 1.5" />
        <path d="M 45.8 2 L 45.8 30" stroke="#B91C1C" strokeWidth="1" strokeDasharray="1 2" />

        <defs>
          {/* Wave Waving Mask Contour */}
          <clipPath id="gamusa-wave-clip">
            <path d="M 0 1.5 Q 11.5 -1, 23 1.5 T 45 1.5 L 45 30.5 Q 33.5 33, 22 30.5 T 0 30.5 Z" />
          </clipPath>

          {/* 3D Fold Crease Shading */}
          <linearGradient id="gamusa-fold-shading" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.25" />
            <stop offset="25%" stopColor="#FFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#000" stopOpacity="0.35" />
            <stop offset="75%" stopColor="#FFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
          </linearGradient>

          {/* 3D Glossy Sunlight Highlight */}
          <linearGradient id="gamusa-fold-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="15%" stopColor="#FFF" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#000" stopOpacity="0" />
            <stop offset="65%" stopColor="#FFF" stopOpacity="0.7" />
            <stop offset="90%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
