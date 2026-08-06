import React from 'react';
import { motion } from 'framer-motion';

export function MountainRangesGhatsVisual() {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        📍 Ghats Junction (Nilgiri Node) & Peak Markers
      </h5>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '90px', position: 'relative' }}>
        <div style={{ textAlign: 'center', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 'bold' }}>Western Ghats ➔</div>
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ background: '#10b981', color: '#000', padding: '0.5rem 0.9rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem', boxShadow: '0 0 15px var(--primary)' }}
        >
          Nilgiri Junction
        </motion.div>
        <div style={{ textAlign: 'center', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 'bold' }}>⬅ Eastern Ghats</div>
      </div>
    </div>
  );
}
