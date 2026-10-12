# Prototype rubric

How to grade the Knowunity voice active-recall prototype: a 390px, dark-mode, iOS-styled web app where the student speaks and Knowie answers in text. The recall engine is mocked, so grade the experience, not the engine.

Each of the seven dimensions is scored 1–10 against the anchors below. The hard gates at the end are checked separately and are pass/fail.

## Scoring rules

1. **"Looks good" is a 6, not a 9.** A 9 survives a senior critique untouched: someone looking for problems finds nothing worth raising.
2. **A dimension scores 8 or above only if it was verified by rendering, measuring or testing.** Never from reading code. Verification means one of: the screen rendered at 390px (and ideally checked on a phone), a measured value (contrast ratio, target size, spacing), or a test or check that ran (`npm run check`, `npm run test:unit`, Storybook `test-run`). If the evidence is code only, cap that dimension at 7 and say so.
3. Score each dimension on what is built. A flagged and documented gap (`docs/component-gaps.md`, `docs/gaps-and-cuts.md`) is not a defect, but it also earns no credit.
4. Every score is written with its evidence: what was rendered, measured or run, and where. A score with no evidence is treated as unverified.

| Dimension | What it asks | Weight |
|---|---|---|
| System fidelity | Does every value trace back to a token, and every component to the library | High |
| Coherence | Does it read as one product, or as screens that arrived separately | High |
| Craft | Spacing, rhythm, states, the small deliberate decisions | High |
| UX judgment | Are the states handled, the hierarchy clear, the failure paths designed | High |
| Redundancy | Can any element, or combination of elements, be simplified further, or is each as basic as it can be | High |
| Accessibility | Contrast, touch targets, whether meaning ever rests on color alone | Medium |
| Structure | Does the layout hold together and the thing render | Low |

---

## 1. System fidelity (High)

**Scoring:** whether the build is made of the design system. Every color, space, radius, type and motion value resolves to a token in `tokens/` through the semantic layer. Every screen is a `scaffold` filled through its slots. Every component is an existing library component, with only documented props.

| Score | What it looks like here |
|---|---|
| **4** | Tokens are used in most places but some values are eyeballed (an 18px inset that is not on the `space/*` scale), or a component reads a primitive color directly. Some screens are hand-laid frames that only resemble `scaffold`. A component was built to fill a gap without being flagged. Labels drift into Title Case or all caps. |
| **6** | Values are tokens and screens are `scaffold`-based, with no raw hex. Gaps are flagged in `docs/component-gaps.md`. A few quiet violations remain: a one-off layout built by hand where `buttonGroup` or `textBlock` would fit, a component prop that is not in the docs, or a `listItem` variant chosen by eye. |
| **9** | Nothing needs explaining. `npm run check` is clean (tokens, fallbacks, generated, claude). Spot-checking computed styles in the rendered page, every spacing, radius, color and type value maps to a token. No component reads past the semantic layer. Every screen fills the `scaffold` slots. No component duplicates an existing one, and every gap is flagged rather than routed around. Sentence case everywhere. Motion values come from `motion.json`. |

**Verify by:** running `npm run check`, comparing computed styles in the rendered page against `tokens/`, and reading each component's Storybook docs for the props used.

## 2. Coherence (High)

**Scoring:** whether the prototype reads as one product made by one team, from the tour through the question loop, results and end screen.

| Score | What it looks like here |
|---|---|
| **4** | Screens use the same components but disagree on rhythm. Margins, header treatment and button placement shift from screen to screen. Knowie's voice changes between screens (formal here, chatty there). The recording, thinking and result states look like they came from different sessions. |
| **6** | Consistent chrome and components, and the 16px margins hold. The seams show in places: the first-run tour feels different from the question loop, copy tone wobbles, or the results screen is visually louder than anything before it. |
| **9** | Walking tour → question → recording → thinking → verdict → hint → reveal → results → end, nothing marks a screen as built separately. The mic sits where the thumb expects it on every screen. Motion has one personality (the same easing and durations for the same kind of change). Knowie's copy is one voice: warm, brief, never tutoring. Pass, partial, fail and "didn't catch that" read as one family. Entering and leaving a screen follows the same logic everywhere. |

**Verify by:** rendering the whole flow in order at 390px and laying screenshots side by side; reading the copy aloud as one script.

