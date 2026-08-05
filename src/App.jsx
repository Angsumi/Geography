import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, ArrowLeft, Zap, Layers, Link2, Flame, Map, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import db from './database.json';
import './index.css';
import Flashcard from './Flashcard';
import MatchGame from './MatchGame';
import ExamineMCQ from './ExamineMCQ';
import GeographyMap from './GeographyMap';

// ─── localStorage helpers ───────────────────────────────
function loadState(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function saveState(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function getStreak() {
  const lastPlay = loadState('adre_last_play', null);
  const streak = loadState('adre_streak', 0);
  if (!lastPlay) return 0;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastPlay === today || lastPlay === yesterday) return streak;
  return 0;
}

// Filter to ONLY include Geography chapters
const chapters = Object.keys(db.PLAN || {}).filter(ch => 
  ch.toLowerCase().includes('geography')
);

// Map images for Geography topics
const TOPIC_IMAGES = {
  // India
  "The Northern Mountains (The Himalayas)": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop",
  "The Northern Plains (Indo-Gangetic Plain)": "https://images.unsplash.com/photo-1622308644420-b3336ba7df1d?w=800&auto=format&fit=crop",
  "The Peninsular Plateau": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop",
  "The Indian Desert (Thar Desert)": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop",
  "The Coastal Plains": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
  "The Islands": "https://images.unsplash.com/photo-1589979482837-e74f2e145060?w=800&auto=format&fit=crop",
  "Himalayan River Systems (Perennial)": "https://images.unsplash.com/photo-1601999109332-542b18dbec57?w=800&auto=format&fit=crop",
  "Peninsular River Systems (Seasonal/Rain-fed)": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop",
  "Biodiversity Hotspots (BH - 4 in India)": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop",
  "World Natural Heritage Sites (WNHS)": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop",
  "Biosphere Reserves (BR - 18 Notified, 12 UNESCO)": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop",
  // Assam
  "Brahmaputra Valley (Sadiya to Dhubri, floods)": "https://images.unsplash.com/photo-1588537548398-33fbab9165f1?w=800&auto=format&fit=crop",
  "Brahmaputra Valley (Sadiya to Dhubri,": "https://images.unsplash.com/photo-1588537548398-33fbab9165f1?w=800&auto=format&fit=crop",
  "Barak Valley": "https://images.unsplash.com/photo-1596701062351-df5f8a02e3c5?w=800&auto=format&fit=crop",
  "Central Plateau/Hills (Karbi Anglong, Haflong)": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
  "Brahmaputra North Bank": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop",
  "Brahmaputra South Bank": "https://images.unsplash.com/photo-1588537548398-33fbab9165f1?w=800&auto=format&fit=crop",
  "Barak North Bank": "https://images.unsplash.com/photo-1596701062351-df5f8a02e3c5?w=800&auto=format&fit=crop",
  "National Parks (7)": "https://images.unsplash.com/photo-1581888227599-779811939961?w=800&auto=format&fit=crop",
  "Wildlife Sanctuaries": "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop",
  "Bird Sanctuaries": "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800&auto=format&fit=crop",
  "Beels (Wetlands)": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop",
  "Tiger Reserves (4)": "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?w=800&auto=format&fit=crop",
  "Elephant Reserves (5)": "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?w=800&auto=format&fit=crop"
};

function getChapterShortName(ch) {
  if (ch.toLowerCase().includes('assam')) return 'Assam Geography';
  return 'Indian Geography';
}

function stripTopicNumber(topicKey) {
  return topicKey.replace(/^\d+\.\s*/, '');
}

// Detailed MCQ parser to retrieve full options
function parseDetailedMCQ(qText) {
  const qMatch = qText.match(/(?:Q\d+\.\s*)(.*?)(?=\n[A-D]\))/is);
  const question = qMatch ? qMatch[1].trim() : qText.split('\n')[0].replace(/^Q\d+\.\s*/, '').trim();

  const options = {};
  ['A', 'B', 'C', 'D'].forEach(letter => {
    const optMatch = qText.match(new RegExp(`${letter}\\)\\s*(.*?)(?=\\n[A-D]\\)|\\nCorrect|\\n\\n|$)`, 'is'));
    if (optMatch) options[letter] = optMatch[1].trim();
  });

  const aMatch = qText.match(/Correct Answer:\s*([A-D])/i);
  const correctAnswer = aMatch ? aMatch[1].trim().toUpperCase() : 'C';

  const expMatch = qText.match(/Explanation:\s*(.*)/is);
  const explanation = expMatch ? expMatch[1].trim() : '';

  return {
    question,
    options,
    correctAnswer,
    explanation
  };
}

