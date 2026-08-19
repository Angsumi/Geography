# 📐 Universal Interactive Learning Platform Specification
### *A Blueprint for Replicating Brilliant.org-Style Subject Learning Apps*

This document contains the complete design system, architecture, data schemas, color palettes, component hierarchy, utility functions, and setup guide needed to replicate this platform for any subject in a standalone repository.

---

## 🎯 1. Core Philosophy & Design System

The platform is designed around **Visual, Active Learning** (learning by doing) rather than passive reading.

### Design Principles:
1. **Mobile-First**: Optimized for smartphone touch interactions with large touch targets, single-column focus, and minimal clutter.
2. **Zero Nested Cards**: Clean paper aesthetic using flat surface containers (`--bg-surface: #ffffff`) and subtle borders without cards inside cards.
3. **Typography Hierarchy**: Distinct fonts for headers (`Outfit`) and body text (`Inter`).
4. **Immediate Feedback**: Instant visual/sound responses on answer selections, card flips, and line connections.

---

## 🎨 2. Color Palette & Typography Tokens

Include this design system in your `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');

:root {
  /* Surface Colors */
  --bg-main: #faf9f6;          /* Warm paper background */
  --bg-surface: #ffffff;       /* Pure white card panel */
  --bg-subtle: #f4f4f0;        /* Subtle secondary backgrounds */
  --bg-hover: #ecece7;         /* Hover state */
  
  /* Borders */
  --border-subtle: rgba(0, 0, 0, 0.07);
  --border-medium: rgba(0, 0, 0, 0.12);

  /* Primary Accent (Emerald / Learning State) */
  --primary: #059669;
  --primary-bright: #10b981;
  --primary-bg: #ecfdf5;
  --primary-border: #a7f3d0;
  
  /* Secondary Accent (Teal / Interactive Controls) */
  --secondary: #0d9488;
  --secondary-bg: #f0fdfa;
  --secondary-border: #99f6e4;
  
  /* Warm Accent (Amber / Streaks & Badges) */
  --accent-warm: #d97706;
  --accent-warm-bg: #fffbeb;
  
  /* Danger (Rose / Errors & Quiz Incorrect) */
  --danger: #e11d48;
  --danger-bg: #fff1f2;
  --danger-border: #fecdd3;
  
  /* Text Spectrum */
  --text-main: #18181b;
  --text-muted: #71717a;
  --text-light: #a1a1aa;
  
  /* Typography Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Outfit', 'Inter', sans-serif;
}
```

---

## 🌲 3. The 4-Tier Curriculum Data Schema

All subject data MUST follow this strict 4-tier JSON structure:

```
CHAPTER (e.g., QUANTITATIVE APTITUDE / PHYSICS / ANCIENT HISTORY)
 └── UNIT (e.g., Unit 1: Mechanics & Motion)
      └── LESSON (e.g., Lesson 1: Newton's Laws)
           └── TOPIC (e.g., Topic 1: Third Law & Momentum)
                ├── Facts: [ Array of Syllabus Bullet Points ]
                ├── VisualisationIdea: String (Identifies visualizer module)
                ├── ConceptUnits: [ Fact ➔ Flashcard ➔ Quiz ]
                └── PracticeMatching: [ Term ➔ Definition ]
```

### Copy-Paste JSON Template (`src/data/subject.json`):

