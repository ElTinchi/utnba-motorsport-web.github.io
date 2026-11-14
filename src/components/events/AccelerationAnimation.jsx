import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FormulaCarArt from '../FormulaCarArt.jsx';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import useEventLoop, { placeCar } from './useEventLoop.js';
import { CYCLE, STAGE, RUN, BRAKE, stateAt } from './accelerationMath.js';
import '../../styles/events/acceleration.css';

const DIST = 75; // metres; illustrative values, not team data
const S = 3.3, X0 = 30, Y = 75; // px per metre, start line x, track centre
const FINISH = X0 + DIST * S;
const SCALE = 0.45;
const CONES_X = Array.from({ length: 6 }, (_, i) => X0 + i * 15 * S);
const END_X = X0 + stateAt(CYCLE)[0] * S;
const TRAIL = END_X - X0;
const TOP_SPEED = stateAt(STAGE + RUN - 1e-6)[1]; // speed at the finish line

export default function AccelerationAnimation() {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const root = useRef(null);
  const car = useRef(null);
  const trail = useRef(null);
  const phaseEl = useRef(null);
  const timeEl = useRef(null);
  const speedEl = useRef(null);
  const last = useRef(-1);
  const phases = t('fsPage.anim.acceleration.phases', { returnObjects: true });

  const frame = c => {
    const fmt = new Intl.NumberFormat(i18n.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const [d, v, r, phase] = stateAt(c);
    const x = X0 + d * S;
    placeCar(car.current, x, Y, 0, SCALE);
    trail.current.style.strokeDashoffset = String(TRAIL - (x - X0));
    if (phase !== last.current) {
      last.current = phase;
      phaseEl.current.textContent = phases[phase];
      root.current.dataset.phase = String(phase);
      timeEl.current.classList.toggle('is-live', phase === 1);
      speedEl.current.classList.toggle('is-live', phase === 1);
    }
    timeEl.current.textContent = fmt.format(r);
    // After the finish the result shows top speed, not the braking speed.
    speedEl.current.textContent = String(Math.round((phase >= 2 ? TOP_SPEED : v) * 3.6));
  };
  useEventLoop(root, CYCLE, frame, reduced, STAGE + RUN + BRAKE + 0.3);

  return (
    <figure ref={root} className="fs-anim fs-anim--acceleration" aria-label={t('fsPage.anim.acceleration.label')}>
      <svg viewBox="0 0 400 150" aria-hidden="true" focusable="false">
        <rect x={X0 - 14} y={Y - 26} width={FINISH - X0 + 14} height="52" className="fs-anim-accel__road" />
        <rect x={FINISH} y={Y - 26} width={END_X + 30 - FINISH} height="52" className="fs-anim-accel__runoff" />
        <line x1={X0 - 14} y1={Y} x2={FINISH} y2={Y} className="fs-anim__line" />
        <path ref={trail} d={`M${X0} ${Y}H${END_X}`} pathLength={TRAIL} className="fs-anim__trail" style={{ strokeDasharray: TRAIL, strokeDashoffset: TRAIL }} />
        <line x1={X0} y1={Y - 30} x2={X0} y2={Y + 30} className="fs-anim__timing" />
        <line x1={FINISH} y1={Y - 30} x2={FINISH} y2={Y + 30} className="fs-anim__timing" />
        {CONES_X.map((x, i) => (
          <g key={i}>
            <circle cx={x.toFixed(1)} cy={Y - 30} r="2" className="fs-anim__cone" />
            <circle cx={x.toFixed(1)} cy={Y + 30} r="2" className="fs-anim__cone" />
          </g>
        ))}
        <text x={X0} y={Y + 44} className="fs-anim-accel__label">{t('fsPage.anim.acceleration.start')}</text>
        <text x={FINISH} y={Y + 44} className="fs-anim-accel__label">{t('fsPage.anim.acceleration.finish')}</text>
        <text x={(X0 + FINISH) / 2} y={Y - 38} className="fs-anim-accel__dist">75 m</text>
        <g ref={car} className="fs-anim__car"><FormulaCarArt /></g>
      </svg>
      <figcaption className="fs-anim__hud">
        <span ref={phaseEl} className="fs-anim__phase">{phases[0]}</span>
        <dl className="fs-anim__times">
          <div><dt>{t('fsPage.anim.acceleration.time')}</dt><dd ref={timeEl}>0,00</dd><span aria-hidden="true">s</span></div>
          <div><dt>{t('fsPage.anim.acceleration.speed')}</dt><dd ref={speedEl}>0</dd><span aria-hidden="true">km/h</span></div>
        </dl>
      </figcaption>
    </figure>
  );
}
