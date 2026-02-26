# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meeting Bingo — a browser-based game that auto-detects meeting buzzwords via the Web Speech API and fills a 5x5 bingo card in real time. The project has comprehensive research docs but application code is being built from scratch.

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Speech:** Web Speech API (browser-native, Chrome primary target)
- **Animation:** canvas-confetti
- **Persistence:** localStorage (no backend)
- **Deployment:** Vercel (static hosting)
- **Environment Management:** @env-spec/varlock (schema in `.env.schema`, types generated to `env.d.ts`)
- **External Services:** Linear API (project management, key in `LINEAR_API_KEY`)

## Common Commands

Once the Vite project is scaffolded:

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Type-check + production build (tsc && vite build)
npm run preview      # Preview production build
npm run lint         # ESLint (ts,tsx files)
npx tsc --noEmit     # Type-check only
```

## Architecture

The app uses screen-based navigation via `useState<Screen>` (landing → category → game → win) — no router.

### Key directories (under `src/`)

- `types/index.ts` — All TypeScript interfaces (CategoryId, BingoSquare, BingoCard, GameState, etc.)
- `data/categories.ts` — Three buzzword packs (Agile, Corporate, Tech) with 40+ words each
- `lib/` — Pure logic: card generation (Fisher-Yates shuffle), bingo win checking (rows/cols/diagonals), word detection (regex + alias matching), share utils
- `hooks/` — `useSpeechRecognition` (Web Speech API wrapper with auto-restart), `useGame`, `useBingoDetection`, `useLocalStorage`
- `components/` — Screen components (LandingPage, CategorySelect, GameBoard, WinScreen) + game UI (BingoCard, BingoSquare, TranscriptPanel, GameControls) + `ui/` primitives
- `context/GameContext.tsx` — Global game state via React Context

### Key design patterns

- Center square (2,2) is always FREE and pre-filled
- Speech recognition: continuous mode, interim + final transcripts, auto-restarts on unexpected end
- Word detection runs on final transcript results, supports multi-word phrases and aliases (e.g., "CI/CD" → ["ci cd", "cicd", "continuous integration"])
- Manual tap always available as fallback if speech unavailable

## Research & Planning Docs

- `docs/research/meeting-bingo-prd.md` — Product requirements
- `docs/research/meeting-bingo-uxr.md` — UX research
- `docs/research/meeting-bingo-architecture.md` — Full architecture with complete code snippets for all core logic
- `docs/implementation_plan.md` — Phased build plan

## Environment

- `.env.schema` defines env vars using @env-spec format; `env.d.ts` is auto-generated (do not edit manually)
- `LINEAR_API_KEY` is the only meaningful env var (sensitive, optional)
