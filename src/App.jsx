import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, Zap, Layers, Link2, Flame, Map, HelpCircle, BookOpen, GraduationCap, ChevronRight, RotateCcw, Menu, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import indiaGeo from './data/india/GEography.json';
import assamGeo from './data/assam/GEography.json';
import neGeo from './data/northeast/GEography.json';

import indiaAct from './data/india/Activity.json';
import assamAct from './data/assam/Activity.json';
import neAct from './data/northeast/Activity.json';
import { isNameMatch } from './utils/stringMatcher';

import './index.css';
import Flashcard from './components/Flashcard';
import MatchGame from './components/MatchGame';
import ExamineMCQ from './components/ExamineMCQ';
import GeographyMap from './components/GeographyMap';
import { SectionVisualizer } from './components/SectionVisualizer';
import { HomePage } from './components/HomePage';

// Combine regional JSON files into unified syllabus and activities arrays
const syllabusData = {
  GeographySyllabus: [
    ...(indiaGeo.GeographySyllabus || []),
    ...(assamGeo.GeographySyllabus || []),
    ...(neGeo.GeographySyllabus || [])
  ]
};

const activityData = {
  LearningActivities: [
    ...(indiaAct.LearningActivities || []),
    ...(assamAct.LearningActivities || []),
    ...(neAct.LearningActivities || [])
  ]
};

// ─── Map SectionName to Activity.json items ─────────────────────────────────
// Uses isNameMatch (normalised fuzzy match) so edits to section names in
// GEography.json never silently break the learning activities.
function getSectionActivity(sectionName) {
  const activitiesList = activityData.LearningActivities || [];
  const found = activitiesList.find(a => isNameMatch(a.SectionName, sectionName));

  if (found) {
    const flashcards = (found.VisualFlashcards || []).map(f => ({
      q: f.Front.replace(/\[cite:\s*\d+\]/g, '').trim(),
      a: f.Back.replace(/\[cite:\s*\d+\]/g, '').trim(),
      img: f.Image ? (f.Image.startsWith('/') ? `${import.meta.env.BASE_URL}${f.Image.slice(1)}` : f.Image) : null,
      exp: `Section: ${sectionName}`
    }));
    const match = (found.PracticeMatching || []).map(m => ({
      q: m.Term.replace(/\[cite:\s*\d+\]/g, '').trim(),
      a: m.Definition.replace(/\[cite:\s*\d+\]/g, '').trim(),
      exp: ''
    }));
    const mcqs = (found.ExamineMCQ || []).map(mc => {
      const cleanOpts = (mc.Options || []).map(o => o.replace(/\[cite:\s*\d+\]/g, '').trim());
      const cleanAns = mc.CorrectAnswer.replace(/\[cite:\s*\d+\]/g, '').trim();
      let ansKey = 'A';
      if (cleanOpts[1] === cleanAns) ansKey = 'B';
      else if (cleanOpts[2] === cleanAns) ansKey = 'C';
      else if (cleanOpts[3] === cleanAns) ansKey = 'D';

      return {
        question: mc.Question.replace(/\[cite:\s*\d+\]/g, '').trim(),
        options: {
          A: cleanOpts[0] || 'Option A',
          B: cleanOpts[1] || 'Option B',
          C: cleanOpts[2] || 'Option C',
          D: cleanOpts[3] || 'Option D'
        },
        correctAnswer: ansKey,
        explanation: `Correct Answer: ${cleanAns}`
      };
    });

    return { flashcards, match, mcqs };
  }
  return null; // null = no curated data, fall back to STUDY_DATABASE
}

// ─── localStorage helpers ─────────────────────────────────────────────────
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

