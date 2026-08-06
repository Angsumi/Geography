import React from 'react';

export function MajorIslandsVisual() {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        🏝️ Island Origin Comparison
      </h5>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(45, 212, 191, 0.1)', border: '1px solid #2dd4bf', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
          <h6 style={{ margin: '0 0 0.2rem', color: '#2dd4bf', fontSize: '0.8rem' }}>Andaman & Nicobar</h6>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Volcanic Origin (Bay of Bengal)</span>
        </div>
        <div style={{ background: 'rgba(45, 212, 191, 0.1)', border: '1px solid #06b6d4', padding: '0.7rem', borderRadius: '8px', textAlign: 'center' }}>
          <h6 style={{ margin: '0 0 0.2rem', color: '#06b6d4', fontSize: '0.8rem' }}>Lakshadweep</h6>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Coral Origin / Atolls (Arabian Sea)</span>
        </div>
      </div>
    </div>
  );
}
