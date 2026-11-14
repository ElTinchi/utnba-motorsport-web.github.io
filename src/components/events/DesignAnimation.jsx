import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import useEventLoop from './useEventLoop.js';
import Person from './Person.jsx';
import CarSide from './CarSide.jsx';
import { arm, op, seg, text } from './motion.js';
import '../../styles/events/design.css';

const CYCLE = 12, STEP = 2.5, STILL = 6;
const CAR = { x: 200, y: 150, s: 1.3 };
const at = (lx, ly) => [CAR.x + CAR.s * lx, CAR.y + CAR.s * ly];
// Order matches fsPage.anim.design.parts: suspension, chassis, aero, powertrain.
const CALLOUTS = [
  { anchor: at(33, 5), label: [282, 208], top: false },
  { anchor: at(0, -7), label: [236, 86], top: true },
  { anchor: at(-52, -20), label: [112, 86], top: true },
  { anchor: at(-33, -8), label: [122, 208], top: false },
];
const ANSWER_LINES = [44, 34, 40];

export default function DesignAnimation() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const root = useRef(null);
  const r = useRef({ call: [], line: [], judgeBubble: [], ans: [] });
  const parts = t('fsPage.anim.design.parts', { returnObjects: true });

  useEventLoop(root, CYCLE, time => {
    const e = r.current;
    const k = Math.min(3, Math.floor(time / STEP));
    const t0 = k * STEP;
    CALLOUTS.forEach((_, i) => {
      const v = seg(time, i * STEP, i * STEP + 0.6);
      e.line[i].style.strokeDashoffset = String(1 - v);
      op(e.call[i], v * (i === k && time < 4 * STEP ? 1 : time >= 4 * STEP ? 0.8 : 0.4));
    });
    const ask = seg(time, t0 + 0.7, t0 + 1.1);
    const answer = seg(time, t0 + 1.3, t0 + 1.6);
    const out = 1 - seg(time, t0 + 2.1, t0 + 2.4);
    e.judgeBubble.forEach((b, j) => op(b, k % 2 === j ? ask * out : 0));
    op(e.answer, answer * out);
    ANSWER_LINES.forEach((w, i) => e.ans[i].setAttribute('width', (w * seg(time, t0 + 1.5 + i * 0.2, t0 + 1.9 + i * 0.2)).toFixed(1)));
    arm(e.member, -1, 8 + 85 * answer * out);
    if (root.current.dataset.phase !== String(k)) {
      root.current.dataset.phase = String(k);
      text(e.phase, t('fsPage.anim.design.phase', { part: parts[k] }));
    }
    text(e.count, String(ask > 0.01 ? k + 1 : k));
  }, reduced, STILL);

  const set = (key, i) => el => { if (i === undefined) r.current[key] = el; else r.current[key][i] = el; };

  return (
    <figure ref={root} className="fs-anim fs-anim--design" aria-label={t('fsPage.anim.design.label')}>
      <svg viewBox="0 0 400 240" aria-hidden="true" focusable="false">
        <line x1="8" y1="176" x2="392" y2="176" className="fs-anim__line" />
        <CarSide x={CAR.x} y={CAR.y} s={CAR.s} />
        {CALLOUTS.map(({ anchor: [ax, ay], label: [lx, ly], top }, i) => (
          <g key={i} ref={set('call', i)} opacity="0">
            <path ref={set('line', i)} d={`M${lx},${ly + (top ? 5 : -11)} L${ax.toFixed(1)},${ay.toFixed(1)}`} pathLength="1" className="fs-anim-design__line" />
            <circle cx={ax.toFixed(1)} cy={ay.toFixed(1)} r="3" className="fs-anim-design__dot" />
            <text x={lx} y={ly} className="fs-anim-design__label">{parts[i]}</text>
          </g>
        ))}
        <Person kind="judge" x={44} y={176} s={1.2} />
        <Person kind="judge" x={356} y={176} s={1.2} />
        <Person x={300} y={176} s={1.2} armL={set('member')} />
        {[44, 356].map((x, j) => (
          <g key={x} ref={set('judgeBubble', j)} opacity="0">
            <rect x={x - 16} y="84" width="32" height="24" rx="10" className="fs-anim-design__bubble" />
            <path d={`M${x - 3},109 L${x + 3},109 L${x},116 Z`} className="fs-anim-design__bubble" />
            <text x={x} y="101" className="fs-anim-design__q">?</text>
          </g>
        ))}
        <g ref={set('answer')} opacity="0">
          <rect x="262" y="40" width="64" height="40" rx="10" className="fs-anim-design__bubble" />
          <path d="M290,81 L300,81 L300,90 Z" className="fs-anim-design__bubble" />
          {ANSWER_LINES.map((_, i) => <rect key={i} ref={set('ans', i)} x="270" y={48 + i * 10} width="0" height="3.5" rx="1.75" className="fs-anim-design__ans" />)}
        </g>
      </svg>
      <figcaption className="fs-anim__hud">
        <span ref={set('phase')} className="fs-anim__phase">{t('fsPage.anim.design.phase', { part: parts[0] })}</span>
        <dl className="fs-anim__times">
          <div><dt>{t('fsPage.anim.design.questions')}</dt><dd ref={set('count')}>0</dd></div>
        </dl>
      </figcaption>
    </figure>
  );
}
