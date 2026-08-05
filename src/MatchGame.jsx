import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { playCorrect, playWrong, playComplete } from './useSound';

export default function MatchGame({ data, onComplete }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrongFlash, setWrongFlash] = useState(null); // flash red on wrong match
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Generate simple pairs from the parsed MCQ data 
    // Left: The core of the question, Right: The correct answer
    const pairs = data.map((d, i) => ({
      id: i,
      left: d.q.replace(/Question:\s*|In the context of.*regarding\s*/g, '').substring(0, 60) + '...',
      right: d.a
    }));

    const left = pairs.map(p => ({ id: p.id, text: p.left }));
    const right = pairs.map(p => ({ id: p.id, text: p.right }));
    
    setLeftItems(left.sort(() => Math.random() - 0.5));
    setRightItems(right.sort(() => Math.random() - 0.5));
  }, [data]);

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        setMatched(prev => [...prev, selectedLeft]);
        setScore(s => s + 10);
        playCorrect();
      } else {
        setScore(s => Math.max(0, s - 5)); // Deduct points
        setWrongFlash({ left: selectedLeft, right: selectedRight });
        playWrong();
        setTimeout(() => setWrongFlash(null), 600);
      }
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  }, [selectedLeft, selectedRight]);

  // Check if all matched
  useEffect(() => {
    if (matched.length === data.length && data.length > 0) {
      playComplete();
    }
  }, [matched, data.length]);

  if (matched.length === data.length && data.length > 0) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel"
        style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}
      >
        <Sparkles size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h2>Matching Complete!</h2>
        <h1 style={{ color: 'var(--primary)', fontSize: '4rem', margin: '1rem 0' }}>{score}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {score >= data.length * 8 ? '🔥 Perfect matching!' : score > 0 ? '💪 Well done!' : 'Practice makes perfect!'}
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Total Points Earned</p>
        <button className="btn btn-primary" onClick={() => onComplete(score)}>Return to Dashboard</button>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Match the Concepts</h3>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Score: {score}</span>
      </div>

      {/* Progress */}
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--secondary), var(--primary))', borderRadius: '2px' }}
          animate={{ width: `${(matched.length / data.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="match-columns" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {leftItems.map(item => {
            const isMatched = matched.includes(item.id);
            const isSelected = selectedLeft === item.id;
            const isWrong = wrongFlash && wrongFlash.left === item.id;
            return (
              <motion.button 
                key={item.id}
                disabled={isMatched}
                onClick={() => setSelectedLeft(item.id)}
                className={`btn ${isMatched ? 'btn-glass' : isSelected ? 'btn-primary' : 'btn-glass'}`}
                animate={isWrong ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                style={{ 
                  opacity: isMatched ? 0.3 : 1, 
                  borderColor: isWrong ? 'var(--danger)' : isSelected ? 'var(--primary)' : 'var(--glass-border)',
                  padding: '1.25rem 1rem', textAlign: 'left', justifyContent: 'flex-start',
                  fontSize: '0.9rem', lineHeight: '1.3',
                  transition: 'opacity 0.3s, border-color 0.3s',
                }}
              >
                {item.text}
              </motion.button>
            )
          })}
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {rightItems.map(item => {
            const isMatched = matched.includes(item.id);
            const isSelected = selectedRight === item.id;
            const isWrong = wrongFlash && wrongFlash.right === item.id;
            return (
              <motion.button 
                key={item.id}
                disabled={isMatched}
                onClick={() => setSelectedRight(item.id)}
                className={`btn ${isMatched ? 'btn-glass' : isSelected ? 'btn-primary' : 'btn-glass'}`}
                animate={isWrong ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                style={{ 
                  opacity: isMatched ? 0.3 : 1, 
                  borderColor: isWrong ? 'var(--danger)' : isSelected ? 'var(--secondary)' : 'var(--glass-border)',
                  background: isSelected ? 'linear-gradient(135deg, var(--secondary), #4f46e5)' : '',
                  padding: '1.25rem 1rem', textAlign: 'left', justifyContent: 'flex-start',
                  fontSize: '0.9rem', lineHeight: '1.3',
                  transition: 'opacity 0.3s, border-color 0.3s, background 0.3s',
                }}
              >
                {item.text}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
