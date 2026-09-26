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

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible((current) => deriveVisibilityState(current, entry, {
        enterThreshold: Array.isArray(threshold) ? Math.max(...threshold) : threshold,
        exitThreshold,
      }));
    }, { rootMargin, threshold: [exitThreshold, ...(Array.isArray(threshold) ? threshold : [threshold])] });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [exitThreshold, reducedMotion, rootMargin, threshold]);

  return [ref, isVisible];
}