## 3. Craft (High)

**Scoring:** the small deliberate decisions: spacing rhythm on the 4px base, state treatment, motion, press feedback, safe areas, text that holds up under expansion.

| Score | What it looks like here |
|---|---|
| **4** | Spacing is on-scale but uneven, and optical alignment is off. Press feedback is missing on some tappable elements. The thinking state is a bare spinner, or the wait is nearly instant, so the hardest state has not been designed. Content sits under the status bar or home indicator. Motion is decorative rather than telling the student what is happening. |
| **6** | Spacing and alignment are tidy and the states exist. Recording and thinking are visually distinct and the delay is real. The craft is competent but generic: reduced-motion falls back lazily, press feedback is uneven, a long German label wraps awkwardly, or the entrance animations are the same everywhere and say nothing. |
| **9** | The details are deliberate. Every tappable element scales down on press and returns on release. Recording has an unmistakable treatment (`recordingGlow`, `micButton` state) and a calm, skeleton-like thinking state that covers the few-second wait, using `loadingDots` rather than a dead spinner. With `prefers-reduced-motion` on, the status is still legible without motion. Safe areas are right on a real phone with a notch. The tightest label survives German at 30–40% longer. Body text is 14px or larger, with 1.4–1.6 line height. The `middleSection` rise only plays when the question changed. Rhythm is consistent down the page, and a reload on the recording or thinking route lands safely. |

**Verify by:** rendering each state at 390px and on a real phone via Home Screen; toggling reduced motion; pasting German into the tightest label; measuring spacing against the 4px scale.

## 4. UX judgment (High)

**Scoring:** whether the design makes good calls under the brief and `docs/voice-ux.md`. This is the dimension where the hard constraints are tested.

The anchors below come from the brief's hard constraints and voice-ux.md's six principles: system status at every moment, student control of start and stop, mic permission in context with a designed "No", generous judging that separates misheard from didn't-know, a non-voice path, and designing the wait.

| Score | What it looks like here |
|---|---|
| **4** | The happy path works but the failure paths are thin. Idle, recording and result exist, but it is hard to tell recording from idle. Processing is missing or abrupt. A student who denies the mic or cannot speak hits a dead end. A fail verdict is blunt. The hierarchy is unclear: several competing primary actions, or the verdict is buried. Knowie drifts into tutoring, or the flow auto-detects end of speech. |
| **6** | All the Must states in voice-ux.md exist: idle, recording, processing, pass/partial/fail, cancel and re-record, text fallback, permission primer, permission denied → text, skip. Hierarchy is clear on the main screens. The weak spots are second-order: the hint ladder is present but the nudge is too revealing or too vague, the transcript is shown without framing it as "what we heard", the denied state explains nothing, or the results screen reports a number without making the signal feel earned. |
| **9** | A student is never trapped, and each state answers "what is happening and what can I do?" Push-to-talk with an explicit stop and a cancel before sending; Knowie never speaks and never auto-ends the take. The permission primer comes from a user action and the denied path leads to text with a way to re-enable. A text path is reachable in one tap from any required voice step, and framed as accessibility, not as a lesser option. Judging leans generous: partial over fail on a close answer, and "didn't catch that" is separate from wrong, with the transcript shown as a transparency aid, never a required correction. The wait is designed. The hint ladder nudges without giving the answer away, and Reveal opens the draggable overlay. Say-it-back is optional. XP follows how the answer was earned and confirms only when the breakdown renders. The results screen earns the "I actually know this" signal: unaided, hinted, revealed and skipped are told apart honestly, so overconfidence costs something and underconfidence is rewarded. Leaving saves progress and returning resumes. The state table's "If time" cases (silent recording, garbled transcript, slow judge, dropped network) are handled or named as gaps. |

**Verify by:** walking every state in the voice-ux.md table, including denying the mic, going silent, cancelling mid-take, skipping, leaving and returning, using the text path end to end, and running the canned pass, partial and miss scripts. Run `npm run test:unit` for the recall engine's verdict, hint and XP logic.

## 5. Redundancy (High)

**Scoring:** whether each element, and each combination of elements, is as basic as it can be. For every element on a screen, ask what is lost if it is removed, merged or replaced with something plainer. If nothing is lost, it is redundant. This covers visual elements, copy, states, components and code paths. It is not the same as system fidelity, which asks whether you used the library. This asks whether you needed to use that much of it.

