import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FormulaCarArt from '../FormulaCarArt.jsx';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import { CONES, CY, CYCLE, LANE, PATH, TIMES, TOTAL, X, distanceAt, pose } from './skidPadPath.js';

export default function SkidPadAnimation() {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const root = useRef(null);
  const car = useRef(null);
  const trail = useRef(null);
  const phaseEl = useRef(null);
  const timeEls = useRef([]);
  const avgEl = useRef(null);
  const phases = t('fsPage.anim.skidpad.phases', { returnObjects: true });

  useEffect(() => {
    const fmt = new Intl.NumberFormat(i18n.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const average = fmt.format((TIMES[0] + TIMES[1]) / 2);
    const finished = TIMES.map(fmt.format);
    let frame = 0, start = 0, lastPhase = -1;
    const render = (d, phase, u) => {
      const [x, y, a] = pose(Math.min(d, TOTAL));
      car.current.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${a.toFixed(1)}) scale(.62)`);
      trail.current.style.strokeDashoffset = String(TOTAL - Math.min(d, TOTAL));
      if (phase !== lastPhase) {
        lastPhase = phase;
        phaseEl.current.textContent = phases[phase];
        root.current.dataset.phase = String(phase);
      }
      // Timed laps are phases 2 (right) and 4 (left).
      timeEls.current.forEach((el, i) => {
        const timed = 2 + i * 2;
        el.textContent = phase < timed ? '—' : phase === timed ? fmt.format(TIMES[i] * u) : finished[i];
      });
      avgEl.current.textContent = phase === 5 ? average : '—';
    };
    if (reduced) {
      render(LANE, 5, 0);
      trail.current.style.strokeDashoffset = '0';
      return undefined;
    }
    const tick = now => {
      if (!start) start = now;
      const elapsed = ((now - start) / 1000) % CYCLE;
      const [d, phase, u] = distanceAt(elapsed);
      render(d, phase, u);
      frame = requestAnimationFrame(tick);
    };
    // Restart from the entry each time it comes into view: it reads as a full run.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) { start = 0; frame = requestAnimationFrame(tick); }
    }, { threshold: 0.3 });
    render(0, 0, 0);
    observer.observe(root.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [reduced, i18n.language, phases]);

  return (
    <figure ref={root} className="fs-anim fs-anim--skidpad" aria-label={t('fsPage.anim.skidpad.label')}>
      <svg viewBox="50 0 300 260" aria-hidden="true" focusable="false">
        <path d={PATH} className="fs-anim__line" />
        <path ref={trail} d={PATH} pathLength={TOTAL} className="fs-anim__trail" style={{ strokeDasharray: TOTAL, strokeDashoffset: TOTAL }} />
        <line x1={X - 22} y1={CY} x2={X + 22} y2={CY} className="fs-anim__timing" />
        {CONES.map(([x, y], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.2" className="fs-anim__cone" />)}
        <g ref={car} className="fs-anim__car"><FormulaCarArt /></g>
      </svg>
      <figcaption className="fs-anim__hud">
        <span ref={phaseEl} className="fs-anim__phase">{phases[0]}</span>
        <dl className="fs-anim__times">
          <div><dt>{t('fsPage.anim.skidpad.right')}</dt><dd ref={el => { timeEls.current[0] = el; }}>—</dd></div>
          <div><dt>{t('fsPage.anim.skidpad.left')}</dt><dd ref={el => { timeEls.current[1] = el; }}>—</dd></div>
          <div className="fs-anim__result"><dt>{t('fsPage.anim.skidpad.average')}</dt><dd ref={avgEl}>—</dd></div>
        </dl>
      </figcaption>
    </figure>
  );
}
