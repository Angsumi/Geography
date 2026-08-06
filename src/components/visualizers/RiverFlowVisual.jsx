import React from 'react';
import { motion } from 'framer-motion';

export function RiverFlowVisual({ riverName }) {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        💧 Animated River Drainage Flow
      </h5>
      <div style={{ height: '60px', background: 'rgba(30, 58, 138, 0.4)', borderRadius: '8px', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', padding: '0 1rem', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          style={{ width: '40%', height: '4px', background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)', position: 'absolute' }}
        />
        <span style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 'bold', zIndex: 1 }}>
          Drainage Network: {riverName}
        </span>
      </div>
    </div>
  );
}
