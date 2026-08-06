import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function VerticalDivisionsVisual() {
  const [selectedPeak, setSelectedPeak] = useState(null);

  const peaks = [
    {
      id: 'himadri',
      name: 'Himadri / Greater Himalaya',
      height: '220px',
      width: '180px',
      color: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
      snowHeight: '65px',
      rank: 'Tallest Peak (Avg: 6000m)',
      desc: 'Innermost, continuous range. Contains highest peaks including Mt. Everest and Kanchenjunga. Covered in perpetual snow.'
    },
    {
      id: 'himachal',
      name: 'Himachal / Lesser Himalaya',
      height: '165px',
      width: '150px',
      color: 'linear-gradient(135deg, #94a3b8, #475569)',
      snowHeight: '30px',
      rank: 'Middle Range (Avg: 3700-4500m)',
      desc: 'Rugged mountain system, home to famous hill stations like Shimla, Mussoorie, Nainital, and Darjeeling. Bounded by Pir Panjal.'
    },
    {
      id: 'shivalik',
      name: 'Shivalik / Outer Himalaya',
      height: '110px',
      width: '130px',
      color: 'linear-gradient(135deg, #16a34a, #14532d)',
      snowHeight: '0px',
      rank: 'Lowest Foothills (Avg: 900-1100m)',
      desc: 'Outermost foothills composed of unconsolidated sediments. Flat-bottomed valleys (Duns) like Dehradun are located here.'
    }
  ];

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.05em' }}>
        ⛰️ Interactive Vertical Elevation Layers (Click Peaks to Inspect)
      </h5>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '240px', gap: '1rem', borderBottom: '2px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', paddingBottom: '1px' }}>
        {peaks.map(p => {
          const isSelected = selectedPeak?.id === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPeak(p)}
              style={{
                width: p.width,
                height: p.height,
                background: p.color,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.3s, filter 0.3s',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                filter: isSelected ? 'drop-shadow(0 0 12px var(--primary-glow))' : 'none',
                opacity: selectedPeak && !isSelected ? 0.6 : 1
              }}
            >
              {p.snowHeight !== '0px' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: p.snowHeight,
                  background: '#ffffff',
                  clipPath: 'polygon(50% 0%, 20% 100%, 35% 80%, 50% 100%, 65% 80%, 80% 100%)',
                  opacity: 0.95
                }} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedPeak ? (
          <motion.div
            key={selectedPeak.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              background: 'rgba(74, 222, 128, 0.08)',
              border: '1px solid var(--primary)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <h6 style={{ margin: 0, color: 'var(--primary)', fontSize: '0.95rem' }}>{selectedPeak.name}</h6>
              <span style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                {selectedPeak.rank}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              {selectedPeak.desc}
            </p>
          </motion.div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.75rem', margin: 0 }}>
            Click on Himadri, Himachal, or Shivalik peaks to inspect detailed range traits.
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}
