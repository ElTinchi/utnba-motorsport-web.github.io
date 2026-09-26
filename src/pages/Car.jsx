import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import EditorialReveal from '../components/EditorialReveal.jsx';
import StaggerList from '../components/StaggerList.jsx';
import '../styles/car.css';

const RENDER_APP_URL = '/visor/visor.html';

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
      <EditorialReveal className="shell-block" mask="horizontal">
        <figure className="car-hero">
          <img draggable={false}
            src="/assets/img/render_fsae.jpg"
            alt={t('carPage.renderAlt')}
            width="1920"
            height="1080"
            loading="eager"
          />
          <figcaption>{t('carPage.renderCaption')}</figcaption>
        </figure>
      </EditorialReveal>

      <EditorialReveal className="shell-block" direction="left">
        <h2 className="shell-block__title">{t('carPage.projectTitle')}</h2>
        {projectParagraphs.map((paragraph, i) => (
          <p key={i} className="shell-block__text">{paragraph}</p>
        ))}
      </EditorialReveal>

      {/* ====== Visor de sponsors ====== */}
      <EditorialReveal className="shell-block" direction="right">
        <div className="car-viewer">
          <span className="car-viewer__kicker">{t('carPage.viewer.kicker')}</span>
          <h2 className="car-viewer__title">{t('carPage.viewer.title')}</h2>
          <p className="car-viewer__text">{t('carPage.viewer.text')}</p>

          <ul className="car-viewer__list" role="list">
            {viewerBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          <a className="car-viewer__preview" href={RENDER_APP_URL} aria-label={t('carPage.viewer.openButton')}>
            <img draggable={false} src="/assets/img/render_fsae.jpg" alt="" loading="lazy" />
            <span>{t('carPage.viewer.openButton')} <span aria-hidden="true">↗</span></span>
          </a>
          <a
            className="btn btn--primary"
            href={RENDER_APP_URL}
          >
            {t('carPage.viewer.openButton')}
          </a>
        </div>
      </EditorialReveal>

      {/* ====== Ficha técnica ====== */}
      <EditorialReveal className="shell-block">
        <h2 className="shell-block__title">{t('carPage.specsTitle')}</h2>
        <StaggerList as="dl" itemAs="div" className="car-specs" itemClassName="car-specs__row" items={SPECS} renderItem={(spec) => (
            <>
              <dt>{t(`carPage.specs.${spec}.label`)}</dt>
              <dd>{t(`carPage.specs.${spec}.value`)}</dd>
            </>
          )} />
        <p className="shell-note">{t('carPage.specsNote')}</p>
      </EditorialReveal>
    </PageShell>
  );
}
