import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Award, CheckCircle2, BookOpen, MapPin, Sparkles, TrendingUp } from 'lucide-react';

export function ProgressDashboard({ xp, streak, syllabusHierarchy }) {
  // Calculate level based on XP
  const level = Math.floor(xp / 100) + 1;
  const xpForNextLevel = level * 100;
  const currentLevelXp = xp % 100;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXp / 100) * 100));

  let levelTitle = 'Geography Explorer';
  if (level >= 10) levelTitle = 'Assam Geography Master 🏆';
  else if (level >= 5) levelTitle = 'APSC Candidate Specialist 🎯';
  else if (level >= 3) levelTitle = 'ADRE Scholar 📚';

  // Topic counts across chapters
  const assamSubj = syllabusHierarchy?.find(s => s.subjectName === 'ASSAM');
  const indiaSubj = syllabusHierarchy?.find(s => s.subjectName === 'INDIA');
  const neSubj = syllabusHierarchy?.find(s => s.subjectName === 'NE');

  const assamTopicsCount = assamSubj?.topics?.length || 4;
  const indiaTopicsCount = indiaSubj?.topics?.length || 5;
  const neTopicsCount = neSubj?.topics?.length || 2;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Title */}
      <div>
        <span style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Personal Learning Analytics
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.2rem 0', color: '#fff' }}>
          Mastery & Exam Readiness
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
          Track your progress, daily learning streak, and ADRE/APSC competitive exam readiness.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.95))', border: '1.5px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}>
              <Trophy size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
                LEVEL {level} • {levelTitle}
              </span>
              <h2 style={{ margin: '0.1rem 0 0', fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
                {xp} Total XP Earned
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '0.6rem 1.1rem', borderRadius: 16 }}>
            <Flame size={24} color="#f97316" />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f97316', lineHeight: 1 }}>{streak} Days</div>
              <div style={{ fontSize: '0.68rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 700 }}>Learning Streak</div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
            <span>Progress to Level {level + 1}</span>
            <span>{currentLevelXp} / 100 XP</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 4 }}
              animate={{ width: `${levelProgressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Syllabus Mastery Breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        {/* Assam Geography */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #fb923c', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: '#fb923c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} /> ASSAM GEOGRAPHY
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '0.2rem 0.5rem', borderRadius: 8, fontWeight: 800 }}>
              Primary Focus
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Physical & Human Geography</h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Brahmaputra Valley, Barak Valley, Central Hills, Ecology, Wildlife Reserves & Transport.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <TrendingUp size={16} color="#fb923c" />
            <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 700 }}>
              {assamTopicsCount} Core Topics Unlocked
            </span>
          </div>
        </div>

        {/* Northeast 7 Sisters */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #c084fc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={15} /> NORTHEAST INDIA
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '0.2rem 0.5rem', borderRadius: 8, fontWeight: 800 }}>
              7 Sister States
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Regional & Border Geography</h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura state highlights.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <TrendingUp size={16} color="#c084fc" />
            <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 700 }}>
              {neTopicsCount} Regional Modules
            </span>
          </div>
        </div>

        {/* Indian Geography */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={15} /> INDIAN GEOGRAPHY
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: 8, fontWeight: 800 }}>
              National Syllabus
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Physiographic Divisions</h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Himalayas, Northern Plains, Peninsular Plateau, Thar Desert, Coastal Plains & Islands.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <TrendingUp size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 700 }}>
              {indiaTopicsCount} Major Physiographic Zones
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
