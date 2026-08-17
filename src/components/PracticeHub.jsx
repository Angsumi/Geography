import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Trophy, HelpCircle, Link2, Layers, Flame, CheckCircle, Sparkles, Filter, RefreshCw } from 'lucide-react';
import ExamineMCQ from './ExamineMCQ';
import MatchGame from './MatchGame';
import Flashcard from './Flashcard';

export function PracticeHub({ syllabusData, activityData, studyDb, onCompleteActivity }) {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedExamTag, setSelectedExamTag] = useState('ALL');
  const [activeGameMode, setActiveGameMode] = useState(null); // 'mcq' | 'match' | 'flashcard'

  // Extract all practice items across datasets
  const allActivities = activityData?.LearningActivities || [];

  const getFilteredMCQs = () => {
    let mcqList = [];
    allActivities.forEach(act => {
      const isAssam = act.SectionName?.toLowerCase().includes('assam') || act.SectionName?.toLowerCase().includes('brahmaputra') || act.SectionName?.toLowerCase().includes('barak');
      const isNE = act.SectionName?.toLowerCase().includes('northeast') || act.SectionName?.toLowerCase().includes('hills');
      
      let regionTag = 'INDIA';
      if (isAssam) regionTag = 'ASSAM';
      else if (isNE) regionTag = 'NE';

      if (selectedRegion !== 'ALL' && regionTag !== selectedRegion) return;

      (act.ExamineMCQ || []).forEach(mc => {
        const cleanOpts = (mc.Options || []).map(o => o.replace(/\[cite:\s*\d+\]/g, '').trim());
        const cleanAns = mc.CorrectAnswer.replace(/\[cite:\s*\d+\]/g, '').trim();
        let ansKey = 'A';
        if (cleanOpts[1] === cleanAns) ansKey = 'B';
        else if (cleanOpts[2] === cleanAns) ansKey = 'C';
        else if (cleanOpts[3] === cleanAns) ansKey = 'D';

        mcqList.push({
          question: mc.Question.replace(/\[cite:\s*\d+\]/g, '').trim(),
          options: {
            A: cleanOpts[0] || 'Option A',
            B: cleanOpts[1] || 'Option B',
            C: cleanOpts[2] || 'Option C',
            D: cleanOpts[3] || 'Option D'
          },
          correctAnswer: ansKey,
          explanation: `Official ADRE / APSC Geography Solution: ${cleanAns}`
        });
      });
    });

    if (mcqList.length === 0) {
      // Fallback from studyDb
      Object.values(studyDb || {}).forEach(dbItem => {
        if (dbItem.mcqs) mcqList.push(...dbItem.mcqs);
      });
    }

    return mcqList;
  };

  const getFilteredMatches = () => {
    let matchPairs = [];
    allActivities.forEach(act => {
      (act.PracticeMatching || []).forEach(m => {
        matchPairs.push({
          q: m.Term.replace(/\[cite:\s*\d+\]/g, '').trim(),
          a: m.Definition.replace(/\[cite:\s*\d+\]/g, '').trim(),
          exp: ''
        });
      });
    });

    if (matchPairs.length === 0) {
      Object.values(studyDb || {}).forEach(dbItem => {
        if (dbItem.match) matchPairs.push(...dbItem.match);
      });
    }

    return matchPairs;
  };

  const getFilteredFlashcards = () => {
    let cards = [];
    allActivities.forEach(act => {
      (act.VisualFlashcards || []).forEach(f => {
        cards.push({
          q: f.Front.replace(/\[cite:\s*\d+\]/g, '').trim(),
          a: f.Back.replace(/\[cite:\s*\d+\]/g, '').trim(),
          img: f.Image ? (f.Image.startsWith('/') ? `${import.meta.env.BASE_URL}${f.Image.slice(1)}` : f.Image) : null,
          exp: act.SectionName
        });
      });
    });

    if (cards.length === 0) {
      Object.values(studyDb || {}).forEach(dbItem => {
        if (dbItem.flashcards) cards.push(...dbItem.flashcards);
      });
    }

    return cards;
  };

  const handleFinishGame = (xp) => {
    onCompleteActivity(xp);
    setActiveGameMode(null);
  };

  if (activeGameMode === 'mcq') {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <button onClick={() => setActiveGameMode(null)} className="btn btn-glass" style={{ marginBottom: '1rem' }}>
          ← Back to Practice Hub
        </button>
        <ExamineMCQ data={getFilteredMCQs()} onComplete={handleFinishGame} />
      </div>
    );
  }

  if (activeGameMode === 'match') {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <button onClick={() => setActiveGameMode(null)} className="btn btn-glass" style={{ marginBottom: '1rem' }}>
          ← Back to Practice Hub
        </button>
        <MatchGame data={getFilteredMatches()} onComplete={handleFinishGame} />
      </div>
    );
  }

  if (activeGameMode === 'flashcard') {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <button onClick={() => setActiveGameMode(null)} className="btn btn-glass" style={{ marginBottom: '1rem' }}>
          ← Back to Practice Hub
        </button>
        <Flashcard data={getFilteredFlashcards()} onComplete={handleFinishGame} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Banner */}
      <div>
        <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          ADRE & APSC Practice Suite
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.2rem 0', color: '#fff' }}>
          Geography Exam Practice Bank
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
          Test your conceptual understanding with targeted questions across Assam, Northeast, and India.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#10b981" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>Filter Region:</span>
          {['ALL', 'ASSAM', 'NE', 'INDIA'].map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              style={{
                background: selectedRegion === reg ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedRegion === reg ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
                color: selectedRegion === reg ? '#34d399' : '#94a3b8',
                padding: '0.35rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {reg === 'NE' ? 'Northeast' : reg}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>Target Exam:</span>
          {['ALL', 'ADRE', 'APSC'].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedExamTag(tag)}
              style={{
                background: selectedExamTag === tag ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedExamTag === tag ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                color: selectedExamTag === tag ? '#fb923c' : '#94a3b8',
                padding: '0.35rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Practice Mode Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Exam MCQs */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setActiveGameMode('mcq')}
          className="glass-panel"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            border: '1.5px solid rgba(244, 63, 94, 0.4)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(244, 63, 94, 0.1))',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
              <HelpCircle size={22} />
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', padding: '0.2rem 0.6rem', borderRadius: 10, fontWeight: 900 }}>
              +15 XP per Q
            </span>
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>ADRE & APSC MCQ Bank</h3>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              Multiple choice questions with detailed explanation feedback for competitive exam readiness.
            </p>
          </div>

          <button className="btn" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: '#fff', padding: '0.6rem', borderRadius: 10, fontSize: '0.8rem', fontWeight: 800, border: 'none' }}>
            Start MCQ Test ({getFilteredMCQs().length} Qs)
          </button>
        </motion.div>

        {/* Card 2: Term Matching */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setActiveGameMode('match')}
          className="glass-panel"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(56, 189, 248, 0.1))',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Link2 size={22} />
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: 10, fontWeight: 900 }}>
              +10 XP per match
            </span>
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>Geographic Match Pairs</h3>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              Match rivers, national parks, boundaries, and soil types to build fast memory recall.
            </p>
          </div>

          <button className="btn" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#000', padding: '0.6rem', borderRadius: 10, fontSize: '0.8rem', fontWeight: 900, border: 'none' }}>
            Start Matching Game ({getFilteredMatches().length} pairs)
          </button>
        </motion.div>

        {/* Card 3: Visual Flashcards */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setActiveGameMode('flashcard')}
          className="glass-panel"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(16, 185, 129, 0.1))',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <Layers size={22} />
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.2rem 0.6rem', borderRadius: 10, fontWeight: 900 }}>
              +10 XP per card
            </span>
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>Visual Flashcard Decks</h3>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              Interactive flip cards with high-yield geography facts and map illustrations.
            </p>
          </div>

          <button className="btn" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#000', padding: '0.6rem', borderRadius: 10, fontSize: '0.8rem', fontWeight: 900, border: 'none' }}>
            Launch Flashcards ({getFilteredFlashcards().length} cards)
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}
