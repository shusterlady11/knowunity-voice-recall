---
name: build-screen
description: "Use when building or editing any screen in this prototype (the Knowunity voice-recall usability test): any page under src/app/, any route in SPEC.md's screen list, or when the user says 'Build [screen name]'. Covers where screens live, how to compose them from the Storybook library, what to do when a component is missing, and what to report when done."
---

# Build a screen

## Where screens live

- **Every screen is a page in the Next.js app,** at its own route under `src/app/`, as listed in SPEC.md › Screen list. The route and file for each screen are in that table.
- **Every screen is reachable by tapping through from the screen before it.** Typing a URL doesn't count as a way in.
- **Storybook is the catalog for components only.** A screen that only exists as a Storybook story isn't built. Stories like "Scaffold › Question screen (voice)" are references to copy from, not the screen itself.
- **One screen at a time,** in SPEC.md's build order, and only when the user says "Build [screen name]".

## The method

### 1. Read SPEC.md for this screen

Read its section under SPEC.md › Screens: its states, components and actions table. Also read the "Every screen" rules above that section, and "How the mocked recall behaves" if the screen shows a verdict, hint, XP, progress or timing. Then check `docs/open-items.md` for decisions that block this screen, and `docs/sprint-context.md` before deciding anything that may already be decided.

### 2. Check for a Figma frame

SPEC.md's screen list names the frame(s) for each screen, or says "none". Confirm in Figma, because the answer changes what you do:

- **File:** 1fSfWxZSPoaFQ8Dg36EGXs. Frames are on the page "Core flow for Claude Code". Figma is read-only: never change it.
- **Tool:** the figma-console MCP (`figma_execute`, `figma_take_screenshot`). Reading the page "Mascot & components" fails with "Unknown node type", so read a component through one of its instances on "Core flow for Claude Code".
- **Read everything:** every instance and its variant, including icon instances, hidden layers and loose layers that aren't components. Take a screenshot of the frame to compare against later.

**With a frame:** match it. **Without one:** read `docs/design-brief.md` and `docs/voice-ux.md` for how the state should behave, and compose it from the patterns of the nearest screen that has a frame.

### 3. Query Storybook for every component

For every component the screen uses, call the Storybook MCP: `docs-list` once, then `docs-show` for each component, and `docs-show-story` for a story you're copying from. Use only props that are documented or shown in a story. Never assume a prop. A component's code snippet in a story can hide its defaults, so read the full docs before concluding something is missing.

If the MCP can't connect, Storybook isn't running: start it with `npm run storybook -- --no-open` in the background and try again. If `test-run` times out, the Vitest worker has hung: stop Storybook and start it again.

### 4. Compose from what's in Storybook

Storybook is the only place to look for something to reuse. Most of the Figma library was never built in code, so a component existing in Figma doesn't mean it exists here. Import components from `src/components/<name>/`, and icons from `src/icons/`.

- **Build on `Scaffold`**, using its slots `topNavigation`, `middleContent`, `bottomContent` and `bottomSheetOnly`. Never build a screen outside it.
- **Sheets** (exit confirm, Reveal answer, More info, mic primer) are overlays in `bottomSheetOnly` on the same route, not routes of their own. Every overlay follows these rules (decided 2026-10-04, on the Reveal answer sheet):
  - **Dimmed, not blurred:** the screen behind stays visible under `Scaffold`'s scrim (`showBottomSheetBackground`). Don't add the blur some Figma frames show, and list it as a difference.
  - **Square screen corners:** `Scaffold` no longer rounds its corners, so a sheet or bottom bar runs cleanly to the screen's edge. Never round them again on a screen.
  - **Text inset:** a sheet's text content gets `padding-inline: var(--space-400)` on top of the sheet's own `Space/400`, so it sits 32px from each screen edge (Figma centers a fixed 320px block).
  - **Room at the bottom:** a sheet with no `bottomSection` (no buttons) gets `padding-bottom: max(var(--space-800), env(safe-area-inset-bottom))` under its content: 40px with the sheet's own `Space/200` (Figma leaves 43), growing to clear the iPhone's home bar. `src/app/q/[n]/result/result.css` (`.answerSheet__content`) is the reference.
  - **Behavior:** the screen behind is `inert` while a sheet is open; focus moves into the sheet, Escape closes it, and closing hands focus back to what opened it. A sheet's X gets its own name for screen readers ("Close answer"), so it isn't confused with the app bar's "Close". `src/app/q/ExitConfirm.tsx` and `src/app/q/[n]/result/AnswerSheet.tsx` are the references.
  - **Height:** a sheet grows with its content up to just below the app bar, then its content scrolls while its top bar and buttons stay put. `Scaffold` and `BottomSheet` do this; don't set a height on the screen.
  - **Secondary buttons** on a sheet already take `background/floating` from `BottomSheet`; don't override them on the screen.
  - **The bulleted, underlined heading** from Reveal answer is inline (`docs/component-gaps.md`). If another sheet needs it, build it as a component, per step 5.
