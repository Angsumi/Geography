import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TransportVisual() {
  const [activeTab, setActiveTab] = useState('nh');
  const canvasRef = useRef(null);

  const transportData = {
    nh: {
      title: '🛣️ National Highways Network',
      subtitle: ' lifeline corridors & major bridges',
      desc: 'Assam acts as the transit hub for Northeast India. The road network connects all the Seven Sister states. Major highways run parallel to the Brahmaputra River, crossing at strategic bridge locations.',
      color: '#f59e0b',
      facts: [
        'NH-27 (Lifeline): Connects Srirampur (West) to Silchar/Sadiya (East).',
        'NH-15: Runs along the North Bank of the Brahmaputra.',
        'Dhola-Sadiya Bridge (9.15 km): India\'s longest water bridge.',
        'Kalia Bhomora Setu: Connects Tezpur to Nagaon.'
      ],
      nodes: [
        { name: 'Srirampur', x: 50, y: 180, role: 'Gateway' },
        { name: 'Guwahati', x: 200, y: 150, role: 'Hub' },
        { name: 'Nagaon', x: 320, y: 140, role: 'Junction' },
        { name: 'Tezpur', x: 320, y: 100, role: 'Bridge' },
        { name: 'Jorhat', x: 450, y: 110, role: 'Upper Assam' },
        { name: 'Dibrugarh', x: 560, y: 80, role: 'Port' },
        { name: 'Sadiya', x: 600, y: 60, role: 'Terminal' }
      ],
      connections: [
        { from: 0, to: 1, label: 'NH-27' },
        { from: 1, to: 2, label: 'NH-27' },
        { from: 2, to: 3, label: 'Kalia Bhomora Setu' },
        { from: 2, to: 4, label: 'NH-27' },
        { from: 4, to: 5, label: 'NH-27' },
        { from: 5, to: 6, label: 'Dhola-Sadiya' }
      ]
    },
    railway: {
      title: '🚂 Northeast Frontier Railway (NFR)',
      subtitle: 'Zones, divisions & connectivity bridges',
      desc: 'Administered by the Northeast Frontier Railway (NFR) zone headquartered at Maligaon (Guwahati). Major rail routes connect Upper Assam to the Siliguri Corridor ("Chicken\'s Neck") and rest of India.',
      color: '#10b981',
      facts: [
        'Maligaon (Guwahati): Headquarter of NFR Zone.',
        'Divisions: Alipurduar, Rangiya, Lumding, Tinsukia.',
        'Bogibeel Bridge: Longest rail-cum-road bridge in India (4.94 km).',
        'Hill Section: Lumding-Badarpur scenic broad gauge track.'
      ],
      nodes: [
        { name: 'Kokrajhar', x: 60, y: 160 },
        { name: 'Rangiya', x: 170, y: 130 },
        { name: 'Guwahati (Maligaon)', x: 200, y: 150 },
        { name: 'Lumding', x: 350, y: 180 },
        { name: 'Badarpur', x: 350, y: 220 },
        { name: 'Mariani (Jorhat)', x: 460, y: 120 },
        { name: 'Tinsukia', x: 580, y: 70 }
      ],
      connections: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4, label: 'Hill Section' },
        { from: 3, to: 5 },
        { from: 5, to: 6 }
      ]
    },
    waterway: {
      title: '🚢 National Waterway 2 (NW-2)',
      subtitle: 'The Brahmaputra river shipping corridor',
      desc: 'Comprises the Brahmaputra River stretch from Sadiya to Dhubri (891 km). It provides crucial, eco-friendly cargo transport connecting Northeast India directly to Haldia/Kolkata ports via Bangladesh transshipment channels.',
      color: '#38bdf8',
      facts: [
        'NW-2 Stretch: Dhubri to Sadiya (891 km).',
        'Pandu Port (Guwahati): Largest river port in Assam.',
        'Jogighopa: Multi-modal logistics park connection.',
        'Cargo: Coal, limestone, tea, and heavy machinery transport.'
      ],
      nodes: [
        { name: 'Dhubri', x: 40, y: 200, role: 'Border Port' },
        { name: 'Jogighopa', x: 110, y: 170, role: 'Logistics' },
        { name: 'Pandu (Guwahati)', x: 200, y: 150, role: 'River Port' },
        { name: 'Silghat (Tezpur)', x: 340, y: 120, role: 'Terminal' },
        { name: 'Neamati (Jorhat)', x: 460, y: 100, role: 'Ferry Hub' },
        { name: 'Dibrugarh', x: 560, y: 80, role: 'Port' },
        { name: 'Sadiya', x: 600, y: 60, role: 'Upper Limit' }
      ],
      connections: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 5, to: 6 }
      ]
    }
  };

  const current = transportData[activeTab];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background Brahmaputra River flow indicator for geographic context
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(610, 50);
    ctx.bezierCurveTo(500, 90, 400, 110, 320, 130);
    ctx.bezierCurveTo(240, 150, 150, 150, 40, 210);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 40; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    // Connection paths
    current.connections.forEach(conn => {
      const fromNode = current.nodes[conn.from];
      const toNode = current.nodes[conn.to];
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);

      if (activeTab === 'nh') {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.setLineDash([]);
      } else if (activeTab === 'railway') {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]); // Railroad look
      } else {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
      }
      ctx.stroke();

      // Draw connection label if exists
      if (conn.label) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px sans-serif';
        ctx.fillText(conn.label, (fromNode.x + toNode.x) / 2, (fromNode.y + toNode.y) / 2 - 5);
      }
    });
    ctx.setLineDash([]); // Reset

    // Draw Nodes
    current.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = current.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(node.name, node.x, node.y - 10);
      ctx.shadowBlur = 0;

      // Role
      if (node.role) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '7px sans-serif';
        ctx.fillText(node.role, node.x, node.y + 14);
      }
    });

  }, [activeTab]);

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: `1px solid ${current.color}88`, borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h5 style={{ margin: 0, fontSize: '0.88rem', color: current.color, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🚦 Assam Transport Infrastructure (NH, Railways, Waterways)
        </h5>
        <span style={{ fontSize: '0.65rem', background: `${current.color}18`, color: current.color, padding: '0.25rem 0.75rem', borderRadius: '10px', fontWeight: 'bold' }}>
          Connectivity
        </span>
      </div>

      {/* Interactive Map/Graph */}
      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#0b0f19', marginBottom: '1rem' }}>
        <canvas ref={canvasRef} width={640} height={260} style={{ width: '100%', height: '260px', display: 'block' }} />
        <div style={{ position: 'absolute', bottom: '10px', right: '15px', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.65rem', color: '#94a3b8' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.3)' }} />
          Brahmaputra Alignment
        </div>
      </div>

      {/* Interactive Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('nh')}
          style={{
            background: activeTab === 'nh' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${activeTab === 'nh' ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
            color: activeTab === 'nh' ? '#f59e0b' : 'var(--text-muted)',
            padding: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: activeTab === 'nh' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          🛣️ National Highways (NH)
        </button>
        <button
          onClick={() => setActiveTab('railway')}
          style={{
            background: activeTab === 'railway' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${activeTab === 'railway' ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
            color: activeTab === 'railway' ? '#10b981' : 'var(--text-muted)',
            padding: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: activeTab === 'railway' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          🚂 Railways (NFR)
        </button>
        <button
          onClick={() => setActiveTab('waterway')}
          style={{
            background: activeTab === 'waterway' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${activeTab === 'waterway' ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`,
            color: activeTab === 'waterway' ? '#38bdf8' : 'var(--text-muted)',
            padding: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: activeTab === 'waterway' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          🚢 National Waterways (NW-2)
        </button>
      </div>

      {/* Content Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ background: 'rgba(255,255,255,0.01)', border: `1px solid ${current.color}33`, borderRadius: '10px', padding: '1rem' }}
        >
          <h4 style={{ margin: '0 0 0.2rem', color: current.color, fontSize: '0.95rem' }}>{current.title}</h4>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{current.subtitle}</div>
          <p style={{ margin: '0 0 0.8rem', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
            {current.desc}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem' }}>
            {current.facts.map((fact, idx) => (
              <span key={idx} style={{ background: `${current.color}08`, border: `1px solid ${current.color}18`, color: 'var(--text-main)', fontSize: '0.75rem', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                📌 {fact}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
