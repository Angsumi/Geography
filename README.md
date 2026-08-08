# ADRE Geography Hub

ADRE Geography Hub is an interactive, gamified learning platform for studying the geography of India, Assam, and the Northeast. It transforms raw syllabus data into an engaging visual experience with interactive maps, 3D visualizers, gamified learning activities, and a dedicated Home Page schema.

🌐 **Live Online Site:** [https://angsumi.github.io/adre-master/](https://angsumi.github.io/adre-master/)

---

## 🌟 Key Features

- **🏠 Home Page Launcher & Site Schema Overview:** An interactive dashboard featuring 3 vivid chapter launcher cards (`INDIA`, `ASSAM`, `NE`) with stats & highlights, alongside a 4-step site architecture flow map.
- **🎨 Dynamic Chapter Color System:** Custom vivid neon theme palettes for each chapter (`#34d399` Emerald Green for INDIA, `#fb923c` Amber for ASSAM, `#f472b6` Neon Pink for NE).
- **🚩 Handcrafted 3D Animated Icons:** Features an authentic Assamese **Gamusa (Gamosa) Flag Icon** with S-curve fabric waving contours, 3D fold highlights, woven *Pori* borders, *Phulam* diamond motifs, and fluttering *Anchali* fringes.
- **🗺️ Interactive Geography Map:** Clickable vector maps of India, Assam districts, and the 7 Northeast Sister States built on lightweight GeoJSON datasets.
- **📑 Responsive Sidebar UI:** A modern glassmorphism design with a sticky sidebar for quick subtopic filtering and an explicit **`📑 Topics Menu`** header toggle button for off-canvas drawer navigation.
- **🌋 Bespoke 3D/SVG Section Visualizers:** 18 custom React visualizer components explaining complex geographical structures (e.g., Deccan Plateau volcanic basalt trap, soil horizons, river basins, biosphere reserve layers).
- **🎓 Tri-Fold Gamified Learning Suite (1,100 Curated Items across 53 Sections):**
  - **Visual Flashcards (+10 XP):** 420 3D flipping cards with visual prompts.
  - **Practice Matching (+10 XP):** 418 drag-and-drop key term matching pairs (with zero generic fallback strings).
  - **Examine MCQ (+15 XP):** 262 multiple-choice questions with plausible distractors and instant feedback.
- **📈 Gamified Progress & Streak Tracking:** Earn XP and maintain daily streaks with browser `localStorage` persistence and procedural Web Audio API sound effects.

---

## 🏗️ Architecture & Data Flow

The application is completely decoupled from hardcoded logic, building its UI, visualizers, and game states dynamically from regional JSON datasets:

```
src/
├── App.jsx                    ← Main orchestrator (state, viewMode, activeChapter, header menu)
├── index.css                  ← Full dark glassmorphism design system
├── components/
│   ├── HomePage.jsx           ← Home Page launcher (3 chapter cards + 4-step schema flow)
│   ├── Flashcard.jsx          ← 3D flip card game module
│   ├── MatchGame.jsx          ← Drag-and-drop matching column game
│   ├── ExamineMCQ.jsx         ← MCQ quiz module with instant feedback
│   ├── GeographyMap.jsx       ← HTML5 Canvas interactive map renderer
│   ├── SectionVisualizer.jsx  ← Visualizer router (keyword → component)
│   ├── icons/
│   │   └── GamusaIcon.jsx     ← 3D animated waving Assamese Gamusa flag icon
│   └── visualizers/           ← 18 specialized SVG/CSS React visualizers
└── data/
    ├── india/                 ← 10 subtopics / 19 sections (287 practice items)
    ├── assam/                 ← 6 subtopics / 15 sections (338 practice items)
    └── northeast/             ← 9 subtopics / 19 sections (475 practice items)
```

- **`GEography.json`**: Defines the syllabus hierarchy (Subjects > Topics > Subtopics > Sections > Facts).
- **`Activity.json`**: Contains curated flashcards, matching pairs, and MCQs for every section (minimum 5–10 per category).
- **`stringMatcher.js`**: Connects section names to activities and visualizers smoothly, ignoring citations (`[cite: 1]`) and minor formatting differences.

---

## 🛠️ Technologies Used

- **React 19:** Component-based frontend library.
- **Vite 8:** Next-generation lightning-fast frontend tooling.
- **Framer Motion 12:** For smooth page transitions, waving flag physics, drawer animations, and 3D card flips.
- **Lucide React:** Modern vector icon library.
- **Vanilla CSS:** Custom dark glassmorphism design system with responsive media queries.
- **Web Audio API:** Procedural audio synthesizer for card flip, correct, and victory sound effects.

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Local Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

---

## 📜 Documentation

For an in-depth guide on the database schemas, visualizer mapping, and architecture, see [context.txt](context.txt).
