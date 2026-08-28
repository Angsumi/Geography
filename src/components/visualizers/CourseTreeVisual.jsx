import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Layers, GraduationCap, Compass, Sparkles, Circle, PlayCircle, ChevronRight } from 'lucide-react';

export function CourseTreeVisual({
  chapterName = 'ASSAM',
  unitName = 'Physical Geography',
  lessonName = 'Brahmaputra Valley',
  topicName = 'Northern Bank Tributaries',
  conceptUnits = [],
  onSelectChapter,
  onStartLessonPlayer,
  onExploreTopics
}) {
  const shortChapter = chapterName.replace(/^\d+[._]\s*/, '').toUpperCase();

  const concepts = conceptUnits.length > 0 ? conceptUnits : [
    { Fact: 'Primary geographical boundaries & spatial facts' },
    { Fact: 'Landforms & key exam concepts' }
  ];

  const handleChapterClick = () => {
    if (onSelectChapter) onSelectChapter(chapterName);
    else if (onExploreTopics) onExploreTopics();
  };

  const handleUnitClick = () => {
    if (onExploreTopics) onExploreTopics();
  };

  const handleLessonClick = () => {
    if (onStartLessonPlayer) onStartLessonPlayer(lessonName);
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid rgba(45, 212, 191, 0.25)',
      borderRadius: 18,
      padding: '1.25rem 1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sparkles size={16} color="#2dd4bf" />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Course Structure Tree
          </span>
        </div>
        <span className="badge badge-sage" style={{ fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: 20, cursor: 'pointer' }} onClick={handleUnitClick}>
          Interactive Syllabus Hierarchy (Click to Explore)
        </span>
      </div>

      {/* Tree Visualization Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
        
        {/* Tier 1: Chapter Node */}
        <motion.div
          onClick={handleChapterClick}
          whileHover={{ scale: 1.015, x: 3 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(45, 212, 191, 0.25)',
            padding: '0.55rem 0.85rem',
            borderRadius: 12,
            width: 'fit-content',
            maxWidth: '100%',
            cursor: 'pointer'
          }}
          title="Click to view Chapter Directory"
        >
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(13, 148, 136, 0.2)', border: '1px solid rgba(45, 212, 191, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2dd4bf', flexShrink: 0 }}>
            <BookOpen size={14} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>CHAPTER</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f0fdf4' }}>{shortChapter}</div>
          </div>
          <ChevronRight size={14} color="#94a3b8" style={{ marginLeft: 4 }} />
        </motion.div>

        {/* Tier 2: Unit Node */}
        <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: '1.25rem', position: 'relative' }}>
          {/* Vertical Connecting Line from Chapter to Unit */}
          <div style={{ position: 'absolute', left: 24, top: -14, bottom: '50%', width: 2, background: 'rgba(45, 212, 191, 0.25)', borderRadius: 1 }} />
          
          <motion.div
            onClick={handleUnitClick}
            whileHover={{ scale: 1.015, x: 3 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '0.5rem 0.8rem',
              borderRadius: 10,
              width: 'fit-content',
              maxWidth: '100%',
              cursor: 'pointer'
            }}
            title="Click to view Curriculum Units"
          >
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(45, 212, 191, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2dd4bf', flexShrink: 0 }}>
              <Layers size={13} />
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>UNIT</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>{unitName}</div>
            </div>
            <ChevronRight size={13} color="#94a3b8" style={{ marginLeft: 4 }} />
          </motion.div>
        </div>

        {/* Tier 3: Lesson Node */}
        <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: '2.5rem', position: 'relative' }}>
          {/* Vertical Connecting Line from Unit to Lesson */}
          <div style={{ position: 'absolute', left: 44, top: -14, bottom: '50%', width: 2, background: 'rgba(45, 212, 191, 0.3)', borderRadius: 1 }} />
          
          <motion.div
            onClick={handleLessonClick}
            whileHover={{ scale: 1.015, x: 3 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(45, 212, 191, 0.25)',
              padding: '0.45rem 0.75rem',
              borderRadius: 10,
              width: 'fit-content',
              maxWidth: '100%',
              cursor: 'pointer'
            }}
            title="Click to launch Lesson"
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2dd4bf', flexShrink: 0 }}>
              <GraduationCap size={12} />
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: '#2dd4bf', textTransform: 'uppercase', fontWeight: 700 }}>LESSON</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f0fdf4' }}>{lessonName}</div>
            </div>
            <PlayCircle size={14} color="#2dd4bf" style={{ marginLeft: 4 }} />
          </motion.div>
        </div>

        {/* Tier 4: Active Topic Node (INTERACTIVE TARGET BUTTON NODE) */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '3.75rem', position: 'relative' }}>
          {/* Vertical Connecting Line from Lesson to Topic */}
          <div style={{ position: 'absolute', left: 64, top: -14, bottom: 20, width: 2, background: 'linear-gradient(to bottom, rgba(45, 212, 191, 0.4), #2dd4bf)', borderRadius: 1 }} />

          <motion.div
            onClick={handleLessonClick}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.3), rgba(15, 118, 110, 0.25))',
              border: '1.5px solid #2dd4bf',
              padding: '0.65rem 0.95rem',
              borderRadius: 12,
              boxShadow: '0 4px 18px rgba(13, 148, 136, 0.35)',
              maxWidth: '100%',
              cursor: 'pointer'
            }}
            title="Click to start learning this topic"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ width: 26, height: 26, borderRadius: '50%', background: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', flexShrink: 0 }}
            >
              <Compass size={15} />
            </motion.div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.62rem', color: '#2dd4bf', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                CURRENT TARGET TOPIC
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff' }}>
                {topicName}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLessonClick();
              }}
              style={{
                fontSize: '0.72rem',
                background: '#2dd4bf',
                color: '#0f172a',
                fontWeight: 800,
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: 100,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                boxShadow: '0 2px 10px rgba(45, 212, 191, 0.4)'
              }}
            >
              <PlayCircle size={13} /> START HERE ➔
            </button>
          </motion.div>

          {/* Sub-Branch: Concept Units / Key Facts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>
            {concepts.map((concept, idx) => (
              <motion.div
                key={idx}
                onClick={handleLessonClick}
                whileHover={{ scale: 1.01, x: 2, background: 'rgba(45, 212, 191, 0.08)' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                style={{
                  fontSize: '0.74rem',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '0.35rem 0.6rem',
                  borderRadius: 6,
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer'
                }}
              >
                <Circle size={8} color="#2dd4bf" fill="#2dd4bf" />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Concept {idx + 1}: {concept.Fact ? (concept.Fact.length > 55 ? concept.Fact.substring(0, 55) + '...' : concept.Fact) : `Core Fact ${idx + 1}`}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
