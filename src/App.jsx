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
  const chaptersList = [];
  const syllabusHierarchy = [];
  const studyDb = {};

  const rawSubjects = json.GeographySyllabus || [];

  rawSubjects.forEach((chapterObj) => {
    const chapterName = chapterObj.Chapter || chapterObj.Subject || 'Geography';
    if (!chaptersList.includes(chapterName)) {
      chaptersList.push(chapterName);
    }

    const chapterItem = { chapterName, units: [] };
    const units = chapterObj.Units || chapterObj.Topics || [];

    units.forEach((unitObj) => {
      const unitName = unitObj.UnitName || unitObj.TopicName || 'General Unit';
      const unitItem = { unitName, lessons: [] };
      const rawLessons = unitObj.Lessons || unitObj.Subtopics || [];

      rawLessons.forEach((les) => {
        const lessonName = les.LessonName || les.SubtopicName || 'Lesson';
        const topicsList = [];
        const flashcards = [];
        const mcqs = [];
        const matchPairs = [];

        const rawTopics = les.Topics || les.Sections || [];

        rawTopics.forEach((top) => {
          const topicName = top.TopicName || top.SectionName || 'Overview';
          const facts = top.Facts || [];
          const units = top.ConceptUnits || [];
          const matching = top.PracticeMatching || [];
          const idea = top.VisualisationIdea || null;

          topicsList.push({
            topicName,
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
                exp: `Topic: ${topicName}`
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
              exp: `Topic: ${topicName}`
            });
          });
        });

        studyDb[lessonName] = { flashcards, mcqs, match: matchPairs };
        unitItem.lessons.push({ lessonName, topics: topicsList });
      });

      chapterItem.units.push(unitItem);
    });

    syllabusHierarchy.push(chapterItem);
  });

  return { chaptersList, syllabusHierarchy, studyDb };
}

