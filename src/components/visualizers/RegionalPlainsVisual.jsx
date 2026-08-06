import React from 'react';
import { motion } from 'framer-motion';

export function RegionalPlainsVisual() {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        🌾 Interactive Plains Regional Zones
      </h5>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {[
          { title: 'Punjab Plains', detail: 'Indus Tributaries & Doabs', bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444' },
          { title: 'Ganga Plains', detail: 'Central Productive Alluvial Belt', bg: 'rgba(129, 140, 248, 0.15)', border: '#818cf8' },
          { title: 'Brahmaputra Valley', detail: 'Eastern Luit Valley', bg: 'rgba(74, 222, 128, 0.15)', border: '#4ade80' }
        ].map((zone, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.04, background: zone.bg }}
            style={{ padding: '0.8rem', borderRadius: '10px', border: `1px solid ${zone.border}`, textAlign: 'center', cursor: 'pointer' }}
          >
            <h6 style={{ margin: '0 0 0.2rem', color: zone.border, fontSize: '0.8rem' }}>{zone.title}</h6>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{zone.detail}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
