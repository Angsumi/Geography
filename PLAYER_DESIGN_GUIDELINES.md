# 📐 PLAYER_DESIGN_GUIDELINES.md — Project-Wide Player UI/UX Architecture Standard

> **Version**: 2.2 (Calm Nature UI & Unified Data Architecture Edition)  
> **Scope**: Mandatory for all Interactive Lesson Views, Quiz Engines, Flashcard Players, Match Games, and Diagram Visualizers.

This document defines the strict UI/UX design standards, ergonomic control placements, state machine flow, audio feedback, and unified data architecture for the interactive player across all subject learning repositories.

---

## 🎨 1. Color Palette: Calm Nature / Zen Style (Zero Eye Fatigue)

The player utilizes a soothing **Zen Slate & Soft Teal** palette designed for multi-hour study sessions without visual fatigue.

### Standardized Palette Tokens:
* **Primary Action Controls (`Next ➔`, `I Knew It`, Mastered Re-Play)**:
  * **Background Gradient**: `linear-gradient(135deg, #0d9488, #0f766e)` (Teal-600/700)
  * **Border**: `1px solid rgba(45, 212, 191, 0.35)`
  * **Text Color**: Soft Warm Cream `#f0fdf4` (`fontWeight: 800`)
  * **Organic Shadow**: `0 4px 18px rgba(13, 148, 136, 0.3)`
* **Secondary / Negative Controls (`I Didn't Know`, Quiz Option Fallback)**:
  * **Background**: `rgba(251, 191, 36, 0.12)` (Soft Amber Glass)
  * **Border**: `1px solid rgba(251, 191, 36, 0.35)`
  * **Text Color**: Soft Warm Sand `#fde68a`
* **Surface Cards & Backdrops**:
  * **Card Surface**: Deep Warm Zen Slate `rgba(20, 30, 45, 0.88)`
  * **Hairline Border**: `1px solid rgba(45, 212, 191, 0.2)`
  * **Ambient Elevation Shadow**: `0 12px 36px rgba(0, 0, 0, 0.4)`
* **Prohibited Colors**:
  * ❌ NO high-contrast neon red/green.
  * ❌ NO electric purple/cyan or hyper-saturated primary colors.
  * ❌ NO stark, cold black-and-white monochromatic themes.

---

## 🎛️ 2. Action Controls & Ergonomics Architecture

### A. Compact Pill Buttons
All primary interactive buttons MUST be styled as rounded pills:
```css
border-radius: 100px;
padding: 0.75rem 1.4rem;
font-size: 0.92rem;
font-weight: 800;
```

### B. Elevated Fixed Coordinate (`bottom: 64px`)
The primary action buttons (`Next ➔`, `I Knew It`, `I Didn't Know`) MUST float at a fixed screen coordinate in the lower center for optimal one-handed thumb reach:
```css
position: fixed;
bottom: 64px;
left: 50%;
transform: translateX(-50%);
z-index: 95;
```

### C. Unified Action Spot
The `Next ➔` button and self-assessment buttons (`I Didn't Know` & `I Knew It`) MUST share the exact same fixed bottom coordinate across phase transitions and card flips to enable muscle-memory interaction.

---

## 💊 3. Centered Dark Glass Quick-Jump Footer Toolbar (`bottom: 10px`)

The bottom navigation footer toolbar MUST sit fixed at the very bottom center of the screen:
```css
position: fixed;
bottom: 10px;
left: 50%;
transform: translateX(-50%);
z-index: 90;
```
* **Translucent Dark Glass**: `rgba(255, 255, 255, 0.03)` with `1px solid rgba(255, 255, 255, 0.06)` border.
* **Silver-Slate Text**: `#94a3b8`.
* **Unified Jump Pills**: `Jump: Next Topic | Next Lesson | Next Unit | Next Chapter`. Multi-colored footer pills are strictly prohibited.

---

## 🎯 4. Screen Centering & Responsive Rules

* **Viewport Centering**: All step cards (*Mission Briefing*, *Explore Map/Visualizer*, *Learn Fact*, *Flashcard*, *Quiz MCQ*, *Match Game*) MUST be centered both vertically and horizontally within the screen:
  ```css
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  ```
* **Mobile Buffer & Scaling**: Fluid width (`maxWidth: 760px`, `width: 100%`) with scroll buffer protection (`paddingBottom: 150px`).

---

## 🧹 5. Minimalist & Zero-Clutter Policy

1. ❌ **NO Debug Process Steppers**: Do NOT include stepper bars (`✓ Orient ─ 2 Explore...`).
2. ❌ **NO Technical Badges**: Do NOT include technical step badges (`STEP 2: MAP EXPLORATION`, `CONCEPT 1 OF 3`).
3. ❌ **NO Redundant Metadata Boxes**: Do NOT add estimated time boxes, concept count boxes, reward XP boxes, or generic goal statements in the Mission Briefing.
4. ❌ **NO Meta-Explanation Callout Boxes**: Do NOT add artificial callout boxes like `"Why this matters for exam"`.
5. ❌ **NO Technical Index Titles**: Do NOT prefix facts with `"Concept Fact (X of Y):"`.
6. ❌ **NO Redundant Subtitles**: Keep flashcard faces clean without subtitle instructions (`"Tap card to flip..."`).
7. ❌ **Clean Self-Assessment Labels**: Use clean labels (`I Didn't Know` & `I Knew It`) without inline XP counters on the button.

---

## 🔄 6. State Machine Phase Pipeline

The player MUST strictly transition through 7 state machine phases:

1. `briefing`: Topic introduction, scope overview, and interactive **Course Tree Visualizer** (`CourseTreeVisual`) dynamically reflecting student mastery progress (`✓ MASTERED` vs target nodes).
2. `explore`: Interactive SVG / Map visualizer node exploration.
3. `learn`: Digest core concept fact bullet points.
4. `recall`: Active recall flashcard flip.
5. `check`: Exam MCQ quiz with immediate explanation feedback.
6. `matching_recap`: Drag/tap term-to-definition matching recap game.
7. `completed`: Scorecard display with instant `Proceed to Next Topic ▶` flow.

---

## 🔊 7. Audio & Haptic Feedback Triggers

Integrated sound effects via `useSound.js` MUST be triggered on specific user actions:
* `playCorrect()`: Triggered on correct MCQ choice or `I Knew It` self-assessment.
* `playWrong()`: Triggered on incorrect MCQ selection or `I Didn't Know` self-assessment.
* `playFlip()`: Triggered on flashcard flip.
* `playComplete()`: Triggered on topic completion scorecard.

---

## 💾 8. Unified Data Layer Standard

All syllabus data MUST be imported directly from a single master JSON file:
```javascript
import syllabusData from './data/unifiedGeography.json';
```
This guarantees uniform 4-tier navigation (`Chapter ➔ Unit ➔ Lesson ➔ Topic`) without requiring runtime array concatenation.
