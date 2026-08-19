import React from 'react';
import { Home, Map, GraduationCap, Trophy } from 'lucide-react';

export function MobileNavBar({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'learn', label: 'Learn', icon: Home },
    { id: 'explore', label: 'Map', icon: Map },
    { id: 'practice', label: 'Practice', icon: GraduationCap },
    { id: 'progress', label: 'Mastery', icon: Trophy }
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: '0.65rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'auto',
        maxWidth: 'calc(100% - 1.5rem)',
        zIndex: 200,
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        borderRadius: 9999,
        padding: '0.3rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        gap: '0.35rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
      }}
    >
      {tabs.map(t => {
        const Icon = t.icon;
        const isActive = currentTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: isActive ? '#059669' : '#64748b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              textAlign: 'center',
              gap: '0.15rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontSize: '0.65rem',
              fontWeight: isActive ? 800 : 600,
              flex: '0 0 auto',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              transition: 'background 0.2s ease'
            }}>
              <Icon size={16} color={isActive ? '#059669' : '#64748b'} />
            </div>
            <span style={{ textAlign: 'center', display: 'block', width: '100%' }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
