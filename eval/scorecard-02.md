# Scorecard 02

Two rounds live in this file: **round 2** (2026-10-12, first graded with Chrome connected) and **round 3** (2026-10-21, graded from screenshots, Chrome not connected). Scorecard 01 is the blind baseline and stays separate. Round 2's text is first and unchanged; round 3 follows it.

| Round | Date | Total | Evidence |
|---|---|---|---|
| 1 (scorecard 01) | 2026-10-12 | 6.0 / 10 | Code and screenshots; critics could not render, capped at 7 |
| 2 (below) | 2026-10-12 | 6.3 / 10 | Chrome connected; contrast and tap targets measured live |
| 3 (after round 2's text) | 2026-10-21 | 6.3 / 10 | 85 screenshots of the running app at 390px plus the `check:render` report |

Round 3 moved Coherence up (6 to 7) and Craft down (6 to 5), so the total did not change.

Graded 2026-10-12 against `eval/rubric.md`, on the code at commit `23378f8`. Same scope as scorecard 01: every route and state in `SPEC.md`. Critics ran one at a time with Chrome connected, and each got only the screens, the rubric and its own dimensions. Nobody saw another critic's output until the pattern critic, which got findings with the scores removed.

## Total

**6.3 / 10** (weighted), up from 6.0. No hard gate failed, and all four were checked on the rendered page.

Weights are my assumption, as before: High = 3, Medium = 2, Low = 1 (sum 18). The sum is (7+6+6+7+5)×3 + 7×2 + 7×1 = 114, and 114 / 18 = 6.33.

**A limit that still applies.** The Chrome window in this environment would not go below about 476px wide (one critic got 887×555), so no critic saw a live 390px viewport. All of them judged 390px from fresh screenshots of 65 states and used the live page at the wider size for behavior, contrast and tap-target boxes. That is why most scores still sit at or just below 7.

## Per-dimension table

| Dimension | Weight | Score | Was | Critic | Verified by |
|---|---|---|---|---|---|
| System fidelity | High | 7 | 7 | critic-system | Grep of the check patterns, plus computed styles read live on `/q/1` only. The other screens came from screenshots and code. |
| Coherence | High | 6 | 6 | critic-system | About 20 screenshots side by side, plus the live `/q/1`. |
| Craft | High | 6 | 6 | critic-craft | Screenshots, live at 476px, token line heights read from `build/css/tokens.css`. |
| UX judgment | High | 7 | 6 | critic-ux | Walked live: mic primer, recording, cancel, correct, partial, reveal, correct after reveal, slow take, skip, wrong with a hint each time, Finish, Results, `/q/1/type`. Not walked live: mic denied, exit sheet, leave and return, `/done`. |
| Redundancy | High | 5 | 5 | critic-craft | Element-by-element removal on about 20 screenshot states and two live screens. |
| Accessibility | Medium | 7 | 6 | critic-ux | Contrast and target boxes measured live, live region and accessibility order inspected. No screen reader or grayscale pass. |
| Structure | Low | 7 | 6 | critic-craft | Overflow data clean on all 65 states, `/q/6` loaded. The critic did not run the build or 320/430px. |

Each dimension has one owner among the three adversarial critics, so nothing was averaged. Critic-ambition is not in the total.

**Evidence the critics lacked, which I did not use to change their scores:** `npm run build` passes (I ran it), and 0 of 65 states overflow at 320, 390 and 430px (my Playwright run). The Structure critic capped itself at 7 for exactly those two unverified items.

## Hard gates

| Gate | Status | Evidence |
|---|---|---|
| 1. Contrast, body text 4.5:1 | **Pass** | Two independent measurements. Mine: 519 text elements across 65 states in Playwright, 0 failures. critic-ux, live: lowest 6.64:1 (the "Almost there" pill label, 15px), then "Needs practice" 7.02, "Correct" 7.49, XP count 8.1, "Tap to dictate" / "Listening…" 8.4. Type-field placeholder about 5.5:1 (hand-computed). Non-text: the unselected voice/keyboard toggle icon is about 4.5:1 against its track, above the 3:1 bar. |
| 2. Touch targets 44pt | **Pass** | critic-ux, live: smallest box 48×48 (Close, Cancel recording, Cancel answer, the toggle, the sheet X), then Skip 60×48, mic 96×96. Two visuals are much smaller than their boxes: the cancel X draws about 32px and the toggle's mic icon about 11px. My run still shows the typing text area as 26px tall, inside a 358×56 pill; the whole pill now opens the field, which I checked. |
| 3. No raw hex in component source | **Pass** | `npm run check` ran clean (tokens, fallbacks, generated, claude). critic-system ran the same grep patterns with its Grep tool: 0 matches for hex, `var(--x,`, `rgb(`, `hsl(` and `text-transform`. |
| 4. No two states that should differ render identically | **Pass** | critic-craft compared idle, recording, thinking, "Taking a moment…", correct, partial, wrong and didn't catch that; all differ by more than copy. My hashes agree. The hint ladder also fixed last round's flagged pair: question 2's second and third takes now show different hints. The weakest pair is still thinking vs "Taking a moment…", which differs only by the caption (intended). After every hint is used the last one repeats, so repeated takes then look identical. That is by design (Reveal answer is the way out). |

## Findings

Ordered by damage, merged where critics overlapped. "Source" names who raised it. Items marked **decided** touch a choice you made on 2026-10-12, so they are questions, not defects.

1. **Recording shows no cue for how to stop in its first 3 seconds, and the stop button is announced as "Record answer, pressed".** (UX judgment and Accessibility, blocks a 9.) Source: critic-ux.
   - Evidence: `RecordingScreen.tsx:26` starts the hint as "Listening…" and only switches to "Tap to submit…" after 3s; `MicButton.tsx:29,35` keeps `aria-label="Record answer"` with `aria-pressed` while listening. Shot B7 and the live DOM.
   - Why: `voice-ux.md` principle 2 says the student controls start and stop. A screen-reader student hears a record command on the control that ends the take.
   - Fix: start the hint with a copy that names the stop, kept short for 390px; make the label "Stop and send answer" while listening.

2. **The question card jumps 56px up on every mic tap, because the app bar is removed on recording and thinking.** (Craft, blocks a 9.) Sources: critic-craft, pattern critic. **Decided** (you hid the app bar and pushed the middle up).
   - Evidence: card top about y=472 on idle (B3, B13) against about y=360 on recording and thinking (B7, B10), 2x pixels. I measured the same: the pill moves from 112px to 56px.
   - Why: the card moves under the thumb while the student speaks.
   - Options: keep the bar's height reserved and hide it with `visibility`, so nothing moves; the pattern critic suggests trying that cheaply first. It contradicts your "push the middle section up" instruction, so I have not done it. Your call.

3. **Results says the count twice, and a revealed-then-correct answer looks the same as a never-got-it.** (Redundancy and UX judgment, blocks a 9.) Sources: critic-craft, critic-ux, pattern critic.
   - Evidence: shots B25, C8 and `results/page.tsx`: ring "40%" next to "You got 2 of 5 concepts"; each row repeats its card's tone with an icon; "Enzyme activity" (revealed, then correct) and "Cellular respiration" (wrong three times) both get the same × row in Needs practice. You chose the percentage ring on 2026-10-12 to cut the repeat; the critics still see the headline count as the same fact.
   - Fix: drop either the ring label or the numeric headline; for the revealed case, a row label that says so would need a documented prop on `ExpandableResultRow`, otherwise it is a gap for `docs/component-gaps.md`.

4. **Results copy does not use the unaided-only split, and "after" is a dead end.** (Ambition input, not in the total.) Source: critic-ambition. See its section below.

5. **The exit sheet asks the same thing three times.** (Redundancy, blocks a 6.) Sources: critic-craft, pattern critic.
   - Evidence: `ExitConfirm.tsx`; B4 and E1. The sheet says "Your progress is saved." with Keep going / Leave, and Leave lands on `/done`, which says "Progress saved." with Keep going.
   - Fix: trim the sheet's "progress is saved" line (no risk), or send the X straight to `/done` (reopens the 2026-10-01 exit-confirm decision, with only repetition as evidence). The pattern critic recommends trimming the copy now and testing before removing the sheet.

6. **A wrong verdict reads "Try again … You've got 0 of 3 key ideas."** (UX judgment and Accessibility, polish.) Source: critic-ux. Evidence: B21–B23. Fix: drop the "You've got {covered} of {total}" lead when nothing is covered, so the hint shows alone (`fillHint` in `src/lib/recallEngine`).

7. **The mic-denied path explains little, and its labels disagree.** (UX judgment blocks a 9; Coherence.) Sources: critic-ux, critic-system.
   - Evidence: B2, A5. The primer gives no reason to turn the mic on; Mic skipped never says how to turn it on later; "No thanks" ends the session; the primer says "Not now" and Mic skipped says "No thanks" for the same decline.
   - Overlaps the copy item you already own from the first punch list (the Mic skipped wording). One decline label across both screens is a small code fix.

8. **The Results screen is much louder than anything before it, and Knowie's voice wobbles there.** (Coherence, blocks a 9.) Sources: critic-system, critic-craft (out of lane). Evidence: B25, E9 (saturated mint, coral and white cards; "Gotta start somewhere."). This comes from the Figma component and Figma's copy, so it is yours to decide.

9. **Single bottom buttons and the "pull the bar past the margin" hack are copied by hand in five places, and the gap is not logged.** (System fidelity, blocks a 9.) Sources: critic-system, pattern critic.
   - Evidence: `start/start.css:57` and `messageScreen.css:16` (same wrapper twice); the negative-margin hack in `micOff.css:27`, `results.css:39`, `result.css:44`. `BottomCTA` is two-button only, and `docs/component-gaps.md` does not mention it.
   - Fix: log it now; a one-button, no-drawer `BottomCTA` layout needs a Figma component first.

10. **Wrapped headlines are cramped.** (Craft, blocks a 9.) Source: critic-craft. Evidence: `--type-headline-l` is 44px on a 36px line (0.82) and the Mic skipped paragraph is 24px on 24px (1.0); both are Figma tokens (`build/css/tokens.css:314-315`). The Mic skipped style is **decided** (kept), so the open part is the headline-l line height, a token change in Figma.

11. **`/q/6` shows Next's default white-on-black 404 with no way back.** (Structure, polish.) Source: critic-craft. Evidence: A4. Fix: a `not-found` page built with `MessageScreen`, like the unknown-link screen.

12. **Small repeats and voice.** (Redundancy and Coherence, polish.) Sources: critic-craft, critic-system.
    - The didn't-catch-that card says "Tap the mic to try again" and the caption below says "Tap to dictate" (B20).
    - The topic pill is the same on all five questions, and the Welcome card names the topic again.
    - "That took longer than it should." reads blunter than "Taking a moment…".

13. **Score ring is read first as a bare "40%".** (Accessibility, polish.) Source: critic-ux. Evidence: `ProgressMeter.tsx:26`, DOM order. Fix: a label that carries the count, read after the heading.

14. **Heading "Add to Home Screen" breaks sentence case.** (System fidelity, polish.) Source: critic-system. A proper noun on iOS, so either log it as an exception in `docs/design-system.md` or reword.

15. **Unlogged reuse and seams.** (System fidelity and Coherence, polish.) Source: critic-system. `TapToAnswer` is used for status lines ("Listening…", "Taking a moment…"); `ChatInput` and `InputModeToggle` sit in a hand-made column on the result; the toggle's slot differs between idle and result (your 2026-10-12 mic-position decision). All are worth a line in `docs/component-gaps.md` or the decision log.

16. **The text path is two taps from recording, and the finished `/done` has no button.** (UX judgment, polish.) Source: critic-ux. Both are documented design choices; flagged only so they stay choices.

17. **The mascot is cut in half behind the question card on every question screen.** (Craft, polish.) Source: critic-craft. This is how `MiddleSection` draws Knowie (peeking), so it is a design call, not a bug.

**Resolved since scorecard 01** (critics confirmed on the render): the five-cue thinking state is now one button; the slow take has an escape and a distinct card; the hint ladder gives a new hint each retry without revealing early; announcements exist for sheets and verdicts as full sentences; contrast and targets are measured.

## Where the critics disagree

- **Item 2** (the 56px jump). critic-craft and the pattern critic want the bar's height kept. You decided otherwise. Left open.
- **Item 3.** critic-craft wants the headline count or the ring label removed. You chose the percentage ring to remove the repeat; the critic still counts it as repeated.

## Critic-ambition (separate, not in the total)

**4 / 10**, on its own strict scale, down from 6 last round. The two readings are not directly comparable, because this was a fresh critic instance and it graded the whole design by its weakest open question. Verified by code and screenshots only (it did not drive Chrome), so capped at 7.

- **First meet:** no risk. The splash is a claim ("you will score higher on your tests!"), not a first attempt; the entry points (study-plan step, chat offer) are not built.
- **The loop:** risk taken. No words while speaking; hint tied to the missing idea; constant mic position; the thinking state is the button itself.
- **Recovery from a miss:** no risk. The student is told "2 of 3" but never sees which two, and the transcript is withheld until Results.
- **Results:** risk taken. Unaided-only counting and a separate hints card, but the copy does not use it ("Great start—your strongest area is enzymes", "Master status!").
- **After the session:** no risk. `/done` is a mascot and one line.

Proposals, built from existing components only:
1. `/done` (finished) names the concepts they will see first next time, from the Needs practice and with-hints rows. Text only, so "no button on finish" is kept. Makes a promise the prototype doesn't build, so the moderator must brief it as a placeholder.
2. The Results line states the split in plain words ("2 on your own, 1 with hints, 2 still to learn") in place of "strongest area" and "Master status!".

Gaps it named: no component shows which key ideas a partial answer covered; the first-meet entry has no component.

## Pattern critic (run after the four, given their findings with the scores removed)

Reviewed about 12 patterns and kept 7; five to reconsider. It treated your 2026-10-12 decisions as settled.

| # | Pattern | Recommendation | Marked |
|---|---|---|---|
| 1 | One route per question state, so the app bar jump and the extra code for reloads | **Cheap version now** (reserve the bar's height); log the one-screen refactor for after the sprint | Inside the system. Conflicts with your "push up" decision, see item 2. |
| 2 | Feedback as one text string on the answer card (told "2 of 3", never which two) | **Test first** | Needs a new component (a key-idea list), a Figma frame and a content label per key idea. |
| 3 | Results as outcome-colored buckets | **Copy and icon changes now; test removing the ring** | Mostly inside the system; a distinct revealed row needs a documented `ExpandableResultRow` prop. |
| 4 | Single bottom button with no `BottomCTA` layout | **Do now** (log the gap, then build) | Needs a new `BottomCTA` variant and possibly a Scaffold slot, from a Figma component. |
| 5 | Exit confirm sheet followed by `/done` | **Trim the sheet copy now; test removing the sheet** | Inside the system. |

It could not reproduce the `/q/6` 404, the aria-label finding or the copy-voice findings from what it opened, so it did not rely on them. Kept as is: app bar and XP, `toggleGroup`, `bottomCTA` two-button drawer, the reveal sheet, the constant mic position, hint ladder, unaided-only counting and the pill for slow takes, and the general slots.

Blind spot: judged 390px from screenshots only; did not render the `/q/6` 404, the recording hint copy or the screen-reader labels; could not read `ExpandableResultRow`'s docs, so the icon change is unconfirmed.

## Each critic's blind spot

- **critic-craft:** never rendered at 390, 320 or 430px live (the window floored at 476px). Did not verify the live 10-second slow take, German label expansion, press-state scale or real-phone safe areas. Did not reach the recording, thinking, result, Results or `/done` states live; those came from screenshots.
- **critic-ux:** viewport was 887×555. Did not use a real screen reader, a real device or reduced motion in the live page. Did not walk the mic-denied path, the exit sheet or leave-and-return live, so any trap or announcement gap there is uncovered.
- **critic-system:** live computed-style audit covered `/q/1` idle only. Did not read every component's Storybook props, and could not check true 390px live.
- **critic-ambition:** did not drive Chrome; judged first meet from the splash and primer screenshots and `SPEC.md`; did not read `AnswerCard`'s docs, so a slot there might carry per-key-idea state.
- **critic-pattern:** see above.

## Render appendix

How: Playwright, Chromium, 390×844 at 2x, dark mode, iPhone user agent, touch on, animations frozen for screenshots; real sessions entered through `/reset` and Start or `/s/k7`. 65 states across the scripts `tour` and `k7`, the typed path, leave, opt out, skip all, reload and reduced motion; the same run repeated at 320×640 and 430×932. Files and data are in the session scratchpad (`shots_w390`, `shots_w320`, `shots_w430`), not committed.

My measurements, repeated on the current code:

| Check | Result |
|---|---|
| Contrast (390) | 0 failures in 519 text elements |
| Horizontal overflow at 320 / 390 / 430 | 0 of 65 states each |
| Tap targets under 44px | Only the typing text area (26px, inside a 56px pill that now opens it) |
| `npm run build` | passes |
| `npm run check`, `tsc`, unit tests (28), full Storybook run | all pass |

Not captured: a live 390px viewport, the on-screen iOS keyboard, the Home Screen install, real-phone safe areas, and component press and disabled states outside Storybook.

---

## Round 3 (2026-10-21)

Graded 2026-10-21 against `eval/rubric.md`, on the code at commit `a06cb08`. Scope: the splash (first time), the mic primer, the mic-skipped screen, every question state (idle, with the welcome card, dictating, thinking, "Taking a moment…"), every answering state (correct, partial, wrong ×3, didn't catch that, slow timeout, the hint ladder, correct after a hint, the typing screens), the reveal and more-info sheets, and the four Results screens. The exit sheet, the end screens and the 404 were not in scope.

Four critics ran in their own contexts at the same time. Each got only the screens, the rubric and its own dimensions; nobody saw another critic's output. The pattern critic was not run. It sits in this file, after round 2, so there are two scorecards in all: 01 (the baseline) and 02 (rounds 2 and 3). Round 2's text above is unchanged.

**What was different this round, and why it matters.** The Chrome tools were not connected, so no critic could load the live page. They graded from 85 screenshots I took of the running app at 390px in dark mode (one per state), plus the mechanical report `check:render` printed for the same run (84 states, 0 failing, 12 known). Anything a critic could only read from code is capped at 7, as the rubric says, so all scores sit at 7 or below. Because the evidence is thinner than round 2's (which had a live page for some checks), small moves up or down are weak evidence.

### Total

**6.3 / 10** (weighted), the same as round 2. No hard gate failed.

Weights are my assumption, as before: High = 3, Medium = 2, Low = 1 (sum 18). The sum is (7+7+5+7+5)×3 + 7×2 + 7×1 = 114, and 114 / 18 = 6.33.

**One dimension went backwards: Craft, 6 to 5.** Most of the cause is changes I made since round 2. The new Results headlines ("Hints got you there", "Here's how it went") wrap to two lines in Headline L, which is set at 44px type on a 36px line, and the critic could see the lines touching. The mic-skipped paragraph is set in Headline S (24px on a 24px line) and is now longer than it was. Both line heights are known Figma tokens, so the check lists them as known, but the critic scored what it saw. Coherence went up, 6 to 7, which hides the Craft drop in the total.

### Per-dimension table

| Dimension | Weight | Score | Was (02) | Critic | Verified by |
|---|---|---|---|---|---|
| System fidelity | High | 7 | 7 | critic-system | Grep of the check patterns and Storybook docs. No `npm run check` run, no live computed styles. |
| Coherence | High | 7 | 6 | critic-system | About 18 screenshots side by side. Did not walk the real flow in order. |
| Craft | High | 5 | 6 | critic-craft | Screenshots at 390px and the report's line-height facts. |
| UX judgment | High | 7 | 7 | critic-ux | About 20 screenshots plus code grep. Did not walk the flow live (leaving and returning, mic denied). |
| Redundancy | High | 5 | 5 | critic-craft | Element-by-element removal on the Results, answering, dictating/thinking and mic screens. |
| Accessibility | Medium | 7 | 7 | critic-ux | The mechanical report (contrast, targets, live region), screenshots and code. No grayscale, reduced-motion or screen-reader pass. |
| Structure | Low | 7 | 7 | critic-craft | Screenshots and the report at 390px only. |

Each dimension has one owner among the three adversarial critics, so nothing was averaged. Critic-ambition is not in the total.

**Evidence the critics lacked, which I did not use to change their scores:** the same run of `check:render` at 320 and 430px also passes (84 states each, 0 failing); `npm run build` was last run in round 2.

### Hard gates

| Gate | Status | Evidence |
|---|---|---|
| 1. Contrast, body text 4.5:1 | **Pass** | `check:render` at 390px: 84 states, 0 contrast failures, none of the 12 known items is a contrast item. The critic eyeballed the grey captions as well above the line but computed no ratios this round. Round 2's measured lowest was 6.64:1. |
| 2. Touch targets 44pt | **Pass** | Same report, 0 failures. The cancel X draws about 32px; its tap box was passed by the report but not read out (round 2 measured it at 48×48). |
| 3. No raw hex in component source | **Pass** | critic-system's Grep for hex, `rgb(`, `hsl(`, `var(--x,` and `text-transform` over `src/components` and `src/app`: 0 matches. The one raw value is the `@media (max-width: 359px)` breakpoint in `bottomCTA.css`, which CSS cannot take from a variable. |
| 4. No two states that should differ render identically | **Pass** | critic-craft compared the pairs I found by hashing. All are by design (repeat tries on one question, mic-off from the flow and directly, reload landing on the question). Two are weak and are findings below: hint 3 and hint 4 render identically, and the slow-timeout state wears the same pill as "didn't catch that". |

### Findings

Ordered by damage, merged where critics overlapped. "Source" names who raised it. Items marked **decided** touch a choice you made, so they are questions, not defects. The critics' claims are as they reported them; I have not re-verified each one, except that the identical-screenshot pairs are from my own hashes.

1. **Headline text collides on its own lines.** (Craft, blocks a 9; Craft dropped 1 point.) Source: critic-craft, with critic-ux listing it out of lane.
   - Evidence: `results-hints-only` ("Hints got you / there"), `results-mostly-skipped` ("Here's how it / went"), `splash-first-time` (three lines, no leading), and the 24px-on-24px paragraphs on `mic-off` (five lines) and `mic-primer` (three). The report lists all of them as known.
   - Why it counts: a known decision earns no credit, and the collisions are the first thing a senior reviewer sees. Two of them are my new copy.
   - Fix: this is a Figma token (Headline L line height at `tokens/tokens.json`, and Headline S for the paragraphs). Report to design. The critic suggests the existing 60px line height; I have not tried it and a sync from Figma would overwrite it. For the new Results headlines, shorter words that fit on one line ("Hints helped", "How it went") are a copy-only way out.

2. **The slow-timeout state wears the "Didn't catch that" pill.** (UX judgment and Craft, blocks a 9.) Sources: critic-ux, critic-craft. Raised in earlier rounds; the 2026-10-12 decision log keeps the pill, with the card saying the wait was too long.
   - Evidence: `q3-result-slow-timeout.png`: the pill says "Didn't catch that", the body says "That took longer than it should. Let's try again."
   - Why: the judge was slow, not the student's audio, so the label blames the wrong thing.
   - Fix: a different pill label or none for this state. If Storybook's `statusPill` has no variant for it, that is a gap for Figma.

3. **The partial and wrong pills look alike.** (Accessibility and Craft, blocks a 9.) Sources: critic-ux, critic-craft. Seen in round 1 as F13 and in the punch list as C6.
   - Evidence: `q2-result-partial` ("Almost there", an undo arrow) and `q4-result-wrong-3` ("Try again", a refresh arrow): near-identical glyphs, so the verdicts differ by colour and word.
   - Fix: a distinct icon from `src/icons` for one of them; if none fits, an icon exported from Figma.

4. **Results repeat themselves.** (Redundancy, blocks a 9.) Source: critic-craft.
   - Evidence: `results-perfect`: the 100% ring, the headline "All five, no hints", the line "You explained every one yourself.", the "Good explanations" header and five check icons all say one fact. `results-mixed`: the line "Solid on Enzymes. Take another look at Enzyme activity." repeats row names directly below. `results-mostly-skipped`: five identical dots under a header that already says "Skipped questions".
   - Why it counts: the wording is the set you approved on 2026-10-21; the repetition is in the layout and the line.
   - Fix: drop the line on perfect and mixed, or drop the per-row leading icon where the group header already carries the state (needs a documented `expandableResultRow` option; otherwise a gap).

5. **The pill and the sentence under it say the same thing.** (Redundancy, blocks a 9.) Source: critic-craft.
   - Evidence: "Correct" over "Exactly: …" and "You got it: …"; "Didn't catch that" over "I couldn't understand that take."
   - Fix: in `src/content`, cut the "Exactly:" and "You got it:" openers, and make the not-caught sentence add a next step the pill and "Tap to try again" don't already give. These sentences come from Figma, so they need your say-so.

6. **"Didn't catch that" gives no reason and no cue to type.** (UX judgment, blocks a 9.) Source: critic-ux.
   - Evidence: `k7-q4-didnt-catch`: "I couldn't understand that take." and "Tap to try again", with the toggle present but unprompted.
   - Fix: say why in a clause and offer the other way, for example "I couldn't hear an answer. Try again, or type it instead." Copy lives in `src/content`; it comes from Figma, so it needs your say-so.

7. **"No thanks" on the mic-skipped screen doesn't say it ends the session.** (UX judgment, Redundancy and Coherence, blocks a 9.) Sources: critic-ux, critic-craft, critic-system. Raised in earlier rounds.
   - Evidence: `mic-off`: "No thanks" next to "Continue" under "Let's switch it up." `optOut` ends the session and goes to `/done`. The mic primer's decline is "Not now", so the same job has two labels.
   - Fix: a label that names what it does ("Leave session"), or the same label in both places. The labels come from Figma, so it needs your say-so.

8. **The leave-this-question button has three names and two looks.** (Coherence and Redundancy, blocks a 9.) Sources: critic-system, critic-craft.
   - Evidence: "Skip" is a bare tertiary button on the question screen, a secondary pill on didn't-catch and slow-timeout, and "Next" takes the same slot on partial and wrong.
   - Why: these are decided (Skip counts as skipped; Next counts as needs practice, 2026-09-30), but the label swap in one slot is what both critics flag.
   - Fix: a design decision, not an edit. The decision log says why they differ.

9. **A correct answer after a hint looks the same as one with no hint.** (UX judgment, blocks a 9.) Source: critic-ux.
   - Evidence: `h-q2-correct-after-hint` against `q1-result-correct`: same green pill, same card. Only the XP count (5 against 10) differs.
   - Fix: a line in the card, for example "Got it, with a hint. You'll see this one again." Copy only. It would sit with the hint copy in `src/content/questions.ts` and needs your say-so.

10. **After the last hint, trying again changes nothing.** (UX judgment and Craft, polish.) Source: critic-craft, with my hash comparison.
    - Evidence: `k7-q2-hint-3` and `hint-4` are byte-identical. This is by design (the last hint repeats, and Reveal answer is the way out), but the screen doesn't point to it.

11. **The Results screen is the loudest in the flow.** (Coherence, blocks a 9.) Sources: critic-system, critic-craft. **Decided**: you chose on 2026-10-21 to leave Results in full colour. Listed so the number is honest; no action.

12. **Many layouts are hand-built, only logged.** (System fidelity, blocks a 9.) Source: critic-system.
    - Evidence: `docs/component-gaps.md`: the full-bleed bar written three times, the answer area five times, the centered block three times, the hidden app bar three times.
    - Why: logged is not fixed, and the mic stays put only while those copies keep matching. `check:render` now catches drift in the mic and toggle height, but not in the other copies.
    - Fix: Figma components or Scaffold slots for the answer area and the bar. A designer's call.

13. **Smaller items.**
    - The mic-skipped paragraph is set in Headline S, bold, five lines, and longer than the Figma text it replaced (critic-craft, critic-system). The Headline S choice for it is decided (2026-10-12); the length is mine. A shorter text would reduce the five lines.
    - The splash has a dark speech-bubble tail, nearly invisible on dark (critic-craft). Logged and accepted (component-gaps).
    - The cancel X draws about 32px; its tap box passes (critic-ux). `ButtonIcon size="M"` would make it visibly larger if the docs show it.
    - On `type-long-input` the text wraps short of the field's right edge, leaving a dead strip while the send button reserves its width (critic-craft).
    - `type-inactive` shows no toggle or Skip in the critic's reading, while `type-focused` shows both (critic-craft); I measured the toggle in `type-inactive` at 104px, so I'd check this one before acting on it.
    - The mostly-skipped Results has no sentence saying nothing was attempted; a headline such as "Nothing explained yet" would (critic-ux).

### Each critic's blind spot

- **critic-craft:** judged still screenshots at 390px, so it could not see motion (the glow, the dots, the question rise), press or reduced-motion states, 320 and 430px, German text, or the recording hint after its delay. Any of those could move Craft or Structure.
- **critic-ux:** could not do the grayscale pass, a reduced-motion pass or a screen-reader order check on Results. States it did not open (the other wrong screens, the splash, the other typing screens) were graded from the report and code. It did not read `SPEC.md` or the recall engine files.
- **critic-system:** never ran `npm run check` and read no computed styles from the live page, so values set by JavaScript (the progress width, the keyboard offset) came from code. It did not open `docs-show` for every component, so it could not confirm every prop is documented.
- **critic-ambition:** read no source for the mic primer, the typing screens, the thinking and slow states or the hint ladder beyond the screenshots, so a risk in one of those flows could be missing.

### Critic-ambition (separate, not in the total)

**Reach: 4 / 10**, from code and screenshots only.

It starts at 5 for a design that follows the rules and takes no risks, and gives credit for three risks: Results count only unaided answers (the 40% costs the student something, and hinted answers get their own card); the student sees no words while speaking; and the headline "Hints got you there" refuses to call a hinted pass a pass. It marks the score down because the weakest part of the design is what happens after: the end screen is "Nice work. You're done." with nothing to tap, which the brief calls "the least designed part of the whole thing". The splash also asserts a benefit ("you will score higher on your tests!") instead of earning it.

**What the work is settling for:** the first meeting (a splash that explains why recall works, then a mic primer) and the time after the session. The loop and Results take real risks.

**Proposals** (each built only from existing components):

1. **Make the end screen name what comes back.** Instead of "Nice work. You're done.", name the first concept that needs practice and when it returns ("Enzyme activity is next. Say it again tomorrow."), or the last concept to test in a week if everything was unaided. Built from the `title` and `caption` the end screen already passes to `MessageScreen`. The "tomorrow" promise is canned, since there is no scheduler, so it should be flagged as placeholder to participants like the transcripts. It changes copy only and does not reopen the decision that Continue offers nothing to tap. Estimated score: 6 to 7.
2. **Make the partial card credit what the student said.** Lead with the key idea they covered ("You said the shape changes."), then the hint. It restates a covered key point and adds no new facts. Built from `AnswerCard`, with a per-key-point phrase added in `src/content/questions.ts`. Estimated score: 7 combined with proposal 1.

**Gap:** a "how sure are you?" step before each answer would make overconfidence cost something, as the brief asks. Storybook has no choice input for it (`ToggleGroup` is documented only for voice and keyboard), so it is a gap, and it adds a step before every answer.

### What changed since round 2, and what caused it

| Dimension | Round 2 | Round 3 | What likely caused it |
|---|---|---|---|
| Coherence | 6 | 7 | The mic, toggle and bar now sit in the same place on every screen (Figma 2026-10-21), which the critic could see side by side. |
| Craft | 6 | 5 | The new Results headlines and the longer mic-skipped text wrap and collide in lines that are too short (finding 1). |
| Everything else | — | unchanged | — |

The rubric's guidance applies: the finish line is when the reports start repeating themselves. Findings 2, 3, 7 and 11 are repeats from rounds 1 and 2.
