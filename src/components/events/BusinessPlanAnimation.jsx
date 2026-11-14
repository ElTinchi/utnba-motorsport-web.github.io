import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import useEventLoop from './useEventLoop.js';
import Person from './Person.jsx';
import CarSide from './CarSide.jsx';
import { arm, op, seg, text } from './motion.js';
import '../../styles/events/businessPlan.css';

// Illustrative values, not team data.
const CYCLE = 12, PITCH = 9.5, SLIDE = 2.5, STILL = 7;
const BARS = [26, 38, 32, 50, 64];
const AUDIENCE = Array.from({ length: 13 }, (_, i) => 20 + i * 30);

export default function BusinessPlanAnimation() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const root = useRef(null);
  const r = useRef({ slide: [], bar: [] });
  const phases = t('fsPage.anim.businessPlan.phases', { returnObjects: true });
  const slides = t('fsPage.anim.businessPlan.slides', { returnObjects: true });

  useEventLoop(root, CYCLE, time => {
    const e = r.current;
    for (let i = 0; i < 4; i++) {
      const on = i === 0 ? 1 : seg(time, i * SLIDE - 0.2, i * SLIDE + 0.2);
      const off = i < 3 ? 1 - seg(time, (i + 1) * SLIDE - 0.2, (i + 1) * SLIDE + 0.2) : 1;
      op(e.slide[i], on * off);
    }
    e.bar.forEach((b, i) => {
      const h = BARS[i] * seg(time, 2.9 + i * 0.25, 3.9 + i * 0.25);
      b.setAttribute('y', (86 - h).toFixed(1));
      b.setAttribute('height', h.toFixed(1));
    });
    e.line.style.strokeDashoffset = String(1 - seg(time, 5.2, 7.2));
    op(e.dot, seg(time, 7, 7.3));
    e.under.setAttribute('width', (40 * seg(time, 8, 8.8)).toFixed(1));
    const point = seg(time, 2.6, 3.2) - seg(time, 7.6, 8.2);
    arm(e.presenter, -1, 8 + 132 * point + Math.sin(time * 2.4) * 4 * point);
    const q = seg(time, PITCH + 0.2, PITCH + 0.8);
    arm(e.judge, 1, -8 - 142 * q);
    op(e.bubble, q);
    const phase = time < PITCH ? 0 : 1;
    if (root.current.dataset.phase !== String(phase)) {
      root.current.dataset.phase = String(phase);
      text(e.phase, phases[phase]);
    }
    text(e.slideNo, `${Math.min(3, Math.floor(time / SLIDE)) + 1}/4`);
    const s = Math.round(600 * Math.min(1, time / PITCH));
    text(e.clock, `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);
  }, reduced, STILL);

  const set = (key, i) => el => { if (i === undefined) r.current[key] = el; else r.current[key][i] = el; };

  return (
    <figure ref={root} className="fs-anim fs-anim--businessplan" aria-label={t('fsPage.anim.businessPlan.label')}>
      <svg viewBox="0 0 400 240" aria-hidden="true" focusable="false">
        <line x1="8" y1="172" x2="392" y2="172" className="fs-anim__line" />
        <rect x="36" y="30" width="170" height="100" rx="4" className="fs-anim-bp__screen" />
        <g transform="translate(36 30)">
          <g ref={set('slide', 0)}>
            <text x="85" y="46" className="fs-anim-bp__t">{slides[0]}</text>
            <rect x="60" y="56" width="50" height="3" rx="1.5" className="fs-anim-bp__sub" />
            <rect x="70" y="64" width="30" height="3" rx="1.5" className="fs-anim-bp__dot" />
          </g>
          <g ref={set('slide', 1)}>
            <text x="10" y="16" className="fs-anim-bp__label">{slides[1]}</text>
            <line x1="10" y1="86" x2="160" y2="86" className="fs-anim-bp__grid" />
            {BARS.map((_, i) => <rect key={i} ref={set('bar', i)} x={22 + i * 28} y="86" width="18" height="0" rx="2" className="fs-anim-bp__bar" style={i === BARS.length - 1 ? { fill: 'rgba(var(--red-rgb), 0.9)' } : undefined} />)}
          </g>
          <g ref={set('slide', 2)}>
            <text x="10" y="16" className="fs-anim-bp__label">{slides[2]}</text>
            <path d="M10,40 H160 M10,63 H160 M10,86 H160" className="fs-anim-bp__grid" />
            <path ref={set('line')} d="M12,78 L42,66 L72,70 L104,44 L136,36 L158,22" pathLength="1" className="fs-anim-bp__chart" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
            <circle ref={set('dot')} cx="158" cy="22" r="3.5" className="fs-anim-bp__dot" opacity="0" />
          </g>
          <g ref={set('slide', 3)} opacity="0">
            <text x="85" y="50" className="fs-anim-bp__t">{slides[3]}</text>
            <rect ref={set('under')} x="65" y="60" width="0" height="3" rx="1.5" className="fs-anim-bp__dot" />
          </g>
        </g>
        <CarSide x={120} y={160} s={0.6} />
        <Person x={226} y={172} s={1.15} armL={set('presenter')} />
        <Person x={256} y={172} s={1.15} />
        <Person x={286} y={172} s={1.15} />
        <Person kind="judge" x={342} y={172} s={1.15} />
        <Person kind="judge" x={372} y={172} s={1.15} armR={set('judge')} />
        <rect x="316" y="148" width="80" height="8" rx="2" className="fs-anim-bp__table" />
        <path d="M322,156 V172 M390,156 V172" className="fs-anim-bp__grid" style={{ strokeWidth: 3 }} />
        <g ref={set('bubble')} opacity="0">
          <rect x="356" y="86" width="32" height="24" rx="10" className="fs-anim-bp__bubble" />
          <path d="M370,111 L376,111 L376,118 Z" className="fs-anim-bp__bubble" />
          <text x="372" y="103" className="fs-anim-bp__q">?</text>
        </g>
        {AUDIENCE.map((x, i) => (
          <g key={x} className="fs-anim-bp__aud">
            <circle cx={x + (i % 2) * 4} cy={216} r="9" />
            <ellipse cx={x + (i % 2) * 4} cy={242} rx="16" ry="14" />
          </g>
        ))}
      </svg>
      <figcaption className="fs-anim__hud">
        <span ref={set('phase')} className="fs-anim__phase">{phases[0]}</span>
        <dl className="fs-anim__times">
          <div><dt>{t('fsPage.anim.businessPlan.slide')}</dt><dd ref={set('slideNo')}>1/4</dd></div>
          <div><dt>{t('fsPage.anim.businessPlan.time')}</dt><dd ref={set('clock')}>0:00</dd></div>
        </dl>
      </figcaption>
    </figure>
  );
}
