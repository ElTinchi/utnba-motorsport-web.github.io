import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import PageShell from '../components/PageShell.jsx';
import Gallery, { PHOTOS_BY_AREA } from '../components/Gallery.jsx';
import { AREAS } from '../components/AreasGrid.jsx';
import '../styles/team.css';

export default function Team() {
  const { t } = useTranslation();
  const story = t('teamPage.storyParagraphs', { returnObjects: true });

  return (
    <PageShell
      kicker={t('teamPage.kicker')}
      title={t('teamPage.title')}
      intro={t('teamPage.intro')}
    >
      <figure className="shell-block team-photo">
        <img
          src="/assets/img/Nosotros.jpg"
          alt={t('teamPage.photoAlt')}
          width="3869"
          height="1419"
          loading="eager"
        />
      </figure>

      <div className="shell-block">
        <h2 className="shell-block__title">{t('teamPage.storyTitle')}</h2>
        {story.map((paragraph, i) => (
          <p key={i} className="shell-block__text">{paragraph}</p>
        ))}
      </div>

      <div className="shell-block">
        <h2 className="shell-block__title">{t('teamPage.areasTitle')}</h2>
        <p className="shell-block__text">{t('teamPage.areasIntro')}</p>

        {AREAS.map((area) => (
          <article key={area.id} className="team-area" id={area.id}>
            <header className="team-area__head">
              <img src={area.icon} alt="" className="team-area__icon" width="64" height="64" loading="lazy" />
              <div>
                <h3 className="team-area__title">{t(`areas.items.${area.id}.title`)}</h3>
                <span className="team-area__subtitle">{t(`areas.items.${area.id}.subtitle`)}</span>
              </div>
            </header>

            <p className="team-area__body">{t(`areas.items.${area.id}.body`)}</p>

            {/* Si el área todavía no tiene fotos cargadas, Gallery no renderiza
                nada y en su lugar mostramos el aviso. Ver src/assets/galerias/. */}
            <Gallery area={area.folder} label={t(`areas.items.${area.id}.title`)} />
            {!PHOTOS_BY_AREA[area.folder] && (
              <p className="team-area__nophotos">{t('teamPage.noPhotos')}</p>
            )}
          </article>
        ))}
      </div>

      <div className="shell-block">
        <div className="team-cta">
          <h2 className="team-cta__title">{t('teamPage.ctaTitle')}</h2>
          <p className="team-cta__text">{t('teamPage.ctaText')}</p>
          <NavLink to={ROUTES.joinUs} className="btn btn--primary">
            {t('teamPage.ctaButton')}
          </NavLink>
        </div>
      </div>
    </PageShell>
  );
}
