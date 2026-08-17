import React from 'react';
import { motion } from 'framer-motion';
import { Map, Zap, PlayCircle, Layers, Link2, HelpCircle, ChevronDown, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { GamusaIcon } from './icons/GamusaIcon';
import { SectionVisualizer } from './SectionVisualizer';

export function HomePage({
  syllabusHierarchy,
  activeChapter = 'ASSAM',
  onSelectChapter,
  onStartLessonPlayer,
  onStartSectionPlayer,
  onStartFlashcard,
  onStartMatch,
  onStartMCQ,
  onExploreMap
}) {
  const [expandedTopic, setExpandedTopic] = React.useState(null);

  const chapters = [
    { id: 'ASSAM', label: 'Assam Geography', icon: <GamusaIcon size={20} />, desc: '6 Subtopics · 15 Sections' },
    { id: 'NE', label: 'Northeast 7 Sisters', icon: '🏔️', desc: '9 Topics · State Profiles & Biospheres' },
    { id: 'INDIA', label: 'Indian Geography', icon: '🇮🇳', desc: '3 Topics · 10 Physical Subtopics' }
  ];

  const activeTab = activeChapter || 'ASSAM';
  const currentSubjectObj = syllabusHierarchy?.find(s => s.subjectName === activeTab) || syllabusHierarchy?.[0];
  const topics = currentSubjectObj?.topics || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 1100, margin: '0 auto', paddingBottom: '3rem' }}
    >
      {/* ── Platform Hero Banner ── */}
      <div className="glass-panel" style={{
        padding: '2rem 1.5rem',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#10b981',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <GamusaIcon size={16} /> ADRE & APSC Geography Platform
            </span>
          </div>

          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 900,
            margin: '0.4rem 0',
            letterSpacing: '0.02em',
            background: 'linear-gradient(135deg, #ffffff, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.25
          }}>
            Geography Syllabus Directory
          </h1>

          <p style={{
            fontSize: '0.9rem',
            color: '#94a3b8',
            maxWidth: 680,
            margin: '0 auto 1.25rem',
            lineHeight: 1.6
          }}>
            Start dedicated Section Players on any topic to learn individual section facts step-by-step with interactive visualizers, Flashcards, and Quizzes.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onStartLessonPlayer('Brahmaputra Valley')}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                color: '#000',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
              }}
            >
              <PlayCircle size={17} /> Launch Brahmaputra Valley Player
            </button>

            <button
              onClick={() => onExploreMap()}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#34d399',
                border: '1.5px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Map size={17} /> Canvas Map Inspector
            </button>
          </div>
        </div>
      </div>

      {/* ── Chapter Selector ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CHAPTER SELECTOR
            </span>
            <h2 style={{ margin: '0.1rem 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
              {activeTab === 'ASSAM' ? 'Assam Geography' : activeTab === 'NE' ? 'Northeast 7 Sisters' : 'Indian Geography'}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.35rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
            {chapters.map(ch => {
              const isActive = activeTab === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => { onSelectChapter(ch.id); setExpandedTopic(null); }}
                  style={{
                    background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    border: `1.5px solid ${isActive ? '#10b981' : 'transparent'}`,
                    color: isActive ? '#34d399' : '#94a3b8',
                    padding: '0.5rem 0.95rem',
                    borderRadius: 12,
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span>{ch.icon}</span>
                  <span>{ch.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Topic Directory List ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {topics.map((topic, tIdx) => {
            const isTopicOpen = expandedTopic === tIdx || expandedTopic === null;

            return (
              <div key={tIdx} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                
                {/* Topic Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: isTopicOpen ? '1rem' : 0, borderBottom: isTopicOpen ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div
                    onClick={() => setExpandedTopic(expandedTopic === tIdx ? -1 : tIdx)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                      {tIdx + 1}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        TOPIC {tIdx + 1} OF {topics.length}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 900 }}>
                        {topic.topicName}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {topic.subtopics[0] && (
                      <button
                        onClick={() => onStartLessonPlayer(topic.subtopics[0].subtopicName)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #34d399)',
                          border: 'none',
                          color: '#000',
                          padding: '0.45rem 0.85rem',
                          borderRadius: 10,
                          fontSize: '0.78rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <PlayCircle size={14} /> Full Subtopic Player
                      </button>
                    )}

                    <div onClick={() => setExpandedTopic(expandedTopic === tIdx ? -1 : tIdx)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {isTopicOpen ? <ChevronDown size={20} color="#94a3b8" /> : <ChevronRight size={20} color="#94a3b8" />}
                    </div>
                  </div>
                </div>

                {/* Subtopic Items */}
                {isTopicOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                    {topic.subtopics.map((sub, sIdx) => {
                      return (
                        <div
                          key={sIdx}
                          style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            border: '1.5px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <span style={{ fontSize: '0.65rem', color: '#fb923c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                SUBTOPIC {sIdx + 1}
                              </span>
                              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#34d399', fontWeight: 900 }}>
                                {sub.subtopicName}
                              </h4>
                            </div>

                            <button
                              onClick={() => onStartLessonPlayer(sub.subtopicName)}
                              style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '1px solid #10b981',
                                color: '#34d399',
                                padding: '0.45rem 0.8rem',
                                borderRadius: 10,
                                fontSize: '0.78rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <PlayCircle size={14} /> Play All Subtopic Sections
                            </button>
                          </div>

                          {/* Sections, Visualizer, & Dedicated Section Player Buttons */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sub.sections?.map((sec, secIdx) => (
                              <div
                                key={secIdx}
                                style={{
                                  background: 'rgba(15, 23, 42, 0.6)',
                                  borderLeft: '3.5px solid #fb923c',
                                  border: '1px solid rgba(255,255,255,0.04)',
                                  borderRadius: '12px',
                                  padding: '1.1rem 1.15rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.65rem'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                  <span style={{ fontSize: '0.88rem', color: '#fb923c', fontWeight: 800 }}>
                                    📌 Section {secIdx + 1}: {sec.sectionName}
                                  </span>

                                  {/* Dedicated Section Player Launch Button */}
                                  <button
                                    onClick={() => onStartSectionPlayer(sec, sub.subtopicName, topic.topicName, activeTab)}
                                    style={{
                                      background: 'linear-gradient(135deg, #10b981, #34d399)',
                                      border: 'none',
                                      color: '#000',
                                      padding: '0.42rem 0.8rem',
                                      borderRadius: 8,
                                      fontSize: '0.75rem',
                                      fontWeight: 900,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                                    }}
                                  >
                                    <PlayCircle size={14} /> Start Section Player
                                  </button>
                                </div>

                                {/* Section Visualizer Diagram */}
                                <div style={{ borderRadius: 12, overflow: 'hidden' }}>
                                  <SectionVisualizer sectionName={sec.sectionName} facts={sec.facts || []} />
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                  {sec.facts?.map((fact, fIdx) => (
                                    <li key={fIdx} style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                                      <span style={{ color: '#10b981', fontWeight: 800 }}>•</span>
                                      <span>{fact}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Standalone Practice Launchers */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.55rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <button
                              onClick={() => onStartFlashcard(sub.subtopicName)}
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#cbd5e1',
                                padding: '0.65rem',
                                borderRadius: '12px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <Layers size={14} /> Flashcards
                            </button>

                            <button
                              onClick={() => onStartMatch(sub.subtopicName)}
                              style={{
                                background: 'rgba(56, 189, 248, 0.12)',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                color: '#38bdf8',
                                padding: '0.65rem',
                                borderRadius: '12px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <Link2 size={14} /> Match Pairs
                            </button>

                            <button
                              onClick={() => onStartMCQ(sub.subtopicName)}
                              style={{
                                background: 'rgba(244, 63, 94, 0.14)',
                                border: '1px solid rgba(244, 63, 94, 0.3)',
                                color: '#f43f5e',
                                padding: '0.65rem',
                                borderRadius: '12px',
                                fontSize: '0.78rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <HelpCircle size={14} /> Exam Quiz
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
