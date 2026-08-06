import React from 'react';

export function CoastalPlainsVisual() {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        🏖️ Coastal Subdivisions & Delta Comparison
      </h5>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: '0.6rem', borderRadius: '8px', fontSize: '0.75rem' }}>
          <strong style={{ color: '#38bdf8' }}>Western Coast:</strong> Narrow Strip (Konkan, Kannad, Malabar)
        </div>
        <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #0284c7', padding: '0.6rem', borderRadius: '8px', fontSize: '0.75rem' }}>
          <strong style={{ color: '#38bdf8' }}>Eastern Coast:</strong> Broad Deltas (Circars & Coromandel)
        </div>
      </div>
    </div>
  );
}
