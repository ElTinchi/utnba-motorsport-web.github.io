import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import '../styles/formulaStudent.css';

export default function FormulaStudent() {
  const { t } = useTranslation();
  const sections = t('fsPage.sections', { returnObjects: true });
  const dynamicEvents = t('fsPage.dynamicEvents', { returnObjects: true });
  const staticEvents = t('fsPage.staticEvents', { returnObjects: true });

  return (
    <section className="fs-page">
      <div className="fs-page__container">
        <NavLink to={ROUTES.home} className="fs-page__back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.backLink')}
        </NavLink>

        <span className="fs-page__kicker">{t('fsPage.kicker')}</span>
        <h1 className="fs-page__title">{t('fsPage.title')}</h1>
        <p className="fs-page__notice">{t('fsPage.adaptNotice')}</p>

        {sections.map((section) => (
          <article key={section.number} className="fs-section">
            <div className="fs-section__index">{section.number}</div>
            <div className="fs-section__content">
              <span className="fs-section__eyebrow">{section.eyebrow}</span>
              <h2 className="fs-section__title">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="fs-section__text">{p}</p>
              ))}

              {section.number === '04' && (
                <>
                  <div className="fs-events">
                    <h3 className="fs-events__title">{t('fsPage.dynamicTitle')}</h3>
                    <p className="fs-events__intro">{t('fsPage.dynamicIntro')}</p>
                    <div className="fs-events__grid">
                      {dynamicEvents.map((ev) => (
                        <article key={ev.title} className="fs-event">
                          <h4 className="fs-event__title">{ev.title}</h4>
                          <p className="fs-event__body">{ev.body}</p>
                          <p className="fs-event__score">{ev.score}</p>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="fs-events">
                    <h3 className="fs-events__title">{t('fsPage.staticTitle')}</h3>
                    <p className="fs-events__intro">{t('fsPage.staticIntro')}</p>
                    <div className="fs-events__grid">
                      {staticEvents.map((ev) => (
                        <article key={ev.title} className="fs-event">
                          <h4 className="fs-event__title">{ev.title}</h4>
                          <p className="fs-event__body">{ev.body}</p>
                          <p className="fs-event__score">{ev.score}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
