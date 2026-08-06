import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { playCorrect, playWrong, playComplete, playPickup, playDrop } from '../hooks/useSound';

export default function MatchGame({ data, onComplete }) {
  // Subset of data items (Questions)
  const [questions, setQuestions] = useState([]);
  // Shuffled definitions (Answers)
  const [answers, setAnswers] = useState([]);

  // Selections & Connections
  // selectedQuestionIndex: index of currently active question item clicked (left column)
  const [selectedQ, setSelectedQ] = useState(null);
  // connections: mapping of questionIndex -> answerIndex
  const [connections, setConnections] = useState({});

  // Container refs for drawing dynamic SVG thread lines
  const containerRef = useRef(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const [lineCoords, setLineCoords] = useState([]);

  useEffect(() => {
    // Take up to 5 items for matching
    const subset = data.slice(0, 5);
    setQuestions(subset);

    const answerList = subset.map((item, originalIndex) => ({
      id: `ans-${originalIndex}`,
      text: item.a,
      matchIndex: originalIndex
    }));

    // Shuffle right column answers
    setAnswers([...answerList].sort(() => Math.random() - 0.5));
    setSelectedQ(null);
    setConnections({});
  }, [data]);

  // Update line coordinates whenever connections, selected item, or window resizes
  const calculateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newCoords = [];

    Object.entries(connections).forEach(([qIdxStr, aIdx]) => {
      const qIdx = parseInt(qIdxStr, 10);
      const leftEl = leftRefs.current[qIdx];
      const rightEl = rightRefs.current[aIdx];

      if (leftEl && rightEl) {
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        const x1 = leftRect.right - containerRect.left;
        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
        const x2 = rightRect.left - containerRect.left;
        const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

        const isCorrect = answers[aIdx]?.matchIndex === qIdx;

        newCoords.push({
          qIdx,
          aIdx,
          x1,
          y1,
          x2,
          y2,
          isCorrect
        });
      }
    });

    setLineCoords(newCoords);
  };

  useEffect(() => {
    calculateLines();
    window.addEventListener('resize', calculateLines);
    return () => window.removeEventListener('resize', calculateLines);
  }, [connections, questions, answers]);

  // Handle clicking a Question (Left column)
  const handleSelectQuestion = (qIdx) => {
    playPickup();
    if (selectedQ === qIdx) {
      setSelectedQ(null); // toggle off selection
    } else {
      setSelectedQ(qIdx);
    }
  };

  // Handle clicking an Answer (Right column)
  const handleSelectAnswer = (aIdx) => {
    playDrop();
    if (selectedQ !== null) {
      // Connect selected Question to this Answer
      setConnections(prev => {
        const next = { ...prev };
        // If this answer was connected elsewhere, break that connection
        Object.keys(next).forEach(key => {
          if (next[key] === aIdx) {
            delete next[key];
          }
        });
        next[selectedQ] = aIdx;
        return next;
      });
      setSelectedQ(null); // Clear selection after connecting
    } else {
      // If user clicked answer first, see if an un-connected left item exists or remove existing connection
      const existingQKey = Object.keys(connections).find(qKey => connections[qKey] === aIdx);
      if (existingQKey !== undefined) {
        // Disconnect on click if already connected
        setConnections(prev => {
          const next = { ...prev };
          delete next[existingQKey];
          return next;
        });
      }
    }
  };

  // Derive scores and status
  let correctCount = 0;
  let filledCount = Object.keys(connections).length;

  Object.entries(connections).forEach(([qIdxStr, aIdx]) => {
    const qIdx = parseInt(qIdxStr, 10);
    if (answers[aIdx]?.matchIndex === qIdx) {
      correctCount++;
    }
  });

  const allSlotsFilled = filledCount === questions.length && questions.length > 0;
  const allCorrect = allSlotsFilled && correctCount === questions.length;
  const anyFilled = filledCount > 0;
  const earnedScore = correctCount * 10;

  useEffect(() => {
    if (allCorrect) {
      playCorrect();
      setTimeout(() => {
        playComplete();
      }, 500);
    }
  }, [allCorrect]);

  const handleReset = () => {
    const subset = data.slice(0, 5);
    setQuestions(subset);
    const answerList = subset.map((item, originalIndex) => ({
      id: `ans-${originalIndex}`,
      text: item.a,
      matchIndex: originalIndex
    }));
    setAnswers([...answerList].sort(() => Math.random() - 0.5));
    setSelectedQ(null);
    setConnections({});
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0 }}>Matching Concepts</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Select a term on the left, then click its matching definition on the right to connect them with a thread.
          </span>
        </div>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Earned: {earnedScore} pts</span>
      </div>

      {/* Prominent top status feedback */}
      {anyFilled && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          background: allCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(15, 17, 26, 0.6)',
          border: allCorrect ? '1px solid #22c55e' : '1px solid var(--glass-border)',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div>
            <h4 style={{ margin: 0, color: allCorrect ? '#22c55e' : 'var(--text-main)', fontSize: '1rem' }}>
              {allCorrect ? '🎉 Perfect Match!' : 'Connect matching pairs with threads.'}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
              {correctCount} out of {questions.length} correct matching pairs.
            </span>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.75rem', borderRadius: '8px' }}>
            Marks: {earnedScore} / {questions.length * 10}
          </span>
        </div>
      )}

      {/* Matching Container with SVG Overlay */}
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem', 
          marginTop: '1rem',
          minHeight: '350px'
        }}
      >
        {/* SVG overlay for drawing thread lines */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          <defs>
            <linearGradient id="correctGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="incorrectGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {lineCoords.map((line, idx) => {
            const dx = (line.x2 - line.x1) * 0.45;
            // Curved Bezier path for organic thread connection look
            const pathData = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;

            return (
              <g key={idx}>
                {/* Glow thread */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={line.isCorrect ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                {/* Main line thread */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={line.isCorrect ? 'url(#correctGradient)' : 'url(#incorrectGradient)'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={line.isCorrect ? 'none' : '6 4'}
                />
                {/* Endpoint dots */}
                <circle cx={line.x1} cy={line.y1} r="5" fill={line.isCorrect ? '#22c55e' : '#ef4444'} />
                <circle cx={line.x2} cy={line.y2} r="5" fill={line.isCorrect ? '#22c55e' : '#ef4444'} />
              </g>
            );
          })}
        </svg>

        {/* Left Column: Terms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 1 }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Geographical Terms
          </h4>
          {questions.map((qItem, qIdx) => {
            const isSelected = selectedQ === qIdx;
            const connectedAIdx = connections[qIdx];
            const isConnected = connectedAIdx !== undefined;
            const isCorrect = isConnected ? answers[connectedAIdx]?.matchIndex === qIdx : false;

            return (
              <div
                key={qIdx}
                ref={el => leftRefs.current[qIdx] = el}
                onClick={() => handleSelectQuestion(qIdx)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(79, 70, 229, 0.25))'
                    : isConnected
                      ? isCorrect ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)'
                      : 'var(--glass-bg)',
                  border: isSelected
                    ? '2px solid var(--secondary)'
                    : isConnected
                      ? isCorrect ? '2px solid #22c55e' : '2px solid #ef4444'
                      : '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '65px',
                  boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
              >
                <span>{qItem.q}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isConnected && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isCorrect ? '#4ade80' : '#f87171' }}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--secondary)' : isConnected ? (isCorrect ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    boxShadow: isSelected ? '0 0 8px var(--secondary)' : 'none'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Definitions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 1 }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Definitions
          </h4>
          {answers.map((aItem, aIdx) => {
            // Find if any question is connected to this answer
            const connectedQStr = Object.keys(connections).find(qKey => connections[qKey] === aIdx);
            const connectedQIdx = connectedQStr !== undefined ? parseInt(connectedQStr, 10) : null;
            const isConnected = connectedQIdx !== null;
            const isCorrect = isConnected ? aItem.matchIndex === connectedQIdx : false;

            return (
              <div
                key={aIdx}
                ref={el => rightRefs.current[aIdx] = el}
                onClick={() => handleSelectAnswer(aIdx)}
                style={{
                  padding: '0.85rem 1.1rem',
                  borderRadius: '12px',
                  background: isConnected
                    ? isCorrect ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)'
                    : selectedQ !== null
                      ? 'rgba(255,255,255,0.06)'
                      : 'var(--glass-bg)',
                  border: isConnected
                    ? isCorrect ? '2px solid #22c55e' : '2px solid #ef4444'
                    : selectedQ !== null
                      ? '1px dashed var(--secondary)'
                      : '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  minHeight: '65px',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: isConnected ? (isCorrect ? '#22c55e' : '#ef4444') : selectedQ !== null ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)'
                }} />
                <span style={{ flex: 1 }}>{aItem.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
        {allCorrect && (
          <button 
            onClick={() => onComplete(earnedScore)}
            className="btn btn-primary" 
            style={{ padding: '0.85rem 1.5rem', background: 'linear-gradient(135deg, #22c55e, #10b981)', color: '#fff', fontWeight: 'bold' }}
          >
            🎉 Claim +{earnedScore} Points & Return
          </button>
        )}
        
        <button 
          onClick={handleReset}
          className="btn btn-glass"
          style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          title="Reset Connections"
        >
          <RefreshCw size={16} /> Reset Connections
        </button>
      </div>
    </div>
  );
}

