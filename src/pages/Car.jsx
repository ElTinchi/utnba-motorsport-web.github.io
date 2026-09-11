import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import '../styles/car.css';

const RENDER_APP_URL = '/visor/visor.html';
const RENDER_APP_EMBED_URL = `${RENDER_APP_URL}?embed=1`;

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

          <div className="car-viewer__frame">
            <iframe
              src={RENDER_APP_EMBED_URL}
              title={t('carPage.viewer.title')}
              loading="lazy"
              allow="fullscreen"
            />
          </div>
          <a
            className="btn btn--primary"
            href={RENDER_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('carPage.viewer.openButton')}
          </a>
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
