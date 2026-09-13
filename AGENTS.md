# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## Stack & architecture

React + Vite + TypeScript, `react-router` for routing, `dexie` for IndexedDB persistence. Pure
client-side app — no backend server. Data model and file layout are described in `README.md`; the
Dexie schema lives in `src/db/schema.ts`.

## Sharp edges

- Play buttons speak the `written` form (not the hiragana `reading`) via `speechSynthesis` — this is
  intentional so native Japanese TTS handles context-dependent particles (は→"wa", を→"o") correctly.
  See `src/lib/tts.ts`.
- Sentences have no `romaji` field (only vocab needs one, as a typing reference) — don't add it back.
- The Anthropic API key and `ja-JP` voice preference (`src/lib/settings.ts`) live only in
  `localStorage` — never sent anywhere but directly to Anthropic's API from the browser, and never
  persisted to IndexedDB. `src/lib/aiLookup.ts` calls the Messages API directly via `fetch` (not the
  `@anthropic-ai/sdk` package) with `anthropic-dangerous-direct-browser-access: true`, using forced
  tool-use for structured JSON output. Consult the `claude-api` skill before changing the model id,
  request shape, or pricing assumptions there — don't rely on training-data memory for those.
- JSON export/import (`src/db/exportImport.ts`) is additive on import — it never clears existing
  `vocab`/`sentences` rows first.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