function findMCQsForSubtopic(chapterKey, planTopicKey, subtopicKey) {
  const mcqChapter = db.MCQ?.[chapterKey];
  if (!mcqChapter) return [];

  const topicName = stripTopicNumber(planTopicKey);
  let mcqTopic = mcqChapter[planTopicKey] || mcqChapter[topicName];
  if (!mcqTopic) {
    const found = Object.keys(mcqChapter).find(k => k.includes(topicName) || topicName.includes(k));
    if (found) mcqTopic = mcqChapter[found];
  }
  if (!mcqTopic) return [];

  let mcqSubtopic = mcqTopic[subtopicKey];
  if (!mcqSubtopic) {
    const found = Object.keys(mcqTopic).find(k => k.includes(subtopicKey) || subtopicKey.includes(k));
    if (found) mcqSubtopic = mcqTopic[found];
  }
  
  if (!mcqSubtopic) {
    // try any keys under this topic
    const allQs = {};
    for (const st of Object.values(mcqTopic)) {
      if (typeof st === 'object') Object.assign(allQs, st);
    }
    if (Object.keys(allQs).length > 0) mcqSubtopic = allQs;
  }

  if (!mcqSubtopic) return [];
  return Object.values(mcqSubtopic).filter(v => typeof v === 'string').map(parseDetailedMCQ);
}

// Simplified plain question/answer pairs for Match Game & Flashcards
function getQAFromMCQs(mcqs) {
  return mcqs.map(q => ({
    q: q.question,
    a: q.options[q.correctAnswer] || 'Correct Option',
    exp: q.explanation
  }));
}


