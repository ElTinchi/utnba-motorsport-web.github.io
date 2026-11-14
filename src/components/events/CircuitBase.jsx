import { useId, useLayoutEffect, useRef, useState } from 'react';
import { CAR_KEY_POINTS, CAR_KEY_TIMES, TRACK_PATH } from '../../data/track.js';
import { profileLookup, samplePath } from './useEventLoop.js';
import { nearestFraction, placeCones, timeAtDistance } from './circuitMath.js';
import '../../styles/events/circuit.css';

export const VIEWBOX = '70 -14 820 682';
const profile = profileLookup(CAR_KEY_TIMES, CAR_KEY_POINTS);

/**
 * Samples the circuit once after mount. `pose(w)` takes a lap time fraction
 * (0 = crossing the start line) and returns [x, y, heading] with the car facing
 * forward (the speed profile runs the path in reverse, hence +180).
 */
export function useCircuit(coneOptions) {
  const pathRef = useRef(null);
  const circuit = useRef(null);
  const [geo, setGeo] = useState(null);
  useLayoutEffect(() => {
    const sample = samplePath(pathRef.current);
    const pStart = nearestFraction(sample, 462, 363);
    const uStart = timeAtDistance(profile, pStart);
    circuit.current = {
      pose: w => { const [x, y, h] = sample(profile(((uStart + w) % 1 + 1) % 1)); return [x, y, h + 180]; },
      // How much of the lap has been driven (0..1), for painting the trail.
      traveled: w => (((pStart - profile(((uStart + w) % 1 + 1) % 1)) % 1) + 1) % 1,
    };
    const [sx, sy, sh] = sample(pStart);
    setGeo({ cones: placeCones(sample, coneOptions), line: [sx, sy, sh + 90], trail: Array.from({ length: 241 }, (_, i) => {
      const [x, y] = circuit.current.pose(i / 240);
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join('') });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return { pathRef, circuit, geo };
}

export default function CircuitBase({ pathRef, line }) {
  const id = useId().replace(/:/g, '');
  return (
    <>
      <defs>
        {/* Curbs show only outside the road band, so the translucent asphalt stays clean. */}
        <mask id={`m${id}`} maskUnits="userSpaceOnUse" x="0" y="-60" width="1000" height="800">
          <path d={TRACK_PATH} className="fs-anim-ci__mask-out" />
          <path d={TRACK_PATH} className="fs-anim-ci__mask-in" />
        </mask>
      </defs>
      <g mask={`url(#m${id})`}>
        <path d={TRACK_PATH} className="fs-anim-ci__curb fs-anim-ci__curb--white" />
        <path d={TRACK_PATH} className="fs-anim-ci__curb fs-anim-ci__curb--red" />
      </g>
      <path ref={pathRef} d={TRACK_PATH} className="fs-anim-ci__road" />
      <path d={TRACK_PATH} className="fs-anim-ci__center" />
      {line && (
        <g className="fs-anim-ci__start" transform={`translate(${line[0].toFixed(1)} ${line[1].toFixed(1)}) rotate(${line[2].toFixed(1)})`}>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={i % 2 === 0 ? -22 : 0} y={-12 + Math.floor(i / 2) * 6} width="22" height="6"
              className={i % 4 === 0 || i % 4 === 3 ? 'fs-anim-ci__tile--l' : 'fs-anim-ci__tile--d'} />
          ))}
        </g>
      )}
    </>
  );
}