const { chaptersList: chapters, syllabusHierarchy, studyDb: STUDY_DATABASE } = parseSyllabus(syllabusData);

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
  const [selectedLesson, setSelectedLesson] = useState('Brahmaputra Valley');
  const [detailedViewSubdivision, setDetailedViewSubdivision] = useState(null);
  const [activeActivity, setActiveActivity] = useState(null);
  const [activeActivityData, setActiveActivityData] = useState(null);

  // Accordion Sidebar Open States
  const [openChapters, setOpenChapters] = useState({ 'ASSAM': true, 'NE': true, 'INDIA': true });
  const [openLessons, setOpenLessons] = useState({ 'Brahmaputra Valley': true });

  const detailsRef = useRef(null);

  useEffect(() => { saveState('adre_xp', xp); }, [xp]);

  let quickButtons = [];
  const currentCh = syllabusHierarchy.find(s => s.chapterName === activeChapter);
  if (currentCh) {
    currentCh.units.forEach(u => {
      u.lessons.forEach(les => {
        quickButtons.push({ name: les.lessonName, label: les.lessonName, unitName: u.unitName, topicsCount: les.topics.length });
      });
    });
  }

  useEffect(() => {
    setSelectedLesson(quickButtons.length > 0 ? quickButtons[0].name : '');
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

  const toggleLesson = (lesName) => {
    setOpenLessons(prev => ({ ...prev, [lesName]: !prev[lesName] }));
    setSelectedLesson(lesName);
  };

  const getLessonTopics = () => {
    if (!selectedLesson) return { unitName: 'Overview', topics: [] };
    for (const ch of syllabusHierarchy) {
      if (ch.chapterName === activeChapter) {
        for (const u of ch.units) {
          for (const les of u.lessons) {
            if (les.lessonName === selectedLesson) return { unitName: u.unitName, topics: les.topics };
          }
        }
      }
    }
    return { unitName: 'Overview', topics: [] };
  };

  const getNavigationTargets = (currentChapter, currentUnit, currentLesson, currentTopic) => {
    const allTopics = [];
    syllabusHierarchy.forEach(ch => {
      ch.units.forEach(u => {
        u.lessons.forEach(l => {
          l.topics.forEach(t => {
            allTopics.push({
              chapterName: ch.chapterName,
              unitName: u.unitName,
              lessonName: l.lessonName,
              topicName: t.topicName,
              topicObj: t
            });
          });
        });
      });
    });

    const currentIndex = allTopics.findIndex(item =>
      item.chapterName === currentChapter && item.topicName === currentTopic
    );

    let nextTopic = null;
    let nextLesson = null;
    let nextUnit = null;
    let nextChapter = null;

    if (currentIndex >= 0 && currentIndex < allTopics.length - 1) {
      nextTopic = allTopics[currentIndex + 1];

      // Find next lesson
      nextLesson = allTopics.slice(currentIndex + 1).find(item =>
        item.lessonName !== currentLesson || item.chapterName !== currentChapter
      ) || null;

      // Find next unit
      nextUnit = allTopics.slice(currentIndex + 1).find(item =>
        item.unitName !== currentUnit || item.chapterName !== currentChapter
      ) || null;

      // Find next chapter
      nextChapter = allTopics.slice(currentIndex + 1).find(item =>
        item.chapterName !== currentChapter
      ) || null;
    }

    return { nextTopic, nextLesson, nextUnit, nextChapter };
  };

  const getCompleteLessonActivity = (lessonName) => {
    const targetName = lessonName || selectedLesson;
    let foundLes = null;

    for (const ch of syllabusHierarchy) {
      for (const u of ch.units) {
        for (const les of u.lessons) {
          if (les.lessonName === targetName || les.lessonName.toLowerCase().includes((targetName || '').toLowerCase())) {
            foundLes = les;
            break;
          }
        }
      }
    }

    if (!foundLes) return { flashcards: [], match: [], mcqs: [] };

    const flashcards = [];
    const match = [];
    const mcqs = [];

    foundLes.topics.forEach((top) => {
      if (top.ConceptUnits && Array.isArray(top.ConceptUnits)) {
        top.ConceptUnits.forEach(u => {
          if (u.Flashcard) {
            flashcards.push({
              q: u.Flashcard.Front,
              a: u.Flashcard.Back,
              img: u.Flashcard.Image || null,
              exp: `Topic: ${top.topicName}`
            });
          }
          if (u.Quiz) {
            mcqs.push(u.Quiz);
          }
        });
      }

      if (top.PracticeMatching && Array.isArray(top.PracticeMatching)) {
        top.PracticeMatching.forEach(m => {
          match.push({
            q: m.Term,
            a: m.Definition,
            exp: `Topic: ${top.topicName}`
          });
        });
      }
    });

    return { flashcards, match, mcqs };
  };

  const handleRegionSelect = (regionName) => {
    setSelectedLesson(regionName);
    setIsSidebarOpen(false);
    if (detailsRef.current) detailsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleActivityComplete = (pts) => { addXp(pts || 10); setActiveActivity(null); };

  const startFlashcard = (lesName) => {
    const dataset = getCompleteLessonActivity(lesName || selectedLesson);
    setActiveActivityData(dataset);
    setActiveActivity('flashcard');
  };

  const startMatch = (lesName) => {
    const dataset = getCompleteLessonActivity(lesName || selectedLesson);
    setActiveActivityData(dataset);
    setActiveActivity('match');
  };

  const startMCQ = (lesName) => {
    const dataset = getCompleteLessonActivity(lesName || selectedLesson);
    setActiveActivityData(dataset);
    setActiveActivity('mcq');
  };

  const startSectionPlayer = (topicObj, lessonName, unitName, chapterName) => {
    const currentCh = chapterName || activeChapter;
    const currentTop = topicObj.topicName || topicObj.SectionName;
    const navTargets = getNavigationTargets(currentCh, unitName, lessonName, currentTop);

    if (chapterName) setActiveChapter(chapterName);
    if (lessonName) setSelectedLesson(lessonName);

    const lessonData = generateSectionPlayerData(topicObj, lessonName, unitName, currentCh, navTargets);
    setActiveLesson(lessonData);
    setViewMode('lesson');
    setIsSidebarOpen(false);
  };

  const startLessonPlayer = (targetLessonName) => {
    let foundLes = null;
    let foundUnitName = 'General Unit';
    let foundChapterName = activeChapter;

    for (const ch of syllabusHierarchy) {
      for (const u of ch.units) {
        for (const les of u.lessons) {
          if (les.lessonName === targetLessonName || les.lessonName.toLowerCase().includes((targetLessonName || '').toLowerCase())) {
            foundLes = les;
            foundUnitName = u.unitName;
            foundChapterName = ch.chapterName;
            break;
          }
        }
      }
    }

    if (foundChapterName) setActiveChapter(foundChapterName);
    if (targetLessonName) setSelectedLesson(targetLessonName);

    const lesName = foundLes ? foundLes.lessonName : (targetLessonName || selectedLesson);
    const topics = foundLes ? foundLes.topics : getLessonTopics().topics;
    const firstTopName = topics[0]?.topicName || '';
    const navTargets = getNavigationTargets(foundChapterName, foundUnitName, lesName, firstTopName);

    const lessonData = generateLessonPlayerData(lesName, foundUnitName, foundChapterName, topics, navTargets);
    setActiveLesson(lessonData);
    setViewMode('lesson');
    setIsSidebarOpen(false);
  };

  const handleNavigateToTarget = (targetInfo) => {
    if (!targetInfo) return;
    startSectionPlayer(targetInfo.topicObj, targetInfo.lessonName, targetInfo.unitName, targetInfo.chapterName);
  };

  const imageUrl = () => {
    const raw = TOPIC_IMAGES[selectedLesson] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80';
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

        {/* LEFT: Multi-Tier Student Mindset Sidebar (Chapter -> Unit -> Lesson -> Topic) */}
        <aside className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', overflowY: 'auto' }}>
            <span className="sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={14} color="#34d399" /> Student Curriculum Tree
            </span>

            {/* Nested Accordion: Chapter -> Unit -> Lesson -> Topic */}
            {syllabusHierarchy.map((chObj) => {
              const chName = chObj.chapterName;
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
                  
                  {/* TIER 1: CHAPTER */}
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
                      <span>CHAPTER: {shortName}</span>
                    </div>
                    {isChOpen ? <ChevronDown size={16} color={styleConfig.activeColor} /> : <ChevronRight size={16} color="#64748b" />}
                  </button>

                  {/* TIER 2 & 3: UNITS & LESSONS */}
                  {isChOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '0.5rem', marginTop: '0.2rem' }}>
                      {chObj.units.map(unitObj => {
                        return (
                          <div key={unitObj.unitName} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', paddingLeft: '0.25rem', marginTop: '0.2rem' }}>
                              UNIT: {unitObj.unitName}
                            </div>

                            {unitObj.lessons.map(les => {
                              const lesName = les.lessonName;
                              const isLesSelected = selectedLesson === lesName;
                              const isLesOpen = openLessons[lesName] ?? (isLesSelected);

                              return (
                                <div key={lesName} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                  
                                  {/* TIER 3: LESSON HEADER */}
                                  <button
                                    onClick={() => toggleLesson(lesName)}
                                    style={{
                                      background: isLesSelected ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.02)',
                                      border: `1px solid ${isLesSelected ? '#10b981' : 'rgba(255,255,255,0.05)'}`,
                                      color: isLesSelected ? '#34d399' : '#e2e8f0',
                                      padding: '0.5rem 0.7rem',
                                      borderRadius: 8,
                                      fontSize: '0.78rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justify: 'space-between'
                                    }}
                                  >
                                    <div>
                                      <div style={{ fontWeight: isLesSelected ? 800 : 600, textAlign: 'left' }}>Lesson: {lesName}</div>
                                      <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: 1 }}>{les.topics.length} topics</div>
                                    </div>
                                    {isLesOpen ? <ChevronDown size={14} color="#34d399" /> : <ChevronRight size={14} color="#64748b" />}
                                  </button>

                                  {/* TIER 4: TOPICS LIST */}
                                  {isLesOpen && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.75rem', borderLeft: '2px solid rgba(16,185,129,0.3)', margin: '0.2rem 0 0.3rem 0.4rem' }}>
                                      {les.topics.map((top, tIdx) => {
                                        return (
                                          <div
                                            key={tIdx}
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
                                              📌 Topic: {top.topicName}
                                            </span>

                                            <button
                                              onClick={() => startSectionPlayer(top, lesName, unitObj.unitName, chName)}
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
                            })}
                          </div>
                        );
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

        {/* RIGHT: Main Viewport */}
        <main style={{ padding: '1.25rem', overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 60px)', minWidth: 0 }}>

          {activeActivity ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '1.75rem', maxWidth: 820, margin: '0 auto' }}>
              <button onClick={() => setActiveActivity(null)} className="btn btn-glass" style={{ marginBottom: '1.25rem', padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
                <ArrowLeft size={16} /> Back to Syllabus Directory
              </button>
              {activeActivity === 'flashcard' && <Flashcard data={activeActivityData?.flashcards || getCompleteLessonActivity(selectedLesson).flashcards} onComplete={handleActivityComplete} />}
              {activeActivity === 'match'     && <MatchGame  data={activeActivityData?.match     || getCompleteLessonActivity(selectedLesson).match}      onComplete={handleActivityComplete} />}
              {activeActivity === 'mcq'       && <ExamineMCQ data={activeActivityData?.mcqs      || getCompleteLessonActivity(selectedLesson).mcqs}       onComplete={handleActivityComplete} />}
            </motion.div>
          ) : viewMode === 'lesson' && activeLesson ? (
            <InteractiveLesson
              lessonData={activeLesson}
              onComplete={(gainedXp) => {
                addXp(gainedXp);
                setViewMode('home');
              }}
              onBack={() => setViewMode('home')}
              onNavigateToTarget={handleNavigateToTarget}
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
              onStartFlashcard={(lesName) => startFlashcard(lesName || selectedLesson)}
              onStartMatch={(lesName) => startMatch(lesName || selectedLesson)}
              onStartMCQ={(lesName) => startMCQ(lesName || selectedLesson)}
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
                <GeographyMap onSelectRegion={handleRegionSelect} activeRegion={selectedLesson} isAssam={activeChapter.toLowerCase().includes('assam')} activeChapter={activeChapter} />
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
                  <ArrowLeft size={16} /> Back to Syllabus Directory
                </button>

                <button
                  onClick={() => startLessonPlayer(selectedLesson)}
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
                  <PlayCircle size={16} /> Start Full Lesson Player
                </button>
              </div>

              <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: '2rem 1.5rem', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <img src={imageUrl()} alt={selectedLesson} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 800 }}>CHAPTER: {activeChapter}</span>
                  <h1 style={{ margin: '0.2rem 0 0', fontSize: '2rem', fontWeight: 900 }}>Lesson: {selectedLesson}</h1>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {getLessonTopics().topics.map((top, idx) => {
                  return (
                    <div key={idx} className="section-card-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem', alignItems: 'start' }}>
                      <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.65rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <Zap size={17} color="#34d399" /> {top.topicName}
                          </h3>
                          <span style={{ fontSize: '0.68rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '0.2rem 0.55rem', borderRadius: 10, fontWeight: 800 }}>
                            Topic {idx + 1}
                          </span>
                        </div>
                        <SectionVisualizer sectionName={top.topicName} facts={top.facts} />
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {top.facts.map((fact, fIdx) => (
                            <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', padding: '0.65rem 0.85rem', borderRadius: 10 }}>
                              <span style={{ color: '#10b981', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>•</span>
                              <span style={{ color: '#e2e8f0', fontSize: '0.88rem', lineHeight: 1.5 }}>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0, fontSize: '0.92rem', color: '#34d399' }}>
                          <GraduationCap size={17} /> Topic Practice Suite
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          <button
                            className="btn btn-primary"
                            onClick={() => startSectionPlayer(top, selectedLesson, getLessonTopics().unitName, activeChapter)}
                            style={{ justifyContent: 'center', padding: '0.75rem 0.85rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#000', fontWeight: 900 }}
                          >
                            <PlayCircle size={15} /> Start Topic Player
                          </button>
                          <button className="btn btn-glass" onClick={() => startFlashcard(selectedLesson)} style={{ justifyContent: 'space-between', padding: '0.7rem 0.85rem', fontSize: '0.82rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Layers size={15} /> Flashcards Deck</span>
                            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.1)', padding: '0.15rem 0.4rem', borderRadius: 6 }}>+10 XP</span>
                          </button>
                          <button className="btn btn-glass" onClick={() => startMatch(selectedLesson)} style={{ justifyContent: 'space-between', padding: '0.7rem 0.85rem', fontSize: '0.82rem', borderColor: '#38bdf8', color: '#38bdf8' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Link2 size={15} /> Match Pairs</span>
                            <span style={{ fontSize: '0.72rem', background: 'rgba(56,189,248,0.15)', padding: '0.15rem 0.4rem', borderRadius: 6 }}>+10 XP</span>
                          </button>
                          <button className="btn btn-glass" onClick={() => startMCQ(selectedLesson)} style={{ justifyContent: 'space-between', padding: '0.7rem 0.85rem', fontSize: '0.82rem', borderColor: '#f87171', color: '#f87171' }}>
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
                  Chapter: {activeChapter}
                </h1>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Tap map boundaries or select topics to launch dedicated Topic Players.</p>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', maxWidth: 820, margin: '0 auto', width: '100%' }}>
                <h3 style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem', justifyContent: 'center', fontSize: '1.1rem' }}>
                  🗺️ Interactive Vector Map Inspector
                </h3>
                <GeographyMap onSelectRegion={handleRegionSelect} activeRegion={selectedLesson} isAssam={activeChapter.toLowerCase().includes('assam')} activeChapter={activeChapter} />
              </div>

              <div className="glass-panel" style={{ padding: '1.1rem' }}>
                <h4 style={{ marginBottom: '0.65rem', fontSize: '0.85rem', color: '#94a3b8' }}>Select Lesson:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {quickButtons.map(btn => {
                    const isSelected = selectedLesson === btn.name;
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
                {selectedLesson ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>Click below to launch full sequential Lesson Player:</p>
                    <motion.div whileHover={{ scale: 1.01 }} onClick={() => startLessonPlayer(selectedLesson)}
                      className="glass-panel"
                      style={{ padding: 0, overflow: 'hidden', border: '1.5px solid #10b981', cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.25)' }}
                    >
                      <div className="detailed-banner-grid">
                        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 180 }}>
                          <img src={imageUrl()} alt={selectedLesson} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(15,17,26,0.95))' }} />
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.45rem' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <PlayCircle size={12} /> Launch Full Lesson Player
                          </span>
                          <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 900 }}>
                            {selectedLesson} <ChevronRight size={18} color="#34d399" />
                          </h2>
                          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                            {getLessonTopics().topics.slice(0, 2).map((t, i) => (
                              <p key={i} style={{ margin: '0 0 0.35rem' }}>
                                <strong style={{ color: '#34d399' }}>{t.topicName}:</strong> {t.facts[0] || ''}
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
