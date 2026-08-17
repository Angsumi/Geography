import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Layers, Link2, HelpCircle, Trophy, Check, X, Award, AlertCircle, Sparkles, PlayCircle, SkipForward, FastForward, ChevronsRight, Flag, RotateCcw, ThumbsUp, ThumbsDown, BookMarked } from 'lucide-react';
import MatchGame from './MatchGame';
import { SectionVisualizer } from './SectionVisualizer';
import { playCorrect, playWrong, playComplete, playFlip } from '../hooks/useSound';

export function InteractiveLesson({ lessonData, onComplete, onBack, onNavigateToTarget }) {
  const chapterName = lessonData.chapterName || 'ASSAM';
  const unitName = lessonData.unitName || 'Syllabus Unit';
  const lessonName = lessonData.lessonName || 'Lesson';
  const topicName = lessonData.topicName || lessonData.title || 'Topic';

  const conceptUnits = lessonData.conceptUnits || [];
  const practiceMatching = lessonData.practiceMatching || [];
  const navTargets = lessonData.navTargets || {};

  // State
  const [unitIndex, setUnitIndex] = useState(0);
  const [unitStep, setUnitStep] = useState('fact'); // 'fact' | 'flashcard' | 'quiz' | 'matching_recap' | 'completed'
  
  // Flashcard & MCQ state
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [floatingXp, setFloatingXp] = useState(null);

  const currentUnit = conceptUnits[unitIndex] || {
    Fact: `${topicName} key syllabus concept.`,
    Flashcard: { Front: `What is a key feature of ${topicName}?`, Back: `Key geography fact.` },
    Quiz: { Question: `Which statement is accurate regarding ${topicName}?`, Options: { A: 'Option A', B: 'Option B' }, CorrectAnswer: 'A', Explanation: 'Official syllabus fact.' }
  };

  const handleNextFact = () => {
    setIsFlipped(false);
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

  const handleNextUnit = () => {
    if (unitIndex < conceptUnits.length - 1) {
      setUnitIndex(i => i + 1);
      setUnitStep('fact');
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
    setUnitIndex(0);
    setUnitStep('fact');
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
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2rem', textAlign: 'center', maxWidth: 660, margin: '1rem auto', height: '560px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Award size={56} color="#34d399" style={{ margin: '0 auto 0.75rem' }} />
          <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            TOPIC MASTERED
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0.2rem 0 0.4rem', color: '#fff' }}>
            {topicName} Mastered!
          </h1>

          {/* Student Mindset Breadcrumb Location */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 1rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#10b981', fontWeight: 900 }}>📍 {chapterName}</span>
            <span>➔</span>
            <span style={{ color: '#cbd5e1' }}>Unit: {unitName}</span>
            <span>➔</span>
            <span style={{ color: '#cbd5e1' }}>Lesson: {lessonName}</span>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 16, padding: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total XP Awarded</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#34d399', margin: '0.1rem 0' }}>
              +{earnedXp} XP
            </h2>
          </div>

          {/* ── HIGH PROMINENCE "LEARN THIS" RE-PLAY BUTTON ── */}
          <button
            onClick={handleRelearnTopic}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #10b981, #34d399, #059669)',
              color: '#000',
              border: '2px solid #6ee7b7',
              fontWeight: 900,
              fontSize: '1.05rem',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.55rem',
              boxShadow: '0 6px 24px rgba(16, 185, 129, 0.5)'
            }}
          >
            <BookMarked size={22} /> 💡 Learn This (Re-Play Topic)
          </button>
        </div>

        {/* ── Topic Completion Navigation Options ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.55rem' }}>
            {navTargets?.nextTopic && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextTopic)}
                style={{ padding: '0.7rem 0.85rem', borderRadius: 10, background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#34d399', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <PlayCircle size={15} /> Next Topic ▶
              </button>
            )}

            {navTargets?.nextLesson && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextLesson)}
                style={{ padding: '0.7rem 0.85rem', borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <FastForward size={15} /> Next Lesson ▶▶
              </button>
            )}

            {navTargets?.nextUnit && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextUnit)}
                style={{ padding: '0.7rem 0.85rem', borderRadius: 10, background: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.4)', color: '#c084fc', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <ChevronsRight size={15} /> Next Unit ⏭
              </button>
            )}

            {navTargets?.nextChapter && (
              <button
                onClick={() => onNavigateToTarget(navTargets.nextChapter)}
                style={{ padding: '0.7rem 0.85rem', borderRadius: 10, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fb923c', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <Flag size={15} /> Next Chapter 🏁
              </button>
            )}
          </div>

          <button
            onClick={() => onComplete(earnedXp)}
            style={{
              width: '100%',
              padding: '0.65rem 1.25rem',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              color: '#cbd5e1',
              border: '1px solid rgba(255,255,255,0.08)',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Return to Syllabus Directory
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
      
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

      {/* ── Student Location Breadcrumb Header ── */}
      <div className="glass-panel" style={{ padding: '0.75rem 1.15rem', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', border: '1px solid rgba(16,185,129,0.25)' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#cbd5e1',
            padding: '0.4rem 0.75rem',
            borderRadius: '10px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <ArrowLeft size={15} /> Exit
        </button>

        {/* 4-Tier Location Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, flexWrap: 'wrap' }}>
          <span style={{ color: '#10b981', fontWeight: 900 }}>📍 {chapterName}</span>
          <span>➔</span>
          <span style={{ color: '#cbd5e1' }}>Unit: {unitName}</span>
          <span>➔</span>
          <span style={{ color: '#cbd5e1' }}>Lesson: {lessonName}</span>
          <span>➔</span>
          <span style={{ color: '#34d399', fontWeight: 800 }}>Topic: {topicName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(16,185,129,0.15)', padding: '0.3rem 0.6rem', borderRadius: 10, border: '1px solid rgba(16,185,129,0.3)' }}>
          <Trophy size={14} color="#34d399" />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399' }}>{earnedXp} XP</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 700 }}>
          <span>{topicName}</span>
          <span>Concept Unit {unitIndex + 1} of {conceptUnits.length}</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 3 }}
            animate={{ width: `${((unitIndex + 1) / conceptUnits.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 3-Step Unit Phase Indicators */}
      {unitStep !== 'matching_recap' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: unitStep === 'fact' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${unitStep === 'fact' ? '#10b981' : 'rgba(255,255,255,0.08)'}`, color: unitStep === 'fact' ? '#34d399' : '#64748b', padding: '0.25rem 0.55rem', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800 }}>
            <BookOpen size={11} /> 1. Read Fact
          </div>
          <span style={{ color: '#475569', fontSize: '0.75rem' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: unitStep === 'flashcard' ? 'rgba(192,132,252,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${unitStep === 'flashcard' ? '#c084fc' : 'rgba(255,255,255,0.08)'}`, color: unitStep === 'flashcard' ? '#c084fc' : '#64748b', padding: '0.25rem 0.55rem', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800 }}>
            <Layers size={11} /> 2. Flashcard Recall
          </div>
          <span style={{ color: '#475569', fontSize: '0.75rem' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: unitStep === 'quiz' ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${unitStep === 'quiz' ? '#f43f5e' : 'rgba(255,255,255,0.08)'}`, color: unitStep === 'quiz' ? '#f43f5e' : '#64748b', padding: '0.25rem 0.55rem', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800 }}>
            <HelpCircle size={11} /> 3. Test Quiz
          </div>
        </div>
      )}

      {/* ── RIGID UNIFORM 560px OUTER PLAYER FRAME FOR ZERO BUTTON SHIFT ── */}
      <div className="glass-panel" style={{ height: '560px', maxHeight: '560px', padding: '1.5rem', borderRadius: 20, background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>

        {/* STEP 1: FACT READING CARD */}
        {unitStep === 'fact' && (
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(16,185,129,0.15)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                    CONCEPT UNIT {unitIndex + 1} OF {conceptUnits.length}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                    Fact Read Phase
                  </span>
                </div>

                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 900, lineHeight: 1.3 }}>
                  {topicName} Fact
                </h2>

                <div style={{ background: 'rgba(30,41,59,0.6)', borderLeft: '4px solid #10b981', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '0.85rem 1rem', maxHeight: '110px', overflowY: 'auto' }}>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.45, fontWeight: 500 }}>
                    {currentUnit.Fact}
                  </p>
                </div>

                {/* Rigid Visualizer Window (Height: 220px) */}
                <div style={{ height: '220px', maxHeight: '220px', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
                  <SectionVisualizer sectionName={topicName} facts={[currentUnit.Fact]} />
                </div>
              </div>

              {/* Pinned Bottom Action Button (Fixed height row) */}
              <div style={{ height: '52px', display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={handleNextFact}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    color: '#000',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  Next: Flashcard Recall <ArrowRight size={17} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* STEP 2: FLASHCARD RECALL */}
        {unitStep === 'flashcard' && (
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(192,132,252,0.15)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                    ACTIVE RECALL
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                    Flashcard Recall Phase
                  </span>
                </div>

                {/* Flip Canvas Card (Height: 330px) */}
                <div style={{ perspective: '1000px', height: '330px', cursor: 'pointer' }} onClick={() => { playFlip(); setIsFlipped(!isFlipped); }}>
                  <motion.div
                    style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Front Side */}
                    <div className="glass-panel" style={{
                      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(192,132,252,0.3)', borderRadius: 16
                    }}>
                      <span style={{ fontSize: '0.72rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '0.75rem' }}>
                        TAP CARD TO FLIP
                      </span>
                      <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.45 }}>
                        {currentUnit.Flashcard?.Front || `What is a key feature of ${topicName}?`}
                      </h2>
                    </div>

                    {/* Back Side */}
                    <div className="glass-panel" style={{
                      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '1.5rem', textAlign: 'center', background: 'rgba(16,185,129,0.12)', border: '1.5px solid #10b981', borderRadius: 16
                    }}>
                      <span style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '0.6rem' }}>
                        KEY RECALL ANSWER
                      </span>
                      <h2 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#34d399', margin: 0, lineHeight: 1.45 }}>
                        {currentUnit.Flashcard?.Back || currentUnit.Fact}
                      </h2>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Pinned Bottom Self-Assessment Action Bar (Fixed height: 52px) */}
              <div style={{ height: '52px', display: 'flex', gap: '0.65rem', alignItems: 'flex-end' }}>
                <button
                  onClick={() => handleFlashcardSelfAssess(false)}
                  style={{
                    flex: 1,
                    height: '48px',
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
                    gap: '0.35rem'
                  }}
                >
                  <ThumbsDown size={16} /> I Didn't Know
                </button>

                <button
                  onClick={() => handleFlashcardSelfAssess(true)}
                  style={{
                    flex: 1,
                    height: '48px',
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
                    gap: '0.35rem',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.35)'
                  }}
                >
                  <ThumbsUp size={16} /> I Knew It (+10 XP)
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* STEP 3: EXAM MCQ QUIZ */}
        {unitStep === 'quiz' && (
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#f43f5e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(244,63,94,0.15)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                    EXAM MCQ QUIZ
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                    Exam Quiz Phase
                  </span>
                </div>

                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 800, lineHeight: 1.35 }}>
                  {currentUnit.Quiz?.Question || `Which statement is accurate regarding ${topicName}?`}
                </h3>

                {/* Options List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                          padding: '0.65rem 0.85rem',
                          borderRadius: 10,
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 800 : 500,
                          textAlign: 'left',
                          cursor: isQuizAnswered ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem'
                        }}
                      >
                        <span style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: isQuizAnswered && isCorrect ? '#10b981' : isQuizAnswered && isSelected ? '#f43f5e' : 'rgba(255,255,255,0.06)',
                          color: isQuizAnswered && (isCorrect || isSelected) ? '#000' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          fontWeight: 800,
                          fontSize: '0.75rem'
                        }}>
                          {key}
                        </span>
                        <span style={{ flex: 1 }}>{label}</span>
                        {isQuizAnswered && isCorrect && <Check size={15} color="#34d399" />}
                        {isQuizAnswered && isSelected && !isCorrect && <X size={15} color="#f43f5e" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Rationale Box */}
                {isQuizAnswered && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
                      SYLLABUS RATIONALE & EXPLANATION
                    </span>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {currentUnit.Quiz?.Explanation || `Official Fact: ${currentUnit.Fact}`}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Pinned Bottom Action Button Bar (Fixed height: 52px) */}
              <div style={{ height: '52px', display: 'flex', alignItems: 'flex-end' }}>
                {isQuizAnswered ? (
                  <button
                    onClick={handleNextUnit}
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #10b981, #34d399)',
                      color: '#000',
                      border: 'none',
                      fontWeight: 900,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    {unitIndex < conceptUnits.length - 1 ? 'Proceed to Next Concept Unit ➔' : 'Proceed to Match the Following Recap ➔'}
                  </button>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', width: '100%', fontStyle: 'italic' }}>
                    Select an answer option above to unlock next unit
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* FINAL STEP: MATCH THE FOLLOWING RECAP */}
        {unitStep === 'matching_recap' && (
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(56,189,248,0.15)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                    FINAL RECAP GAME
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                    Match the Following
                  </span>
                </div>

                <div>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 900 }}>
                    {topicName} Term Matching Recap
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.15rem 0 0' }}>
                    Connect terms on the left to definitions on the right to master topic connections.
                  </p>
                </div>

                <div style={{ height: '360px', overflowY: 'auto' }}>
                  <MatchGame
                    isEmbedded={true}
                    data={practiceMatching.length > 0 ? practiceMatching : conceptUnits.map((u, i) => ({ q: `Term ${i + 1}`, a: u.Fact.substring(0, 50) }))}
                    onComplete={handleMatchingComplete}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

      </div>

      {/* ── Mid-Play Skip Navigation Toolbar Options Below Player ── */}
      {unitStep !== 'completed' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '0.45rem',
          flexWrap: 'wrap',
          padding: '0.65rem 1rem',
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

    </div>
  );
}
