# 📐 Universal Interactive Learning Platform Specification
### *A Blueprint for Replicating Brilliant.org-Style Subject Learning Apps*

> **Version**: 2.2 (Unified Single-Data Architecture Edition)  
> **Status**: Production Standard

This document contains the complete design system, UI/UX guidelines, state machine architecture, unified 4-tier data schema, color palettes, component hierarchy, utility functions, audio feedback specifications, and setup guide required to replicate this platform for any subject in a standalone repository.

---

## 🎨 1. Color Palette: Calm Nature / Zen Style (Zero Eye Fatigue)

The application enforces a soothing, high-contrast yet non-fatiguing **Calm Nature / Zen Slate** color scheme across all interactive player views.

### Design Tokens (`src/index.css`):

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');

:root {
  /* Surface Colors & Backdrops */
  --bg-main: #0b1320;                  /* Deep Obsidian Slate */
  --bg-surface: rgba(20, 30, 45, 0.88); /* Deep Warm Zen Slate Card */
  --bg-subtle: rgba(255, 255, 255, 0.04);
  --bg-hover: rgba(255, 255, 255, 0.08);
  
  /* Borders */
  --border-subtle: rgba(45, 212, 191, 0.2);  /* Subtle Teal Hairline */
  --border-medium: rgba(45, 212, 191, 0.35);

  /* Primary Action Control (Teal-600/700 Gradient) */
  --primary-gradient: linear-gradient(135deg, #0d9488, #0f766e);
  --primary-border: rgba(45, 212, 191, 0.35);
  --primary-text: #f0fdf4;
  --primary-glow: 0 4px 18px rgba(13, 148, 136, 0.3);

  /* Secondary / Negative Action Control (Soft Amber Sand) */
  --secondary-bg: rgba(251, 191, 36, 0.12);
  --secondary-border: rgba(251, 191, 36, 0.35);
  --secondary-text: #fde68a;

  /* Ambient Glass Cards & Shadows */
  --card-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);

  /* Typography Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Outfit', 'Inter', sans-serif;
}
```

### ❌ Strict Color Prohibitions
* **NO High-Contrast Neon Red/Green**: Avoid standard saturated green/red for right/wrong.
* **NO Electric Purple/Cyan**: Avoid hyper-saturated gaming themes.
* **NO Stark Monochromatic Cold Black/White**: Prefer warm slate and muted organic tones.

---

## 🎛️ 2. Action Controls & Ergonomics Architecture

### A. Compact Pill-Shaped Buttons
All main action buttons (`Next ➔`, `I Knew It`, `I Didn't Know`, `Re-Play Mastered Topic`) MUST use compact, pill-shaped styling:
* **Border Radius**: `100px`
* **Padding**: `0.75rem 1.4rem`
* **Font**: `fontSize: 0.92rem`, `fontWeight: 800`

### B. Elevated Fixed Position (`bottom: 64px`)
Primary interactive controls MUST float at a fixed coordinate in the lower center of the screen for effortless thumb reach on mobile:
```css
position: fixed;
bottom: 64px;
left: 50%;
transform: translateX(-50%);
z-index: 95;
```

### C. Unified Action Spot
The `Next ➔` button and self-assessment buttons (`I Didn't Know` & `I Knew It`) MUST share the exact same fixed bottom coordinate across phase transitions and card flips. This prevents visual jumping and enables muscle-memory tapping.

### D. Centered Dark Glass Quick-Jump Toolbar (`bottom: 10px`)
The bottom navigation bar MUST sit fixed at the very bottom center of the screen:
```css
position: fixed;
bottom: 10px;
left: 50%;
transform: translateX(-50%);
z-index: 90;
```
* **Styling**: Translucent dark glass (`rgba(255, 255, 255, 0.03)` with `1px solid rgba(255, 255, 255, 0.06)` border).
* **Text**: Minimalist silver-slate text (`#94a3b8`).
* **Content**: Uniform jump pills (`Jump: Next Topic | Next Lesson | Next Unit | Next Chapter`). No multi-colored pills.

---

## 🎯 3. Vertical & Horizontal Centering Policy

* **Screen Centering**: All step cards (*Mission Briefing*, *Explore Map/Visualizer*, *Learn Fact*, *Flashcard*, *Quiz MCQ*, *Match Game*) MUST be centered both vertically and horizontally within the viewport:
  ```css
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  ```
* **Mobile Responsiveness**: Fluid width scaling (`maxWidth: 760px`, `width: 100%`) with scroll buffer protection (`paddingBottom: 150px`).

---

## 🧹 4. Zero-Clutter & Minimalist Content Policy

To maintain high focus and zero visual fatigue, the player UI adheres to strict anti-clutter rules:
1. ❌ **NO Debug Process Steppers**: Do NOT include process stepper bars (`✓ Orient ─ 2 Explore...`).
2. ❌ **NO Technical Badges**: Do NOT include technical badges (`STEP 2: MAP EXPLORATION`, `CONCEPT 1 OF 3`).
3. ❌ **NO Redundant Metadata Boxes**: Do NOT display time estimates, concept counts, XP reward boxes, or generic goal statements in the briefing.
4. ❌ **NO Meta-Explanation Callouts**: Do NOT add callout boxes such as `"Why this matters for exam"`.
5. ❌ **NO Technical Index Titles**: Do NOT prefix facts with `"Concept Fact (X of Y):"`.
6. ❌ **NO Redundant Subtitles**: Keep flashcard faces clean without subtitle instructions (`"Tap card to flip..."`).
7. ❌ **Clean Self-Assessment Labels**: Use clean labels (`I Didn't Know` & `I Knew It`) without inline XP counters on the button.

---

## 🔄 5. Topic Player State Machine Architecture

The player operates on a deterministic 7-phase state machine:

```
[ briefing ] ➔ [ explore ] ➔ [ learn ] ➔ [ recall ] ➔ [ check ] ➔ [ matching_recap ] ➔ [ completed ]
```

| Phase | Screen Purpose | Key Interaction | Action Control |
| :--- | :--- | :--- | :--- |
| `briefing` | Topic Title & Overview | Read topic intro | `Start Learning ➔` |
| `explore` | Interactive SVG / Map | Tap map regions / SVG nodes | `Continue to Fact ➔` |
| `learn` | Syllabus Fact Presentation | Digest core concept fact | `Test Myself ➔` |
| `recall` | Active Recall Flashcard | Flip card to reveal answer | `I Didn't Know` \| `I Knew It` |
| `check` | Exam MCQ Quiz | Select correct option (A/B/C/D) | `Next Concept ➔` |
| `matching_recap` | SVG Thread Connection Game | Drag/connect term to definition | `Complete Topic 🏆` |
| `completed` | Scorecard & Progress | View XP earned & streak | `Proceed to Next Topic ▶` |

---

## 🔊 6. Audio & Haptic Feedback System (`src/hooks/useSound.js`)

The player relies on low-latency Web Audio API synthesizers for micro-interactions:
* `playCorrect()`: Triggered on correct MCQ choice or `I Knew It` self-assessment.
* `playWrong()`: Triggered on incorrect MCQ selection or `I Didn't Know` self-assessment.
* `playFlip()`: Triggered on active recall card flip.
* `playComplete()`: Triggered on topic completion scorecard.

---

## 🌲 7. Unified 4-Tier Curriculum JSON Schema

All subject content is served from a single unified file: [`src/data/unifiedGeography.json`](file:///home/angsuman/extra_spac/GEOGRAPHY/src/data/unifiedGeography.json).

```
GeographySyllabus (Root Array)
 ├── Chapter: "ASSAM"
 │    └── Unit: "Physiographic Divisions & Conservation"
 ├── Chapter: "INDIA"
 │    ├── Unit: "Physiographic Divisions of India"
 │    ├── Unit: "Major River Systems"
 │    └── Unit: "Ecological Markers & Conservation"
 └── Chapter: "NE"
      ├── Units: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Tripura"]
      ├── Unit: "World Natural Heritage Sites (WNHS)"
      └── Unit: "Biosphere Reserves (BR)"
```

### Complete Topic Node Structure (`src/data/unifiedGeography.json`):

```json
{
  "GeographySyllabus": [
    {
      "Chapter": "ASSAM",
      "Units": [
        {
          "UnitName": "Physiographic Divisions & Conservation",
          "Lessons": [
            {
              "LessonName": "Brahmaputra Valley",
              "Topics": [
                {
                  "TopicName": "North Bank Tributaries (Brahmaputra)",
                  "Facts": [
                    "Alluvial plain from Sadiya to Dhubri, annual monsoonal floods."
                  ],
                  "VisualisationIdea": "BrahmaputraValleyVisual",
                  "ConceptUnits": [
                    {
                      "Id": "assam-1",
                      "Fact": "Alluvial plain from Sadiya to Dhubri, annual monsoonal floods.",
                      "Flashcard": {
                        "Front": "What is a key geographical feature of North Bank Tributaries?",
                        "Back": "Subansiri River."
                      },
                      "Quiz": {
                        "Question": "Which is the largest North Bank tributary of the Brahmaputra River?",
                        "Options": {
                          "A": "Pagladiya",
                          "B": "Manas",
                          "C": "Jia Bharali",
                          "D": "Subansiri"
                        },
                        "CorrectAnswer": "D",
                        "Explanation": "Official Syllabus Fact: Alluvial plain from Sadiya to Dhubri."
                      }
                    }
                  ],
                  "PracticeMatching": [
                    {
                      "Term": "Subansiri Sub-tributaries",
                      "Definition": "Ranganadi and Dikrong."
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

## ⚡ 8. Core Parser Utility & Direct Import

In `src/App.jsx`, import the unified JSON directly:

```javascript
import syllabusData from './data/unifiedGeography.json';

export function parseSyllabus(json) {
  const chaptersList = [];
  const syllabusHierarchy = [];
  const studyDb = { flashcards: [], mcqs: [], matchPairs: [] };

  const rawChapters = json.GeographySyllabus || [];

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
            conceptUnits: top.ConceptUnits || [],
            practiceMatching: top.PracticeMatching || [],
            VisualisationIdea: top.VisualisationIdea || null
          });

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

---

## 📁 9. Complete Repository Architecture

```
PROJECT_ROOT/
├── .gemini/
│   └── rules.md                     # System rules enforcing Calm Nature UI
├── src/
│   ├── components/
│   │   ├── HomePage.jsx             # 4-Tier Curriculum Tree Directory
│   │   ├── InteractiveLesson.jsx    # Topic Player (State Machine & Fixed Controls)
│   │   ├── SectionVisualizer.jsx    # SVG/Canvas interactive diagram router
│   │   ├── Flashcard.jsx            # Active recall flip deck
│   │   ├── MatchGame.jsx            # SVG thread connection game
│   │   ├── ExamineMCQ.jsx           # Exam MCQ quiz engine
│   │   ├── PracticeHub.jsx          # Flashcard & Quiz revision hub
│   │   ├── ProgressDashboard.jsx    # XP, Streak, and Mastery tracking
│   │   ├── MobileNavBar.jsx         # Mobile navigation footer
│   │   └── visualizers/             # Subject-specific SVG visualizers
│   ├── data/
│   │   └── unifiedGeography.json    # Master Unified 4-Tier Subject JSON
│   ├── hooks/
│   │   └── useSound.js              # Sound effect triggers
│   ├── utils/
│   │   ├── lessonGenerator.jsx      # Topic player slide deck generator
│   │   └── stringMatcher.js         # Term matching utility
│   ├── App.jsx                      # App root router & state manager
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Design system tokens & global CSS
├── exports/                         # Standardized topic CSV exports
├── PLAYER_DESIGN_GUIDELINES.md      # Player UI/UX Architecture Standard
├── PLATFORM_SPECIFICATION.md        # Complete Replication Blueprint
├── package.json
└── vite.config.js
```

---

## 🚀 10. Quickstart to Replicate in a New Subject Repo

1. **Initialize Vite React Project**:
   ```bash
   npx create-vite@latest my-subject-app --template react
   cd my-subject-app
   npm install lucide-react framer-motion
   ```

2. **Copy Specs & Rules**:
   - Place this file as `PLATFORM_SPECIFICATION.md`.
   - Place `PLAYER_DESIGN_GUIDELINES.md` into the project root.
   - Copy `.gemini/rules.md` to enforce UI consistency.

3. **Populate Unified Subject Data & Launch**:
   - Save your subject's unified content to `src/data/unifiedGeography.json`.
   - Import it in `src/App.jsx`: `import syllabusData from './data/unifiedGeography.json'`.
   - Run `npm run dev`.
