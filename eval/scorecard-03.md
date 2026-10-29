# Scorecard 03

Round 4. Graded 2026-10-29 against `eval/rubric.md` as calibrated the same day (commit `2bc6740`), on the code at that commit. This is the first round with the real judge and speech-to-text, and the first graded against the calibration from two student sessions. Scorecards 01 and 02 stay as they are.

| Round | Date | Total | Evidence |
|---|---|---|---|
| 1 (scorecard 01) | 2026-10-12 | 6.0 / 10 | Code and screenshots; critics could not render |
| 2 (scorecard 02) | 2026-10-12 | 6.3 / 10 | Chrome connected; contrast and targets measured live |
| 3 (scorecard 02) | 2026-10-21 | 6.3 / 10 | Screenshots only, Chrome not connected |
| 4 (this file) | 2026-10-29 | 5.9 / 10 | Chrome connected; 14 real typed answers judged live; 222 screenshots at 320, 390 and 430px |

**The totals are not directly comparable.** The rubric changed between round 3 and this round: the UX judgment and Structure anchors are stricter, Structure above 6 now needs a real phone, and a verdict is graded as the student meets it, whatever produced it. Most of the drop comes from those changes, not from the app getting worse. Several things the students hit are now fixed and the critics confirmed it (see "Resolved since round 3").

## Total

**5.9 / 10** (weighted). **One hard gate is not verified, so it counts as failed:** gate 4, because the "Didn't catch that" state can no longer be rendered by any path the critics could use.

Weights are my assumption, as before: High = 3, Medium = 2, Low = 1 (sum 18). The sum is (7+6+6+6+5)×3 + 6×2 + 5×1 = 107, and 107 / 18 = 5.94.

Unweighted, outside the total: Feedback trust 6, Study fit 4, critic-ambition 6.

## Per-dimension table

| Dimension | Weight | Score | Was (round 3) | Critic | Verified by |
|---|---|---|---|---|---|
| System fidelity | High | 7 | 7 | critic-system | A live computed-style audit on 11 routes at 1033px, a Grep of the check patterns, and Storybook docs for 4 of the 28 components. |
| Coherence | High | 6 | 7 | critic-system | The 390px shots in flow order, plus 2 live typed answers for the real judge's copy. |
| Craft | High | 6 | 5 | critic-craft | Shots at 3 widths, plus a live scripted session at 570px measuring boxes, type and `:active` rules. |
| UX judgment | High | 6 | 7 | critic-ux | Live typed path on all four topics, 12 judged answers, Results, Review all, exit and reveal. Recording and the failure states came from shots and code. |
| Redundancy | High | 5 | 5 | critic-craft | Element-by-element removal on the rendered shots. |
| Accessibility | Medium | 6 | 7 | critic-ux | Contrast and boxes measured live; the accessibility tree and the live region read from the DOM. No VoiceOver. |
| Structure | Low | 5 | 7 | critic-craft | Rendered at 320, 390 and 430px with scroll measured live. Capped at 6 with no real phone; 5 by rule 5 against the "Results row or answer card" row. |
| Feedback trust | Not weighted | 6 | new | critic-ux | Live typed answers and Results rows. |
| Study fit | Not weighted | 4 | new | critic-ux | Live: taps counted from a fresh session, and the input mode checked across New topic and Review all. |

Each dimension has one owner, so nothing was averaged. None of the critics' windows went below 570px, so 390px layout was judged from screenshots everywhere.

**Evidence the critics lacked, which I did not use to change their scores:** `npm run check` passes, `tsc` is clean, and all 68 unit tests pass. `npm run build` was not run, because it writes into `.next` while the dev server is using it.

## Hard gates

