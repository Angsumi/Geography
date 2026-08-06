import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function StateProfileVisual({ stateName, capital, animal, bird, flower, peak, park, fauna, hills }) {
  const [activeTab, setActiveTab] = useState('symbols');

  const getThemeColor = () => {
    switch (stateName?.toUpperCase()) {
      case 'ARUNACHAL PRADESH': return '#60a5fa';
      case 'ASSAM': return '#34d399';
      case 'MANIPUR': return '#a78bfa';
      case 'MEGHALAYA': return '#fb923c';
      case 'MIZORAM': return '#f472b6';
      case 'NAGALAND': return '#fbbf24';
      case 'TRIPURA': return '#38bdf8';
      default: return 'var(--primary)';
    }
  };

  const themeColor = getThemeColor();

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: `1px solid ${themeColor}66`, borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <h5 style={{ margin: 0, fontSize: '0.9rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🏛️ {stateName} State Profile & Ecology Dashboard
        </h5>
        <span style={{ fontSize: '0.7rem', background: themeColor + '22', color: themeColor, padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 'bold' }}>
          Capital: {capital}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
        <button
          onClick={() => setActiveTab('symbols')}
          style={{
            flex: 1,
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            border: `1px solid ${activeTab === 'symbols' ? themeColor : 'rgba(255,255,255,0.08)'}`,
            background: activeTab === 'symbols' ? themeColor + '25' : 'transparent',
            color: activeTab === 'symbols' ? themeColor : 'var(--text-muted)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'symbols' ? 'bold' : 'normal'
          }}
        >
          🌺 State Emblems & Symbols
        </button>
        <button
          onClick={() => setActiveTab('ecology')}
          style={{
            flex: 1,
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            border: `1px solid ${activeTab === 'ecology' ? themeColor : 'rgba(255,255,255,0.08)'}`,
            background: activeTab === 'ecology' ? themeColor + '25' : 'transparent',
            color: activeTab === 'ecology' ? themeColor : 'var(--text-muted)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'ecology' ? 'bold' : 'normal'
          }}
        >
          ⛰️ Topography & Protected Parks
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'symbols' ? (
          <motion.div
            key="symbols"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}
          >
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>State Animal</span>
              <h6 style={{ margin: '0.2rem 0 0', color: themeColor, fontSize: '0.8rem' }}>{animal}</h6>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>State Bird</span>
              <h6 style={{ margin: '0.2rem 0 0', color: themeColor, fontSize: '0.8rem' }}>{bird}</h6>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>State Flower</span>
              <h6 style={{ margin: '0.2rem 0 0', color: themeColor, fontSize: '0.8rem' }}>{flower}</h6>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ecology"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}
          >
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.65rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>⛰️ Highest Peak / Elevation</span>
              <p style={{ margin: '0.2rem 0 0', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 'bold' }}>{peak}</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.65rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>🏞️ Protected National Parks</span>
              <p style={{ margin: '0.2rem 0 0', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 'bold' }}>{park}</p>
            </div>
            {fauna && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.65rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>🐅 Special Conserved Fauna</span>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 'bold' }}>{fauna}</p>
              </div>
            )}
            {hills && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.65rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>🏔️ Major Hills</span>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 'bold' }}>{hills}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
