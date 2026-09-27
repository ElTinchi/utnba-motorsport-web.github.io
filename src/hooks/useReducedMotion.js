import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function getReducedMotionPreference(mediaQueryList) {
  return Boolean(mediaQueryList?.matches);
}

function getMediaQueryList() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY)
    : undefined;
}

export default function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => (
    getReducedMotionPreference(getMediaQueryList())
  ));

  useEffect(() => {
    const mediaQueryList = getMediaQueryList();
    if (!mediaQueryList) return undefined;

    const updatePreference = (event) => setReducedMotion(getReducedMotionPreference(event));
    setReducedMotion(getReducedMotionPreference(mediaQueryList));

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', updatePreference);
      return () => mediaQueryList.removeEventListener('change', updatePreference);
    }

    mediaQueryList.addListener?.(updatePreference);
    return () => mediaQueryList.removeListener?.(updatePreference);
  }, []);

  return reducedMotion;
}
