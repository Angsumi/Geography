import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function HillRangesVisual({ sectionName = '' }) {
  const clean = sectionName.toLowerCase();

  let state = 'Assam';
  if (clean.includes('arunachal')) state = 'Arunachal Pradesh';
  else if (clean.includes('meghalaya')) state = 'Meghalaya';

  const hillData = {
    'Assam': {
      title: '⛰️ Assam Major Hill Ranges & Plateau Networks',
      hills: [
        { name: 'Mikir Hills', desc: 'Located in Karbi Anglong. Geologically an extension of the Peninsular Plateau.', elevation: '1,363 m', color: '#34d399', shape: 'M0 100 Q 50 20 100 100' },
        { name: 'Rengma Hills', desc: 'Situated east of Mikir Hills near Dhansiri valley.', elevation: '900 m', color: '#fbbf24', shape: 'M0 100 Q 40 40 100 100' },
        { name: 'Barail Range', desc: 'Highest range connecting Karbi Anglong & Dima Hasao. Watershed between Brahmaputra & Barak.', elevation: '1,959 m', color: '#60a5fa', shape: 'M0 100 Q 60 10 100 100' }
      ]
    },
    'Arunachal Pradesh': {
      title: '🏔️ Eastern Himalayas Outer Hill Chain (West to East)',
      hills: [
        { name: 'Dafla Hills', desc: 'Westernmost outer Himalayan hills, home to Nyishi tribe.', elevation: '1,500 m', color: '#60a5fa', shape: 'M0 100 Q 30 30 100 100' },
        { name: 'Miri Hills', desc: 'Central hill range east of Subansiri river basin.', elevation: '1,800 m', color: '#34d399', shape: 'M0 100 Q 45 25 100 100' },
        { name: 'Abor Hills', desc: 'Hills surrounding the Siang River gorge, home to Adi tribe.', elevation: '2,400 m', color: '#a78bfa', shape: 'M0 100 Q 55 15 100 100' },
        { name: 'Mishmi Hills', desc: 'Easternmost high alpine hills bordering Upper Myanmar.', elevation: '4,500 m+', color: '#f472b6', shape: 'M0 100 Q 70 5 100 100' }
      ]
    },
    'Meghalaya': {
      title: '⛰️ Meghalaya Plateau Tri-Range (West to East)',
      hills: [
        { name: 'Garo Hills', desc: 'Western hill division housing Nokrek Peak & Nokrek Biosphere Reserve.', elevation: '1,412 m', color: '#fb923c', shape: 'M0 100 Q 40 30 100 100' },
        { name: 'Khasi Hills', desc: 'Central hill division containing Shillong Peak & wettest Mawsynram.', elevation: '1,965 m', color: '#38bdf8', shape: 'M0 100 Q 55 12 100 100' },
        { name: 'Jaintia Hills', desc: 'Eastern hill division rich in limestone caves and mineral deposits.', elevation: '1,600 m', color: '#a78bfa', shape: 'M0 100 Q 45 25 100 100' }
      ]
    }
  };

  const current = hillData[state] || hillData['Assam'];
  const [selectedHill, setSelectedHill] = useState(current.hills[0]);

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#34d399', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.05em' }}>
        {current.title}
      </h5>

      {/* SVG CSS Mountain Peaks Panorama */}
      <div style={{ height: '160px', width: '100%', position: 'relative', background: 'linear-gradient(to bottom, rgba(15,23,42,0.6), rgba(0,0,0,0.8))', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 1rem' }}>
        
        {/* Background Grid Lines */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        {current.hills.map((h, idx) => {
          const isSelected = selectedHill.name === h.name;
          return (
            <div
              key={idx}
              onClick={() => setSelectedHill(h)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: isSelected ? 10 : 2,
                transition: 'transform 0.3s'
              }}
            >
              {/* CSS Mountain Peak Shape */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                animate={{ scale: isSelected ? 1.12 : 1 }}
                style={{
                  width: `${100 / current.hills.length + 30}px`,
                  height: `${parseInt(h.elevation) > 2000 ? 120 : (parseInt(h.elevation) > 1500 ? 95 : 75)}px`,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  background: isSelected 
                    ? `linear-gradient(180deg, #ffffff 0%, ${h.color} 40%, ${h.color}bb 100%)` 
                    : `linear-gradient(180deg, ${h.color}aa 0%, ${h.color}44 100%)`,
                  boxShadow: isSelected ? `0 0 20px ${h.color}` : 'none',
                  position: 'relative'
                }}
              >
                {/* Snow Cap Indicator for High Peaks */}
                {parseInt(h.elevation) > 1500 && (
                  <div style={{ position: 'absolute', top: 0, left: '35%', right: '35%', height: '25%', background: '#ffffff', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                )}
              </motion.div>

              <span style={{ fontSize: '0.68rem', fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? h.color : 'var(--text-muted)', marginTop: '0.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {h.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Hill Interactive Details Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedHill.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: `1px solid ${selectedHill.color}66`,
            borderRadius: '10px',
            padding: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <h6 style={{ margin: 0, fontSize: '0.9rem', color: selectedHill.color }}>⛰️ {selectedHill.name}</h6>
            <span style={{ fontSize: '0.7rem', color: '#fff', background: selectedHill.color + '33', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 'bold' }}>
              Elevation: ~{selectedHill.elevation}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
            {selectedHill.desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
