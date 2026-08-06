import React from 'react';
import { motion } from 'framer-motion';

export function PlateauGridVisual() {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        ⛰️ Plateau Grid & Deccan Lava Trap
      </h5>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
        {['Malwa Plateau', 'Bundelkhand', 'Chotanagpur', 'Deccan Trap (Black Soil)'].map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, borderColor: '#ec4899' }}
            style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#f472b6' }}
          >
            {p}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