// ─── Main Component ─────────────────────────────────────
export default function App() {
  const [activeChapter, setActiveChapter] = useState(chapters[0] || null);
  const [totalScore, setTotalScore] = useState(() => loadState('adre_total_score', 0));
  const [streak, setStreak] = useState(() => getStreak());
  const [currentSection, setCurrentSection] = useState('learn'); // 'learn', 'practice', 'examine'

  // Learning / Game state
  const [activeRegion, setActiveRegion] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  
  const [gameActive, setGameActive] = useState(null); // { type: 'flashcard'|'match'|'mcq', data: [...] }

  // Set default active region when chapter changes
  useEffect(() => {
    if (activeChapter) {
      const planData = db.PLAN[activeChapter] || {};
      const firstTopicKey = Object.keys(planData)[0] || '';
      setActiveTopic(firstTopicKey);
      
      const subtopics = planData[firstTopicKey] ? Object.keys(planData[firstTopicKey]) : [];
      if (subtopics.length > 0) {
        setActiveRegion(subtopics[0]);
        setSelectedSubtopic(subtopics[0]);
      }
    }
  }, [activeChapter]);

  const handleRegionSelect = (regionName) => {
    setActiveRegion(regionName);
    setSelectedSubtopic(regionName);
    
    // Auto find the parent topic
    const planData = db.PLAN[activeChapter] || {};
    for (const tKey of Object.keys(planData)) {
      if (planData[tKey][regionName] !== undefined) {
        setActiveTopic(tKey);
        break;
      }
      // Fuzzy fallback
      const found = Object.keys(planData[tKey]).find(k => k.includes(regionName) || regionName.includes(k));
      if (found) {
        setActiveTopic(tKey);
        setSelectedSubtopic(found);
        break;
      }
    }
  };

  const handleGameComplete = (earned) => {
    const pts = earned || 0;
    const newTotal = totalScore + pts;
    setTotalScore(newTotal);
    saveState('adre_total_score', newTotal);

    const today = new Date().toDateString();
    saveState('adre_streak', streak + 1);
    saveState('adre_last_play', today);
    setStreak(streak + 1);

    const completed = loadState('adre_completed', []);
    const entry = `${activeChapter}::${selectedSubtopic}::${gameActive.type}`;
    if (!completed.includes(entry)) {
      completed.push(entry);
      saveState('adre_completed', completed);
    }

    setGameActive(null);
  };

  const startFlashcard = () => {
    const rawMCQs = findMCQsForSubtopic(activeChapter, activeTopic, selectedSubtopic);
    const qaPairs = getQAFromMCQs(rawMCQs);
    if (qaPairs.length === 0) {
      alert("Oops! Not enough content parsed for this subtopic to launch Flashcards.");
      return;
    }
    
    // Inject internet sourced images
    const enrichedQA = qaPairs.map(item => {
      // Find matching image
      const imgKey = Object.keys(TOPIC_IMAGES).find(k => 
        selectedSubtopic.includes(k) || k.includes(selectedSubtopic) || item.q.includes(k)
      );
      return {
        ...item,
        img: imgKey ? TOPIC_IMAGES[imgKey] : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop"
      };
    });

    setGameActive({ type: 'flashcard', data: enrichedQA });
  };

  const startMatch = () => {
    const rawMCQs = findMCQsForSubtopic(activeChapter, activeTopic, selectedSubtopic);
    if (rawMCQs.length < 3) {
      alert("Need at least 3 items to match. Try another subtopic!");
      return;
    }
    const qaPairs = getQAFromMCQs(rawMCQs);
    setGameActive({ type: 'match', data: qaPairs });
  };

  const startMCQ = () => {
    const rawMCQs = findMCQsForSubtopic(activeChapter, activeTopic, selectedSubtopic);
    if (rawMCQs.length === 0) {
      alert("No examine questions found for this region. Try another!");
      return;
    }
    setGameActive({ type: 'mcq', data: rawMCQs });
  };

  // Get active text facts
  const getSubtopicContent = () => {
    const planChapter = db.PLAN[activeChapter];
    if (!planChapter || !activeTopic || !selectedSubtopic) return '';
    return planChapter[activeTopic][selectedSubtopic]?.content || '';
  };

  const imageUrl = () => {
    const imgKey = Object.keys(TOPIC_IMAGES).find(k => 
      selectedSubtopic.includes(k) || k.includes(selectedSubtopic)
    );
    return imgKey ? TOPIC_IMAGES[imgKey] : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop";
  };

  return (
    <div className="app-container">
      {/* ─── Sidebar ──────────────────────────────────────── */}
      <div className="glass-panel sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 4rem)', position: 'sticky', top: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🗺️ GeoMaster
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assam & India Geography</span>
        </div>

        {/* Chapter Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: 0 }}>Active Region</p>
          {chapters.map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChapter(ch)}
              className="btn"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                background: activeChapter === ch ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255,255,255,0.02)',
                color: activeChapter === ch ? 'var(--primary)' : 'var(--text-main)',
                border: activeChapter === ch ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                padding: '0.65rem 0.85rem',
                fontSize: '0.85rem'
              }}
            >
              <Map size={16} /> {getChapterShortName(ch)}
            </button>
          ))}
        </div>

        {/* Sections Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: 0 }}>Study Sections</p>
          {[
            { id: 'learn', label: '📖 Learn Hub', color: 'var(--primary)' },
            { id: 'practice', label: '⚡ Practice Match', color: 'var(--secondary)' },
            { id: 'examine', label: '📝 Examine MCQ', color: 'var(--danger)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setCurrentSection(tab.id); setGameActive(null); }}
              className="btn"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                background: currentSection === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: currentSection === tab.id ? tab.color : 'var(--text-muted)',
                border: currentSection === tab.id ? '1px solid var(--glass-border)' : '1px solid transparent',
                fontSize: '0.85rem',
                padding: '0.65rem 0.85rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {streak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(248,113,113,0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)' }}>
              <Flame size={16} color="var(--danger)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 'bold' }}>Streak: {streak} Day{streak !== 1 ? 's' : ''}</span>
            </div>
          )}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Geography Score</span>
            <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.4rem' }}>{totalScore} pts</h3>
          </div>
        </div>
      </div>

      {/* ─── Main Content Area ─────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {gameActive ? (
          <div>
            <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn btn-glass" onClick={() => setGameActive(null)} style={{ padding: '0.5rem' }}>
                <ArrowLeft size={18} /> Back
              </button>
              <div>
                <h3 style={{ margin: 0 }}>{selectedSubtopic}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Playing: {gameActive.type.toUpperCase()}</span>
              </div>
            </header>

            <AnimatePresence mode="wait">
              {gameActive.type === 'flashcard' && (
                <Flashcard data={gameActive.data} onComplete={handleGameComplete} />
              )}
              {gameActive.type === 'match' && (
                <MatchGame data={gameActive.data} onComplete={handleGameComplete} />
              )}
              {gameActive.type === 'mcq' && (
                <ExamineMCQ data={gameActive.data} onComplete={handleGameComplete} />
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Header info */}
            <div>
              <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Geography Mode</span>
              <h1 style={{ fontSize: '2.2rem', margin: '0.2rem 0' }}>{getChapterShortName(activeChapter)}</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Explore physical regions, practice matching key traits, and examine your knowledge.</p>
            </div>

            {/* Hub Modes */}
            {currentSection === 'learn' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem' }}>
                {/* Left: Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🗺️ Interactive Region Selection
                    </h3>
                    <GeographyMap 
                      onSelectRegion={handleRegionSelect} 
                      activeRegion={selectedSubtopic} 
                      isAssam={activeChapter.toLowerCase().includes('assam')} 
                    />
                  </div>

                  {/* Regions List Fallback / Quick Grid */}
                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Select Subtopic Directly:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {Object.keys(db.PLAN[activeChapter] || {}).map(tKey => 
                        Object.keys(db.PLAN[activeChapter][tKey] || {}).map(stKey => {
                          const isSelected = selectedSubtopic === stKey;
                          return (
                            <button
                              key={stKey}
                              onClick={() => { setSelectedSubtopic(stKey); handleRegionSelect(stKey); }}
                              className="btn"
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.4rem 0.8rem',
                                background: isSelected ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255,255,255,0.02)',
                                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                              }}
                            >
                              {stKey}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Info card & Flashcards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                    {/* Header Image */}
                    <div style={{ width: '100%', height: '170px', position: 'relative' }}>
                      <img 
                        src={imageUrl()} 
                        alt={selectedSubtopic} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(15, 17, 26, 0.95))' }} />
                      <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold' }}>Target Subtopic</span>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedSubtopic}</h3>
                      </div>
                    </div>

                    {/* Content text */}
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-main)', maxHeight: '180px', overflowY: 'auto', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
                        {getSubtopicContent()}
                      </div>

                      {/* Flashcard Trigger */}
                      <button className="btn btn-primary" onClick={startFlashcard} style={{ width: '100%', padding: '0.85rem' }}>
                        <Layers size={18} /> Launch Visual Flashcards (+10 pts)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 'practice' && (
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>⚡ Concept Matching Hub</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Select a geography subtopic to practice matching concepts to their definitions or answers.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                  {Object.keys(db.PLAN[activeChapter] || {}).map(tKey => 
                    Object.keys(db.PLAN[activeChapter][tKey] || {}).map(stKey => (
                      <button
                        key={stKey}
                        className="btn btn-glass"
                        onClick={() => { setSelectedSubtopic(stKey); handleRegionSelect(stKey); setTimeout(startMatch, 100); }}
                        style={{
                          flexDirection: 'column',
                          padding: '1.25rem',
                          height: '110px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          border: '1px solid var(--glass-border)'
                        }}
                      >
                        <Link2 size={20} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{stKey}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {currentSection === 'examine' && (
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--danger)' }}>📝 Exam Hall</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Take multiple-choice tests specifically tailored to each geography subtopic to check your competency.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                  {Object.keys(db.PLAN[activeChapter] || {}).map(tKey => 
                    Object.keys(db.PLAN[activeChapter][tKey] || {}).map(stKey => {
                      const questions = findMCQsForSubtopic(activeChapter, tKey, stKey);
                      return (
                        <button
                          key={stKey}
                          className="btn btn-glass"
                          onClick={() => { setSelectedSubtopic(stKey); handleRegionSelect(stKey); setTimeout(startMCQ, 100); }}
                          style={{
                            flexDirection: 'column',
                            padding: '1.25rem',
                            height: '120px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          <HelpCircle size={20} color="var(--danger)" style={{ marginBottom: '0.5rem' }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{stKey}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{questions.length} Questions</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </div>
    </div>
  );
}
