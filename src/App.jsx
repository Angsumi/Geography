import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, Zap, Layers, Link2, Flame, Map, HelpCircle, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import indiaGeo from './data/india/GEography.json';
import assamGeo from './data/assam/GEography.json';
import neGeo from './data/northeast/GEography.json';

import indiaAct from './data/india/Activity.json';
import assamAct from './data/assam/Activity.json';
import neAct from './data/northeast/Activity.json';

import './index.css';
import Flashcard from './components/Flashcard';
import MatchGame from './components/MatchGame';
import ExamineMCQ from './components/ExamineMCQ';
import GeographyMap from './components/GeographyMap';
import { SectionVisualizer } from './components/SectionVisualizer';

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

// Map SectionName to Activity.json items
function getSectionActivity(sectionName, subtopicName) {
  const activitiesList = activityData.LearningActivities || [];
  let found = activitiesList.find(a => a.SectionName.toLowerCase().trim() === sectionName.toLowerCase().trim());
  
  if (!found) {
    // Partial search
    found = activitiesList.find(a => 
      a.SectionName.toLowerCase().includes(sectionName.toLowerCase()) || 
      sectionName.toLowerCase().includes(a.SectionName.toLowerCase())
    );
  }

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
  return null;
}

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

// ─── Parse Syllabus Hierarchy into Normalized Study Database & Plans ─────
function parseSyllabus(json) {
  const subjectsList = [];
  const syllabusHierarchy = [];
  const studyDb = {};

  const rawSubjects = json.GeographySyllabus || json.SubTopics || [];

  rawSubjects.forEach((subjectObj) => {
    const subjectName = subjectObj.Subject || subjectObj.Title || 'Geography';
    subjectsList.push(subjectName);

    const subjectItem = {
      subjectName,
      topics: []
    };

    const topics = subjectObj.Topics || subjectObj.SubTopics || [];
    topics.forEach((topicObj) => {
      const topicName = topicObj.TopicName || topicObj.Title || 'General Topic';
      const topicItem = {
        topicName,
        subtopics: []
      };

      const rawSubtopics = topicObj.Subtopics || topicObj.SubTopics || [];

      const buildSubtopicItem = (subName, rawSections, rawFacts) => {
        const sectionsList = [];
        const allFactLines = [];

        if (rawFacts && Array.isArray(rawFacts)) {
          const cleanFacts = rawFacts.map(f => f.replace(/\[cite:\s*\d+\]/g, '').trim()).filter(Boolean);
          if (cleanFacts.length > 0) {
            sectionsList.push({
              sectionName: 'General Overview',
              facts: cleanFacts
            });
            allFactLines.push(...cleanFacts);
          }
        }

        if (rawSections && Array.isArray(rawSections)) {
          rawSections.forEach(sec => {
            const secName = sec.SectionName || sec.Title || 'Key Highlights';
            const cleanFacts = (sec.Facts || []).map(f => f.replace(/\[cite:\s*\d+\]/g, '').trim()).filter(Boolean);
            sectionsList.push({
              sectionName: secName,
              facts: cleanFacts
            });
            allFactLines.push(...cleanFacts.map(f => `${secName}: ${f}`));
          });
        }

        // Generate Flashcards, MCQs, and Matching Game pairs from facts
        const flashcards = [];
        const mcqs = [];
        const matchPairs = [];

        if (allFactLines.length > 0) {
          allFactLines.forEach((factLine, fIdx) => {
            const parts = factLine.split(':');
            const keyTerm = parts.length > 1 ? parts[0].trim() : `${subName} Key Fact ${fIdx + 1}`;
            const valText = parts.length > 1 ? parts.slice(1).join(':').trim() : factLine.trim();

            flashcards.push({
              q: `What is a key fact regarding ${keyTerm}?`,
              a: valText,
              exp: `Part of ${subName} study notes under ${subjectName}.`
            });

            matchPairs.push({
              q: keyTerm,
              a: valText.length > 90 ? valText.substring(0, 87) + '...' : valText,
              exp: ''
            });
          });
        } else {
          flashcards.push({
            q: `What is ${subName}?`,
            a: `Key subtopic under ${topicName} in ${subjectName}.`,
            exp: `Refer to ${subjectName} syllabus notes.`
          });
          matchPairs.push({
            q: subName,
            a: `Key region under ${topicName}`,
            exp: ''
          });
        }

        const firstFact = allFactLines[0] || `${subName} is a key topic in ${subjectName}.`;
        mcqs.push({
          question: `Which of the following correctly describes ${subName}?`,
          options: {
            A: firstFact.replace(/^\*\*\s*/, '').replace(/\*\*/g, ''),
            B: `It is an arid desert landform exclusive to Western Australia.`,
            C: `It is a major glaciated trench system in the Pacific Ocean.`,
            D: `It represents a specialized marine ecosystem in the Caribbean.`
          },
          correctAnswer: 'A',
          explanation: `According to the syllabus, ${firstFact.replace(/\*\*/g, '')}`
        });

        if (allFactLines.length > 1) {
          const secondFact = allFactLines[1];
          mcqs.push({
            question: `Regarding ${subName}, which statement is accurate?`,
            options: {
              A: `It has no ecological significance or river drainage connection.`,
              B: secondFact.replace(/^\*\*\s*/, '').replace(/\*\*/g, ''),
              C: `It is an active subduction rift valley located in Iceland.`,
              D: `It is a closed depression formation in Antarctica.`
            },
            correctAnswer: 'B',
            explanation: `${secondFact.replace(/\*\*/g, '')}`
          });
        }

        studyDb[subName] = { flashcards, mcqs, match: matchPairs };

        return {
          subtopicName: subName,
          sections: sectionsList
        };
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

// High-quality aesthetic Unsplash images for geographic topics
const TOPIC_IMAGES = {
  // India
  'The Northern Mountains (The Himalayas)': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
  'The Northern Plains (Indo-Gangetic Plain)': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
  'The Peninsular Plateau (Including Central Territories)': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
  'The Indian Desert (Thar Desert)': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&auto=format&fit=crop&q=80',
  'The Coastal Plains': '/coastal_plains.jpg',
  'The Islands': '/islands.jpg',

  // Assam — keys must match SubtopicName exactly from GEography.json
  'Brahmaputra Valley (Sadiya to Dhubri, floods)': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
  'Central Plateau/Hills (Karbi Anglong, Haflong)': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  'Barak Valley': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80',
  'Ecological Frameworks': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
  'Mega-fauna Project Reserves': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80',
  'Transport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',

  // Northeast
  'Arunachal Pradesh': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
  'Manipur': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  'Meghalaya': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80'
};

const REGION_SUBDIVISIONS = {
  'india': [
    { name: 'The Northern Mountains (The Himalayas)', zone: 'Himalayan Mountains', label: 'Northern Mountains' },
    { name: 'The Northern Plains (Indo-Gangetic Plain)', zone: 'Northern Plains', label: 'Northern Plains' },
    { name: 'The Peninsular Plateau (Including Central Territories)', zone: 'Peninsular Plateau', label: 'Peninsular Plateau' },
    { name: 'The Indian Desert (Thar Desert)', zone: 'Thar Desert', label: 'Thar Desert' },
    { name: 'The Coastal Plains', zone: 'Coastal Plains', label: 'Coastal Plains' },
    { name: 'The Islands', zone: 'Islands', label: 'Islands' }
  ],
  'assam': [
    { name: 'Brahmaputra Valley (Sadiya to Dhubri, floods)', zone: 'Brahmaputra Valley', label: 'Brahmaputra Valley' },
    { name: 'Central Plateau/Hills (Karbi Anglong, Haflong)', zone: 'Central Hills', label: 'Central Hills' },
    { name: 'Barak Valley', zone: 'Barak Valley', label: 'Barak Valley' },
    { name: 'Ecological Frameworks', zone: 'Ecological Frameworks', label: 'Ecological Frameworks' },
    { name: 'Mega-fauna Project Reserves', zone: 'Mega-fauna Project Reserves', label: 'Mega-fauna Project Reserves' }
  ]
};

// Helper to parse pre-line text and structure markdown list markings cleanly
function renderStructuredContent(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {lines.map((line, idx) => {
        let cleanLine = line.trim();
        if (cleanLine.startsWith('*')) {
          cleanLine = cleanLine.substring(1).trim();
        }
        if (!cleanLine) return null;

        const boldMatch = cleanLine.match(/^[\*_]+([^\*_]+)[\*_]+:\s*(.*)/);
        if (boldMatch) {
          return (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '0.65rem 0.9rem', borderRadius: '10px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
              <div>
                <strong style={{ color: 'var(--primary)' }}>{boldMatch[1]}: </strong>
                <span style={{ color: 'var(--text-main)' }}>{boldMatch[2]}</span>
              </div>
            </li>
          );
        }

        return (
          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '0.65rem 0.9rem', borderRadius: '10px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
            <span style={{ color: 'var(--text-main)' }}>{cleanLine}</span>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Main App Component ───────────────────────────────
export default function App() {
  const [xp, setXp] = useState(() => loadState('adre_xp', 0));
  const [streak, setStreak] = useState(() => getStreak());
  const [activeChapter, setActiveChapter] = useState(() => chapters[0] || 'Indian Geography & Environment');
  
  // Navigation Mode
  const [currentSection, setCurrentSection] = useState('learn'); // 'learn' | 'practice' | 'examine'

  // Current Subtopic & Activity State
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [detailedViewSubdivision, setDetailedViewSubdivision] = useState(null);
  
  const [activeActivity, setActiveActivity] = useState(null); // null | 'flashcard' | 'match' | 'mcq'
  const [activeActivityData, setActiveActivityData] = useState(null);
  
  const detailsRef = useRef(null);

  // Sync XP
  useEffect(() => {
    saveState('adre_xp', xp);
  }, [xp]);

  let quickButtons = [];
  const currentSubj = syllabusHierarchy.find(s => s.subjectName === activeChapter);
  if (currentSubj) {
    currentSubj.topics.forEach(top => {
      top.subtopics.forEach(sub => {
        quickButtons.push({ name: sub.subtopicName, label: sub.subtopicName, topicName: top.topicName });
      });
    });
  }

  // Default to first subtopic on chapter change
  useEffect(() => {
    if (quickButtons.length > 0) {
      setSelectedSubtopic(quickButtons[0].name);
    } else {
      setSelectedSubtopic('');
    }
    setDetailedViewSubdivision(null);
    setActiveActivity(null);
  }, [activeChapter]);

  const addXp = (amount) => {
    setXp(prev => prev + amount);
    const today = new Date().toDateString();
    saveState('adre_last_play', today);
    setStreak(getStreak());
  };

  // Retrieve section blocks for selected subtopic
  const getSubtopicSections = () => {
    if (!selectedSubtopic) return { topicName: 'Overview', sections: [] };

    for (const subj of syllabusHierarchy) {
      if (subj.subjectName === activeChapter) {
        for (const top of subj.topics) {
          for (const sub of top.subtopics) {
            if (sub.subtopicName === selectedSubtopic) {
              return { topicName: top.topicName, sections: sub.sections };
            }
          }
        }
      }
    }
    // Fallback across active chapter and all subjects
    for (const subj of syllabusHierarchy) {
      for (const top of subj.topics) {
        for (const sub of top.subtopics) {
          const sName = sub.subtopicName.toLowerCase();
          const target = selectedSubtopic.toLowerCase();
          if (sName.includes(target) || target.includes(sName)) {
            return { topicName: top.topicName, sections: sub.sections };
          }
        }
      }
    }
    return { topicName: 'Overview', sections: [] };
  };
  // Extract Flashcard / MCQ / Match arrays
  const getStudyData = () => {
    let data = STUDY_DATABASE[selectedSubtopic];
    if (!data) {
      const foundKey = Object.keys(STUDY_DATABASE).find(k => 
        k.toLowerCase().includes(selectedSubtopic.toLowerCase()) || selectedSubtopic.toLowerCase().includes(k.toLowerCase())
      );
      if (foundKey) data = STUDY_DATABASE[foundKey];
    }
    return data || { flashcards: [], mcqs: [], match: [] };
  };

  const handleRegionSelect = (regionName) => {
    let targetSubtopic = regionName;
    
    // Map zone names from GeographyMap to actual JSON subtopic names
    if (regionName === 'Himalayan Mountains') {
      targetSubtopic = 'The Northern Mountains (The Himalayas)';
    } else if (regionName === 'Northern Plains') {
      targetSubtopic = 'The Northern Plains (Indo-Gangetic Plain)';
    } else if (regionName === 'Peninsular Plateau') {
      targetSubtopic = 'The Peninsular Plateau (Including Central Territories)';
    } else if (regionName === 'Thar Desert') {
      targetSubtopic = 'The Indian Desert (Thar Desert)';
    }

    setSelectedSubtopic(targetSubtopic);
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle activity completions
  const handleActivityComplete = (earnedPoints) => {
    addXp(earnedPoints || 10);
    setActiveActivity(null);
  };

  const startFlashcard = (customData) => {
    setActiveActivityData(customData || null);
    setActiveActivity('flashcard');
  };
  const startMatch = (customData) => {
    setActiveActivityData(customData || null);
    setActiveActivity('match');
  };
  const startMCQ = (customData) => {
    setActiveActivityData(customData || null);
    setActiveActivity('mcq');
  };

  const imageUrl = () => {
    const rawUrl = TOPIC_IMAGES[selectedSubtopic] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80';
    if (rawUrl.startsWith('/')) {
      return `${import.meta.env.BASE_URL}${rawUrl.slice(1)}`;
    }
    return rawUrl;
  };

  const getChapterShortName = (name) => {
    return name.replace(/^\d+[\.\_]\s*/, '');
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <header className="glass-panel" style={{ padding: '1rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
            <Map size={22} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', lineHeight: 1.2 }}>ADRE Geography Hub</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Geography Mastery</span>
          </div>
        </div>

        {/* User Stats Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
            <Trophy size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>{xp} XP</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
            <Flame size={16} color="#f97316" />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f97316' }}>{streak} Day Streak</span>
          </div>
        </div>
      </header>

      {/* ─── Chapter Selector Tabs ─────────────────────────── */}
      <nav style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {chapters.map(ch => {
          const isActive = activeChapter === ch;
          return (
            <button
              key={ch}
              onClick={() => {
                setActiveChapter(ch);
                setDetailedViewSubdivision(null);
                setActiveActivity(null);
              }}
              className="btn"
              style={{
                background: isActive ? 'linear-gradient(135deg, var(--primary), #10b981)' : 'var(--glass-bg)',
                color: isActive ? '#000' : 'var(--text-main)',
                border: isActive ? 'none' : '1px solid var(--glass-border)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                padding: '0.65rem 1.25rem'
              }}
            >
              {getChapterShortName(ch)}
            </button>
          );
        })}
      </nav>



      {/* ─── Main Content Views ────────────────────────────── */}
      <div style={{ flex: 1 }}>
        
        {/* Active Activity Overlay Modal (Flashcard, Match Game, MCQ) */}
        {activeActivity ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2rem' }}>
            <button
              onClick={() => setActiveActivity(null)}
              className="btn btn-glass"
              style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={16} /> Back to Hub
            </button>

            {activeActivity === 'flashcard' && (
              <Flashcard 
                data={activeActivityData?.flashcards || getStudyData().flashcards} 
                onComplete={handleActivityComplete} 
              />
            )}

            {activeActivity === 'match' && (
              <MatchGame 
                data={activeActivityData?.match || getStudyData().match} 
                onComplete={handleActivityComplete} 
              />
            )}

            {activeActivity === 'mcq' && (
              <ExamineMCQ 
                data={activeActivityData?.mcqs || getStudyData().mcqs} 
                onComplete={handleActivityComplete} 
              />
            )}
          </motion.div>
        ) : detailedViewSubdivision ? (
          /* Dedicated Study Page for Subdivision */
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button
              onClick={() => setDetailedViewSubdivision(null)}
              className="btn btn-glass"
              style={{ width: 'fit-content', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={16} /> Back to Geography Hub
            </button>

            {/* Banner Title */}
            <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: '2.5rem 2rem', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <img 
                src={imageUrl()} 
                alt={selectedSubtopic} 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} 
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                  {activeChapter}
                </span>
                <h1 style={{ margin: '0.2rem 0 0', fontSize: '2.2rem' }}>{selectedSubtopic}</h1>
              </div>
            </div>

            {/* Subtopic Sections rendering with dedicated visual cards & individual sidebars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {getSubtopicSections().sections.map((sec, idx) => {
                const sectionActData = getSectionActivity(sec.sectionName, selectedSubtopic);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}
                  >
                    {/* Section Main Content Card */}
                    <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--primary)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Zap size={18} color="var(--primary)" /> {sec.sectionName}
                        </h3>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(74, 222, 128, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>
                          Section {idx + 1}
                        </span>
                      </div>

                      {/* Section Visualizer Component from Viz.json */}
                      <SectionVisualizer sectionName={sec.sectionName} facts={sec.facts} />

                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                        {sec.facts.map((fact, fIdx) => (
                          <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
                            <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Section Dedicated Learning Activities Side Bar */}
                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(129, 140, 248, 0.3)', background: 'rgba(15, 23, 42, 0.6)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1rem', color: 'var(--secondary)' }}>
                          <GraduationCap size={18} color="var(--secondary)" /> Learning Activities
                        </h4>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Section {idx + 1}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => startFlashcard(sectionActData)} 
                          style={{ justifyContent: 'space-between', padding: '0.8rem 1rem', fontSize: '0.85rem' }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Layers size={16} /> Visual Flashcards</span>
                          <span className="badge" style={{ background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.75rem' }}>+10 pts</span>
                        </button>

                        <button 
                          className="btn btn-glass" 
                          onClick={() => startMatch(sectionActData)} 
                          style={{ justifyContent: 'space-between', padding: '0.8rem 1rem', fontSize: '0.85rem', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Link2 size={16} /> Practice Matching</span>
                          <span className="badge" style={{ background: 'rgba(129, 140, 248, 0.2)', color: 'var(--secondary)', fontSize: '0.75rem' }}>+10 pts</span>
                        </button>

                        <button 
                          className="btn btn-glass" 
                          onClick={() => startMCQ(sectionActData)} 
                          style={{ justifyContent: 'space-between', padding: '0.8rem 1rem', fontSize: '0.85rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HelpCircle size={16} /> Examine MCQ</span>
                          <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', fontSize: '0.75rem' }}>+10 pts</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Hub Landing Views */
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Header */}
            <div>
              <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Geography Mode</span>
              <h1 style={{ fontSize: '2.2rem', margin: '0.2rem 0' }}>{getChapterShortName(activeChapter)}</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Explore physical regions, practice matching key traits, and examine your knowledge.</p>
            </div>

            {/* Hub Landing View */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Top Section: Map */}
              <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  🗺️ Interactive Region Selection
                </h3>
                <GeographyMap 
                  onSelectRegion={handleRegionSelect} 
                  activeRegion={selectedSubtopic} 
                  isAssam={activeChapter.toLowerCase().includes('assam')} 
                  activeChapter={activeChapter}
                />
              </div>

              {/* Quick subtopic selectors directly under map */}
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subtopic Select:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {quickButtons.map(btn => {
                    const isSelected = selectedSubtopic === btn.name;
                    return (
                      <button
                        key={btn.name}
                        onClick={() => { handleRegionSelect(btn.name); }}
                        className="btn"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.4rem 0.8rem',
                          background: isSelected ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255,255,255,0.02)',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                        }}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Section: Clickable Banner */}
              <div ref={detailsRef} style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                {selectedSubtopic ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click the banner below to open the dedicated study page:</p>
                    
                    <motion.div 
                      whileHover={{ scale: 1.01, borderColor: 'var(--primary)' }}
                      onClick={() => setDetailedViewSubdivision(selectedSubtopic)}
                      className="glass-panel" 
                      style={{ 
                        padding: 0, 
                        overflow: 'hidden', 
                        border: '1px solid var(--glass-border)', 
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        transition: 'border-color 0.3s'
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: '220px' }}>
                        {/* Banner Image */}
                        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                          <img 
                            src={imageUrl()} 
                            alt={selectedSubtopic} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(15, 17, 26, 0.95))' }} />
                        </div>

                        {/* Preview Details */}
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
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
