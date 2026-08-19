import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Layers, HelpCircle, Trophy, Check, X, Award, Sparkles, PlayCircle, FastForward, ChevronsRight, Flag, ThumbsUp, ThumbsDown, BookMarked, Map, Compass, Target, Clock, SkipForward } from 'lucide-react';
import MatchGame from './MatchGame';
import { SectionVisualizer } from './SectionVisualizer';
import { playCorrect, playWrong, playComplete, playFlip } from '../hooks/useSound';

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

  const handleLearnNextTopic = () => {
    if (navTargets?.nextTopic) {
      onNavigateToTarget(navTargets.nextTopic);
    } else if (navTargets?.nextLesson) {
      onNavigateToTarget(navTargets.nextLesson);
    } else {
      onComplete(earnedXp);
    }
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

  // Handler for Next Button Click based on current unitStep
  const handleNextClick = () => {
    switch (unitStep) {
      case 'briefing':
        handleStartExploration();
        break;
      case 'explore':
        handleStartLearning();
        break;
      case 'learn':
        handleStartRecall();
        break;
      case 'recall':
        if (!isFlipped) {
          playFlip();
          setIsFlipped(true);
        }
        break;
      case 'check':
        if (isQuizAnswered) handleAdvanceToNextConcept();
        break;
      default:
        break;
    }
  };

  /* ─────────────────────────────────────────────────────────────
     PHASE: COMPLETED SCORECARD (Reflect End Board)
     ───────────────────────────────────────────────────────────── */
  if (unitStep === 'completed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 160px)', padding: '1rem 0' }}>
        <motion.div key="step-completed" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', width: '100%', maxWidth: 620, background: 'rgba(20, 30, 45, 0.9)', border: '1px solid rgba(45, 212, 191, 0.25)', boxShadow: '0 20px 48px rgba(0, 0, 0, 0.5)' }}>
          <Award size={54} color="#2dd4bf" style={{ margin: '0 auto 0.85rem' }} />
          <span style={{ color: '#2dd4bf', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            TOPIC MASTERED
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0.2rem 0 0.4rem', color: '#f0fdf4' }}>
            {topicName} Mastered!
          </h1>

          {/* Student Mindset Breadcrumb Location */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, margin: '0 0 1.25rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#2dd4bf', fontWeight: 800 }}>📍 {chapterName}</span>
            <span>➔</span>
            <span style={{ color: '#cbd5e1' }}>Unit: {unitName}</span>
            <span>➔</span>
            <span style={{ color: '#cbd5e1' }}>Lesson: {lessonName}</span>
          </div>

          <div style={{ background: 'rgba(13, 148, 136, 0.1)', border: '1px solid rgba(45, 212, 191, 0.25)', borderRadius: 16, padding: '1.1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total XP Awarded</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2dd4bf', margin: '0.1rem 0' }}>
              +{earnedXp} XP
            </h2>
          </div>

          {/* ── HIGH PROMINENCE PRIMARY "LEARN NEXT TOPIC" BUTTON ── */}
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              onClick={handleLearnNextTopic}
              style={{
                width: '100%',
                padding: '0.9rem 1.4rem',
                borderRadius: 100,
                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                color: '#f0fdf4',
                border: '1px solid rgba(45, 212, 191, 0.35)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '0.55rem',
                boxShadow: '0 6px 20px rgba(13, 148, 136, 0.25)'
              }}
            >
              <PlayCircle size={20} /> 💡 Learn Next Topic ➔
            </button>
          </div>

          {/* ── Topic Completion Navigation Options (PERFECTLY CENTERED) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', width: '100%' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Or Jump Ahead in Curriculum Flow:
            </span>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', width: '100%' }}>
              {navTargets?.nextLesson && (
                <button
                  onClick={() => onNavigateToTarget(navTargets.nextLesson)}
                  style={{ padding: '0.7rem 1.1rem', minWidth: '170px', borderRadius: 100, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                >
                  <FastForward size={15} /> Next Lesson ▶▶
                </button>
              )}

              {navTargets?.nextUnit && (
                <button
                  onClick={() => onNavigateToTarget(navTargets.nextUnit)}
                  style={{ padding: '0.7rem 1.1rem', minWidth: '170px', borderRadius: 100, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                >
                  <ChevronsRight size={15} /> Next Unit ⏭
                </button>
              )}

              {navTargets?.nextChapter && (
                <button
                  onClick={() => onNavigateToTarget(navTargets.nextChapter)}
                  style={{ padding: '0.7rem 1.1rem', minWidth: '170px', borderRadius: 100, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                >
                  <Flag size={15} /> Next Chapter 🏁
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => onComplete(earnedXp)}
            style={{
              width: '100%',
              padding: '0.7rem 1.25rem',
              borderRadius: 100,
              background: 'rgba(255,255,255,0.03)',
              color: '#cbd5e1',
              border: '1px solid rgba(255,255,255,0.06)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Return to Syllabus Directory
          </button>
        </motion.div>
      </div>
    );
  }

  // Determine whether the fixed Next button or Self-Assessment buttons should be visible
  const showFixedControls = unitStep === 'briefing' || unitStep === 'explore' || unitStep === 'learn' || unitStep === 'recall' || (unitStep === 'check' && isQuizAnswered);

  return (
    <div style={{
      maxWidth: 760,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 160px)',
      position: 'relative',
      paddingBottom: '150px',
      width: '100%'
    }}>
      
      {/* Floating XP Animation Banner */}
      <AnimatePresence>
        {floatingXp && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            style={{
              position: 'absolute',
              top: '-15px',
              right: '25px',
              color: '#2dd4bf',
              fontWeight: 800,
              fontSize: '1.35rem',
              zIndex: 100
            }}
          >
            {floatingXp}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calm Zen Top Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.2rem 0.25rem', width: '100%', marginBottom: '0.85rem' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#cbd5e1',
            padding: '0.4rem 0.8rem',
            borderRadius: '12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <ArrowLeft size={15} /> Exit
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsMapModalOpen(true)}
            style={{
              background: 'rgba(13, 148, 136, 0.12)',
              border: '1px solid rgba(45, 212, 191, 0.25)',
              color: '#2dd4bf',
              padding: '0.35rem 0.75rem',
              borderRadius: 10,
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Map size={13} /> Open Map Reference 🌐
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(13, 148, 136, 0.12)', padding: '0.35rem 0.65rem', borderRadius: 10, border: '1px solid rgba(45, 212, 191, 0.2)' }}>
            <Trophy size={13} color="#2dd4bf" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2dd4bf' }}>{earnedXp} XP</span>
          </div>
        </div>
      </div>

      {/* CENTERED CARD CONTAINER: Both Vertically & Horizontally */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justify: 'center',
        width: '100%'
      }}>
        <AnimatePresence mode="wait">
          
          {/* STEP 1: MISSION BRIEFING (Orient) */}
          {unitStep === 'briefing' && (
            <motion.div key="step-briefing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-panel" style={{ padding: '2rem 1.6rem', borderRadius: 20, background: 'rgba(20, 30, 45, 0.88)', border: '1px solid rgba(45, 212, 191, 0.2)', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(13, 148, 136, 0.15)', border: '1px solid rgba(45, 212, 191, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2dd4bf', flexShrink: 0 }}>
                  <Target size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {chapterName} ➔ {lessonName}
                  </span>
                  <h2 style={{ margin: '0.1rem 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4', lineHeight: 1.3 }}>
                    {topicName}
                  </h2>
                </div>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderLeft: '3px solid #2dd4bf', borderRadius: 12, padding: '1.1rem 1.25rem' }}>
                <p style={{ margin: 0, fontSize: '0.98rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                  In this session, you will explore <strong>{topicName}</strong>, understand its geographical landforms, and master key facts required for ADRE competitive examinations.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: MAP EXPLORATION (Explore) */}
          {unitStep === 'explore' && (
            <motion.div key="step-explore" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-panel" style={{ padding: '1.5rem', borderRadius: 20, background: 'rgba(20, 30, 45, 0.88)', border: '1px solid rgba(45, 212, 191, 0.2)', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <div style={{ background: 'rgba(13, 148, 136, 0.08)', borderLeft: '3px solid #2dd4bf', padding: '0.75rem 1rem', borderRadius: '0 10px 10px 0' }}>
                <strong style={{ color: '#2dd4bf', fontSize: '0.84rem' }}>
                  Explore Map Model: {topicName}
                </strong>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  Explore features and boundaries on the map below before learning individual concepts.
                </p>
              </div>

              {/* Visualizer Canvas */}
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <SectionVisualizer sectionName={topicName} facts={conceptUnits.map(u => u.Fact)} />
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONCEPT LOOP - LEARN (Learn - Soft Muted Teal Card) */}
          {unitStep === 'learn' && (
            <motion.div key={`step-learn-${conceptIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-panel" style={{ padding: '2rem 1.6rem', borderRadius: 20, background: 'rgba(20, 30, 45, 0.88)', border: '1px solid rgba(45, 212, 191, 0.15)', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderLeft: '3px solid #2dd4bf', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 14, padding: '1.35rem 1.5rem' }}>
                <p style={{ margin: 0, fontSize: '1.05rem', color: '#f0fdf4', lineHeight: 1.65, fontWeight: 500 }}>
                  {currentConcept.Fact}
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONCEPT LOOP - RECALL (Flashcard) */}
          {unitStep === 'recall' && (
            <motion.div key={`step-recall-${conceptIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-panel" style={{ padding: '1.75rem 1.25rem', borderRadius: 20, background: 'rgba(20, 30, 45, 0.88)', border: '1px solid rgba(45, 212, 191, 0.15)', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              {/* Flip Canvas Card */}
              <div style={{ perspective: '1000px', minHeight: '260px', cursor: 'pointer', width: '100%' }} onClick={() => { playFlip(); setIsFlipped(!isFlipped); }}>
                <motion.div
                  style={{ width: '100%', minHeight: '260px', position: 'relative', transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Front Side */}
                  <div className="glass-panel" style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(45, 212, 191, 0.2)', borderRadius: 16, background: 'rgba(30, 41, 59, 0.35)'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.85rem' }}>
                      TAP CARD TO FLIP
                    </span>
                    <h2 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#f0fdf4', margin: 0, lineHeight: 1.5 }}>
                      {currentConcept.Flashcard?.Front || `What is a key feature of ${topicName}?`}
                    </h2>
                  </div>

                  {/* Back Side */}
                  <div className="glass-panel" style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '1.5rem', textAlign: 'center', background: 'rgba(13, 148, 136, 0.1)', border: '1px solid rgba(45, 212, 191, 0.25)', borderRadius: 16
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '0.65rem' }}>
                      KEY RECALL ANSWER
                    </span>
                    <h2 style={{ fontSize: '1.12rem', fontWeight: 700, color: '#2dd4bf', margin: 0, lineHeight: 1.5 }}>
                      {currentConcept.Flashcard?.Back || currentConcept.Fact}
                    </h2>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONCEPT LOOP - CHECK (MCQ Quiz) */}
          {unitStep === 'check' && (
            <motion.div key={`step-check-${conceptIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-panel" style={{ padding: '1.75rem 1.25rem', borderRadius: 20, background: 'rgba(20, 30, 45, 0.88)', border: '1px solid rgba(45, 212, 191, 0.15)', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '1.1rem', width: '100%' }}>
              <h3 style={{ margin: 0, fontSize: '1.12rem', color: '#f0fdf4', fontWeight: 700, lineHeight: 1.5 }}>
                {currentConcept.Quiz?.Question || `Which statement is accurate regarding ${topicName}?`}
              </h3>

              {/* Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {Object.entries(currentConcept.Quiz?.Options || {}).map(([key, label]) => {
                  const isSelected = selectedOption === key;
                  const isCorrect = key === currentConcept.Quiz?.CorrectAnswer;

                  let btnBg = 'rgba(255,255,255,0.02)';
                  let btnBorder = '1px solid rgba(255,255,255,0.05)';
                  let textColor = '#cbd5e1';

                  if (isQuizAnswered) {
                    if (isCorrect) {
                      btnBg = 'rgba(45, 212, 191, 0.15)';
                      btnBorder = '1.5px solid #2dd4bf';
                      textColor = '#2dd4bf';
                    } else if (isSelected) {
                      btnBg = 'rgba(251, 191, 36, 0.12)';
                      btnBorder = '1px solid rgba(251, 191, 36, 0.3)';
                      textColor = '#fde68a';
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
                        padding: '0.75rem 1rem',
                        borderRadius: 14,
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? 700 : 500,
                        textAlign: 'left',
                        cursor: isQuizAnswered ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem'
                      }}
                    >
                      <span style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: isQuizAnswered && isCorrect ? '#2dd4bf' : isQuizAnswered && isSelected ? '#fde68a' : 'rgba(255,255,255,0.05)',
                        color: isQuizAnswered && (isCorrect || isSelected) ? '#000' : '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        flexShrink: 0
                      }}>
                        {key}
                      </span>
                      <span style={{ flex: 1, lineHeight: 1.4 }}>{label}</span>
                      {isQuizAnswered && isCorrect && <Check size={16} color="#2dd4bf" />}
                      {isQuizAnswered && isSelected && !isCorrect && <X size={16} color="#fde68a" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Rationale Box */}
              {isQuizAnswered && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(45, 212, 191, 0.2)', borderRadius: 14, padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.68rem', color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase' }}>
                    SYLLABUS RATIONALE & EXPLANATION
                  </span>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    {currentConcept.Quiz?.Explanation || `Official Fact: ${currentConcept.Fact}`}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 4: CONNECT THE DOTS (Match Game Recap) */}
          {unitStep === 'matching_recap' && (
            <motion.div key="step-matching" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-panel" style={{ padding: '1.75rem 1.25rem', borderRadius: 20, background: 'rgba(20, 30, 45, 0.88)', border: '1px solid rgba(45, 212, 191, 0.15)', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '1.1rem', width: '100%' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#f0fdf4', fontWeight: 800 }}>
                  {topicName} Term Matching Recap
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                  Connect terms on the left to definitions on the right to synthesize all concepts into a unified mental model.
                </p>
              </div>

              <MatchGame
                isEmbedded={true}
                data={practiceMatching.length > 0 ? practiceMatching : conceptUnits.map((u, i) => ({ q: `Term ${i + 1}`, a: u.Fact.substring(0, 50) }))}
                onComplete={handleMatchingComplete}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── FIXED ACTION CONTROLS POSITIONED HIGHER ABOVE THE FOOTER (bottom: 64px) ── */}
      {showFixedControls && (
        <div style={{
          position: 'fixed',
          bottom: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 2.5rem)',
          maxWidth: '720px',
          zIndex: 95
        }}>
          {unitStep === 'recall' && isFlipped ? (
            /* When Flashcard is Flipped -> Render Smaller Rounded Pill Self-Assessment Buttons */
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '0.65rem', width: '100%' }}>
              <button
                onClick={() => handleFlashcardSelfAssess(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.25rem',
                  borderRadius: 100,
                  background: 'rgba(251, 191, 36, 0.12)',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  color: '#fde68a',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
                }}
              >
                <ThumbsDown size={16} /> I Didn't Know
              </button>

              <button
                onClick={() => handleFlashcardSelfAssess(true)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.25rem',
                  borderRadius: 100,
                  background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                  border: '1px solid rgba(45, 212, 191, 0.4)',
                  color: '#f0fdf4',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 18px rgba(13, 148, 136, 0.3)'
                }}
              >
                <ThumbsUp size={16} /> I Knew It
              </button>
            </motion.div>
          ) : (
            /* Smaller Rounded Pill Next Button */
            <button
              onClick={handleNextClick}
              style={{
                width: '100%',
                padding: '0.75rem 1.4rem',
                borderRadius: 100,
                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                color: '#f0fdf4',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                fontWeight: 800,
                fontSize: '0.92rem',
                letterSpacing: '0.02em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 18px rgba(13, 148, 136, 0.3)'
              }}
            >
              Next ➔
            </button>
          )}
        </div>
      )}

      {/* ── MINIMALIST MONOCHROME FIXED BOTTOM FOOTER TOOLBAR (bottom: 10px) ── */}
      {unitStep !== 'completed' && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '0.35rem',
          flexWrap: 'nowrap',
          padding: '0.35rem 0.85rem',
          background: 'rgba(17, 24, 39, 0.92)',
          border: '1px solid rgba(45, 212, 191, 0.15)',
          backdropFilter: 'blur(12px)',
          borderRadius: 100,
          zIndex: 90,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          width: 'fit-content'
        }}>
          <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.15rem' }}>
            Jump:
          </span>

          {navTargets?.nextTopic && (
            <button
              onClick={() => onNavigateToTarget(navTargets.nextTopic)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', padding: '0.22rem 0.5rem', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <SkipForward size={11} /> Next Topic
            </button>
          )}

          {navTargets?.nextLesson && (
            <button
              onClick={() => onNavigateToTarget(navTargets.nextLesson)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', padding: '0.22rem 0.5rem', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <FastForward size={11} /> Next Lesson
            </button>
          )}

          {navTargets?.nextUnit && (
            <button
              onClick={() => onNavigateToTarget(navTargets.nextUnit)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', padding: '0.22rem 0.5rem', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <ChevronsRight size={11} /> Next Unit
            </button>
          )}

          {navTargets?.nextChapter && (
            <button
              onClick={() => onNavigateToTarget(navTargets.nextChapter)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', padding: '0.22rem 0.5rem', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <Flag size={11} /> Next Chapter
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
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '760px',
                background: '#0f172a',
                border: '1px solid rgba(45, 212, 191, 0.25)',
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
                  <Map size={20} color="#2dd4bf" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 800 }}>
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
                    fontWeight: 800
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
                  background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                  color: '#f0fdf4',
                  border: 'none',
                  fontWeight: 700,
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
