import React, { useEffect, useRef, useState } from 'react';

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

export function TributariesBankVisual({ sectionName }) {
  const canvasRef = useRef(null);
  const [rivers, setRivers] = useState([]);
  const [hoveredRiver, setHoveredRiver] = useState(null);

  const isSouthSection = sectionName.toLowerCase().includes('south bank');
  const isNorthSection = sectionName.toLowerCase().includes('north bank');
  const isBarak = sectionName.toLowerCase().includes('barak');

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

    // Geographic viewport bounds
    let minLon = 89.5, maxLon = 96.2, minLat = 24.1, maxLat = 28.2;
    if (isBarak) {
      minLon = 92.0; maxLon = 93.3; minLat = 24.1; maxLat = 25.3;
    }

    const toX = lon => ((lon - minLon) / (maxLon - minLon)) * width;
    const toY = lat => height - ((lat - minLat) / (maxLat - minLat)) * height;

    ctx.clearRect(0, 0, width, height);

    // Dynamic background theme based on North (Emerald) vs South (Ruby Red)
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (isSouthSection) {
      grad.addColorStop(0, 'rgba(30, 10, 15, 0.95)');
      grad.addColorStop(1, 'rgba(6, 78, 59, 0.1)');
    } else {
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      grad.addColorStop(1, 'rgba(6, 78, 59, 0.3)');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw coordinate grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    const northBankNames = ['subansiri', 'manas', 'jiadhol', 'gai', 'siku', 'buroi', 'borgang', 'kameng', 'bharali', 'gabhoru', 'belsiri', 'puthimari', 'bornadi', 'pagladia', 'pagladiya', 'sankosh', 'sonkosh', 'tipkai', 'beki', 'aie', 'ronganodi', 'ranganadi', 'dikrong', 'semen', 'solengi', 'saralbhanga', 'siang', 'dihang', 'jiri', 'chiri', 'madhura', 'jatinga', 'larang'];
    const southBankNames = ['burhi dihing', 'dehing', 'disang', 'dikhou', 'jhanji', 'jaji', 'bhogdoi', 'disoi', 'dhansiri', 'doyang', 'kopili', 'kapili', 'kolong', 'kulsi', 'krishnai', 'dudhnoi', 'mornoi', 'jinjiram', 'bokota', 'teok', 'kakodunga', 'sonai', 'rukni', 'ghagra', 'katakhal', 'dhaleshwari', 'longai'];

    // Draw rivers
    rivers.forEach(r => {
      if (!r.path || r.path.length < 2) return;
      const nameLower = r.name.toLowerCase();
      const isMain = nameLower.includes('brahmaputra') || nameLower.includes('dihang') || nameLower.includes('siang') || nameLower.includes('barak');
      const isHovered = isRiverMatch(hoveredRiver, r.name);
      const isNB = northBankNames.some(nb => nameLower.includes(nb));
      const isSB = southBankNames.some(sb => nameLower.includes(sb));

      ctx.beginPath();
      ctx.moveTo(toX(r.path[0][0]), toY(r.path[0][1]));
      for (let i = 1; i < r.path.length; i++) {
        ctx.lineTo(toX(r.path[i][0]), toY(r.path[i][1]));
      }

      if (isHovered) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4.5;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
      } else if (isMain) {
        ctx.strokeStyle = '#38bdf8'; // Blue for Main Trunk
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
      } else if (isSouthSection && isSB) {
        ctx.strokeStyle = '#ef4444'; // RED for South Bank Tributaries
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
      } else if (isNorthSection && isNB) {
        ctx.strokeStyle = '#10b981'; // GREEN for North Bank Tributaries
        ctx.lineWidth = 3;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 0.8;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Legend
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('— Main River Trunk', 15, height - 20);
    
    if (isNorthSection) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('— Focused North Bank Tributaries (Emerald Green)', 150, height - 20);
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.fillText('— Focused South Bank Tributaries (Ruby Red)', 150, height - 20);
    }

  }, [rivers, hoveredRiver, sectionName]);

  const activeRiverList = isSouthSection
    ? (isBarak ? ['Sonai', 'Rukni', 'Ghagra', 'Katakhal', 'Dhaleshwari', 'Longai'] : ['Burhi Dihing', 'Disang', 'Dikhou', 'Bhogdoi', 'Dhansiri (South)', 'Kopili', 'Kulsi', 'Krishnai', 'Dudhnoi'])
    : (isBarak ? ['Jiri', 'Chiri', 'Madhura', 'Jatinga', 'Larang'] : ['Subansiri', 'Manas', 'Jia Bharali', 'Sankosh', 'Pagladiya', 'Puthimari', 'Beki', 'Aie', 'Ranganadi']);

  const themeColor = isSouthSection ? '#ef4444' : '#10b981';
  const themeBg = isSouthSection ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)';

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: `1px solid ${themeColor}88`, borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <h5 style={{ margin: 0, fontSize: '0.88rem', color: themeColor, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {isSouthSection ? '🔴 Specialized South Bank Tributaries Visualizer' : '🟢 Specialized North Bank Tributaries Visualizer'}
        </h5>
        <span style={{ fontSize: '0.65rem', background: themeBg, color: themeColor, padding: '0.25rem 0.75rem', borderRadius: '10px', fontWeight: 'bold' }}>
          {sectionName}
        </span>
      </div>

      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <canvas ref={canvasRef} width={640} height={260} style={{ width: '100%', height: '260px', display: 'block' }} />
        {hoveredRiver && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.85)', border: `1px solid ${themeColor}`, padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: themeColor, fontWeight: 'bold' }}>
            🌊 {hoveredRiver}
          </div>
        )}
      </div>

      {/* Interactive Tributary Chips */}
      <div style={{ marginTop: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
        {activeRiverList.map(rName => (
          <button
            key={rName}
            onMouseEnter={() => setHoveredRiver(rName)}
            onMouseLeave={() => setHoveredRiver(null)}
            style={{
              background: hoveredRiver === rName ? themeBg : 'rgba(255,255,255,0.03)',
              border: `1px solid ${hoveredRiver === rName ? themeColor : 'rgba(255,255,255,0.1)'}`,
              color: hoveredRiver === rName ? themeColor : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 'bold',
              padding: '0.3rem 0.7rem',
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
