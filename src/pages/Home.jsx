import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import AreasGrid from '../components/AreasGrid';
import SponsorsCarousel from '../components/SponsorsCarousel';
import '../styles/home.css';

// ============================================================
// Circuito del hero — trazado y perfil de velocidad
// ============================================================
// El trazado original estaba dibujado a mano y se le notaban los quiebres
// entre tramos. Este es el mismo circuito re-generado: se muestreó el path
// viejo, se suavizó (Chaikin + promedio gaussiano sobre la polilínea cerrada)
// y se reconstruyó como spline Catmull-Rom cerrada — de ahí que sean 44 curvas
// C encadenadas, todas con continuidad de tangente. viewBox 0 0 1000 700.
const TRACK_PATH =
  'M102.91,76.66 C102.87,60.13 116.05,41.87 130.20,31.53 C144.35,21.19 171.96,11.00 ' +
  '187.81,14.64 C203.65,18.28 226.68,41.69 225.29,53.37 C223.91,65.06 185.28,71.00 ' +
  '179.51,84.75 C173.74,98.50 181.60,120.41 190.68,135.89 C199.76,151.36 217.43,167.04 ' +
  '233.99,177.59 C250.55,188.14 273.98,188.06 290.04,199.19 C306.09,210.32 318.15,228.32 ' +
  '330.34,244.35 C342.52,260.39 351.40,278.97 363.13,295.42 C374.86,311.87 386.63,329.67 ' +
  '400.70,343.06 C414.76,356.44 432.33,376.92 447.51,375.73 C462.69,374.54 477.82,350.21 ' +
  '491.79,335.89 C505.76,321.58 518.20,305.23 531.34,289.85 C544.49,274.47 556.56,258.01 ' +
  '570.68,243.62 C584.80,229.23 599.16,213.76 616.07,203.51 C632.98,193.26 652.94,183.90 ' +
  '672.14,182.13 C691.35,180.35 712.65,186.09 731.30,192.85 C749.95,199.61 767.22,211.58 ' +
  '784.05,222.69 C800.87,233.80 819.75,244.57 832.25,259.51 C844.75,274.45 858.23,294.33 ' +
  '859.04,312.32 C859.85,330.32 847.32,350.57 837.12,367.47 C826.92,384.38 812.05,399.46 ' +
  '797.84,413.74 C783.63,428.02 768.83,442.91 751.84,453.16 C734.85,463.41 714.98,473.73 ' +
  '695.89,475.23 C676.80,476.72 655.57,469.74 637.29,462.12 C619.01,454.50 602.96,440.68 ' +
  '586.21,429.50 C569.46,418.33 553.79,397.03 536.79,395.07 C519.80,393.11 493.94,404.85 ' +
  '484.22,417.75 C474.50,430.65 472.89,455.78 478.48,472.47 C484.08,489.16 507.03,501.33 ' +
  '517.79,517.88 C528.54,534.44 542.09,553.81 543.01,571.78 C543.94,589.76 536.35,615.92 ' +
  '523.32,625.74 C510.29,635.56 482.44,636.04 464.84,630.73 C447.24,625.41 430.28,608.93 ' +
  '417.71,593.87 C405.14,578.82 398.31,558.51 389.39,540.39 C380.47,522.27 373.71,502.97 ' +
  '364.19,485.18 C354.67,467.38 343.14,450.66 332.26,433.61 C321.39,416.56 310.07,399.78 ' +
  '298.94,382.89 C287.81,366.00 276.97,348.89 265.46,332.25 C253.96,315.60 241.53,299.60 ' +
  '229.93,283.02 C218.33,266.45 207.24,249.52 195.86,232.80 C184.47,216.08 172.53,199.71 ' +
  '161.62,182.70 C150.72,165.69 140.22,148.41 130.43,130.73 C120.65,113.06 102.95,93.20 ' +
  '102.91,76.66 Z';

