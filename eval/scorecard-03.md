# Scorecard 03

Graded 2026-10-21 against `eval/rubric.md`, on the code at commit `a06cb08`. Scope: the splash (first time), the mic primer, the mic-skipped screen, every question state (idle, with the welcome card, dictating, thinking, "Taking a moment…"), every answering state (correct, partial, wrong ×3, didn't catch that, slow timeout, the hint ladder, correct after a hint, the typing screens), the reveal and more-info sheets, and the four Results screens. The exit sheet, the end screens and the 404 were not in scope.

Four critics ran in their own contexts at the same time. Each got only the screens, the rubric and its own dimensions; nobody saw another critic's output. The pattern critic was not run. This is a new file, not a rewrite of scorecard 01, so the baseline and round 2 stay as they were.

**What was different this round, and why it matters.** The Chrome tools were not connected, so no critic could load the live page. They graded from 85 screenshots I took of the running app at 390px in dark mode (one per state), plus the mechanical report `check:render` printed for the same run (84 states, 0 failing, 12 known). Anything a critic could only read from code is capped at 7, as the rubric says, so all scores sit at 7 or below. Because the evidence is thinner than round 2's (which had a live page for some checks), small moves up or down are weak evidence.

## Total

**6.3 / 10** (weighted), the same as round 2. No hard gate failed.

Weights are my assumption, as before: High = 3, Medium = 2, Low = 1 (sum 18). The sum is (7+7+5+7+5)×3 + 7×2 + 7×1 = 114, and 114 / 18 = 6.33.

**One dimension went backwards: Craft, 6 to 5.** Most of the cause is changes I made since round 2. The new Results headlines ("Hints got you there", "Here's how it went") wrap to two lines in Headline L, which is set at 44px type on a 36px line, and the critic could see the lines touching. The mic-skipped paragraph is set in Headline S (24px on a 24px line) and is now longer than it was. Both line heights are known Figma tokens, so the check lists them as known, but the critic scored what it saw. Coherence went up, 6 to 7, which hides the Craft drop in the total.

## Per-dimension table

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

## Hard gates

| Gate | Status | Evidence |
|---|---|---|
| 1. Contrast, body text 4.5:1 | **Pass** | `check:render` at 390px: 84 states, 0 contrast failures, none of the 12 known items is a contrast item. The critic eyeballed the grey captions as well above the line but computed no ratios this round. Round 2's measured lowest was 6.64:1. |
| 2. Touch targets 44pt | **Pass** | Same report, 0 failures. The cancel X draws about 32px; its tap box was passed by the report but not read out (round 2 measured it at 48×48). |
| 3. No raw hex in component source | **Pass** | critic-system's Grep for hex, `rgb(`, `hsl(`, `var(--x,` and `text-transform` over `src/components` and `src/app`: 0 matches. The one raw value is the `@media (max-width: 359px)` breakpoint in `bottomCTA.css`, which CSS cannot take from a variable. |
| 4. No two states that should differ render identically | **Pass** | critic-craft compared the pairs I found by hashing. All are by design (repeat tries on one question, mic-off from the flow and directly, reload landing on the question). Two are weak and are findings below: hint 3 and hint 4 render identically, and the slow-timeout state wears the same pill as "didn't catch that". |

## Findings

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

## Each critic's blind spot

- **critic-craft:** judged still screenshots at 390px, so it could not see motion (the glow, the dots, the question rise), press or reduced-motion states, 320 and 430px, German text, or the recording hint after its delay. Any of those could move Craft or Structure.
- **critic-ux:** could not do the grayscale pass, a reduced-motion pass or a screen-reader order check on Results. States it did not open (the other wrong screens, the splash, the other typing screens) were graded from the report and code. It did not read `SPEC.md` or the recall engine files.
- **critic-system:** never ran `npm run check` and read no computed styles from the live page, so values set by JavaScript (the progress width, the keyboard offset) came from code. It did not open `docs-show` for every component, so it could not confirm every prop is documented.
- **critic-ambition:** read no source for the mic primer, the typing screens, the thinking and slow states or the hint ladder beyond the screenshots, so a risk in one of those flows could be missing.

## Critic-ambition (separate, not in the total)

**Reach: 4 / 10**, from code and screenshots only.

It starts at 5 for a design that follows the rules and takes no risks, and gives credit for three risks: Results count only unaided answers (the 40% costs the student something, and hinted answers get their own card); the student sees no words while speaking; and the headline "Hints got you there" refuses to call a hinted pass a pass. It marks the score down because the weakest part of the design is what happens after: the end screen is "Nice work. You're done." with nothing to tap, which the brief calls "the least designed part of the whole thing". The splash also asserts a benefit ("you will score higher on your tests!") instead of earning it.

**What the work is settling for:** the first meeting (a splash that explains why recall works, then a mic primer) and the time after the session. The loop and Results take real risks.

**Proposals** (each built only from existing components):

1. **Make the end screen name what comes back.** Instead of "Nice work. You're done.", name the first concept that needs practice and when it returns ("Enzyme activity is next. Say it again tomorrow."), or the last concept to test in a week if everything was unaided. Built from the `title` and `caption` the end screen already passes to `MessageScreen`. The "tomorrow" promise is canned, since there is no scheduler, so it should be flagged as placeholder to participants like the transcripts. It changes copy only and does not reopen the decision that Continue offers nothing to tap. Estimated score: 6 to 7.
2. **Make the partial card credit what the student said.** Lead with the key idea they covered ("You said the shape changes."), then the hint. It restates a covered key point and adds no new facts. Built from `AnswerCard`, with a per-key-point phrase added in `src/content/questions.ts`. Estimated score: 7 combined with proposal 1.

**Gap:** a "how sure are you?" step before each answer would make overconfidence cost something, as the brief asks. Storybook has no choice input for it (`ToggleGroup` is documented only for voice and keyboard), so it is a gap, and it adds a step before every answer.

## What changed since round 2, and what caused it

| Dimension | Round 2 | Round 3 | What likely caused it |
|---|---|---|---|
| Coherence | 6 | 7 | The mic, toggle and bar now sit in the same place on every screen (Figma 2026-10-21), which the critic could see side by side. |
| Craft | 6 | 5 | The new Results headlines and the longer mic-skipped text wrap and collide in lines that are too short (finding 1). |
| Everything else | — | unchanged | — |

The rubric's guidance applies: the finish line is when the reports start repeating themselves. Findings 2, 3, 7 and 11 are repeats from rounds 1 and 2.
