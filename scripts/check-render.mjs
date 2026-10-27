#!/usr/bin/env node
// Walks every screen and state of the running app at three phone widths (320, 390, 430) and checks what a
// reviewer would otherwise have to eyeball. It is the one place that renders at the real phone size, so the
// other checks (and the critics) don't depend on whatever size someone's browser window happens to open at.
//
// Run:  npm run check:render            (all three widths, a couple of minutes)
//       npm run check:render -- --widths 390
//       npm run check:render -- --shots /tmp/shots     (also saves a screenshot of every state)
//
// It uses the dev server on http://localhost:3000 if one is running (set BASE_URL to use another), and
// otherwise starts one for the run. Kept out of `npm run check` because it needs a running app and takes minutes.
//
// What it checks, per state and width:
//   overflow   nothing reaches past the screen's edges
//   contrast   every visible text node is 4.5:1 against what is really behind it (3:1 for large text)
//   targets    every tappable thing is at least 44x44 (a text field counts as its whole pill)
//   type       text that wraps keeps its line height (1.2x for headings, 1.4x for body)
//   position   the mic and the question card stay put across the states of one question; the mic and the toggle sit at the same height on every screen
//   announce   states that must be said to a screen reader changed the live region; the mic's name says what it does
//   states     the four verdicts all render, and states that must look different do
//
// A failure that is already known and decided goes in scripts/check-render.known.json with its reason; it is
// listed in the report but doesn't fail the run. Anything not in that file fails it.

import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const WIDTHS = (flag('--widths') ?? '320,390,430').split(',').map(Number);
const HEIGHT = { 320: 640, 390: 844, 430: 932 };
const SHOTS = flag('--shots');
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const KNOWN = JSON.parse(fs.readFileSync(new URL('./check-render.known.json', import.meta.url), 'utf8'));

if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

// ---- the app: use the running one, or start one
async function reachable(url) {
  try {
    return (await fetch(url + '/reset')).ok;
  } catch {
    return false;
  }
}
let server = null;
let base = BASE;
if (!(await reachable(base))) {
  const port = 3917;
  base = `http://localhost:${port}`;
  console.log(`No app at ${BASE}; starting one on ${base} for this run...`);
  server = spawn('npx', ['next', 'dev', '-p', String(port)], { stdio: 'ignore' });
  for (let i = 0; i < 120 && !(await reachable(base)); i++) await new Promise((r) => setTimeout(r, 1000));
  if (!(await reachable(base))) {
    server.kill();
    console.error('The app did not start.');
    process.exit(2);
  }
}

// ---- measuring a state, inside the page
function measureInPage() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const parse = (c) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
  };
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = (c) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const shown = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width >= 1 && r.height >= 1 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('.announcer');
  };
  const out = { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, offscreen: [], contrast: [], targets: [], wrapped: [] };

  for (const el of document.querySelectorAll('body *')) {
    if (!shown(el) || parseFloat(getComputedStyle(el).opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.right > innerWidth + 0.5 || r.left < -0.5) out.offscreen.push(`${el.className || el.tagName} ${Math.round(r.left)}..${Math.round(r.right)}`);
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const el = node.parentElement;
    if (!node.nodeValue.trim() || !el || seen.has(el) || !shown(el) || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
    seen.add(el);
    let opacity = 1;
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      opacity *= parseFloat(s.opacity);
      const bg = parse(s.backgroundColor);
      if (bg.a > 0) layers.push(bg);
    }
    if (opacity === 0 || el.closest('[inert]')) continue;
    let base = { r: 0, g: 0, b: 0, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    const cs = getComputedStyle(el);
    const fgRaw = parse(cs.color);
    const fg = over({ ...fgRaw, a: fgRaw.a * opacity }, base);
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const text = node.nodeValue.trim().slice(0, 40);
    out.contrast.push({ text, size, large, ratio: Math.round(ratio(fg, base) * 100) / 100, need: large ? 3 : 4.5 });
    // Does this text wrap? Its line boxes sit at more than one height.
    const range = document.createRange();
    range.selectNodeContents(node);
    const tops = new Set([...range.getClientRects()].map((q) => Math.round(q.top)));
    const line = parseFloat(cs.lineHeight);
    if (tops.size > 1 && !Number.isNaN(line)) out.wrapped.push({ text, size, line, ratio: Math.round((line / size) * 100) / 100, heading: size >= 24 });
  }

  for (const el of document.querySelectorAll('button, a[href], input, textarea, [role=button], [role=radio]')) {
    if (!shown(el) || el.closest('[inert]')) continue;
    const box = (el.tagName === 'TEXTAREA' ? el.closest('.chatInput__field') : null) ?? el;
    const r = box.getBoundingClientRect();
    out.targets.push({ name: (el.getAttribute('aria-label') || el.innerText || el.tagName).trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) });
  }

  const top = (s) => {
    const e = document.querySelector(s);
    if (!e || !shown(e)) return null;
    return Math.round(e.getBoundingClientRect().top * 10) / 10;
  };
  const micEl = document.querySelector('.micButton');
  out.micFromBottom = micEl && shown(micEl) ? Math.round((innerHeight - micEl.getBoundingClientRect().bottom) * 10) / 10 : null;
  out.micName = micEl ? micEl.getAttribute('aria-label') : null;
  // The voice/keyboard toggle. The one above the typing bar on the result screen is left out: it sits higher by
  // design, since the typing bar takes the mic's place above the bottom bar.
  const toggleEl = [...document.querySelectorAll('.inputModeToggle')].find((e) => shown(e) && !e.closest('.result__typing'));
  out.toggleFromBottom = toggleEl ? Math.round((innerHeight - toggleEl.getBoundingClientRect().bottom) * 10) / 10 : null;
  out.pillTop = top('.topicPill');
  out.pill = document.querySelector('.statusPill')?.textContent?.trim() ?? null;
  out.announcer = document.querySelector('.announcer')?.textContent ?? '';
  out.path = location.pathname;
  return out;
}

