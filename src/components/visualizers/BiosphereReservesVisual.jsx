import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function BiosphereReservesVisual({ activeSection = '' }) {
  const cleanSection = activeSection.toLowerCase();

  let initialTab = 'schema';
  if (cleanSection.includes('manas')) initialTab = 'manas';
  else if (cleanSection.includes('dibru')) initialTab = 'dibru';
  else if (cleanSection.includes('nokrek')) initialTab = 'nokrek';
  else if (cleanSection.includes('dihang') || cleanSection.includes('dehang')) initialTab = 'dihang';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeZone, setActiveZone] = useState('core');

  const zones = {
    core: {
      name: 'Core Zone (Strictly Protected)',
      desc: 'Legally protected area devoted strictly to natural conservation without human entry. Preserves pristine genetic biodiversity and wildlife.',
      color: '#ef4444',
      radius: '80px',
      border: '2px dashed #ef4444'
    },
    buffer: {
      name: 'Buffer Zone (Research & Eco-Tourism)',
      desc: 'Surrounds the core zone. Permitted for environmental education, controlled scientific research, training, and managed eco-tourism.',
      color: '#818cf8',
      radius: '140px',
      border: '2px dashed #818cf8'
    },
    transition: {
      name: 'Eco-Sensitive / Transition Zone (Sustainable Human Use)',
      desc: 'Outermost area where local communities, forest managers, and researchers cooperate in sustainable agriculture, forestry, and settlements.',
      color: '#4ade80',
      radius: '200px',
      border: '2px dashed #4ade80'
    }
  };

  const currentZone = zones[activeZone];

  const brSites = {
    manas: {
      title: 'Manas Biosphere Reserve (Assam)',
      location: 'Foothills of the Himalayas in Assam BTR',
      fauna: 'Wild Water Buffalo, Pygmy Hog, Golden Langur',
      desc: 'Located in the foothills of the Himalayas. Known for the wild water buffalo, pygmy hog, and golden langur.',
      color: '#f59e0b',
      icon: '🐅',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80',
      highlights: [
        { label: 'Topography', val: 'Foothills of Himalayas (Sub-Himalayan BTR)' },
        { label: 'Key Fauna', val: 'Wild Water Buffalo, Pygmy Hog, Golden Langur' },
        { label: 'Ecosystem', val: 'Alluvial Terai Grassland Corridor' }
      ]
    },
    dibru: {
      title: 'Dibru-Saikhowa Biosphere Reserve (Assam)',
      location: 'Upper Assam (Formed by Brahmaputra & Lohit rivers)',
      fauna: 'Feral Horses, Rare White-Winged Wood Ducks',
      desc: 'Formed by the Brahmaputra and Lohit rivers. Famous for swamp forests, feral horses, and rare white-winged wood ducks.',
      color: '#34d399',
      icon: '🐎',
      image: '/feral_horses.jpg',
      highlights: [
        { label: 'Rivers', val: 'Formed by Brahmaputra and Lohit rivers' },
        { label: 'Famous Habitats', val: 'Riverine Swamp Forests' },
        { label: 'Unique Wildlife', val: 'Feral Horses & White-winged Wood Ducks' }
      ]
    },
    nokrek: {
      title: 'Nokrek Biosphere Reserve (Meghalaya)',
      location: 'Garo Hills, Meghalaya',
      fauna: 'Red Pandas, Wild Citrus Gene (Citrus indica)',
      desc: 'Located in the Garo Hills. Known for citrus gene conservation and red pandas.',
      color: '#fbbf24',
      icon: '🌱',
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80',
      highlights: [
        { label: 'Location', val: 'Located in the Garo Hills (Meghalaya)' },
        { label: 'Special Gene Pool', val: 'Citrus Gene Conservation (Citrus indica)' },
        { label: 'Key Mammal', val: 'Red Panda Habitat' }
      ]
    },
    dihang: {
      title: 'Dihang-Dibang Biosphere Reserve (Arunachal Pradesh)',
      location: 'High mountains of the Siang and Dibang valleys',
      fauna: 'Mishmi Takin and Snow Leopards',
      desc: 'Located in the high mountains of the Siang and Dibang valleys. Home to Mishmi takin and snow leopards.',
      color: '#60a5fa',
      icon: '🏔️',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      highlights: [
        { label: 'Location', val: 'High mountains of Siang & Dibang valleys' },
        { label: 'Endemic Takin', val: 'Mishmi Takin (Budorcas taxicolor)' },
        { label: 'Apex Predator', val: 'Snow Leopards & Musk Deer' }
      ]
    }
  };

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(129, 140, 248, 0.4)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.05em' }}>
        🌐 Northeast Biosphere Reserves Interactive Visualizer
      </h5>

      {/* 5 Section Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('schema')}
          style={{
            background: activeTab === 'schema' ? 'rgba(129, 140, 248, 0.25)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${activeTab === 'schema' ? 'var(--secondary)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '6px',
            padding: '0.4rem 0.2rem',
            color: activeTab === 'schema' ? 'var(--secondary)' : 'var(--text-muted)',
            fontSize: '0.7rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'schema' ? 'bold' : 'normal'
          }}
        >
          ⭕ General Schema
        </button>
        <button
          onClick={() => setActiveTab('manas')}
          style={{
            background: activeTab === 'manas' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${activeTab === 'manas' ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '6px',
            padding: '0.4rem 0.2rem',
            color: activeTab === 'manas' ? '#f59e0b' : 'var(--text-muted)',
            fontSize: '0.7rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'manas' ? 'bold' : 'normal'
          }}
        >
          🐅 Manas BR
        </button>
        <button
          onClick={() => setActiveTab('dibru')}
          style={{
            background: activeTab === 'dibru' ? 'rgba(52, 211, 153, 0.25)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${activeTab === 'dibru' ? '#34d399' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '6px',
            padding: '0.4rem 0.2rem',
            color: activeTab === 'dibru' ? '#34d399' : 'var(--text-muted)',
            fontSize: '0.7rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'dibru' ? 'bold' : 'normal'
          }}
        >
          🐎 Dibru-Saikhowa
        </button>
        <button
          onClick={() => setActiveTab('nokrek')}
          style={{
            background: activeTab === 'nokrek' ? 'rgba(251, 191, 36, 0.25)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${activeTab === 'nokrek' ? '#fbbf24' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '6px',
            padding: '0.4rem 0.2rem',
            color: activeTab === 'nokrek' ? '#fbbf24' : 'var(--text-muted)',
            fontSize: '0.7rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'nokrek' ? 'bold' : 'normal'
          }}
        >
          🌱 Nokrek BR
        </button>
        <button
          onClick={() => setActiveTab('dihang')}
          style={{
            background: activeTab === 'dihang' ? 'rgba(96, 165, 250, 0.25)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${activeTab === 'dihang' ? '#60a5fa' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '6px',
            padding: '0.4rem 0.2rem',
            color: activeTab === 'dihang' ? '#60a5fa' : 'var(--text-muted)',
            fontSize: '0.7rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'dihang' ? 'bold' : 'normal'
          }}
        >
          🏔️ Dihang-Dibang
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'schema' ? (
          <motion.div key="schema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Concentric Circles Diagram for General Schema */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '220px', position: 'relative', marginBottom: '1rem' }}>
              <div
                onClick={() => setActiveZone('transition')}
                style={{
                  width: zones.transition.radius, height: zones.transition.radius, borderRadius: '50%',
                  background: 'rgba(74, 222, 128, 0.1)', border: zones.transition.border, position: 'absolute',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6px', cursor: 'pointer',
                  boxShadow: activeZone === 'transition' ? '0 0 15px rgba(74, 222, 128, 0.4)' : 'none', transition: 'all 0.3s'
                }}
              >
                <span style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 'bold' }}>Eco-Sensitive / Transition Zone</span>
              </div>
              <div
                onClick={() => setActiveZone('buffer')}
                style={{
                  width: zones.buffer.radius, height: zones.buffer.radius, borderRadius: '50%',
                  background: 'rgba(129, 140, 248, 0.15)', border: zones.buffer.border, position: 'absolute',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6px', cursor: 'pointer',
                  boxShadow: activeZone === 'buffer' ? '0 0 15px rgba(129, 140, 248, 0.4)' : 'none', transition: 'all 0.3s'
                }}
              >
                <span style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 'bold' }}>Buffer Zone</span>
              </div>
              <div
                onClick={() => setActiveZone('core')}
                style={{
                  width: zones.core.radius, height: zones.core.radius, borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.25)', border: zones.core.border, position: 'absolute',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer',
                  boxShadow: activeZone === 'core' ? '0 0 15px rgba(239, 68, 68, 0.5)' : 'none', transition: 'all 0.3s'
                }}
              >
                <span style={{ fontSize: '0.65rem', color: '#f87171', fontWeight: 'bold' }}>Core Zone</span>
              </div>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '10px', background: currentZone.color + '15', border: `1px solid ${currentZone.color}` }}>
              <h6 style={{ margin: '0 0 0.3rem', color: currentZone.color, fontSize: '0.85rem' }}>{currentZone.name}</h6>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4 }}>{currentZone.desc}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            {/* Reserve Specific Custom Infographic Card */}
            {(() => {
              const currentBR = brSites[activeTab];
              return (
                <div style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${currentBR.color}66`, borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ height: '140px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img src={currentBR.image} alt={currentBR.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.95))' }} />
                    <div style={{ position: 'absolute', bottom: '0.6rem', left: '0.8rem', right: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <h6 style={{ margin: 0, fontSize: '0.95rem', color: currentBR.color }}>{currentBR.icon} {currentBR.title}</h6>
                      <span style={{ fontSize: '0.7rem', color: currentBR.color, background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: `1px solid ${currentBR.color}44` }}>
                        📍 {currentBR.location}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45, background: currentBR.color + '10', padding: '0.5rem 0.75rem', borderRadius: '6px', borderLeft: `3px solid ${currentBR.color}` }}>
                      {currentBR.desc}
                    </p>
                    
                    {/* Specific Highlights for each of the 3 BR sections */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.2rem' }}>
                      {currentBR.highlights.map((hl, idx) => (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.45rem', borderRadius: '6px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{hl.label}</span>
                          <strong style={{ fontSize: '0.72rem', color: currentBR.color, marginTop: '0.15rem', display: 'block' }}>{hl.val}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
