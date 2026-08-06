import React from 'react';
import { motion } from 'framer-motion';

export function GeneralStructureVisual({ idea }) {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        📑 3D Folded Mountain Structure
      </h5>
      <div style={{ display: 'flex', gap: '0.5rem', height: '100px', perspective: '600px', justifyContent: 'center', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            animate={{ rotateY: i % 2 === 0 ? 25 : -25 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3, ease: 'easeInOut', delay: i * 0.2 }}
            style={{
              width: '50px',
              height: '80px',
              background: i % 2 === 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #34d399, #047857)',
              borderRadius: '6px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            Fold {i}
          </motion.div>
        ))}
      </div>
      {idea && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.75rem 0 0', textAlign: 'center' }}>💡 {idea}</p>}
    </div>
  );
}
