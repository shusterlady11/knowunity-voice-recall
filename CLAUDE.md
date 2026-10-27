@AGENTS.md

## What this is

Next.js web prototype of Knowunity's voice active-recall feature (student speaks, Knowie replies in text) — 2.5-week sprint, 390px, dark mode, iOS-styled.

## Hard rules

- Read `node_modules/next/dist/docs/` before writing any Next.js code (AGENTS.md).
- 390px, dark mode only, web app styled as native iOS — not native. `docs/platform-constraints.md`.
- Voice in, text out. A spoken reply may come later, but only on top of the on-screen text. `docs/sprint-context.md` (Real recall engine).
- Concept — single source, don't restate: `docs/sprint-context.md`.
- Recall engine: a real one replaces the mock in phases (AI judge, then speech-to-text, then spoken replies). Until a phase ships, the mock covers it: fake transcript, fake verdict, fake-but-present latency. `docs/sprint-context.md` (Real recall engine), `docs/platform-constraints.md`.
- Every screen is built from `scaffold`'s slots. `docs/design-system.md` §2.
- All color/spacing/radius/type/motion values: `tokens/` (`tokens.json` is synced from Figma; `motion.json` is code-only). Usage rules: `docs/design-system.md`.
- `npm run check` runs the token, fallback, generated-file and CLAUDE.md checks and prints the file and line for each problem. Run it after building or changing any component, and report findings before fixing them.
- `npm run check:render` walks every screen and state at 320, 390 and 430px in a real browser. It starts the app itself and takes a couple of minutes, so it is not part of `npm run check`. Run it after building or changing a screen, and report what it finds before fixing. Known, decided failures live in `scripts/check-render.known.json` with their reason; add to it only with the designer's say-so.
- Naming: lowerCamelCase for components/props/tokens. `docs/design-system.md` §3 (legacy exceptions).
- Contrast, touch-target, reduced-motion requirements. `docs/platform-constraints.md`.
- Decisions already made: `docs/sprint-context.md` — check before re-deciding.
- Commit messages: summary line, then one sentence on *why* (the constraint or decision driving it) before the *what* bullets — this repo may be shared publicly and should read without prior context.

## Never

- Never invent a color/spacing/radius/type/motion value not in `tokens/`.
- Never build a screen outside `scaffold` (`docs/design-system.md` §2).
- Never build a new component when an existing one covers it, or invent one to fill a gap — flag the gap instead (`docs/design-system.md` §4).
- Never read a primitive color/value directly from a component — go through the semantic layer. `docs/design-system.md` §4.
- Never use anything but sentence case on labels, buttons, headings, or text built from data (a stored name inside a sentence is lowercase). `docs/design-system.md` §4.
- Never say one fact twice on a screen: one element carries each number, label, icon or sentence. Remove the repeat instead of styling it differently. Build-screen skill, step 11.
- Never build something by hand in a screen (a wrapper, an offset, a component used for another job) without logging it in `docs/component-gaps.md` as you write it, and never copy a hand-built rule a second time: it becomes a component or a slot. Build-screen skill, step 5.
- Never add a state without its screen-reader sentence in the live region and an accessible name that says what the control does in that state. Build-screen skill, step 10.
- Never use native APIs (haptics, permission sheets, nav transitions). `docs/platform-constraints.md`.
- Never build a hover-only interaction — no hover on mobile. `docs/platform-constraints.md`.
- Never auto-detect end-of-speech — push-to-talk with explicit stop only — and never let a spoken reply replace the on-screen text. `docs/design-brief.md`, `docs/voice-ux.md`.
- Never leave a required action without an escape route or non-voice fallback — "never trap the student." `docs/design-brief.md`, `docs/voice-ux.md`.
- Never build tablet or desktop layouts, or RTL — out of scope this sprint. `docs/platform-constraints.md`.
- Never call a model or speech provider from the browser, or keep an API key anywhere but `.env.local`. Keys are read by server routes only. `docs/sprint-context.md` (Real recall engine).
- Never hand-recreate the Knowie mascot freehand — export the real component from Figma. `docs/design-system.md` §1.
- Figma is read-only. Never modify the Figma file; report differences instead.

## Storybook

When working on UI, use the storybook tools to read the component library before answering or writing anything. Never assume a component prop exists. Query the documentation, and use only props that are documented or shown in a story. If a prop isn't there, stop and ask me.

## Where things live

- `docs/file-map.md` — what every folder and key file is for. Read it before looking for a file.
