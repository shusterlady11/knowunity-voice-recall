# Scorecard 02

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
