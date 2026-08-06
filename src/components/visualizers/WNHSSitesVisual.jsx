import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Shield, MapPin, Award, CheckCircle } from 'lucide-react';

export function WNHSSitesVisual({ activeSection = '' }) {
  const cleanSection = activeSection.toLowerCase();

  let initialId = 'kaziranga';
  if (cleanSection.includes('manas')) initialId = 'manas';
  else if (cleanSection.includes('moidam')) initialId = 'moidams';
  else if (cleanSection.includes('khangchendzonga')) initialId = 'khangchendzonga';

  const [selectedSite, setSelectedSite] = useState(initialId);

  const sites = [
    {
      id: 'kaziranga',
      title: 'Kaziranga National Park (Assam)',
      year: '1985 UNESCO WNHS',
      state: 'Assam (Golaghat/Nagaon)',
      fauna: 'Home to 2/3rd of world great one-horned rhinos',
      desc: 'Famous home to two-thirds of the world\'s great one-horned rhinoceroses. Located along the Brahmaputra River floodplain in Assam.',
      color: '#34d399',
      icon: '🦏',
      image: '/kaziranga_rhino.jpg',
      stats: [
        { label: 'Global Rhino Share', val: '67% (2/3rd)' },
        { label: 'Key Ecosystem', val: 'Brahmaputra Alluvial Savanna' },
        { label: 'Tiger Reserve', val: 'Declared 2006' }
      ]
    },
    {
      id: 'manas',
      title: 'Manas Wildlife Sanctuary (Assam)',
      year: '1985 UNESCO WNHS',
      state: 'Assam (BTR Region)',
      fauna: 'Pygmy Hog, Golden Langur, Hispid Hare',
      desc: 'A scenic tiger and elephant reserve near the foothills of the Himalayas. Forms a transboundary wildlife corridor with Royal Manas NP in Bhutan.',
      color: '#f59e0b',
      icon: '🐅',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80',
      stats: [
        { label: 'Landscape', val: 'Sub-Himalayan BTR Foothills' },
        { label: 'Endemic Species', val: 'Pygmy Hog & Golden Langur' },
        { label: 'Corridor', val: 'Transboundary with Bhutan' }
      ]
    },
    {
      id: 'moidams',
      title: 'Moidams – Ahom Dynasty Mounds (Assam)',
      year: '2024 UNESCO Cultural WNHS',
      state: 'Assam (Charaideo District)',
      fauna: 'Sacred Royal Ahom Mound-Burial System',
      desc: 'Sacred royal mound-burial systems located in Charaideo. The unique architectural earthen pyramids of the 600-year Ahom Dynasty kings and queens.',
      color: '#ec4899',
      icon: '👑',
      image: '/charaideo_moidams.jpg',
      stats: [
        { label: 'UNESCO Category', val: 'World Cultural Heritage (2024)' },
        { label: 'Dynasty', val: 'Ahom Dynasty (1228-1826 AD)' },
        { label: 'Comparison', val: 'Pyramids of Ancient Egypt' }
      ]
    },
    {
      id: 'khangchendzonga',
      title: 'Khangchendzonga National Park (Sikkim)',
      year: '2016 UNESCO Mixed WNHS',
      state: 'Sikkim',
      fauna: 'Snow Leopard, Red Panda, Musk Deer',
      desc: 'A stunning mixed-criteria mountain and glacial ecosystem. India\'s first Mixed UNESCO site, combining Mt. Kanchenjunga (8,586m) with sacred Buddhist landscapes.',
      color: '#60a5fa',
      icon: '🏔️',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      stats: [
        { label: 'UNESCO Status', val: 'India 1st Mixed WNHS (2016)' },
        { label: 'Central Peak', val: 'Mt. Kanchenjunga (8,586 m)' },
        { label: 'Key Glacier', val: 'Zemu Glacier (Teesta Source)' }
      ]
    }
  ];

  const current = sites.find(s => s.id === selectedSite) || sites[0];

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: `1px solid ${current.color}66`, borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h5 style={{ margin: 0, fontSize: '0.85rem', color: current.color, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Trophy size={16} color={current.color} /> 🏆 UNESCO Heritage Site Visualization
        </h5>
        <span style={{ fontSize: '0.65rem', background: current.color + '22', color: current.color, padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 'bold' }}>
          {current.year}
        </span>
      </div>

      {/* Interactive Tabs for the 4 Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {sites.map(s => {
          const isSelected = s.id === selectedSite;
          return (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedSite(s.id)}
              style={{
                background: isSelected ? s.color + '25' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSelected ? s.color : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                color: isSelected ? s.color : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{s.icon}</div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.id.toUpperCase()}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Site Dynamic Visual Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: `1px solid ${current.color}66`,
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          {/* Header Image Showcase */}
          <div style={{ height: '160px', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <img src={current.image} alt={current.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.95))` }} />
            <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h6 style={{ margin: 0, fontSize: '1rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {current.icon} {current.title}
              </h6>
              <span style={{ fontSize: '0.7rem', color: current.color, background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: `1px solid ${current.color}44` }}>
                📍 {current.state}
              </span>
            </div>
          </div>

          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45, background: current.color + '10', padding: '0.6rem 0.8rem', borderRadius: '8px', borderLeft: `3px solid ${current.color}` }}>
              {current.desc}
            </p>

            {/* Feature Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.25rem' }}>
              {current.stats.map((st, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>{st.label}</span>
                  <strong style={{ fontSize: '0.75rem', color: current.color, marginTop: '0.2rem', display: 'block' }}>{st.val}</strong>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
