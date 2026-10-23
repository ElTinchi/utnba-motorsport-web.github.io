import { PRESS } from '../data/press';
import { Trans, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { COMMERCIAL_CONTACT_HREF, ROUTES } from '../routes';
import CinematicImage from './CinematicImage';
import EditorialReveal from './EditorialReveal';
import '../styles/sponsor-photo-story.css';

const PHOTOS = [
  ['/assets/img/news/chasis-equipo.webp', '/novedades#chasis-presentacion', 1600, 587],
  ['/assets/img/render_fsae.jpg', '/el-auto', 1920, 1080],
  ['/assets/img/news/ABB-2026/abb-recorrido.webp', '/novedades#visita-abb-2026', 1650, 2200],
  ['/assets/img/news/carburando.webp', '/novedades#carburando-2026', 675, 1200],
  ['/assets/img/news/campus-01.webp', '/novedades#circuito-virtual-campus', 1600, 1067],
];
const READING_ORDER = [3, 0, 2, 4, 1];


export default function SponsorPhotoStory() {
  const { t } = useTranslation();
  const chapters = t('sponsorStory.chapters', { returnObjects: true });
  return (
    <section className="sponsor-story" id="tu-marca" aria-labelledby="sponsor-story-title">
      <header className="sponsor-story__head">

        <h2 id="sponsor-story-title">{t('sponsorStory.title')}</h2>
        <p>{t('sponsorStory.intro')}</p>
        <nav className="sponsor-story__press" aria-label={t('sponsorStory.pressLabel')}>
          <span className="sponsor-story__kicker">{t('sponsorStory.pressLabel')}</span>
          {PRESS.map(outlet => <a key={outlet.name} href={outlet.href} target="_blank" rel="noopener noreferrer">{outlet.name} <span aria-hidden="true">↗</span></a>)}
        </nav>
        <div className="sponsor-story__actions">
          <a href="#historia-3" className="btn btn--primary">{t('sponsorStory.start')}</a>
          <a href="#historia-1" className="btn btn--secondary">{t('sponsorStory.seeCar')}</a>
        </div>
        <p className="sponsor-story__promise">{t('sponsorStory.promise')}</p>
      </header>
      {READING_ORDER.map((index, position) => {
        const chapter = chapters[index];
        return (
        <EditorialReveal as="article" id={`historia-${index}`} className={`sponsor-story__chapter${index === 1 ? ' sponsor-story__chapter--render' : ''}`} key={PHOTOS[index][0]}>
          <figure>
            <CinematicImage src={PHOTOS[index][0]} width={PHOTOS[index][2]} height={PHOTOS[index][3]} alt={chapter.alt} loading="lazy" decoding="async" />
            <figcaption><NavLink to={PHOTOS[index][1]}>{chapter.caption} <span aria-hidden="true">↗</span></NavLink></figcaption>
          </figure>
          <div className="sponsor-story__copy">
            <span className="sponsor-story__kicker">{chapter.label}</span>
            <h3>{chapter.title}</h3>
            <p><Trans i18nKey={`sponsorStory.chapters.${index}.text`} components={{ strong: <strong /> }} /></p>
            {position < READING_ORDER.length - 1 ? (
              <a className="sponsor-story__next" href={`#historia-${READING_ORDER[position + 1]}`}>{t(`sponsorStory.hooks.${position}`)} <span aria-hidden="true">↓</span></a>
            ) : (
              <div className="sponsor-story__actions">
                <a href="/visor/visor.html" className="btn btn--primary">{t('sponsorStory.tryLogo')}</a>
                <a href={COMMERCIAL_CONTACT_HREF} className="btn btn--secondary">{t('sponsorsPage.primaryCta')}</a>
              </div>
            )}
          </div>
        </EditorialReveal>
        );
      })}
      <div className="sponsor-story__close">
        <h3>{t('sponsorStory.closing')}</h3>
        <p>{t('sponsorStory.invitation')}</p>
        <div className="sponsor-story__actions">
          <a href={COMMERCIAL_CONTACT_HREF} className="btn btn--primary">{t('sponsorsPage.primaryCta')}</a>
          <NavLink to={ROUTES.sponsors} className="btn btn--secondary">{t('sponsorStory.details')}</NavLink>
        </div>
      </div>
    </section>
  );
}
