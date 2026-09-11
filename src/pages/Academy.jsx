import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import '../styles/academy.css';

const CATEGORY_LOGOS = [
  '/assets/img/academy/rookie-utnba.png',
  '/assets/img/academy/baja-utnba.png',
  '/assets/img/logo.png',
];

export default function Academy() {
  const { t } = useTranslation();
  const sections = t('motorsportPage.sections', { returnObjects: true });
  const stats = t('motorsportPage.stats', { returnObjects: true });
  const sources = t('motorsportPage.sources', { returnObjects: true });

  return (
    <section className="ms-page">
      <div className="ms-page__container">
        <NavLink to={ROUTES.home} className="ms-page__back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.backLink')}
        </NavLink>

        <span className="ms-page__kicker">{t('motorsportPage.kicker')}</span>
        <h1 className="ms-page__title">{t('motorsportPage.title')}</h1>
        <p className="ms-page__intro">{t('motorsportPage.intro')}</p>

        {sections.map((section, index) => (
          <article
            key={section.number}
            className={`ms-section${section.parallel ? ' ms-section--parallel' : ''}`}
          >
            <div className="ms-section__index">{section.number}</div>
            <div className="ms-section__content">
              <img
                className={`ms-section__logo ms-section__logo--${index + 1}`}
                src={CATEGORY_LOGOS[index]}
                alt={section.logoAlt}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <span className="ms-section__eyebrow">{section.eyebrow}</span>
              <h2 className="ms-section__title">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="ms-section__text">{p}</p>
              ))}

              {section.number === '03' && (
                <>
                  <div className="ms-stats">
                    <h3 className="ms-stats__title">{t('motorsportPage.statsTitle')}</h3>
                    <div className="stat-grid">
                      {stats.map((stat) => (
                        <div key={stat.label} className="stat-item">
                          <span className="stat-value">{stat.value}</span>
                          <span className="stat-label">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="stat-note">{t('motorsportPage.statsNote')}</p>
                  </div>

                  <NavLink to={ROUTES.aboutFormulaStudent} className="ms-section__link">
                    {t('motorsportPage.fsLink')}
                  </NavLink>
                </>
              )}
            </div>
          </article>
        ))}

        <div className="ms-sources">
          <h3 className="ms-sources__title">{t('motorsportPage.sourcesLabel')}</h3>
          <ul className="ms-sources__list">
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="ms-sources__link">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
