import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Layers, HelpCircle, Trophy, Check, X, Award, Sparkles, PlayCircle, FastForward, ChevronsRight, Flag, ThumbsUp, ThumbsDown, BookMarked, Map, Compass, Target, Clock, ExternalLink, Eye, ChevronRight } from 'lucide-react';
import MatchGame from './MatchGame';
import { SectionVisualizer } from './SectionVisualizer';
import { playCorrect, playWrong, playComplete, playFlip, toggleMute, getIsMuted } from '../hooks/useSound';

export function InteractiveLesson({ lessonData = {}, onComplete, onBack, onNavigateToTarget }) {
  const chapterName = lessonData?.chapterName || 'ASSAM';
  const unitName = lessonData?.unitName || 'Syllabus Unit';
  const lessonName = lessonData?.lessonName || 'Lesson';
  const topicName = lessonData?.topicName || lessonData?.title || 'Topic';

  const conceptUnits = lessonData?.conceptUnits || [];
  const practiceMatching = lessonData?.practiceMatching || [];
  const navTargets = lessonData?.navTargets || {};

  // State Machine Phase: 'briefing' -> 'explore' -> 'learn' -> 'recall' -> 'check' -> 'matching_recap' -> 'completed'
  const [unitStep, setUnitStep] = useState('briefing');
  const [conceptIndex, setConceptIndex] = useState(0);

  // Modal Map Overlay state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Flashcard & Quiz state
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [floatingXp, setFloatingXp] = useState(null);

  // Reset player state whenever new lesson/topic data is loaded
  useEffect(() => {
    setUnitStep('briefing');
    setConceptIndex(0);
    setIsFlipped(false);
    setSelectedOption(null);
    setIsQuizAnswered(false);
    setEarnedXp(0);
    setFloatingXp(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonData?.topicName, lessonData?.chapterName]);

  const currentConcept = conceptUnits[conceptIndex] || {
    Fact: `${topicName} key syllabus concept.`,
    Flashcard: { Front: `What is a key feature of ${topicName}?`, Back: `Key geography fact.` },
    Quiz: { Question: `Which statement is accurate regarding ${topicName}?`, Options: { A: 'Option A', B: 'Option B' }, CorrectAnswer: 'A', Explanation: 'Official syllabus fact.' }
  };

  // Helper: Exam Relevance Callout Generator (Safely handles undefined/null Strings)
  const getExamRelevance = (factStr = '', name = '') => {
    const fStr = (factStr || '').toLowerCase();
    if (fStr.includes('tributar') || fStr.includes('river')) {
      return "Frequently tested in ADRE exams through river origins, bank classification (North vs South bank), and confluence locations.";
    }
    if (fStr.includes('district') || fStr.includes('boundary') || fStr.includes('area')) {
      return "High-yield ADRE topic: Regional boundaries and district-level geographical facts are directly asked in Grade III & IV papers.";
    }
    if (fStr.includes('national park') || fStr.includes('wildlife') || fStr.includes('rhino')) {
      return "Critical Environmental Science section: UNESCO heritage status, endemic fauna, and sanctuary coordinates appear regularly.";
    }
    return `Essential ADRE Geography concept: Understanding ${name || 'this topic'} builds foundational clarity for conceptual & matching MCQs.`;
  };

  // Phase Transition Handlers
  const handleStartExploration = () => {
    setUnitStep('explore');
  };

  const handleStartLearning = () => {
    setConceptIndex(0);
    setUnitStep('learn');
  };

  const handleStartRecall = () => {
    setIsFlipped(false);
    setUnitStep('recall');
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
      setUnitStep('check');
    }, 600);
  };

  const handleQuizOptionSelect = (optKey) => {
    if (isQuizAnswered) return;
    setSelectedOption(optKey);
    setIsQuizAnswered(true);

    const isCorrect = optKey === currentConcept.Quiz?.CorrectAnswer;

    if (isCorrect) {
      setEarnedXp(x => x + 15);
      setFloatingXp('+15 XP');
      playCorrect();
      setTimeout(() => setFloatingXp(null), 1200);
    } else {
      playWrong();
    }
  };

  const handleAdvanceToNextConcept = () => {
    if (conceptIndex < conceptUnits.length - 1) {
      setConceptIndex(i => i + 1);
      setUnitStep('learn');
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
    setConceptIndex(0);
    setUnitStep('briefing');
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

  // Helper for Stepper Bar Active State
  const getPhaseIndex = () => {
    switch (unitStep) {
      case 'briefing': return 0;
      case 'explore': return 1;
      case 'learn':
      case 'recall':
      case 'check': return 2;
      case 'matching_recap': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  // Render Phase Stepper Header
  const renderJourneyHeader = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Compass size={16} color="#34d399" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {topicName} Journey
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsMapModalOpen(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              padding: '0.3rem 0.65rem',
              borderRadius: 10,
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Map size={13} /> Open Map Reference 🌐
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(16,185,129,0.15)', padding: '0.25rem 0.55rem', borderRadius: 10, border: '1px solid rgba(16,185,129,0.3)' }}>
            <Trophy size={13} color="#34d399" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399' }}>{earnedXp} XP</span>
          </div>
        </div>
      </div>

      {/* Stepper Dots Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15,23,42,0.8)', padding: '0.5rem 0.85rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { label: 'Orient', idx: 0 },
          { label: 'Explore', idx: 1 },
          { label: `Learn (${conceptIndex + 1}/${conceptUnits.length || 1})`, idx: 2 },
          { label: 'Connect', idx: 3 }
        ].map((step, sIdx) => {
          const currentPhaseIdx = getPhaseIndex();
          const isActive = currentPhaseIdx === step.idx;
          const isDone = currentPhaseIdx > step.idx;

          return (
            <React.Fragment key={step.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: isDone ? '#10b981' : isActive ? 'linear-gradient(135deg, #10b981, #34d399)' : 'rgba(255,255,255,0.1)',
                  color: isDone || isActive ? '#000' : '#64748b',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  {isDone ? '✓' : step.idx + 1}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: isActive ? 800 : 500, color: isActive ? '#34d399' : isDone ? '#e2e8f0' : '#64748b' }}>
                  {step.label}
                </span>
              </div>
              {sIdx < 3 && <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>─</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  // Render "You are learning..." Anchor
  const renderLearningAnchor = (currentStepTitle) => (
    <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderLeft: '3px solid #10b981', padding: '0.55rem 0.85rem', borderRadius: '0 10px 10px 0', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        You're learning: <strong style={{ color: '#10b981' }}>{chapterName} ➔ {lessonName}</strong>
      </div>
      <div style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800 }}>
        Right now: <span style={{ color: '#34d399' }}>{currentStepTitle}</span>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────────────────────
     PHASE 6: COMPLETED SCORECARD (Reflect)
     ───────────────────────────────────────────────────────────── */
  if (unitStep === 'completed') {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: 660, margin: '1rem auto' }}>
        <Award size={64} color="#34d399" style={{ margin: '0 auto 1rem' }} />
        <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          TOPIC MASTERED
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.3rem 0 0.5rem', color: '#fff' }}>
          {topicName} Mastered!
        </h1>

        {/* Student Mindset Breadcrumb Location */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 1.25rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#10b981', fontWeight: 900 }}>📍 {chapterName}</span>
          <span>➔</span>
          <span style={{ color: '#cbd5e1' }}>Unit: {unitName}</span>
          <span>➔</span>
          <span style={{ color: '#cbd5e1' }}>Lesson: {lessonName}</span>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 16, padding: '1.25rem', marginBottom: '1.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total XP Awarded</span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#34d399', margin: '0.2rem 0' }}>
            +{earnedXp} XP
          </h2>
        </div>

        {/* ── HIGH PROMINENCE "LEARN THIS" RE-PLAY BUTTON ── */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={handleRelearnTopic}
            style={{
              width: '100%',
              padding: '1.1rem 1.75rem',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #10b981, #34d399, #059669)',
              color: '#000',
              border: '2px solid #6ee7b7',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.65rem',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.55)',
              transform: 'scale(1.02)'
            }}
          >
            <BookMarked size={24} /> 💡 Learn This (Re-Play Topic)
          </button>
        </div>

        {/* ── Topic Completion Navigation Options ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Or Continue Curriculum Flow:
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
            {navTargets?.nextTopic && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextTopic)}
                style={{ padding: '0.8rem 1rem', borderRadius: 12, background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#34d399', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <PlayCircle size={16} /> Next Topic ▶
              </button>
            )}

            {navTargets?.nextLesson && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextLesson)}
                style={{ padding: '0.8rem 1rem', borderRadius: 12, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <FastForward size={16} /> Next Lesson ▶▶
              </button>
            )}

            {navTargets?.nextUnit && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextUnit)}
                style={{ padding: '0.8rem 1rem', borderRadius: 12, background: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.4)', color: '#c084fc', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <ChevronsRight size={16} /> Next Unit ⏭
              </button>
            )}

            {navTargets?.nextChapter && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextChapter)}
                style={{ padding: '0.8rem 1rem', borderRadius: 12, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fb923c', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Flag size={16} /> Next Chapter 🏁
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => onComplete(earnedXp)}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.06)',
            color: '#cbd5e1',
            border: '1px solid rgba(255,255,255,0.1)',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Return to Syllabus Directory
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
      
      {/* Floating XP Animation Banner */}
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

      {/* Top Bar with Exit Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#cbd5e1',
            padding: '0.45rem 0.85rem',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <ArrowLeft size={16} /> Exit
        </button>

        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>
          📍 {chapterName} ➔ {lessonName}
        </div>
      </div>

      {/* Journey Header Stepper */}
      {renderJourneyHeader()}

      {/* ─────────────────────────────────────────────────────────────
         PHASE 1: MISSION BRIEFING (Orient)
         ───────────────────────────────────────────────────────────── */}
      {unitStep === 'briefing' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2.25rem', borderRadius: 20, background: 'rgba(15,23,42,0.92)', border: '1.5px solid rgba(16,185,129,0.3)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <Target size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  MISSION BRIEFING
                </span>
                <h2 style={{ margin: '0.1rem 0 0', fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
                  {topicName}
                </h2>
              </div>
            </div>

            <div style={{ background: 'rgba(30,41,59,0.6)', borderLeft: '4px solid #10b981', borderRadius: 14, padding: '1.25rem' }}>
              <p style={{ margin: 0, fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                In this mission, you will explore <strong>{topicName}</strong>, understand its geographical landforms, and master key facts required for ADRE competitive examinations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '0.85rem', textAlign: 'center' }}>
                <Clock size={18} color="#34d399" style={{ margin: '0 auto 0.25rem' }} />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>ESTIMATED TIME</span>
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>~5 Minutes</strong>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '0.85rem', textAlign: 'center' }}>
                <Layers size={18} color="#38bdf8" style={{ margin: '0 auto 0.25rem' }} />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>KEY CONCEPTS</span>
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{conceptUnits.length} Units</strong>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '0.85rem', textAlign: 'center' }}>
                <Trophy size={18} color="#c084fc" style={{ margin: '0 auto 0.25rem' }} />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>REWARD</span>
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>+75 XP</strong>
              </div>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px dashed rgba(16,185,129,0.3)', borderRadius: 14, padding: '1rem' }}>
              <strong style={{ color: '#34d399', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>🎯 Your Goal:</strong>
              <span style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                By the end of this session, you will be able to identify major geographical features, answer exam MCQs accurately, and connect related terms.
              </span>
            </div>

            <button
              onClick={handleStartExploration}
              style={{
                padding: '1rem 1.75rem',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                color: '#000',
                border: 'none',
                fontWeight: 900,
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '0.55rem',
                boxShadow: '0 6px 24px rgba(16, 185, 129, 0.45)'
              }}
            >
              START EXPLORING MAP ➔
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ─────────────────────────────────────────────────────────────
         PHASE 2: PURPOSEFUL EXPLORATION (Explore)
         ───────────────────────────────────────────────────────────── */}
      {unitStep === 'explore' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(56,189,248,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                STEP 2: MAP EXPLORATION
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Interactive Model Inspection
              </span>
            </div>

            <div style={{ background: 'rgba(56,189,248,0.1)', borderLeft: '4px solid #38bdf8', padding: '0.85rem 1.1rem', borderRadius: '0 12px 12px 0' }}>
              <strong style={{ color: '#38bdf8', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Eye size={16} /> Exploration Task Directive:
              </strong>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                Explore the interactive map below. Tap features and boundaries to observe spatial relationships before breaking down concepts.
              </p>
            </div>

            {/* Visualizer Canvas */}
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <SectionVisualizer sectionName={topicName} facts={conceptUnits.map(u => u.Fact)} />
            </div>

            <button
              onClick={handleStartLearning}
              style={{
                padding: '0.95rem 1.6rem',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                color: '#000',
                border: 'none',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
              }}
            >
              I'M READY TO LEARN CONCEPTS ➔
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ─────────────────────────────────────────────────────────────
         PHASE 3: CONCEPT LOOP - LEARN (Learn)
         ───────────────────────────────────────────────────────────── */}
      {unitStep === 'learn' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {renderLearningAnchor(`Concept ${conceptIndex + 1} of ${conceptUnits.length}: ${topicName}`)}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(16,185,129,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                CONCEPT {conceptIndex + 1} OF {conceptUnits.length}: LEARN
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Idea Break Down
              </span>
            </div>

            <div style={{ background: 'rgba(30,41,59,0.6)', borderLeft: '4px solid #10b981', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#34d399', fontWeight: 800 }}>
                Key Concept Fact:
              </h3>
              <p style={{ margin: 0, fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.6, fontWeight: 500 }}>
                {currentConcept.Fact}
              </p>
            </div>

            {/* "Why This Matters for ADRE Exam" Callout Box */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 14, padding: '1rem' }}>
              <strong style={{ color: '#fb923c', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                💡 Why This Matters for ADRE Exam:
              </strong>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {getExamRelevance(currentConcept.Fact, topicName)}
              </p>
            </div>

            <button
              onClick={handleStartRecall}
              style={{
                padding: '0.85rem 1.5rem',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                color: '#000',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
              }}
            >
              Can you remember it? (Recall) ➔
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ─────────────────────────────────────────────────────────────
         PHASE 3: CONCEPT LOOP - RECALL (Flashcard)
         ───────────────────────────────────────────────────────────── */}
      {unitStep === 'recall' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(192,132,252,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {renderLearningAnchor(`Concept ${conceptIndex + 1} of ${conceptUnits.length}: Recall Challenge`)}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(192,132,252,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                CONCEPT {conceptIndex + 1} OF {conceptUnits.length}: RECALL
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Active Recall Phase
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
                    {currentConcept.Flashcard?.Front || `What is a key feature of ${topicName}?`}
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
                    {currentConcept.Flashcard?.Back || currentConcept.Fact}
                  </h2>
                </div>
              </motion.div>
            </div>

            {/* Self-Assessment Buttons - REVEALED ONLY AFTER FLIPPING */}
            {isFlipped ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleFlashcardSelfAssess(false)}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1rem',
                    borderRadius: 14,
                    background: 'rgba(244,63,94,0.12)',
                    border: '1.5px solid rgba(244,63,94,0.35)',
                    color: '#f43f5e',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <ThumbsDown size={17} /> I Didn't Know
                </button>

                <button
                  onClick={() => handleFlashcardSelfAssess(true)}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1rem',
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    border: 'none',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.35)'
                  }}
                >
                  <ThumbsUp size={17} /> I Knew It (+10 XP)
                </button>
              </motion.div>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                👆 Tap the card above to flip and reveal recall self-assessment options
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ─────────────────────────────────────────────────────────────
         PHASE 3: CONCEPT LOOP - CHECK (MCQ Quiz)
         ───────────────────────────────────────────────────────────── */}
      {unitStep === 'check' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(244,63,94,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {renderLearningAnchor(`Concept ${conceptIndex + 1} of ${conceptUnits.length}: Knowledge Check`)}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(244,63,94,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                CONCEPT {conceptIndex + 1} OF {conceptUnits.length}: CHECK
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Exam Quiz Check
              </span>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 800, lineHeight: 1.5 }}>
              {currentConcept.Quiz?.Question || `Which statement is accurate regarding ${topicName}?`}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {Object.entries(currentConcept.Quiz?.Options || {}).map(([key, label]) => {
                const isSelected = selectedOption === key;
                const isCorrect = key === currentConcept.Quiz?.CorrectAnswer;

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
                      justify: 'center',
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
                  {currentConcept.Quiz?.Explanation || `Official Fact: ${currentConcept.Fact}`}
                </p>
              </motion.div>
            )}

            {/* Explicit Proceed Button After Quiz */}
            {isQuizAnswered && (
              <button
                onClick={handleAdvanceToNextConcept}
                style={{
                  padding: '0.85rem 1.5rem',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  color: '#000',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                }}
              >
                {conceptIndex < conceptUnits.length - 1 ? `✓ Concept ${conceptIndex + 1} Cleared! Next Concept ➔` : '✓ All Concepts Cleared! Connect the Dots ➔'}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ─────────────────────────────────────────────────────────────
         PHASE 4: CONNECT THE DOTS (Match Game Recap)
         ───────────────────────────────────────────────────────────── */}
      {unitStep === 'matching_recap' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(56,189,248,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                STEP 4: CONNECT THE DOTS
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Synthesize Concepts
              </span>
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: 900 }}>
                {topicName} Term Matching Recap
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
                Connect terms on the left to definitions on the right to synthesize all concepts into a unified mental model.
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

      {/* ── Mid-Play Skip Navigation Toolbar Options Below Player ── */}
      {unitStep !== 'completed' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '0.45rem',
          flexWrap: 'wrap',
          padding: '0.75rem 1rem',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16
        }}>
          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.25rem' }}>
            Quick Jump:
          </span>

          {navTargets?.nextTopic && (
            <button
              onClick={() => onNavigateToTarget(navTargets.nextTopic)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', padding: '0.35rem 0.65rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <SkipForward size={12} /> Skip Topic
            </button>
          )}

          {navTargets?.nextLesson && (
            <button
              onClick={() => onNavigateToTarget(navTargets.nextLesson)}
              style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8', padding: '0.35rem 0.65rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <FastForward size={12} /> Skip Lesson
            </button>
          )}

          {navTargets?.nextUnit && (
            <button
              onClick={() => onNavigateToTarget(navTargets.nextUnit)}
              style={{ background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.25)', color: '#c084fc', padding: '0.35rem 0.65rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <ChevronsRight size={12} /> Skip Unit
            </button>
          )}

          {navTargets?.nextChapter && (
            <button
              onClick={() => onNavigateToTarget(navTargets.nextChapter)}
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fb923c', padding: '0.35rem 0.65rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Flag size={12} /> Skip Chapter
            </button>
          )}
        </div>
      )}

      {/* ── MAP REFERENCE OVERLAY MODAL (Contextual Sheet) ── */}
      <AnimatePresence>
        {isMapModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '780px',
                background: '#0f172a',
                border: '1.5px solid #38bdf8',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Map size={20} color="#38bdf8" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 900 }}>
                    Map Reference Model: {topicName}
                  </h3>
                </div>

                <button
                  onClick={() => setIsMapModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    color: '#fff',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    fontWeight: 900
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Inspect the spatial map model to contextualize your current quiz/learning concept, then return to your activity.
              </div>

              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#090d16' }}>
                <SectionVisualizer sectionName={topicName} facts={conceptUnits.map(u => u.Fact)} />
              </div>

              <button
                onClick={() => setIsMapModalOpen(false)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  color: '#000',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  width: 'fit-content',
                  margin: '0 0 0 auto'
                }}
              >
                Back to Learning Activity ➔
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