// Perfil de velocidad del auto, calculado sobre la curvatura real del trazado
// (no a ojo): en cada punto el límite es v = sqrt(a_lat / k), después una
// pasada hacia atrás mete la FRENADA antes de entrar a la curva y una pasada
// hacia adelante limita la ACELERACIÓN a la salida. Frenar es más corto y más
// brusco que acelerar, así que la frenada se siente justo en la entrada y la
// salida es progresiva. La relación entre la punta y la horquilla más cerrada
// es de ~2,8x.
//
// keyPoints avanza en fracciones iguales de recorrido; keyTimes dice en qué
// fracción del tiempo se llega a cada una — ahí vive todo el perfil.
// Si se toca TRACK_PATH hay que volver a generar estos dos arrays.
const CAR_KEY_POINTS =
  '0.0000;0.0111;0.0222;0.0333;0.0444;0.0556;0.0667;0.0778;0.0889;0.1000;0.1111;0.1222;0.1333;0' +
  '.1444;0.1556;0.1667;0.1778;0.1889;0.2000;0.2111;0.2222;0.2333;0.2444;0.2556;0.2667;0.2778;0.' +
  '2889;0.3000;0.3111;0.3222;0.3333;0.3444;0.3556;0.3667;0.3778;0.3889;0.4000;0.4111;0.4222;0.4' +
  '333;0.4444;0.4556;0.4667;0.4778;0.4889;0.5000;0.5111;0.5222;0.5333;0.5444;0.5556;0.5667;0.57' +
  '78;0.5889;0.6000;0.6111;0.6222;0.6333;0.6444;0.6556;0.6667;0.6778;0.6889;0.7000;0.7111;0.722' +
  '2;0.7333;0.7444;0.7556;0.7667;0.7778;0.7889;0.8000;0.8111;0.8222;0.8333;0.8444;0.8556;0.8667' +
  ';0.8778;0.8889;0.9000;0.9111;0.9222;0.9333;0.9444;0.9556;0.9667;0.9778;0.9889;1.0000';

const CAR_KEY_TIMES =
  '0.0000;0.0172;0.0314;0.0424;0.0541;0.0710;0.0885;0.1061;0.1207;0.1383;0.1545;0.1664;0.1778;0' +
  '.1921;0.2055;0.2175;0.2274;0.2359;0.2435;0.2505;0.2581;0.2677;0.2821;0.3000;0.3142;0.3252;0.' +
  '3344;0.3425;0.3498;0.3566;0.3637;0.3721;0.3828;0.3944;0.4054;0.4148;0.4231;0.4306;0.4381;0.4' +
  '473;0.4592;0.4738;0.4879;0.4995;0.5091;0.5175;0.5250;0.5327;0.5419;0.5534;0.5662;0.5764;0.58' +
  '52;0.5932;0.6025;0.6160;0.6336;0.6499;0.6658;0.6824;0.6984;0.7120;0.7232;0.7377;0.7506;0.766' +
  '9;0.7840;0.7982;0.8115;0.8233;0.8331;0.8422;0.8506;0.8582;0.8651;0.8716;0.8791;0.8871;0.8945' +
  ';0.9012;0.9076;0.9147;0.9233;0.9321;0.9399;0.9473;0.9559;0.9677;0.9792;0.9887;1.0000';

