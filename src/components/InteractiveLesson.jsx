import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Layers, Link2, HelpCircle, Trophy, Check, X, Award, AlertCircle, Sparkles } from 'lucide-react';
import Flashcard from './Flashcard';
import MatchGame from './MatchGame';
import { SectionVisualizer } from './SectionVisualizer';
import { playCorrect, playWrong, playComplete } from '../hooks/useSound';

export function InteractiveLesson({ lessonData, onComplete, onBack }) {
  const subtopicName = lessonData.title || lessonData.subtopicName || 'Lesson';
  const topicName = lessonData.topicName || 'Geography';
  const conceptUnits = lessonData.conceptUnits || [];
  const practiceMatching = lessonData.practiceMatching || [];

  // State
  const [unitIndex, setUnitIndex] = useState(0);
  const [unitStep, setUnitStep] = useState('fact'); // 'fact' | 'flashcard' | 'quiz' | 'matching_recap' | 'completed'
  
  // MCQ state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const currentUnit = conceptUnits[unitIndex] || {
    Fact: `${subtopicName} key syllabus concept.`,
    Flashcard: { Front: `What is a key feature of ${subtopicName}?`, Back: `Key geography topic.` },
    Quiz: { Question: `Which statement is accurate regarding ${subtopicName}?`, Options: { A: 'Option A', B: 'Option B' }, CorrectAnswer: 'A', Explanation: 'Official syllabus fact.' }
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
      // Completed all concept units -> Go to Match the Following recap
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
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: 600, margin: '1rem auto' }}>
        <Award size={64} color="#34d399" style={{ margin: '0 auto 1rem' }} />
        <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          CONNECTED LESSON MASTERED
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.3rem 0 1rem', color: '#fff' }}>
          {subtopicName} Mastered!
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 1.5rem' }}>
          You completed all {conceptUnits.length} concept units (Fact → Flashcard → Quiz) and mastered the term-matching recap game!
        </p>
        <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 16, padding: '1.25rem', marginBottom: '1.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total XP Awarded</span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#34d399', margin: '0.2rem 0' }}>
            +{earnedXp} XP
          </h2>
        </div>
        <button
          onClick={() => onComplete(earnedXp)}
          style={{
            width: '100%',
            padding: '0.85rem 1.5rem',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            color: '#000',
            border: 'none',
            fontWeight: 900,
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          Return to Learning Hub
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Header & Concept Unit Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
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
          <ArrowLeft size={16} /> Exit Lesson
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: 380 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 700 }}>
            <span>{subtopicName}</span>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(16,185,129,0.15)', padding: '0.35rem 0.65rem', borderRadius: 12, border: '1px solid rgba(16,185,129,0.3)' }}>
          <Trophy size={14} color="#34d399" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399' }}>{earnedXp} XP</span>
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
              {subtopicName} Syllabus Fact
            </h2>

            <div style={{ background: 'rgba(30,41,59,0.6)', borderLeft: '4px solid #10b981', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem' }}>
              <p style={{ margin: 0, fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.6, fontWeight: 500 }}>
                {currentUnit.Fact}
              </p>
            </div>

            {/* Visualizer for every concept unit */}
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <SectionVisualizer sectionName={subtopicName} facts={[currentUnit.Fact]} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={handleNextFact}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  border: 'none',
                  color: '#000',
                  padding: '0.7rem 1.35rem',
                  borderRadius: 12,
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.35)'
                }}
              >
                <span>Test Flashcard Recall</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* STEP 2: FLASHCARD RECALL */}
      {unitStep === 'flashcard' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '1.75rem', borderRadius: 20 }}>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '0.25rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800 }}>
              UNIT {unitIndex + 1} FLASHCARD RECALL
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tap card to flip</span>
          </div>
          <Flashcard
            data={[{
              q: currentUnit.Flashcard?.Front || `What is a key feature of this concept?`,
              a: currentUnit.Flashcard?.Back || currentUnit.Fact,
              img: currentUnit.Flashcard?.Image || null,
              exp: `Concept Unit ${unitIndex + 1}`
            }]}
            onComplete={handleFlashcardDone}
          />
        </motion.div>
      )}

      {/* STEP 3: QUIZ QUESTION */}
      {unitStep === 'quiz' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '1.75rem', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '0.25rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800 }}>
              UNIT {unitIndex + 1} EXAM QUIZ
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Select the correct answer</span>
          </div>

          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', lineHeight: 1.5, fontWeight: 700 }}>
            {currentUnit.Quiz?.Question || `Which of the following is accurate regarding this concept?`}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {Object.entries(currentUnit.Quiz?.Options || {}).map(([optKey, optText]) => {
              const isSelected = selectedOption === optKey;
              const isCorrectOpt = optKey === currentUnit.Quiz?.CorrectAnswer;

              let btnBg = 'rgba(255, 255, 255, 0.03)';
              let btnBorder = 'rgba(255, 255, 255, 0.08)';
              let textColor = '#f8fafc';

              if (isQuizAnswered) {
                if (isCorrectOpt) {
                  btnBg = 'rgba(16, 185, 129, 0.15)';
                  btnBorder = '#10b981';
                  textColor = '#34d399';
                } else if (isSelected) {
                  btnBg = 'rgba(244, 63, 94, 0.15)';
                  btnBorder = '#f43f5e';
                  textColor = '#f43f5e';
                }
              }

              return (
                <button
                  key={optKey}
                  disabled={isQuizAnswered}
                  onClick={() => handleQuizOptionSelect(optKey)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '14px',
                    background: btnBg,
                    border: `1.5px solid ${btnBorder}`,
                    color: textColor,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    cursor: isQuizAnswered ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: isQuizAnswered && isCorrectOpt ? '#10b981' : isQuizAnswered && isSelected ? '#f43f5e' : 'rgba(255,255,255,0.1)',
                    color: isQuizAnswered && (isCorrectOpt || isSelected) ? '#000' : '#fff',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    flexShrink: 0
                  }}>
                    {isQuizAnswered && isCorrectOpt ? <Check size={16} /> : isQuizAnswered && isSelected ? <X size={16} /> : optKey}
                  </div>
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{optText}</span>
                </button>
              );
            })}
          </div>

          {isQuizAnswered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: selectedOption === currentUnit.Quiz?.CorrectAnswer ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)', border: `1px solid ${selectedOption === currentUnit.Quiz?.CorrectAnswer ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`, borderRadius: 14, padding: '1rem', fontSize: '0.88rem', color: '#e2e8f0' }}>
              <div style={{ fontWeight: 800, color: selectedOption === currentUnit.Quiz?.CorrectAnswer ? '#34d399' : '#f43f5e', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {selectedOption === currentUnit.Quiz?.CorrectAnswer ? <Check size={16} /> : <AlertCircle size={16} />}
                <span>{selectedOption === currentUnit.Quiz?.CorrectAnswer ? 'Correct Answer!' : 'Explanation'}</span>
              </div>
              <div>{currentUnit.Quiz?.Explanation || 'Official syllabus fact.'}</div>
            </motion.div>
          )}

          {isQuizAnswered && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={handleNextUnit}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  border: 'none',
                  color: '#000',
                  padding: '0.75rem 1.35rem',
                  borderRadius: 12,
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.35)'
                }}
              >
                <span>{unitIndex === conceptUnits.length - 1 ? 'Start Match the Following Recap' : 'Next Concept Unit'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* RECAP PHASE: MATCH THE FOLLOWING */}
      {unitStep === 'matching_recap' && (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 20 }}>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.25rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800 }}>
              FINAL RECAP GAME
            </span>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem', fontWeight: 900 }}>
              Match the Following Recap ({practiceMatching.length} Pairs)
            </h3>
          </div>
          <MatchGame data={practiceMatching} onComplete={handleMatchingComplete} />
        </div>
      )}

    </div>
  );
}
