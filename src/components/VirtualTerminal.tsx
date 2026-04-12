/**
 * VirtualTerminal.tsx
 *
 * Key architecture decisions:
 * - Component is ALWAYS mounted (parent never conditionally renders it).
 * - isVisible prop controls display via CSS only — no state is ever lost.
 * - All tab/history state lives here in useRef (plus useState for re-renders).
 * - Typewriter: pending queue → history, one line every LINE_DELAY ms.
 *   Each output line also types characters individually via <TypeLine>.
 * - Auto-scroll: fires on every history/pending change.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ViewMode } from '../types';
import { useViewMode } from '../context/ViewModeContext';
import portfolioImg from '../assets/portfolio1.png';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface TerminalLine {
  id:      string;
  type:    'output' | 'command' | 'element';
  text?:   string;
  element?: React.ReactNode;
}
interface Tab {
  id:               string;
  label:            string;
  history:          TerminalLine[];
  pending:          TerminalLine[];   // drip queue
  cmdHistory:       string[];
  cmdHistoryIndex:  number;
  cwd:              string;
  context:          'main' | 'socials';
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
let _uid = 0;
const uid    = ()                   => `t${++_uid}`;
const mkOut  = (t: string)          : TerminalLine => ({ id: uid(), type: 'output',  text: t });
const mkCmd  = (t: string)          : TerminalLine => ({ id: uid(), type: 'command', text: t });
const mkElem = (e: React.ReactNode) : TerminalLine => ({ id: uid(), type: 'element', element: e });

const LINE_DELAY = 45;   // ms between drip lines
const CHAR_SPEED = 11;   // ms per character in TypeLine

// ─────────────────────────────────────────────────────────────────────────────
// TYPEWRITER CHARACTER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function TypeLine({ text, speed = CHAR_SPEED }: { text: string; speed?: number }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    if (!text) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return <>{colorize(shown)}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNTAX COLOURING (no blur — pure colour)
// ─────────────────────────────────────────────────────────────────────────────
function colorize(text: string): React.ReactNode {
  if (!text) return null;
  const GREEN  = '#34d399';
  const ORANGE = '#f97316';
  const CYAN   = '#67e8f9';
  const BLUE   = '#93c5fd';

  const parts = text.split(/(Gaurav|gaurav|'[^']*'|"[^"]*"|\/[\S]+|\[.*?\])/g);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        if (p === 'Gaurav' || p === 'gaurav')       return <span key={i} style={{ color: ORANGE }}>{p}</span>;
        if (p.startsWith("'") || p.startsWith('"')) return <span key={i} style={{ color: BLUE }}>{p}</span>;
        if (p.startsWith('/'))                       return <span key={i} style={{ color: CYAN }}>{p}</span>;
        if (p.startsWith('[') && p.endsWith(']'))    return <span key={i} style={{ color: GREEN }}>{p}</span>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WHOAMI — loading bar → scanline row-by-row photo reveal over 5 s
// ─────────────────────────────────────────────────────────────────────────────
const BAR_STEPS = 20;
const BAR_DURATION_MS = 3000;

function ProfileRender() {
  const [barFilled, setBarFilled] = useState(0);
  const [showPhoto, setShowPhoto] = useState(false);
  const [scanRow,   setScanRow]   = useState(0);

  const SCAN_ROWS   = 16;
  const SCAN_DELAY  = (5000 - BAR_DURATION_MS) / SCAN_ROWS;

  useEffect(() => {
    // Phase 1: fill progress bar
    let s = 0;
    const barIv = setInterval(() => {
      s++;
      setBarFilled(s);
      if (s >= BAR_STEPS) {
        clearInterval(barIv);
        // Phase 2: scanline reveal
        setShowPhoto(true);
        let row = 0;
        const scanIv = setInterval(() => {
          row++;
          setScanRow(row);
          if (row >= SCAN_ROWS) clearInterval(scanIv);
        }, SCAN_DELAY);
      }
    }, BAR_DURATION_MS / BAR_STEPS);
    return () => clearInterval(barIv);
  }, []);

  const bar = '[' + '='.repeat(barFilled) + '-'.repeat(BAR_STEPS - barFilled) + ']';
  const pct = Math.round((barFilled / BAR_STEPS) * 100);
  const revealFraction = scanRow / SCAN_ROWS; // 0 → 1

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {/* Progress bar */}
      {!showPhoto && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', marginBottom: '0.6rem' }}>
          <span style={{ color: '#34d399' }}>{bar}</span>
          <span style={{ color: '#9ca3af', marginLeft: '0.75rem' }}>{pct}%  rendering profile…</span>
        </div>
      )}

      {/* Photo + bio revealed by scanlines */}
      {showPhoto && (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Scanline-revealed image */}
          <div style={{
            position: 'relative', width: 140, height: 140, flexShrink: 0,
            borderRadius: 8, overflow: 'hidden',
            border: '2px solid #34d399',
            boxShadow: '0 0 20px rgba(52,211,153,0.4)',
          }}>
            {/* Actual photo — clipped by reveal fraction */}
            <img
              src={portfolioImg}
              alt="Gaurav Habad"
              style={{
                width: 140, height: 140,
                objectFit: 'cover', objectPosition: 'top center',
                display: 'block',
                clipPath: `inset(0 0 ${Math.round((1 - revealFraction) * 100)}% 0)`,
                transition: `clip-path ${SCAN_DELAY}ms linear`,
              }}
            />
            {/* Scanline shimmer on unrevealed area */}
            {revealFraction < 1 && (
              <div style={{
                position: 'absolute',
                top:    `${Math.round(revealFraction * 100)}%`,
                left: 0, right: 0, bottom: 0,
                backgroundImage: 'repeating-linear-gradient(0deg,rgba(52,211,153,0.18) 0px,rgba(52,211,153,0.18) 1px,transparent 1px,transparent 3px)',
                pointerEvents: 'none',
              }} />
            )}
          </div>

          {/* Bio — fade in once fully revealed */}
          <div style={{ flex: 1, minWidth: 180, opacity: revealFraction, transition: 'opacity 0.5s ease' }}>
            <div style={{ color: '#f97316', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>
              Gaurav Habad
            </div>
            <div style={{ color: '#34d399', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              Senior Backend Engineer · 4 Years 1 Month
            </div>
            {[
              '⚡ Expert in Distributed Systems & Microservices',
              '🏗  Java 17 · Spring Boot 3 · Python · SQL',
              '☁  AWS · GCP · Docker · Kubernetes',
              '🔧 Kafka · Redis · CI/CD · Cloud Gaming',
              '📍 Currently @ Sakha Global — Tech Lead',
            ].map((line, i) => (
              <div key={i} style={{
                fontSize: '0.79rem', color: '#e8e8e8',
                marginBottom: '0.18rem',
                opacity: 0, animation: `fadeInLine 0.3s ${0.3 + i * 0.12}s forwards`,
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT DATA — all output is plain text lines (no JSX) so typewriter works
// ─────────────────────────────────────────────────────────────────────────────
const LS_LINES = [
  'About',
  'Experience',
  'Skills',
  'Projects',
  'Socials',
  'Education',
  'Work',
];

const ABOUT_LINES = [
  '── About Gaurav Habad ───────────────────────────────────',
  '',
  'Senior Backend Developer | 4 Years 1 Month Experience',
  'Expert in Distributed Systems & Microservices Architecture.',
  '',
  'Building high-performance REST APIs and event-driven',
  'systems serving 100K+ requests/day.',
  '',
  'Key achievements:',
  '  · 40% API latency reduction via Redis caching',
  '  · 99.8% login success rate at 5K+ concurrent users',
  '  · Led architecture review & zero-downtime migrations',
];

const EDU_LINES = [
  '── Education Journey ────────────────────────────────────',
  '',
  '  🏫  [2016–2018]  10th Grade — CBSE',
  '       └─ Vidya Niketan English Medium School, Nagpur',
  '       └─ Result : Distinction',
  '',
  '  📗  [2018–2020]  12th Grade — CBSE · PCM Stream',
  '       └─ Shri Shivaji Junior College, Nagpur',
  '       └─ Result : 88.4%  |  95/100 in Mathematics',
  '',
  '  🎓  [2020–2024]  B.Tech — Computer Science & Engineering',
  '       └─ Dr. Babasaheb Ambedkar Technological University',
  '       └─ Nagpur, Maharashtra  |  First Division',
  '       └─ Year 1  → DSA, first REST API (Java Servlets)',
  '       └─ Year 2  → DBMS, OS internals, competitive coding',
  '       └─ Year 3  → Microservices, capstone team lead (×4)',
  '       └─ Year 4  → Real-time chat (WebSockets + Redis)',
  '       └─ Campus placement → Backend Engineer ✓',
  '',
  '  🚀  [2021→Now]  Professional Track',
  '       └─ Backend Engineer → Mid-Level → Senior Dev',
  '       └─ Tech Lead @ Sakha Global',
  '       └─ Open-source: github.com/decypher0',
];

const WORK_LINES = [
  '── Work Experience ──────────────────────────────────────',
  '',
  'Role     : Backend Developer',
  'Tenure   : 4 Years 1 Month',
  'Level    : Senior Backend Developer (Tech Lead)',
  'Expertise: Distributed Systems & Microservices',
  'Stack    : Java · Python · SQL · Cloud Gaming setups',
  '',
  'Timeline:',
  '  [2021]     Backend Engineer — Java, Spring Boot, MySQL',
  '  [2022]     Mid-Level Eng.  — Kafka, Redis, Docker, AWS',
  '  [2023]     Senior Dev.     — Kubernetes, Terraform, GCP',
  '  [2024→Now] Tech Lead       — Architecture & mentoring',
  '',
  'Key Achievements:',
  '  · 100K+ req/day microservices, <120ms p99 latency',
  '  · API latency -60% via distributed Redis caching',
  '  · CI/CD pipelines cut deploy time 40% (GitHub Actions)',
  '  · Introduced Kafka; decoupled 6 monolithic services',
  '  · Mentored 3 junior engineers | 30+ code reviews/sprint',
  '  · Zero-downtime multi-tenant SaaS migrations',
];

const SKILLS_LINES = [
  '── Technical Skills ─────────────────────────────────────',
  '',
  'Languages   : Java 17 · Python · TypeScript · Go · SQL',
  'Frameworks  : Spring Boot 3 · FastAPI · Express · React',
  'Cloud/DevOps: AWS · GCP · Docker · Kubernetes · Terraform',
  'Data Stores : PostgreSQL · MongoDB · Redis · Kafka · ES',
  'Tools       : Git · GitHub Actions · ArgoCD · Postman',
];

const PROJECTS_LINES = [
  '── Featured Projects ────────────────────────────────────',
  '',
  '▸ Real-time Chat Platform',
  '  Stack : WebSockets · Redis pub/sub · Spring Boot',
  '  Info  : Rooms, presence indicators, message history',
  '',
  '▸ Multi-tenant SaaS Backend',
  '  Stack : Java · PostgreSQL · Kafka · Docker',
  '  Info  : Row-level isolation, event sourcing, zero-dt',
  '',
  '▸ API Gateway & Auth Service',
  '  Stack : Spring Cloud · JWT · OAuth2 · Redis',
  '  Info  : 99.8% uptime, 40% latency reduction',
];

const SOCIALS_LINES = [
  '── Social Links ─────────────────────────────────────────',
  '',
  '  [a]  LinkedIn → https://linkedin.com/in/gaurav-habad-2aa064131/',
  '  [b]  GitHub   → https://github.com/decypher0',
  '  [c]  Email    → gauravhabad113@gmail.com',
  '',
  "Type a / b / c to open.  Type 'back' to return.",
];

const HELP_LINES = [
  '┌─ Commands ──────────────────────────────────────────────┐',
  '│  ls          List available sections                    │',
  '│  about       About me & professional summary            │',
  '│  experience  Work history log                           │',
  '│  work        Alias: same as experience                  │',
  '│  skills      Technical skill matrix                     │',
  '│  projects    Featured projects                          │',
  '│  education   Education journey (ASCII timeline)         │',
  '│  socials     Social media links                         │',
  '│  whoami      Profile render (5-second animation)        │',
  '│  date        Current date & time                        │',
  '│  pwd         Current directory                          │',
  '│  cd [dir]    Change working directory                   │',
  '│  clear       Clear terminal output                      │',
  '└─────────────────────────────────────────────────────────┘',
];

// ─────────────────────────────────────────────────────────────────────────────
// SOCIALS MENU (JSX element for quick links)
// ─────────────────────────────────────────────────────────────────────────────
function SocialsMenu() {
  return (
    <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {[
        { key: 'a', label: 'LinkedIn', url: 'https://www.linkedin.com/in/gaurav-habad-2aa064131/', color: '#60a5fa' },
        { key: 'b', label: 'GitHub',   url: 'https://github.com/decypher0',                        color: '#e8e8e8' },
        { key: 'c', label: 'Email',    url: 'mailto:gauravhabad113@gmail.com',                      color: '#f97316' },
      ].map(s => (
        <div key={s.key} style={{ fontSize: '0.86rem' }}>
          <span style={{ color: '#818cf8', marginRight: '0.6rem' }}>[{s.key}]</span>
          <a href={s.url} target="_blank" rel="noopener noreferrer"
            style={{ color: s.color, textDecoration: 'none', fontWeight: 500 }}>
            {s.label}
          </a>
        </div>
      ))}
      <div style={{ color: '#9ca3af', fontSize: '0.74rem', marginTop: '0.1rem' }}>
        Type a / b / c to open · 'back' to return
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMAND PROCESSOR
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_CMDS = [
  'ls','about','experience','work','skills','projects',
  'education','edu','socials','whoami','date','pwd','help','hi','hello',
];

function processCommand(
  cmd: string,
  tab: Tab,
  _setMode: (m: ViewMode) => void,
): {
  immediate: TerminalLine[];
  pending:   TerminalLine[];
  cwd?:      string;
  context?:  Tab['context'];
} {
  const parts = cmd.trim().split(/\s+/).filter(Boolean);
  const base  = (parts[0] ?? '').toLowerCase();
  const arg1  = (parts[1] ?? '').toLowerCase();

  const imm: TerminalLine[] = [];
  const pnd: TerminalLine[] = [];
  let cwd     = tab.cwd;
  let context = tab.context;

  // ── socials sub-shell ──
  if (tab.context === 'socials') {
    const urls: Record<string, string> = {
      a: 'https://www.linkedin.com/in/gaurav-habad-2aa064131/',
      b: 'https://github.com/decypher0',
      c: 'mailto:gauravhabad113@gmail.com',
    };
    if (urls[base]) {
      window.open(urls[base], '_blank');
      pnd.push(mkOut(`↗  Opening ${base === 'a' ? 'LinkedIn' : base === 'b' ? 'GitHub' : 'email'}…`));
      context = 'main';
    } else if (base === 'back' || base === 'exit') {
      pnd.push(mkOut('← Back to main shell.'));
      context = 'main';
    } else {
      pnd.push(mkOut("Type a / b / c to open, or 'back' to return."));
    }
    return { immediate: imm, pending: pnd, cwd, context };
  }

  // ── RULE: every content command resets cwd to ~/ ──
  if (cwd !== '~' && CONTENT_CMDS.includes(base)) {
    cwd = '~';
  }

  switch (base) {
    case 'clear':
      return { immediate: [], pending: [], cwd: '~', context };

    case 'pwd':
      pnd.push(mkOut('/home/gaurav/portfolio' + (cwd === '~' ? '' : '/' + cwd.replace('~/', ''))));
      break;

    case 'ls':
      LS_LINES.forEach((l, i) =>
        pnd.push(mkOut(`  ${i + 1}.  ${l}`))
      );
      pnd.push(mkOut(''));
      pnd.push(mkOut("Run any section name (e.g. 'about', 'skills', 'whoami')."));
      break;

    case 'about':
      cwd = '~/about';
      ABOUT_LINES.forEach(l => pnd.push(mkOut(l)));
      break;

    case 'experience':
    case 'work':
      cwd = '~/experience';
      WORK_LINES.forEach(l => pnd.push(mkOut(l)));
      break;

    case 'skills':
      cwd = '~/skills';
      SKILLS_LINES.forEach(l => pnd.push(mkOut(l)));
      break;

    case 'projects':
      cwd = '~/projects';
      PROJECTS_LINES.forEach(l => pnd.push(mkOut(l)));
      break;

    case 'education':
    case 'edu':
      cwd = '~/education';
      EDU_LINES.forEach(l => pnd.push(mkOut(l)));
      break;

    case 'socials':
      cwd = '~/socials';
      context = 'socials';
      imm.push(mkElem(<SocialsMenu />));
      SOCIALS_LINES.forEach(l => pnd.push(mkOut(l)));
      break;

    case 'whoami':
      pnd.push(mkOut('[SYSTEM] Initializing biometric render…'));
      imm.push(mkElem(<ProfileRender />));
      break;

    case 'date':
      pnd.push(mkOut(new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' })));
      break;

    case 'help':
      HELP_LINES.forEach(l => pnd.push(mkOut(l)));
      break;

    case 'hi':
    case 'hello':
      pnd.push(mkOut("Hey! 👋  Type 'help' to see all commands, or 'ls' to explore."));
      break;

    case 'cd':
      if (!arg1 || arg1 === '~' || arg1 === '/') {
        cwd = '~';
        pnd.push(mkOut('Now at ~/'));
      } else if (['about','experience','work','skills','projects','education','edu'].includes(arg1)) {
        cwd = `~/${arg1 === 'edu' ? 'education' : arg1}`;
        pnd.push(mkOut(`Entered ${cwd}  — run '${arg1}' to load content.`));
      } else if (arg1 === 'socials') {
        cwd = '~/socials';
        context = 'socials';
        imm.push(mkElem(<SocialsMenu />));
        SOCIALS_LINES.forEach(l => pnd.push(mkOut(l)));
      } else {
        pnd.push(mkOut(`cd: ${arg1}: no such directory`));
      }
      break;

    default: {
      const all = ['ls','about','experience','work','skills','projects','education','edu',
        'socials','whoami','date','help','hi','hello','cd','clear','pwd'];
      const guess = all.find(c => c !== base && c.startsWith(base.slice(0, 3)));
      if (guess) pnd.push(mkOut(`command not found: '${cmd}' — did you mean '${guess}'?`));
      else       pnd.push(mkOut(`command not found: '${cmd}' — type 'help' for a list.`));
    }
  }

  return { immediate: imm, pending: pnd, cwd, context };
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function TabButton({ tab, isActive, onClick, onClose }: {
  tab: Tab; isActive: boolean; onClick: () => void; onClose: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '0.3rem 0.7rem',
        background: isActive ? '#171717' : 'transparent',
        borderRight: '1px solid #333',
        cursor: 'pointer', userSelect: 'none',
        fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
        color: isActive ? '#ffffff' : '#9ca3af',
        minWidth: 88, maxWidth: 150, flexShrink: 0,
        transition: 'background 0.1s',
      }}
    >
      <span style={{ color: '#34d399' }}>$</span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {tab.label}
      </span>
      <span
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="tab-close-btn"
        style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer', padding: '0 2px' }}
      >✕</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB BODY — NEVER returns null; uses display:none for inactive tabs
// ─────────────────────────────────────────────────────────────────────────────
function TabBody({ tab, isActive, onTabUpdate }: {
  tab: Tab; isActive: boolean; onTabUpdate: (u: Partial<Tab>) => void;
}) {
  const { setMode } = useViewMode();
  const [input,    setInput]    = useState('');
  const [localIdx, setLocalIdx] = useState(-1);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prompt   = `gaurav@portfolio:${tab.cwd}$ `;

  // Auto-scroll — smooth, fires on every line change
  const scroll = useCallback(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);
  useEffect(scroll, [tab.history, tab.pending, scroll]);

  // Focus when active
  useEffect(() => { if (isActive) inputRef.current?.focus(); }, [isActive]);

  // Drip-queue: pop one pending line into history every LINE_DELAY ms
  useEffect(() => {
    if (!tab.pending.length) return;
    const t = setTimeout(() => {
      const [next, ...rest] = tab.pending;
      onTabUpdate({ history: [...tab.history, next], pending: rest });
    }, LINE_DELAY);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab.pending]);

  const submit = (cmd: string) => {
    if (!cmd) return;
    const cmdLine = mkCmd(cmd);

    if (cmd.toLowerCase() === 'clear') {
      onTabUpdate({
        history: [], pending: [],
        cwd: '~', label: '~ bash',
        cmdHistory: [cmd, ...tab.cmdHistory],
        cmdHistoryIndex: -1,
      });
      return;
    }

    const res    = processCommand(cmd, tab, setMode);
    const newCwd = res.cwd ?? tab.cwd;
    onTabUpdate({
      history:         [...tab.history, cmdLine, ...res.immediate],
      pending:         [...tab.pending, ...res.pending],
      cwd:             newCwd,
      label:           newCwd === '~' ? '~ bash' : newCwd,
      context:         res.context ?? tab.context,
      cmdHistory:      [cmd, ...tab.cmdHistory],
      cmdHistoryIndex: -1,
    });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      const idx = Math.min(localIdx + 1, tab.cmdHistory.length - 1);
      setLocalIdx(idx); setInput(tab.cmdHistory[idx] ?? ''); return;
    }
    if (e.key === 'ArrowDown') {
      const idx = Math.max(localIdx - 1, -1);
      setLocalIdx(idx); setInput(idx === -1 ? '' : tab.cmdHistory[idx] ?? ''); return;
    }
    if (e.key !== 'Enter') return;
    const cmd = input.trim();
    setInput(''); setLocalIdx(-1);
    submit(cmd);
  };

  return (
    <div
      ref={bodyRef}
      onClick={() => inputRef.current?.focus()}
      style={{
        // KEY: display:none instead of conditional rendering — preserves all state
        display:        isActive ? 'flex' : 'none',
        flexDirection:  'column',
        flex:           1,
        overflowY:      'auto',
        padding:        '1rem 1.25rem',
        fontFamily:     'var(--font-mono)',
        fontSize:       '0.875rem',
        lineHeight:     1.72,
        color:          '#e8e8e8',
        cursor:         'text',
        scrollBehavior: 'smooth',
      }}
    >
      {/* Welcome message — shown on fresh tab */}
      {tab.history.length === 0 && tab.pending.length === 0 && (
        <div style={{ color: '#34d399', marginBottom: '0.7rem' }}>
          <TypeLine
            text="Hey! I'm Gaurav — Senior Backend Engineer. Type 'help' to see commands."
            speed={16}
          />
        </div>
      )}

      {/* Rendered history */}
      <div>
        {tab.history.map(line => {
          if (line.type === 'command') return (
            <div key={line.id} style={{ marginTop: '0.8rem', marginBottom: '0.15rem', display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <span style={{ color: '#34d399', userSelect: 'none', flexShrink: 0 }}>{prompt}</span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{line.text}</span>
            </div>
          );
          if (line.type === 'element') return (
            <div key={line.id} style={{ marginBottom: '0.35rem' }}>{line.element}</div>
          );
          // output — typewriter character effect
          return (
            <div key={line.id} style={{ marginBottom: '0.04rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <TypeLine text={line.text ?? ''} />
            </div>
          );
        })}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.45rem' }}>
        <span style={{ color: '#34d399', userSelect: 'none', flexShrink: 0, marginRight: '0.3rem' }}>
          {prompt}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          type="text"
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#ffffff', fontFamily: 'inherit', fontSize: 'inherit',
            caretColor: '#34d399',
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB FACTORY
// ─────────────────────────────────────────────────────────────────────────────
function makeTab(label = '~ bash'): Tab {
  return {
    id: uid(), label,
    history: [], pending: [],
    cmdHistory: [], cmdHistoryIndex: -1,
    cwd: '~', context: 'main',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VIRTUAL TERMINAL WINDOW
// Props:
//   isVisible  — CSS-level show/hide (parent never unmounts this component)
//   anchorRect — position of the trigger button (for scale-from animation)
//   onClose    — called when user clicks ✕ or backdrop
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  isVisible:  boolean;
  anchorRect: DOMRect | null;
  onClose:    () => void;
}

export default function VirtualTerminal({ isVisible, anchorRect, onClose }: Props) {
  const [tabs,      setTabs]    = useState<Tab[]>([makeTab()]);
  const [activeTab, setActiveTab] = useState(0);

  // Drag
  const [pos,      setPos]      = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  // Animation state machine
  // 'closed'     → display:none, component mounted (history preserved)
  // 'opening'    → animating from anchorRect → centre  (open)
  // 'open'       → fully visible at centre
  // 'minimizing' → animating from centre → anchorRect (minimize / close)
  // 'closing'    → same path, used for red-button close
  const [anim, setAnim] = useState<'closed' | 'opening' | 'open' | 'minimizing' | 'closing'>('closed');
  const prevVisible = useRef(false);

  // Minimizing → header button (macOS dock effect) then hide
  const handleMinimize = useCallback(() => {
    setAnim('minimizing');
    // After animation flies to anchorRect, tell parent to set isVisible=false
    // Component stays mounted → all history/tabs preserved
    setTimeout(onClose, 420);
  }, [onClose]);

  // Hard close (red button)
  const handleClose = useCallback(() => {
    setAnim('closing');
    setTimeout(onClose, 360);
  }, [onClose]);

  // React to parent toggling isVisible
  useEffect(() => {
    if (isVisible && !prevVisible.current) {
      // Opening (or restoring from minimize): fly from anchorRect → centre
      setAnim('opening');
      const t = setTimeout(() => setAnim('open'), 20);
      prevVisible.current = true;
      return () => clearTimeout(t);
    }
    if (!isVisible && prevVisible.current) {
      // Parent hid us (e.g. toggle button while open) — run close animation
      if (anim === 'open') {
        setAnim('closing');
        setTimeout(() => setAnim('closed'), 360);
      } else {
        setAnim('closed');
      }
      prevVisible.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  // The "dock" position — header Terminal button, scaled to a dot
  const dockTransform = (() => {
    if (!anchorRect) return 'translate(-50%, -50%) scale(0.04)';
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const ox = anchorRect.left + anchorRect.width  / 2 - cx;
    const oy = anchorRect.top  + anchorRect.height / 2 - cy;
    // Scale to near-zero AND move to the button's position
    return `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) scale(0.04)`;
  })();

  // Drag mouse listeners
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging || !dragRef.current) return;
      setPos({
        x: dragRef.current.px + e.clientX - dragRef.current.mx,
        y: dragRef.current.py + e.clientY - dragRef.current.my,
      });
    };
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [dragging]);

  const startDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.traffic-light')) return;
    setDragging(true);
    dragRef.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  };

  const addTab = () => {
    const t = makeTab(`~ bash ${tabs.length + 1}`);
    setTabs(p => [...p, t]);
    setActiveTab(tabs.length);
  };

  const closeTab = (i: number) => {
    if (tabs.length === 1) { onClose(); return; }
    setTabs(p => p.filter((_, idx) => idx !== i));
    setActiveTab(p => Math.max(0, p >= i ? p - 1 : p));
  };

  const updateTab = (i: number, partial: Partial<Tab>) => {
    setTabs(p => p.map((t, idx) => idx === i ? { ...t, ...partial } : t));
  };

  const isMobile = window.innerWidth < 680;

  // display:none only when fully closed — never unmounts children
  const wrapperDisplay = anim === 'closed' ? 'none' : 'block';

  // Transform: centre when open, dockTransform otherwise
  const isOpen = anim === 'open';
  const winTransform = isOpen
    ? `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(1)`
    : dockTransform;

  const winOpacity = isOpen ? 1 : 0;

  // Transition curves
  let winTransition: string | undefined;
  if (anim === 'opening') {
    // Spring open from dock button
    winTransition = 'transform 0.48s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease';
  } else if (anim === 'minimizing') {
    // Genie-collapse to dock: faster shrink, ease-in
    winTransition = 'transform 0.42s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.28s ease-in';
  } else if (anim === 'closing') {
    // Sharp close
    winTransition = 'transform 0.34s cubic-bezier(0.6, 0, 0.8, 0), opacity 0.22s ease-in';
  } else if (dragging) {
    winTransition = 'none';
  }

  return (
    // Wrapper — display:none hides completely when 'closed', no layout impact
    <div style={{ display: wrapperDisplay }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        9998,
          background:    'rgba(0,0,0,0.52)',
          backdropFilter:'blur(3px)',
          opacity:       anim === 'open' ? 1 : 0,
          transition:    'opacity 0.28s ease',
          pointerEvents: anim === 'open' ? 'auto' : 'none',
        }}
      />

      {/* Terminal Window — fixed, high z-index, NO layout impact */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:      'fixed',
          top:           '50%',
          left:          '50%',
          zIndex:        9999,
          width:         isMobile ? '98vw' : 'min(940px, 92vw)',
          height:        'min(640px, 86vh)',
          background:    '#171717',
          borderRadius:  12,
          border:        '1px solid #2a2a2a',
          boxShadow:     '0 32px 90px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)',
          display:       'flex',
          flexDirection: 'column',
          overflow:      'hidden',
          fontFamily:    'var(--font-mono)',
          userSelect:    dragging ? 'none' : 'auto',
          transform:     winTransform,
          opacity:       winOpacity,
          transition:    winTransition,
          transformOrigin: 'center center',
        }}
      >
        {/* ── Title bar ─────────────────────────────────────── */}
        <div
          onMouseDown={startDrag}
          style={{
            background:    '#1e1e1e',
            borderBottom:  '1px solid #2a2a2a',
            flexShrink:    0,
            cursor:        dragging ? 'grabbing' : 'grab',
            display:       'flex',
            flexDirection: 'column',
          }}
        >
          {/* Traffic lights + title */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0.52rem 1rem', gap: '0.75rem' }}>
            <div className="traffic-light" style={{ display: 'flex', gap: '7px' }}>
              {/* Red — close: fly to dock */}
              <button onClick={handleClose} className="tl-btn tl-red" title="Close"
                style={{ width:13,height:13,borderRadius:'50%',background:'#ff5f56',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0 }}>
                <span className="tl-icon">✕</span>
              </button>
              {/* Yellow — minimize: fly to header Terminal button */}
              <button onClick={handleMinimize} className="tl-btn tl-yellow" title="Minimize to header"
                style={{ width:13,height:13,borderRadius:'50%',background:'#ffbd2e',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0 }}>
                <span className="tl-icon">−</span>
              </button>
              {/* Green — full height restore (cosmetic) */}
              <button className="tl-btn tl-green" title="Full size"
                style={{ width:13,height:13,borderRadius:'50%',background:'#27c93f',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0 }}>
                <span className="tl-icon">⤢</span>
              </button>
            </div>
            <div style={{ flex:1,textAlign:'center',fontSize:'0.74rem',color:'#9ca3af',userSelect:'none' }}>
              gaurav@portfolio — bash — {tabs[activeTab]?.cwd ?? '~'}
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display:'flex',alignItems:'stretch',borderTop:'1px solid #2a2a2a',overflowX:'auto',flexShrink:0 }}>
            {tabs.map((tab, i) => (
              <TabButton key={tab.id} tab={tab} isActive={i === activeTab}
                onClick={() => setActiveTab(i)} onClose={() => closeTab(i)} />
            ))}
            <button onClick={addTab} className="new-tab-btn" title="New tab"
              style={{ padding:'0.3rem 0.7rem',background:'transparent',border:'none',color:'#9ca3af',cursor:'pointer',fontSize:'1rem',lineHeight:1 }}>
              +
            </button>
          </div>
        </div>

        {/* ── Body — always flex, state never lost ── */}
        <div style={{ flex:1,display:'flex',overflow:'hidden' }}>
          {tabs.map((tab, i) => (
            <TabBody
              key={tab.id}
              tab={tab}
              isActive={i === activeTab}
              onTabUpdate={partial => updateTab(i, partial)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
