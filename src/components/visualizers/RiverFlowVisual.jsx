import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, Compass, Droplet, ArrowRight, ShieldCheck } from 'lucide-react';

const RIVER_NETWORKS = {
  'indus': {
    name: 'The Indus River System',
    origin: 'Mansarovar Lake (Tibet)',
    outflow: 'Arabian Sea (via Pakistan)',
    tributaries: ['Jhelum', 'Chenab', 'Ravi', 'Beas', 'Sutlej'],
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    type: 'Antecedent Himalayan System'
  },
  'ganga': {
    name: 'The Ganga River System',
    origin: 'Gangotri Glacier (Bhagirathi) & Satopanth (Alaknanda)',
    outflow: 'Bay of Bengal (Meghna Delta / Sundarbans)',
    tributaries: ['Yamuna', 'Ramganga', 'Ghaghara', 'Gandak', 'Kosi', 'Son'],
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #059669, #34d399)',
    type: 'Perennial Himalayan System'
  },
  'brahmaputra': {
    name: 'The Brahmaputra River System',
    origin: 'Angsi Glacier (Tibet) as Yarlung Tsangpo',
    outflow: 'Bay of Bengal (Padma/Meghna confluence)',
    tributaries: ['Subansiri', 'Jia Bharali', 'Manas', 'Burhi Dihing', 'Dhansiri', 'Kopili'],
    color: '#fb923c',
    gradient: 'linear-gradient(135deg, #ea580c, #fb923c)',
    type: 'Braided Trans-Himalayan System'
  },
  'peninsular': {
    name: 'Peninsular River Systems',
    origin: 'Western Ghats (Godavari, Krishna, Cauvery) & Amarkantak (Narmada, Tapi)',
    outflow: 'Bay of Bengal (East Flowing) & Arabian Sea Estuaries (West Flowing)',
    tributaries: ['Godavari (Vinganga)', 'Krishna (Tungabhadra)', 'Cauvery', 'Narmada', 'Tapi'],
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #7e22ce, #c084fc)',
    type: 'Rain-fed Peninsular Basins'
  }
};

export function RiverFlowVisual({ riverName = '' }) {
  const [activeTab, setActiveTab] = useState(() => {
    const l = riverName.toLowerCase();
    if (l.includes('indus')) return 'indus';
    if (l.includes('ganga')) return 'ganga';
    if (l.includes('brahmaputra')) return 'brahmaputra';
    return 'peninsular';
  });

  const [activeTrib, setActiveTrib] = useState(null);
  const currentData = RIVER_NETWORKS[activeTab] || RIVER_NETWORKS.ganga;

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      {/* Visual Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: currentData.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
            <Waves size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 900 }}>
              Interactive River Flow Simulator
            </h4>
            <span style={{ fontSize: '0.68rem', color: currentData.color, fontWeight: 800, textTransform: 'uppercase' }}>
              {currentData.type}
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
          {Object.keys(RIVER_NETWORKS).map(key => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setActiveTrib(null); }}
              style={{
                background: activeTab === key ? RIVER_NETWORKS[key].color : 'transparent',
                color: activeTab === key ? '#000' : '#cbd5e1',
                border: 'none',
                padding: '0.35rem 0.65rem',
                borderRadius: 8,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Animated Flow Canvas */}
      <div style={{ background: 'rgba(2, 132, 199, 0.08)', borderRadius: 14, border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1rem', position: 'relative', overflow: 'hidden', minHeight: 140 }}>
        
        {/* Animated Stream Effect */}
        <svg width="100%" height="80" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={`flowGrad-${activeTab}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentData.color} stopOpacity="0.2" />
              <stop offset="50%" stopColor={currentData.color} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Main River Path */}
          <path
            d="M 20 40 C 150 10, 250 70, 400 40 Q 550 10, 750 40"
            fill="none"
            stroke={`url(#flowGrad-${activeTab})`}
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Pulse Stream Dot */}
          <motion.circle
            cx="20"
            cy="40"
            r="6"
            fill={currentData.color}
            animate={{ cx: [20, 750] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />

          {/* Branching Tributary Nodes */}
          {currentData.tributaries.map((trib, idx) => {
            const xPos = 120 + idx * 110;
            const yPos = idx % 2 === 0 ? 15 : 65;
            const isSelected = activeTrib === trib;

            return (
              <g key={trib} onClick={() => setActiveTrib(trib)} style={{ cursor: 'pointer' }}>
                <line x1={xPos} y1={yPos} x2={xPos + 30} y2="40" stroke={isSelected ? '#fff' : currentData.color} strokeWidth={isSelected ? '3' : '1.5'} strokeDasharray="3 3" />
                <circle cx={xPos} cy={yPos} r={isSelected ? "8" : "5"} fill={isSelected ? '#fff' : currentData.color} />
                <text x={xPos} y={yPos > 40 ? yPos + 16 : yPos - 10} fill={isSelected ? '#fff' : '#94a3b8'} fontSize="10" fontWeight="bold" textAnchor="middle">
                  {trib}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Origin & Outflow Markers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem' }}>
          <span style={{ color: '#94a3b8' }}>🏔️ <strong>Origin:</strong> {currentData.origin}</span>
          <span style={{ color: currentData.color }}>🌊 <strong>Outflow:</strong> {currentData.outflow}</span>
        </div>
      </div>

      {/* Selected Tributary Info Panel */}
      {activeTrib ? (
        <div style={{ marginTop: '0.85rem', background: 'rgba(56, 189, 248, 0.12)', border: `1px solid ${currentData.color}`, borderRadius: 12, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Droplet size={16} color={currentData.color} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
              Selected Tributary: <strong style={{ color: currentData.color }}>{activeTrib}</strong>
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Feeds directly into {currentData.name}</span>
        </div>
      ) : (
        <div style={{ marginTop: '0.65rem', textAlign: 'center', fontSize: '0.72rem', color: '#64748b' }}>
          💡 Tap any tributary node on the animated river path above to inspect details.
        </div>
      )}
    </div>
  );
}
