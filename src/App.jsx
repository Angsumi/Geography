import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, Zap, Layers, Link2, Flame, HelpCircle, GraduationCap, ChevronRight, ChevronDown, Menu, X, Home, PlayCircle, Sparkles, Map, Compass, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import indiaGeo from './data/india/GEography.json';
import assamGeo from './data/assam/GEography.json';
import neGeo from './data/northeast/GEography.json';

import './index.css';
import Flashcard from './components/Flashcard';
import MatchGame from './components/MatchGame';
import ExamineMCQ from './components/ExamineMCQ';
import GeographyMap from './components/GeographyMap';
import { SectionVisualizer } from './components/SectionVisualizer';
import { HomePage } from './components/HomePage';
import { GamusaIcon } from './components/icons/GamusaIcon';
import { InteractiveLesson } from './components/InteractiveLesson';
import { MobileNavBar } from './components/MobileNavBar';
import { PracticeHub } from './components/PracticeHub';
import { ProgressDashboard } from './components/ProgressDashboard';

import { generateLessonPlayerData, generateSectionPlayerData } from './utils/lessonGenerator.jsx';

// Combine regional JSON files into unified syllabus array
const syllabusData = {
  GeographySyllabus: [
    ...(assamGeo.GeographySyllabus || []),
    ...(indiaGeo.GeographySyllabus || []),
    ...(neGeo.GeographySyllabus || [])
  ]
};

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

function parseSyllabus(json) {
  const subjectsList = [];
  const syllabusHierarchy = [];
  const studyDb = {};

  const rawSubjects = json.GeographySyllabus || [];

  rawSubjects.forEach((subjectObj) => {
    const subjectName = subjectObj.Subject || 'Geography';
    if (!subjectsList.includes(subjectName)) {
      subjectsList.push(subjectName);
    }

    const subjectItem = { subjectName, topics: [] };
    const topics = subjectObj.Topics || [];

    topics.forEach((topicObj) => {
      const topicName = topicObj.TopicName || 'General Topic';
      const topicItem = { topicName, subtopics: [] };
      const rawSubtopics = topicObj.Subtopics || [];

      rawSubtopics.forEach((sub) => {
        const subName = sub.SubtopicName || 'Subtopic';
        const sectionsList = [];
        const flashcards = [];
        const mcqs = [];
        const matchPairs = [];

        (sub.Sections || []).forEach((sec) => {
          const secName = sec.SectionName || 'Overview';
          const facts = sec.Facts || [];
          const units = sec.ConceptUnits || [];
          const matching = sec.PracticeMatching || [];
          const idea = sec.VisualisationIdea || null;

          sectionsList.push({
            sectionName: secName,
            facts,
            ConceptUnits: units,
            PracticeMatching: matching,
            VisualisationIdea: idea
          });

          units.forEach((u) => {
            if (u.Flashcard) {
              flashcards.push({
                q: u.Flashcard.Front,
                a: u.Flashcard.Back,
                img: u.Flashcard.Image || null,
                exp: `Section: ${secName}`
              });
            }
            if (u.Quiz) {
              mcqs.push(u.Quiz);
            }
          });

          matching.forEach((m) => {
            matchPairs.push({
              q: m.Term,
              a: m.Definition,
              exp: `Section: ${secName}`
            });
          });
        });

        studyDb[subName] = { flashcards, mcqs, match: matchPairs };
        topicItem.subtopics.push({ subtopicName: subName, sections: sectionsList });
      });

      subjectItem.topics.push(topicItem);
    });

    syllabusHierarchy.push(subjectItem);
  });

  return { subjectsList, syllabusHierarchy, studyDb };
}

const { subjectsList: chapters, syllabusHierarchy, studyDb: STUDY_DATABASE } = parseSyllabus(syllabusData);

