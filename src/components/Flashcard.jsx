import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';
import { playCorrect, playWrong, playComplete, playFlip } from '../hooks/useSound';

export default function Flashcard({ data, onComplete, isEmbedded = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [floatingXp, setFloatingXp] = useState(null);

  const currentCard = data[currentIndex] || {};

  const handleFlip = () => {
    playFlip();
    const willBeFlipped = !flipped;
    setFlipped(willBeFlipped);

    // If flipping to back in embedded mode, show floating XP and auto-advance
    if (willBeFlipped && isEmbedded) {
      setFloatingXp('+10 XP');
      playCorrect();
      setTimeout(() => {
        setFloatingXp(null);
        if (onComplete) onComplete(10);
      }, 1100);
    }
  };

  const handleScore = (correct) => {
    if (correct) {
      setScore(score + 10);
      playCorrect();
      setFloatingXp('+10 XP');
      setTimeout(() => setFloatingXp(null), 1000);
    } else {
      playWrong();
    }
    
    if (currentIndex < data.length - 1) {
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      playComplete();
      setCompleted(true);
      if (isEmbedded && onComplete) {
        onComplete(score + (correct ? 10 : 0));
      }
    }
  };

  if (completed && !isEmbedded) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel"
        style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}
      >
        <Sparkles size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h2>Module Complete!</h2>
        <h1 style={{ color: 'var(--primary)', fontSize: '4rem', margin: '1rem 0' }}>{score}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {score >= data.length * 8 ? '🔥 Excellent!' : score > 0 ? '💪 Good effort!' : 'Keep at it!'}
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Total Points Earned</p>
        <button className="btn btn-primary" onClick={() => onComplete(score)}>
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', position: 'relative' }}>
      
      {/* Floating XP Animation */}
      <AnimatePresence>
        {floatingXp && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            style={{
              position: 'absolute',
              top: '-10px',
              right: '20px',
              color: '#34d399',
              fontWeight: 900,
              fontSize: '1.4rem',
              zIndex: 100,
              textShadow: '0 0 12px rgba(16,185,129,0.8)'
            }}
          >
            {floatingXp}
          </motion.div>
        )}
      </AnimatePresence>

      {!isEmbedded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Card {currentIndex + 1} of {data.length}</span>
            <span>Score: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{score}</span></span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '2px' }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <div style={{ perspective: '1000px', height: '360px', cursor: 'pointer' }} onClick={handleFlip}>
        <motion.div
          style={{
            width: '100%', height: '100%', position: 'relative',
            transformStyle: 'preserve-3d'
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Front */}
          <div className="glass-panel" style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', textAlign: 'center', border: '1px solid rgba(192,132,252,0.3)'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '1rem' }}>
              TAP TO FLIP FLASHCARD
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.5 }}>
              {currentCard.q}
            </h2>
          </div>

          {/* Back */}
          <div className="glass-panel" style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', textAlign: 'center', background: 'rgba(16,185,129,0.12)', border: '1.5px solid #10b981'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '1rem' }}>
              KEY ANSWER RECALL
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399', margin: 0, lineHeight: 1.5 }}>
              {currentCard.a}
            </h2>
          </div>
        </motion.div>
      </div>

      {!isEmbedded && flipped && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" onClick={() => handleScore(false)} style={{ flex: 1, background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#f87171' }}>
            <X size={18} /> Need Review
          </button>
          <button className="btn" onClick={() => handleScore(true)} style={{ flex: 1, background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', color: '#4ade80' }}>
            <Check size={18} /> Got It (+10 XP)
          </button>
        </motion.div>
      )}
    </div>
  );
}
