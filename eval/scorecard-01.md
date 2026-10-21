# Scorecard 01

Graded 2026-10-12 against `eval/rubric.md`. Scope: every route and state in `SPEC.md`.

## Total

**6.0 / 10** (weighted). No hard gate failed. One question is still open: the typing field's tap size (gate 2).

Weights: the rubric says High, Medium and Low but gives no numbers. I used High = 3, Medium = 2, Low = 1 (sum 18). Change them and the total moves. The sum is (7+6+6+6+5)×3 + 6×2 + 6×1 = 108, and 108 / 18 = 6.0.

Every dimension is capped at 7 under rule 2. Chrome was not connected for any critic, so none could render live, measure on the page, or run `npm run build`. (I measured contrast myself afterwards; see gate 1.) Each graded from code plus a subset of my screenshots. Their coverage: craft about 20 of the shots, UX about 12, system about 20, ambition about 10 named ones.

## Per-dimension table

| Dimension | Weight | Score | Critic | Verified by |
|---|---|---|---|---|
| System fidelity | High | 7 | critic-system | Code and grep only. Cap reached. `npm run check` clean (I ran it, see below). |
| Coherence | High | 6 | critic-system | Rendered, ~20 screenshots. Motion and entry/exit not walked. |
| Craft | High | 6 | critic-craft | Screenshots at 390px plus code. No 320/430, no live measuring. |
| UX judgment | High | 6 | critic-ux | Code plus ~12 screenshots. Not walked live. |
| Redundancy | High | 5 | critic-craft | Element-by-element removal on thinking, recording, result, results screenshots. |
| Accessibility | Medium | 6 | critic-ux | Code, tokens, hand-computed contrast, ~12 screenshots. Nothing measured on the page by the critic. Contrast was measured afterwards by me (gate 1), which doesn't change this score: the cap-7 reason still applies to announcements, focus order and grayscale. |
| Structure | Low | 6 | critic-craft | 390px screenshots. Build, 320/430, direct loads not verified by the critic. See my measurements below. |

Reconciliation: each dimension has exactly one owner among the three adversarial critics, so there was no averaging. The scores are taken as reported. Critics flagged some out-of-lane items (listed in findings, without scores). Critic-ambition is not in the total.

## Hard gates