const CHAPTER_STYLES = {
  'ASSAM': {
    activeBg: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(249,115,22,0.25))',
    activeBorder: '1px solid #f97316',
    activeColor: '#fb923c',
    glow: '0 0 16px rgba(249,115,22,0.35)',
    icon: <GamusaIcon size={22} />
  },
  'INDIA': {
    activeBg: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,182,212,0.25))',
    activeBorder: '1px solid #10b981',
    activeColor: '#34d399',
    glow: '0 0 16px rgba(16,185,129,0.35)',
    icon: '🇮🇳'
  },
  'NE': {
    activeBg: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.25))',
    activeBorder: '1px solid #ec4899',
    activeColor: '#f472b6',
    glow: '0 0 16px rgba(236,72,153,0.35)',
    icon: '🏔️'
  }
};

const TOPIC_IMAGES = {
  'Brahmaputra Valley': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
  'Central Hills': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  'Barak Valley': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80',
  'Ecology': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
  'Wildlife Reserves': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80',
  'Transport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
  'Himalayas': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
};

export default function App() {
  const [xp, setXp] = useState(() => loadState('adre_xp', 0));
  const [streak, setStreak] = useState(() => getStreak());
  const [activeChapter, setActiveChapter] = useState('ASSAM');
  const [viewMode, setViewMode] = useState('home');
  const [activeLesson, setActiveLesson] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState('Brahmaputra Valley');
  const [detailedViewSubdivision, setDetailedViewSubdivision] = useState(null);
  const [activeActivity, setActiveActivity] = useState(null);
  const [activeActivityData, setActiveActivityData] = useState(null);

  // Accordion Sidebar Open States
  const [openChapters, setOpenChapters] = useState({ 'ASSAM': true, 'NE': true, 'INDIA': true });
  const [openSubtopics, setOpenSubtopics] = useState({ 'Brahmaputra Valley': true });

  const detailsRef = useRef(null);

  useEffect(() => { saveState('adre_xp', xp); }, [xp]);

  let quickButtons = [];
  const currentSubj = syllabusHierarchy.find(s => s.subjectName === activeChapter);
  if (currentSubj) {
    currentSubj.topics.forEach(top => {
      top.subtopics.forEach(sub => {
        quickButtons.push({ name: sub.subtopicName, label: sub.subtopicName, topicName: top.topicName, sectionsCount: sub.sections.length });
      });
    });
  }

  useEffect(() => {
    setSelectedSubtopic(quickButtons.length > 0 ? quickButtons[0].name : '');
    setDetailedViewSubdivision(null);
    setActiveActivity(null);
  }, [activeChapter]);

  const addXp = (amount) => {
    setXp(prev => prev + amount);
    saveState('adre_last_play', new Date().toDateString());
    setStreak(getStreak());
  };

  const toggleChapter = (chName) => {
    setOpenChapters(prev => ({ ...prev, [chName]: !prev[chName] }));
    setActiveChapter(chName);
  };

  const toggleSubtopic = (subName) => {
    setOpenSubtopics(prev => ({ ...prev, [subName]: !prev[subName] }));
    setSelectedSubtopic(subName);
  };

  const getSubtopicSections = () => {
    if (!selectedSubtopic) return { topicName: 'Overview', sections: [] };
    for (const subj of syllabusHierarchy) {
      if (subj.subjectName === activeChapter) {
        for (const top of subj.topics) {
          for (const sub of top.subtopics) {
            if (sub.subtopicName === selectedSubtopic) return { topicName: top.topicName, sections: sub.sections };
          }
        }
      }
    }
    return { topicName: 'Overview', sections: [] };
  };

  const getStudyData = () => {
    let data = STUDY_DATABASE[selectedSubtopic];
    if (!data) {
      const key = Object.keys(STUDY_DATABASE).find(k =>
        k.toLowerCase().includes(selectedSubtopic.toLowerCase()) || selectedSubtopic.toLowerCase().includes(k.toLowerCase())
      );
      if (key) data = STUDY_DATABASE[key];
    }
    return data || { flashcards: [], mcqs: [], match: [] };
  };

  const getCompleteSubtopicActivity = (subtopicName) => {
    const targetName = subtopicName || selectedSubtopic;
    let foundSub = null;

    for (const subj of syllabusHierarchy) {
      for (const top of subj.topics) {
        for (const sub of top.subtopics) {
          if (sub.subtopicName === targetName || sub.subtopicName.toLowerCase().includes((targetName || '').toLowerCase())) {
            foundSub = sub;
            break;
          }
        }
      }
    }

    if (!foundSub) return getStudyData();

    const flashcards = [];
    const match = [];
    const mcqs = [];

    foundSub.sections.forEach((sec) => {
      if (sec.ConceptUnits && Array.isArray(sec.ConceptUnits)) {
        sec.ConceptUnits.forEach(u => {
          if (u.Flashcard) {
            flashcards.push({
              q: u.Flashcard.Front,
              a: u.Flashcard.Back,
              img: u.Flashcard.Image || null,
              exp: `Section: ${sec.sectionName}`
            });
          }
          if (u.Quiz) {
            mcqs.push(u.Quiz);
          }
        });
      }

      if (sec.PracticeMatching && Array.isArray(sec.PracticeMatching)) {
        sec.PracticeMatching.forEach(m => {
          match.push({
            q: m.Term,
            a: m.Definition,
            exp: `Section: ${sec.sectionName}`
          });
        });
      }
    });

    return { flashcards, match, mcqs };
  };

  const handleRegionSelect = (regionName) => {
    setSelectedSubtopic(regionName);
    setIsSidebarOpen(false);
    if (detailsRef.current) detailsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleActivityComplete = (pts) => { addXp(pts || 10); setActiveActivity(null); };

  const startFlashcard = (subNameOrData) => {
    const dataset = typeof subNameOrData === 'string'
      ? getCompleteSubtopicActivity(subNameOrData)
      : (subNameOrData || getCompleteSubtopicActivity(selectedSubtopic));
    setActiveActivityData(dataset);
    setActiveActivity('flashcard');
  };

  const startMatch = (subNameOrData) => {
    const dataset = typeof subNameOrData === 'string'
      ? getCompleteSubtopicActivity(subNameOrData)
      : (subNameOrData || getCompleteSubtopicActivity(selectedSubtopic));
    setActiveActivityData(dataset);
    setActiveActivity('match');
  };

  const startMCQ = (subNameOrData) => {
    const dataset = typeof subNameOrData === 'string'
      ? getCompleteSubtopicActivity(subNameOrData)
      : (subNameOrData || getCompleteSubtopicActivity(selectedSubtopic));
    setActiveActivityData(dataset);
    setActiveActivity('mcq');
  };

  const startSectionPlayer = (sectionObj, subtopicName, topicName, subjectName) => {
    if (subjectName) {
      setActiveChapter(subjectName);
    }
    if (subtopicName) {
      setSelectedSubtopic(subtopicName);
    }
    const lessonData = generateSectionPlayerData(sectionObj, subtopicName, topicName, subjectName || activeChapter);
    setActiveLesson(lessonData);
    setViewMode('lesson');
    setIsSidebarOpen(false);
  };

  const startLessonPlayer = (targetSubName) => {
    let foundSub = null;
    let foundTopicName = 'General Geography';
    let foundSubjectName = activeChapter;

    for (const subj of syllabusHierarchy) {
      for (const top of subj.topics) {
        for (const sub of top.subtopics) {
          if (sub.subtopicName === targetSubName || sub.subtopicName.toLowerCase().includes((targetSubName || '').toLowerCase())) {
            foundSub = sub;
            foundTopicName = top.topicName;
            foundSubjectName = subj.subjectName;
            break;
          }
        }
      }
    }

    if (foundSubjectName) {
      setActiveChapter(foundSubjectName);
    }
    if (targetSubName) {
      setSelectedSubtopic(targetSubName);
    }

    const subName = foundSub ? foundSub.subtopicName : (targetSubName || selectedSubtopic);
    const sections = foundSub ? foundSub.sections : getSubtopicSections().sections;
    const actData = getCompleteSubtopicActivity(subName);

    const lessonData = generateLessonPlayerData(subName, foundTopicName, foundSubjectName, sections, actData);
    setActiveLesson(lessonData);
    setViewMode('lesson');
    setIsSidebarOpen(false);
  };

  const imageUrl = () => {
    const raw = TOPIC_IMAGES[selectedSubtopic] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80';
    return raw.startsWith('/') ? `${import.meta.env.BASE_URL}${raw.slice(1)}` : raw;
  };

  const getChapterShortName = (name) => name.replace(/^\d+[\.\_]\s*/, '');

  const currentNavTab = viewMode === 'home' || viewMode === 'chapter' ? 'learn'
    : viewMode === 'map_hub' ? 'explore'
    : viewMode === 'practice_hub' ? 'practice'
    : viewMode === 'progress_hub' ? 'progress'
    : 'learn';

  const handleMobileTabChange = (tabId) => {
    if (tabId === 'learn') { setViewMode('home'); setActiveActivity(null); }
    else if (tabId === 'explore') { setViewMode('map_hub'); setActiveActivity(null); }
    else if (tabId === 'practice') { setViewMode('practice_hub'); setActiveActivity(null); }
    else if (tabId === 'progress') { setViewMode('progress_hub'); setActiveActivity(null); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#090d16', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>

      {/* ── Sticky Header ── */}
      <header className="glass-panel app-header" style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', borderRadius: 0, position: 'sticky', top: 0, zIndex: 110 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarOpen(v => !v)}
            aria-label="Toggle Syllabus Sidebar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: isSidebarOpen ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1.5px solid ${isSidebarOpen ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
              color: isSidebarOpen ? '#10b981' : '#f8fafc',
              padding: '0.4rem 0.75rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.78rem'
            }}
          >
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            <span>{isSidebarOpen ? 'Close' : 'Menu'}</span>
          </button>

          <div onClick={() => { setViewMode('home'); setActiveActivity(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', minWidth: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <GamusaIcon size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.02em' }}>ADRE Geography Platform</h2>
              <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>Brilliant.org Interactive Experience</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => { setViewMode('home'); setActiveActivity(null); }}
            style={{
              background: viewMode === 'home' && !activeActivity ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${viewMode === 'home' && !activeActivity ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
              color: viewMode === 'home' && !activeActivity ? '#34d399' : '#cbd5e1',
              padding: '0.35rem 0.7rem',
              borderRadius: 14,
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 800
            }}
          >
            <Home size={14} /> Home
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.65rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Trophy size={14} color="#34d399" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399' }}>{xp} XP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.65rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Flame size={14} color="#f97316" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f97316' }}>{streak}d</span>
          </div>
        </div>
      </header>

      {/* ── Two-Column App Layout ── */}
      <div className="subdivision-grid" style={{ flex: 1 }}>

        {/* LEFT: Multi-Tier Accordion Sidebar */}
        <aside className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', overflowY: 'auto' }}>
            <span className="sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={14} color="#34d399" /> Syllabus Explorer Tree
            </span>

            {/* Nested Accordion: Chapter -> Subtopic -> Section */}
            {syllabusHierarchy.map((subjectObj) => {
              const chName = subjectObj.subjectName;
              const shortName = getChapterShortName(chName).toUpperCase();
              const isChActive = activeChapter === chName;
              const isChOpen = openChapters[chName] ?? true;

              const styleConfig = CHAPTER_STYLES[shortName] || {
                activeBg: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.2))',
                activeBorder: '1px solid #10b981',
                activeColor: '#34d399',
                glow: '0 0 14px rgba(16,185,129,0.3)',
                icon: '📍'
              };

              return (
                <div key={chName} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '0.5rem' }}>
                  
                  {/* LEVEL 1: CHAPTER BUTTON */}
                  <button
                    onClick={() => toggleChapter(chName)}
                    style={{
                      background: isChActive ? styleConfig.activeBg : 'rgba(255,255,255,0.02)',
                      color: isChActive ? styleConfig.activeColor : '#f8fafc',
                      border: isChActive ? styleConfig.activeBorder : '1px solid rgba(255,255,255,0.05)',
                      padding: '0.65rem 0.8rem',
                      borderRadius: 10,
                      fontSize: '0.85rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span style={{ fontSize: '1rem' }}>{styleConfig.icon}</span>
                      <span>{shortName} GEOGRAPHY</span>
                    </div>
                    {isChOpen ? <ChevronDown size={16} color={styleConfig.activeColor} /> : <ChevronRight size={16} color="#64748b" />}
                  </button>

                  {/* LEVEL 2: SUBTOPICS LIST */}
                  {isChOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '0.5rem', marginTop: '0.2rem' }}>
                      {subjectObj.topics.map(topicObj => {
                        return topicObj.subtopics.map(sub => {
                          const subName = sub.subtopicName;
                          const isSubSelected = selectedSubtopic === subName;
                          const isSubOpen = openSubtopics[subName] ?? (isSubSelected);

                          return (
                            <div key={subName} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              
                              {/* SUBTOPIC HEADER BUTTON */}
                              <button
                                onClick={() => toggleSubtopic(subName)}
                                style={{
                                  background: isSubSelected ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.02)',
                                  border: `1px solid ${isSubSelected ? '#10b981' : 'rgba(255,255,255,0.05)'}`,
                                  color: isSubSelected ? '#34d399' : '#e2e8f0',
                                  padding: '0.55rem 0.75rem',
                                  borderRadius: 8,
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justify: 'space-between'
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: isSubSelected ? 800 : 600, textAlign: 'left' }}>{subName}</div>
                                  <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: 1 }}>{sub.sections.length} sections</div>
                                </div>
                                {isSubOpen ? <ChevronDown size={14} color="#34d399" /> : <ChevronRight size={14} color="#64748b" />}
                              </button>

                              {/* LEVEL 3: SECTIONS LIST */}
                              {isSubOpen && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.75rem', borderLeft: '2px solid rgba(16,185,129,0.3)', margin: '0.2rem 0 0.3rem 0.4rem' }}>
                                  {sub.sections.map((sec, sIdx) => {
                                    return (
                                      <div
                                        key={sIdx}
                                        style={{
                                          background: 'rgba(255,255,255,0.02)',
                                          border: '1px solid rgba(255,255,255,0.04)',
                                          borderRadius: 6,
                                          padding: '0.45rem 0.6rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justify: 'space-between',
                                          gap: '0.35rem'
                                        }}
                                      >
                                        <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                          📌 {sec.sectionName}
                                        </span>

                                        <button
                                          onClick={() => startSectionPlayer(sec, subName, topicObj.topicName, chName)}
                                          style={{
                                            background: 'linear-gradient(135deg, #10b981, #34d399)',
                                            border: 'none',
                                            color: '#000',
                                            padding: '0.25rem 0.55rem',
                                            borderRadius: 5,
                                            fontSize: '0.65rem',
                                            fontWeight: 900,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.2rem',
                                            flexShrink: 0
                                          }}
                                        >
                                          <PlayCircle size={10} /> Play
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                            </div>
                          );
                        });
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </aside>

        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, top: 60, zIndex: 90, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
        )}

        {/* RIGHT: Main Viewport (Priority: activeActivity > lesson > hubs) */}
        <main style={{ padding: '1.25rem', overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 60px)', minWidth: 0 }}>

          {activeActivity ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '1.75rem', maxWidth: 820, margin: '0 auto' }}>
              <button onClick={() => setActiveActivity(null)} className="btn btn-glass" style={{ marginBottom: '1.25rem', padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
                <ArrowLeft size={16} /> Back to Syllabus Directory
              </button>
              {activeActivity === 'flashcard' && <Flashcard data={activeActivityData?.flashcards || getCompleteSubtopicActivity(selectedSubtopic).flashcards} onComplete={handleActivityComplete} />}
              {activeActivity === 'match'     && <MatchGame  data={activeActivityData?.match     || getCompleteSubtopicActivity(selectedSubtopic).match}      onComplete={handleActivityComplete} />}
              {activeActivity === 'mcq'       && <ExamineMCQ data={activeActivityData?.mcqs      || getCompleteSubtopicActivity(selectedSubtopic).mcqs}       onComplete={handleActivityComplete} />}
            </motion.div>
          ) : viewMode === 'lesson' && activeLesson ? (
            <InteractiveLesson
              lessonData={activeLesson}
              onComplete={(gainedXp) => {
                addXp(gainedXp);
                setViewMode('home');
              }}
              onBack={() => setViewMode('home')}
            />
          ) : viewMode === 'home' ? (
            <HomePage
              syllabusHierarchy={syllabusHierarchy}
              activeChapter={activeChapter}
              onSelectChapter={(ch) => {
                setActiveChapter(ch);
                setViewMode('chapter');
                setDetailedViewSubdivision(null);
                setActiveActivity(null);
              }}
              onStartLessonPlayer={startLessonPlayer}
              onStartSectionPlayer={startSectionPlayer}
              onStartFlashcard={(subName) => startFlashcard(subName || selectedSubtopic)}
              onStartMatch={(subName) => startMatch(subName || selectedSubtopic)}
              onStartMCQ={(subName) => startMCQ(subName || selectedSubtopic)}
              onExploreMap={() => setViewMode('map_hub')}
            />
          ) : viewMode === 'map_hub' ? (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Interactive Canvas Map Hub
                </span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.2rem 0', color: '#fff' }}>
                  Geography Map Inspector
                </h1>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
                  Explore Assam districts, Northeast 7 Sisters, and Indian physiographic divisions interactively.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', maxWidth: 840, margin: '0 auto', width: '100%' }}>
                <GeographyMap onSelectRegion={handleRegionSelect} activeRegion={selectedSubtopic} isAssam={activeChapter.toLowerCase().includes('assam')} activeChapter={activeChapter} />
              </div>
            </motion.div>
          ) : viewMode === 'practice_hub' ? (
            <PracticeHub
              syllabusData={syllabusData}
              activityData={{ LearningActivities: [] }}
              studyDb={STUDY_DATABASE}
              onCompleteActivity={handleActivityComplete}
            />
          ) : viewMode === 'progress_hub' ? (
            <ProgressDashboard
              xp={xp}
              streak={streak}
              syllabusHierarchy={syllabusHierarchy}
            />
          ) : detailedViewSubdivision ? (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button onClick={() => setDetailedViewSubdivision(null)} className="btn btn-glass" style={{ width: 'fit-content', padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
                  <ArrowLeft size={16} /> Back to Directory
                </button>

                <button
                  onClick={() => startLessonPlayer(selectedSubtopic)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    border: 'none',
                    color: '#000',
                    padding: '0.55rem 1.1rem',
                    borderRadius: 12,
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.35)'
                  }}
                >
                  <PlayCircle size={16} /> Start Full Subtopic Player
                </button>
              </div>

              <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: '2rem 1.5rem', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <img src={imageUrl()} alt={selectedSubtopic} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 800 }}>{activeChapter} GEOGRAPHY</span>
                  <h1 style={{ margin: '0.2rem 0 0', fontSize: '2rem', fontWeight: 900 }}>{selectedSubtopic}</h1>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {getSubtopicSections().sections.map((sec, idx) => {
                  return (
                    <div key={idx} className="section-card-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem', alignItems: 'start' }}>
                      <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.65rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <Zap size={17} color="#34d399" /> {sec.sectionName}
                          </h3>
                          <span style={{ fontSize: '0.68rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '0.2rem 0.55rem', borderRadius: 10, fontWeight: 800 }}>
                            Section {idx + 1}
                          </span>
                        </div>
                        <SectionVisualizer sectionName={sec.sectionName} facts={sec.facts} />
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {sec.facts.map((fact, fIdx) => (
                            <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', padding: '0.65rem 0.85rem', borderRadius: 10 }}>
                              <span style={{ color: '#10b981', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>•</span>
                              <span style={{ color: '#e2e8f0', fontSize: '0.88rem', lineHeight: 1.5 }}>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0, fontSize: '0.92rem', color: '#34d399' }}>
                          <GraduationCap size={17} /> Section Practice Suite
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          <button
                            className="btn btn-primary"
                            onClick={() => startSectionPlayer(sec, selectedSubtopic, getSubtopicSections().topicName, activeChapter)}
                            style={{ justifyContent: 'center', padding: '0.75rem 0.85rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#000', fontWeight: 900 }}
                          >
                            <PlayCircle size={15} /> Start Section Player
                          </button>
                          <button className="btn btn-glass" onClick={() => startFlashcard(selectedSubtopic)} style={{ justifyContent: 'space-between', padding: '0.7rem 0.85rem', fontSize: '0.82rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Layers size={15} /> Flashcards Deck</span>
                            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.1)', padding: '0.15rem 0.4rem', borderRadius: 6 }}>+10 XP</span>
                          </button>
                          <button className="btn btn-glass" onClick={() => startMatch(selectedSubtopic)} style={{ justifyContent: 'space-between', padding: '0.7rem 0.85rem', fontSize: '0.82rem', borderColor: '#38bdf8', color: '#38bdf8' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Link2 size={15} /> Match Pairs</span>
                            <span style={{ fontSize: '0.72rem', background: 'rgba(56,189,248,0.15)', padding: '0.15rem 0.4rem', borderRadius: 6 }}>+10 XP</span>
                          </button>
                          <button className="btn btn-glass" onClick={() => startMCQ(selectedSubtopic)} style={{ justifyContent: 'space-between', padding: '0.7rem 0.85rem', fontSize: '0.82rem', borderColor: '#f87171', color: '#f87171' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><HelpCircle size={15} /> Exam MCQ Quiz</span>
                            <span style={{ fontSize: '0.72rem', background: 'rgba(248,113,113,0.15)', padding: '0.15rem 0.4rem', borderRadius: 6 }}>+15 XP</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Geography Interactive Explorer</span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.2rem 0', color: '#fff' }}>
                  {activeChapter} Geography Syllabus
                </h1>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Tap map boundaries or select sections to launch dedicated Section Players.</p>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', maxWidth: 820, margin: '0 auto', width: '100%' }}>
                <h3 style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem', justifyContent: 'center', fontSize: '1.1rem' }}>
                  🗺️ Interactive Vector Map Inspector
                </h3>
                <GeographyMap onSelectRegion={handleRegionSelect} activeRegion={selectedSubtopic} isAssam={activeChapter.toLowerCase().includes('assam')} activeChapter={activeChapter} />
              </div>

              <div className="glass-panel" style={{ padding: '1.1rem' }}>
                <h4 style={{ marginBottom: '0.65rem', fontSize: '0.85rem', color: '#94a3b8' }}>Subtopic Select:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {quickButtons.map(btn => {
                    const isSelected = selectedSubtopic === btn.name;
                    return (
                      <button key={btn.name} onClick={() => handleRegionSelect(btn.name)} className="btn"
                        style={{
                          fontSize: '0.78rem',
                          padding: '0.4rem 0.8rem',
                          background: isSelected ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isSelected ? '#10b981' : 'rgba(255,255,255,0.06)'}`,
                          color: isSelected ? '#34d399' : '#e2e8f0',
                          fontWeight: isSelected ? 800 : 500
                        }}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div ref={detailsRef} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                {selectedSubtopic ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>Click below to launch full sequential Lesson Player:</p>
                    <motion.div whileHover={{ scale: 1.01 }} onClick={() => startLessonPlayer(selectedSubtopic)}
                      className="glass-panel"
                      style={{ padding: 0, overflow: 'hidden', border: '1.5px solid #10b981', cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.25)' }}
                    >
                      <div className="detailed-banner-grid">
                        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 180 }}>
                          <img src={imageUrl()} alt={selectedSubtopic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(15,17,26,0.95))' }} />
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.45rem' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <PlayCircle size={12} /> Launch Full Subtopic Player
                          </span>
                          <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 900 }}>
                            {selectedSubtopic} <ChevronRight size={18} color="#34d399" />
                          </h2>
                          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                            {getSubtopicSections().sections.slice(0, 2).map((s, i) => (
                              <p key={i} style={{ margin: '0 0 0.35rem' }}>
                                <strong style={{ color: '#34d399' }}>{s.sectionName}:</strong> {s.facts[0] || ''}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <MobileNavBar
        currentTab={currentNavTab}
        onTabChange={handleMobileTabChange}
      />
    </div>
  );
}
