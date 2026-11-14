import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGE, RUN, BRAKE, stateAt } from '../src/components/events/accelerationMath.js';

test('covers 75 m in 3.8 s at ~142 km/h, then stops', () => {
  const [d, v, r] = stateAt(STAGE + RUN);
  assert.ok(Math.abs(d - 75) < 1e-9 && r === RUN);
  assert.equal(Math.round(v * 3.6), 142);
  const [, v0] = stateAt(STAGE + RUN + BRAKE);
  assert.ok(Math.abs(v0) < 1e-9);
});