| Gate | Status | Evidence |
|---|---|---|
| 1. Contrast, body text 4.5:1 | **Pass (measured on the rendered page, 2026-10-12)** | Measured after the critics ran, so their reports still say "unverified". Method: Playwright at 390px, dark mode; for each of the 65 states, every visible text node (529 text elements in all) had its computed color composited over the actual stack of backgrounds behind it (element opacity included), then the WCAG ratio computed. Threshold 4.5:1, or 3:1 for text ≥24px or ≥18.66px bold. Result: **0 failures**. Lowest ratios: "Try again" pill label 6.64–6.66:1 (15px, 600; dark on coral), "Almost there" 6.64:1, results-row labels "Question" and "What you said" 6.93:1 (12px), "Needs practice" 7.02:1 (24px bold, large), "Thinking…" and "Your progress is saved." 7.23:1, "Correct" pill 7.49:1, XP count 8.1:1. Secondary text, e.g. "Tap to dictate", "Listening…", "This phone is ready…", is 8.36:1. Primary text is ≥10:1. The typing field's placeholder is a pseudo-element, which the text-node walk can't see; I read its computed style separately (white at 55% over the field's own fill over the page): 5.66:1. critic-ux's concern about `text.tertiary` at 4.6–5.0:1 did not show up on any rendered text, so that token isn't used on a surface I rendered. Not measured: the Storybook-only component states, and text under the exit-confirm and reveal scrims, whose scrim dimming I did not model. Only the card-faded "Welcome!" text (opacity 0, invisible) scored below threshold in the raw data, and I excluded it. No gradient or image backgrounds sat behind any text. |
| 2. Touch targets 44pt | **Pass on buttons, one open question** | I measured every visible `button`/`a`/`input` in all 65 renders: all ≥ 48×48 (mic 96×96, Cancel recording 48×48, toggle 48×48, Skip 60×48). One element is under 44: the typing field's `textarea` ("Your answer") is 26px tall (326×26 empty, 278×26 with the send button). Its surrounding bar looks taller in the screenshots, and the bar was not measured as a tap target. |
| 3. No raw hex in component source | **Pass** | `npm run check` ran clean (tokens, fallbacks, generated, claude). critic-system's own grep agrees. Near miss, not hex: `src/components/buttonIcon/ButtonIcon.stories.tsx:80` has a literal `rgba(0, 0, 0, 0)`. |
| 4. No two states that should differ render identically | **Pass, with two flags** | critic-craft compared idle, listening, thinking, "Taking a moment…", correct, partial, wrong, wrong after two hints, didn't catch that, the three Results states and the three Done messages: all differ by more than copy. My hash comparison of 65 renders agrees (see Render appendix). Flags: (a) in `k7` question 2, take 2 and take 3 render pixel-identically (both show the nudge); (b) thinking vs "Taking a moment…" differs only in the card's first line, which is intended. |

## Findings

Ordered by damage. "Source" names the critic or critics. Findings from the pattern critic's review are in their own section below.

1. **Results counts a hinted pass as knowing it.** (UX judgment, blocks a 9.) Sources: critic-ux, critic-ambition.
   - Evidence: `src/app/results/page.tsx:39,47-57,77-91`; `ThinkingScreen.tsx:100-104` sets `outcome: 'correct'` for hinted and first-try alike; shots B25, E9. Only XP differs (10 vs 5), and Results doesn't show XP. "Strongest area" names the first correct row (`results.ts:11`, `page.tsx:55`).
   - Fix (critic-ux): add `unaided: takeNumber === 1 && !hintsUsed.length` to the record at `ThinkingScreen.tsx:100-104`; count only unaided in the ring and headline. A per-row "hinted" label has no documented `ResultsSummary` variant: flag as a gap.

2. **Results states one count three times, and perfect adds a fourth statement.** (Redundancy, blocks a 9.) Source: critic-craft.
   - Evidence: B25 (ring "2/5", headline "You got 2 of 5 concepts", group lists), B28 (ring "100%", "5 out of 5!", "Master status!", five rows).
   - Fix: in `results/page.tsx`, drop `ProgressMeter` or the numeric headline, not both. Rewrite the perfect copy in `src/content/results.ts` so the number appears once.

3. **Thinking stacks five cues for one status.** (Redundancy, blocks a 9.) Source: critic-craft. **Disputed:** see "Where the critics disagree".
   - Evidence: B10, B19; `ThinkingScreen.tsx:151,157-160`: "Thinking…", three skeleton bars (inside `AnswerCard` `processing`, no documented prop to hide them), greyed disabled mic, `LoadingDots`.
   - Fix (critic-craft): remove the `LoadingDots` block and the disabled `MicButton`, or drop the skeleton. If `AnswerCard` has no prop for it, log in `docs/component-gaps.md`.

4. **A slow take ends as "didn't catch that", and there is no retry while waiting.** (UX judgment, blocks a 9.) Source: critic-ux.
   - Evidence: `ThinkingScreen.tsx:109-117`; B18, B19, B20. At ~10s the student lands on "I couldn't understand that take", though the audio was fine. The only exit during the wait is the top-left X. `voice-ux.md` "If time" row calls for "taking a moment, then retry".
   - Fix: at the slow notice add a retry and a type path in `bottomContent` using documented `BottomCTA` layouts, and change the timeout message in `ResultScreen.tsx` so it doesn't say "couldn't understand".

5. **The result shows no "what we heard".** (UX judgment, blocks a 9.) Source: critic-ux.
   - Evidence: `ResultScreen.tsx:73-80`; B14, B21. The transcript is stored (`ThinkingScreen.tsx:94`) but only shown in expanded rows on `/results`. `voice-ux.md` principle 4.
   - Fix: pass the latest `record.transcripts` entry into the card or a line under it. critic-ux did not check `AnswerCard`/`TextBlock` props in Storybook; confirm first, or log a gap. The pattern critic recommends testing before building (see below).

6. **Screen-reader announcements cover only three screens.** (Accessibility, blocks a 9.) Source: critic-ux.
   - Evidence: `announce(` appears only in `ThinkingScreen.tsx:61,114`, `RecordingScreen.tsx:62,84`, `ResultScreen.tsx:66`. Nothing for the reveal and more-info sheets, exit confirm, `/type`, `/results`, `/done`, Next/Skip, or the switch to keyboard. The result announcement ("Almost there. You covered 2 of 3 key ideas.") drops the hint text.
   - Fix: append `message` to the string at `ResultScreen.tsx:66`; call `announce()` on sheet open and close, and on mount in `results/page.tsx`, `/done` and `TypeScreen.tsx`.

7. **`/mic-off` frames the denied path as an offer, and sets its body copy in a headline style.** (UX judgment blocks a 9; Craft blocks a 9.) Sources: critic-ux, critic-craft, critic-system.
   - Evidence: `mic-off/page.tsx:26-31`; A5, E6. Copy "Your mic is off, so you have the option to keep learning…", "No thanks" ends the session. The paragraph is `headlineS` bold grey, ~24px on a ~24px line (ratio ~1.0) against the rubric's 1.4–1.6 for body. Same style on the mic primer line.
   - Fix: critic-ux: say mic access is off and how to turn it on, and name "No thanks" for what it does. critic-craft: `bodyStyle="bodyM"` (18px on 26px) — but `SPEC.md` §11 specifies `headlineS`, so this needs a decision.

8. **Recording has two X controls, and the cancel one is small and unlabeled.** (UX judgment blocks a 9; Redundancy polish.) Sources: critic-ux, critic-craft.
   - Evidence: `RecordingScreen.tsx:105-111`; B7. Top-left Close opens the exit sheet; bottom Cancel discards the take. Cancel is ~32px visible with a 10% fill, ~8px below the 96px mic, and has no text.
   - My measurement: its tap area is 48×48, so gate 2 holds. The concern is visual size and meaning, not target size.
   - Fix: `size="M"` or `"L"` and a visible "Cancel" label; a labeled icon-button pattern isn't documented, so flag that part as a gap.

9. **The mic and its caption sit a few px higher on result screens than on idle and thinking, and the toggle crowds the drawer.** (Craft, blocks a 9; Coherence polish.) Sources: critic-craft, critic-system.
   - Evidence: B3/B10 vs B14/B20 (mic top y≈1256 vs 1240 at 2x, ≈8px at 1x); B14 toggle ~9px above the `BottomCTA` drawer; `result.css:19-21,32-36,45-47`.
   - Status: read off 2x screenshots by two critics, **not measured in a browser by anyone**. critic-craft warns that the one-line `margin-top` change would push the toggle into the drawer; reconcile the heights in `Scaffold`'s bottom slot and measure.

10. **Results is the loudest screen, and Knowie's voice changes there.** (Coherence, blocks a 9.) Source: critic-system.
    - Evidence: B25, B28 (full-saturation green, coral and near-white cards, nothing earlier is as large); copy "Master status!", "Gotta start somewhere." (B28, E9) against the loop's plain lines ("Exactly: enzymes lower…", "I couldn't understand that take.", B20). Results copy comes from Figma (`results.ts:1`).
    - Fix: don't recolor ad hoc. Report to design, or use a subdued tone token if one exists in `tokens/tokens.json`; else it's a token gap. Report copy mismatches against Figma rather than rewriting.

11. **Mascot size and body-text weight differ across splash, `/mic-off`, `/done` and error screens with no pattern.** (Coherence, polish.) Source: critic-system. Evidence: B1, A5, A2, B29; partly logged in `docs/component-gaps.md` rows 7–8. The unlogged part is body weight and leading on `/mic-off` vs `/done` and `/results`.

12. **"Didn't catch that" uses a straight apostrophe in the pill, curly elsewhere.** (Craft polish; System polish.) Sources: critic-craft, critic-system. Evidence: `StatusPill.tsx:22` vs `ResultScreen.tsx:37`, `AnswerCard.tsx:29`; B20, C5 (my text capture confirms: pill "Didn't", card "didn’t"). Fix: `StatusPill.tsx:22` to `Didn’t catch that`; check stories and tests that match the old string.

13. **Smaller items.**
    - "Almost there" and "Try again" pills use similar circular-arrow icons at small size (critic-ux, polish; B14, B21). Label and color still differ.
    - The 3px heading underline is built at 2px `Stroke/Heavy` because Figma's 3px has no token (`result.css:114`; `component-gaps.md` row 13). It's flagged but still routed around inline (critic-system, blocks a 9).
    - `ButtonIcon.stories.tsx:80` literal `rgba(0, 0, 0, 0)` (critic-system). Use the `paint()` helper the other stories use.
    - Out of lane, from critic-ux: "Continue" on Results is primary and ends the session while "Review all" restarts it. From critic-craft: "Skip" on didn't catch that vs "Next" on partial and wrong are different labels for similar functions (intentional per `SPEC.md`).

14. **Structure is mostly unverified by the critic.** (Structure, blocks a 9.) Source: critic-craft. Not run: `npm run build`, 320px and 430px, `/q/6` and unknown-code loads, reload on `/recording` and `/thinking`.
    - My renders cover part of it: no horizontal overflow in any of 65 states at 390px (`scrollWidth` ≤ 390 everywhere); `/q/6` renders a 404; `/s/zzz` renders the unknown-link message; reload on `/recording` and `/thinking` lands on `/q/1` (E3, E4); `/` resumes the saved route (E5). 320/430 and `npm run build` are still not run.

15. **Found in my render pass, not by a critic.** I checked these directly.
    - `/results` loaded with no saved session renders a blank screen (A7: empty page text, 390px). Reachable by typing the address or reloading after `/reset`.
    - With no saved session, going to `/mic`, Turn on, then Close and Leave on a question shows "Nice work. You're done." instead of "Progress saved." Cause: `localStorage['knowie.session']` is `null` there, so `endSession('left')` has nothing to write to (confirmed with a debug run). A real entry (`/s/[code]` or `/` → Start) creates the session, so every normal path shows the right message (E1, E7). Only a direct deep link hits it.
    - In `k7` question 2 the student gets one hint and then the nudge: take 2 and take 3 render identically (C2, C3: same hash, same text). Nothing on screen shows that a third try registered. The ladder in `SPEC.md` is "2 hints, then nudge", but a question with only one uncovered key point has one hint.

## Where the critics disagree

- **Thinking state.** critic-craft says five cues is redundancy (finding 3). The pattern critic says keep it: `voice-ux.md` principle 6 and the brief's "design the wait" require it, and the disabled mic holds the layout; it would only trim the dots. Not reconciled. The user decides.
- **Slow take and transcript.** critic-ux wants both changed. The pattern critic agrees on the slow-take message (change one string) and says to test the transcript before building it.

## Critic-ambition (separate, not in the total)

**6 / 10.** Verified by code and the screenshots (B1, B11, B14, B25, B29 and others); not rendered live, so capped at 7.

- First meet: no risk. Generic claim "you will score higher on your tests!" over "Let's go!" (B1).
- The loop: **risk taken.** No words while speaking (`docs/sprint-context.md:51`). The hint is tied to the missing key idea with a covered count (B14). This is what earns the 6.
- Recovery from a miss: no risk. Hint, hint, nudge, then Reveal (B21–B23). The correct card is stock acknowledgement (B11).
- Results: no risk. Ring and headline count hinted passes. "Great start—your strongest area is X" names the first correct row, not an earned one. "Master status!" is flattery, which the brief says to avoid.
- After the session: no risk. `/done` is a mascot and one line (B29).

Proposals, built only from existing components:
1. Ring and headline count only unaided passes; the line under it says what the rest were ("3 without a hint. 1 more with one. 1 to practise again."). `ProgressMeter`, `HeadlineBlock`, `ResultsSummary`, no new tokens. Change: `results/page.tsx:47-57`, `results.ts`. Would reach 7 if built.
2. `/done` (finished state only) names the concepts still in Needs practice and that they come back first. Text only, no button, so the decided "end screen offers nothing to tap" stands. Alone it reaches 7; with proposal 1, 8.

Gaps it named: no confidence-before-answer control in the library; no per-row "hinted" tone in `ResultsSummary`. Neither proposed.

Blind spot: did not render live; did not open `src/lib/session.ts` to confirm that a first-try flag or per-question XP is stored; did not read `voice-ux.md`, `component-gaps.md` or `SPEC.md` in full.

## Pattern critic (run after the four, given their findings with scores removed)

Reviewed 20 patterns; four proposed for reconsideration. It reproduced the main findings in code and read shots B7, B10, B14, B25, A5.

| # | Pattern | Recommendation | Marked |
|---|---|---|---|
| 1 | Results as a pass count that treats hinted as mastery | **Do now** for count and copy; log the per-row marker for after the sprint | Count and copy inside the system. A per-row "with hint" marker needs a `ResultsSummary` change, a tag token role and a Figma change. |
| 2 | Recording cancel as an unlabeled X beside a top-left X | **Do now.** Labeled `Button` Tertiary S "Cancel" under the mic, glyph kept on Close only | Inside the system. Check `Button` min touch size against `docs/platform-constraints.md` (it didn't). |
| 3 | `notCaught` reused for a slow timeout | **Do now.** Same result, different `message` ("took longer than it should, mic is ready") | Inside the system (documented `message` prop). A separate pill label would need a new `StatusPill` state. |
| 4 | Result card with no "what I heard" | **Test first**, log the proper component for after the sprint | Crude version inside the system (`message` takes ReactNode). Proper version needs a quote style or `AnswerCard` prop, a token role and a Figma frame. |

It also found a contradiction in the decision log: `sprint-context.md` line 66 says XP and streak are the mastery signal, counting unaided passes, while line 55 puts a hinted-correct answer in Good explanations. The Results screen follows line 55. I have not checked this reading of the two lines myself.

Kept as is: scaffold slots, `bottomCTA`, `appBar`, `progressIndicator`, `toggleGroup`/`inputModeToggle`, reveal and more-info sheets, exit confirm, splash and primer, `ExpandableResultRow`, the four verdict pills, topic pill, XP counter. Adjust only: result bottom stack (fix the mic offset, not the pattern), `/mic-off` (copy only; the re-enable path is unreachable in a prototype with no real mic prompt), `announce()` coverage.

Chose not to reconsider: the brief's hard constraints; "no transcript while recording"; the confidence control and per-row hint tone (both need new components); `/done` as mascot plus line; `/mic-off` beyond copy.

Blind spot: did not render or measure offsets or touch-target size; did not read `docs/platform-constraints.md`.

## Each critic's blind spot (their own words, condensed)

- **critic-craft:** saw nothing live: no 320px or 430px, no real-phone safe areas, no press feedback, no timing of the 1.2s and 10s waits, no scroll in the results list. Viewed about 20 of the 57 frames it was given.
- **critic-ux:** never rendered or tapped anything, so no contrast or target measurement. Did not test the real mic-permission flow, a screen reader, grayscale or reduced motion. Did not read `AnswerSheet`, `ExitConfirm`, `EntryScreen` or `TypeScreen`, so focus handling and the text path end to end are unreviewed. About 48 shots unread.
- **critic-system:** no computed styles, no Storybook prop check, no `npm run check` (it grepped the patterns instead). Did not open `B12`, `B16`–`B24`, `C*`, `D*`, `E*`, `F*`, so an unlogged inline element or undocumented prop could hide there.
- **critic-ambition:** see above.
- **critic-pattern:** see above.

## Render appendix

How: Playwright, Chromium, 390×844 at 2x, dark color scheme, iPhone user agent, touch on. Animations frozen for the screenshot so hashes are comparable. Entry through `/reset` → Start or `/s/k7` → Continue in browser, so every run had a real saved session. Reduced motion on one run. Scripts: `tour` (full pass, retries, slow take, Review all → perfect Results), `k7` (partial → nudge, wrong, didn't catch that, reveal), typed path, leave, opt out, skip all, reload. 65 screenshot files are the final set (a stale `C0` file from my first run was deleted before the critics ran). Files and per-state manifest (route, page text, tap-target sizes, scroll width) are in the session scratchpad `shots/`, not committed.

Same-hash pairs and what they mean:

| Same render | Verdict |
|---|---|
| C2 (k7 q2, take 2) = C3 (take 3) | Both show the nudge. By design, but see finding 15. |
| B6 (recording at 0.25s, Welcome card still fading) = B7 (recording at 1.4s) | Artifact of freezing animations; the fade can't be compared this way. Not verified in motion. |
| B10 (thinking) = D6 (typed thinking) = F2 (reduced-motion thinking) | Same screen, same question; reduced motion can't differ in a frozen frame. |
| B11 = D7; B14 = C1 = D9; B3 = B5 = E2; B9 = E3 = E4 = E5; A5 = E6; A6 = B29; B2 = E0; D2 = D5 | Same state reached two ways. Expected. |

Every verdict state (correct, partial hint 1, partial/wrong hint 2, nudge, wrong, didn't catch that, thinking, "Taking a moment…", the three Results states, the three Done messages) has a distinct hash from the others.

Not captured: the on-screen iOS keyboard (headless has none, so the "keyboard up" typing state was approximated by focus), the Home Screen full-screen install, real-phone safe areas, 320px and 430px, press and disabled states of individual components (Storybook territory).
