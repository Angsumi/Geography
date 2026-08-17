import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Layers, HelpCircle, Trophy, Check, X, Sparkles, PlayCircle, FastForward, ChevronsRight, Flag, ThumbsUp, ThumbsDown, Volume2, VolumeX, Flame } from 'lucide-react';
import MatchGame from './MatchGame';
import { SectionVisualizer } from './SectionVisualizer';
import { playCorrect, playWrong, playComplete, playFlip, toggleMute, getIsMuted } from '../hooks/useSound';

export function InteractiveLesson({ lessonData, onComplete, onBack, onNavigateToTarget }) {
  const chapterName = lessonData.chapterName || 'ASSAM';
  const unitName = lessonData.unitName || 'Syllabus Unit';
  const lessonName = lessonData.lessonName || 'Lesson';
  const topicName = lessonData.topicName || lessonData.title || 'Topic';

  const conceptUnits = lessonData.conceptUnits || [];
  const practiceMatching = lessonData.practiceMatching || [];
  const navTargets = lessonData.navTargets || {};

  // State
  const [pairIndex, setPairIndex] = useState(0);
  const [unitStep, setUnitStep] = useState('visualization'); // 'visualization' | 'flashcard' | 'quiz' | 'matching_recap' | 'completed'
  const [isMuted, setIsMuted] = useState(getIsMuted());
  
  // Flashcard & MCQ state
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [floatingXp, setFloatingXp] = useState(null);

  const currentUnit = conceptUnits[pairIndex] || {
    Fact: `${topicName} key syllabus concept.`,
    Flashcard: { Front: `What is a key feature of ${topicName}?`, Back: `Key geography fact.` },
    Quiz: { Question: `Which statement is accurate regarding ${topicName}?`, Options: { A: 'Option A', B: 'Option B' }, CorrectAnswer: 'A', Explanation: 'Official syllabus fact.' }
  };

  const handleStartPracticeLoop = () => {
    setPairIndex(0);
    setIsFlipped(false);
    setSelectedOption(null);
    setIsQuizAnswered(false);
    setUnitStep('flashcard');
  };

  const handleFlashcardSelfAssess = (knewIt) => {
    if (knewIt) {
      setEarnedXp(x => x + 10);
      setFloatingXp('+10 XP');
      playCorrect();
    } else {
      playWrong();
    }
    
    setTimeout(() => {
      setFloatingXp(null);
      setIsFlipped(false);
      setSelectedOption(null);
      setIsQuizAnswered(false);
      setUnitStep('quiz');
    }, 600);
  };

  const handleQuizOptionSelect = (optKey) => {
    if (isQuizAnswered) return;
    setSelectedOption(optKey);
    setIsQuizAnswered(true);

    const isCorrect = optKey === currentUnit.Quiz?.CorrectAnswer;

    if (isCorrect) {
      setEarnedXp(x => x + 15);
      setFloatingXp('+15 XP');
      playCorrect();
      setTimeout(() => setFloatingXp(null), 1200);
    } else {
      playWrong();
    }
  };

  const handleNextPair = () => {
    if (pairIndex < conceptUnits.length - 1) {
      setPairIndex(i => i + 1);
      setUnitStep('flashcard');
      setIsFlipped(false);
      setSelectedOption(null);
      setIsQuizAnswered(false);
    } else {
      setEarnedXp(x => x + 25);
      playCorrect();
      setUnitStep('matching_recap');
    }
  };

  const handleRelearnTopic = () => {
    setPairIndex(0);
    setUnitStep('visualization');
    setIsFlipped(false);
    setSelectedOption(null);
    setIsQuizAnswered(false);
  };

  const handleMatchingComplete = (pts = 25) => {
    setEarnedXp(x => x + pts);
    setFloatingXp('+25 XP');
    playComplete();
    setTimeout(() => {
      setFloatingXp(null);
      setUnitStep('completed');
    }, 1200);
  };

  if (unitStep === 'completed') {
    const primaryTarget = navTargets?.nextTopic || navTargets?.nextLesson || navTargets?.nextUnit || navTargets?.nextChapter;
    const nextTopicName = primaryTarget?.topicName || primaryTarget?.lessonName || 'Next Topic';
    const hasNextTarget = !!primaryTarget;

    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel"
        style={{
          padding: '2rem 1.5rem',
          textAlign: 'center',
          maxWidth: 640,
          margin: '1.5rem auto',
          background: 'var(--bg-surface)',
          border: '1px solid var(--primary-border)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
        }}
      >
        {/* Top Section: Earned XP & Up Next Topic Name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', padding: '0.4rem 1rem', borderRadius: 9999 }}>
            <Trophy size={16} color="var(--primary)" />
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 900 }}>
              +{earnedXp} XP EARNED
            </span>
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.5rem 0 0.2rem', color: 'var(--text-main)' }}>
            {topicName} Completed! 🎉
          </h1>

          {/* Up Next Topic Name Banner on Top */}
          {hasNextTarget && (
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '0.55rem 1.1rem', borderRadius: 12, display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem' }}>
              <Sparkles size={15} color="var(--primary)" />
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                UP NEXT: <strong style={{ color: 'var(--text-main)', fontWeight: 800 }}>{nextTopicName}</strong>
              </span>
            </div>
          )}
        </div>

        {/* ── MAIN CTA BUTTON: "Learn '[topicName]'" (Re-plays present topic) ── */}
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            onClick={handleRelearnTopic}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              borderRadius: 14,
              fontWeight: 900,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.55rem',
              boxShadow: '0 6px 20px rgba(5, 150, 105, 0.25)'
            }}
          >
            <PlayCircle size={22} /> Learn "{topicName}"
          </button>
        </div>

        {/* ── Topic Completion Navigation Options (Next Topic, Next Lesson, Next Unit, Next Chapter) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', margin: '1rem 0 1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Jump Directly In Curriculum:
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.55rem' }}>
            {navTargets?.nextTopic && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextTopic)}
                style={{ padding: '0.65rem 0.85rem', borderRadius: 12, background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <PlayCircle size={15} /> Next Topic ▶
              </button>
            )}

            {navTargets?.nextLesson && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextLesson)}
                style={{ padding: '0.65rem 0.85rem', borderRadius: 12, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <FastForward size={15} /> Next Lesson ▶▶
              </button>
            )}

            {navTargets?.nextUnit && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextUnit)}
                style={{ padding: '0.65rem 0.85rem', borderRadius: 12, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <ChevronsRight size={15} /> Next Unit ⏭
              </button>
            )}

            {navTargets?.nextChapter && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextChapter)}
                style={{ padding: '0.65rem 0.85rem', borderRadius: 12, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <Flag size={15} /> Next Chapter 🏁
              </button>
            )}
          </div>
        </div>

        {/* Secondary Option: Return to Curriculum Directory */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button
            onClick={() => onComplete(earnedXp)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 12,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.35rem',
              width: '100%'
            }}
          >
            Explore All Topics
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingBottom: '8.5rem' }}>
      
      {/* Floating XP Banner */}
      <AnimatePresence>
        {floatingXp && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            style={{
              position: 'absolute',
              top: '-15px',
              right: '25px',
              color: '#34d399',
              fontWeight: 900,
              fontSize: '1.5rem',
              zIndex: 100,
              textShadow: '0 0 14px rgba(16,185,129,0.8)'
            }}
          >
            {floatingXp}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ultra-Compact Mobile Lesson Header (XP on top right, minimal vertical height) ── */}
      <div
        className="glass-panel"
        style={{
          padding: '0.35rem 0.75rem',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '0.5rem',
          border: '1px solid var(--primary-border)',
          background: 'var(--bg-surface)'
        }}
      >
        {/* Left: Compact Exit Button */}
        <button
          onClick={onBack}
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            padding: '0.3rem 0.6rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexShrink: 0
          }}
        >
          <ArrowLeft size={14} /> Exit
        </button>

        {/* Middle: Compact Single-Line Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            justifyContent: 'center'
          }}
        >
          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>📍 {chapterName}</span>
          <span>›</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topicName}</span>
        </div>

        {/* Top Right Controls: Streak + Mute Toggle + XP Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {/* Mute/Unmute Audio Pill */}
          <button
            onClick={() => setIsMuted(toggleMute())}
            title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            style={{
              background: isMuted ? 'var(--bg-subtle)' : 'var(--primary-bg)',
              border: `1px solid ${isMuted ? 'var(--border-subtle)' : 'var(--primary-border)'}`,
              color: isMuted ? 'var(--text-muted)' : 'var(--primary)',
              padding: '0.25rem 0.5rem',
              borderRadius: 8,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          {/* Daily Streak Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              padding: '0.25rem 0.5rem',
              borderRadius: 8
            }}
          >
            <Flame size={13} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              3d
            </span>
          </div>

          {/* XP Counter Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'var(--primary-bg)',
              padding: '0.25rem 0.55rem',
              borderRadius: 8,
              border: '1px solid var(--primary-border)'
            }}
          >
            <Trophy size={13} color="var(--primary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>
              {earnedXp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Hairline Progress Bar & Progress Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '-0.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          <span>
            {unitStep === 'visualization'
              ? 'Phase 1: Concept Visualization'
              : unitStep === 'matching_recap'
              ? 'Phase 3: Term Matching Game'
              : `Phase 2: Practice Pair ${pairIndex + 1} of ${conceptUnits.length}`}
          </span>
          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>
            {unitStep === 'visualization'
              ? '15%'
              : unitStep === 'matching_recap'
              ? '90%'
              : `${Math.round(15 + ((pairIndex + 1) / Math.max(1, conceptUnits.length)) * 75)}%`}
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: 'var(--primary)', borderRadius: 2 }}
            animate={{
              width:
                unitStep === 'visualization'
                  ? '15%'
                  : unitStep === 'matching_recap'
                  ? '90%'
                  : `${Math.round(15 + ((pairIndex + 1) / Math.max(1, conceptUnits.length)) * 75)}%`
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 3-Part Lesson Structure Phase Indicators */}
      {unitStep !== 'matching_recap' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: unitStep === 'visualization' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${unitStep === 'visualization' ? '#10b981' : 'rgba(255,255,255,0.08)'}`, color: unitStep === 'visualization' ? '#34d399' : '#64748b', padding: '0.3rem 0.65rem', borderRadius: 10, fontSize: '0.72rem', fontWeight: 800 }}>
            <BookOpen size={12} /> 1. Visualization
          </div>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: (unitStep === 'flashcard' || unitStep === 'quiz') ? 'rgba(192,132,252,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${(unitStep === 'flashcard' || unitStep === 'quiz') ? '#c084fc' : 'rgba(255,255,255,0.08)'}`, color: (unitStep === 'flashcard' || unitStep === 'quiz') ? '#c084fc' : '#64748b', padding: '0.3rem 0.65rem', borderRadius: 10, fontSize: '0.72rem', fontWeight: 800 }}>
            <Layers size={12} /> 2. Practice Loop ({pairIndex + 1}/{conceptUnits.length})
          </div>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', padding: '0.3rem 0.65rem', borderRadius: 10, fontSize: '0.72rem', fontWeight: 800 }}>
            <HelpCircle size={12} /> 3. Match Game
          </div>
        </div>
      )}

      {/* PHASE 1: VISUALIZATION STEP */}
      {unitStep === 'visualization' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="zen-split-container">
            {/* LEFT: Section Visualizer */}
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  🎨 Interactive Concept Visualization
                </span>
                <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>
                  Lesson Concept Overview
                </span>
              </div>
              <SectionVisualizer sectionName={topicName} facts={conceptUnits.map(u => u.Fact)} />
            </div>

            {/* RIGHT: Concept Facts List & Start Practice */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-sage">
                  OVERVIEW FACTS ({conceptUnits.length} POINTS)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Explore Concept
                </span>
              </div>

              <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 800 }}>
                {topicName}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '300px', overflowY: 'auto' }}>
                {conceptUnits.map((unit, idx) => (
                  <div key={idx} style={{ background: 'var(--primary-bg)', borderLeft: '3px solid var(--primary)', border: '1px solid var(--primary-border)', borderRadius: 10, padding: '0.85rem' }}>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, fontWeight: 500 }}>
                      <strong style={{ color: 'var(--primary)' }}>#{idx + 1}:</strong> {unit.Fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* PHASE 2A: FLASHCARD RECALL */}
      {unitStep === 'flashcard' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(192,132,252,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(192,132,252,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                ACTIVE RECALL #{pairIndex + 1}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Flashcard {pairIndex + 1} of {conceptUnits.length}
              </span>
            </div>

            {/* Flip Canvas Card */}
            <div style={{ perspective: '1000px', minHeight: '260px', cursor: 'pointer' }} onClick={() => { playFlip(); setIsFlipped(!isFlipped); }}>
              <motion.div
                style={{ width: '100%', minHeight: '260px', position: 'relative', transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Front Side */}
                <div className="glass-panel" style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '2rem', textAlign: 'center', border: '1px solid rgba(192,132,252,0.3)', borderRadius: 16
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '1rem' }}>
                    TAP CARD TO FLIP
                  </span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.5 }}>
                    {currentUnit.Flashcard?.Front || `What is a key feature of ${topicName}?`}
                  </h2>
                </div>

                {/* Back Side */}
                <div className="glass-panel" style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '2rem', textAlign: 'center', background: 'rgba(16,185,129,0.12)', border: '1.5px solid #10b981', borderRadius: 16
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '0.75rem' }}>
                    KEY RECALL ANSWER
                  </span>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399', margin: 0, lineHeight: 1.5 }}>
                    {currentUnit.Flashcard?.Back || currentUnit.Fact}
                  </h2>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* PHASE 2B: EXAM MCQ QUIZ */}
      {unitStep === 'quiz' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(244,63,94,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(244,63,94,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                QUIZ #{pairIndex + 1}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Quiz {pairIndex + 1} of {conceptUnits.length}
              </span>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 800, lineHeight: 1.5 }}>
              {currentUnit.Quiz?.Question || `Which statement is accurate regarding ${topicName}?`}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {Object.entries(currentUnit.Quiz?.Options || {}).map(([key, label]) => {
                const isSelected = selectedOption === key;
                const isCorrect = key === currentUnit.Quiz?.CorrectAnswer;

                let btnBg = 'rgba(255,255,255,0.02)';
                let btnBorder = '1px solid rgba(255,255,255,0.08)';
                let textColor = '#e2e8f0';

                if (isQuizAnswered) {
                  if (isCorrect) {
                    btnBg = 'rgba(16,185,129,0.2)';
                    btnBorder = '1.5px solid #10b981';
                    textColor = '#34d399';
                  } else if (isSelected) {
                    btnBg = 'rgba(244,63,94,0.2)';
                    btnBorder = '1.5px solid #f43f5e';
                    textColor = '#f43f5e';
                  }
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleQuizOptionSelect(key)}
                    style={{
                      background: btnBg,
                      border: btnBorder,
                      color: textColor,
                      padding: '0.85rem 1.1rem',
                      borderRadius: 14,
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 800 : 500,
                      textAlign: 'left',
                      cursor: isQuizAnswered ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: isQuizAnswered && isCorrect ? '#10b981' : isQuizAnswered && isSelected ? '#f43f5e' : 'rgba(255,255,255,0.06)',
                      color: isQuizAnswered && (isCorrect || isSelected) ? '#000' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.82rem'
                    }}>
                      {key}
                    </span>
                    <span style={{ flex: 1 }}>{label}</span>
                    {isQuizAnswered && isCorrect && <Check size={18} color="#34d399" />}
                    {isQuizAnswered && isSelected && !isCorrect && <X size={18} color="#f43f5e" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation Rationale Box */}
            {isQuizAnswered && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, padding: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
                  SYLLABUS RATIONALE & EXPLANATION
                </span>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {currentUnit.Quiz?.Explanation || `Official Fact: ${currentUnit.Fact}`}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* PHASE 3: MATCH THE FOLLOWING RECAP */}
      {unitStep === 'matching_recap' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(56,189,248,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                FINAL RECAP GAME
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Match the Following
              </span>
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: 900 }}>
                {topicName} Term Matching Recap
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
                Connect terms on the left to definitions on the right to master topic connections.
              </p>
            </div>

            <MatchGame
              isEmbedded={true}
              data={practiceMatching.length > 0 ? practiceMatching : conceptUnits.map((u, i) => ({ q: `Term ${i + 1}`, a: u.Fact.substring(0, 50) }))}
              onComplete={handleMatchingComplete}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── UNIFIED FIXED BOTTOM FOOTER (Primary Step Action + Quick Jump Toolbar) ── */}
      {unitStep !== 'completed' && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'rgba(250, 249, 246, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1.5px solid var(--border-medium)',
            padding: '0.6rem 1rem',
            boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            
            {/* ROW 1: PRIMARY STEP ACTION */}
            {unitStep !== 'matching_recap' && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                {unitStep === 'visualization' && (
                  <button
                    onClick={handleStartPracticeLoop}
                    className="btn btn-primary"
                    style={{
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      width: '100%',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    Start Practice Loop: Flashcard #1 ➔
                  </button>
                )}

                {unitStep === 'flashcard' && (
                  isFlipped ? (
                    <div style={{ display: 'flex', gap: '0.65rem', width: '100%' }}>
                      <button
                        onClick={() => handleFlashcardSelfAssess(false)}
                        style={{
                          flex: 1,
                          padding: '0.65rem 0.85rem',
                          borderRadius: 12,
                          background: 'rgba(244,63,94,0.12)',
                          border: '1.5px solid rgba(244,63,94,0.35)',
                          color: '#f43f5e',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <ThumbsDown size={16} /> I Didn't Know (+0 XP)
                      </button>

                      <button
                        onClick={() => handleFlashcardSelfAssess(true)}
                        style={{
                          flex: 1,
                          padding: '0.65rem 0.85rem',
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #10b981, #34d399)',
                          border: 'none',
                          color: '#000',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          gap: '0.4rem',
                          boxShadow: '0 4px 14px rgba(16,185,129,0.35)'
                        }}
                      >
                        <ThumbsUp size={16} /> I Knew It (+10 XP)
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, padding: '0.2rem 0' }}>
                      👆 Tap card above to flip &amp; reveal recall self-assessment options
                    </div>
                  )
                )}

                {unitStep === 'quiz' && (
                  isQuizAnswered ? (
                    <button
                      onClick={handleNextPair}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1.25rem',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #10b981, #34d399)',
                        color: '#000',
                        border: 'none',
                        fontWeight: 900,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        gap: '0.45rem',
                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      {pairIndex < conceptUnits.length - 1 ? `Next Flashcard (${pairIndex + 2}/${conceptUnits.length}) ➔` : 'Proceed to Match the Following ➔'}
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, padding: '0.2rem 0' }}>
                      Select an option above to answer quiz question
                    </div>
                  )
                )}
              </div>
            )}

            {/* ROW 2: QUICK JUMP TOOLBAR */}
            <div className="quick-jump-container" style={{ borderTop: unitStep !== 'matching_recap' ? '1px solid var(--border-subtle)' : 'none', paddingTop: unitStep !== 'matching_recap' ? '0.45rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FastForward size={15} color="var(--primary)" />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Quick Jump:
                </span>
              </div>

              <div className="quick-jump-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {navTargets?.nextTopic && (
                  <button
                    onClick={() => onNavigateToTarget(navTargets.nextTopic)}
                    style={{ padding: '0.3rem 0.55rem', borderRadius: 8, background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <PlayCircle size={12} /> Skip Topic
                  </button>
                )}

                {navTargets?.nextLesson && (
                  <button
                    onClick={() => onNavigateToTarget(navTargets.nextLesson)}
                    style={{ padding: '0.3rem 0.55rem', borderRadius: 8, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <FastForward size={12} /> Skip Lesson
                  </button>
                )}

                {navTargets?.nextUnit && (
                  <button
                    onClick={() => onNavigateToTarget(navTargets.nextUnit)}
                    style={{ padding: '0.3rem 0.55rem', borderRadius: 8, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <ChevronsRight size={12} /> Skip Unit
                  </button>
                )}

                {navTargets?.nextChapter && (
                  <button
                    onClick={() => onNavigateToTarget(navTargets.nextChapter)}
                    style={{ padding: '0.3rem 0.55rem', borderRadius: 8, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Flag size={12} /> Skip Chapter
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
