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
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: 'rgba(9, 13, 22, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.4rem 0.5rem calc(0.4rem + env(safe-area-inset-bottom))',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-around'
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
              color: isActive ? '#10b981' : '#94a3b8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              gap: '0.2rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: isActive ? 800 : 500,
              minWidth: '60px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              padding: '0.25rem 0.7rem',
              borderRadius: '12px',
              background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              transition: 'background 0.2s ease'
            }}>
              <Icon size={19} color={isActive ? '#34d399' : '#94a3b8'} />
            </div>
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