```json
{
  "GeographySyllabus": [
    {
      "Chapter": "PHYSICS",
      "Units": [
        {
          "UnitName": "Unit 1: Mechanics & Motion",
          "Lessons": [
            {
              "LessonName": "Lesson 1: Laws of Motion",
              "Topics": [
                {
                  "TopicName": "Topic 1: Action & Reaction",
                  "Facts": [
                    "For every action, there is an equal and opposite reaction.",
                    "Forces always occur in pairs."
                  ],
                  "VisualisationIdea": "NewtonCradleVisualizer",
                  "ConceptUnits": [
                    {
                      "Fact": "Newton's Third Law states forces act in equal & opposite pairs.",
                      "Flashcard": {
                        "Front": "What is Newton's Third Law?",
                        "Back": "Every action has an equal and opposite reaction."
                      },
                      "Quiz": {
                        "Question": "When a gun fires a bullet, why does the gun recoil?",
                        "Options": [
                          "Equal & opposite reaction force",
                          "Gravity pulling backward",
                          "Friction from the air",
                          "Magnetic repulsion"
                        ],
                        "AnswerIndex": 0,
                        "Explanation": "The backward momentum of recoil balances the forward momentum of the bullet."
                      }
                    }
                  ],
                  "PracticeMatching": [
                    {
                      "Term": "Action Force",
                      "Definition": "Force exerted by object A on object B"
                    },
                    {
                      "Term": "Reaction Force",
                      "Definition": "Equal magnitude force exerted back by object B on object A"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## ⚡ 4. Core Utility Functions

### A. Data Parser (`parseSyllabus`)
Extracts flattened lists, 4-tier tree hierarchy, and searchable question databases:

```javascript
export function parseSyllabus(json) {
  const chaptersList = [];
  const syllabusHierarchy = [];
  const studyDb = { flashcards: [], mcqs: [], matchPairs: [] };

  const rawChapters = json.GeographySyllabus || json.SubjectSyllabus || [];

  rawChapters.forEach((chapterObj) => {
    const chapterName = chapterObj.Chapter || 'General Chapter';
    if (!chaptersList.includes(chapterName)) chaptersList.push(chapterName);

    const chapterItem = { chapterName, units: [] };
    const units = chapterObj.Units || [];

    units.forEach((unitObj) => {
      const unitName = unitObj.UnitName || 'General Unit';
      const unitItem = { unitName, lessons: [] };
      const rawLessons = unitObj.Lessons || [];

      rawLessons.forEach((les) => {
        const lessonName = les.LessonName || 'Lesson';
        const topicsList = [];
        const rawTopics = les.Topics || [];

        rawTopics.forEach((top) => {
          const topicName = top.TopicName || 'Overview';
          topicsList.push({
            topicName,
            facts: top.Facts || [],
            ConceptUnits: top.ConceptUnits || [],
            PracticeMatching: top.PracticeMatching || [],
            VisualisationIdea: top.VisualisationIdea || null
          });

          // Populate study DB for practice hub
          (top.ConceptUnits || []).forEach((u) => {
            if (u.Flashcard) studyDb.flashcards.push({ ...u.Flashcard, topicName, lessonName, chapterName });
            if (u.Quiz) studyDb.mcqs.push({ ...u.Quiz, topicName, lessonName, chapterName });
          });
          (top.PracticeMatching || []).forEach((m) => {
            studyDb.matchPairs.push({ ...m, topicName, lessonName, chapterName });
          });
        });

        unitItem.lessons.push({ lessonName, topics: topicsList });
      });

      chapterItem.units.push(unitItem);
    });

    syllabusHierarchy.push(chapterItem);
  });

  return { chaptersList, syllabusHierarchy, studyDb };
}
```

### B. Topic Player Generator (`lessonGenerator.jsx`)
Converts raw topic data into a multi-step slide deck:

```javascript
export function generateSectionPlayerData(topicObj, lessonName, unitName, chapterName, navTargets = {}) {
  const steps = [];

  // Step 1: Syllabus Facts + Visualizer
  steps.push({
    type: 'visual_fact',
    title: topicObj.topicName,
    facts: topicObj.facts || [],
    visualIdea: topicObj.VisualisationIdea
  });

  // Step 2..N: Concept Units (Flashcard + Quiz)
  (topicObj.ConceptUnits || []).forEach((unit, idx) => {
    if (unit.Flashcard) {
      steps.push({
        type: 'flashcard',
        title: `Active Recall #${idx + 1}`,
        card: unit.Flashcard
      });
    }
    if (unit.Quiz) {
      steps.push({
        type: 'quiz',
        title: `Concept Test #${idx + 1}`,
        quiz: unit.Quiz
      });
    }
  });

  // Step Last: Matching Recap
  if (topicObj.PracticeMatching && topicObj.PracticeMatching.length > 0) {
    steps.push({
      type: 'match',
      title: 'Term Matching Recap',
      pairs: topicObj.PracticeMatching
    });
  }

  return {
    breadcrumb: { chapterName, unitName, lessonName, topicName: topicObj.topicName },
    steps,
    nextTopic: navTargets.nextTopic || null
  };
}
```

---

## 📁 5. Complete Repository Folder Structure

```
PROJECT_ROOT/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx             # Main syllabus directory & hero dashboard
│   │   ├── InteractiveLesson.jsx    # Topic Player with Breadcrumb Header & Auto-Flow
│   │   ├── SectionVisualizer.jsx    # Router for interactive SVG visualizers
│   │   ├── Flashcard.jsx            # Active recall flip deck
│   │   ├── MatchGame.jsx            # SVG thread connection game
│   │   ├── ExamineMCQ.jsx           # Exam MCQ engine with explanations
│   │   ├── PracticeHub.jsx          # Flashcards/MCQs revision hub
│   │   ├── ProgressDashboard.jsx    # XP, Streak, Level, and Syllabus Completion tracker
│   │   ├── MobileNavBar.jsx         # Bottom mobile navigation bar
│   │   └── visualizers/             # Subject-specific interactive SVG diagrams
│   ├── data/
│   │   └── subject.json             # 4-Tier Syllabus Content JSON
│   ├── hooks/
│   │   └── useSound.js              # Web Audio API sound effect triggers
│   ├── utils/
│   │   ├── lessonGenerator.jsx      # Topic player sequence pipeline generator
│   │   └── stringMatcher.js         # Term match comparison utility
│   ├── App.jsx                      # App root, state routing, 4-tier sidebar
│   ├── main.jsx                     # Vite entry point
│   └── index.css                    # Design system tokens & global CSS
├── exports/                         # Standardized CSV topic exports
├── public/                          # Static assets and favicons
├── package.json                     # Dependencies (React, Vite, Framer Motion, Lucide)
└── vite.config.js                   # Vite configuration
```

---

## 📦 6. Package Dependencies (`package.json`)

```json
{
  "name": "interactive-learning-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^12.4.3",
    "lucide-react": "^0.475.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.1.0"
  }
}
```

---

## 🚀 7. Quickstart for New Subject Repository

1. **Clone/Create standard Vite React app**:
   ```bash
   npx create-vite@latest my-subject-app --template react
   cd my-subject-app
   npm install lucide-react framer-motion
   ```
2. **Copy files into structure**:
   - Save this file as `PLATFORM_SPECIFICATION.md`.
   - Add your subject's JSON to `src/data/subject.json` following Section 3.
   - Add CSS tokens to `src/index.css` following Section 2.
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
