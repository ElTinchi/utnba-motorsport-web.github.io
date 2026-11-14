// Illustrative values, not team data
export const RUN = 3.8, DIST = 75, STAGE = 1, BRAKE = 1.3, HOLD = 2.5;
export const A = (2 * DIST) / (RUN * RUN); // m/s^2, constant
export const V_END = A * RUN; // m/s (~39.5 = 142 km/h)
export const CYCLE = STAGE + RUN + BRAKE + HOLD;
const STOP = DIST + (V_END * BRAKE) / 2; // m

/** Returns [distance m, speed m/s, elapsed run time s, phase 0..3] at cycle time t. */
export function stateAt(t) {
  if (t < STAGE) return [0, 0, 0, 0];
  if (t < STAGE + RUN) { const r = t - STAGE; return [0.5 * A * r * r, A * r, r, 1]; }
  if (t < STAGE + RUN + BRAKE) {
    const s = t - STAGE - RUN;
    return [DIST + V_END * (s - (s * s) / (2 * BRAKE)), V_END * (1 - s / BRAKE), RUN, 2];
  }
  return [STOP, 0, RUN, 3];
}