| Gate | Status | Evidence |
|---|---|---|
| 1. Contrast, body text 4.5:1 | **Pass** | critic-ux, live. Lowest: the opened Results row labels at 6.05:1 (12px). Then "Almost there" 6.64, "Try again" 6.66, "Correct" 7.49. The unselected toggle icon is 4.36:1, over the 3:1 needed for a UI component. `check:render`: 0 contrast failures at all three widths. |
| 2. Touch targets 44pt | **Pass** | critic-ux, live. The smallest are 48×48 (Close, Speak, Type, Send, Cancel answer, Close answer). The textarea is 26px tall, but it sits inside the 56px field, and tapping anywhere on the field focuses it. |
| 3. No raw hex in component source | **Pass** | critic-system's Grep: 0 matches for hex, `rgb(`, `hsl(` or `var(--x,` in `src/components` and `src/app`. `npm run check` is clean. |
| 4. No two states that should differ render identically | **Not verified, counts as failed** | critic-craft compared idle, recording, thinking, correct, partial, wrong, the slow timeout and reduced motion, and all of them differ. "Didn't catch that" could not be rendered at all. The scripted tour has no take for it (`src/content/scripts.ts:17-23`). The `k7` script that has one now opens a live session (`src/lib/session.ts:131`, since 2026-10-28). In a live session it only comes from recorded audio, which no critic could produce. `check:render`'s `k7` walk times out for the same reason. |

## Findings

Ordered by damage, merged where critics overlapped. "Source" names who raised each one, and "pattern" means critic-pattern reproduced it. Items marked **decided** touch a choice you made, so they are questions, not defects.

1. **A complete answer to the question as worded can't be marked Correct.** (UX judgment, Feedback trust; blocks a 9.) Sources: critic-ux; pattern reproduced it in content.
   - Evidence: live, Monopolies Q4. Jonah's answer (marginal revenue equals marginal cost, then the price from the demand curve) now gets "Almost there", with both ideas named, which is better than round 3. Key idea 3 ("price above marginal cost") answers something the question never asks (`src/content/topics/monopolies.ts:135-140`). Cellular energetics Q1 has the same shape: the third idea, reuse, isn't asked for (`cellularEnergetics.ts:12-16`). `verdictFor` needs every key idea for Correct (`src/lib/recallEngine/index.ts:50-53`).
   - Why: this is the P2 calibration row. The judge reads the key correctly; the key asks for more than the question does.
   - Fix (cheap, content only): reword each question so it asks for all three ideas, and audit all four topics. Full version, to test first: mark each key idea as required or bonus. That reopens the 2026-10-24 "always 3 key ideas" decision.

2. **At 320px the verdict is below the fold on the result screen.** (Structure; blocks a 6.) Source: critic-craft; pattern reproduced it.
   - Evidence: `320-q2-result-partial.png` and `320-q4-result-wrong-1.png`. The question card is cut off mid-sentence, and the answer card with its pill is entirely off screen. `check:render` passes it.
   - Why: the one thing the screen exists to show isn't visible, and nothing tells the student to scroll. It is very likely P1's "card was cut off".
   - Fix: scroll the `AnswerCard` into view after mount (`ResultScreen.tsx:151`), and add a `check:render` assertion that the pill is visible at 320.

3. **A slow or failed judge throws away a typed answer, and Skip then books it as skipped.** (UX judgment; the 4 anchor in a failure path.) Sources: critic-ux, critic-pattern.
   - Evidence: `ThinkingScreen.tsx:81` deletes `record.typed` on every outcome. The typing screen then reopens empty (`TypeScreen.tsx:167`), while the card says "Try again, or type your answer." The only forward button is Skip (`ResultScreen.tsx:123-129`). Pattern also saw live that during the wait the sent text and the typing bar vanish, replaced by a mic the student never used.
   - Why: the rubric's intro counts a typed answer left unjudged as a defect. P2 said "It didn't work" and answered again.
   - Fix: keep `record.typed` on a timeout and put it back in the field (`ChatInput` `status="Ready to send"` is documented). A "not judged" Results category doesn't exist, so that is a gap for `docs/component-gaps.md`. Pattern's larger proposal, to show the wait in an `AnswerCard` `processing` card where the verdict will land, reopens the 2026-10-12 and 2026-10-27 decisions on where the thinking status lives.

