// Aerial skid pad, scaled ~6.6 px/m: driving line radius 9.125 m, cones at 7.6 m / 10.6 m.
export const R = 60, CR = 260, CL = 140, CY = 130, X = 200;
export const LAP = 2 * Math.PI * R, LANE = 160;
export const TOTAL = LANE * 2 + LAP * 4;
export const LAP_SECONDS = 1.9;
const V = LAP / LAP_SECONDS;
const V0 = V * 0.3;
const ENTRY_SECONDS = (2 * LANE) / (V0 + V);
export const HOLD_SECONDS = 2.6;
// Illustrative times (not team data): skid pad score uses the average of both timed laps.
export const TIMES = [5.08, 5.16];

const arc = (sweep, end) => `A${R} ${R} 0 0 ${sweep} ${end} ${CY}`;
export const PATH = `M${X} ${CY + LANE}L${X} ${CY}`
  + `${arc(1, CR + R)}${arc(1, X)}`.repeat(2)
  + `${arc(0, CL - R)}${arc(0, X)}`.repeat(2)
  + `L${X} ${CY - LANE}`;

function cones(cx, other, r, count) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return [cx + r * Math.cos(a), CY + r * Math.sin(a)];
  }).filter(([x, y]) => Math.hypot(x - other, y - CY) > 66);
}
export const CONES = [
  ...cones(CR, CL, 50, 16), ...cones(CL, CR, 50, 16),
  ...cones(CR, CL, 70, 24), ...cones(CL, CR, 70, 24),
  ...[0, 1, 2].flatMap(i => [[X - 14, 228 + i * 18], [X + 14, 228 + i * 18], [X - 14, 32 - i * 18], [X + 14, 32 - i * 18]]),
];

// Position and heading (deg) of the car after travelling d px along the run.
export function pose(d) {
  if (d <= LANE) return [X, CY + LANE - d, -90];
  const m = d - LANE;
  if (m >= LAP * 4) return [X, CY - (m - LAP * 4), -90];
  const s = m % LAP, right = m < LAP * 2;
  const theta = right ? Math.PI + s / R : -s / R;
  const cx = right ? CR : CL;
  return [cx + R * Math.cos(theta), CY + R * Math.sin(theta), (theta + (right ? 1 : -1) * Math.PI / 2) * 180 / Math.PI];
}

// Phase 0 entry, 1-4 laps (R warm-up, R timed, L warm-up, L timed), 5 exit.
export function distanceAt(t) {
  if (t < ENTRY_SECONDS) return [V0 * t + (V - V0) * t * t / (2 * ENTRY_SECONDS), 0, 0];
  const lapT = t - ENTRY_SECONDS;
  if (lapT < LAP_SECONDS * 4) {
    const lap = Math.floor(lapT / LAP_SECONDS);
    return [LANE + V * lapT, lap + 1, (lapT % LAP_SECONDS) / LAP_SECONDS];
  }
  return [LANE + LAP * 4 + V * (lapT - LAP_SECONDS * 4), 5, 0];
}
export const CYCLE = ENTRY_SECONDS + LAP_SECONDS * 4 + LANE / V + HOLD_SECONDS;