// ---- walking the app at one width
async function walk(width) {
  const browser = await chromium.launch();
  const height = HEIGHT[width] ?? 844;
  const states = [];
  const failures = [];
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    hasTouch: true,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mobile/15E148 Safari/604.1)',
  });
  let page = await context.newPage();
  const pause = (ms) => page.waitForTimeout(ms);
  const tap = (name, role = 'button') => page.getByRole(role, { name }).first().click({ timeout: 5000 });
  const mic = () => tap(/record answer|stop and send/i);
  const go = async (p) => {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await pause(600);
  };

  async function state(name, tags = {}) {
    await pause(150);
    const m = await page.evaluate(measureInPage);
    const shot = await page.screenshot({ animations: 'disabled' });
    if (SHOTS) fs.writeFileSync(path.join(SHOTS, `${width}-${name}.png`), shot);
    states.push({ name, tags, hash: crypto.createHash('sha256').update(shot).digest('hex').slice(0, 12), ...m });
  }
  async function step(label, fn) {
    try {
      await fn();
    } catch (e) {
      failures.push({ check: 'walk', where: label, detail: String(e.message).split('\n')[0] });
    }
  }
  // The tour starts at the topic picker and the other codes skip it (their link starts the default topic), so
  // `topic` only applies to the tour. The default topic is the original cellular energetics content.
  let pickRecorded = false;
  const begin = async (code = 'tour', stopAtMic = false, topic = /^cellular energetics$/i) => {
    await go('/reset');
    if (code === 'tour') {
      await tap(/^start scripted session$/i);
      await page.waitForURL(/pick/);
      await pause(400);
      if (!pickRecorded) {
        pickRecorded = true;
        await state('pick', { announces: true });
      }
      await tap(topic);
    } else {
      await go('/s/' + code);
      await tap(/continue in browser/i);
    }
    await page.waitForURL(/start/);
    await pause(400);
    await tap(/let.s go/i);
    await page.waitForURL(/mic/);
    await pause(400);
    if (stopAtMic) return;
    await tap(/turn on/i);
    await page.waitForURL(/q\/1/);
    await pause(700);
  };
  // Mic, recording, stop, thinking: records the states on the way, ends on the result.
  const take = async (n, label, extra = {}) => {
    await mic();
    await page.waitForURL(/recording/);
    await pause(300);
    await state(`${label}-recording`, { task: `q${n}`, mic: 'task', announces: true, ...extra });
    await mic();
    await page.waitForURL(/thinking/);
    await pause(450);
    await state(`${label}-thinking`, { task: `q${n}`, mic: 'task', announces: true });
    await page.waitForURL(/result/, { timeout: 14000 });
    await pause(900);
  };

  // A: entry points and addresses that aren't screens
  await step('entry points', async () => {
    await go('/reset');
    await state('reset');
    await go('/s/zzz');
    await state('unknown-link');
    await go('/s/tour');
    await state('entry-add-to-home');
    await go('/q/6');
    await state('not-found');
    await go('/mic-off');
    await state('mic-off');
    await go('/mic-blocked');
    await state('mic-blocked', { announces: true });
    await go('/done');
    await state('done-nothing-saved');
    await go('/results');
    await state('results-with-nothing-saved-goes-home');
  });

  // B: the tour script, front to back
  await step('tour', async () => {
    await begin();
    await state('q1-idle-with-welcome', { task: 'q1', mic: 'task' });
    await tap(/^close$/i);
    await pause(600);
    await state('exit-confirm', { announces: true });
    await tap(/keep going/i);
    await pause(400);
    await mic();
    await page.waitForURL(/recording/);
    await pause(300);
    await tap(/cancel recording/i);
    await page.waitForURL(/q\/1$/);
    await pause(700);
    await state('q1-idle', { task: 'q1', mic: 'task' });
    await take(1, 'q1');
    await state('q1-result-correct', { task: 'q1', verdict: 'correct', announces: true });
    await tap(/more info/i);
    await pause(700);
    await state('q1-more-info', { announces: true });
    await tap(/close answer/i);
    await pause(400);
    await tap(/^next/i);
    await page.waitForURL(/q\/2/);
    await pause(700);
    await state('q2-idle', { task: 'q2', mic: 'task' });
    await take(2, 'q2');
    await state('q2-result-partial', { task: 'q2', mic: 'task', verdict: 'partial', announces: true });
    await tap(/reveal answer/i);
    await pause(700);
    await state('q2-reveal', { announces: true });
    await tap(/close answer/i);
    await pause(400);
    await take(2, 'q2-retry');
    await tap(/^next/i);
    await page.waitForURL(/q\/3/);
    await pause(600);
    await mic();
    await page.waitForURL(/recording/);
    await pause(300);
    await mic();
    await page.waitForURL(/thinking/);
    await pause(4600);
    await state('q3-thinking-taking-a-moment', { task: 'q3', mic: 'task' });
    await page.waitForURL(/result/, { timeout: 14000 });
    await pause(900);
    await state('q3-result-slow-timeout', { task: 'q3', mic: 'task', verdict: 'notCaught', announces: true });
    await tap(/^skip/i);
    await page.waitForURL(/q\/4/);
    await pause(600);
    for (let i = 1; i <= 3; i++) {
      await take(4, `q4-take${i}`);
      await state(`q4-result-wrong-${i}`, { task: 'q4', mic: 'task', verdict: 'wrong', announces: true });
    }
    await tap(/^next/i);
    await page.waitForURL(/q\/5/);
    await pause(600);
    await take(5, 'q5');
    await tap(/^finish/i);
    await page.waitForURL(/results/);
    await pause(1200);
    await state('results-mixed', { announces: true });
    await tap(/review all/i);
    await page.waitForURL(/q\/1/);
    await pause(700);
    for (let n = 1; n <= 5; n++) {
      await take(n, `pass2-q${n}`);
      if (n < 5) {
        await tap(/^next/i);
        await page.waitForURL(new RegExp(`q/${n + 1}`));
        await pause(500);
      } else await tap(/^finish/i);
    }
    await page.waitForURL(/results/);
    await pause(1200);
    await state('results-perfect', { announces: true });
    await tap(/^continue$/i);
    await page.waitForURL(/done/);
    await pause(700);
    await state('done-finished', { announces: true });
  });

  // C: the hint ladder, a miss, and "didn't catch that"
  await step('k7', async () => {
    await begin('k7');
    await take(1, 'k7-q1');
    await tap(/^next/i);
    await page.waitForURL(/q\/2/);
    await pause(500);
    for (let i = 1; i <= 4; i++) {
      await take(2, `k7-q2-try${i}`);
      await state(`k7-q2-hint-${i}`, { task: 'k7q2', mic: 'task', verdict: 'partial', announces: true });
    }
    await tap(/^next/i);
    await page.waitForURL(/q\/3/);
    await pause(500);
    await take(3, 'k7-q3');
    await tap(/^next/i);
    await page.waitForURL(/q\/4/);
    await pause(500);
    await take(4, 'k7-q4');
    await state('k7-q4-didnt-catch', { task: 'k7q4', mic: 'task', verdict: 'notCaught', announces: true });
  });

  // D: typing
  await step('typing', async () => {
    await begin();
    await page.getByRole('radio', { name: 'Type' }).click();
    await page.waitForURL(/type/);
    await pause(900);
    await state('type-inactive', { announces: true });
    const field = page.getByRole('textbox').first();
    await field.click();
    await pause(500);
    await state('type-focused');
    await field.fill('Enzymes speed up reactions');
    await pause(400);
    await state('type-ready-to-send');
    await field.fill('Enzymes speed up reactions by lowering the activation energy. They are proteins and each one fits only one substrate at its active site, and they work best at an ideal temperature and pH range before they denature.');
    await pause(400);
    await state('type-long-input');
  });

  // E: leaving, opting out, skipping everything, reloading mid-take, hints-only Results
  await step('leave and reload', async () => {
    await begin();
    await tap(/^close$/i);
    await pause(500);
    await tap(/^leave/i);
    await page.waitForURL(/done/);
    await pause(700);
    await state('done-left', { announces: true });
    await tap(/keep going/i);
    await pause(800);
    await mic();
    await page.waitForURL(/recording/);
    await pause(400);
    await page.reload({ waitUntil: 'networkidle' });
    await pause(800);
    await state('reload-on-recording-lands-on-question', { task: 'q1', mic: 'task' });
  });
  await step('opt out', async () => {
    await begin('tour', true);
    await state('mic-primer');
    await tap(/not now/i);
    await page.waitForURL(/mic-off/);
    await pause(700);
    await state('mic-off-from-flow');
    await tap(/no thanks/i);
    await page.waitForURL(/done/);
    await pause(700);
    await state('done-opted-out', { announces: true });
  });
  await step('skip all', async () => {
    await begin();
    for (let n = 1; n <= 5; n++) {
      await tap(/^skip/i);
      await page.waitForURL(n < 5 ? new RegExp(`q/${n + 1}`) : /results/);
      await pause(400);
    }
    await pause(900);
    await state('results-mostly-skipped', { announces: true });
  });
  // The other topics, from the picker: question 1, then every question skipped, to see their longer prompts
  // and concept names (Results) fit. Their verdicts are the same scripts as the first topic's.
  for (const [slug, name] of [['monopolies', /^monopolies$/i], ['cell-structure', /^cell structure$/i], ['american-revolution', /^american revolution$/i]]) {
    await step(`topic ${slug}`, async () => {
      await begin('tour', false, name);
      await state(`${slug}-q1`, { task: 'q1', mic: 'task' });
      for (let n = 1; n <= 5; n++) {
        await tap(/^skip/i);
        await page.waitForURL(n < 5 ? new RegExp(`q/${n + 1}`) : /results/);
        await pause(400);
      }
      await pause(900);
      await state(`${slug}-results-skipped`, { announces: true });
    });
  }
  await step('hints only', async () => {
    await begin();
    await tap(/^skip/i);
    await page.waitForURL(/q\/2/);
    await pause(500);
    await take(2, 'h-q2a');
    await take(2, 'h-q2b');
    await state('h-q2-correct-after-hint', { task: 'h2', verdict: 'correct', announces: true });
    await tap(/^next/i);
    for (let n = 3; n <= 5; n++) {
      await page.waitForURL(new RegExp(`q/${n}`));
      await pause(400);
      await tap(/^skip/i);
    }
    await page.waitForURL(/results/);
    await pause(1000);
    await state('results-hints-only', { announces: true });
  });

  // F: reduced motion
  await context.close();
  const calm = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, colorScheme: 'dark', hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  page = await calm.newPage();
  await step('reduced motion', async () => {
    await begin();
    await mic();
    await page.waitForURL(/recording/);
    await pause(700);
    await state('reduced-recording', { task: 'rm', mic: 'task' });
    await mic();
    await page.waitForURL(/thinking/);
    await pause(450);
    await state('reduced-thinking', { task: 'rm', mic: 'task' });
  });
  await browser.close();
  return { width, states, failures };
}

