import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FormulaCarArt from '../FormulaCarArt.jsx';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import CircuitBase, { VIEWBOX, useCircuit } from './CircuitBase.jsx';
import useEventLoop, { placeCar } from './useEventLoop.js';
import { EN, enduranceAt } from './circuitMath.js';
import '../../styles/events/endurance.css';

// Illustrative values, not team data: rival lap offsets/rates are made up.
const RIVALS = [{ cls: 'b', offset: 0.33, rate: 0.92 }, { cls: 'c', offset: 0.66, rate: 1.06 }];
const CAR_SCALE = 0.9;
const SECONDS_PER_LAP = EN.half / (EN.laps / 2);

export default function EnduranceAnimation() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const root = useRef(null);
  const cars = useRef([]);
  const ring = useRef(null);
  const phaseEl = useRef(null);
  const lapEl = useRef(null);
  const driverEl = useRef(null);
  const last = useRef({ phase: -1, lap: -1, driver: -1 });
  const { pathRef, circuit, geo } = useCircuit({ count: 40, gates: [] });
  const phases = t('fsPage.anim.endurance.phases', { returnObjects: true });

  const frame = time => {
    const c = circuit.current;
    if (!c) return;
    const s = enduranceAt(time);
    const [x, y, h] = c.pose(s.laps);
    placeCar(cars.current[0], x, y, h, CAR_SCALE);
    const raced = Math.max(0, time - EN.grid) / SECONDS_PER_LAP;
    RIVALS.forEach((r, i) => {
      const [rx, ry, rh] = c.pose(r.offset + raced * r.rate);
      placeCar(cars.current[i + 1], rx, ry, rh, CAR_SCALE);
    });
    if (ring.current && geo) ring.current.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    const l = last.current;
    if (s.phase !== l.phase) {
      l.phase = s.phase;
      phaseEl.current.textContent = phases[s.phase];
      root.current.dataset.phase = String(s.phase);
    }
    if (s.lap !== l.lap) { l.lap = s.lap; lapEl.current.textContent = `${s.lap}/${EN.real}`; }
    if (s.driver !== l.driver) { l.driver = s.driver; driverEl.current.textContent = `${s.driver}/2`; }
  };
  // Still frame for reduced motion: mid-race driver swap.
  useEventLoop(root, EN.cycle, frame, reduced, EN.grid + EN.half + 0.7);

  return (
    <figure ref={root} className="fs-anim fs-anim--endurance" aria-label={t('fsPage.anim.endurance.label')}>
      <svg viewBox={VIEWBOX} aria-hidden="true" focusable="false">
        <CircuitBase pathRef={pathRef} line={geo?.line} />
        {geo?.cones.map(([x, y], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.6" className="fs-anim__cone" />)}
        {RIVALS.map((r, i) => (
          <g key={r.cls} ref={el => { cars.current[i + 1] = el; }} className={`fs-anim__car fs-anim-end__car fs-anim-end__car--${r.cls}`}><FormulaCarArt /></g>
        ))}
        <g ref={ring}><circle r="30" className="fs-anim-end__ring" /></g>
        <g ref={el => { cars.current[0] = el; }} className="fs-anim__car"><FormulaCarArt /></g>
      </svg>
      <figcaption className="fs-anim__hud">
        <span ref={phaseEl} className="fs-anim__phase">{phases[0]}</span>
        <dl className="fs-anim__times">
          <div><dt>{t('fsPage.anim.endurance.lap')}</dt><dd ref={lapEl}>1/{EN.real}</dd></div>
          <div><dt>{t('fsPage.anim.endurance.driver')}</dt><dd ref={driverEl}>1/2</dd></div>
        </dl>
      </figcaption>
    </figure>
  );
}
