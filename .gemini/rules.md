# Project-Wide Player UI/UX Design System Rules

All interactive player components (e.g. `InteractiveLesson.jsx`, `MatchGame.jsx`, `SectionVisualizer.jsx`, and any future lesson views) MUST strictly adhere to the following UI/UX rules.

---

## 1. 🎨 Color Palette: Calm Nature / Zen Style (Zero Eye Fatigue)
- **Primary Action Accent (`Next ➔`, `I Knew It`, Mastered Re-Play)**:
  - Gradient: `linear-gradient(135deg, #0d9488, #0f766e)` (Tailwind Teal-600/700).
  - Border: `1px solid rgba(45, 212, 191, 0.35)`.
  - Text: Soft warm cream `#f0fdf4`.
  - Shadow: Soft organic glow `0 4px 18px rgba(13, 148, 136, 0.3)`.
- **Secondary / Negative Action Buttons (`I Didn't Know`, Quiz Option Fallback)**:
  - Background: `rgba(251, 191, 36, 0.12)`.
  - Border: `1px solid rgba(251, 191, 36, 0.35)`.
  - Text: Soft Warm Sand `#fde68a`.
- **Surface Cards & Backdrop**:
  - Background: Deep Warm Slate `rgba(20, 30, 45, 0.88)`.
  - Border: Subtle teal hairline `1px solid rgba(45, 212, 191, 0.2)`.
  - Ambient Shadow: `0 12px 36px rgba(0, 0, 0, 0.4)`.
- **STRICT PROHIBITION**:
  - NO high-contrast neon red/green.
  - NO electric purple/cyan or saturated primary colors.
  - NO stark, cold black-and-white monochromatic themes.

---

## 2. 🎛️ Action Button Placement & Ergonomics
- **Pill Shape (`borderRadius: 100px`)**: Action controls MUST be compact, rounded pills (`padding: 0.75rem 1.4rem`, `fontSize: 0.92rem`, `fontWeight: 800`).
- **Elevated Fixed Position (`bottom: 64px`)**: Primary action controls MUST be fixed at the bottom center of the screen (`position: fixed`, `bottom: 64px`, `left: 50%`, `transform: translateX(-50%)`, `zIndex: 95`).
- **Unified Action Spot**: The `Next ➔` button and self-assessment buttons (`I Didn't Know` & `I Knew It`) MUST share the exact same fixed bottom coordinate across phase transitions and card flips.

---

## 3. 💊 Bottom Quick-Jump Footer Toolbar
- **Centered Monochrome Footer (`bottom: 10px`)**: The navigation footer toolbar MUST sit fixed at the very bottom center of the screen (`position: fixed`, `bottom: 10px`, `left: 50%`, `transform: translateX(-50%)`, `zIndex: 90`).
- **Subtle Dark Glass Pills**: Footer jump pills (`Jump: Next Topic | Next Lesson | Next Unit | Next Chapter`) MUST use translucent dark glass (`rgba(255, 255, 255, 0.03)` with `1px solid rgba(255, 255, 255, 0.06)` border) and silver-slate text (`#94a3b8`). NO multi-colored footer pills.

---

## 4. 🎯 Vertical & Horizontal Card Centering
- **Screen Centering**: All step cards (*Mission Briefing*, *Explore Map*, *Learn Fact*, *Flashcard*, *Quiz MCQ*, *Match Game*) MUST be centered both vertically and horizontally within the viewport (`minHeight: calc(100vh - 160px)`, `display: flex`, `alignItems: center`, `justifyContent: center`).
- **Mobile Responsiveness**: Fluid width scaling (`maxWidth: 760px`, `width: 100%`) with scroll buffer protection (`paddingBottom: 150px`).

---

## 5. 🧹 Zero Clutter & Minimalist Content Policy
- **NO Debug Process Steppers**: Do NOT include internal process stepper bars (`✓ Orient ─ 2 Explore...`).
- **NO Technical Badges**: Do NOT include technical badges (`STEP 2: MAP EXPLORATION`, `CONCEPT 1 OF 3`).
- **NO Redundant Metadata Boxes**: Do NOT add estimated time boxes, concept count boxes, reward XP boxes, or generic goal statements in the Mission Briefing.
- **NO Meta-Explanation Callout Boxes**: Do NOT add artificial callout boxes like `"Why this matters for ADRE exam"`.
- **NO Technical Index Titles**: Do NOT prefix facts with `"Concept Fact (X of Y):"`.
- **NO Redundant Subtitles**: Keep flashcard faces clean without subtitle instructions (`"Tap card to flip..."`).
- **Clean Self-Assessment Labels**: Use clean labels (`I Didn't Know` & `I Knew It`) without inline XP counters on the button.