// ---- the checks, run on what the walk measured
const text = (s) => s.replace(/\s+/g, ' ').trim();
const knownFor = (f) => KNOWN.find((k) => k.check === f.check && (k.size === undefined || k.size === f.size) && (k.line === undefined || k.line === f.line) && (k.match === undefined || f.where?.includes(k.match)));

function check({ width, states, failures }) {
  const found = [...failures];
  const add = (check, where, detail, extra = {}) => found.push({ check, where, detail, ...extra });
  let previous = '';
  const byTask = {};

  for (const s of states) {
    if (s.scrollWidth > width + 1) add('overflow', s.name, `page is ${s.scrollWidth}px wide`);
    for (const o of s.offscreen.slice(0, 3)) add('overflow', s.name, o);
    for (const c of s.contrast) if (c.ratio < c.need) add('contrast', s.name, `"${c.text}" is ${c.ratio}:1, needs ${c.need}:1`);
    for (const t of s.targets) if (t.w < 44 || t.h < 44) add('targets', s.name, `"${t.name}" is ${t.w}x${t.h}`);
    for (const w of s.wrapped) {
      const need = w.heading ? 1.2 : 1.4;
      if (w.ratio < need) add('type', s.name, `"${w.text}" wraps at ${w.size}px on a ${w.line}px line (${w.ratio}x, needs ${need}x)`, { size: w.size, line: w.line });
    }
    if (s.tags.announces) {
      if (!s.announcer || s.announcer === previous) add('announce', s.name, 'the live region did not say anything new for this state');
      previous = s.announcer;
    }
    if (s.tags.task) (byTask[s.tags.task] ??= []).push(s);
  }

  // The mic and the question card stay put across the states of one question.
  for (const [task, list] of Object.entries(byTask)) {
    const mics = list.filter((s) => s.micFromBottom !== null);
    for (const s of mics) if (Math.abs(s.micFromBottom - mics[0].micFromBottom) > 1) add('position', s.name, `mic is ${s.micFromBottom}px from the bottom, ${mics[0].name} has it at ${mics[0].micFromBottom}px (task ${task})`);
    const pills = list.filter((s) => s.pillTop !== null);
    for (const s of pills) if (Math.abs(s.pillTop - pills[0].pillTop) > 1) add('position', s.name, `topic pill is at ${s.pillTop}px, ${pills[0].name} has it at ${pills[0].pillTop}px (task ${task})`);
  }

  if (process.env.SHOW_POSITIONS) for (const s of states) if (s.micFromBottom !== null || s.toggleFromBottom !== null) console.log(`${s.name}: mic ${s.micFromBottom}, toggle ${s.toggleFromBottom}`);
  // The mic and the toggle sit at the same height on every screen that has them, not only within one question.
  for (const key of ['micFromBottom', 'toggleFromBottom']) {
    const all = states.filter((s) => s[key] !== null);
    // A check that never saw the thing it measures would pass without checking anything.
    if (all.length < 3) add('position', key, `only ${all.length} states had a ${key === 'micFromBottom' ? 'mic' : 'toggle'} to measure`);
    for (const s of all) if (Math.abs(s[key] - all[0][key]) > 1) add('position', s.name, `${key === 'micFromBottom' ? 'mic' : 'toggle'} is ${s[key]}px from the bottom, ${all[0].name} has it at ${all[0][key]}px`);
  }

  // While listening, the mic's name says it stops the take.
  const idle = states.find((s) => s.name === 'q1-idle');
  const listening = states.find((s) => s.name === 'q1-recording');
  if (idle && listening && idle.micName === listening.micName) add('announce', 'q1-recording', `the mic is still named "${listening.micName}" while listening`);

  // The four verdicts all render, and states that must look different do.
  const pills = new Set(states.map((s) => s.pill).filter(Boolean));
  for (const label of ['Correct', 'Almost there', 'Try again', 'Didn’t catch that']) if (![...pills].some((p) => text(p) === label)) add('states', 'verdicts', `no state shows the "${label}" pill`);
  const same = (a, b) => {
    const x = states.find((s) => s.name === a);
    const y = states.find((s) => s.name === b);
    if (x && y && x.hash === y.hash) add('states', `${a} / ${b}`, 'look identical but must differ');
  };
  same('q1-idle', 'q1-recording');
  same('q1-recording', 'q1-thinking');
  same('q1-idle', 'q1-thinking');
  same('q3-thinking-taking-a-moment', 'q3-result-slow-timeout');

  return found;
}

