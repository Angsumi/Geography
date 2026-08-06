import React from 'react';
import { motion } from 'framer-motion';

export function TharDesertVisual() {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', overflow: 'hidden' }}>
      <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        🏜️ Animated Sand Dunes & Arid Climate
      </h5>
      <div style={{ height: '70px', background: 'linear-gradient(180deg, #78350f, #d97706)', borderRadius: '10px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          style={{ opacity: 0.25, fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '0.2em' }}
        >
          ~~~~ THAR DESERT ~~~~
        </motion.div>
        <span style={{ position: 'absolute', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          Annual Rainfall Below 150 mm
        </span>
      </div>
    </div>
  );
}
