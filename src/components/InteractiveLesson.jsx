import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Layers, Link2, HelpCircle, Trophy, Check, X, Award, AlertCircle, Sparkles, PlayCircle } from 'lucide-react';
import Flashcard from './Flashcard';
import MatchGame from './MatchGame';
import { SectionVisualizer } from './SectionVisualizer';
import { playCorrect, playWrong, playComplete } from '../hooks/useSound';

export function InteractiveLesson({ lessonData, onComplete, onBack, onStartNextTopic }) {
  const chapterName = lessonData.chapterName || 'ASSAM';
  const unitName = lessonData.unitName || 'Syllabus Unit';
  const lessonName = lessonData.lessonName || 'Lesson';
  const topicName = lessonData.topicName || lessonData.title || 'Topic';

  const conceptUnits = lessonData.conceptUnits || [];
  const practiceMatching = lessonData.practiceMatching || [];
  const nextTopicInfo = lessonData.nextTopicInfo;

  // State
  const [unitIndex, setUnitIndex] = useState(0);
  const [unitStep, setUnitStep] = useState('fact'); // 'fact' | 'flashcard' | 'quiz' | 'matching_recap' | 'completed'
  
  // MCQ state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const currentUnit = conceptUnits[unitIndex] || {
    Fact: `${topicName} key syllabus concept.`,
    Flashcard: { Front: `What is a key feature of ${topicName}?`, Back: `Key geography fact.` },
    Quiz: { Question: `Which statement is accurate regarding ${topicName}?`, Options: { A: 'Option A', B: 'Option B' }, CorrectAnswer: 'A', Explanation: 'Official syllabus fact.' }
  };

  const handleNextFact = () => {
    setUnitStep('flashcard');
  };

  const handleFlashcardDone = () => {
    setSelectedOption(null);
    setIsQuizAnswered(false);
    setUnitStep('quiz');
  };

  const handleQuizOptionSelect = (optKey) => {
    if (isQuizAnswered) return;
    setSelectedOption(optKey);
    setIsQuizAnswered(true);

    if (optKey === currentUnit.Quiz.CorrectAnswer) {
      setEarnedXp(x => x + 15);
      playCorrect();
    } else {
      playWrong();
    }
  };

  const handleNextUnit = () => {
    if (unitIndex < conceptUnits.length - 1) {
      setUnitIndex(i => i + 1);
      setUnitStep('fact');
      setSelectedOption(null);
      setIsQuizAnswered(false);
    } else {
      setEarnedXp(x => x + 25);
      playCorrect();
      setUnitStep('matching_recap');
    }
  };

  const handleMatchingComplete = (pts) => {
    setEarnedXp(x => x + (pts || 25));
    playComplete();
    setUnitStep('completed');
  };

  if (unitStep === 'completed') {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: 620, margin: '1rem auto' }}>
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

        <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: '0 0 1.5rem' }}>
          You completed all {conceptUnits.length} concept units (Fact → Flashcard → Quiz) and mastered the term-matching recap game!
        </p>

        <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 16, padding: '1.25rem', marginBottom: '1.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total XP Awarded</span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#34d399', margin: '0.2rem 0' }}>
            +{earnedXp} XP
          </h2>
        </div>

        {/* Automatic Flow to Next Topic */}
        {nextTopicInfo && onStartNextTopic ? (
          <button
            onClick={() => onStartNextTopic(nextTopicInfo)}
            style={{
              width: '100%',
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
              boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
              marginBottom: '0.75rem'
            }}
          >
            <PlayCircle size={18} /> Automatic Flow: Proceed to Next Topic ▶
          </button>
        ) : null}

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
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Student Mindset Breadcrumb Location Header ── */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', border: '1px solid rgba(16,185,129,0.25)' }}>
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

        {/* 4-Tier Student Location Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, flexWrap: 'wrap' }}>
          <span style={{ color: '#10b981', fontWeight: 900 }}>📍 {chapterName}</span>
          <span>➔</span>
          <span style={{ color: '#cbd5e1' }}>Unit: {unitName}</span>
          <span>➔</span>
          <span style={{ color: '#cbd5e1' }}>Lesson: {lessonName}</span>
          <span>➔</span>
          <span style={{ color: '#34d399', fontWeight: 800 }}>Topic: {topicName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(16,185,129,0.15)', padding: '0.35rem 0.65rem', borderRadius: 12, border: '1px solid rgba(16,185,129,0.3)' }}>
          <Trophy size={14} color="#34d399" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399' }}>{earnedXp} XP</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 700 }}>
          <span>{topicName}</span>
          <span>Concept Unit {unitIndex + 1} of {conceptUnits.length}</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 3 }}
            animate={{ width: `${((unitIndex + 1) / conceptUnits.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 3-Step Unit Phase Indicators */}
      {unitStep !== 'matching_recap' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: unitStep === 'fact' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${unitStep === 'fact' ? '#10b981' : 'rgba(255,255,255,0.08)'}`, color: unitStep === 'fact' ? '#34d399' : '#64748b', padding: '0.3rem 0.65rem', borderRadius: 10, fontSize: '0.72rem', fontWeight: 800 }}>
            <BookOpen size={12} /> 1. Read Fact
          </div>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: unitStep === 'flashcard' ? 'rgba(192,132,252,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${unitStep === 'flashcard' ? '#c084fc' : 'rgba(255,255,255,0.08)'}`, color: unitStep === 'flashcard' ? '#c084fc' : '#64748b', padding: '0.3rem 0.65rem', borderRadius: 10, fontSize: '0.72rem', fontWeight: 800 }}>
            <Layers size={12} /> 2. Flashcard Recall
          </div>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: unitStep === 'quiz' ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${unitStep === 'quiz' ? '#f43f5e' : 'rgba(255,255,255,0.08)'}`, color: unitStep === 'quiz' ? '#f43f5e' : '#64748b', padding: '0.3rem 0.65rem', borderRadius: 10, fontSize: '0.72rem', fontWeight: 800 }}>
            <HelpCircle size={12} /> 3. Test Quiz
          </div>
        </div>
      )}

      {/* STEP 1: FACT READING CARD */}
      {unitStep === 'fact' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(16,185,129,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                CONCEPT UNIT {unitIndex + 1} OF {conceptUnits.length}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Fact Read Phase
              </span>
            </div>

            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: 900, lineHeight: 1.4 }}>
              {topicName} Fact
            </h2>

            <div style={{ background: 'rgba(30,41,59,0.6)', borderLeft: '4px solid #10b981', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem' }}>
              <p style={{ margin: 0, fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.6, fontWeight: 500 }}>
                {currentUnit.Fact}
              </p>
            </div>

            {/* Visualizer for concept unit */}
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <SectionVisualizer sectionName={topicName} facts={[currentUnit.Fact]} />
            </div>

            <button
              onClick={handleNextFact}
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
              Continue to Flashcard Recall <ArrowRight size={18} />
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* STEP 2: FLASHCARD RECALL */}
      {unitStep === 'flashcard' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(192,132,252,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(192,132,252,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                ACTIVE RECALL
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Flashcard Recall Phase
              </span>
            </div>

            <Flashcard
              data={[{
                q: currentUnit.Flashcard?.Front || `What is a key feature of ${topicName}?`,
                a: currentUnit.Flashcard?.Back || currentUnit.Fact,
                img: currentUnit.Flashcard?.Image || null,
                exp: `Topic: ${topicName}`
              }]}
              onComplete={handleFlashcardDone}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* STEP 3: EXAM MCQ QUIZ */}
      {unitStep === 'quiz' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="glass-panel" style={{ padding: '2rem', borderRadius: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(244,63,94,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(244,63,94,0.15)', padding: '0.25rem 0.65rem', borderRadius: 8 }}>
                EXAM MCQ QUIZ
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Exam Quiz Phase
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

            {isQuizAnswered && (
              <button
                onClick={handleNextUnit}
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
                {unitIndex < conceptUnits.length - 1 ? 'Proceed to Next Concept Unit' : 'Proceed to Match the Following Recap'} <ArrowRight size={18} />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* FINAL STEP: MATCH THE FOLLOWING RECAP */}
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
              data={practiceMatching.length > 0 ? practiceMatching : conceptUnits.map((u, i) => ({ q: `Term ${i + 1}`, a: u.Fact.substring(0, 50) }))}
              onComplete={handleMatchingComplete}
            />
          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}