// ---- run, report
const results = await Promise.all(WIDTHS.map(walk));
if (server) server.kill();

let failed = 0;
for (const r of results) {
  const found = check(r);
  const known = [];
  const real = [];
  for (const f of found) {
    const k = f.check === 'walk' ? null : knownFor(f);
    if (k) known.push({ ...f, reason: k.reason });
    else real.push(f);
  }
  // The same problem often shows in many states (a recording hint is on every recording screen), so it counts once.
  const once = (list) => {
    const seen = new Set();
    return list.filter((f) => {
      const key = `${f.check}|${f.detail}`;
      return seen.has(key) ? false : seen.add(key);
    });
  };
  const realOnce = once(real);
  const knownOnce = once(known);
  console.log(`\n${r.width}px: ${r.states.length} states checked, ${realOnce.length} failing, ${knownOnce.length} known`);
  for (const f of realOnce) console.log(`  FAIL ${f.check.padEnd(9)} ${f.where}: ${f.detail}`);
  for (const f of knownOnce) console.log(`  known ${f.check.padEnd(8)} ${f.where}: ${f.detail}\n        (${f.reason})`);
  failed += realOnce.length;
}
console.log(failed === 0 ? '\nPassed.' : `\n${failed} failing.`);
process.exit(failed === 0 ? 0 : 1);
