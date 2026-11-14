import FormulaCarArt from '../components/FormulaCarArt.jsx';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES, COMMERCIAL_CONTACT_HREF } from '../routes';
import SponsorsCarousel from '../components/SponsorsCarousel';
import FundingProgress from '../components/FundingProgress';
import ScrollCar from '../components/ScrollCar';
import SponsorPhotoStory from '../components/SponsorPhotoStory';
import CarScrollScene from '../components/CarScrollScene';
import HeroArtwork from '../components/HeroArtwork';
import AnimatedNumber from '../components/AnimatedNumber';
import EditorialReveal from '../components/EditorialReveal';
import StaggerList from '../components/StaggerList';
import '../styles/home.css';
import SunsetInvitation from '../components/SunsetInvitation';
import { TRACK_PATH, CAR_KEY_POINTS, CAR_KEY_TIMES } from '../data/track.js';

const ACADEMY_LOGOS = [
  '/assets/img/academy/rookie-utnba.png',
  '/assets/img/academy/baja-utnba.png',
  '/assets/img/logo.png',
];

export default function Home() {
  const { t } = useTranslation();
  const academyLevels = t('home.academy.levels', { returnObjects: true });
  const academyStats = t('home.academy.stats', { returnObjects: true });
  const circuitSvgRef = useRef(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const pause = preference.matches || document.hidden || window.scrollY >= window.innerHeight;
      if (pause) circuitSvgRef.current?.pauseAnimations?.();
      else circuitSvgRef.current?.unpauseAnimations?.();
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    document.addEventListener('visibilitychange', update);
    preference.addEventListener('change', update);
    return () => {
      window.removeEventListener('scroll', update);
      document.removeEventListener('visibilitychange', update);
      preference.removeEventListener('change', update);
    };
  }, []);

  return (
    <>
      <ScrollCar circuitRef={circuitSvgRef} />
      {/* Portada: render visible y circuito que da origen al auto guía. */}
      <section className="hero hero--cinematic" aria-label="UTN BA Motorsport">
        <span className="hero__ignition" aria-hidden="true" />
        <div className="hero__circuit" aria-hidden="true">
          <svg ref={circuitSvgRef} viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg">
            <g className="hero__track">
              {/* Curbes (borde rojo/blanco), apenas asoman detrás del asfalto */}
              <path d={TRACK_PATH} className="hero__track-curb hero__track-curb--white" />
              <path d={TRACK_PATH} className="hero__track-curb hero__track-curb--red" />
              {/* Asfalto */}
              <path d={TRACK_PATH} className="hero__track-road" />
              {/* Línea central punteada */}
              <path d={TRACK_PATH} className="hero__track-line" />
            </g>

            {/* Línea de largada: queda sobre el tramo que pasa por debajo del
                isotipo, en el punto elegido como inicio visual de la vuelta. */}
            <g className="hero__start-line" transform="translate(462 363) rotate(49)">
              {Array.from({ length: 8 }, (_, index) => (
                <rect
                  key={index}
                  x={index % 2 === 0 ? -22 : 0}
                  y={-12 + Math.floor(index / 2) * 6}
                  width="22"
                  height="6"
                  className={index % 4 === 0 || index % 4 === 3 ? 'hero__start-tile--light' : 'hero__start-tile--dark'}
                />
              ))}
            </g>

            {/* Recorrido del auto: mismo trazado, sin pintar */}
            <path id="hero-track-line" d={TRACK_PATH} fill="none" stroke="none" />

            <FormulaCarArt className="hero__car">
              <animateMotion
                dur="38.04s"
                begin="-19.77s"
                repeatCount="indefinite"
                rotate="auto-reverse"
                calcMode="linear"
                keyPoints={CAR_KEY_POINTS}
                keyTimes={CAR_KEY_TIMES}
              >
                <mpath xlinkHref="#hero-track-line" />
              </animateMotion>
            </FormulaCarArt>
          </svg>
        </div>

        <HeroArtwork />
        <div className="hero__content">
          <img draggable={false} src="/assets/img/logo.png" alt="UTN BA Motorsport" className="hero__logo" width="440" height="86" />

          <h1 className="hero__title">{t('cinematic.heroTitle')}</h1>
          <p className="hero__description">{t('cinematic.heroIntro')}</p>
          <div className="hero__actions">
            <a href={COMMERCIAL_CONTACT_HREF} className="btn btn--primary">{t('sponsorsPage.primaryCta')}</a>
            <a href="#auto-en-movimiento" className="hero__explore">{t('home.heroCtaCar')} <span aria-hidden="true">↓</span></a>
            <NavLink to={ROUTES.aboutFormulaStudent} className="hero__explore">{t('home.heroCtaFormula')} <span aria-hidden="true">→</span></NavLink>
          </div>
        </div>
        <a href="#que-hacemos" className="hero__scroll-cue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 3v17m-6-6 6 6 6-6" /></svg>
          {t('cinematic.scrollCue')}
        </a>
      </section>

      {/* El contenido sube y tapa el hero fijo al scrollear */}
      <div className="page">
        <section className="project-explainer" id="que-hacemos" aria-labelledby="what-we-do-title">
          <EditorialReveal className="project-explainer__intro">
            <span className="project-explainer__kicker">{t('cinematic.explainer.kicker')}</span>
            <h2 id="what-we-do-title">{t('cinematic.explainer.title')}</h2>
            <p>{t('cinematic.explainer.text')}</p>
          </EditorialReveal>
          <StaggerList
            as="ol"
            className="project-explainer__steps"
            itemClassName="project-explainer__step"
            interval={100}
            items={t('cinematic.explainer.steps', { returnObjects: true })}
            renderItem={step => <><h3>{step.title}</h3><p>{step.text}</p></>}
          />
        </section>
        <CarScrollScene />

        {/* ====== Mini-secciones: motivación, sobre nosotros, Fórmula Student, cómo unirte ====== */}
        <SponsorPhotoStory />
        <section className="project-bridge">
          <h2>{t('cinematic.teamTitle')}</h2>
          <div><p>{t('home.heroSubtitle')}</p>
            <NavLink to={ROUTES.team} className="btn btn--secondary">{t('home.heroCtaSecondary')}</NavLink>
          </div>
        </section>

        {/* ====== Academia: 3 categorías (resumen, detalle completo en /motorsport) ====== */}
        <section className="academy" aria-labelledby="academy-title">
          <div className="academy__container">
            <span className="academy__kicker">{t('home.academy.kicker')}</span>
            <h2 id="academy-title" className="academy__title">{t('home.academy.title')}</h2>
            <p className="academy__intro">{t('home.academy.intro')}</p>

            <div className="academy__levels">
              {academyLevels.map((level, index) => (
                <article
                  key={level.title}
                  className="academy-level"
                >
                  <img draggable={false}
                    className={`academy-level__logo academy-level__logo--${index + 1}`}
                    src={ACADEMY_LOGOS[index]}
                    alt={level.logoAlt}
                    loading="lazy"
                  />
                  <span className="academy-level__number">{level.number || level.badge}</span>
                  <h3 className="academy-level__title">{level.title}</h3>
                  <p className="academy-level__body">{level.body}</p>
                </article>
              ))}
            </div>

            <div className="academy__stats">
              <div className="stat-grid">
                {academyStats.map((stat) => (
                  <div key={stat.label} className="stat-item">
                    <AnimatedNumber value={stat.value} />
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <NavLink to={ROUTES.academy} className="academy__cta">
              {t('home.academy.cta')}
            </NavLink>
          </div>
        </section>
        <SunsetInvitation />

        {/* ====== Sponsors: la misma banda blanca que la página de Sponsors ====== */}
        <section className="home-sponsors" aria-labelledby="home-sponsors-title">
          <div className="home-sponsors__story">
            <span className="home-sponsors__kicker">{t('home.sponsorsKicker')}</span>
            <h2 id="home-sponsors-title" className="home-sponsors__headline">{t('home.sponsorsHeadline')}</h2>
            <p>{t('home.sponsorsBody')}</p>
            <FundingProgress compact />
            <a href={COMMERCIAL_CONTACT_HREF} className="btn btn--primary">{t('sponsorsPage.primaryCta')}</a>
          </div>
          <h3 className="home-sponsors__title">{t('home.sponsorsTitle')}</h3>
          <SponsorsCarousel />
          <NavLink to={ROUTES.sponsors} className="home-sponsors__link">
            {t('home.sponsorsLink')}
          </NavLink>
        </section>
      </div>
    </>
  );
}
