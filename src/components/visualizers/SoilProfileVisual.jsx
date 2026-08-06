import React from 'react';

export function SoilProfileVisual() {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        🌱 Layered Alluvial Soil Profile
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ background: 'linear-gradient(90deg, #d97706, #b45309)', padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#fff', fontWeight: 'bold' }}>
          Topsoil / Khadar (New Fertile Alluvium Deposited Annually)
        </div>
        <div style={{ background: 'linear-gradient(90deg, #92400e, #78350f)', padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#e5e7eb' }}>
          Subsoil / Bhangar (Older Alluvium with Kankar Nodule Beds)
        </div>
        <div style={{ background: 'linear-gradient(90deg, #451a03, #292524)', padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
          Bedrock & River Basin Sediments (Indus, Ganga & Brahmaputra Interplay)
        </div>
      </div>
    </div>
  );
}
