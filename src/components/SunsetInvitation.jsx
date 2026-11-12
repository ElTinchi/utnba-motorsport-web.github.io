import { useTranslation } from 'react-i18next';
import { DINNER_EVENT_HREF } from '../routes';
import '../styles/dinner.css';

export default function SunsetInvitation() {
  const { t } = useTranslation();

  return (
    <section className="dinner-banner" id="cena" aria-labelledby="dinner-title">
      <div className="dinner-banner__art" aria-hidden="true">
        <div className="dinner-banner__sun" />
        <svg className="dinner-banner__scene" viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M79 190h262M111 194l-9 74m207-74 9 74" />
            <path d="M40 165v58h49m-39 0-9 45m39-45 9 45M380 165v58h-49m39 0 9 45m-39-45-9 45" />
            <path d="M112 154c0 19 5 25 13 25s13-6 13-25h-26Zm13 25v11m-9 0h18M272 154c0 19 5 25 13 25s13-6 13-25h-26Zm13 25v11m-9 0h18" strokeWidth="5" />
          </g>
          <g fill="currentColor"><circle cx="122" cy="144" r="2.5"/><circle cx="130" cy="136" r="2"/><circle cx="284" cy="143" r="2.5"/><circle cx="291" cy="134" r="2"/></g>
        </svg>
      </div>
      <div className="dinner-banner__content">
        <span className="dinner-banner__kicker">{t('dinner.kicker')}</span>
        <h2 id="dinner-title">{t('dinner.title')}</h2>
        <p>{t('dinner.body')}</p>
        <a href={DINNER_EVENT_HREF} className="dinner-banner__cta">
          {t('dinner.cta')} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
