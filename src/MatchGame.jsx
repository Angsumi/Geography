import React, { useState, useEffect } from 'react';

export default function MatchGame({ data, onComplete }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState([]);
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
      } else {
        setScore(s => Math.max(0, s - 5)); // Deduct points
      }
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  }, [selectedLeft, selectedRight]);

  if (matched.length === data.length && data.length > 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <h2>Matching Complete!</h2>
        <h1 style={{ color: 'var(--primary)', fontSize: '4rem', margin: '1rem 0' }}>{score}</h1>
        <button className="btn btn-primary" onClick={() => onComplete(score)}>Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0 }}>Match the Concepts</h3>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Score: {score}</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {leftItems.map(item => {
            const isMatched = matched.includes(item.id);
            const isSelected = selectedLeft === item.id;
            return (
              <button 
                key={item.id}
                disabled={isMatched}
                onClick={() => setSelectedLeft(item.id)}
                className={`btn ${isMatched ? 'btn-glass' : isSelected ? 'btn-primary' : 'btn-glass'}`}
                style={{ 
                  opacity: isMatched ? 0.3 : 1, 
                  borderColor: isSelected ? 'var(--primary)' : 'var(--glass-border)',
                  padding: '1.25rem 1rem', textAlign: 'left', justifyContent: 'flex-start',
                  fontSize: '0.9rem', lineHeight: '1.3'
                }}
              >
                {item.text}
              </button>
            )
          })}
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rightItems.map(item => {
            const isMatched = matched.includes(item.id);
            const isSelected = selectedRight === item.id;
            return (
              <button 
                key={item.id}
                disabled={isMatched}
                onClick={() => setSelectedRight(item.id)}
                className={`btn ${isMatched ? 'btn-glass' : isSelected ? 'btn-primary' : 'btn-glass'}`}
                style={{ 
                  opacity: isMatched ? 0.3 : 1, 
                  borderColor: isSelected ? 'var(--secondary)' : 'var(--glass-border)',
                  background: isSelected ? 'linear-gradient(135deg, var(--secondary), #4f46e5)' : '',
                  padding: '1.25rem 1rem', textAlign: 'left', justifyContent: 'flex-start',
                  fontSize: '0.9rem', lineHeight: '1.3'
                }}
              >
                {item.text}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