// ─── Parse Syllabus Hierarchy into Normalized Study Database & Plans ─────────
// Builds: syllabusHierarchy, studyDb (fallback activities from facts), subjectsList
function parseSyllabus(json) {
  const subjectsList = [];
  const syllabusHierarchy = [];
  const studyDb = {};

  const rawSubjects = json.GeographySyllabus || json.SubTopics || [];

  rawSubjects.forEach((subjectObj) => {
    const subjectName = subjectObj.Subject || subjectObj.Title || 'Geography';
    subjectsList.push(subjectName);

    const subjectItem = { subjectName, topics: [] };

    const topics = subjectObj.Topics || subjectObj.SubTopics || [];
    topics.forEach((topicObj) => {
      const topicName = topicObj.TopicName || topicObj.Title || 'General Topic';
      const topicItem = { topicName, subtopics: [] };
      const rawSubtopics = topicObj.Subtopics || topicObj.SubTopics || [];

      const buildSubtopicItem = (subName, rawSections, rawFacts) => {
        const sectionsList = [];
        const allFactLines = [];

        if (rawFacts && Array.isArray(rawFacts)) {
          const cleanFacts = rawFacts.map(f => f.replace(/\[cite:\s*\d+\]/g, '').trim()).filter(Boolean);
          if (cleanFacts.length > 0) {
            sectionsList.push({ sectionName: 'General Overview', facts: cleanFacts });
            allFactLines.push(...cleanFacts);
          }
        }

        if (rawSections && Array.isArray(rawSections)) {
          rawSections.forEach(sec => {
            const secName = sec.SectionName || sec.Title || 'Key Highlights';
            const cleanFacts = (sec.Facts || []).map(f => f.replace(/\[cite:\s*\d+\]/g, '').trim()).filter(Boolean);
            sectionsList.push({ sectionName: secName, facts: cleanFacts });
            allFactLines.push(...cleanFacts.map(f => `${secName}: ${f}`));
          });
        }

        // Fallback flashcard/MCQ/match arrays generated from raw facts
        const flashcards = [];
        const mcqs = [];
        const matchPairs = [];

        if (allFactLines.length > 0) {
          allFactLines.forEach((factLine, fIdx) => {
            const parts = factLine.split(':');
            const keyTerm = parts.length > 1 ? parts[0].trim() : `${subName} Key Fact ${fIdx + 1}`;
            const valText = parts.length > 1 ? parts.slice(1).join(':').trim() : factLine.trim();
            flashcards.push({ q: `What is a key fact regarding ${keyTerm}?`, a: valText, exp: `Part of ${subName} study notes under ${subjectName}.` });
            matchPairs.push({ q: keyTerm, a: valText.length > 90 ? valText.substring(0, 87) + '...' : valText, exp: '' });
          });
        } else {
          flashcards.push({ q: `What is ${subName}?`, a: `Key subtopic under ${topicName} in ${subjectName}.`, exp: `Refer to ${subjectName} syllabus notes.` });
          matchPairs.push({ q: subName, a: `Key region under ${topicName}`, exp: '' });
        }

        const firstFact = allFactLines[0] || `${subName} is a key topic in ${subjectName}.`;
        mcqs.push({
          question: `Which of the following correctly describes ${subName}?`,
          options: { A: firstFact.replace(/^\*\*\s*/, '').replace(/\*\*/g, ''), B: `It is an arid desert landform exclusive to Western Australia.`, C: `It is a major glaciated trench system in the Pacific Ocean.`, D: `It represents a specialized marine ecosystem in the Caribbean.` },
          correctAnswer: 'A',
          explanation: `According to the syllabus, ${firstFact.replace(/\*\*/g, '')}`
        });

        if (allFactLines.length > 1) {
          const secondFact = allFactLines[1];
          mcqs.push({
            question: `Regarding ${subName}, which statement is accurate?`,
            options: { A: `It has no ecological significance or river drainage connection.`, B: secondFact.replace(/^\*\*\s*/, '').replace(/\*\*/g, ''), C: `It is an active subduction rift valley located in Iceland.`, D: `It is a closed depression formation in Antarctica.` },
            correctAnswer: 'B',
            explanation: `${secondFact.replace(/\*\*/g, '')}`
          });
        }

        studyDb[subName] = { flashcards, mcqs, match: matchPairs };
        return { subtopicName: subName, sections: sectionsList };
      };

      if (rawSubtopics.length > 0) {
        rawSubtopics.forEach(sub => {
          const subName = sub.SubtopicName || sub.Title || 'Subtopic';
          topicItem.subtopics.push(buildSubtopicItem(subName, sub.Sections, sub.Facts));
        });
      } else {
        topicItem.subtopics.push(buildSubtopicItem(topicName, topicObj.Sections, topicObj.Facts));
      }

      subjectItem.topics.push(topicItem);
    });

    syllabusHierarchy.push(subjectItem);
  });

  return { subjectsList, syllabusHierarchy, studyDb };
}

const { subjectsList: chapters, syllabusHierarchy, studyDb: STUDY_DATABASE } = parseSyllabus(syllabusData);

