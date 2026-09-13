# nihongo

Japanese Learning App — a personal Japanese vocabulary/sentence flashcard study web app.

A pure client-side React + TypeScript app. All data (vocab and sentences) is stored locally in the
browser via IndexedDB (through [Dexie](https://dexie.org/)) — there is no backend server, and it can
be deployed as a static site.

## Features

- **Dashboard** — entry counts and quick links to add vocab/sentences or start a review.
- **Add Vocab / Vocab List** — manual entry of written form, hiragana reading, romaji, English,
  Chinese, and optional tags; searchable/filterable list with inline edit, delete, and a 🔊 play
  button per entry.
- **Add Sentence / Sentence List** — same as vocab, but without romaji (sentences aren't needed as a
  typing reference).
- **Flashcard Review** — pick a deck (vocab only / sentences only / both), optionally shuffle, and
  flip through cards with next/prev navigation and a progress indicator. No spaced repetition in
  this version — just linear or shuffled browsing.
- **Audio** — play buttons use the browser's built-in `speechSynthesis` API with a `ja-JP` voice
  (pick which installed voice to use in Settings), speaking the written form directly (so
  context-dependent particles like は/を are pronounced correctly).
- **AI-assisted lookup** — a "Suggest" button on the Add Vocab / Add Sentence pages calls the
  Anthropic API directly from the browser (using an API key you supply in Settings) to draft the
  hiragana reading, romaji (vocab only), English, and Chinese fields — always editable before Save,
  never auto-saved.
- **Settings** (`/settings`) — Anthropic API key (saved only in this browser's `localStorage`, sent
  only to Anthropic — see the note in-app about single-user use), `ja-JP` voice picker, and JSON
  export/import of all vocab and sentence entries.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Other scripts

```bash
npm run build     # type-check and build for production (outputs to dist/)
npm run lint       # run eslint
npm run preview    # preview the production build locally
```

## Tech stack

- React + Vite + TypeScript
- react-router for navigation
- Dexie (IndexedDB) for persistence

