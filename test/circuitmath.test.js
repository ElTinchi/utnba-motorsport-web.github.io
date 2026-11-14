import test from 'node:test';
import assert from 'node:assert/strict';
import { EN, autocrossAt, enduranceAt, nearestFraction, placeCones, timeAtDistance, AX } from '../src/components/events/circuitMath.js';

const circle = f => { const a = f * 2 * Math.PI; return [100 * Math.cos(a), 100 * Math.sin(a), (a * 180) / Math.PI + 90]; };

test('nearestFraction and timeAtDistance invert their functions', () => {
  assert.ok(Math.abs(nearestFraction(circle, 0, 100) - 0.25) < 0.002);
  assert.ok(Math.abs(timeAtDistance(t => 1 - t, 0.3) - 0.7) < 0.001);
});

test('cones sit at the requested distance from the centerline', () => {
  const cones = placeCones(circle, { count: 8, edge: 29, gates: [] });
  assert.equal(cones.length, 16);
  assert.ok(cones.every(([x, y]) => Math.abs(Math.abs(Math.hypot(x, y) - 100) - 29) < 0.5));
});

test('autocross phases are 0, 1, 2 in order', () => {
  assert.equal(autocrossAt(0).phase, 0);
  assert.equal(autocrossAt(AX.wait + 1).phase, 1);
  assert.equal(autocrossAt(AX.cycle - 0.1).phase, 2);
});

test('endurance: lap 11 at the pit stop, driver swap, 22 at the end, laps monotonic', () => {
  let last = -1;
  for (let t = 0; t < EN.cycle; t += 0.01) { const s = enduranceAt(t); assert.ok(s.laps >= last); last = s.laps; }
  const pit = enduranceAt(EN.grid + EN.half + 0.5);
  assert.deepEqual([pit.phase, pit.lap, pit.driver], [2, 11, 1]);
  assert.equal(enduranceAt(EN.grid + EN.half + EN.pit + 0.1).driver, 2);
  const end = enduranceAt(EN.cycle - 0.1);
  assert.deepEqual([end.phase, end.lap], [3, 22]);
});
