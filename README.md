# 🗺️ ADRE & APSC Geography Platform
### *Brilliant.org-Style Interactive Learning Experience for Assam, Northeast 7 Sisters, and Indian Geography*

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.43-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Build Status](https://img.shields.io/badge/Build-Passing-22c55e?style=flat-square)]()

---

## 🎓 4-Tier Student Mindset Curriculum Hierarchy

The platform data, UI, sidebar, and lesson players have been standardized across the board to follow the natural student mental model:

```
CHAPTER (e.g. ASSAM GEOGRAPHY, NORTHEAST 7 SISTERS, INDIAN GEOGRAPHY)
 └── UNIT (e.g. Unit 1: Physiographic Divisions & Conservation)
      └── LESSON (e.g. Lesson 1: Brahmaputra Valley)
           └── TOPIC (e.g. Topic 1: North Bank Tributaries)
                ├── Facts: [ Array of Syllabus Facts ]
                ├── VisualisationIdea: String
                ├── ConceptUnits: [ Fact ➔ Flashcard ➔ Quiz ]
                └── PracticeMatching: [ Term ➔ Definition ]
```

---

## 🚀 Key Features & Automatic Student Flow

- 📍 **Interactive Location Breadcrumb Header**:
  When a student enters any Topic Player, the top header displays their exact 4-tier location:
  `📍 ASSAM ➔ Unit: Physiographic Divisions ➔ Lesson: Brahmaputra Valley ➔ Topic: North Bank Tributaries`

- 🔄 **Automatic Sequential Flow**:
  Upon completing a Topic Player (*Fact Read + SVG Visualizer ➔ Flashcard Recall ➔ Exam Quiz ➔ Term Matching Recap*), the completion scorecard presents a high-prominence **"Automatic Flow: Proceed to Next Topic ▶"** button. Students can continuously flow from Topic 1 ➔ Topic 2 ➔ Topic 3 without having to return to the directory!

- 🌲 **4-Tier Curriculum Tree Sidebar**:
  - **Tier 1 (Chapter)**: `ASSAM`, `NE`, `INDIA`
  - **Tier 2 (Unit)**: Curricular modules (e.g. *Unit 1: Physiographic Divisions*)
  - **Tier 3 (Lesson)**: Learning units (e.g. *Lesson 1: Brahmaputra Valley*)
  - **Tier 4 (Topic)**: Focused topics with instant **`▶ Play`** buttons.

- 📊 **Standardized CSV Exports**:
  All export files under [`exports/`](file:///home/angsuman/extra_spac/GEOGRAPHY/exports/) use the exact standardized headers: `Chapter`, `Unit`, `Lesson`, `Topic`.

---

## 📂 Repository Structure

```
GEOGRAPHY/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx             # Main curriculum directory & hero dashboard
│   │   ├── InteractiveLesson.jsx    # Topic Player with Breadcrumbs & Auto Flow
│   │   ├── SectionVisualizer.jsx    # Universal interactive visualization router
│   │   ├── Flashcard.jsx            # Flip-card active recall deck player
│   │   ├── MatchGame.jsx            # SVG thread connection term-matching game
│   │   ├── ExamineMCQ.jsx           # Exam-style MCQ quiz player
│   │   └── GeographyMap.jsx         # Canvas vector map inspector
│   ├── data/
│   │   ├── assam/GEography.json     # Assam Geography 4-tier syllabus
│   │   ├── northeast/GEography.json # Northeast 7 Sisters 4-tier syllabus
│   │   └── india/GEography.json     # Indian Geography 4-tier syllabus
│   ├── utils/
│   │   └── lessonGenerator.jsx      # Topic & Lesson player pipeline generator
│   └── App.jsx                      # App root, state router, and 4-tier sidebar
├── exports/                         # Standardized CSV exports (Chapter, Unit, Lesson, Topic)
├── package.json
└── vite.config.js
```

---

## 🛠️ Getting Started Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Angsumi/adre-master.git
   cd adre-master
   ```

2. **Install & Run**:
   ```bash
   npm install
   npm run dev
   ```

3. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

---

## 📄 License
This project is developed for educational purposes under the MIT License.
