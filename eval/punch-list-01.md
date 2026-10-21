# Punch list 01

From `eval/scorecard-01.md` (6.0 / 10, no hard gate failed). Grouped by who can act. Finding numbers (F#) point back to the scorecard.

Rules that decide the groups: Claude can edit code under `src/`, but not the Figma file (read-only), and won't invent a component, token or value that doesn't exist. Anything that reopens a decision logged in `docs/sprint-context.md`, or changes `SPEC.md`, needs your yes first.

## A. Claude can fix now (no design decision needed)

| # | Issue | Where | Why it matters | Fix | Size |
|---|---|---|---|---|---|
| A1 | Screen readers hear almost nothing: announcements exist on only 3 screens, and the result announcement leaves out the hint text (F6) | `ResultScreen.tsx:66`, `results/page.tsx`, `done/page.tsx`, `TypeScreen.tsx`, the sheets | A student using a screen reader doesn't hear sheets open, Results, the end message or the typing screen | Add `announce()` calls in full sentences; append the hint to the result sentence | Small |
| A2 | "Didn't catch that" pill uses a straight apostrophe; everything else is curly (F12) | `StatusPill.tsx:22` | Visible glyph mismatch right above the card text | Change to `Didn’t catch that`; check stories and tests that match the old string | Tiny |
| A3 | `/results` with no saved session shows a blank screen (F15) | `results/page.tsx` | Typing the address or reloading after `/reset` leaves a dead white-on-dark page | Redirect to `/` or show a message | Small |
| A4 | Leave on a question with no saved session shows "Nice work. You're done." (F15) | `src/lib/session.ts` `endSession` | Wrong message, but only on a direct deep link; normal entry creates the session | Create the session if missing | Small |
| A5 | Mic and "Tap to dictate" sit ~8px higher on result screens than on idle and thinking; the toggle sits ~9px above the drawer (F9) | `result.css:19-47`, `Scaffold` bottom slot | The thumb target moves between screens. Read off screenshots only; nobody measured it | Claude measures in the browser first, then reconciles heights (a one-line margin change would push the toggle into the drawer) | Medium |
| A6 | Typing field's `textarea` is 26px tall (gate 2 open question) | `ChatInput` | May be under the 44pt target if the surrounding bar isn't tappable | Measure the bar as a tap target; extend the hit area if needed | Small |
| A7 | Story uses a literal `rgba(0, 0, 0, 0)` (F13) | `ButtonIcon.stories.tsx:80` | Breaks "no literal color" even though `check:tokens` doesn't catch rgba | Use the `paint()` helper the other stories use | Tiny |
| A8 | Structure never verified: `npm run build`, 320px, 430px (F14) | whole app | Rubric needs these for Structure above 6 | Run build, load every route at 320 and 430, report | Small |
| A9 | Re-grade with live Chrome (now connected) | `eval/` | Critics were capped at 7 because they couldn't render | Run critics one at a time at 390px, write `scorecard-02.md` | Large; after the fixes |

## B. Needs your decision, then Claude builds it

| # | Issue | Where | The decision | After you decide |
|---|---|---|---|---|
| B1 | **Results counts a hinted pass as knowing it** (F1). Ring, headline and "Good explanations" treat hinted and first-try the same; XP differs but Results doesn't show XP | `results/page.tsx:47-91`, `ThinkingScreen.tsx:100-104`, `src/content/results.ts` | Reopens logged decisions (2026-10-05 Results, XP). The pattern critic says `sprint-context.md` lines 55 and 66 contradict each other; I haven't verified that reading. Do you want the count to be unaided passes only? | Claude records `unaided`, changes the ring and headline, rewrites the line under it ("3 without a hint. 1 more with one…"), and updates stories |
| B2 | Results says the same number three times, and perfect adds "Master status!" (F2) | `results/page.tsx`, `results.ts` | Which to drop: the ring or the numeric headline? Copy comes from Figma, so also see C2 | Claude removes one and rewrites the perfect copy |
| B3 | A slow take ends as "I couldn't understand that take" and gives no retry while waiting (F4) | `ThinkingScreen.tsx:109-117`, `ResultScreen.tsx` | Changing the timeout message is small. Adding retry and type buttons during the wait changes `SPEC.md` §6 | Claude changes the message now if you approve, then adds the buttons if you approve the SPEC change |
| B4 | Recording's cancel is a small, unlabeled X next to a top-left X with a different meaning (F8) | `RecordingScreen.tsx:105-111` | Replace with a labeled Tertiary "Cancel" button? Changes SPEC wording; the decided cancel behavior stays | Claude swaps it, checks the button's tap size against `docs/platform-constraints.md` |
| B5 | `/mic-off` body is set in a headline style: bold, ~24px on a ~24px line (F7) | `mic-off/page.tsx:26-31` | `SPEC.md` §11 specifies `headlineS`. Switch to `bodyM` (18px on 26px)? | Claude changes the prop; I'd flag it as a SPEC deviation |
| B6 | Thinking shows five cues for one status (F3). critic-craft says cut; the pattern critic says keep (brief says "design the wait") | `ThinkingScreen.tsx:151-160` | Keep all, or drop the dots and disabled mic? | Claude removes whichever you pick. The skeleton bars live inside `AnswerCard` with no prop to hide them |
| B7 | `k7` question 2 shows the nudge on take 2 and take 3 with nothing showing the retry registered (F15) | `src/content/scripts.ts` or engine copy | Acceptable, or should the third take read differently? | Claude adjusts if you want |
| B8 | Results "Continue" is primary and ends the session; "Review all" restarts it (F13, out of lane) | `results/page.tsx` | Is the leaving button right as primary? Low priority | Claude swaps variants if you say so |

## C. Needs you (Figma, copy, or a new component) — Claude can't do these

| # | Issue | Where | Why it's yours | Next step |
|---|---|---|---|---|
| C1 | `/mic-off` words: it reads as an offer, not as "mic is off", and has no way to turn it back on (F7) | copy in `mic-off/page.tsx` | Words are yours. The pattern critic notes the re-enable path can't exist in a prototype with no real mic prompt | Write the copy; Claude drops it in |
| C2 | Results screen is the loudest in the flow, and Knowie's voice goes hype-y there ("Master status!", "Gotta start somewhere.") (F10) | `resultsSummary`, `src/content/results.ts` | Colors come from the Figma component and the copy from Figma's Results frames. Claude can't modify Figma | Decide whether to quiet the cards and level the tone; update Figma, then re-sync tokens |
| C3 | Per-row "with hint" marker for hinted passes | `ResultsSummary` | Needs a new row field, a tag tone token and a Figma frame | After the sprint, if B1 goes ahead |
| C4 | Mascot size and body-text weight differ across splash, `/mic-off`, `/done`, error screens (F11) | `start.css`, `micOff.css`, `docs/component-gaps.md` rows 7–8 | A design-system call, partly logged already | Decide the pattern in Figma |
| C5 | The 3px heading underline has no token, so it's built at 2px (F13) | `result.css:114`, `component-gaps.md` row 13 | Needs a 3px stroke token from Figma | Add the token; Claude then uses it |
| C6 | "Almost there" and "Try again" pills share a similar arrow icon (F13) | `src/icons`, `StatusPill` | Needs a distinct icon exported from Figma | Polish; pick an icon if you want it |

## D. Test with students before building

| # | Issue | Where | Why test first | How |
|---|---|---|---|---|
| D1 | Result shows no "what we heard" (F5). Principle 4 in `voice-ux.md` asks for it, but the mock's transcripts are canned and could confuse | `ResultScreen.tsx:73-80` | The harm is real for a real engine but unproven for the mock. Showing placeholder words under their own answer may confuse more than help | Half the participants see a "Heard: …" line on a wrong result, half don't; ask "did the app understand you?". A crude version is possible now; a proper one needs a Figma frame and component |

## Suggested order

1. Decide B1 and B2 (they shape the Results screen), and B3 and B4.
2. Claude does A1–A4, A6, A7 together, then A5 (measure first) and A8.
3. You handle C1 and C2 in Figma and copy.
4. Rerun the critics (A9) for `scorecard-02.md`.

## Status, 2026-10-12 (evening)

Done: B1–B4, B6 (thinking cues), and A1–A9 below, in the working tree.

| # | Item | Result |
|---|---|---|
| A1 | Announcements | Added for the question opening, exit confirm, answer sheet, typing screen, mode switch, Results and end screen; the result sentence includes the hint. |
| A2 | Apostrophe | Pill now reads "Didn’t catch that". |
| A3 | `/results` with no session | Goes to `/` (then the start screen). |
| A4 | Leave with no session | Shows "Progress saved." |
| A5 | Mic drift | Measured 8px; fixed. Question and result mic both at 628–724px; caption at 584–604px. |
| A6 | Typing field target | The 26px text area sits in a 358x56 pill; the whole pill now opens the field. |
| A7 | Story literal | Replaced with a computed transparent probe. |
| A8 | Build and widths | `npm run build` passes. 430px: no overflow. **320px: 23 states overflow**, always the right-hand button of a two-button bottom bar (about 20px past the edge). Not fixed. |
| A9 | Scaffold long-sheet | A scrolling sheet middle is now a keyboard tab stop only while it overflows; the violation is gone. |

Kept as is by the designer: B5 (`/mic-off` headline style), B8 (Continue primary).
Open: B7 and B13 (not understood yet), the 320px bottom bars, the Figma/copy items in group C, and the student test in D1.

Update (2026-10-12, later): hint ladder replaces the fixed nudge (three hints per key idea, draft copy for review); the progress bar counts the question just answered once it is correct; the two-button bottom bars now fit at 320px (0 of 65 states overflow). The 320px height still scrolls or clips some content at 640px tall (for example the Mic skipped text); the middle is the scrolling slot.
