import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FormulaCarArt from '../FormulaCarArt.jsx';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import CircuitBase, { VIEWBOX, useCircuit } from './CircuitBase.jsx';
import useEventLoop, { placeCar } from './useEventLoop.js';
import { AX, autocrossAt } from './circuitMath.js';
import '../../styles/events/autocross.css';

// Illustrative values, not team data.
const CAR_SCALE = 0.9;

export default function AutocrossAnimation() {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const root = useRef(null);
  const car = useRef(null);
  const trail = useRef(null);
  const phaseEl = useRef(null);
  const timeEl = useRef(null);
  const last = useRef(-1);
  const { pathRef, circuit, geo } = useCircuit();
  const phases = t('fsPage.anim.autocross.phases', { returnObjects: true });
  const fmt = new Intl.NumberFormat(i18n.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const frame = time => {
    const c = circuit.current;
    if (!c) return;
    const { phase, u } = autocrossAt(time);
    const [x, y, h] = c.pose(u);
    placeCar(car.current, x, y, h, CAR_SCALE);
    trail.current.style.strokeDashoffset = String(phase === 2 ? 0 : 1 - c.traveled(u));
    timeEl.current.textContent = fmt.format(u * AX.lapSeconds);
    if (phase !== last.current) {
      last.current = phase;
      phaseEl.current.textContent = phases[phase];
      root.current.dataset.phase = String(phase);
    }
  };
  // Still frame for reduced motion: lap finished, trail fully painted.
  useEventLoop(root, AX.cycle, frame, reduced, AX.wait + AX.lap + 1);

  return (
    <figure ref={root} className="fs-anim fs-anim--autocross" aria-label={t('fsPage.anim.autocross.label')}>
      <svg viewBox={VIEWBOX} aria-hidden="true" focusable="false">
        <CircuitBase pathRef={pathRef} line={geo?.line} />
        <path ref={trail} d={geo?.trail ?? ''} pathLength="1" className="fs-anim__trail" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        {geo?.cones.map(([x, y], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3.4" className="fs-anim__cone" />)}
        <g ref={car} className="fs-anim__car"><FormulaCarArt /></g>
      </svg>
      <figcaption className="fs-anim__hud">
        <span ref={phaseEl} className="fs-anim__phase">{phases[0]}</span>
        <dl className="fs-anim__times">
          <div><dt>{t('fsPage.anim.autocross.time')}</dt><dd ref={timeEl}>{fmt.format(0)}</dd></div>
          <div><dt>{t('fsPage.anim.autocross.cones')}</dt><dd>0</dd></div>
        </dl>
      </figcaption>
    </figure>
  );
}
