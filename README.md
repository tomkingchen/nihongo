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
- **Audio** — play buttons speak the written form directly (so context-dependent particles like は/を
  are pronounced correctly) using either the browser's built-in `speechSynthesis` API with a `ja-JP`
  voice, or a locally-run [VOICEVOX](https://voicevox.hiroshiba.jp/) engine for higher-quality audio
  (choose the engine, and pick voice/speaker, in Settings — see below).
- **AI-assisted lookup** — a "Suggest" button on the Add Vocab / Add Sentence pages calls the
  Anthropic API directly from the browser (using an API key you supply in Settings) to draft the
  hiragana reading, romaji (vocab only), English, and Chinese fields — always editable before Save,
  never auto-saved.
- **Settings** (`/settings`) — Anthropic API key (saved only in this browser's `localStorage`, sent
  only to Anthropic — see the note in-app about single-user use), voice engine choice (browser vs.
  VOICEVOX) with a `ja-JP` voice picker or VOICEVOX engine URL/speaker picker and a "Test" button, and
  JSON export/import of all vocab and sentence entries.

## Better audio with VOICEVOX (optional)

The browser's built-in `speechSynthesis` voice is serviceable but robotic. For noticeably better
Japanese audio, you can run [VOICEVOX](https://voicevox.hiroshiba.jp/), a free, open-source,
locally-run Japanese text-to-speech engine, on your own machine, and point this app at it.

1. Download and install the VOICEVOX engine/app from the [official VOICEVOX
   site](https://voicevox.hiroshiba.jp/) (or run its Docker image) and start it. Follow VOICEVOX's own
   install docs — they're the source of truth and can change.
2. By default the engine listens on `http://127.0.0.1:50021`.
3. **CORS**: the engine's default CORS policy (`--cors_policy_mode localapps`) only allows requests
   from `localhost`/`127.0.0.1`/`app://` origins. If this app is served from a different origin/port
   (e.g. the Vite dev server on `http://localhost:5173`), the engine must be started with a relaxed
   CORS policy so your browser is allowed to call it — either `--cors_policy_mode all` (permits any
   origin) or `--allow_origin http://localhost:5173` (permits just that origin). Pass this as a
   command-line flag when launching the engine; see the engine's `-h`/`--help` output or its
   [GitHub repo](https://github.com/VOICEVOX/voicevox_engine) for the current flag names and
   defaults, since these can change between versions.
4. In this app's Settings page, choose "VOICEVOX (local)" as the voice engine, confirm/edit the base
   URL, pick a speaker, and click "Test" to confirm it can reach the engine and play audio.

If the engine isn't running or isn't reachable (wrong port, CORS blocked, etc.), play buttons and the
Settings "Test" button show a clear error instead of silently falling back to the browser voice —
switch back to "Browser (default)" in Settings if you don't want to run VOICEVOX.

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