// Bold and Vivid Chapter styling configurations
const CHAPTER_STYLES = {
  'INDIA': {
    activeBg: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,182,212,0.25))',
    textGradient: 'linear-gradient(135deg, #34d399, #38bdf8)',
    activeBorder: '1px solid #10b981',
    activeColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.5)',
    glow: '0 0 16px rgba(16,185,129,0.35)',
    icon: '🇮🇳'
  },
  'ASSAM': {
    activeBg: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(249,115,22,0.25))',
    textGradient: 'linear-gradient(135deg, #fbbf24, #fb923c)',
    activeBorder: '1px solid #f97316',
    activeColor: '#fb923c',
    glowColor: 'rgba(251, 146, 60, 0.5)',
    glow: '0 0 16px rgba(249,115,22,0.35)',
    icon: '🦏'
  },
  'NE': {
    activeBg: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.25))',
    textGradient: 'linear-gradient(135deg, #c084fc, #f472b6)',
    activeBorder: '1px solid #ec4899',
    activeColor: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.5)',
    glow: '0 0 16px rgba(236,72,153,0.35)',
    icon: '🏔️'
  }
};

// Topic hero images
const TOPIC_IMAGES = {
  'Himalayas': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
  'Northern Plains': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
  'Peninsular Plateau': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
  'Thar & Coastal Plains': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&auto=format&fit=crop&q=80',
  'Islands': '/islands.jpg',
  'Himalayan Rivers': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
  'Peninsular Rivers': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80',
  'Biodiversity Hotspots': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
  'Natural Heritage': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80',
  'Biosphere Reserves': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  'Brahmaputra Valley': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
  'Central Hills': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  'Barak Valley': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80',
  'Ecology': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
  'Wildlife Reserves': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80',
  'Transport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
  'Arunachal Pradesh': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
  'Assam Profile': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
  'Manipur': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  'Meghalaya': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  'Mizoram': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80',
  'Nagaland': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
  'Tripura': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  'NE Heritage': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80',
  'NE Biosphere': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80'
};

