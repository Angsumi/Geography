import React, { useState } from 'react';
import { BookOpen, Target, Trophy, Settings, ArrowLeft } from 'lucide-react';
import db from './database.json';
import './index.css';
import Flashcard from './Flashcard';
import MatchGame from './MatchGame';

function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', icon: <Target size={20} />, label: 'Dashboard' },
    { id: 'Polity', icon: <BookOpen size={20} />, label: 'Polity' },
    { id: 'History', icon: <BookOpen size={20} />, label: 'History' },
    { id: 'Geography', icon: <BookOpen size={20} />, label: 'Geography' },
    { id: 'Assam_Northeast', icon: <BookOpen size={20} />, label: 'Assam & NE' },
  ];

  return (
    <div className="glass-panel" style={{ height: 'calc(100vh - 4rem)', position: 'sticky', top: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '0.5rem', borderRadius: '12px' }}>
          <Trophy size={24} color="#000" />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>ADRE Master</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              background: activeTab === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === item.id ? 'var(--text-main)' : 'var(--text-muted)',
              border: activeTab === item.id ? '1px solid var(--glass-border)' : '1px solid transparent',
              textAlign: 'left',
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: '1rem'
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      
      <div style={{ position: 'absolute', bottom: '2rem', width: 'calc(100% - 4rem)' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Score</p>
          <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.8rem' }}>1,240</h3>
        </div>
      </div>
    </div>
  );
}

function MainArea({ activeTab }) {
  const [activeGame, setActiveGame] = useState(null); // { type, data }
  
  // Safe extraction of topics if a subject is selected
  const subjectData = activeTab !== 'dashboard' && db.PLAN ? db.PLAN[activeTab] : null;

  const parseMCQData = (topic, subtopic) => {
    try {
      const qs = db.MCQ[activeTab][topic][subtopic];
      if (!qs) return [];
      
      return Object.values(qs).map(qText => {
        // Extract Question, Answer, and Explanation from text
        const qMatch = qText.match(/(?:Q\d+\.\s*|Question:\s*)(.*?)(?=\n[A-D]\))/is);
        const aMatch = qText.match(/Correct Answer:\s*([A-D])/i);
        const expMatch = qText.match(/Explanation:\s*(.*)/i);
        
        let question = qMatch ? qMatch[1].trim() : "Unknown Question";
        let answerLetter = aMatch ? aMatch[1].trim().toUpperCase() : "A";
        
        // Find the actual answer text based on letter
        let answerText = "Answer";
        const optMatch = qText.match(new RegExp(`${answerLetter}\\)\\s*(.*?)(?=\\n[A-D]\\)|\\n\\n|$)`, 'i'));
        if (optMatch) answerText = optMatch[1].trim();

        return {
          q: question,
          a: answerText,
          exp: expMatch ? expMatch[1].trim() : ""
        };
      });
    } catch (e) {
      console.log("Error parsing MCQ for", topic, subtopic, e);
      return [];
    }
  };

  const handleSubtopicClick = (topic, subtopic) => {
    const data = parseMCQData(topic, subtopic);
    if (data.length === 0) {
      alert("No MCQ data found for this subtopic yet.");
      return;
    }
    
    // Check PLAY mechanics if available, else default randomly
    let gameType = 'flashcard';
    try {
      const playText = db.PLAY[activeTab][topic][subtopic]['game'] || '';
      if (playText.toLowerCase().includes('match')) gameType = 'match';
    } catch (e) {}

    setActiveGame({ type: gameType, data, title: subtopic });
  };

  if (activeGame) {
    return (
      <main>
        <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-glass" onClick={() => setActiveGame(null)} style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{activeGame.title}</h2>
        </header>

        {activeGame.type === 'flashcard' ? (
           <Flashcard data={activeGame.data} onComplete={() => setActiveGame(null)} />
        ) : (
           <MatchGame data={activeGame.data} onComplete={() => setActiveGame(null)} />
        )}
      </main>
    );
  }

  return (
    <main>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ textTransform: 'capitalize' }}>
            {activeTab === 'Assam_Northeast' ? 'Assam & NE' : activeTab}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Master your syllabus with gamified learning.</p>
        </div>
        <button className="btn btn-glass">
          <Settings size={20} /> Settings
        </button>
      </header>

      {activeTab === 'dashboard' ? (
        <div className="glass-panel" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy size={64} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
          <h2>Welcome back!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Select a subject from the sidebar to start reviewing.</p>
          <button className="btn btn-primary" onClick={() => alert('Please select a subject from the left!')}>Start Daily Review</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {subjectData ? (
            Object.keys(subjectData).map(topic => (
              <div key={topic} className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>{topic}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {Object.keys(subjectData[topic]).map(subtopic => (
                    <button 
                      key={subtopic} 
                      className="btn btn-glass" 
                      onClick={() => handleSubtopicClick(topic, subtopic)}
                      style={{ flexDirection: 'column', padding: '1rem', height: '100px', justifyContent: 'center' }}
                    >
                      <span style={{ fontSize: '0.9rem', textAlign: 'center' }}>{subtopic}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>Loading subject data...</p>
          )}
        </div>
      )}
    </main>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainArea activeTab={activeTab} />
    </div>
  );
}

export default App;
