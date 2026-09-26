import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useInViewOnce from '../hooks/useInViewOnce';
import '../styles/funding-progress.css';

const FUNDING_SEGMENTS = [
  { key: 'confirmed', exact: 62, display: '62%' },
  { key: 'materials', exact: 18.45, display: '18%' },
  { key: 'funding', exact: 19.55, display: '20%' },
];

export default function FundingProgress({ compact = false }) {
  const { t } = useTranslation();
  const [progressRef, isVisible] = useInViewOnce({ threshold: 0.35 });
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    if (!isVisible) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayPercent(62);
      return undefined;
    }

    let frameId;
    const duration = 1100;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      setDisplayPercent(Math.round(62 * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible]);

  return (
    <div ref={progressRef} className={`funding-progress${compact ? ' funding-progress--compact' : ''}${isVisible ? ' funding-progress--visible' : ''}`}>
      <div className="funding-progress__headline">
        <strong>{displayPercent}%</strong>
        <span>{t('sponsorsPage.investment.confirmedLabel')}</span>
      </div>
      <div
        className="funding-progress__bar"
        role="img"
        aria-label={t('sponsorsPage.investment.progressAria')}
      >
        {FUNDING_SEGMENTS.map((segment) => (
          <span
            key={segment.key}
            className={`funding-progress__segment funding-progress__segment--${segment.key}`}
            style={{ flexBasis: `${segment.exact}%` }}
          />
        ))}
      </div>
      <dl className="funding-progress__legend">
        {FUNDING_SEGMENTS.map((segment) => (
          <div key={segment.key}>
            <dt><i className={`funding-progress__key funding-progress__key--${segment.key}`} />{segment.display}</dt>
            <dd>{t(`sponsorsPage.investment.${segment.key}Short`)}</dd>
          </div>
        ))}
      </dl>
      <small className="funding-progress__amount">{t('sponsorsPage.investment.amountNote')}</small>
    </div>
  );
}