// ─── Main App Component ───────────────────────────────────────────────────
export default function App() {
  const [xp, setXp] = useState(() => loadState('adre_xp', 0));
  const [streak, setStreak] = useState(() => getStreak());
  const [activeChapter, setActiveChapter] = useState(() => chapters[0] || 'INDIA');
  const [viewMode, setViewMode] = useState('home'); // 'home' | 'chapter'

  // Mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Current Subtopic & Activity State
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [detailedViewSubdivision, setDetailedViewSubdivision] = useState(null);
  const [activeActivity, setActiveActivity] = useState(null);
  const [activeActivityData, setActiveActivityData] = useState(null);

  const detailsRef = useRef(null);

  useEffect(() => { saveState('adre_xp', xp); }, [xp]);

  // Build quick-select subtopic buttons for the current chapter
  let quickButtons = [];
  const currentSubj = syllabusHierarchy.find(s => s.subjectName === activeChapter);
  if (currentSubj) {
    currentSubj.topics.forEach(top => {
      top.subtopics.forEach(sub => {
        quickButtons.push({ name: sub.subtopicName, label: sub.subtopicName, topicName: top.topicName, sectionsCount: sub.sections.length });
      });
    });
  }

  // Default to first subtopic on chapter change
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
    // Fuzzy fallback
    for (const subj of syllabusHierarchy) {
      for (const top of subj.topics) {
        for (const sub of top.subtopics) {
          const s = sub.subtopicName.toLowerCase(), t = selectedSubtopic.toLowerCase();
          if (s.includes(t) || t.includes(s)) return { topicName: top.topicName, sections: sub.sections };
        }
      }
    }
    return { topicName: 'Overview', sections: [] };
  };

  // Fallback from STUDY_DATABASE when no curated Activity.json entry exists
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

  const handleRegionSelect = (regionName) => {
    let target = regionName;
    if (regionName === 'Himalayan Mountains' || regionName === 'The Northern Mountains (The Himalayas)') target = 'Himalayas';
    else if (regionName === 'Northern Plains' || regionName === 'The Northern Plains (Indo-Gangetic Plain)') target = 'Northern Plains';
    else if (regionName === 'Peninsular Plateau' || regionName === 'The Peninsular Plateau (Including Central Territories)') target = 'Peninsular Plateau';
    else if (regionName === 'Thar Desert' || regionName === 'The Indian Desert (Thar Desert)' || regionName === 'Coastal Plains') target = 'Thar & Coastal Plains';

    setSelectedSubtopic(target);
    setIsSidebarOpen(false);
    if (detailsRef.current) detailsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleActivityComplete = (pts) => { addXp(pts || 10); setActiveActivity(null); };
  const startFlashcard = (d) => { setActiveActivityData(d || null); setActiveActivity('flashcard'); };
  const startMatch     = (d) => { setActiveActivityData(d || null); setActiveActivity('match'); };
  const startMCQ       = (d) => { setActiveActivityData(d || null); setActiveActivity('mcq'); };

  const imageUrl = () => {
    const raw = TOPIC_IMAGES[selectedSubtopic] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80';
    return raw.startsWith('/') ? `${import.meta.env.BASE_URL}${raw.slice(1)}` : raw;
  };

  const getChapterShortName = (name) => name.replace(/^\d+[\.\_]\s*/, '');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#090d16', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>

      {/* ─── Sticky Header ─── */}
      <header className="glass-panel app-header" style={{ padding: '0.85rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', borderRadius: 0, position: 'sticky', top: 0, zIndex: 110 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
          {/* Prominent Sidebar Toggle Button & Sign */}
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarOpen(v => !v)}
            aria-label="Toggle Syllabus Sidebar"
            title="Click to toggle Syllabus Sidebar Menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: isSidebarOpen ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1.5px solid ${isSidebarOpen ? '#34d399' : 'rgba(255, 255, 255, 0.15)'}`,
              color: isSidebarOpen ? '#34d399' : '#f8fafc',
              padding: '0.45rem 0.85rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.8rem',
              letterSpacing: '0.02em',
              transition: 'all 0.2s ease',
              boxShadow: isSidebarOpen ? '0 0 14px rgba(52, 211, 153, 0.35)' : 'none'
            }}
          >
            {isSidebarOpen ? <X size={17} /> : <Menu size={17} />}
            <span>{isSidebarOpen ? 'Hide Menu' : '📑 Topics Menu'}</span>
          </button>

          <div onClick={() => setViewMode('home')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', minWidth: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <Map size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>ADRE Geography Hub</h2>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Interactive Syllabus Mastery Dashboard</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => setViewMode('home')}
            style={{
              background: viewMode === 'home' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${viewMode === 'home' ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`,
              color: viewMode === 'home' ? '#38bdf8' : '#cbd5e1',
              padding: '0.35rem 0.75rem',
              borderRadius: 15,
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 'bold',
              transition: 'all 0.15s'
            }}
          >
            <Home size={14} /> Home
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.7rem', borderRadius: 15, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Trophy size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>{xp} XP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.7rem', borderRadius: 15, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Flame size={14} color="#f97316" />
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#f97316' }}>{streak} Day Streak</span>
          </div>
          <button
            onClick={() => { if (window.confirm('Reset all XP, study progress, and streaks?')) { localStorage.clear(); window.location.reload(); } }}
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', padding: '0.35rem 0.65rem', borderRadius: 15, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold' }}
          >
            <RotateCcw size={10} /> Reset
          </button>
        </div>
      </header>

      {/* ─── Two-Column Layout ─── */}
      <div className="subdivision-grid" style={{ flex: 1 }}>

        {/* LEFT: Sidebar */}
        <aside className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>

          <div>
            <span className="sidebar-label">Select Subject</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {chapters.map(ch => {
                const shortName = getChapterShortName(ch).toUpperCase();
                const isActive = activeChapter === ch;
                const styleConfig = CHAPTER_STYLES[shortName] || {
                  activeBg: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(16,185,129,0.2))',
                  activeBorder: '1px solid var(--primary)',
                  activeColor: 'var(--primary)',
                  glow: '0 0 14px rgba(74,222,128,0.3)',
                  icon: '📍'
                };

                return (
                  <button key={ch} onClick={() => { setActiveChapter(ch); setViewMode('chapter'); setDetailedViewSubdivision(null); setActiveActivity(null); setIsSidebarOpen(false); }}
                    style={{
                      background: isActive ? styleConfig.activeBg : 'rgba(255,255,255,0.02)',
                      color: isActive ? styleConfig.activeColor : '#cbd5e1',
                      border: isActive ? styleConfig.activeBorder : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive ? styleConfig.glow : 'none',
                      padding: '0.75rem 1rem',
                      borderRadius: 10,
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      textTransform: 'uppercase'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.05rem', filter: isActive ? 'drop-shadow(0 0 4px currentColor)' : 'none' }}>{styleConfig.icon}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.06em' }}>{shortName}</span>
                    </div>
                    <ChevronRight size={16} opacity={isActive ? 1 : 0.4} color={isActive ? styleConfig.activeColor : '#94a3b8'} />
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflow: 'hidden' }}>
            <span className="sidebar-label">Subtopics</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', flex: 1, paddingRight: 2 }}>
              {(() => {
                const sName = getChapterShortName(activeChapter).toUpperCase();
                const cfg = CHAPTER_STYLES[sName] || {
                  activeColor: '#34d399',
                  glowColor: 'rgba(52, 211, 153, 0.4)',
                  activeBg: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))'
                };

                return quickButtons.map(btn => {
                  const isSelected = selectedSubtopic === btn.name;
                  return (
                    <button key={btn.name} onClick={() => { setSelectedSubtopic(btn.name); setDetailedViewSubdivision(null); setActiveActivity(null); setIsSidebarOpen(false); }}
                      style={{
                        background: isSelected ? cfg.activeBg : 'rgba(255,255,255,0.015)',
                        border: `1px solid ${isSelected ? cfg.activeColor : 'rgba(255,255,255,0.05)'}`,
                        boxShadow: isSelected ? `0 0 12px ${cfg.glowColor}` : 'none',
                        color: isSelected ? cfg.activeColor : '#e2e8f0',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 10,
                        fontSize: '0.78rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        width: '100%',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ fontWeight: isSelected ? 800 : 600, wordBreak: 'break-word', fontSize: '0.82rem' }}>{btn.name}</div>
                      <div style={{ fontSize: '0.62rem', color: isSelected ? cfg.activeColor : '#64748b', opacity: isSelected ? 0.9 : 0.7, marginTop: 3 }}>{btn.topicName} · {btn.sectionsCount} sections</div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, top: 60, zIndex: 90, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
          />
        )}

        {/* RIGHT: Main Content */}
        <main style={{ padding: '1.5rem', overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 60px)', minWidth: 0 }}>

          {viewMode === 'home' ? (
            <HomePage onSelectChapter={(ch) => {
              setActiveChapter(ch);
              setViewMode('chapter');
              setDetailedViewSubdivision(null);
              setActiveActivity(null);
            }} />
          ) : activeActivity ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2rem' }}>
              <button onClick={() => setActiveActivity(null)} className="btn btn-glass" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <ArrowLeft size={16} /> Back to Hub
              </button>
              {activeActivity === 'flashcard' && <Flashcard data={activeActivityData?.flashcards || getStudyData().flashcards} onComplete={handleActivityComplete} />}
              {activeActivity === 'match'     && <MatchGame  data={activeActivityData?.match     || getStudyData().match}      onComplete={handleActivityComplete} />}
              {activeActivity === 'mcq'       && <ExamineMCQ data={activeActivityData?.mcqs      || getStudyData().mcqs}       onComplete={handleActivityComplete} />}
            </motion.div>

          ) : detailedViewSubdivision ? (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <button onClick={() => setDetailedViewSubdivision(null)} className="btn btn-glass" style={{ width: 'fit-content', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <ArrowLeft size={16} /> Back to Geography Hub
              </button>

              {/* Banner */}
              <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: '2.5rem 2rem', minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <img src={imageUrl()} alt={selectedSubtopic} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '0.05em' }}>{activeChapter}</span>
                  <h1 style={{ margin: '0.2rem 0 0', fontSize: '2.2rem' }}>{selectedSubtopic}</h1>
                </div>
              </div>

              {/* Section cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {getSubtopicSections().sections.map((sec, idx) => {
                  const curatedData = getSectionActivity(sec.sectionName);
                  const sectionActData = curatedData || getStudyData();
                  return (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}
                      className="section-card-grid"
                    >
                      {/* Content card */}
                      <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--primary)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Zap size={18} color="var(--primary)" /> {sec.sectionName}
                          </h3>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(74,222,128,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: 12, fontWeight: 'bold' }}>
                            Section {idx + 1}
                          </span>
                        </div>
                        <SectionVisualizer sectionName={sec.sectionName} facts={sec.facts} />
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                          {sec.facts.map((fact, fIdx) => (
                            <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: 10 }}>
                              <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
                              <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Activities sidebar */}
                      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(129,140,248,0.3)', background: 'rgba(15,23,42,0.6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1rem', color: 'var(--secondary)' }}>
                            <GraduationCap size={18} color="var(--secondary)" /> Learning Activities
                          </h4>
                          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Section {idx + 1}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <button className="btn btn-primary" onClick={() => startFlashcard(sectionActData)} style={{ justifyContent: 'space-between', padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Layers size={16} /> Visual Flashcards</span>
                            <span className="badge" style={{ background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.75rem' }}>+10 pts</span>
                          </button>
                          <button className="btn btn-glass" onClick={() => startMatch(sectionActData)} style={{ justifyContent: 'space-between', padding: '0.8rem 1rem', fontSize: '0.85rem', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Link2 size={16} /> Practice Matching</span>
                            <span className="badge" style={{ background: 'rgba(129,140,248,0.2)', color: 'var(--secondary)', fontSize: '0.75rem' }}>+10 pts</span>
                          </button>
                          <button className="btn btn-glass" onClick={() => startMCQ(sectionActData)} style={{ justifyContent: 'space-between', padding: '0.8rem 1rem', fontSize: '0.85rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HelpCircle size={16} /> Examine MCQ</span>
                            <span className="badge" style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', fontSize: '0.75rem' }}>+10 pts</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

          ) : (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Geography Mode</span>
                {(() => {
                  const sName = getChapterShortName(activeChapter).toUpperCase();
                  const cfg = CHAPTER_STYLES[sName] || {
                    activeColor: '#34d399',
                    glowColor: 'rgba(52, 211, 153, 0.5)',
                    icon: '📍'
                  };
                  return (
                    <h1 style={{
                      fontSize: '2.6rem',
                      fontWeight: 900,
                      margin: '0.25rem 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: cfg.activeColor || '#34d399',
                      textShadow: `0 0 24px ${cfg.glowColor || 'rgba(52, 211, 153, 0.5)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem'
                    }}>
                      <span style={{ fontSize: '2.2rem' }}>{cfg.icon}</span>
                      <span>{sName}</span>
                    </h1>
                  );
                })()}
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Explore physical regions, practice matching key traits, and examine your knowledge.</p>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: 800, margin: '0 auto', width: '100%' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  🗺️ Interactive Region Selection
                </h3>
                <GeographyMap onSelectRegion={handleRegionSelect} activeRegion={selectedSubtopic} isAssam={activeChapter.toLowerCase().includes('assam')} activeChapter={activeChapter} />
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subtopic Select:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(() => {
                    const sName = getChapterShortName(activeChapter).toUpperCase();
                    const cfg = CHAPTER_STYLES[sName] || {
                      activeColor: '#34d399',
                      glowColor: 'rgba(52, 211, 153, 0.4)',
                      activeBg: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))'
                    };

                    return quickButtons.map(btn => {
                      const isSelected = selectedSubtopic === btn.name;
                      return (
                        <button key={btn.name} onClick={() => handleRegionSelect(btn.name)} className="btn"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.45rem 0.85rem',
                            background: isSelected ? cfg.activeBg : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isSelected ? cfg.activeColor : 'rgba(255,255,255,0.06)'}`,
                            color: isSelected ? cfg.activeColor : 'var(--text-main)',
                            boxShadow: isSelected ? `0 0 10px ${cfg.glowColor}` : 'none',
                            fontWeight: isSelected ? 800 : 500
                          }}
                        >
                          {btn.label}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              <div ref={detailsRef} style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                {selectedSubtopic ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click the banner below to open the dedicated study page:</p>
                    <motion.div whileHover={{ scale: 1.01, borderColor: 'var(--primary)' }} onClick={() => setDetailedViewSubdivision(selectedSubtopic)}
                      className="glass-panel"
                      style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--glass-border)', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'border-color 0.3s' }}
                    >
                      <div className="detailed-banner-grid">
                        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 200 }}>
                          <img src={imageUrl()} alt={selectedSubtopic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(15,17,26,0.95))' }} />
                        </div>
                        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold' }}>Geographic Division</span>
                          <h2 style={{ margin: 0, fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {selectedSubtopic} <ChevronRight size={20} color="var(--primary)" />
                          </h2>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
                            {getSubtopicSections().sections.slice(0, 2).map((s, i) => (
                              <p key={i} style={{ margin: '0 0 0.4rem', color: 'var(--text-main)' }}>
                                <strong style={{ color: 'var(--primary)' }}>{s.sectionName}:</strong> {s.facts[0] || ''}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Select a subdivision to load preview.</p>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
