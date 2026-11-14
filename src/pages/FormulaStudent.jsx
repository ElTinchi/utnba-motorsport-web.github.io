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

const points = score => Number(String(score).match(/\d+/)?.[0] || 0);

function EventList({ events, animations }) {
  return <StaggerList as="div" itemAs="article" className="fs-events__grid" itemClassName="fs-event" items={events} renderItem={(ev, i) => {
    const Animation = animations[i];
    return (
      <>
        <div className="fs-event__text">
          <h3 className="fs-event__title">{ev.title}</h3>
          <p className="fs-event__body">{ev.body}</p>
          <p className="fs-event__score">{ev.score}</p>
        </div>
        {Animation && <Animation />}
      </>
    );
  }} />;
}

// Order: what you see first is the competition itself (the events, animated);
// the background (what the car is, why students, why sponsors) comes after, folded.
export default function FormulaStudent() {
  const { t } = useTranslation();
  const sections = t('fsPage.sections', { returnObjects: true });
  const dynamicEvents = t('fsPage.dynamicEvents', { returnObjects: true });
  const staticEvents = t('fsPage.staticEvents', { returnObjects: true });
  const total = [...dynamicEvents, ...staticEvents].reduce((sum, e) => sum + points(e.score), 0);

  return (
    <section className="fs-page">
      <div className="fs-page__container">
        <NavLink to={ROUTES.home} className="fs-page__back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.backLink')}
        </NavLink>

        <EditorialReveal direction="left" className="fs-hero">
          <span className="fs-page__kicker">{t('fsPage.kicker')}</span>
          <h1 className="fs-page__title">{t('fsPage.title')}</h1>
          <p className="fs-hero__lead">{t('fsPage.lead')}</p>
          <dl className="fs-hero__stats">
            <div><dt>{t('stand.statEvents')}</dt><dd>{dynamicEvents.length + staticEvents.length}</dd></div>
            <div><dt>{t('stand.statPoints')}</dt><dd>{total}</dd></div>
            <div><dt>{t('stand.statGoal')}</dt><dd>2027</dd></div>
          </dl>
          <nav className="fs-hero__jump" aria-label={t('fsPage.jumpLabel')}>
            <a href="#pruebas-dinamicas">{t('fsPage.dynamicTitle')}</a>
            <a href="#pruebas-estaticas">{t('fsPage.staticTitle')}</a>
            <a href="#entenderlo">{t('fsPage.learnTitle')}</a>
          </nav>
        </EditorialReveal>

        <section id="pruebas-dinamicas" className="fs-events" aria-labelledby="fs-dynamic-title">
          <h2 id="fs-dynamic-title" className="fs-events__title">{t('fsPage.dynamicTitle')}</h2>
          <p className="fs-events__intro">{t('fsPage.dynamicIntro')}</p>
          <EventList events={dynamicEvents} animations={DYNAMIC_ANIMATIONS} />
        </section>

        <section id="pruebas-estaticas" className="fs-events" aria-labelledby="fs-static-title">
          <h2 id="fs-static-title" className="fs-events__title">{t('fsPage.staticTitle')}</h2>
          <p className="fs-events__intro">{t('fsPage.staticIntro')}</p>
          <EventList events={staticEvents} animations={STATIC_ANIMATIONS} />
        </section>

        <section id="entenderlo" className="fs-learn" aria-labelledby="fs-learn-title">
          <h2 id="fs-learn-title" className="fs-events__title">{t('fsPage.learnTitle')}</h2>
          <EditorialReveal className="fs-explainer"><FormulaExplainer /></EditorialReveal>
          {sections.filter(section => section.number !== '04').map(section => (
            <details key={section.number} className="fs-faq">
              <summary>
                <span className="fs-section__eyebrow">{section.eyebrow}</span>
                <span className="fs-faq__question">{section.title}</span>
              </summary>
              {section.paragraphs.map((p, i) => <p key={i} className="fs-section__text">{p}</p>)}
            </details>
          ))}
          <p className="fs-page__notice">{t('fsPage.adaptNotice')}</p>
        </section>
      </div>
    </section>
  );
}