4. **"Didn't catch that" can't be reached for checking, and the `k7` moderator link silently became live.** (Gate 4; UX judgment.) Sources: critic-craft, critic-ux, `check:render`.
   - Evidence: see gate 4. The `k7` link's role-play tasks expect scripted verdicts, but since 2026-10-28 it opens a live session.
   - Fix: give the scripted tour a not-caught take, or let `k7` be started scripted from `/reset`. Then update `check:render`'s `k7` walk. Which way is your call: the 2026-10-28 "every session live" decision covers participant links.

5. **The session assumes speaking, and the typing choice is never remembered.** (Study fit, Accessibility.) Sources: critic-ux, critic-pattern.
   - Evidence: live, 5 taps before the first typed character: Let's go → Not now → `/mic-off` → Continue → the field. New topic and Review all both reopen on the mic (`session.ts:132`, `:222`). The picker and primer copy say "explain out loud".
   - Why: the P2 calibration row. voice-ux principle 5 says text is an equal path, one tap away.
   - Fix (cheap, inside the system): rename the primer's "Not now" to "Type instead", send it straight to typing, and carry the input mode across sessions the way `live` already is. This changes SPEC step 13, which is **decided**. Asking "speak or type?" before question 1 needs a Figma frame.

6. **The live region says wrong things, says verdicts twice, and stays silent on three screens.** (Accessibility; blocks a 9.) Source: critic-ux; pattern confirmed the double announcement.
   - The end screen after Leave → Keep going announces "Nice work. You're done." (`done/page.tsx:29,50`).
   - Review all announces the old Results line (`results/page.tsx:94`).
   - `AnswerCard` has its own `role="status"` (`src/components/answerCard/AnswerCard.tsx:45`), so every verdict is read twice and its text runs together ("Almost thereYou got…").
   - `/start`, `/mic` and `/mic-off` announce nothing.
   - "Good start Solid on…" has no full stop (`results/page.tsx:93`).
   - The mic is still named "Record answer" while thinking (`MicButton.tsx:30`, no label prop).
   - Focus isn't returned after the reveal sheet closes.

7. **The student's words aren't shown at the verdict.** (Feedback trust.) Sources: critic-pattern, critic-ambition, critic-ux.
   - Evidence: `390-q2-result-partial.png` and the live results. Knowie's feedback only; the transcript waits until Results.
   - Why: P1 and P2 both argued with verdicts they couldn't check. The 2026-09-30 reason, that transcripts were canned placeholders, lapsed once sessions became live.
   - Fix: a "You said: '…'" line under the verdict in live sessions. It reopens the 2026-09-30 decision and the cut in `gaps-and-cuts.md`, and needs an `AnswerCard` part from Figma. Pattern suggests testing it first, with the quote inside `message` as a logged workaround.

