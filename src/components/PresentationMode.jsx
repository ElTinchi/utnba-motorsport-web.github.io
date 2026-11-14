import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import '../styles/presentation.css';

const PAN_SPEED = 360; // px per second when gliding through a whole page
const SETTLE = 1.4; // seconds for a lazy route to mount before moving
const MOVE = 1.6; // seconds to glide to a focused element
const ease = p => p * p * (3 - 2 * p);

// Stand loop (~3 min). `pan` glides top→bottom; `focus` centers every match in turn.
const SCRIPT = [
  { path: ROUTES.home, pan: true },
  { path: ROUTES.aboutFormulaStudent, focus: '.fs-explainer', hold: 8 },
  { path: ROUTES.aboutFormulaStudent, focus: '.fs-event:has(.fs-anim)', hold: 9.5 },
  { path: ROUTES.car, pan: true },
  { path: ROUTES.team, pan: true },
  { path: ROUTES.sponsors, pan: true },
];

const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
const scrollToY = y => window.scrollTo({ top: Math.max(0, Math.min(maxScroll(), y)), behavior: 'instant' });

export default function PresentationMode() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // navigate changes identity on every route change; the loop must not restart (and exit fullscreen) then.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const bar = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    const root = document.documentElement;
    root.classList.add('is-presenting');
    let raf = 0, last = 0, step = -1, sub = 0, clock = 0, stepStart = 0, from = 0, duration = 0, hold = 0, moving = false;

    const enter = index => {
      step = index % SCRIPT.length;
      sub = 0; stepStart = clock; moving = false;
      navigateRef.current(SCRIPT[step].path);
    };
    const next = () => {
      const s = SCRIPT[step];
      if (s.focus && sub + 1 < document.querySelectorAll(s.focus).length) { sub++; stepStart = clock - SETTLE; moving = false; return; }
      enter(step + 1);
    };
    const tick = now => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      if (!pausedRef.current) clock += dt;
      const s = SCRIPT[step];
      const local = clock - stepStart - SETTLE;
      if (local >= 0) {
        if (s.pan) {
          if (!moving) { moving = true; from = scrollY; duration = Math.max(4, (maxScroll() - from) / PAN_SPEED); }
          const p = Math.min(1, local / duration);
          scrollToY(from + (maxScroll() - from) * ease(p));
          if (local > duration + 1.5) enter(step + 1);
        } else {
          const el = document.querySelectorAll(s.focus)[sub];
          if (!el) { if (local > 4) enter(step + 1); }
          else {
            if (!moving) { moving = true; from = scrollY; hold = s.hold; }
            const box = el.getBoundingClientRect();
            const target = box.top + scrollY - Math.max(80, (innerHeight - box.height) / 2);
            scrollToY(from + (target - from) * ease(Math.min(1, local / MOVE)));
            if (local > MOVE + hold) next();
          }
        }
      }
      if (bar.current) bar.current.style.transform = `scaleX(${(step + Math.min(1, Math.max(0, local) / 20)) / SCRIPT.length})`;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => setRunning(false);
    const onKey = event => {
      if (event.key === 'Escape') stop();
      if (event.key === ' ') { event.preventDefault(); pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); }
    };
    // Any real interaction hands the site back to the visitor.
    const onFullscreen = () => { if (!document.fullscreenElement) stop(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('pointerdown', stop);
    window.addEventListener('touchstart', stop, { passive: true });
    document.addEventListener('fullscreenchange', onFullscreen);
    enter(0);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove('is-presenting');
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('touchstart', stop);
      document.removeEventListener('fullscreenchange', onFullscreen);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      pausedRef.current = false;
      setPaused(false);
    };
  }, [running]);

  const start = () => {
    // Fullscreen is best effort: the loop also runs in a normal window (or after F11).
    document.documentElement.requestFullscreen?.().catch(() => {});
    setRunning(true);
  };

  return <>
    <button type="button" className="presentation-toggle" onClick={start} aria-label={t('presentation.start')} title={t('presentation.start')}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5z" /></svg>
    </button>
    {running && <div className="presentation-overlay" role="status">
      <div ref={bar} className="presentation-overlay__bar" />
      <p className="presentation-overlay__hint">{t(paused ? 'presentation.paused' : 'presentation.hint')}</p>
    </div>}
  </>;
}
