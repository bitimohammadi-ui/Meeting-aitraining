# Meeting Bingo — Implementation Plan

## Context

The project has comprehensive research docs (PRD, UXR, Architecture) but zero application code. The goal is to implement the Meeting Bingo MVP — a browser-based game that auto-detects meeting buzzwords via the Web Speech API and fills a 5x5 bingo card in real time. The architecture doc provides complete code snippets for all core logic, types, and components.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Web Speech API (browser-native)
- canvas-confetti
- localStorage for persistence

---

## Phase 1: Project Foundation (~20 min)

### 1.1 Scaffold the Vite + React + TypeScript project
- Run `npm create vite@latest` with the `react-ts` template (into current directory or subdirectory)
- Install dependencies: `react`, `react-dom`, `canvas-confetti`
- Install dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`
- Initialize Tailwind (`npx tailwindcss init -p`)

### 1.2 Configure build tooling
- **Files to create/modify:**
  - `vite.config.ts` — port 3000, sourcemaps
  - `tailwind.config.js` — content paths, custom animations (bounceIn, pulse-fast)
  - `postcss.config.js` — Tailwind + autoprefixer
  - `src/index.css` — Tailwind directives (`@tailwind base/components/utilities`)
  - `tsconfig.json` — strict mode, path aliases if needed

### 1.3 Create project structure
```
src/
├── main.tsx
├── App.tsx
├── index.css
├── types/index.ts
├── data/categories.ts
├── lib/
│   ├── cardGenerator.ts
│   ├── bingoChecker.ts
│   ├── wordDetector.ts
│   └── shareUtils.ts
├── hooks/
│   ├── useSpeechRecognition.ts
│   ├── useGame.ts
│   ├── useBingoDetection.ts
│   └── useLocalStorage.ts
├── components/
│   ├── LandingPage.tsx
│   ├── CategorySelect.tsx
│   ├── GameBoard.tsx
│   ├── BingoCard.tsx
│   ├── BingoSquare.tsx
│   ├── TranscriptPanel.tsx
│   ├── GameControls.tsx
│   ├── WinScreen.tsx
│   └── ui/ (Button.tsx, Card.tsx, Toast.tsx)
└── context/GameContext.tsx
```

### 1.4 Implement foundational code
- `src/types/index.ts` — All TypeScript interfaces (CategoryId, BingoSquare, BingoCard, GameState, SpeechRecognitionState, WinningLine, Toast)
- `src/data/categories.ts` — Three buzzword packs (Agile, Corporate, Tech) with 40+ words each
- `src/lib/cardGenerator.ts` — Fisher-Yates shuffle + 5x5 grid generation with center free space
- `src/lib/bingoChecker.ts` — Check rows, columns, diagonals for win; count filled; closest-to-win helper
- `src/lib/wordDetector.ts` — Normalize text, word-boundary regex matching, alias detection

---

## Phase 2: Core Game UI & Mechanics (~30 min)

### 2.1 App shell and routing
- `src/App.tsx` — Screen-based navigation (landing → category → game → win) using `useState<Screen>`
- Wire up game state initialization and screen transitions

### 2.2 Landing Page
- `src/components/LandingPage.tsx` — Hero section, "New Game" CTA, privacy note, how-it-works steps
- Reference: PRD section 6.2 layout

### 2.3 Category Selection
- `src/components/CategorySelect.tsx` — 3 category cards with icon, name, description, sample words, select button
- Reference: PRD section 6.3 layout

### 2.4 Game Board
- `src/components/GameBoard.tsx` — Main game container with header (status, progress counter), bingo card, transcript panel, controls
- `src/components/BingoCard.tsx` — 5x5 CSS grid rendering BingoSquare components
- `src/components/BingoSquare.tsx` — Individual square with states: default, filled, auto-filled, free space, winning
- `src/components/GameControls.tsx` — New card button, listening toggle

### 2.5 Manual gameplay
- Click/tap to toggle square fill state
- On each fill, run bingo checker
- Display progress counter (X/24 filled)
- On win detection, transition to win screen

---

## Phase 3: Speech Recognition (~25 min)

### 3.1 Speech recognition hook
- `src/hooks/useSpeechRecognition.ts` — Wraps Web Speech API with:
  - Feature detection (`SpeechRecognition || webkitSpeechRecognition`)
  - Continuous listening mode
  - Interim + final transcript tracking
  - Auto-restart on unexpected end
  - Error handling (permission denied, not-allowed, etc.)

### 3.2 Word detection integration
- On each final transcript result, run `detectWordsWithAliases()` against card words
- Auto-fill matched squares (mark `isAutoFilled: true`)
- Check for bingo after each auto-fill

### 3.3 Transcript panel
- `src/components/TranscriptPanel.tsx` — Live transcript display (last 100 chars), listening indicator, detected words badges

### 3.4 Microphone permission UX
- Clear prompt explaining why mic is needed
- Privacy message: "Audio processed locally, never recorded"
- Graceful fallback if permission denied (manual-only mode)

---

## Phase 4: Polish & Win State (~15 min)

### 4.1 Win celebration
- `src/components/WinScreen.tsx` — BINGO banner, highlighted winning line on card, game stats (time, winning word, squares filled, category)
- `canvas-confetti` integration for particle celebration
- Play Again + Back to Home buttons

### 4.2 Share functionality
- `src/lib/shareUtils.ts` — Generate text summary for clipboard
- Native Share API on mobile, clipboard fallback on desktop
- Format: emoji card + stats + link

### 4.3 localStorage persistence
- `src/hooks/useLocalStorage.ts` — Persist active game state across page reloads
- Restore game on return if in-progress

### 4.4 Responsive design
- Mobile-first Tailwind classes
- Square text sizing responsive (`text-xs sm:text-sm`)
- Touch-friendly tap targets

---

## Verification

1. **Dev server**: `npm run dev` — app loads at localhost:3000
2. **Card generation**: Select each category → verify 24 unique words + FREE center
3. **Manual play**: Tap squares → verify fill toggle → complete a row → verify BINGO detection + confetti
4. **Speech recognition** (Chrome): Enable mic → speak buzzwords → verify auto-fill + transcript display
5. **Win flow**: Complete BINGO → verify stats → test share button
6. **Type check**: `npx tsc --noEmit` passes
7. **Build**: `npm run build` succeeds

---

## Key Reference Files

| Purpose | Path |
|---------|------|
| PRD | `docs/research/meeting-bingo-prd.md` |
| UXR | `docs/research/meeting-bingo-uxr.md` |
| Architecture (complete code snippets) | `docs/research/meeting-bingo-architecture.md` |
| Environment schema | `.env.schema` |
