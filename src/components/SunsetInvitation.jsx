import { useTranslation } from 'react-i18next';
import { DINNER_EVENT_HREF } from '../routes';
import '../styles/dinner.css';

export default function SunsetInvitation() {
  const { t } = useTranslation();

  return (
    <section className="dinner-banner" id="cena" aria-labelledby="dinner-title">
      <div className="dinner-banner__art" aria-hidden="true"><span /></div>
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
