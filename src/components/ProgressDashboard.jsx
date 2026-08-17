import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, CheckCircle, BookOpen, MapPin, TrendingUp, CheckCircle2 } from 'lucide-react';

export function ProgressDashboard({ xp, streak, syllabusHierarchy = [], completedTopics = {} }) {
  // Calculate level based on XP
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXp = xp % 100;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXp / 100) * 100));

  let levelTitle = 'Geography Explorer';
  if (level >= 10) levelTitle = 'Assam Geography Master 🏆';
  else if (level >= 5) levelTitle = 'APSC Candidate Specialist 🎯';
  else if (level >= 3) levelTitle = 'ADRE Scholar 📚';

  // Calculate detailed topic completion metrics per chapter
  const getChapterMetrics = (chName) => {
    const chapter = syllabusHierarchy.find(c => c.chapterName === chName);
    if (!chapter) return { total: 0, completed: 0, pct: 0 };
    let total = 0;
    let completed = 0;
    chapter.units.forEach(u => {
      u.lessons.forEach(l => {
        total += l.topics.length;
        completed += l.topics.filter(t => t.topicName && completedTopics[t.topicName]).length;
      });
    });
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct };
  };

  const assamStats = getChapterMetrics('ASSAM');
  const neStats = getChapterMetrics('NE');
  const indiaStats = getChapterMetrics('INDIA');

  const totalSyllabusTopics = assamStats.total + neStats.total + indiaStats.total;
  const totalCompletedTopics = assamStats.completed + neStats.completed + indiaStats.completed;
  const overallPct = totalSyllabusTopics > 0 ? Math.round((totalCompletedTopics / totalSyllabusTopics) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Title */}
      <div>
        <span style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Personal Learning Analytics
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.2rem 0', color: '#fff' }}>
          Mastery & Completion Dashboard
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
          Track your topic completion percentages, daily learning streak, and competitive exam mastery.
        </p>
      </div>

      {/* Main Profile & Overall Progress Card */}
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

        {/* Overall Syllabus Completion Rate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#fff', fontWeight: 800 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#34d399" /> Overall Syllabus Completion
            </span>
            <span style={{ color: '#34d399', fontSize: '1.05rem', fontWeight: 900 }}>
              {overallPct}% ({totalCompletedTopics} / {totalSyllabusTopics} Topics)
            </span>
          </div>
          <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #38bdf8)', borderRadius: 6 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 700 }}>
            <span>Progress to Level {level + 1}</span>
            <span>{currentLevelXp} / 100 XP</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #f97316, #fb923c)', borderRadius: 3 }}
              animate={{ width: `${levelProgressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Syllabus Mastery & Completion Breakdowns by Chapter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        {/* Assam Geography */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #fb923c', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: '#fb923c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} /> ASSAM GEOGRAPHY
            </span>
            <span className="badge badge-sage" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
              {assamStats.pct}% Mastered
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 800 }}>Physical & Human Geography</h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Brahmaputra Valley, Barak Valley, Central Hills, Ecology, Wildlife Reserves & Transport.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 700 }}>
              <span>Completion: {assamStats.completed} of {assamStats.total} topics</span>
              <span style={{ color: '#fb923c', fontWeight: 800 }}>{assamStats.pct}%</span>
            </div>
            <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: '#fb923c', borderRadius: 4 }}
                animate={{ width: `${assamStats.pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Northeast 7 Sisters */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #c084fc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={15} /> NORTHEAST INDIA
            </span>
            <span className="badge badge-sage" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
              {neStats.pct}% Mastered
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 800 }}>Regional & Border Geography</h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura state highlights.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 700 }}>
              <span>Completion: {neStats.completed} of {neStats.total} topics</span>
              <span style={{ color: '#c084fc', fontWeight: 800 }}>{neStats.pct}%</span>
            </div>
            <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: '#c084fc', borderRadius: 4 }}
                animate={{ width: `${neStats.pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Indian Geography */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <TrendingUp size={15} /> INDIAN GEOGRAPHY
            </span>
            <span className="badge badge-sage" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
              {indiaStats.pct}% Mastered
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 800 }}>Physiographic Divisions</h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Himalayas, Northern Plains, Peninsular Plateau, Thar Desert, Coastal Plains & Islands.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 700 }}>
              <span>Completion: {indiaStats.completed} of {indiaStats.total} topics</span>
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>{indiaStats.pct}%</span>
            </div>
            <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: '#38bdf8', borderRadius: 4 }}
                animate={{ width: `${indiaStats.pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

