import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DeccanPlateauVisual() {
  const [activeZone, setActiveZone] = useState('blackSoil');

  const zones = {
    blackSoil: {
      title: '🌋 Deccan Trap & Regur (Black Soil)',
      desc: 'Formed by fissure lava eruptions during the Cretaceous period. The resulting basaltic weathering yields mineral-rich, moisture-retentive Regur (black cotton soil).',
      accent: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.12)',
      border: 'rgba(168, 85, 247, 0.4)',
      stats: 'Rich in Iron, Mg, Ca · Ideal for Cotton & Sugarcane'
    },
    westernGhats: {
      title: '⛰️ Western Ghats Flank (Sahyadri)',
      desc: 'Continuous mountain wall along the western margin (avg elev 900–1600m). Forces moisture-laden Arabian Sea winds to yield heavy orographic rainfall.',
      accent: '#34d399',
      bg: 'rgba(52, 211, 153, 0.12)',
      border: 'rgba(52, 211, 153, 0.4)',
      stats: 'Highest Peak: Anaimudi (2,695m) · UNESCO Hotspot'
    },
    easternGhats: {
      title: '🌊 Eastern Ghats & Eastward Tilt',
      desc: 'Discontinuous, highly eroded hills cut by major rivers. The plateau gently tilts eastward, directing Godavari, Krishna, & Cauvery to the Bay of Bengal.',
      accent: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.4)',
      stats: 'Average Elevation: 600m · Dissected by River Deltas'
    },
    triangularForm: {
      title: '📐 Triangular Peninsular Shield',
      desc: 'Bounded by the Satpura/Vindhya range in the north, Western Ghats in the west, and Eastern Ghats in the east. Forms India’s largest physiographic unit.',
      accent: '#fb923c',
      bg: 'rgba(251, 146, 60, 0.12)',
      border: 'rgba(251, 146, 60, 0.4)',
      stats: 'Area: ~5,00,000 sq km · South of Narmada River'
    }
  };

  const current = zones[activeZone];

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(12px)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c084fc' }}>
            Interactive Geological Diagram
          </span>
          <h4 style={{ margin: '0.1rem 0 0', fontSize: '1.15rem', color: '#f3e8ff', fontWeight: 800 }}>
            📐 Deccan Plateau & Volcanic Trap
          </h4>
        </div>
        <span style={{
          fontSize: '0.7rem',
          padding: '0.25rem 0.6rem',
          background: 'rgba(168, 85, 247, 0.15)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          color: '#e9d5ff',
          borderRadius: '20px',
          fontWeight: 600
        }}>
          South of Narmada River
        </span>
      </div>

      {/* Triangular Plateau Visualization Canvas */}
      <div style={{
        position: 'relative',
        background: 'rgba(10, 15, 30, 0.6)',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '1rem',
        overflow: 'hidden'
      }}>
        {/* Decorative Grid Lines */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }}>
          <pattern id="deccan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#a855f7" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#deccan-grid)" />
        </svg>

        {/* Triangular Plateau Map Diagram */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', position: 'relative', zIndex: 2 }}>
          {Object.keys(zones).map(key => {
            const z = zones[key];
            const isSelected = activeZone === key;
            return (
              <motion.button
                key={key}
                onClick={() => setActiveZone(key)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: isSelected ? z.bg : 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${isSelected ? z.accent : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isSelected ? `0 0 16px ${z.accent}40` : 'none',
                  color: isSelected ? z.accent : '#cbd5e1',
                  padding: '0.75rem 0.6rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                  {z.title.split(' ')[0]} {z.title.split(' ').slice(1, 3).join(' ')}
                </div>
                <div style={{ fontSize: '0.62rem', color: isSelected ? z.accent : '#64748b', opacity: isSelected ? 1 : 0.8 }}>
                  Click to inspect
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Feature Detail Drawer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeZone}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          style={{
            background: current.bg,
            border: `1px solid ${current.border}`,
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: `0 4px 20px ${current.accent}20`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <h5 style={{ margin: 0, fontSize: '0.95rem', color: current.accent, fontWeight: 800 }}>
              {current.title}
            </h5>
            <span style={{ fontSize: '0.65rem', color: current.accent, background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
              {current.stats}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5 }}>
            {current.desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