8. **Results don't fully earn the "I know this" signal, and their copy promises a pick that doesn't exist.** (UX judgment; blocks a 9.) Sources: critic-ux, critic-ambition, critic-pattern.
   - A revealed answer and a partial share the same red "Needs practice" ✕. **Decided** (2026-10-06).
   - The headline names the hinted concept and ignores the revealed one (`results/page.tsx:78` takes the first one that wasn't unaided).
   - "Pick one to try first." and "Try these again on your own." (`src/content/results.ts:20,24`), but Review all reruns all five and wipes the earlier pass (`session.ts:218-221`). This is the P1 "Review all" row.
   - The end screen says "Nice work. You're done." at 20%.
   - Fix (cheap): reorder `results/page.tsx:78`, and make the label and the two lines match what Review all does. Keeping earlier passes reopens the 2026-09-29 decision.

9. **A correct answer after a hint looks the same as one without.** (Ambition; UX judgment.) Sources: critic-ambition, critic-pattern.
   - Evidence: `390-h-q2-correct-after-hint.png`: "Correct", "You got it: …", +5 XP. Results then holds back the credit, so the student only learns what the hint cost afterwards.
   - Fix: a card line such as "A hint got you there. Explain it on your own next time and it counts as yours." Copy only, in `replyCard.ts:30-32`. It needs your say-so.

10. **Results repeat themselves.** (Redundancy; blocks a 6.) Source: critic-craft.
    - `results-perfect`: the 100% ring, "All five, no hints", "You explained every one yourself." and five ticked rows (`results.ts:10-11`).
    - "Hints helped" repeats the card title "Explained, with hints" (`results.ts:19`).
    - The mixed line repeats the rows below it.
    - The wording is **decided** (2026-10-21). Pattern kept it: no student noticed, and both asked for more on Results, not less.

11. **The Results colours borrow decorative tokens for verdicts, and the key-idea marks ignore the row colour.** (System fidelity; blocks a 9.) Source: critic-system.
    - `resultsSummary.css:14,18` use `accent/green/bold` and `accent/blue/bold` where the other cards use `feedback/*`, so a decorative hue carries a verdict. The values are the same, so nothing would change on screen.
    - The marks use `feedback/success|error/onSubtle` whatever the row's tone (`expandableResultRow.css:151-156`), so green checks sit on a red row.
    - Figma binds the accent tokens, so this is a binding difference to raise with design.

12. **The mic-off screen.** (UX judgment.) Source: critic-ux. Raised in earlier rounds.
    - "No thanks" ends the session (`mic-off/page.tsx:52`).
    - The body says to turn the mic on in the phone's settings, when it is one tap away on the toggle (`:45`).
    - The labels come from Figma, so they need your say-so.

13. **Craft.** Source: critic-craft.
    - **The hint line jumps 8px when recording starts.** `question.css:28` uses `space-600`; `recording.css:47` and `thinking.css:44` use `space-800`. The mic stays put. This departs from Figma's 31px, so report it to design.
    - **Press feedback is missing** on the input toggle, the Results row headers and the chat input, and the row caret snaps with no transition. No press-scale token exists, which is a gap.
    - **The open Results row is cramped.** Its question and transcript are 15px on a 20px line (1.33×, the `check:render` failure), and every gap is 8px, so its groups don't separate (`expandableResultRow.css:100,117-124`).
    - **German doesn't fit the two-button bar at 320px.** For example, "Alle wiederholen" is 197px in a 142px button. English only is in scope, so this is a gap to note, not to fix now.

14. **Coherence and system seams.** Source: critic-system.
    - **The toggle-to-typing-bar gap differs between screens.** It is 20px on the typing screen (off-scale, `type.css:20`, not logged) and 6px on the result (`result.css:61`), so the toggle jumps 74px between the two.
    - **Three text treatments for the same job.** Picker and end screen, Results, and mic-off each use a different one (`MessageScreen.tsx:32`). Title full stops also wobble.
    - **Results are louder than the loop, and use different words** ("Good explanations" against "Correct"). **Decided** (2026-10-21).
    - **Skip changes weight and place** on the slow-timeout card (`ResultScreen.tsx:127`).
    - **Smaller items:**
      - The `recordingGlow` multipliers aren't tokens.
      - A 14px skeleton gap is off the scale (`answerCard.css:41`).
      - `interactive/primary` is used as a text colour (`progressMeter.css:41`, `expandableResultRow.css:89`).
      - "..." and "…" are both used.
      - The topic list is built from buttons where `listItem` would fit, and the gap isn't logged.

15. **Smaller items.**
    - **Typed text lost (two critics).** Text typed into the result screen's typing bar before the route switches to `/q/n/type?focus` is lost. critic-system thinks it may be automation timing, so check it on a phone.
    - **Direct load of a finished question's thinking route.** It lands on `/q/2` idle with "Tap to dictate" and announces "Thinking." (critic-craft).
    - **Skips aren't announced.** A typed "I don't know" and a Skip move on without saying they counted as skipped (critic-ux).
    - **The slow-timeout card says "try again" twice** (critic-craft, critic-system).
    - **The welcome card repeats the topic pill**, and "Your progress is saved." is followed by "Progress saved." (critic-craft). The exit wording is **decided** copy.
    - **"You got setting marginal revenue…" reads awkwardly.** The `fillHint` openers don't fit key ideas that start with a verb's -ing form (critic-ux, critic-system).

**Resolved since round 3** (critics confirmed on the render):
- "Almost there" now names the ideas the student got, not a count (P1 row).
- The opened Results row shows the question, "You said", and each key idea as Got it or Missed (P1 row).
- The real judge credits Jonah's answer as partial, with the reason shown, instead of a random "wrong" (P2 row).
- A retry adds up the ideas covered across takes.
- The slow timeout has its own card with no "Didn't catch that" pill (round 3 finding 2).
- "Thinking…" sits above the mic.

## Against the calibration (rubric rule 5)

| Calibration row | Reference | This round | What changed |
|---|---|---|---|
| Almost there (P1) | UX 5, Feedback trust 4 | above it | The ideas are named. |
| Wrong, on a correct monopoly answer (P2) | UX 4, Feedback trust 4 | above it | Now partial with the reason shown. Still not Correct (finding 1). |
| Didn't catch that, after the wait (P1) | UX 4, Feedback trust 4 | not reachable | Gate 4. The slow-timeout case still loses typed text (finding 3). |
| Typed answer result (P1) | UX 4 | above it | Typed answers are always judged since 2026-10-28. |
| Results, expanded row (P1) | Feedback trust 4 | 9 for that item | Got it and Missed per key idea. |
| Results, Review all (P1) | UX 5 | same | Unchanged (finding 8). |
| Results row or answer card (P1) | Structure 5 | same | Verdict below the fold at 320 (finding 2). |
| After a tap on submit or Next (P2) | UX 5 | same | The sent answer still vanishes during the wait (finding 3). |
| Session start, voice first (P2) | Study fit 4, Accessibility 6 | same | 5 taps to type (finding 5). |
| The question set (P2) | Study fit 5 | same | Fixed five questions. |

The calibration did what it was meant to do. UX judgment and Structure came down to where the students' reactions put them, and the critics named the rows they compared against. Where the app had changed since a student's session, the critics scored the new behavior rather than the old row.

## Where the critics disagree

- **Results repeats and loudness.** critic-craft and critic-system mark them down; critic-pattern keeps both, because no student noticed and the wording is decided. Left open, as before.
- **Skip and Next changing place.** critic-system flags it as a seam; critic-pattern keeps it, because it follows the verdict's hierarchy.

## Critic-ambition (separate, not in the total)

**6 / 10**, up from 4. Verified from screenshots and code only (no Chrome this round), so capped at 7.

- **Earns a point:** Results count only unaided answers, with a separate hinted card, and the ring is hidden when nothing was unaided. That costs the student a lower number for a claim they earned.
- **Doesn't earn more:**
  - The loop undercuts that risk: a hinted correct reads like any correct (finding 9).
  - Named hints and the key-ideas scorecard are now what the rubric's 6 anchors require, so they earn no extra credit.
  - First meet and the end screen take the obvious default.

Proposals, built from documented components:
1. On a correct answer after a hint, the card says the hint means it doesn't count yet (`AnswerCard` `message`).
2. On pass 2 and later, a line names what moved ("Enzyme activity, on your own this time.") through `HeadlineBlock` `body`. Results still show only the latest pass.
3. The splash bubble states the counting rule ("only what you explain on your own counts as known"), so 1 and 2 pay off a rule the student was given up front.

It estimates 1 and 2 together at 7.

Gaps it named:
- `ExpandableResultRow` has no "improved" badge.
- Neither row component has a retry action.
- There is no component for coming back later (reminders, streaks).

## Pattern critic (run after the four, given their findings with the scores removed)

It reviewed 16 patterns: it kept 5, wants 6 adjusted inside the system, and asks to reconsider 5. The student evidence met its bar for reopening a decision in four of the five.

| # | Pattern | Recommendation | Needs |
|---|---|---|---|
| 1 | Correct only when all 3 key ideas are covered | **Cheap version now** (reword the questions); test required or bonus ideas first | Content now; later a `required` flag, a third mark on the row, and the 2026-10-24 decision reopened |
| 2 | Transcript only on Results | **Test first** (quote inside `message`, logged) | An `AnswerCard` part from Figma; reopens 2026-09-30 |
| 3 | One mic-centred thinking screen for typed answers too | **Cheap version now** (keep the typed text, a processing card in the middle) | A `ChatInput` sending state from Figma; reopens 2026-10-12 and 2026-10-27 |
| 4 | Every session opens and resets to voice | **Cheap version now** ("Type instead", remember the mode); test asking first | Inside the system; reopens SPEC step 13 |
| 5 | Review all reruns everything and wipes the pass | **Cheap version now** (label and copy); log retrying only the weak ones for after the sprint | Copy now; later a session that keeps passes and a row variant |

Kept: Results in full colour, its wording, Skip and Next swapping, the reveal sheet with a new hint each retry, and `BottomCTA`. Adjust inside the system: scroll the verdict into view, drop `AnswerCard`'s own status role, word hints as questions, use one text treatment per job, say a hinted correct in the card's text, and an `answerArea` slot for after the sprint. Not proposed: a sound on record (P1). No critic looked at it, and it may count as a native-style cue.

## Each critic's blind spot

- **critic-ux:**
  - The window was 1456px wide.
  - No VoiceOver and no iPhone, so the live-region findings come from the DOM.
  - It never made a spoken take, so the denied OS prompt, "didn't catch that" and the slow judge weren't seen live.
  - Reduced motion was seen only in screenshots.
- **critic-craft:**
  - No real phone, so safe areas and the Home Screen install weren't checked.
  - It couldn't render "didn't catch that".
  - Live measurements were at 570px.
- **critic-system:**
  - Live at 1033px.
  - It didn't audit box-shadow, transform or SVG values.
  - It read the Storybook docs for 4 of the 28 components.
- **critic-ambition:**
  - No Chrome.
  - The splash isn't in the screenshots.
  - The waveform wasn't rendered.
- **critic-pattern:**
  - No iPhone, no waveform, no spoken take.
  - It didn't read `component-spec.md` or `design-system.md` in full.

## Render appendix

How: `npm run check:render -- --shots`, Playwright and Chromium, dark mode, 2x, iPhone user agent, touch on, animations frozen. 74 states each at 320×640, 390×844 and 430×932, so 222 screenshots, in the session scratchpad (not committed). Critics who used Chrome each worked alone in turn on `localhost:3000`, because sessions live in localStorage and only `localhost` gets a working app (127.0.0.1 doesn't hydrate under `allowedDevOrigins`). 14 live typed answers in all (12 from critic-ux, 2 from critic-system), plus 1 typed answer in a scripted session (critic-pattern).

| Check | Result |
|---|---|
| `check:render` | 7 failing at each width, 11 known (16 at 320) |
| — new failure | The open Results row: 15px type on a 20px line (1.33×), 5 lines at each width |
| — script out of date | The `k7` walk times out, since participant links went live (2026-10-28); so no "Didn't catch that" state is captured |
| Contrast, overflow, targets | 0 failures at all three widths |
| `npm run check`, `tsc`, unit tests (68) | all pass |
| `npm run build` | not run (dev server in use) |

Not captured: a live 390px viewport, a real phone, the on-screen keyboard, a spoken take, the splash at 390px, and German.
