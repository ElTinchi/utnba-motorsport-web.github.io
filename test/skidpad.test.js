import test from 'node:test';
import assert from 'node:assert/strict';
import { TOTAL, CYCLE, distanceAt, pose } from '../src/components/events/skidPadPath.js';

test('skid pad car moves continuously along the figure eight', () => {
  for (let d = 0; d < TOTAL; d += 0.5) {
    const [x1, y1, a1] = pose(d), [x2, y2, a2] = pose(d + 0.5);
    assert.ok(Math.hypot(x2 - x1, y2 - y1) < 0.6, `jump at ${d}`);
    const turn = ((((a2 - a1) % 360) + 540) % 360) - 180;
    assert.ok(Math.abs(turn) < 1, `heading jump at ${d}`);
  }
});

test('skid pad timeline is monotonic and runs all six phases', () => {
  let last = -1, phases = new Set();
  for (let t = 0; t < CYCLE; t += 0.01) {
    const [d, phase] = distanceAt(t);
    assert.ok(d >= last, `distance went back at ${t}`);
    last = d; phases.add(phase);
  }
  assert.deepEqual([...phases], [0, 1, 2, 3, 4, 5]);
});
