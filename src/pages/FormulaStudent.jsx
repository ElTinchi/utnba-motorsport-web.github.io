import FormulaExplainer from '../components/FormulaExplainer.jsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import EditorialReveal from '../components/EditorialReveal';
import StaggerList from '../components/StaggerList';
import SkidPadAnimation from '../components/events/SkidPadAnimation.jsx';
import AccelerationAnimation from '../components/events/AccelerationAnimation.jsx';
import EfficiencyAnimation from '../components/events/EfficiencyAnimation.jsx';
import AutocrossAnimation from '../components/events/AutocrossAnimation.jsx';
import EnduranceAnimation from '../components/events/EnduranceAnimation.jsx';
import DesignAnimation from '../components/events/DesignAnimation.jsx';
import CostAnimation from '../components/events/CostAnimation.jsx';
import BusinessPlanAnimation from '../components/events/BusinessPlanAnimation.jsx';
import '../styles/formulaStudent.css';

// Same order in every locale's fsPage.dynamicEvents.
const DYNAMIC_ANIMATIONS = [AccelerationAnimation, SkidPadAnimation, AutocrossAnimation, EfficiencyAnimation, EnduranceAnimation];
const STATIC_ANIMATIONS = [DesignAnimation, CostAnimation, BusinessPlanAnimation];

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

        <EditorialReveal direction="left">
          <span className="fs-page__kicker">{t('fsPage.kicker')}</span>
          <h1 className="fs-page__title">{t('fsPage.title')}</h1>
          <p className="fs-page__notice">{t('fsPage.adaptNotice')}</p>
        </EditorialReveal>

        <EditorialReveal className="fs-explainer"><FormulaExplainer /></EditorialReveal>

        {sections.map((section, sectionIndex) => (
          <EditorialReveal as="article" direction={sectionIndex % 2 === 0 ? 'left' : 'right'} key={section.number} className="fs-section">
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
                    <StaggerList as="div" itemAs="article" className="fs-events__grid" itemClassName="fs-event" items={dynamicEvents} renderItem={(ev, i) => {
                        const Animation = DYNAMIC_ANIMATIONS[i];
                        return (
                          <>
                            <div className="fs-event__text">
                              <h4 className="fs-event__title">{ev.title}</h4>
                              <p className="fs-event__body">{ev.body}</p>
                              <p className="fs-event__score">{ev.score}</p>
                            </div>
                            {Animation && <Animation />}
                          </>
                        );
                      }} />
                  </div>

                  <div className="fs-events">
                    <h3 className="fs-events__title">{t('fsPage.staticTitle')}</h3>
                    <p className="fs-events__intro">{t('fsPage.staticIntro')}</p>
                    <StaggerList as="div" itemAs="article" className="fs-events__grid" itemClassName="fs-event" items={staticEvents} renderItem={(ev, i) => {
                        const Animation = STATIC_ANIMATIONS[i];
                        return (
                          <>
                            <div className="fs-event__text">
                              <h4 className="fs-event__title">{ev.title}</h4>
                              <p className="fs-event__body">{ev.body}</p>
                              <p className="fs-event__score">{ev.score}</p>
                            </div>
                            {Animation && <Animation />}
                          </>
                        );
                      }} />
                  </div>
                </>
              )}
            </div>
          </EditorialReveal>
        ))}
      </div>
    </section>
  );
}

