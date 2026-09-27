import { useEffect, useRef, useState } from 'react';

export default function useInViewOnce({ rootMargin = '0px 0px -12% 0px', threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || !ref.current) return undefined;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin, threshold });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return [ref, isVisible];
}
