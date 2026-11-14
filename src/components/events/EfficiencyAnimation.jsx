import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FormulaCarArt from '../FormulaCarArt.jsx';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import useEventLoop, { placeCar, samplePath } from './useEventLoop.js';
import '../../styles/events/efficiency.css';

// Illustrative values, not team data
const RUN = 9, HOLD = 2, CYCLE = RUN + HOLD, LAP = 3; // seconds
const USED = 5.9, CAP = 9, SPEED = 52; // kWh used at the end, battery capacity, km/h
const LOOP = 'M110 45H290A55 55 0 0 1 290 155H110A55 55 0 0 1 110 45Z';
const GX = 150, GY = 88, GW = 100, GH = 24;

export default function EfficiencyAnimation() {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const root = useRef(null);
  const loop = useRef(null);
  const car = useRef(null);
  const fill = useRef(null);
  const phaseEl = useRef(null);
  const energyEl = useRef(null);
  const speedEl = useRef(null);
  const effEl = useRef(null);
  const at = useRef(null);
  const last = useRef(-1);
  const phases = t('fsPage.anim.efficiency.phases', { returnObjects: true });

  useLayoutEffect(() => { at.current = samplePath(loop.current); }, []);

  const frame = c => {
    const fmt = new Intl.NumberFormat(i18n.language, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const run = Math.min(c, RUN);
    const phase = c < RUN ? 0 : 1;
    const [x, y, a] = at.current(run / LAP);
    placeCar(car.current, x, y, a, 0.45);
    const used = USED * (run / RUN);
    fill.current.setAttribute('width', String((GW - 4) * (1 - used / CAP)));
    energyEl.current.textContent = fmt.format(used);
    speedEl.current.textContent = String(SPEED);
    effEl.current.textContent = phase ? fmt.format(SPEED / USED) : '—';
    if (phase !== last.current) {
      last.current = phase;
      phaseEl.current.textContent = phases[phase];
      energyEl.current.classList.toggle('is-live', phase === 0);
    }
  };
  useEventLoop(root, CYCLE, frame, reduced, RUN + 0.5);

  return (
    <figure ref={root} className="fs-anim fs-anim--efficiency" aria-label={t('fsPage.anim.efficiency.label')}>
      <svg viewBox="0 0 400 200" aria-hidden="true" focusable="false">
        <path ref={loop} d={LOOP} className="fs-anim-eff__road" />
        <path d={LOOP} className="fs-anim__line" />
        <rect x={GX} y={GY} width={GW} height={GH} rx="4" className="fs-anim-eff__battery" />
        <rect x={GX + GW} y={GY + 7} width="4" height={GH - 14} rx="1.5" className="fs-anim-eff__cap" />
        <rect ref={fill} x={GX + 2} y={GY + 2} width={GW - 4} height={GH - 4} rx="2.5" className="fs-anim-eff__fill" />
        <text x={GX + GW / 2} y={GY + GH + 14} className="fs-anim-eff__gauge-label">{t('fsPage.anim.efficiency.battery')}</text>
        <g ref={car} className="fs-anim__car"><FormulaCarArt /></g>
      </svg>
      <figcaption className="fs-anim__hud">
        <span ref={phaseEl} className="fs-anim__phase">{phases[0]}</span>
        <dl className="fs-anim__times">
          <div><dt>{t('fsPage.anim.efficiency.energy')}</dt><dd ref={energyEl}>0,0</dd><span aria-hidden="true">kWh</span></div>
          <div><dt>{t('fsPage.anim.efficiency.speed')}</dt><dd ref={speedEl}>{SPEED}</dd><span aria-hidden="true">km/h</span></div>
          <div className="fs-anim__result"><dt>{t('fsPage.anim.efficiency.factor')}</dt><dd ref={effEl}>—</dd></div>
        </dl>
      </figcaption>
    </figure>
  );
}
