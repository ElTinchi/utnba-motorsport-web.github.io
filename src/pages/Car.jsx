import FormulaCarArt from '../components/FormulaCarArt.jsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import EditorialReveal from '../components/EditorialReveal.jsx';
import StaggerList from '../components/StaggerList.jsx';
import '../styles/car.css';

const RENDER_APP_URL = '/visor/visor.html';

// Ficha técnica. Solo están cargados los datos que hoy son públicos y ciertos;
// el resto lo completa el equipo. El texto de cada fila vive en los locales,
// así se traduce como todo lo demás.
const SPECS = ['mass', 'power', 'ratio', 'motor', 'motorPeak', 'battery', 'category', 'powertrain', 'competition', 'generation'];

export default function Car() {
  const { t } = useTranslation();
  const [comparisonRun, setComparisonRun] = useState(0);
  const projectParagraphs = t('carPage.projectParagraphs', { returnObjects: true });
  const viewerBullets = t('carPage.viewer.bullets', { returnObjects: true });

  return (
    <PageShell
      kicker={t('carPage.kicker')}
      title={t('cinematic.carPageTitle')}
      intro={t('carPage.intro')}
      wide
    >
      <div className="car-first-action"><a href={RENDER_APP_URL} className="btn btn--primary">{t('carPage.viewer.openButton')}</a></div>
      <EditorialReveal className="shell-block car-hero-reveal">
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

      {/* ====== Ficha técnica ====== */}
      <EditorialReveal className="shell-block">
        <h2 className="shell-block__title">{t('carPage.specsTitle')}</h2>
        <div className="car-specs-layout">
        <div>
        <StaggerList as="dl" itemAs="div" className="car-specs" itemClassName="car-specs__row" items={SPECS} renderItem={(spec) => (
            <>
              <dt>{t(`carPage.specs.${spec}.label`)}</dt>
              <dd>{t(`carPage.specs.${spec}.value`)}</dd>
            </>
          )} />
        <p className="shell-note">{t('carPage.specsNote')}</p>
        <p><a href="https://emrax.com/e-motors/emrax-228/" target="_blank" rel="noopener noreferrer">{t('carPage.motorLink')} ↗</a></p>
        </div>
        <aside className="car-record">
          <h3>{t('carPage.recordTitle')}</h3>
          <p>{t('carPage.recordText')}</p>
          <a href="https://www.guinnessworldrecords.com/world-records/fastest-0-100-kmh-acceleration-electric-car" target="_blank" rel="noopener noreferrer">{t('carPage.recordLink')} ↗</a>
        </aside>
        </div>
      </EditorialReveal>

      <EditorialReveal className="shell-block">
        <div className="car-comparison">
          <h2 className="shell-block__title">{t('carPage.comparison.title')}</h2>
          <p>{t('carPage.comparison.intro')}</p>
          <div key={comparisonRun} className={`car-comparison__lanes ${comparisonRun ? 'is-running' : ''}`}>
            <div className="car-comparison__lane">
              <div className="car-comparison__label"><strong>{t('carPage.comparison.amz')}</strong></div>
              <div className="car-comparison__track" aria-hidden="true"><span className="car-comparison__marker car-comparison__marker--formula"><svg viewBox="-28 -20 56 40"><FormulaCarArt /></svg></span></div>
            </div>
            <div className="car-comparison__lane">
              <div className="car-comparison__label"><strong>{t('carPage.comparison.sports')}</strong></div>
              <div className="car-comparison__track" aria-hidden="true"><span className="car-comparison__marker car-comparison__marker--sports"><svg viewBox="0 0 90 38"><path d="M7 11Q8 6 16 6h52q12 0 15 8v10q-3 8-15 8H16Q8 32 7 27z" fill="currentColor"/><path d="M33 9h23l9 5v10l-9 5H33l-7-5V14z" fill="#303034"/><path d="M14 4h12v4H14zm0 26h12v4H14zm43-26h12v4H57zm0 26h12v4H57z" fill="#202024"/></svg></span></div>
            </div>
            <div className="car-comparison__lane">
              <div className="car-comparison__label"><strong>{t('carPage.comparison.road')}</strong></div>
              <div className="car-comparison__track" aria-hidden="true"><span className="car-comparison__marker car-comparison__marker--road"><svg viewBox="0 0 90 38"><path d="M7 11Q8 6 16 6h52q12 0 15 8v10q-3 8-15 8H16Q8 32 7 27z" fill="currentColor"/><path d="M33 9h23l9 5v10l-9 5H33l-7-5V14z" fill="#303034"/><path d="M14 4h12v4H14zm0 26h12v4H14zm43-26h12v4H57zm0 26h12v4H57z" fill="#202024"/></svg></span></div>
            </div>
          </div>
          <button className="btn btn--primary" type="button" onClick={() => setComparisonRun(n => n + 1)}>{t(comparisonRun ? 'carPage.comparison.replay' : 'carPage.comparison.run')}</button>
          <div className="car-comparison__references" role="group" aria-label={t('carPage.comparison.referencesTitle')}>
            <h3>{t('carPage.comparison.referencesTitle')}</h3>
            <p>{t('carPage.comparison.formulaRef')}</p>
            <p>{t('carPage.comparison.sportsRef')}</p>
            <p>{t('carPage.comparison.roadRef')}</p>
          </div>
        </div>
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

    </PageShell>
  );
}
