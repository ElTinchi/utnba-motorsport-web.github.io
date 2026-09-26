import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useInView from '../hooks/useInView';

function splitValue(value) {
  const firstDigit = value.search(/\d/);
  const lastDigit = Math.max(...Array.from(value, (_, index) => /\d/.test(value[index]) ? index : -1));
  return {
    target: Number(value.replace(/\D/g, '')),
    prefix: value.slice(0, firstDigit),
    suffix: value.slice(lastDigit + 1),
    grouped: /[.,]/.test(value),
  };
}

export default function AnimatedNumber({ value }) {
  const { i18n } = useTranslation();
  const [ref, isVisible] = useInView({ threshold: 0.6 });
  const [current, setCurrent] = useState(0);
  const { target, prefix, suffix, grouped } = splitValue(value);

  useEffect(() => {
    if (!isVisible) {
      setCurrent(0);
      return undefined;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target);
      return undefined;
    }

    let frameId;
    const duration = 1200;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setCurrent(Math.round(target * (1 - ((1 - progress) ** 3))));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, target]);

  const number = grouped
    ? new Intl.NumberFormat(i18n.language).format(current)
    : String(current);

  return <span ref={ref} className="stat-value">{prefix}{number}{suffix}</span>;
}
