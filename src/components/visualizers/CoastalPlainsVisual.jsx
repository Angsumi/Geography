import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Waves, ArrowRight, Shield } from 'lucide-react';

export function CoastalPlainsVisual() {
  const [selectedCoast, setSelectedCoast] = useState('west');

  const coastData = {
    west: {
      title: 'Western Coastal Plains',
      type: 'Submerged Coast (Narrow Strip)',
      features: ['Konkan Coast (Maharashtra & Goa)', 'Kannad Plain (Karnataka)', 'Malabar Coast (Kerala - Kayals/Backwaters)'],
      ports: ['Kandla', 'Mumbai', 'JNPT', 'Marmagao', 'New Mangalore', 'Kochi'],
      width: 'Narrow (50–80 km)',
      deltas: 'No Deltas (Forms Estuaries like Narmada & Tapi)',
      color: '#38bdf8'
    },
    east: {
      title: 'Eastern Coastal Plains',
      type: 'Emergent Coast (Broad Deltaic Strip)',
      features: ['Northern Circars (Odisha & AP)', 'Coromandel Coast (Tamil Nadu)', 'Chilika & Pulicat Lagoon Lakes'],
      ports: ['Kolkata/Haldia', 'Paradip', 'Visakhapatnam', 'Chennai', 'Ennore', 'Tuticorin'],
      width: 'Broad (100–130 km)',
      deltas: 'Extensive Fertile Deltas (Mahanadi, Godavari, Krishna, Cauvery)',
      color: '#34d399'
    }
  };

  const current = coastData[selectedCoast];

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: `1.5px solid ${current.color}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      
      {/* Header & Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Anchor size={20} color={current.color} />
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 900 }}>
              Indian Coastal Plains Inspector
            </h4>
            <span style={{ fontSize: '0.68rem', color: current.color, fontWeight: 800 }}>
              {current.type}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255,255,255,0.04)', padding: '0.25rem', borderRadius: 12 }}>
          <button
            onClick={() => setSelectedCoast('west')}
            style={{
              background: selectedCoast === 'west' ? '#38bdf8' : 'transparent',
              color: selectedCoast === 'west' ? '#000' : '#cbd5e1',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: 8,
              fontSize: '0.75rem',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            Western Coast
          </button>
          <button
            onClick={() => setSelectedCoast('east')}
            style={{
              background: selectedCoast === 'east' ? '#34d399' : 'transparent',
              color: selectedCoast === 'east' ? '#000' : '#cbd5e1',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: 8,
              fontSize: '0.75rem',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            Eastern Coast
          </button>
        </div>
      </div>

      {/* Visual Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
        
        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Width & Landform</span>
          <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 800, marginTop: '0.2rem' }}>{current.width}</div>
          <div style={{ fontSize: '0.8rem', color: current.color, marginTop: '0.4rem' }}>{current.deltas}</div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Regional Subdivisions</span>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.2rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {current.features.map((f, i) => (
              <li key={i} style={{ fontSize: '0.78rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ color: current.color, fontWeight: 900 }}>•</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ports Ribbon */}
      <div style={{ marginTop: '0.85rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.65rem 0.85rem', borderRadius: 12, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800 }}>Major Sea Ports:</span>
        {current.ports.map((port, idx) => (
          <span key={idx} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 6, fontWeight: 700 }}>
            🚢 {port}
          </span>
        ))}
      </div>
    </div>
  );
}
