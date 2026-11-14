// Pure helpers shared by the Autocross and Endurance explainers.
// Illustrative values, not team data.

/** Fraction of the path (0..1) whose sampled point is closest to (x, y). */
export function nearestFraction(sample, x, y, steps = 1200) {
  let best = 0, bestD = Infinity;
  for (let i = 0; i < steps; i++) {
    const [px, py] = sample(i / steps);
    const d = (px - x) ** 2 + (py - y) ** 2;
    if (d < bestD) { bestD = d; best = i / steps; }
  }
  return best;
}

/** Time fraction at which a monotonic-decreasing profile (1 -> 0) reaches distance fraction p. */
export function timeAtDistance(profile, p, steps = 2000) {
  let best = 0, bestD = Infinity;
  for (let i = 0; i <= steps; i++) {
    const d = Math.abs(profile(i / steps) - p);
    if (d < bestD) { bestD = d; best = i / steps; }
  }
  return best;
}

/** Cones on both edges (offset along the normal) plus gate pairs on the road. */
export function placeCones(sample, { count = 56, edge = 29, gates = [0.2, 0.55, 0.8], gate = 16 } = {}) {
  const out = [];
  const at = (f, off) => {
    const [x, y, h] = sample(f);
    const n = ((h + 90) * Math.PI) / 180;
    return [x + Math.cos(n) * off, y + Math.sin(n) * off];
  };
  for (let i = 0; i < count; i++) {
    const f = (i + 0.5) / count;
    out.push(at(f, edge), at(f + 0.5 / count, -edge));
  }
  for (const g of gates) out.push(at(g, gate), at(g, -gate));
  return out;
}

// Autocross timeline (seconds): wait on the line, one timed lap, hold the result.
export const AX = { wait: 0.8, lap: 8, hold: 2.5, lapSeconds: 55.4 };
AX.cycle = AX.wait + AX.lap + AX.hold;
export function autocrossAt(t) {
  if (t < AX.wait) return { phase: 0, u: 0 };
  const u = (t - AX.wait) / AX.lap;
  return u < 1 ? { phase: 1, u } : { phase: 2, u: 1 };
}

// Endurance timeline: race clock in "animation laps" (4 stand for 22 real ones).
export const EN = { grid: 0.6, half: 5, pit: 1.5, laps: 4, cycle: 14, real: 22 };
const eo = s => 0.4 * s + 0.6 * (1 - (1 - s) ** 2.5);
const ei = s => 0.4 * s + 0.6 * s ** 2.5;
export function enduranceAt(t) {
  const aEnd = EN.grid + EN.half, bStart = aEnd + EN.pit, bEnd = bStart + EN.half, h = EN.laps / 2;
  let laps, phase;
  if (t < EN.grid) { laps = 0; phase = 0; }
  else if (t < aEnd) { laps = h * eo((t - EN.grid) / EN.half); phase = 1; }
  else if (t < bStart) { laps = h; phase = 2; }
  else if (t < bEnd) { laps = h + h * ei((t - bStart) / EN.half); phase = 1; }
  else { laps = EN.laps; phase = 3; }
  const lap = Math.min(EN.real, 1 + Math.floor((laps / EN.laps) * (EN.real - 0.001)));
  return { laps, phase, lap, driver: t >= bStart ? 2 : 1 };
}
