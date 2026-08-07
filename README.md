# ADRE Geography Hub

ADRE Geography Hub is an interactive, gamified learning platform for studying the geography of India, Assam, and the Northeast. It transforms raw syllabus data into an engaging visual experience with interactive maps, rich diagrams, and gamified learning activities.

## Features

- **Interactive Geography Map:** Clickable SVG-based maps of India and its states using lightweight JSON data.
- **Responsive Sidebar UI:** A modern glassmorphism design with an intuitive sidebar for quick navigation, transforming into an off-canvas drawer on mobile devices.
- **Custom Visualizers:** Over 17 bespoke React components that render SVGs and CSS grids to visually explain complex geographical concepts (e.g., river flow, biosphere reserves, soil profiles).
- **Gamified Learning Modes:**
  - **Visual Flashcards:** 3D flipping cards with visual aids.
  - **Practice Matching:** Drag-and-drop terminology matching.
  - **Examine MCQ:** Multiple-choice quizzes with immediate feedback and explanations.
- **Progress Tracking:** Earn XP and maintain daily streaks to stay motivated.

## Architecture & Data Flow

The application is completely decoupled from hardcoded logic, building its UI and state dynamically from JSON datasets:
- **`GEography.json`**: Defines the syllabus hierarchy (Subjects > Topics > Subtopics > Sections).
- **`Activity.json`**: Contains the curated flashcards, match pairs, and MCQs for each section.
- **`Viz.json`**: Provides visual concepts or ideas for sections.

A robust string matching utility (`stringMatcher.js`) connects sections to their respective activities and visualizers, ensuring that slight naming differences or formatting changes (like citations) do not break the application.

## Technologies Used

- **React:** Component-based UI library.
- **Vite:** Next-generation frontend tooling.
- **Framer Motion:** For smooth transitions, drawer animations, and 3D card flips.
- **Vanilla CSS:** Custom dark glassmorphism design system with comprehensive mobile-first responsive media queries.
- **Web Audio API:** Generates procedural sound effects directly in the browser (no external `.mp3` files needed).

## Getting Started

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

## Documentation

For a deep dive into the underlying schemas and visualizer integration, see [context.txt](context.txt).
