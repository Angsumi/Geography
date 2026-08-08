import React from 'react';
import { motion } from 'framer-motion';
import { Map, Layers, Link2, GraduationCap, Zap, Compass, ArrowRight, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { GamusaIcon } from './icons/GamusaIcon';

export function HomePage({ onSelectChapter }) {
  const chapterCards = [
    {
      id: 'INDIA',
      title: 'INDIA',
      fullTitle: 'Physical Geography of India',
      icon: '🇮🇳',
      color: '#34d399',
      bgGrad: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15))',
      border: 'rgba(52, 211, 153, 0.3)',
      shadow: '0 0 24px rgba(52, 211, 153, 0.2)',
      stats: '10 Subtopics · 19 Sections · 287 Practice Items',
      highlights: [
        'Himalayan & Peninsular Divisions',
        'Indus, Ganga & Brahmaputra Rivers',
        'Thar Desert & Coastal Plains',
        'UNESCO Hotspots & Biosphere Reserves'
      ]
    },
    {
      id: 'ASSAM',
      title: 'ASSAM',
      fullTitle: 'Assam Geography & Wildlife',
      icon: <GamusaIcon size={36} />,
      color: '#fb923c',
      bgGrad: 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(245,158,11,0.15))',
      border: 'rgba(251, 146, 60, 0.3)',
      shadow: '0 0 24px rgba(251, 146, 60, 0.2)',
      stats: '6 Subtopics · 15 Sections · 338 Practice Items',
      highlights: [
        'Brahmaputra & Barak River Systems',
        '7 Declared National Parks',
        'Wildlife Sanctuaries & Wetlands',
        'Transportation Highways, NW & Railways'
      ]
    },
    {
      id: 'NE',
      title: 'NE',
      fullTitle: 'Northeast States Profile',
      icon: '🏔️',
      color: '#f472b6',
      bgGrad: 'linear-gradient(135deg, rgba(244,114,182,0.15), rgba(168,85,247,0.15))',
      border: 'rgba(244, 114, 182, 0.3)',
      shadow: '0 0 24px rgba(244, 114, 182, 0.2)',
      stats: '9 Subtopics · 19 Sections · 475 Practice Items',
      highlights: [
        '7 Sister States Full Profiles',
        'Khangchendzonga & Moidams Heritage',
        'Major Hill Ranges (Barail, Patkai, Garo)',
        'Dihang-Dibang & Nokrek Biospheres'
      ]
    }
  ];

  const siteSchemaSteps = [
    {
      step: '01',
      title: 'Choose a Chapter',
      icon: Compass,
      color: '#38bdf8',
      desc: 'Select INDIA, ASSAM, or NE from the home screen or left navigation bar.'
    },
    {
      step: '02',
      title: 'Interactive Vector Maps',
      icon: Map,
      color: '#34d399',
      desc: 'Click on map regions (Himalayas, Valleys, Hills) to filter sections instantly.'
    },
    {
      step: '03',
      title: '3D/SVG Visualizers & Facts',
      icon: Zap,
      color: '#fb923c',
      desc: 'Study core syllabus points accompanied by animated structural diagrams.'
    },
    {
      step: '04',
      title: 'Tri-Fold Practice Suite',
      icon: GraduationCap,
      color: '#f472b6',
      desc: 'Reinforce memory with Visual Flashcards (+10 XP), Matching (+10 XP), & MCQs (+15 XP).'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: 1100, margin: '0 auto', paddingBottom: '3rem' }}
    >
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '3rem 2rem',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#38bdf8',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            🎓 ADRE Exam Preparation Portal
          </span>

          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 900,
            margin: '1rem 0 0.5rem',
            letterSpacing: '0.04em',
            background: 'linear-gradient(135deg, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Geography Syllabus Mastery Hub
          </h1>

          <p style={{
            fontSize: '1rem',
            color: '#94a3b8',
            maxWidth: 680,
            margin: '0 auto 1.5rem',
            lineHeight: 1.6
          }}>
            Comprehensive interactive learning platform for ADRE candidates. Explore physical regions, practice matching key traits, and test your retention with 1,100+ curated items.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
              <BookOpen size={16} color="#34d399" /> 3 Core Chapters
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
              <Zap size={16} color="#fb923c" /> 53 Total Sections
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
              <Award size={16} color="#f472b6" /> 1,100 Interactive Questions
            </span>
          </div>
        </div>
      </div>

      {/* 3 Main Chapter Navigation Buttons Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Select Chapter
            </span>
            <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.6rem', fontWeight: 800 }}>
              Choose a Chapter to Begin
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {chapterCards.map(card => (
            <motion.div
              key={card.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectChapter(card.id)}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                borderRadius: '20px',
                background: card.bgGrad,
                border: `1.5px solid ${card.border}`,
                boxShadow: card.shadow,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '2.2rem' }}>{card.icon}</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: card.color, letterSpacing: '0.05em' }}>
                        {card.title}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>{card.fullTitle}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.72rem',
                  padding: '0.35rem 0.7rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${card.border}`,
                  color: card.color,
                  borderRadius: '12px',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                  display: 'inline-block'
                }}>
                  {card.stats}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {card.highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#e2e8f0' }}>
                      <CheckCircle2 size={14} color={card.color} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '14px',
                  background: card.color,
                  color: '#000',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '0.5rem',
                  boxShadow: `0 4px 14px ${card.color}40`,
                  transition: 'all 0.2s'
                }}
              >
                <span>Launch {card.title} Chapter</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* General Schema of the Site Section */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.7)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Site Architecture & Flow
          </span>
          <h2 style={{ margin: '0.2rem 0 0.5rem', fontSize: '1.6rem', fontWeight: 800 }}>
            General Schema of the Platform
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            How ADRE Geography Hub optimizes your study workflow in 4 structured steps
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {siteSchemaSteps.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: '12px',
                    background: `${s.color}20`,
                    border: `1px solid ${s.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    <IconComponent size={20} color={s.color} />
                  </div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'rgba(255,255,255,0.15)' }}>
                    {s.step}
                  </span>
                </div>

                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                  {s.title}
                </h4>

                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
