import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';
import { playCorrect, playWrong, playComplete, playFlip } from '../hooks/useSound';

export default function Flashcard({ data, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentCard = data[currentIndex];

  const handleFlip = () => {
    playFlip();
    setFlipped(!flipped);
  };

  const handleScore = (correct) => {
    if (correct) {
      setScore(score + 10);
      playCorrect();
    } else {
      playWrong();
    }
    
    if (currentIndex < data.length - 1) {
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      playComplete();
      setCompleted(true);
    }
  };

  if (completed) {
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
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Progress bar */}
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

      <div style={{ perspective: '1000px', height: '400px', cursor: 'pointer' }} onClick={handleFlip}>
        <motion.div
          style={{
            width: '100%', height: '100%', position: 'relative',
            transformStyle: 'preserve-3d'
          }}
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Front (Question) */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden',
            background: 'var(--glass-bg)', border: '1px solid var(--primary-glow)',
            borderRadius: '20px', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)'
          }}>
            {currentCard?.img && (
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={currentCard.img} 
                  alt={currentCard.q} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(15, 17, 26, 0.8))' }} />
              </div>
            )}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{currentCard?.q}</h2>
            </div>
          </div>

          {/* Back (Answer) */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.1), rgba(74, 222, 128, 0.1))',
            border: '1px solid var(--secondary-glow)',
            borderRadius: '20px', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)'
          }}>
            {currentCard?.img && (
              <div style={{ width: '100%', height: '140px', overflow: 'hidden', opacity: 0.7 }}>
                <img 
                  src={currentCard.img} 
                  alt="Answer hint" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{currentCard?.a}</h2>
              {currentCard?.exp && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, maxHeight: '100px', overflowY: 'auto' }}>{currentCard.exp}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {flipped ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flashcard-actions"
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          <button className="btn btn-glass" onClick={(e) => { e.stopPropagation(); handleScore(false); }} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
            <X size={20} /> I missed it
          </button>
          <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleScore(true); }}>
            <Check size={20} /> I knew it (+10)
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', height: '48px', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click card to flip</p>
        </div>
      )}
    </div>
  );
}
