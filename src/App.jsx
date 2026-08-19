import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Layers, GraduationCap, ChevronRight, ChevronDown, X, PlayCircle, Sparkles, Compass, BookOpen, Search, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import syllabusData from './data/unifiedGeography.json';

import './index.css';
import Flashcard from './components/Flashcard';
import MatchGame from './components/MatchGame';
import ExamineMCQ from './components/ExamineMCQ';
import GeographyMap from './components/GeographyMap';
import { HomePage } from './components/HomePage';
import { InteractiveLesson } from './components/InteractiveLesson';
import { MobileNavBar } from './components/MobileNavBar';
import { PracticeHub } from './components/PracticeHub';
import { ProgressDashboard } from './components/ProgressDashboard';

import { generateSectionPlayerData } from './utils/lessonGenerator.jsx';

function loadState(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    if (val === null || val === 'null' || val === 'undefined') return fallback;
    const parsed = JSON.parse(val);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
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

  const rawSubjects = (json && json.GeographySyllabus) || [];

  rawSubjects.forEach((chapterObj) => {
    const chapterName = chapterObj.Chapter || chapterObj.ChapterName || chapterObj.Subject || 'Geography';
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
                id: u.Id,
                q: u.Flashcard.Front,
                a: u.Flashcard.Back,
                img: u.Flashcard.Image || null,
                exp: `Topic: ${topicName}`
              });
            }
            if (u.Quiz) {
              mcqs.push({
                id: u.Id,
                ...u.Quiz
              });
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

const { syllabusHierarchy, studyDb: STUDY_DATABASE } = parseSyllabus(syllabusData);

export default function App() {
  const [xp, setXp] = useState(() => loadState('adre_xp', 0));
  const [streak, setStreak] = useState(() => getStreak());
  const [activeChapter, setActiveChapter] = useState('ASSAM');
  const [viewMode, setViewMode] = useState('home');
  const [activeLesson, setActiveLesson] = useState(null);

  const [selectedLesson, setSelectedLesson] = useState('Brahmaputra Valley');
  const [mapViewerTab, setMapViewerTab] = useState('ASSAM'); // 'ASSAM' | 'NE' | 'INDIA'
  const [activeActivity, setActiveActivity] = useState(null);
  const [activeActivityData, setActiveActivityData] = useState(null);

  // Accordion Open States
  const [openChapters, setOpenChapters] = useState({});
  const [openUnits, setOpenUnits] = useState({});
  const [openLessons, setOpenLessons] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState(() => loadState('adre_completed_topics', {}));

  const detailsRef = useRef(null);

  useEffect(() => { saveState('adre_xp', xp); }, [xp]);

  const markTopicCompleted = (topName) => {
    if (!topName) return;
    setCompletedTopics(prev => {
      const next = { ...(prev && typeof prev === 'object' ? prev : {}), [topName]: true };
      saveState('adre_completed_topics', next);
      return next;
    });
  };

  const safeCompletedTopics = completedTopics && typeof completedTopics === 'object' ? completedTopics : {};

  let quickButtons = [];
  const currentCh = (syllabusHierarchy || []).find(s => s.chapterName === activeChapter);
  if (currentCh) {
    (currentCh.units || []).forEach(u => {
      (u.lessons || []).forEach(les => {
        quickButtons.push({ name: les.lessonName, label: les.lessonName, unitName: u.unitName, topicsCount: (les.topics || []).length });
      });
    });
  }

  useEffect(() => {
    setSelectedLesson(quickButtons.length > 0 ? quickButtons[0].name : '');
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

  const toggleUnit = (unitName) => {
    setOpenUnits(prev => ({ ...prev, [unitName]: !prev[unitName] }));
  };

  const toggleLesson = (lesName) => {
    setOpenLessons(prev => ({ ...prev, [lesName]: !prev[lesName] }));
    setSelectedLesson(lesName);
  };

  const getLessonTopics = () => {
    if (!selectedLesson) return { unitName: 'Overview', topics: [] };
    for (const ch of (syllabusHierarchy || [])) {
      if (ch.chapterName === activeChapter) {
        for (const u of (ch.units || [])) {
          for (const les of (u.lessons || [])) {
            if (les.lessonName === selectedLesson) return { unitName: u.unitName, topics: les.topics || [] };
          }
        }
      }
    }
    return { unitName: 'Overview', topics: [] };
  };

  const getNavigationTargets = (currentChapter, currentUnit, currentLesson, currentTopic) => {
    const allTopics = [];
    (syllabusHierarchy || []).forEach(ch => {
      (ch.units || []).forEach(u => {
        (u.lessons || []).forEach(l => {
          (l.topics || []).forEach(t => {
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
      const immediateNext = allTopics[currentIndex + 1];

      // Next topic ONLY if in the same lesson
      if (immediateNext.lessonName === currentLesson && immediateNext.chapterName === currentChapter) {
        nextTopic = immediateNext;
      }

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

    for (const ch of (syllabusHierarchy || [])) {
      for (const u of (ch.units || [])) {
        for (const les of (u.lessons || [])) {
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

    (foundLes.topics || []).forEach((top) => {
      if (top.ConceptUnits && Array.isArray(top.ConceptUnits)) {
        top.ConceptUnits.forEach(u => {
          if (u.Flashcard) {
            flashcards.push({
              id: u.Id,
              q: u.Flashcard.Front,
              a: u.Flashcard.Back,
              img: u.Flashcard.Image || null,
              exp: `Topic: ${top.topicName}`
            });
          }
          if (u.Quiz) {
            mcqs.push({
              id: u.Id,
              ...u.Quiz
            });
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
  };

  const startLessonPlayer = (targetLessonName) => {
    let foundLes = null;
    let foundUnitName = 'General Unit';
    let foundChapterName = activeChapter;

    for (const ch of (syllabusHierarchy || [])) {
      for (const u of (ch.units || [])) {
        for (const les of (u.lessons || [])) {
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

    if (topics && topics.length > 0) {
      startSectionPlayer(topics[0], lesName, foundUnitName, foundChapterName);
    } else {
      const fallbackTopic = { topicName: lesName, ConceptUnits: [], PracticeMatching: [] };
      startSectionPlayer(fallbackTopic, lesName, foundUnitName, foundChapterName);
    }
  };

  const handleNavigateToTarget = (targetInfo) => {
    if (!targetInfo) return;
    if (targetInfo.topicObj) {
      startSectionPlayer(targetInfo.topicObj, targetInfo.lessonName, targetInfo.unitName, targetInfo.chapterName);
    } else if (targetInfo.lessonName) {
      startLessonPlayer(targetInfo.lessonName);
    }
  };

  const getChapterShortName = (name) => (name && typeof name === 'string' ? name.replace(/^\d+[._]\s*/, '') : 'CHAPTER');

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)', color: 'var(--text-main)', fontFamily: 'var(--font-sans)', paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
      
      {/* ── Main Viewport ── */}
      <main style={{ flex: 1, padding: '1.5rem 1rem', maxWidth: 960, margin: '0 auto', width: '100%' }}>

        {activeActivity ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '1.75rem', maxWidth: 820, margin: '0 auto' }}>
            <button onClick={() => setActiveActivity(null)} className="btn btn-subtle" style={{ marginBottom: '1.25rem', padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
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
              if (activeLesson?.topicName) markTopicCompleted(activeLesson.topicName);
              setViewMode('chapter');
            }}
            onBack={() => setViewMode('chapter')}
            onNavigateToTarget={(target) => {
              if (activeLesson?.topicName) markTopicCompleted(activeLesson.topicName);
              handleNavigateToTarget(target);
            }}
          />
        ) : viewMode === 'home' ? (
          <HomePage
            syllabusHierarchy={syllabusHierarchy}
            completedTopics={completedTopics}
            activeChapter={activeChapter}
            onSelectChapter={(ch) => {
              setActiveChapter(ch);
              setViewMode('chapter');
              setActiveActivity(null);
            }}
            onStartLessonPlayer={startLessonPlayer}
            onStartSectionPlayer={startSectionPlayer}
            onStartFlashcard={(lesName) => startFlashcard(lesName || selectedLesson)}
            onStartMatch={(lesName) => startMatch(lesName || selectedLesson)}
            onStartMCQ={(lesName) => startMCQ(lesName || selectedLesson)}
            onExploreMap={() => setViewMode('map_hub')}
            onExploreTopics={() => {
              setActiveChapter('ASSAM');
              setViewMode('chapter');
            }}
          />
        ) : viewMode === 'chapter' ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Navigation Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button onClick={() => setViewMode('home')} className="btn btn-subtle" style={{ fontSize: '0.85rem' }}>
                <ArrowLeft size={16} /> Back to Home
              </button>

              <span className="badge badge-sage" style={{ fontSize: '0.8rem' }}>
                <GraduationCap size={14} style={{ marginRight: 4, display: 'inline' }} /> Student Curriculum Tree
              </span>
            </div>

            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0.2rem 0', color: 'var(--text-main)' }}>
                Geography Curriculum Directory
              </h1>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                Select any chapter, unit, or lesson topic to launch interactive learning modules.
              </p>
            </div>

            {/* 🔍 Search Bar for Instant Curriculum Filtering */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. Brahmaputra, Dima Hasao, Rivers, Climate)..."
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  borderRadius: 12,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Student Curriculum Tree */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {(syllabusHierarchy || []).map((chObj) => {
                const chName = chObj.chapterName || 'Geography';
                const shortName = getChapterShortName(chName).toUpperCase();
                const qLower = searchQuery.toLowerCase().trim();
                const isChMatch = qLower && (chName.toLowerCase().includes(qLower) || JSON.stringify(chObj).toLowerCase().includes(qLower));
                const isChOpen = isChMatch || !!openChapters[chName];

                let totalTopicsInCh = 0;
                let completedTopicsInCh = 0;
                (chObj.units || []).forEach(u => {
                  (u.lessons || []).forEach(l => {
                    const topics = l.topics || [];
                    totalTopicsInCh += topics.length;
                    completedTopicsInCh += topics.filter(t => t && t.topicName && safeCompletedTopics[t.topicName]).length;
                  });
                });
                const chPct = totalTopicsInCh > 0 ? Math.round((completedTopicsInCh / totalTopicsInCh) * 100) : 0;

                return (
                  <div key={chName} className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Level 1: Chapter Accordion Header */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <button
                        onClick={() => toggleChapter(chName)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-main)',
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          padding: 0,
                          width: '100%'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <BookOpen size={18} color="var(--primary)" />
                          <span>CHAPTER: {shortName} ({(chObj.units || []).length} Units)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-sage" style={{ fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle size={12} /> {chPct === 100 ? '✓ 100% Mastered' : `${chPct}% (${completedTopicsInCh}/${totalTopicsInCh})`}
                          </span>
                          {isChOpen ? <ChevronDown size={18} color="var(--primary)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
                        </div>
                      </button>

                      {/* Chapter Progress Bar */}
                      <div style={{ height: 4, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                        <div style={{ height: '100%', width: `${chPct}%`, background: 'var(--primary)', borderRadius: 2, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>

                    {/* Level 2: Units */}
                    {isChOpen && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.25rem', paddingLeft: '0.75rem', borderLeft: '2px solid var(--primary-border)' }}>
                        {(chObj.units || []).map(unitObj => {
                          const uName = unitObj.unitName;
                          const isUnitMatch = qLower && (uName.toLowerCase().includes(qLower) || JSON.stringify(unitObj).toLowerCase().includes(qLower));
                          const isUnitOpen = isUnitMatch || !!openUnits[uName];

                          let totalTopicsInUnit = 0;
                          let completedTopicsInUnit = 0;
                          (unitObj.lessons || []).forEach(l => {
                            const topics = l.topics || [];
                            totalTopicsInUnit += topics.length;
                            completedTopicsInUnit += topics.filter(t => t && t.topicName && safeCompletedTopics[t.topicName]).length;
                          });
                          const unitPct = totalTopicsInUnit > 0 ? Math.round((completedTopicsInUnit / totalTopicsInUnit) * 100) : 0;

                          return (
                            <div key={uName} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', background: 'var(--bg-subtle)', borderRadius: 10, padding: '0.75rem' }}>
                              {/* Unit Accordion Header */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <button
                                  onClick={() => toggleUnit(uName)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justify: 'space-between',
                                    padding: 0,
                                    width: '100%',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <Layers size={15} color="var(--primary)" />
                                    <span>UNIT: {uName} ({(unitObj.lessons || []).length} Lessons)</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span className="badge badge-sage" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <CheckCircle size={11} /> {unitPct === 100 ? '✓ 100%' : `${unitPct}% (${completedTopicsInUnit}/${totalTopicsInUnit})`}
                                    </span>
                                    {isUnitOpen ? <ChevronDown size={16} color="var(--primary)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
                                  </div>
                                </button>

                                {/* Unit Progress Bar */}
                                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                                  <div style={{ height: '100%', width: `${unitPct}%`, background: '#10b981', borderRadius: 2, transition: 'width 0.4s ease' }} />
                                </div>
                              </div>

                              {/* Level 3: Lessons & Subtopics */}
                              {isUnitOpen && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem', paddingLeft: '0.5rem' }}>
                                  {(unitObj.lessons || []).map(les => {
                                    const lesName = les.lessonName;
                                    const isLesMatch = qLower && (lesName.toLowerCase().includes(qLower) || JSON.stringify(les).toLowerCase().includes(qLower));
                                    const isLesOpen = isLesMatch || !!openLessons[lesName];

                                    const topics = les.topics || [];
                                    const totalTopicsInLes = topics.length;
                                    const completedTopicsInLes = topics.filter(t => t && t.topicName && safeCompletedTopics[t.topicName]).length;
                                    const lesPct = totalTopicsInLes > 0 ? Math.round((completedTopicsInLes / totalTopicsInLes) * 100) : 0;
                                    const isLesDone = totalTopicsInLes > 0 && completedTopicsInLes === totalTopicsInLes;

                                    return (
                                      <div
                                        key={lesName}
                                        style={{
                                          background: 'var(--bg-surface)',
                                          border: '1px solid var(--border-subtle)',
                                          borderRadius: 8,
                                          padding: '0.65rem 0.85rem',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '0.4rem'
                                        }}
                                      >
                                        {/* Lesson Accordion Header */}
                                        <button
                                          onClick={() => toggleLesson(lesName)}
                                          style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-main)',
                                            fontSize: '0.88rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justify: 'space-between',
                                            padding: 0,
                                            width: '100%'
                                          }}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                            <GraduationCap size={15} color="var(--secondary)" />
                                            <span>{lesName}</span>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span style={{ fontSize: '0.72rem', color: isLesDone ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}>
                                              {isLesDone ? '✓ Mastered' : `${lesPct}% (${completedTopicsInLes}/${totalTopicsInLes})`}
                                            </span>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', padding: '0.12rem 0.4rem', borderRadius: 6, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                              <Clock size={11} /> 3 min
                                            </span>
                                            {isLesOpen ? <ChevronDown size={16} color="var(--primary)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
                                          </div>
                                        </button>

                                        {/* Level 4: Subtopics List & Action Buttons */}
                                        {isLesOpen && (
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-subtle)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                              {topics.map((top, idx) => {
                                                const isTopDone = top && top.topicName && !!safeCompletedTopics[top.topicName];
                                                return (
                                                  <div
                                                    key={idx}
                                                    style={{
                                                      fontSize: '0.8rem',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justify: 'space-between',
                                                      padding: '0.35rem 0.6rem',
                                                      borderRadius: 6,
                                                      background: isTopDone ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle)',
                                                      border: isTopDone ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent'
                                                    }}
                                                  >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                                      {isTopDone ? (
                                                        <CheckCircle size={14} color="#34d399" />
                                                      ) : (
                                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                                                      )}
                                                      <span style={{ color: isTopDone ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isTopDone ? 700 : 500 }}>
                                                        {top.topicName}
                                                      </span>
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                      {isTopDone && (
                                                        <span className="badge badge-sage" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                                                          ✓ Done
                                                        </span>
                                                      )}
                                                      <button
                                                        onClick={() => startSectionPlayer(top, lesName, uName, chName)}
                                                        style={{
                                                          padding: '0.2rem 0.55rem',
                                                          fontSize: '0.72rem',
                                                          borderRadius: 6,
                                                          background: isTopDone ? 'var(--bg-subtle)' : 'var(--primary-bg)',
                                                          border: isTopDone ? '1px solid var(--border-subtle)' : '1px solid var(--primary-border)',
                                                          color: isTopDone ? 'var(--text-muted)' : 'var(--primary)',
                                                          fontWeight: 700,
                                                          cursor: 'pointer',
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          gap: '0.25rem'
                                                        }}
                                                      >
                                                        <PlayCircle size={12} color={isTopDone ? 'var(--text-muted)' : 'var(--primary)'} /> {isTopDone ? 'Review' : 'Play'}
                                                      </button>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>

                                            <button
                                              className={isLesDone ? "btn btn-subtle" : "btn btn-primary"}
                                              onClick={() => startLessonPlayer(lesName)}
                                              style={{
                                                padding: '0.45rem 0.75rem',
                                                fontSize: '0.78rem',
                                                marginTop: '0.25rem',
                                                alignSelf: 'flex-start',
                                                ...(isLesDone ? {
                                                  background: 'var(--bg-subtle)',
                                                  border: '1px solid var(--border-subtle)',
                                                  color: 'var(--text-muted)',
                                                  boxShadow: 'none'
                                                } : {})
                                              }}
                                            >
                                              <PlayCircle size={14} color={isLesDone ? 'var(--text-muted)' : undefined} /> {isLesDone ? 'Review completed lesson' : 'Start complete lesson module'}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 💡 Curriculum Guide Card (Below Everything) */}
            <div className="glass-panel" style={{ padding: '1.25rem', marginTop: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
                <Sparkles size={16} color="var(--primary)" />
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  How the Curriculum is Structured
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>1. Chapters 📚</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    Major regional domains like Assam, Northeast 7 Sisters, and India Physiography.
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>2. Units 📁</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    Core thematic focus areas within each chapter (e.g. Physical Divisions, River Basins).
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary)' }}>3. Lessons 🎓</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    Interactive study modules with dedicated lesson players and micro-quizzes.
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary)' }}>4. Subtopics 📌</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    Bite-sized concept units, facts, vector maps, and active recall practice.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : viewMode === 'map_hub' ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button onClick={() => setViewMode('home')} className="btn btn-subtle" style={{ fontSize: '0.85rem' }}>
                <ArrowLeft size={16} /> Back to Home
              </button>

              <span className="badge badge-sage" style={{ fontSize: '0.8rem' }}>
                <Compass size={14} style={{ marginRight: 4, display: 'inline' }} /> Map Viwer
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0.2rem 0', color: 'var(--text-main)' }}>
                  Geography Map Inspector
                </h1>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                  Explore Assam districts, Northeast 7 Sisters, and Indian physiographic divisions interactively.
                </p>
              </div>

              {/* Upfront 3 Map Switcher Pills Inside Map Viewer */}
              <div className="zen-nav-pills">
                <button
                  className={`zen-nav-pill ${mapViewerTab === 'ASSAM' ? 'active' : ''}`}
                  onClick={() => setMapViewerTab('ASSAM')}
                >
                  📍 Assam Map
                </button>
                <button
                  className={`zen-nav-pill ${mapViewerTab === 'NE' ? 'active' : ''}`}
                  onClick={() => setMapViewerTab('NE')}
                >
                  🏔️ Northeast 7 Sisters
                </button>
                <button
                  className={`zen-nav-pill ${mapViewerTab === 'INDIA' ? 'active' : ''}`}
                  onClick={() => setMapViewerTab('INDIA')}
                >
                  🇮🇳 India Physiography
                </button>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', width: '100%' }}>
              <GeographyMap
                onSelectRegion={handleRegionSelect}
                activeRegion={selectedLesson}
                isAssam={mapViewerTab === 'ASSAM'}
                activeChapter={mapViewerTab}
              />
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
            completedTopics={completedTopics}
          />
        ) : null}
      </main>

      {/* 📱 Mobile-First Fixed Bottom Navigation Bar (Home Page Only) */}
      {viewMode === 'home' && (
        <MobileNavBar currentTab={currentNavTab} onTabChange={handleMobileTabChange} />
      )}
    </div>
  );
}
