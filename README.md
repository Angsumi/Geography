# 🗺️ ADRE & APSC Geography Platform
### *Brilliant.org-Style Interactive Learning Experience for Assam, Northeast 7 Sisters, and Indian Geography*

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.43-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Build Status](https://img.shields.io/badge/Build-Passing-22c55e?style=flat-square)]()

---

## 🌟 Overview

The **ADRE & APSC Geography Platform** is a state-of-the-art interactive learning web application designed for serious competitive exam aspirants in Assam (ADRE Grade III/IV, APSC CCE, and allied state examinations). Modeled after the active-learning principles of **Brilliant.org**, the platform delivers 100% pedagogical alignment across every topic in Assam, Northeast, and Indian Geography.

---

## 📊 Standardized JSON Data Architecture

All chapter data files (`assam/`, `northeast/`, `india/`) follow a **100% standardized 3-step hierarchy**:

```
GeographySyllabus [ Array ]
 └── Subject: "ASSAM" | "NE" | "INDIA"
      └── Topics [ Array ]
           └── TopicName: String
                └── Subtopics [ Array ]
                     └── SubtopicName: String
                          └── Sections [ Array ]
                               ├── SectionName: String
                               ├── Facts: [ Array of Strings ]
                               ├── VisualisationIdea: String
                               ├── ConceptUnits: [ Array of Concept Objects ]
                               │    ├── Id: String (e.g. "assam-1", "ne-1", "india-1")
                               │    ├── Fact: String
                               │    ├── Flashcard: { Front, Back, Image }
                               │    └── Quiz: { Question, Options: {A,B,C,D}, CorrectAnswer, Explanation }
                               └── PracticeMatching: [ Array of { Term, Definition } ]
```

### 🎨 How Visualization Components Point Directly to the JSON Structure

1. **Embedded Visualization Ideas**:
   Every section object inside `GEography.json` contains a dedicated `"VisualisationIdea"` string (e.g. *"Interactive SVG path diagram showing north-bank tributaries..."*).

2. **Dynamic Section Routing (`SectionVisualizer.jsx`)**:
   `SectionVisualizer({ sectionName, facts })` takes the exact `sectionName` and `facts` array directly from the JSON section object:
   - **Specialized SVG Components**: Matches `sectionName` to mount custom interactive SVG components (e.g. `<TributariesBankVisual>`, `<VerticalDivisionsVisual>`, `<CoastalPlainsVisual>`, `<RiverFlowVisual>`).
   - **Data-Driven State Profiles**: Reads raw `facts` strings (e.g. `Capital: Itanagar`, `State Symbols: Mithun`) directly from JSON and injects them into `<StateProfileVisual>`.
   - **Universal Concept Canvas**: For any un-matched section, it dynamically renders an animated SVG concept canvas displaying the exact `VisualisationIdea` string extracted from `GEography.json`.

---

## ✨ Key Features

- 🌲 **3-Tier Nested Accordion Tree Sidebar**:
  - **Level 1 (Chapter)**: Toggle between **Assam Geography**, **Northeast 7 Sisters**, and **Indian Geography**.
  - **Level 2 (Subtopics)**: Explore subtopics (e.g. *Brahmaputra Valley*, *Central Hills*, *Physiographic Divisions*) with section count badges.
  - **Level 3 (Sections)**: Access individual sections with direct **`▶ Start Section Player`** launch buttons.

- 🎯 **Fact-by-Fact Interleaved Section Player**:
  - **Step 1: Fact Read Phase**: High-yield syllabus fact card accompanied by interactive SVG concept visualizers.
  - **Step 2: Flashcard Recall Phase**: Instant flashcard active recall testing the exact concept.
  - **Step 3: Exam MCQ Quiz Phase**: Exam-style multiple-choice questions with instant rationale and explanation.
  - **Final Phase: Match the Following Recap**: Organically connected term-matching game with dynamic thread connection lines.
  - **Completion Scorecard**: Gamified XP awards and streak tracking.

- 🎨 **Rich Interactive Concept Visualizers**:
  - **River Systems Simulator**: Animated stream pulses and clickable tributary nodes for *Indus*, *Ganga*, *Brahmaputra*, and *Peninsular Rivers*.
  - **Coastal Plains Inspector**: West vs. East Coast comparison covering Konkan, Malabar, Northern Circars, Coromandel deltas, and major sea ports.
  - **Elevation Profile Diagram**: Interactive 3D peak profile for *Himadri*, *Himachal*, and *Shivalik* mountain ranges.
  - **State Profile Dashboards**: Comprehensive emblem, capital, fauna, and mountain peak dashboards for all Northeast 7 Sisters states.
  - **Transport & Logistics Simulator**: National Highways (NH-27), NFR Railways (Bogibeel Bridge), and National Waterways (NW-2 & NW-57 Kopili River).

- 🗺️ **Interactive Vector Map Inspector**:
  - High-precision vector maps for Assam districts, Northeast 7 Sisters, and Indian physiographic boundaries.

- 🏆 **Gamified XP & Streak Engine**:
  - Dynamic XP awards (+10 XP Flashcards, +10 XP Match Pairs, +15 XP Exam Quizzes, +25 XP Section Mastery).
  - Daily streak tracking persisted in local storage.

---

## 📂 Repository Structure

```
GEOGRAPHY/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx             # Main syllabus directory & hero dashboard
│   │   ├── InteractiveLesson.jsx    # Fact-by-Fact Interleaved Section Player
│   │   ├── SectionVisualizer.jsx    # Universal interactive visualization router
│   │   ├── Flashcard.jsx            # Flip-card active recall deck player
│   │   ├── MatchGame.jsx            # SVG thread connection term-matching game
│   │   ├── ExamineMCQ.jsx           # Exam-style MCQ quiz player
│   │   ├── GeographyMap.jsx         # Canvas vector map inspector
│   │   └── visualizers/             # Custom SVG & CSS interactive visualizers
│   ├── data/
│   │   ├── assam/GEography.json     # Assam Geography syllabus & ConceptUnits
│   │   ├── northeast/GEography.json # Northeast 7 Sisters syllabus & ConceptUnits
│   │   └── india/GEography.json     # Indian Geography syllabus & ConceptUnits
│   ├── utils/
│   │   └── lessonGenerator.jsx      # Section & Subtopic lesson player pipeline generator
│   ├── App.jsx                      # App root, state router, and 3-tier sidebar
│   └── index.css                    # Glassmorphism dark-mode styling design system
├── package.json
└── vite.config.js
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Execution

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Angsumi/adre-master.git
   cd adre-master
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

---

## 📜 Syllabus Coverage

| Chapter | Topics & Subtopics | Key Highlights & Visualizers |
|---|---|---|
| **ASSAM** | Brahmaputra Valley, Central Hills, Barak Valley, Ecology, Wildlife Reserves, Transport | North/South Tributaries, Kaziranga NP, Manas TR, Bogibeel Bridge, NW-57 Kopili River |
| **NORTHEAST 7 SISTERS** | State Profiles (Arunachal, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Tripura), WNHS, Biosphere Reserves | Nokrek Citrus Gene Sanctuary, Dihang-Dibang Takin, Moidams Ahom Mounds |
| **INDIA** | Physiographic Divisions, River Systems, Ecological Markers | Himadri/Himachal/Shiwalik Elevation, Indus/Ganga/Brahmaputra/Peninsular Rivers, Coastal Deltas |

---

## 📄 License
This project is developed for educational purposes under the MIT License.
