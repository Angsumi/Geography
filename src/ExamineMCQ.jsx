import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Award, HelpCircle } from 'lucide-react';
import { playCorrect, playWrong, playComplete } from './useSound';

export default function ExamineMCQ({ data, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // 'A', 'B', 'C', 'D'
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = data[currentIndex];

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(s => s + 15);
      setCorrectCount(c => c + 1);
      playCorrect();
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      playComplete();
      setCompleted(true);
    }
  };

  if (completed) {
    const percentage = Math.round((correctCount / data.length) * 100);
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel"
        style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}
      >
        <Award size={64} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.9 }} />
        <h2>Exam Completed!</h2>
        <div style={{ margin: '1.5rem 0' }}>
          <h1 style={{ color: 'var(--primary)', fontSize: '3.5rem', margin: 0 }}>{score} pts</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Score: <strong>{correctCount} / {data.length}</strong> Correct ({percentage}%)
          </p>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {percentage >= 80 ? '👑 Excellent! You mastered this topic!' : percentage >= 50 ? '👍 Good job! Keep practicing.' : '📚 Review the concepts and try again.'}
        </p>
        <button className="btn btn-primary" onClick={() => onComplete(score)}>
          Return to Hub
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top bar info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={18} color="var(--secondary)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Question {currentIndex + 1} of {data.length}</span>
        </div>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Score: {score}</span>
      </div>

      {/* Progress */}
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--secondary), var(--primary))', borderRadius: '2px' }}
          animate={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative', border: '1px solid var(--glass-border)' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '1.5rem', fontWeight: 500 }}>
          {currentQuestion?.question}
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {['A', 'B', 'C', 'D'].map(opt => {
            const optText = currentQuestion?.options[opt];
            if (!optText) return null;

            const isSelected = selectedOption === opt;
            const isCorrectOption = opt === currentQuestion?.correctAnswer;
            
            let btnStyle = {
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: 'var(--text-main)'
            };

            if (isAnswered) {
              if (isCorrectOption) {
                // Correct option gets highlighted green
                btnStyle = {
                  border: '1px solid var(--primary)',
                  background: 'rgba(74, 222, 128, 0.1)',
                  color: 'var(--primary)'
                };
              } else if (isSelected) {
                // Wrong clicked option gets highlighted red
                btnStyle = {
                  border: '1px solid var(--danger)',
                  background: 'rgba(248, 113, 113, 0.1)',
                  color: 'var(--danger)'
                };
              } else {
                btnStyle.opacity = 0.5;
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleOptionClick(opt)}
                className="btn"
                style={{
                  ...btnStyle,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  width: '100%',
                  fontSize: '0.95rem',
                  lineHeight: '1.4',
                  cursor: isAnswered ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isAnswered && isCorrectOption ? 'var(--primary)' : isAnswered && isSelected ? 'var(--danger)' : 'rgba(255,255,255,0.08)',
                  color: isAnswered && (isCorrectOption || isSelected) ? '#000' : 'var(--text-main)',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  {isAnswered && isCorrectOption ? <Check size={14} /> : isAnswered && isSelected ? <X size={14} /> : opt}
                </div>
                <span>{optText}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation / Next Button */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Explanation</p>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4, color: 'var(--text-main)' }}>
                  {currentQuestion?.explanation || 'No explanation details available.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleNext}>
                  {currentIndex === data.length - 1 ? 'Finish Exam' : 'Next Question'} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
