import { useEffect, useRef, useState } from 'react';
import useReducedMotion from './useReducedMotion.js';

export function deriveVisibilityState(
  current,
  entry,
  { enterThreshold = 0.2, exitThreshold = 0.02 } = {},
) {
  if (!entry.isIntersecting || entry.intersectionRatio <= exitThreshold) return false;
  if (entry.intersectionRatio >= enterThreshold) return true;
  return current;
}

export function getVisibilityFallback({ hasObserver, reducedMotion }) {
  return !hasObserver || reducedMotion;
}

export function getEffectiveEnterThreshold({
  requestedThreshold,
  elementHeight,
  viewportHeight,
}) {
  if (!elementHeight || elementHeight <= viewportHeight) return requestedThreshold;
  const reachableThreshold = (viewportHeight / elementHeight) * 0.2;
  return Math.min(requestedThreshold, Math.ceil(reachableThreshold * 10000) / 10000);
}

export default function useInView({
  rootMargin = '-8% 0px -8% 0px',
  threshold = 0.2,
  exitThreshold = 0.02,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return undefined;
    const hasObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;
    if (getVisibilityFallback({ hasObserver, reducedMotion })) {
      setIsVisible(true);
      return undefined;
    }

    const requestedThreshold = Array.isArray(threshold) ? Math.max(...threshold) : threshold;
    const enterThreshold = getEffectiveEnterThreshold({
      requestedThreshold,
      elementHeight: ref.current.getBoundingClientRect().height,
      viewportHeight: window.innerHeight,
    });
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible((current) => deriveVisibilityState(current, entry, {
        enterThreshold,
        exitThreshold,
      }));
    }, { rootMargin, threshold: [exitThreshold, enterThreshold] });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [exitThreshold, reducedMotion, rootMargin, threshold]);

  return [ref, isVisible];
}