| Score | What it looks like here |
|---|---|
| **4** | Several elements do the same job. Two cues say the same thing at once (a status pill, an icon and a sentence all announcing the verdict). Copy repeats what the layout already shows. A screen carries more than one competing primary action. Containers wrap containers that add no grouping. A screen or state exists that could be folded into another. Components are layered or overridden where a plainer one would do. |
| **6** | Nothing is wasteful, but nothing has been pushed. Each screen works, though a pass through would find a few removable items: a caption that restates its heading, a divider the spacing already does, a second confirmation step, or a state that looks and behaves like another. Simplification has been applied inside screens but not across them. |
| **9** | A senior critique can't remove anything without losing something. Each screen has one primary action and each state does one job. Every element carries meaning the others don't: where the verdict has an icon, label and color, each is there for a reason (see the accessibility gate), and no further cue is stacked on top. Copy says each thing once and in the fewest words. Nested wrappers, one-off overrides and near-duplicate states have been collapsed. The simplest component that fits was chosen, and nothing was built where an existing one covers it. The flow has no step, screen or choice a student could skip without loss. |

**Verify by:** for each rendered screen, list its elements and try removing or merging each one, noting what breaks. Compare the states side by side for near-duplicates. Read the component tree and copy for repeats. A score of 8 or above needs this done on the rendered screens, not inferred from the code.

## 6. Accessibility (Medium)

**Scoring:** whether the interface works for students who cannot see it well, cannot speak right now, or use assistive tech and reduced motion.

| Score | What it looks like here |
|---|---|
| **4** | Some text or controls fall below contrast in dark mode. Some targets are under 44pt, and the mic is not clearly large. Pass, partial and fail differ mainly by color. State changes are visual only. |
| **6** | Contrast and targets mostly pass, and verdicts carry an icon or label as well as color. Gaps remain: a few small targets, a screen-reader order on the results screen that reads in the wrong sequence, or announcements that are terse fragments. |
| **9** | All text and UI measured at AA (4.5:1 body, 3:1 large text and UI components) on the real dark surfaces. Every target is at least 44×44pt, the mic most of all. Got it, partial, missed and didn't catch that are distinguishable with color removed, via icon, label, shape or motion. Every state change is announced in a full sentence through the one live region. Screen reader order on the results screen reads verdict, explanation, next action. With reduced motion on, system status is still legible. The text path means a student who cannot speak completes the whole session. |

**Verify by:** measuring contrast on rendered pixels, measuring target boxes, viewing the flow in grayscale, tabbing through with a screen reader or inspecting the accessibility tree, and enabling reduced motion.

## 7. Structure (Low)

**Scoring:** whether the layout holds together and the thing renders.

| Score | What it looks like here |
|---|---|
| **4** | It renders but breaks somewhere: overflow at 390px, content clipped or scrolling oddly, a route that errors on direct load, or a build that fails. |
| **6** | Every route renders at 390px and the layout holds. A narrow width (320px) or long content shows minor breakage, or a direct link or reload lands somewhere odd. |
| **9** | `npm run build` passes. Every route loads directly and on reload, and the entry link `/s/[code]`, `/reset` and the unknown-link page behave. The layout holds from 320px to 430px without horizontal scroll. Scroll lives only in the slot that is meant to scroll (`middleContent`). Safe areas are right. The Home Screen install opens full screen. |

**Verify by:** `npm run build`, loading each route directly, and resizing between 320 and 430px.

---

## Hard gates

These are pass/fail and are checked separately from the scores. A failed gate is reported at the top of the grade whatever the dimension scores are, and the build is not considered done until it passes.

1. **Contrast: body text at 4.5:1 or better** against its real background in dark mode, measured on the rendered page.
2. **Touch targets: 44×44pt minimum** for every tappable element, the mic included, measured on the rendered page.
3. **No raw hex in component source.** Nothing under `src/components` or `src/app` uses a literal hex color. `npm run check:tokens` must be clean.
4. **No two states that should differ render identically.** Idle, recording, thinking, and the pass, partial, fail and "didn't catch that" results must each look different when rendered, and component states (default, pressed, selected, disabled) must differ visibly where the design specifies it. Check by screenshotting each state and comparing them.
