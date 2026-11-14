import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import useEventLoop from './useEventLoop.js';
import Person from './Person.jsx';
import CarSide from './CarSide.jsx';
import { arm, op, seg, text } from './motion.js';
import '../../styles/events/cost.css';

const CYCLE = 12, STILL = 6.8, REVIEW = 8.8;
const CAR = { x: 200, y: 150, s: 1.1 };
// Illustrative values, not team data. Order: wheel, engine, wing, chassis.
const PARTS = [
  { id: 'wheel', price: 420, lift: [40, -26], tag: [330, 100] },
  { id: 'engine', price: 3800, lift: [14, -40], tag: [238, 100] },
  { id: 'wing', price: 650, lift: [-30, -22], tag: [52, 100] },
  { id: 'chassis', price: 2900, lift: [0, -76], tag: [200, 28] },
];
const lifted = k => 0.8 + k * 1.6; // start of each lift

export default function CostAnimation() {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const root = useRef(null);
  const r = useRef({ tag: [], price: [], el: null });
  const phases = t('fsPage.anim.cost.phases', { returnObjects: true });
  const names = t('fsPage.anim.cost.parts', { returnObjects: true });
  const money = new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  useEventLoop(root, CYCLE, time => {
    const e = r.current;
    if (!e.el) e.el = Object.fromEntries([...root.current.querySelectorAll('[data-part]')].map(n => [n.dataset.part, n]));
    let total = 0, count = 0;
    PARTS.forEach((p, k) => {
      const up = seg(time, lifted(k), lifted(k) + 0.7) * (1 - seg(time, 7.6, 8.6));
      e.el[p.id].setAttribute('transform', `translate(${(p.lift[0] * up).toFixed(2)} ${(p.lift[1] * up).toFixed(2)})`);
      const shown = seg(time, lifted(k) + 0.3, lifted(k) + 0.7) * (1 - seg(time, 7.4, 7.9));
      op(e.tag[k], shown);
      const added = seg(time, lifted(k) + 0.2, lifted(k) + 0.8);
      total += p.price * added;
      if (added > 0.01) count++;
    });
    text(e.total, money.format(Math.round(total)));
    text(e.count, `${count}/4`);
    const review = seg(time, REVIEW, REVIEW + 0.6);
    e.judge.setAttribute('transform', `translate(${(24 * (1 - review)).toFixed(1)} 0)`);
    op(e.judge, review);
    arm(e.judgeArm, -1, 70);
    e.ticks.forEach((tk, i) => op(tk, seg(time, REVIEW + 1 + i * 0.6, REVIEW + 1.3 + i * 0.6)));
    const phase = time < 8.2 ? 0 : 1;
    if (root.current.dataset.phase !== String(phase)) {
      root.current.dataset.phase = String(phase);
      text(e.phase, phases[phase]);
    }
  }, reduced, STILL);

  const set = (key, i) => el => { if (i === undefined) r.current[key] = el; else (r.current[key] ||= [])[i] = el; };

  return (
    <figure ref={root} className="fs-anim fs-anim--cost" aria-label={t('fsPage.anim.cost.label')}>
      <svg viewBox="0 0 400 240" aria-hidden="true" focusable="false">
        <line x1="8" y1="172" x2="392" y2="172" className="fs-anim__line" />
        <CarSide x={CAR.x} y={CAR.y} s={CAR.s} />
        {PARTS.map((p, k) => (
          <g key={p.id} ref={set('tag', k)} opacity="0" transform={`translate(${p.tag[0]} ${p.tag[1]})`}>
            <rect x="-28" y="-12" width="56" height="24" rx="5" className="fs-anim-cost__tag" />
            <text y="-2.5" className="fs-anim-cost__name">{names[k]}</text>
            <text y="8" className="fs-anim-cost__price">{money.format(p.price)}</text>
          </g>
        ))}
        <g ref={set('judge')} opacity="0">
          <Person kind="judge" x={344} y={172} s={1.25} armL={set('judgeArm')} />
          <g transform="translate(316 138)">
            <rect x="-11" y="-14" width="22" height="28" rx="3" className="fs-anim-cost__clip" />
            {[-6, 1, 8].map((y, i) => (
              <g key={y}>
                <rect x="-4" y={y - 1.5} width="12" height="3" rx="1.5" className="fs-anim-cost__row" />
                <path ref={set('ticks', i)} d={`M-8.5,${y} l1.6,1.8 l3,-3.6`} className="fs-anim-cost__tick" opacity="0" />
              </g>
            ))}
          </g>
        </g>
      </svg>
      <figcaption className="fs-anim__hud">
        <span ref={set('phase')} className="fs-anim__phase">{phases[0]}</span>
        <dl className="fs-anim__times">
          <div><dt>{t('fsPage.anim.cost.total')}</dt><dd ref={set('total')}>{money.format(0)}</dd></div>
          <div><dt>{t('fsPage.anim.cost.pieces')}</dt><dd ref={set('count')}>0/4</dd></div>
        </dl>
      </figcaption>
    </figure>
  );
}
