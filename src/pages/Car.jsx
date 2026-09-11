import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import PageShell from '../components/PageShell.jsx';
import '../styles/car.css';

// ============================================================
// Visor de sponsors sobre el render del auto
// ============================================================
// El equipo desarrolló aparte una app web que muestra el render real del
// monoplaza y le aplica el logo del sponsor encima, para que una empresa vea
// cómo le queda su marca en el auto. Está al ~70%.
//
// Cuando esté publicada, poner acá su URL y la página pasa sola del estado
// "en desarrollo" al visor embebido. No hay que tocar nada más.
//
// Requisito del lado de esa app para poder embeberla: su servidor NO debe
// mandar `X-Frame-Options: DENY`; tiene que permitir a utnbamotorsport.com.ar
// vía `Content-Security-Policy: frame-ancestors`. Si eso no se puede, dejar
// RENDER_APP_EMBED en false y queda solo el botón que abre en pestaña nueva.
const RENDER_APP_URL = null; // p. ej. https://render.utnbamotorsport.com.ar
const RENDER_APP_EMBED = true;

// Ficha técnica. Solo están cargados los datos que hoy son públicos y ciertos;
// el resto lo completa el equipo. El texto de cada fila vive en los locales,
// así se traduce como todo lo demás.
const SPECS = ['category', 'powertrain', 'competition', 'generation'];

export default function Car() {
  const { t } = useTranslation();
  const projectParagraphs = t('carPage.projectParagraphs', { returnObjects: true });
  const viewerBullets = t('carPage.viewer.bullets', { returnObjects: true });

  return (
    <PageShell
      kicker={t('carPage.kicker')}
      title={t('carPage.title')}
      intro={t('carPage.intro')}
      wide
    >
      <div className="shell-block">
        <figure className="car-hero">
          <img
            src="/assets/img/render_fsae.jpg"
            alt={t('carPage.renderAlt')}
            width="1920"
            height="1080"
            loading="eager"
          />
          <figcaption>{t('carPage.renderCaption')}</figcaption>
        </figure>
      </div>

      <div className="shell-block">
        <h2 className="shell-block__title">{t('carPage.projectTitle')}</h2>
        {projectParagraphs.map((paragraph, i) => (
          <p key={i} className="shell-block__text">{paragraph}</p>
        ))}
      </div>

      {/* ====== Visor de sponsors ====== */}
      <div className="shell-block">
        <div className="car-viewer">
          <span className="car-viewer__kicker">{t('carPage.viewer.kicker')}</span>
          <h2 className="car-viewer__title">{t('carPage.viewer.title')}</h2>
          <p className="car-viewer__text">{t('carPage.viewer.text')}</p>

          <ul className="car-viewer__list" role="list">
            {viewerBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          {RENDER_APP_URL ? (
            <>
              {RENDER_APP_EMBED && (
                <div className="car-viewer__frame">
                  <iframe
                    src={RENDER_APP_URL}
                    title={t('carPage.viewer.title')}
                    loading="lazy"
                    allow="fullscreen"
                  />
                </div>
              )}
              <a
                className="btn btn--primary"
                href={RENDER_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('carPage.viewer.openButton')}
              </a>
            </>
          ) : (
            <div className="car-viewer__pending">
              <span className="car-viewer__badge">{t('carPage.viewer.pendingBadge')}</span>
              <p>{t('carPage.viewer.pendingText')}</p>
              <NavLink to={ROUTES.sponsors} className="btn btn--secondary">
                {t('carPage.viewer.pendingButton')}
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* ====== Ficha técnica ====== */}
      <div className="shell-block">
        <h2 className="shell-block__title">{t('carPage.specsTitle')}</h2>
        <dl className="car-specs">
          {SPECS.map((spec) => (
            <div key={spec} className="car-specs__row">
              <dt>{t(`carPage.specs.${spec}.label`)}</dt>
              <dd>{t(`carPage.specs.${spec}.value`)}</dd>
            </div>
          ))}
        </dl>
        <p className="shell-note">{t('carPage.specsNote')}</p>
      </div>
    </PageShell>
  );
}
