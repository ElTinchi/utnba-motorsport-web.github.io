import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useInView from '../hooks/useInView';
import useReducedMotion from '../hooks/useReducedMotion';
import { formatAnimatedValue, parseAnimatedValue } from '../utils/editorialMotion';

export default function AnimatedNumber({ value, duration = 1200, className = 'stat-value' }) {
  const { i18n } = useTranslation();
  const [ref, isVisible] = useInView({ threshold: 0.6 });
  const [current, setCurrent] = useState(0);
  const reducedMotion = useReducedMotion();
  const parsed = parseAnimatedValue(value);
  const { target } = parsed;

  useEffect(() => {
    if (!isVisible) {
      setCurrent(0);
      return undefined;
    }
    if (reducedMotion) {
      setCurrent(target);
      return undefined;
    }

    let frameId;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setCurrent(Math.round(target * (1 - ((1 - progress) ** 3))));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [duration, isVisible, reducedMotion, target]);

  return <span ref={ref} className={className}>{formatAnimatedValue(parsed, current, i18n.language)}</span>;
}
