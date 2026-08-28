import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, ArrowRight, Compass, Layers, HelpCircle, CheckCircle2, Sparkles, BookOpen, MapPin, Zap, ChevronRight, Heart } from 'lucide-react';
import { GamusaIcon } from './icons/GamusaIcon';
import { CourseTreeVisual } from './visualizers/CourseTreeVisual';

export function HomePage({
  syllabusHierarchy,
  completedTopics = {},
  activeChapter = 'ASSAM',
  onSelectChapter,
  onStartLessonPlayer,
  onStartSectionPlayer,
  onStartFlashcard,
  onStartMatch,
  onStartMCQ,
  onExploreMap,
  onExploreTopics
}) {
  // Map Showcase state on front page ('ASSAM', 'NE', 'INDIA')
  const [homeMapTab, setHomeMapTab] = useState('ASSAM');

  // State for interactive mini-preview widget
  const [previewTab, setPreviewTab] = useState('river'); // 'river', 'district', 'quiz'
  const [activeRiver, setActiveRiver] = useState('subansiri');
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);

  // Compute Next Recommended Uncompleted Lesson dynamically
  const getNextRecommendedLesson = () => {
    const safeCompleted = completedTopics && typeof completedTopics === 'object' ? completedTopics : {};
    let firstUncompleted = null;
    let firstLessonEver = null;

    for (const ch of (syllabusHierarchy || [])) {
      for (const u of (ch.units || [])) {
        for (const les of (u.lessons || [])) {
          if (!firstLessonEver) {
            firstLessonEver = {
              lessonName: les.lessonName,
              unitName: u.unitName,
              chapterName: ch.chapterName,
              topics: les.topics || []
            };
          }

          const topics = les.topics || [];
          const hasUncompletedTopic = topics.length === 0 || topics.some(t => t && t.topicName && !safeCompleted[t.topicName]);
          if (hasUncompletedTopic && !firstUncompleted) {
            firstUncompleted = {
              lessonName: les.lessonName,
              unitName: u.unitName,
              chapterName: ch.chapterName,
              topics
            };
          }
        }
      }
    }

    const isAnyCompleted = Object.keys(safeCompleted).length > 0;

    if (firstUncompleted) {
      const topSummary = (firstUncompleted.topics || []).map(t => t.topicName).filter(Boolean).slice(0, 3).join(', ');
      return {
        tag: isAnyCompleted ? 'CONTINUE YOUR JOURNEY' : 'RECOMMENDED STARTING POINT',
        lessonName: firstUncompleted.lessonName,
        unitName: firstUncompleted.unitName,
        chapterName: firstUncompleted.chapterName,
        topicsSummary: topSummary ? `Focus: ${topSummary}` : 'Explore core geographical concepts & micro-quizzes.'
      };
    }

    // Fallback if all topics completed
    if (firstLessonEver) {
      return {
        tag: 'ALL TOPICS MASTERED 🎉',
        lessonName: firstLessonEver.lessonName,
        unitName: firstLessonEver.unitName,
        chapterName: firstLessonEver.chapterName,
        topicsSummary: 'Review your mastered curriculum topics anytime.'
      };
    }

    return {
      tag: 'RECOMMENDED STARTING POINT',
      lessonName: 'Brahmaputra Valley',
      unitName: 'Physiographic Divisions & Conservation',
      chapterName: 'ASSAM',
      topicsSummary: 'Physiography, north/south bank tributaries, and floodplains.'
    };
  };

  const nextRec = getNextRecommendedLesson();

  const handleExploreClick = () => {
    if (onExploreTopics) {
      onExploreTopics();
    } else if (onSelectChapter) {
      onSelectChapter(activeChapter || 'ASSAM');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        maxWidth: 900,
        margin: '0 auto',
        padding: '0.5rem 0.5rem 3rem 0.5rem'
      }}
    >
      {/* ── 1. BRAND HEADER & HERO SECTION ── */}
      <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Brand Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'var(--primary-bg)',
            border: '1px solid var(--primary-border)',
            padding: '0.35rem 0.9rem',
            borderRadius: '100px',
            marginBottom: '1.25rem'
          }}
        >
          <GamusaIcon size={16} />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Interactive Geography Platform
          </span>
        </motion.div>

        {/* Short, Compelling Headline */}
        <h1 style={{
          fontSize: 'clamp(2.1rem, 5vw, 3.2rem)',
          fontWeight: 900,
          margin: '0 0 0.85rem 0',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: 'var(--text-main)'
        }}>
          Master Geography,<br />
          <span style={{
            color: 'var(--primary)'
          }}>
            step by bite-sized step.
          </span>
        </h1>

        {/* One-Line Explanation */}
        <p style={{
          fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
          color: 'var(--text-muted)',
          maxWidth: 620,
          margin: '0 auto 1.25rem',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          Bite-sized visual lessons, map-based concepts, and micro-quizzes across Assam, Northeast &amp; Indian Geography.
        </p>

        {/* 3 Action CTAs Mobile First Centered Group */}
        <div className="hero-cta-group">
          {/* 1. Start Learning -> Enters Player with Next Recommended Lesson */}
          <button
            className="btn btn-primary"
            onClick={() => onStartLessonPlayer(nextRec.lessonName)}
            style={{
              padding: '0.85rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: '12px'
            }}
          >
            <PlayCircle size={18} />
            <span>{nextRec.tag.includes('CONTINUE') ? 'Continue Learning' : 'Start Learning'}</span>
          </button>

          {/* 2. Explore Topics -> Enters Student Curriculum Tree */}
          <button
            className="btn btn-subtle"
            onClick={handleExploreClick}
            style={{
              padding: '0.85rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '12px'
            }}
          >
            <BookOpen size={18} />
            <span>Explore Topics</span>
          </button>

          {/* 3. Map Viewer -> Enters Map Viewer Page */}
          <button
            className="btn btn-subtle"
            onClick={onExploreMap}
            style={{
              padding: '0.85rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '12px'
            }}
          >
            <Compass size={18} />
            <span>Map Viewer</span>
          </button>
        </div>
      </section>

      {/* ── COURSE TREE VISUALIZATION AT THE VERY BEGINNING ── */}
      <section style={{ width: '100%' }}>
        <CourseTreeVisual
          chapterName={nextRec.chapterName}
          unitName={nextRec.unitName}
          lessonName={nextRec.lessonName}
          topicName={nextRec.lessonName}
          onSelectChapter={onSelectChapter}
          onStartLessonPlayer={onStartLessonPlayer}
          onExploreTopics={handleExploreClick}
        />
      </section>

      {/* ── 2. MINIMAL CORE JOURNEY: Learn → Explore → Practice → Master ── */}
      <section style={{ width: '100%', marginTop: '0.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            HOW IT WORKS
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0 0' }}>
            The Core Learning Journey
          </h2>
        </div>

        {/* 4 Steps Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '0.85rem'
        }}>
          {[
            {
              step: '01',
              title: 'Learn',
              icon: <BookOpen size={18} color="#34d399" />,
              desc: 'Bite-sized visual concepts & river flow visualizers.',
              accent: '#10b981'
            },
            {
              step: '02',
              title: 'Explore',
              icon: <Compass size={18} color="#38bdf8" />,
              desc: 'Interactive vector map of Assam districts & hills.',
              accent: '#38bdf8'
            },
            {
              step: '03',
              title: 'Practice',
              icon: <Layers size={18} color="#fb923c" />,
              desc: 'Active recall flashcards & drag-and-drop matching.',
              accent: '#fb923c'
            },
            {
              step: '04',
              title: 'Master',
              icon: <Zap size={18} color="#c084fc" />,
              desc: 'Exam-level MCQ quizzes & daily streak tracking.',
              accent: '#c084fc'
            }
          ].map((item) => (
            <div
              key={item.step}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '18px',
                padding: '1.15rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  background: `${item.accent}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: item.accent, opacity: 0.8 }}>
                  STEP {item.step}
                </span>
              </div>

              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 800 }}>
                {item.title}
              </h3>

              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.45 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. DYNAMIC RECOMMENDED / RESUME LESSON CARD ── */}
      <section style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          className="responsive-card-center"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.15), rgba(15, 23, 42, 0.85))',
            border: '1.5px solid rgba(45, 212, 191, 0.3)',
            borderRadius: '20px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {nextRec.tag}
            </span>
            <h3 style={{ margin: '0.2rem 0 0.1rem', fontSize: '1.15rem', color: '#ffffff', fontWeight: 900, textAlign: 'center' }}>
              {nextRec.chapterName} • {nextRec.lessonName}
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', textAlign: 'center' }}>
              {nextRec.topicsSummary}
            </p>
          </div>

          <button
            onClick={() => onStartLessonPlayer(nextRec.lessonName)}
            style={{
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              color: '#f0fdf4',
              border: '1px solid rgba(45, 212, 191, 0.35)',
              padding: '0.65rem 1.25rem',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
              margin: '0 auto'
            }}
          >
            <span>{nextRec.tag.includes('CONTINUE') ? 'Continue Learning ▶' : 'Start Now'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        textAlign: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        flexWrap: 'wrap',
        width: '100%',
        margin: '1rem auto 0 auto',
        gap: '0.35rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', width: '100%', textAlign: 'center' }}>
          <span>Made with</span>
          <Heart size={14} color="#f43f5e" fill="#f43f5e" />
          <span>in Rangachakua</span>
        </div>
      </footer>

    </motion.div>
  );
}