export default function Home() {
  const { t } = useTranslation();
  const academyLevels = t('home.academy.levels', { returnObjects: true });
  const academyStats = t('home.academy.stats', { returnObjects: true });
  const circuitSvgRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      circuitSvgRef.current?.pauseAnimations?.();
    }
  }, []);

  return (
    <>
      {/* ====== HERO - Auto difuminado de fondo + logo ====== */}
      <section className="hero" aria-label="UTN BA Motorsport">
        <div className="hero__bg">
          <img
            src="/assets/img/render_fsae.jpg"
            alt="Monoplaza Fórmula SAE eléctrico de UTN BA Motorsport"
            className="hero__bg-img"
            width="1920"
            height="1080"
            loading="eager"
          />
          <div className="hero__overlay" aria-hidden="true"></div>
        </div>

        {/* ====== Circuito animado alrededor del logo (capa intermedia) ======
             Va difuminado y a baja opacidad a propósito: es ambiente, el que
             tiene que ganar la mirada es el logo. */}
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

            {/* Recorrido del auto: mismo trazado, sin pintar */}
            <path id="hero-track-line" d={TRACK_PATH} fill="none" stroke="none" />

            <g className="hero__car">
              <path
                d="M-18,-8 L10,-8 Q18,-8 18,0 Q18,8 10,8 L-18,8 Q-20,8 -20,0 Q-20,-8 -18,-8 Z"
                className="hero__car-body"
              />
              <rect x="-3.3" y="-5" width="13" height="10" rx="3.3" className="hero__car-glass" />
              <animateMotion
                dur="26s"
                repeatCount="indefinite"
                rotate="auto"
                calcMode="linear"
                keyPoints={CAR_KEY_POINTS}
                keyTimes={CAR_KEY_TIMES}
              >
                <mpath xlinkHref="#hero-track-line" />
              </animateMotion>
            </g>
          </svg>
        </div>

        <div className="hero__content">
          <img src="/assets/img/logo.png" alt="UTN BA Motorsport" className="hero__logo" width="440" height="86" />
          <span className="hero__tagline">{t('home.heroPlate')}</span>
        </div>
      </section>

      {/* El contenido sube y tapa el hero fijo al scrollear */}
      <div className="page">
        <section className="intro" aria-labelledby="intro-title">
          <div className="intro__glow" aria-hidden="true"></div>
          <div className="intro__container">
            <h1 id="intro-title" className="intro__title">
              {t('home.heroTitle')}
            </h1>
            <p className="intro__description">{t('home.heroSubtitle')}</p>

            <div className="intro__actions">
              <a href="mailto:motorsports@frba.utn.edu.ar" className="btn btn--primary">
                {t('home.heroCtaPrimary')}
              </a>
              <NavLink to={ROUTES.team} className="btn btn--secondary">
                {t('home.heroCtaSecondary')}
              </NavLink>
            </div>
          </div>
        </section>

        {/* ====== Mini-secciones: motivación, sobre nosotros, Fórmula Student, cómo unirte ====== */}
        <section className="home-highlights" aria-label="Quiénes somos y qué es Fórmula Student">
          <div className="home-highlights__container">
            <article className="home-highlight">
              <h2 className="home-highlight__title">{t('home.motivationTitle')}</h2>
              <p className="home-highlight__body">{t('home.motivationBody')}</p>
            </article>

            <article className="home-highlight">
              <h2 className="home-highlight__title">{t('home.aboutTitle')}</h2>
              <p className="home-highlight__body">{t('home.aboutBody')}</p>
            </article>

            <article className="home-highlight">
              <h2 className="home-highlight__title">{t('home.formulaStudentTitle')}</h2>
              <p className="home-highlight__body">{t('home.formulaStudentBody')}</p>
              <NavLink to={ROUTES.aboutFormulaStudent} className="home-highlight__link">
                {t('home.formulaStudentLink')}
              </NavLink>
            </article>

            <article className="home-highlight">
              <h2 className="home-highlight__title">{t('home.joinTitle')}</h2>
              <p className="home-highlight__body">{t('home.joinBody')}</p>
              <NavLink to={ROUTES.joinUs} className="home-highlight__link">
                {t('home.joinLink')}
              </NavLink>
            </article>
          </div>
        </section>

        {/* ====== Las 6 áreas del equipo ====== */}
        <section className="areas" aria-labelledby="areas-title">
          <div className="areas__container">
            <span className="areas__kicker">{t('home.areas.kicker')}</span>
            <h2 id="areas-title" className="areas__title">{t('home.areas.title')}</h2>
            <p className="areas__intro">{t('home.areas.intro')}</p>
            <AreasGrid />
          </div>
        </section>

        {/* ====== Academia: 3 categorías (resumen, detalle completo en /motorsport) ====== */}
        <section className="academy" aria-labelledby="academy-title">
          <div className="academy__container">
            <span className="academy__kicker">{t('home.academy.kicker')}</span>
            <h2 id="academy-title" className="academy__title">{t('home.academy.title')}</h2>
            <p className="academy__intro">{t('home.academy.intro')}</p>

            <div className="academy__levels">
              {academyLevels.map((level) => (
                <article
                  key={level.title}
                  className={`academy-level${level.badge ? ' academy-level--parallel' : ''}`}
                >
                  {level.badge ? (
                    <span className="academy-level__badge">{level.badge}</span>
                  ) : (
                    <span className="academy-level__number">{level.number}</span>
                  )}
                  <h3 className="academy-level__title">{level.title}</h3>
                  <p className="academy-level__body">{level.body}</p>
                </article>
              ))}
            </div>

            <div className="academy__stats">
              <div className="stat-grid">
                {academyStats.map((stat) => (
                  <div key={stat.label} className="stat-item">
                    <span className="stat-value">{stat.value}</span>
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

        {/* ====== Sponsors: la misma banda blanca que la página de Sponsors ====== */}
        <section className="home-sponsors" aria-labelledby="home-sponsors-title">
          <h2 id="home-sponsors-title" className="home-sponsors__title">
            {t('home.sponsorsTitle')}
          </h2>
          <SponsorsCarousel speed={50} />
          <NavLink to={ROUTES.sponsors} className="home-sponsors__link">
            {t('home.sponsorsLink')}
          </NavLink>
        </section>
      </div>
    </>
  );
}
