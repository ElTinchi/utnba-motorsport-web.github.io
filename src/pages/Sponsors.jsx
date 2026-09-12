import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES, CONTACT_HREF } from '../routes';
import SponsorsCarousel from '../components/SponsorsCarousel';
import FundingProgress from '../components/FundingProgress';
import '../styles/sponsors.css';

const JOURNEY_LOGOS = [
  '/assets/img/academy/rookie-utnba.png',
  '/assets/img/academy/baja-utnba.png',
  '/assets/img/logo.png',
];

export default function Sponsors() {
  const { t } = useTranslation();
  const journey = t('sponsorsPage.journey.items', { returnObjects: true });
  const partnershipSteps = t('sponsorsPage.partnership.steps', { returnObjects: true });
  const sizes = t('sponsorsPage.viewer.sizes', { returnObjects: true });

  return (
    <section className="sp-page">
      <div className="sp-page__container">
        <NavLink to={ROUTES.home} className="sp-page__back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.backLink')}
        </NavLink>

        <header className="sp-hero">
          <span className="sp-page__kicker">{t('sponsorsPage.kicker')}</span>
          <h1 className="sp-page__title">{t('sponsorsPage.title')}</h1>
          <p className="sp-page__intro">{t('sponsorsPage.intro')}</p>
          <a href="#tu-logo" className="btn btn--primary">
            {t('sponsorsPage.logoCta')}
          </a>
          <a href="#recorrido" className="sp-hero__scroll">
            <span>{t('sponsorsPage.scrollCta')}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </a>
        </header>
      </div>

      <div className="sp-proof" aria-label={t('sponsorsPage.proofLabel')}>
        <p className="sp-proof__label">{t('sponsorsPage.proofLabel')}</p>
        <SponsorsCarousel speed={45} />
      </div>

      <div className="sp-page__container" id="recorrido">
        <section className="sp-journey" aria-labelledby="journey-title">
          <div className="sp-journey__intro">
            <span className="sp-section-kicker">{t('sponsorsPage.journey.kicker')}</span>
            <h2 id="journey-title">{t('sponsorsPage.journey.title')}</h2>
            <p>{t('sponsorsPage.journey.intro')}</p>
          </div>

          <ol className="sp-journey__steps">
            {journey.map((step, index) => (
              <li className="sp-story" key={step.number}>
                <div className="sp-story__marker" aria-hidden="true"><span>{step.number}</span></div>
                <div className="sp-story__content">
                  <img
                    className={`sp-story__logo sp-story__logo--${index + 1}`}
                    src={JOURNEY_LOGOS[index]}
                    alt={step.logoAlt}
                    loading="lazy"
                  />
                  <span className="sp-story__stage">{step.stage}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <span className="sp-story__outcome">{step.outcome}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="sp-investment" aria-labelledby="investment-title">
          <div className="sp-investment__copy">
            <span className="sp-section-kicker">{t('sponsorsPage.investment.kicker')}</span>
            <h2 id="investment-title">{t('sponsorsPage.investment.title')}</h2>
            <p>{t('sponsorsPage.investment.text')}</p>
          </div>
          <FundingProgress />
        </section>

        <section className="sp-partnership" aria-labelledby="partnership-title">
          <div className="sp-partnership__head">
            <span className="sp-section-kicker">{t('sponsorsPage.partnership.kicker')}</span>
            <h2 id="partnership-title">{t('sponsorsPage.partnership.title')}</h2>
            <p>{t('sponsorsPage.partnership.intro')}</p>
          </div>
          <ol className="sp-partnership__steps">
            {partnershipSteps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="sp-partnership__note">{t('sponsorsPage.partnership.note')}</p>
        </section>

        <section className="sp-viewer" id="tu-logo" aria-labelledby="viewer-title">
          <div className="sp-viewer__visual">
            <img src="/assets/img/render_fsae.jpg" alt={t('sponsorsPage.viewer.imageAlt')} width="1920" height="1080" loading="lazy" />
            <span className="sp-viewer__badge">{t('sponsorsPage.viewer.badge')}</span>
            <div className="sp-viewer__sizes" aria-hidden="true">
              {sizes.map((size) => <span key={size}>{size}</span>)}
            </div>
          </div>
          <div className="sp-viewer__copy">
            <span className="sp-section-kicker">{t('sponsorsPage.viewer.kicker')}</span>
            <p className="sp-viewer__arrival">{t('sponsorsPage.viewer.arrival')}</p>
            <h2 id="viewer-title">{t('sponsorsPage.viewer.title')}</h2>
            <p>{t('sponsorsPage.viewer.text')}</p>
            <div className="sp-viewer__actions">
              <a href="/visor/visor.html" className="btn btn--primary">{t('sponsorsPage.viewer.button')}</a>
              <a href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">{t('sponsorsPage.ctaButton')}</a>
            </div>
            <small>{t('sponsorsPage.viewer.note')}</small>
          </div>
        </section>
      </div>
    </section>
  );
}
