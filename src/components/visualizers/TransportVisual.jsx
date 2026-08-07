import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TransportVisual() {
  const [activeTab, setActiveTab] = useState('nh');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const transportData = {
    nh: {
      title: '🛣️ National Highways Network',
      subtitle: 'Lifeline corridors & major bridges',
      desc: 'Assam acts as the transit hub for Northeast India. The road network connects all the Seven Sister states. Major highways run parallel to the Brahmaputra River, crossing at strategic bridge locations.',
      color: '#f59e0b',
      themeBg: 'rgba(245, 158, 11, 0.15)',
      facts: [
        'NH-27 (Lifeline): Connects Srirampur (West) to Silchar/Sadiya (East).',
        'NH-15: Runs along the North Bank of the Brahmaputra.',
        'Dhola-Sadiya Bridge (9.15 km): India\'s longest water bridge.',
        'Kalia Bhomora Setu: Connects Tezpur to Nagaon.'
      ],
      nodes: [
        { name: 'Srirampur', x: 8, y: 70, role: 'West Gateway', details: 'Entry point from West Bengal / rest of India.' },
        { name: 'Guwahati', x: 30, y: 58, role: 'Main Central Hub', details: 'Northeast\'s largest metropolitan transport hub.' },
        { name: 'Tezpur', x: 50, y: 38, role: 'North-South Bridge Link', details: 'Cross-river connection point via Kalia Bhomora Setu.' },
        { name: 'Nagaon', x: 52, y: 55, role: 'Highway Junction', details: 'Splits path to Upper Assam and Central Hills.' },
        { name: 'Jorhat', x: 70, y: 42, role: 'Upper Assam Hub', details: 'Connects tea-producing districts and Majuli ferry services.' },
        { name: 'Dibrugarh', x: 85, y: 30, role: 'Brahmaputra Port', details: 'Terminus of major south-bank highways.' },
        { name: 'Sadiya', x: 92, y: 22, role: 'East Terminus', details: 'Connected via the massive Dhola-Sadiya Bridge.' }
      ],
      connections: [
        { from: 0, to: 1, label: 'NH-27' },
        { from: 1, to: 3, label: 'NH-27' },
        { from: 3, to: 2, label: 'NH-715' },
        { from: 3, to: 4, label: 'NH-27' },
        { from: 4, to: 5, label: 'NH-27' },
        { from: 5, to: 6, label: 'NH-115' }
      ]
    },
    railway: {
      title: '🚂 Northeast Frontier Railway (NFR)',
      subtitle: 'Zones, divisions & connectivity bridges',
      desc: 'Administered by the Northeast Frontier Railway (NFR) zone headquartered at Maligaon (Guwahati). Major rail routes connect Upper Assam to the Siliguri Corridor ("Chicken\'s Neck") and rest of India.',
      color: '#10b981',
      themeBg: 'rgba(16, 185, 129, 0.15)',
      facts: [
        'Maligaon (Guwahati): Headquarter of NFR Zone.',
        'Divisions: Alipurduar, Rangiya, Lumding, Tinsukia.',
        'Bogibeel Bridge: Longest rail-cum-road bridge in India (4.94 km).',
        'Hill Section: Lumding-Badarpur scenic broad gauge track.'
      ],
      nodes: [
        { name: 'Kokrajhar', x: 10, y: 62, role: 'Bodoland Link', details: 'Crucial gate entry point on the main Assam-Bengal broad gauge corridor.' },
        { name: 'New Bongaigaon', x: 22, y: 55, role: 'Major Junction', details: 'Connects lower Assam routes to Guwahati and Goalpara loops.' },
        { name: 'Rangiya Jn', x: 38, y: 45, role: 'Division HQ', details: 'Junction point for the North Bank line towards Murkongselek.' },
        { name: 'Guwahati (Maligaon)', x: 45, y: 58, role: 'NFR HQ & Terminal', details: 'Headquarters of Northeast Frontier Railway zone and primary rail terminal.' },
        { name: 'Lumding Jn', x: 62, y: 70, role: 'Hill Division HQ', details: 'Major railway junction splitting into Barak Valley and Upper Assam.' },
        { name: 'Badarpur Jn', x: 62, y: 88, role: 'Barak Valley Hub', details: 'Connected via the scenic, geologically challenging Lumding-Badarpur hill section.' },
        { name: 'Silchar', x: 74, y: 88, role: 'Barak Terminal', details: 'Major terminal station for Barak Valley, connecting to Manipur/Tripura.' },
        { name: 'North Lakhimpur', x: 72, y: 35, role: 'North Bank Hub', details: 'Important node on the recently electrified North Bank broad gauge line.' },
        { name: 'Mariani Jn', x: 76, y: 48, role: 'Jorhat Junction', details: 'Connects the Jorhat branch to the main broad gauge trunk line.' },
        { name: 'Dibrugarh / Tinsukia', x: 88, y: 32, role: 'East Terminus', details: 'Terminal junction linked via the mega Bogibeel rail-cum-road bridge.' }
      ],
      connections: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5, label: 'Hill Section' },
        { from: 5, to: 6 },
        { from: 2, to: 7, label: 'North Bank Line' },
        { from: 7, to: 9, label: 'Bogibeel Bridge' },
        { from: 4, to: 8 },
        { from: 8, to: 9 }
      ]
    },
    waterway: {
      title: '🚢 National Waterway 2 (NW-2)',
      subtitle: 'The Brahmaputra river shipping corridor',
      desc: 'Comprises the Brahmaputra River stretch from Sadiya to Dhubri (891 km). It provides crucial, eco-friendly cargo transport connecting Northeast India directly to Haldia/Kolkata ports via Bangladesh transshipment channels.',
      color: '#38bdf8',
      themeBg: 'rgba(56, 189, 248, 0.15)',
      facts: [
        'NW-2 Stretch: Dhubri to Sadiya (891 km).',
        'Pandu Port (Guwahati): Largest river port in Assam.',
        'Jogighopa: Multi-modal logistics park connection.',
        'Cargo: Coal, limestone, tea, and heavy machinery transport.'
      ],
      nodes: [
        { name: 'Dhubri Port', x: 6, y: 78, role: 'Border Port', details: 'Customs and trade terminal near the Bangladesh border.' },
        { name: 'Jogighopa', x: 18, y: 68, role: 'Logistics Park', details: 'Site of India\'s first Multi-Modal Logistics Park (MMLP).' },
        { name: 'Pandu (Guwahati)', x: 38, y: 58, role: 'Main River Port', details: 'Equipped with roll-on/roll-off (Ro-Ro) facilities and fixed terminals.' },
        { name: 'Tezpur Silghat', x: 55, y: 48, role: 'Central Port', details: 'Crucial terminal serving Central Assam tea and jute plantations.' },
        { name: 'Neamati (Jorhat)', x: 74, y: 38, role: 'Majuli Ferry Hub', details: 'Principal passenger and freight terminal connecting to Majuli River Island.' },
        { name: 'Dibrugarh Port', x: 88, y: 30, role: 'Upper Port', details: 'Critical port serving coal and petrochemical fields in upper valley.' },
        { name: 'Sadiya Port', x: 94, y: 22, role: 'NW-2 East Limit', details: 'Upper terminal point of NW-2 near the Lohit confluence.' }
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

      {/* Styled CSS Map Container */}
      <div style={{ 
        position: 'relative', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        border: '1px solid rgba(255,255,255,0.08)', 
        background: '#090d16', 
        height: '280px',
        marginBottom: '1rem',
        boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.6)'
      }}>
        {/* Geographic Grid Overlay */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} />

        {/* Brahmaputra River Guide Line */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path 
            d="M 950 50 Q 750 100 550 130 T 150 170 L 50 220" 
            fill="none" 
            stroke="rgba(56, 189, 248, 0.12)" 
            strokeWidth="14" 
            strokeLinecap="round"
          />
          <text x="50" y="240" fill="rgba(56, 189, 248, 0.25)" fontSize="9" fontWeight="bold">NW-2 / BRAHMAPUTRA FLOW</text>

          {/* SVG Connections representing the tracks/roads/lanes */}
          {current.connections.map((conn, idx) => {
            const fromNode = current.nodes[conn.from];
            const toNode = current.nodes[conn.to];
            if (!fromNode || !toNode) return null;
            return (
              <g key={idx}>
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={current.color}
                  strokeWidth={activeTab === 'nh' ? '3.5' : '2.5'}
                  strokeDasharray={activeTab === 'railway' ? '6,6' : 'none'}
                  opacity={hoveredNode === fromNode.name || hoveredNode === toNode.name ? 1 : 0.6}
                  style={{ transition: 'all 0.3s' }}
                />
                {conn.label && (
                  <text
                    x={`${(fromNode.x + toNode.x) / 2}%`}
                    y={`${(fromNode.y + toNode.y) / 2 - 2}%`}
                    fill="#94a3b8"
                    fontSize="7"
                    textAnchor="middle"
                    opacity={0.8}
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Stations/Junctions/Ports Nodes (HTML/CSS layout) */}
        {current.nodes.map((node, idx) => {
          const isHovered = hoveredNode === node.name;
          const isSelected = selectedNode?.name === node.name;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredNode(node.name)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(node)}
              style={{
                position: 'absolute',
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 20
              }}
            >
              {/* Outer Glow Ring */}
              <div style={{
                width: isHovered ? '24px' : '14px',
                height: isHovered ? '24px' : '14px',
                borderRadius: '50%',
                background: isHovered || isSelected ? `${current.color}33` : 'transparent',
                border: `1px solid ${isHovered || isSelected ? current.color : 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                {/* Station Bullet Node */}
                <div style={{
                  width: isHovered ? '10px' : '6px',
                  height: isHovered ? '10px' : '6px',
                  borderRadius: '50%',
                  backgroundColor: isHovered || isSelected ? '#fff' : current.color,
                  boxShadow: `0 0 8px ${current.color}`,
                  transition: 'all 0.3s ease'
                }} />
              </div>

              {/* Station Name Label */}
              <span style={{
                position: 'absolute',
                top: '18px',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontSize: '8px',
                fontWeight: isHovered || isSelected ? 'bold' : 'normal',
                color: isHovered || isSelected ? '#fff' : '#94a3b8',
                background: 'rgba(9, 13, 22, 0.8)',
                padding: '1px 4px',
                borderRadius: '4px',
                border: isHovered || isSelected ? `1px solid ${current.color}44` : '1px solid transparent',
                transition: 'all 0.2s'
              }}>
                {node.name}
              </span>
            </div>
          );
        })}

        {/* Hover / Select Info Banner */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: `1px solid ${current.color}aa`,
          padding: '0.4rem 0.8rem',
          borderRadius: '8px',
          fontSize: '0.72rem',
          maxWidth: '240px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          color: '#fff',
          backdropFilter: 'blur(4px)'
        }}>
          {selectedNode ? (
            <div>
              <div style={{ fontWeight: 'bold', color: current.color }}>📍 {selectedNode.name}</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', margin: '1px 0' }}>{selectedNode.role}</div>
              <div style={{ fontSize: '0.65rem', marginTop: '2px', color: '#e2e8f0' }}>{selectedNode.details}</div>
            </div>
          ) : hoveredNode ? (
            <div>
              <div style={{ fontWeight: 'bold' }}>🌊 {hoveredNode}</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Hovering over node. Click to pin details.</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 'bold', color: current.color }}>ℹ️ Interactive Map</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Hover or click stations to explore hubs, lines, and junctions.</div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => { setActiveTab('nh'); setSelectedNode(null); }}
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
          onClick={() => { setActiveTab('railway'); setSelectedNode(null); }}
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
          onClick={() => { setActiveTab('waterway'); setSelectedNode(null); }}
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
