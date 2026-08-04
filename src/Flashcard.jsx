import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function Flashcard({ data, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentCard = data[currentIndex];

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleScore = (correct) => {
    if (correct) setScore(score + 10);
    
    if (currentIndex < data.length - 1) {
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <h2>Module Complete!</h2>
        <h1 style={{ color: 'var(--primary)', fontSize: '4rem', margin: '1rem 0' }}>{score}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Total Points Earned</p>
        <button className="btn btn-primary" onClick={() => onComplete(score)}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
        <span>Card {currentIndex + 1} of {data.length}</span>
        <span>Score: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{score}</span></span>
      </div>

      <div style={{ perspective: '1000px', height: '350px', cursor: 'pointer' }} onClick={handleFlip}>
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
            borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', textAlign: 'center', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 500, lineHeight: 1.4 }}>{currentCard?.q}</h2>
          </div>

          {/* Back (Answer) */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.1), rgba(74, 222, 128, 0.1))',
            border: '1px solid var(--secondary-glow)',
            borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', textAlign: 'center', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)', gap: '1rem'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary)' }}>{currentCard?.a}</h2>
            {currentCard?.exp && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{currentCard.exp}</p>
            )}
          </div>
        </motion.div>
      </div>

      {flipped ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
