import { useEffect, useRef } from 'react';

/**
 * Runs frame(t) every animation frame with t = seconds into a looping cycle,
 * only while root is on screen. Each time it scrolls into view it restarts at
 * t = 0, so viewers (and the presentation mode) always see a full run.
 * With reduced motion it paints a single still frame at `still`.
 * frame should write to the DOM through refs: no React state per frame.
 */
export default function useEventLoop(root, cycle, frame, reduced, still = cycle * 0.6) {
  const frameRef = useRef(frame);
  frameRef.current = frame;
  useEffect(() => {
    if (reduced) { frameRef.current(still); return undefined; }
    let raf = 0, start = 0;
    const tick = now => {
      if (!root.current) return; // unmounted mid-frame (route change)
      if (!start) start = now;
      frameRef.current(((now - start) / 1000) % cycle);
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) { start = 0; raf = requestAnimationFrame(tick); }
    }, { threshold: 0.3 });
    frameRef.current(0);
    observer.observe(root.current);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [root, cycle, reduced, still]);
}

/**
 * Pre-samples an SVG <path> element once; returns f(fraction 0..1) -> [x, y, headingDeg].
 * Fractions wrap, so closed circuits loop seamlessly.
 */
export function samplePath(path, samples = 900) {
  const length = path.getTotalLength();
  const points = Array.from({ length: samples + 1 }, (_, i) => {
    const p = path.getPointAtLength((length * i) / samples);
    return [p.x, p.y];
  });
  return fraction => {
    const f = ((fraction % 1) + 1) % 1;
    const pos = f * samples, i = Math.floor(pos), k = pos - i;
    const a = points[i], b = points[Math.min(i + 1, samples)];
    const n = points[Math.min(i + 2, samples)];
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, Math.atan2(n[1] - a[1], n[0] - a[0]) * 180 / Math.PI];
  };
}

/** Places a FormulaCarArt group (nose points to +x) at x, y with heading deg and scale. */
export function placeCar(group, x, y, heading, scale) {
  group.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${heading.toFixed(1)}) scale(${scale})`);
}

/** Linear interpolation through the hero's speed profile: time fraction -> distance fraction. */
export function profileLookup(keyTimes, keyPoints) {
  const times = keyTimes.split(';').map(Number);
  const points = keyPoints.split(';').map(Number);
  return t => {
    let i = 1;
    while (i < times.length - 1 && times[i] < t) i++;
    const k = (t - times[i - 1]) / Math.max(1e-9, times[i] - times[i - 1]);
    return points[i - 1] + (points[i] - points[i - 1]) * Math.min(1, Math.max(0, k));
  };
}
