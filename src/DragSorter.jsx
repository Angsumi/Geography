import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { GripVertical, CheckCircle2, XCircle, Sparkles, ArrowDown } from 'lucide-react';
import { playCorrect, playWrong, playComplete, playPickup, playDrop } from './useSound';

export default function DragSorter({ data, onComplete }) {
  const [cards, setCards] = useState({ pool: [], fact: [], fiction: [] });
  const [truthMap, setTruthMap] = useState({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const items = data.slice(0, Math.min(data.length, 8));
    const half = Math.ceil(items.length / 2);
    const prepared = [];

    items.forEach((item, i) => {
      const id = `card-${i}`;
      const qText = item.q.length > 75 ? item.q.substring(0, 75) + '…' : item.q;

      if (i < half) {
        // TRUE — correct Q/A pairing
        prepared.push({ id, question: qText, answer: item.a, isTrue: true });
      } else {
        // FALSE — mismatched answer (swap with another item)
        const wrongAnswer = items[(i - half + 1) % half].a;
        prepared.push({ id, question: qText, answer: wrongAnswer, isTrue: false });
      }
    });

    const map = {};
    prepared.forEach(c => { map[c.id] = c.isTrue; });
    setTruthMap(map);

    setCards({
      pool: prepared.sort(() => Math.random() - 0.5),
      fact: [],
      fiction: []
    });
  }, [data]);

  const onDragStart = () => {
    playPickup();
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    playDrop();

    const { source, destination } = result;
    const srcId = source.droppableId;
    const dstId = destination.droppableId;

    if (srcId === dstId) {
      const list = Array.from(cards[srcId]);
      const [moved] = list.splice(source.index, 1);
      list.splice(destination.index, 0, moved);
      setCards(prev => ({ ...prev, [srcId]: list }));
    } else {
      const srcList = Array.from(cards[srcId]);
      const dstList = Array.from(cards[dstId]);
      const [moved] = srcList.splice(source.index, 1);
      dstList.splice(destination.index, 0, moved);
      setCards(prev => ({ ...prev, [srcId]: srcList, [dstId]: dstList }));
    }
  };

  const handleCheck = () => {
    let correct = 0;
    const total = Object.keys(truthMap).length;

    cards.fact.forEach(c => { if (truthMap[c.id] === true) correct++; });
    cards.fiction.forEach(c => { if (truthMap[c.id] === false) correct++; });

    const earned = correct * 10;
    setScore(earned);
    setChecked(true);

    if (correct === total) {
      playComplete();
    } else if (correct > total / 2) {
      playCorrect();
    } else {
      playWrong();
    }

    setTimeout(() => setCompleted(true), 2500);
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
        <h2>Sorting Complete!</h2>
        <h1 style={{ color: 'var(--primary)', fontSize: '4rem', margin: '1rem 0' }}>{score}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {score >= Object.keys(truthMap).length * 8 ? '🔥 Excellent work!' : score > 0 ? '💪 Good effort!' : 'Keep practicing!'}
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Total Points Earned</p>
        <button className="btn btn-primary" onClick={() => onComplete(score)}>
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  const allSorted = cards.pool.length === 0;

  const renderCard = (card, provided, snapshot, bucketId) => {
    const isCorrectPlacement = checked && bucketId !== 'pool'
      ? truthMap[card.id] === (bucketId === 'fact')
      : null;

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="drag-card"
        style={{
          ...provided.draggableProps.style,
          background: checked
            ? (isCorrectPlacement ? 'rgba(74, 222, 128, 0.12)' : 'rgba(248, 113, 113, 0.12)')
            : snapshot.isDragging
              ? 'rgba(129, 140, 248, 0.2)'
              : 'rgba(255, 255, 255, 0.04)',
          border: `1px solid ${
            checked
              ? (isCorrectPlacement ? 'var(--primary-glow)' : 'var(--danger-glow)')
              : snapshot.isDragging
                ? 'var(--secondary-glow)'
                : 'var(--glass-border)'
          }`,
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          marginBottom: '0.6rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          cursor: checked ? 'default' : 'grab',
          transition: 'background 0.3s, border-color 0.3s',
          boxShadow: snapshot.isDragging ? '0 12px 40px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.15)',
          transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
        }}
      >
        <GripVertical size={16} style={{ opacity: 0.35, flexShrink: 0, marginTop: '3px' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', lineHeight: 1.3 }}>
            {card.question}
          </p>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
            → {card.answer}
          </p>
        </div>
        {checked && isCorrectPlacement !== null && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            {isCorrectPlacement
              ? <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              : <XCircle size={20} color="var(--danger)" style={{ flexShrink: 0 }} />}
          </motion.div>
        )}
      </div>
    );
  };

  const renderDroppable = (droppableId, title, icon, accentColor) => (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="glass-panel drag-bucket"
          style={{
            minHeight: droppableId === 'pool' ? '80px' : '140px',
            borderColor: snapshot.isDraggingOver ? accentColor : 'var(--glass-border)',
            background: snapshot.isDraggingOver
              ? `rgba(${accentColor === 'var(--primary-glow)' ? '74,222,128' : accentColor === 'var(--danger-glow)' ? '248,113,113' : '129,140,248'}, 0.06)`
              : 'var(--glass-bg)',
            transition: 'border-color 0.3s, background 0.3s',
            padding: '1rem',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '0.75rem', paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--glass-border)'
          }}>
            {icon}
            <h4 style={{ margin: 0, fontSize: '0.95rem', flex: 1 }}>{title}</h4>
            <span className="badge">{cards[droppableId].length}</span>
          </div>

          {cards[droppableId].length === 0 && !snapshot.isDraggingOver && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem 0', opacity: 0.4,
            }}>
              <ArrowDown size={20} />
              <span style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Drop cards here</span>
            </div>
          )}

          {cards[droppableId].map((card, index) => (
            <Draggable key={card.id} draggableId={card.id} index={index} isDragDisabled={checked}>
              {(prov, snap) => renderCard(card, prov, snap, droppableId)}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ margin: 0, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={22} color="var(--secondary)" />
            Fact or Fiction?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Each card pairs a question with an answer. Is the pairing correct?<br />
            Drag each card into <strong style={{ color: 'var(--primary)' }}>Fact</strong> or <strong style={{ color: 'var(--danger)' }}>Fiction</strong>.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '0.6rem 1.2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Score</span>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.3rem' }}>{score}</span>
        </div>
      </div>

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {/* Unsorted Pool */}
        {cards.pool.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {renderDroppable(
              'pool',
              'Unsorted Cards',
              <Sparkles size={18} color="var(--secondary)" />,
              'var(--secondary-glow)'
            )}
          </motion.div>
        )}

        {/* Fact / Fiction Buckets */}
        <div className="sorter-buckets" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          {renderDroppable(
            'fact',
            'Fact — Correct Pairing',
            <CheckCircle2 size={18} color="var(--primary)" />,
            'var(--primary-glow)'
          )}
          {renderDroppable(
            'fiction',
            'Fiction — Wrong Pairing',
            <XCircle size={18} color="var(--danger)" />,
            'var(--danger-glow)'
          )}
        </div>
      </DragDropContext>

      {/* Check Answers */}
      {allSorted && !checked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginTop: '1.5rem' }}
        >
          <button className="btn btn-primary" onClick={handleCheck} style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
            <CheckCircle2 size={20} /> Check My Answers
          </button>
        </motion.div>
      )}

      {/* Results banner */}
      {checked && !completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{
            marginTop: '1.5rem', textAlign: 'center', padding: '1.5rem',
            border: '1px solid var(--primary-glow)',
          }}
        >
          <h3 style={{ color: 'var(--primary)', margin: 0 }}>
            {score >= Object.keys(truthMap).length * 8 ? '🎉 Outstanding!' : score > 0 ? '👍 Nice try!' : '📚 Review time!'}
          </h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>
            You scored <strong style={{ color: 'var(--primary)' }}>{score}</strong> points
          </p>
        </motion.div>
      )}
    </div>
  );
}