- **Answer-screen buttons** (decided 2026-10-05): "Reveal answer" is always on the left. On a correct answer the bar is `BottomCTA` "Two button drawer", Secondary "More info" on the left and Primary "Next" (or "Finish") on the right. On every other verdict (partial, wrong, didn't catch that, and after two hints) it's "Two button drawer / Secondary", Tertiary "Reveal answer" on the left and Secondary "Next" (or "Skip" after didn't catch that) on the right; the nudge only changes the card's text. This applies to the typing screen too. `src/app/q/[n]/result/ResultScreen.tsx` is the reference.
- **Components fill the width `Scaffold` gives them.** The screen's margin is 16px (`--space-400`) everywhere. Never hard-code 358.
- **Centered content sits 24px above center:** when the middle content is a centered block (headline, Knowie, text; for example the End screen and Mic skipped), wrap it in a flex column that fills `middleContent` with `justify-content: center` and `padding-bottom: var(--space-1200)`. The extra space below lifts the block by half of it, 24px. `src/app/start/start.css` (`.start__content`) is the reference. Screens laid out from the top, like the question screen, don't get this.
- **Bottom buttons:** 16px from each side, lining up with the cards above them (the side margin `Scaffold`'s `bottomContent` already gives, so add no side padding), and 24px from the bottom edge (`Scaffold`'s 16px plus `padding-bottom: var(--space-200)` on the screen's wrapper around the buttons). Do this even where a Figma frame insets them differently (some frames use 28px all round), and list it as a difference.

### 5. When something isn't in Storybook

Don't stop to ask. Build it inside the screen, from tokens, and add a line to `docs/component-gaps.md`: what it was, and which screen it was for. Create the file if it doesn't exist.

Log it as you write it, not in the report at the end. This covers anything built by hand in a screen: a layout wrapper, an offset or negative margin, or a component used for a job other than its own (for example `TapToAnswer` showing a status). Before you write a rule, search the other screens' CSS for the same one; if it is already there, this is the second copy.

If the same thing is already on that list from another screen, or already written in another screen's CSS, build it properly as a component or a Scaffold slot instead:
- a folder in `src/components/<lowerCamelName>/` with its CSS and a story
- props named as in Figma
- the Figma description in the story docs
- stories that test it
- mark it as built in `docs/component-gaps.md`, and add it to CLAUDE.md's component list
- switch the earlier screen over to it

Never hand-draw the Knowie mascot: it's `MascotSlot`.

### 6. Every value from the generated tokens

Colors, spacing, radius, type, sizes and motion come from `build/css/tokens.css` as CSS variables (`var(--space-400)`, `var(--color-text-primary)`, `var(--type-headline-l-fontSize)`). No raw hex, no raw px, and no fallbacks (`var(--x, #fff)`). Go through semantic tokens, never primitives. If a value you need has no token, don't invent one: add it to `tokens/tokens.json` (or `tokens/motion.json` for timing) only if Figma has it, run `npm run tokens`, and never edit `build/css/tokens.css` by hand.

### 7. Mobile only: 390px, dark mode

- 390×844, dark mode only, styled as native iOS but running as a web app. No tablet or desktop layout, no light theme, no hover-only interactions.
- Tap targets at least 44×44; contrast and reduced motion as in `docs/platform-constraints.md`.
- Sentence case on every label, button and heading.
- It's tested on a real iPhone 17 (402×874) from the Home Screen, so leave room for the safe areas.

### 8. Build every state

Build every state SPEC.md lists for the screen, including the failure ones ("didn't catch that", "Taking a moment…", wrong, the fixed nudge after two hints, mic off). Each state must be reachable in the running app, through the mocked recall engine's script, not only by editing code. Voice in, text out: Knowie never speaks, and recording stops only when the student taps stop.

### 9. Every action goes where SPEC.md says

Wire every button, toggle and close to the destination in the screen's actions table. A button that leads nowhere means the screen isn't finished. If the destination is a screen that isn't built yet, say so in the report as unfinished, rather than calling the screen done. Every required action has a way out or a non-voice fallback: never trap the student.

### 10. Every state is said and named

When you add a state, add two things in the same change, not later:
- **Its sentence:** every change a sighted student sees is also said, as a full sentence, through the one live region (`announce()`), including opening and closing a sheet, a new screen, and a switch between voice and typing.
- **Its name:** every control's accessible name says what it does in its current state. A button that starts a take and then ends it is "Record answer", then "Stop and send answer". A graphic that shows a number carries the number in its label.

Check it in the running app: after each tap, read the live region's text.

### 11. Say each thing once

Each fact appears once on a screen, in the one element best suited to carry it. Before you add a number, label, icon or sentence, look at what the screen already says. If something says it, remove one of the two; do not style them differently to make both look needed. Common repeats: a count in a ring and in the headline, an icon that repeats its card's color, a card that says "tap the mic" above a caption that says it too, a confirm sheet and the screen after it both saying "saved".

### 12. Put it next to its neighbors

Before you call a screen done, look at it beside the screen that leads to it and the one that follows:
- It is not louder than the screen before it (saturated fills, big areas, type weight), unless it is the one peak the flow builds toward, and then through one element.
- The mic, the primary action and the toggle sit at the same coordinates as on the neighbors. If states differ in height, the content moves, not the control.
- Read the copy aloud across the screens as one script. Wording that wouldn't fit on the previous screen gets rewritten. If it comes from Figma, report it instead.

### 13. Blocked states tell the way through

Any state that blocks the main path (mic denied or skipped, slow, can't hear, unavailable) says what happened, why in one clause, what the student can do now, and how to undo it later. It never presents the fallback as the lesser choice, and never presents leaving as the alternative to the fallback. See "Blocked states, in general" in `docs/voice-ux.md`.

## Next.js in this repo

This is Next.js 16. Read the relevant guide in `node_modules/next/dist/docs/` before writing a page.
- `params` and `searchParams` are Promises.
- `Button` has only `onClick`, no `href`, so a screen with taps is a `'use client'` component that navigates with `useRouter().push` from `next/navigation`. Keep `page.tsx` a server component when it only reads `params`, and put the taps in a client component beside it.
- Screen CSS goes in a file next to the page, using tokens only.

## Check it

- `npm run lint` and `npm run build` pass.
- `npm run check:render` passes at 320, 390 and 430px (overflow, contrast, tap targets, wrapped-text line height, the mic and question card staying put, state changes reaching the live region). Report anything it finds before fixing it; only the designer adds an entry to `scripts/check-render.known.json`.
- `npm run dev`, then open the screen at 390×844 by tapping through from the screen before it. Every state shows, every tap goes where SPEC.md says, and text renders in Inter.
- The Storybook `test-run` MCP tool still passes, and so do any new component stories.
- Screenshot the result next to the Figma frame, if there is one.

## Report when done

- **With a Figma frame:** list every difference between what you built and the frame: size, spacing, text, component or variant, and missing or extra elements. Give the reason for each difference, or say there is none.
- **Without a frame:** list everything you had to decide that wasn't written down anywhere (SPEC.md, `docs/design-brief.md`, `docs/voice-ux.md`, `docs/sprint-context.md`).
- **Always:**
  - what you removed, moved or reworded because of steps 11 and 12, and any state whose sentence or name you added in step 10
  - what you added to `docs/component-gaps.md`
  - any button that goes to a screen not built yet
  - any state you couldn't make reachable

Don't commit until the user asks.
