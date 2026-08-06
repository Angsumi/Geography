import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CentralPlateauVisual() {
  const [activeTab, setActiveTab] = useState('karbi');

  const highlights = [
    {
      id: 'karbi',
      name: 'Karbi Anglong (Mikir & Rengma Hills)',
      elevation: '1,363m (Singhason Peak)',
      desc: 'Extensive dissected plateau formed by Mikir and Rengma hills. Rich in minerals and dense tropical forests, serving as an ancient fragment of the Indian Peninsular Shield.',
      color: '#f59e0b',
      facts: ['District: Karbi Anglong', 'Peak: Singhason Peak', 'Governance: KAAC (Sixth Schedule)']
    },
    {
      id: 'haflong',
      name: 'Haflong & Dima Hasao (Barail Range)',
      elevation: '1,959m (Barail Range)',
      desc: 'Home to Haflong, the only hill station in Assam, nestled in the rugged Barail Range. Connects Assam to Nagaland and Manipur with breathtaking mist-covered valleys.',
      color: '#10b981',
      facts: ['District: Dima Hasao', 'Hill Station: Haflong', 'Governance: NCHAC (Sixth Schedule)']
    },
    {
      id: 'kopili',
      name: 'Kopili River Gap',
      elevation: 'River Valley Floor',
      desc: 'A strategic geological fault zone carved by the Kopili River, physically bisecting the Karbi Anglong plateau from the main Meghalaya Plateau.',
      color: '#38bdf8',
      facts: ['River: Kopili River', 'Geology: Tectonic Fault Line', 'Hydropower: Kopili Hydro Project']
    }
  ];

  const current = highlights.find(h => h.id === activeTab) || highlights[0];

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h5 style={{ margin: 0, fontSize: '0.88rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          ⛰️ Central Plateau & Hills Visualizer (Karbi Anglong & Haflong)
        </h5>
        <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '0.25rem 0.75rem', borderRadius: '10px', fontWeight: 'bold' }}>
          Peninsular Extension
        </span>
      </div>

      {/* Hero Image Showcase */}
      <div style={{ position: 'relative', height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <img 
          src="/haflong_hills.jpg" 
          alt="Haflong Central Hills Assam" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 60%)' }} />
        
        <div style={{ position: 'absolute', bottom: '15px', left: '20px', right: '20px' }}>
          <span style={{ fontSize: '0.7rem', color: '#f59e0b', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
            Featured Landmark
          </span>
          <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Haflong Hill Station & Barail Mountains
          </h3>
        </div>
      </div>

      {/* Interactive Feature Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {highlights.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: isActive ? `${item.color}22` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? item.color : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? item.color : 'var(--text-muted)',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: isActive ? 'bold' : 'normal',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div>{item.name}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: '0.2rem' }}>{item.elevation}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Feature Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${current.color}44`, borderRadius: '10px', padding: '1rem' }}
        >
          <h4 style={{ margin: '0 0 0.5rem', color: current.color, fontSize: '1.05rem' }}>{current.name}</h4>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {current.desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {current.facts.map((fact, idx) => (
              <span key={idx} style={{ background: `${current.color}15`, border: `1px solid ${current.color}33`, color: current.color, fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 'bold' }}>
                ✓ {fact}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
