import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SubdivisionsWestEastVisual() {
  const [activeBend, setActiveBend] = useState('eastern');

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.05em' }}>
        🔄 Interactive Syntaxial Bends Arc Diagram
      </h5>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
        <svg width="420" height="150" viewBox="0 0 420 150" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#818cf8" />
              <stop offset="75%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>

          <path
            d="M 50 120 C 50 20, 370 20, 370 120"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <g onClick={() => setActiveBend('western')} style={{ cursor: 'pointer' }}>
            <circle cx="50" cy="120" r={activeBend === 'western' ? "11" : "7"} fill="#ef4444" stroke="#fff" strokeWidth="2" />
            <text x="5" y="142" fill="#ef4444" fontSize="10" fontWeight="bold">Nanga Parbat (West)</text>
          </g>

          <g onClick={() => setActiveBend('eastern')} style={{ cursor: 'pointer' }}>
            <circle cx="370" cy="120" r={activeBend === 'eastern' ? "11" : "7"} fill="#4ade80" stroke="#fff" strokeWidth="2" />
            <text x="310" y="142" fill="#4ade80" fontSize="10" fontWeight="bold">Namcha Barwa (East)</text>
          </g>

          <text x="210" y="35" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
            Main Himalayan Arc (~2,400 km)
          </text>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {activeBend === 'western' ? (
          <motion.div
            key="western"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444'
            }}
          >
            <h6 style={{ margin: '0 0 0.3rem', color: '#f87171', fontSize: '0.85rem' }}>📍 Western Syntaxial Bend (Nanga Parbat)</h6>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              Near <strong>Nanga Parbat</strong>, the Himalayan ranges take a sharp hairpin bend to the southwest, forming the <strong>Sulaiman and Kirthar Ranges</strong>.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="eastern"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid #4ade80'
            }}
          >
            <h6 style={{ margin: '0 0 0.3rem', color: '#4ade80', fontSize: '0.85rem' }}>📍 Eastern Syntaxial Bend (Namcha Barwa)</h6>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              Near <strong>Namcha Barwa</strong>, the Brahmaputra cuts a deep gorge where the mountain axis turns sharply southwards into Myanmar, forming the <strong>Purvanchal Hills</strong>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
