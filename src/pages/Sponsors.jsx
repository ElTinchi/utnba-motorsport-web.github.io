import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES, COMMERCIAL_CONTACT_HREF } from '../routes';
import SponsorsCarousel from '../components/SponsorsCarousel';
import FundingProgress from '../components/FundingProgress';
import EditorialReveal from '../components/EditorialReveal';
import StaggerList from '../components/StaggerList';
import '../styles/sponsors.css';

const JOURNEY_LOGOS = [
  '/assets/img/academy/rookie-utnba.png',
  '/assets/img/academy/baja-utnba.png',
  '/assets/img/logo.png',
];

function CommercialContact({ t, opportunity, closing = false }) {
  return (
    <aside data-contact-opportunity={opportunity} className={`sp-contact${closing ? ' sp-contact--closing' : ''}`}>
      <p>{t('sponsorsPage.contactPrompt')}</p>
      <a href={COMMERCIAL_CONTACT_HREF} className="btn btn--primary">
        {t('sponsorsPage.primaryCta')}
      </a>
    </aside>
  );
}

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
          <div className="sp-hero__actions">
            <a href="#alianza" className="btn btn--primary">
              {t('sponsorsPage.secondaryCta')}
            </a>
            <a href="/visor/visor.html" className="btn btn--secondary">
              {t('sponsorsPage.viewer.button')}
            </a>
          </div>
          <a href="#recorrido" className="sp-hero__scroll">
            <span>{t('sponsorsPage.scrollCta')}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </a>
        </header>
      </div>

      <EditorialReveal className="sp-proof-reveal" aria-label={t('sponsorsPage.proofLabel')}>
        <div className="sp-proof">
          <p className="sp-proof__label">{t('sponsorsPage.proofLabel')}</p>
          <SponsorsCarousel />
        </div>
      </EditorialReveal>

      <div className="sp-page__container" id="recorrido">
        <EditorialReveal as="section" className="sp-journey" aria-labelledby="journey-title">
          <div className="sp-journey__intro">
            <span className="sp-section-kicker">{t('sponsorsPage.journey.kicker')}</span>
            <h2 id="journey-title">{t('sponsorsPage.journey.title')}</h2>
            <p>{t('sponsorsPage.journey.intro')}</p>
          </div>

          <StaggerList
            as="ol"
            className="sp-journey__steps"
            itemClassName="sp-story"
            items={journey}
            renderItem={(step, index) => (
              <>
                <div className="sp-story__marker" aria-hidden="true"><span>{step.number}</span></div>
                <div className="sp-story__content">
                  <img draggable={false}
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
              </>
            )}
          />
        </EditorialReveal>

        <EditorialReveal as="section" direction="left" className="sp-investment" aria-labelledby="investment-title">
          <div className="sp-investment__copy">
            <span className="sp-section-kicker">{t('sponsorsPage.investment.kicker')}</span>
            <h2 id="investment-title">{t('sponsorsPage.investment.title')}</h2>
            <p>{t('sponsorsPage.investment.text')}</p>
          </div>
          <FundingProgress />
        </EditorialReveal>

        <CommercialContact t={t} opportunity="after-evidence" />

        <EditorialReveal as="section" className="sp-partnership" id="alianza" aria-labelledby="partnership-title">
          <div className="sp-partnership__head">
            <span className="sp-section-kicker">{t('sponsorsPage.partnership.kicker')}</span>
            <h2 id="partnership-title">{t('sponsorsPage.partnership.title')}</h2>
            <p>{t('sponsorsPage.partnership.intro')}</p>
          </div>
          <StaggerList
            as="ol"
            className="sp-partnership__steps"
            items={partnershipSteps}
            renderItem={(step, index) => (
              <>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </>
            )}
          />
          <p className="sp-partnership__note">{t('sponsorsPage.partnership.note')}</p>
        </EditorialReveal>

        <CommercialContact t={t} opportunity="after-value" />

        <EditorialReveal as="section" className="sp-viewer" id="tu-logo" aria-labelledby="viewer-title">
          <div className="sp-viewer__visual">
            <img draggable={false} src="/assets/img/render_fsae.jpg" alt={t('sponsorsPage.viewer.imageAlt')} width="1920" height="1080" loading="lazy" />
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
            </div>
            <small>{t('sponsorsPage.viewer.note')}</small>
          </div>
        </EditorialReveal>

        <CommercialContact t={t} opportunity="closing" closing />
      </div>
    </section>
  );
}
