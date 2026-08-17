import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { playCorrect, playWrong, playComplete, playPickup, playDrop } from '../hooks/useSound';

export default function MatchGame({ data = [], onComplete, isEmbedded = false }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [selectedQ, setSelectedQ] = useState(null);
  const [connections, setConnections] = useState({});
  const [floatingXp, setFloatingXp] = useState(null);

  const containerRef = useRef(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const [lineCoords, setLineCoords] = useState([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const rawData = Array.isArray(data) ? data : [];
    const normalized = rawData.map(item => ({
      q: item.q || item.Term || item.term || 'Term',
      a: item.a || item.Definition || item.definition || 'Definition'
    }));

    const subset = normalized.slice(0, 5);
    setQuestions(subset);

    const answerList = subset.map((item, originalIndex) => ({
      id: `ans-${originalIndex}`,
      text: item.a,
      matchIndex: originalIndex
    }));

    setAnswers([...answerList].sort(() => Math.random() - 0.5));
    setSelectedQ(null);
    setConnections({});
  }, [data]);

  const calculateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    setContainerDimensions({ width: containerRect.width, height: containerRect.height });

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
        newCoords.push({ x1, y1, x2, y2, isCorrect });
      }
    });

    setLineCoords(newCoords);
  };

  useEffect(() => {
    calculateLines();
    const handleResizeOrScroll = () => calculateLines();

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    let resizeObserver = null;
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => calculateLines());
      resizeObserver.observe(containerRef.current);
    }

    // Delayed recalculation for animation frames
    const timer = setTimeout(calculateLines, 100);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
      if (resizeObserver) resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [connections, questions, answers]);

  const handleSelectQuestion = (qIdx) => {
    playPickup();
    if (selectedQ === qIdx) {
      setSelectedQ(null);
    } else {
      setSelectedQ(qIdx);
    }
  };

  const handleSelectAnswer = (aIdx) => {
    playDrop();
    if (selectedQ !== null) {
      setConnections(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (next[key] === aIdx) {
            delete next[key];
          }
        });
        next[selectedQ] = aIdx;
        return next;
      });
      setSelectedQ(null);
    } else {
      const existingQKey = Object.keys(connections).find(qKey => connections[qKey] === aIdx);
      if (existingQKey !== undefined) {
        setConnections(prev => {
          const next = { ...prev };
          delete next[existingQKey];
          return next;
        });
      }
    }
  };

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

  useEffect(() => {
    if (allCorrect) {
      playComplete();
      setFloatingXp('+25 XP');
      if (isEmbedded) {
        setTimeout(() => {
          setFloatingXp(null);
          if (onComplete) onComplete(25);
        }, 1200);
      }
    }
  }, [allCorrect, isEmbedded, onComplete]);

  const handleReset = () => {
    setConnections({});
    setSelectedQ(null);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Floating XP Animation */}
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
              right: '20px',
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

      {!isEmbedded && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#38bdf8" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
              Match Pairs ({correctCount}/{questions.length} Correct)
            </span>
          </div>

          <button onClick={handleReset} className="btn btn-glass" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      )}

      {/* SVG Canvas & 2-Column Grid (Enforced side-by-side even on small screens) */}
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', minHeight: '300px', width: '100%' }}>
        
        {/* SVG Thread Lines Overlay */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
          <defs>
            <linearGradient id="correctGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="incorrectGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glowThread" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {lineCoords.map((line, idx) => {
            const horizontalDistance = Math.abs(line.x2 - line.x1);
            const dx = Math.max(12, horizontalDistance * 0.45);
            const pathData = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;

            return (
              <g key={idx}>
                {/* Glow Underlay */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={line.isCorrect ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#glowThread)"
                />
                {/* Main Thread Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={line.isCorrect ? 'url(#correctGradient)' : 'url(#incorrectGradient)'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={line.isCorrect ? 'none' : '6 4'}
                />
                {/* Connection End Anchor Dots */}
                <circle cx={line.x1} cy={line.y1} r="5" fill={line.isCorrect ? '#22c55e' : '#ef4444'} stroke="#fff" strokeWidth="1.5" />
                <circle cx={line.x2} cy={line.y2} r="5" fill={line.isCorrect ? '#22c55e' : '#ef4444'} stroke="#fff" strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>

        {/* Left Column: Terms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', zIndex: 2, minWidth: 0 }}>
          <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            Terms
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
                  padding: '0.65rem 0.8rem',
                  borderRadius: '12px',
                  background: isSelected 
                    ? 'rgba(16, 185, 129, 0.2)'
                    : isConnected
                      ? isCorrect ? 'rgba(34, 197, 94, 0.14)' : 'rgba(239, 68, 68, 0.14)'
                      : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected
                    ? '2px solid #10b981'
                    : isConnected
                      ? isCorrect ? '2px solid #22c55e' : '2px solid #ef4444'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  color: isSelected ? '#34d399' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  gap: '0.35rem',
                  minHeight: '52px',
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  wordBreak: 'break-word'
                }}
              >
                <span style={{ lineHeight: 1.3 }}>{qItem.q}</span>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: isSelected ? '#10b981' : isConnected ? (isCorrect ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.2)',
                  border: '1.5px solid rgba(255,255,255,0.4)'
                }} />
              </div>
            );
          })}
        </div>

        {/* Right Column: Definitions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', zIndex: 2, minWidth: 0 }}>
          <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, textAlign: 'right' }}>
            Definitions
          </h4>
          {answers.map((aItem, aIdx) => {
            const connectedQIdx = Object.keys(connections).find(qKey => connections[qKey] === aIdx);
            const isConnected = connectedQIdx !== undefined;
            const isCorrect = isConnected ? aItem.matchIndex === parseInt(connectedQIdx, 10) : false;

            return (
              <div
                key={aIdx}
                ref={el => rightRefs.current[aIdx] = el}
                onClick={() => handleSelectAnswer(aIdx)}
                style={{
                  padding: '0.65rem 0.8rem',
                  borderRadius: '12px',
                  background: isConnected
                    ? isCorrect ? 'rgba(34, 197, 94, 0.14)' : 'rgba(239, 68, 68, 0.14)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isConnected
                    ? isCorrect ? '2px solid #22c55e' : '2px solid #ef4444'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  gap: '0.35rem',
                  minHeight: '52px',
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  wordBreak: 'break-word'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: isConnected ? (isCorrect ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.2)',
                    border: '1.5px solid rgba(255,255,255,0.4)'
                  }} />
                  {isConnected && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isCorrect ? '#4ade80' : '#f87171' }}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                <span style={{ textAlign: 'right', lineHeight: 1.3 }}>{aItem.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {!isEmbedded && allCorrect && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(16,185,129,0.15)', border: '1.5px solid #10b981', marginTop: '0.5rem' }}>
          <h3 style={{ color: '#34d399', margin: '0 0 0.5rem' }}>All Matches Correct! 🎉</h3>
          <button className="btn btn-primary" onClick={() => onComplete && onComplete(50)}>
            Continue (+50 XP)
          </button>
        </motion.div>
      )}
    </div>
  );
}
