import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const isRiverMatch = (btnName, mapName) => {
  if (!btnName || !mapName) return false;
  const b = btnName.toLowerCase();
  const m = mapName.toLowerCase();
  if (b === m) return true;
  const clean = s => s.replace(/[^a-z0-9]/g, '');
  if (clean(b) === clean(m)) return true;
  if (b.includes('dihing') && m.includes('dehing')) return true;
  if (b.includes('dehing') && m.includes('dihing')) return true;
  if (b.includes('sankosh') && m.includes('sonkosh')) return true;
  if (b.includes('sonkosh') && m.includes('sankosh')) return true;
  if (b.includes('kopili') && m.includes('kapili')) return true;
  if (b.includes('kapili') && m.includes('kopili')) return true;
  if (b.includes('bhogdoi') && m.includes('bhogdoi')) return true;
  if (b.includes('bharali') && m.includes('bharali')) return true;
  if (b.includes('ranganadi') && m.includes('ronganodi')) return true;
  if (b.includes('ronganodi') && m.includes('ranganadi')) return true;
  if (b.includes('pagladia') && m.includes('pagladiya')) return true;
  if (b.includes('pagladiya') && m.includes('pagladia')) return true;
  if (b.includes('dhansiri') && m.includes('dhansiri')) return true;
  if (b.includes('bornadi') && m.includes('bornadi')) return true;
  if (b.includes('puthimari') && m.includes('puthimari')) return true;
  if (b.includes('jhanji') && m.includes('jaji')) return true;
  if (b.includes('jaji') && m.includes('jhanji')) return true;
  if (b.length > 3 && m.includes(b)) return true;
  if (m.length > 3 && b.includes(m)) return true;
  return false;
};

export function BrahmaputraValleyVisual() {
  const canvasRef = useRef(null);
  const [rivers, setRivers] = useState([]);
  const [hoveredRiver, setHoveredRiver] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}SIMPLIFIED_ASSAM_RIVERS.json`)
      .then(r => r.json())
      .then(data => setRivers(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || rivers.length === 0) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Bounds for Assam / Brahmaputra Valley
    const minLon = 89.5, maxLon = 96.2;
    const minLat = 24.1, maxLat = 28.2;

    const toX = lon => ((lon - minLon) / (maxLon - minLon)) * width;
    const toY = lat => height - ((lat - minLat) / (maxLat - minLat)) * height;

    ctx.clearRect(0, 0, width, height);

    // Draw background valley glow
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    grad.addColorStop(1, 'rgba(6, 78, 59, 0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw river paths from KML
    rivers.forEach(r => {
      if (!r.path || r.path.length < 2) return;
      const isMain = r.name.toLowerCase().includes('brahmaputra') || r.name.toLowerCase().includes('dihang') || r.name.toLowerCase().includes('siang');
      const isHovered = isRiverMatch(hoveredRiver, r.name);

      ctx.beginPath();
      ctx.moveTo(toX(r.path[0][0]), toY(r.path[0][1]));
      for (let i = 1; i < r.path.length; i++) {
        ctx.lineTo(toX(r.path[i][0]), toY(r.path[i][1]));
      }

      // Determine North Bank vs South Bank tributary status
      const nameLower = r.name.toLowerCase();
      const northBankNames = ['subansiri', 'manas', 'jiadhol', 'gai', 'siku', 'buroi', 'borgang', 'kameng', 'bharali', 'gabhoru', 'belsiri', 'puthimari', 'bornadi', 'pagladia', 'pagladiya', 'sankosh', 'sonkosh', 'tipkai', 'beki', 'aie', 'ronganodi', 'ranganadi', 'dikrong', 'semen', 'solengi', 'saralbhanga', 'siang', 'dihang'];
      const southBankNames = ['burhi dihing', 'dehing', 'disang', 'dikhou', 'jhanji', 'jaji', 'bhogdoi', 'disoi', 'dhansiri', 'doyang', 'kopili', 'kapili', 'kolong', 'kulsi', 'krishnai', 'dudhnoi', 'mornoi', 'jinjiram', 'bokota', 'teok', 'kakodunga'];

      const isNorthBank = northBankNames.some(nb => nameLower.includes(nb));
      const isSouthBank = southBankNames.some(sb => nameLower.includes(sb));

      if (isHovered) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
      } else if (isMain) {
        ctx.strokeStyle = '#38bdf8'; // Blue for Main Trunk
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
      } else if (isSouthBank) {
        ctx.strokeStyle = '#ef4444'; // RED for South Bank Tributaries
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 4;
      } else if (isNorthBank) {
        ctx.strokeStyle = '#10b981'; // EMERALD/GREEN for North Bank Tributaries
        ctx.lineWidth = 2;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 4;
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    });

    // Legend
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('— Main River Trunk', 15, height - 35);
    ctx.fillStyle = '#10b981';
    ctx.fillText('— North Bank Tributaries (Green)', 140, height - 35);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('— South Bank Tributaries (Red)', 330, height - 35);

    // Draw Sadiya & Dhubri labels
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('📍 Sadiya (East)', toX(95.6), toY(27.8));
    ctx.fillText('📍 Dhubri (West)', toX(89.9), toY(26.0));

  }, [rivers, hoveredRiver]);

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <h5 style={{ margin: 0, fontSize: '0.85rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🌊 Brahmaputra River Network & Valley Map (KML Simplified)
        </h5>
        <span style={{ fontSize: '0.65rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 'bold' }}>
          Sadiya to Dhubri
        </span>
      </div>

      {/* Canvas Map Viewport */}
      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <canvas ref={canvasRef} width={640} height={260} style={{ width: '100%', height: '260px', display: 'block' }} />
        
        {/* Hover river badge */}
        {hoveredRiver && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', border: '1px solid #f59e0b', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>
            🌊 {hoveredRiver}
          </div>
        )}
      </div>

      {/* Key Tributary Filter Chips */}
      <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {['Brahmaputra', 'Subansiri', 'Manas', 'Jia Bharali', 'Lohit', 'Dibang', 'Burhi Dihing', 'Dikhou', 'Kopili'].map(rName => (
          <button
            key={rName}
            onMouseEnter={() => setHoveredRiver(rName)}
            onMouseLeave={() => setHoveredRiver(null)}
            style={{
              background: hoveredRiver === rName ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${hoveredRiver === rName ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
              color: hoveredRiver === rName ? '#f59e0b' : 'var(--text-muted)',
              fontSize: '0.7rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {rName}
          </button>
        ))}
      </div>
    </div>
  );
}
