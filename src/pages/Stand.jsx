import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SponsorsCarousel from '../components/SponsorsCarousel.jsx';
import { PHOTOS_BY_AREA } from '../components/Gallery.jsx';
import { AREAS } from '../components/AreasGrid.jsx';
import { PRESS } from '../data/press.js';
import { ROUTES } from '../routes';
import newsJson from '../data/news.json?raw';
import AccelerationAnimation from '../components/events/AccelerationAnimation.jsx';
import SkidPadAnimation from '../components/events/SkidPadAnimation.jsx';
import AutocrossAnimation from '../components/events/AutocrossAnimation.jsx';
import EfficiencyAnimation from '../components/events/EfficiencyAnimation.jsx';
import EnduranceAnimation from '../components/events/EnduranceAnimation.jsx';
import DesignAnimation from '../components/events/DesignAnimation.jsx';
import CostAnimation from '../components/events/CostAnimation.jsx';
import BusinessPlanAnimation from '../components/events/BusinessPlanAnimation.jsx';
import '../styles/formulaStudent.css';
import '../styles/stand.css';

const NEWS = JSON.parse(newsJson.replace(/^﻿/, ''));
// Same order as fsPage.dynamicEvents / staticEvents; seconds ≈ one full animation cycle.
const DYNAMIC = [[AccelerationAnimation, 9], [SkidPadAnimation, 13], [AutocrossAnimation, 11.5], [EfficiencyAnimation, 11], [EnduranceAnimation, 14]];
const STATIC = [[DesignAnimation, 12], [CostAnimation, 12], [BusinessPlanAnimation, 12]];
// A stand cell is ~560x600 px at 1080p: photos whose short side is below this get upscaled and look soft.
const MIN_PHOTO_SIDE = 600;
const AREA_SECONDS = 6;
const MOMENT_SECONDS = 9;
const chunk = (list, size) => Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, i * size + size));
const points = score => Number(String(score).match(/\d+/)?.[0] || 0);

function EventSlide({ Animation, event, kicker, tagline }) {
  return <div className="stand-event">
    <div className="stand-event__stage"><Animation /></div>
    <div className="stand-event__copy">
      <span className="stand-kicker">{kicker}</span>
      <h2 className="stand-title">{event.title}</h2>
      <p className="stand-lead">{tagline}</p>
      <p className="stand-event__points"><strong>{points(event.score)}</strong> pts</p>
    </div>
  </div>;
}

// Two or three photos at once: a single full-screen photo looked oversized and soft.
function PhotoGridSlide({ kicker, title, photos }) {
  return <div className="stand-grid">
    <span className="stand-kicker">{kicker}</span>
    {title && <h2 className="stand-title">{title}</h2>}
    <ul className={`stand-grid__photos stand-grid__photos--${photos.length}`}>
      {photos.map((photo, i) => <li key={photo.src} style={{ '--i': i }}>
        <img src={photo.src} alt="" draggable={false} />
        {photo.caption && <p>{photo.caption}</p>}
      </li>)}
    </ul>
  </div>;
}

export default function Stand() {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  // src -> short side in px, measured once; unmeasured photos are shown until known.
  const [sizes, setSizes] = useState({});
  useEffect(() => {
    Object.values(PHOTOS_BY_AREA).flat().forEach(src => {
      const img = new Image();
      img.onload = () => setSizes(prev => ({ ...prev, [src]: Math.min(img.naturalWidth, img.naturalHeight) }));
      img.src = src;
    });
  }, []);

  const slides = useMemo(() => {
    const dynamicEvents = t('fsPage.dynamicEvents', { returnObjects: true });
    const staticEvents = t('fsPage.staticEvents', { returnObjects: true });
    const taglines = t('stand.taglines', { returnObjects: true });
    const specs = Object.values(t('carPage.specs', { returnObjects: true })).slice(0, 4);
    const lang = NEWS[i18n.resolvedLanguage?.split('-')[0]] ? i18n.resolvedLanguage.split('-')[0] : 'es';
    const total = [...dynamicEvents, ...staticEvents].reduce((sum, e) => sum + points(e.score), 0);
    // One slide per area with up to three of its photos; split in two blocks around the static events.
    const sharp = src => (sizes[src] ?? Infinity) >= MIN_PHOTO_SIDE;
    const areaSlides = AREAS.map(a => ({ a, photos: (PHOTOS_BY_AREA[a.folder] || []).filter(sharp).slice(0, 3) }))
      .filter(({ photos }) => photos.length)
      .map(({ a, photos }) => ({
        seconds: AREA_SECONDS,
        grid: { kicker: t('stand.workshopKicker'), title: t(`areas.items.${a.id}.title`), photos: photos.map(src => ({ src })) },
      }));
    const half = Math.ceil(areaSlides.length / 2);
    const moments = chunk(NEWS[lang].posts.filter(p => p.image).slice(0, 6).map(p => ({ src: p.image, caption: p.title })), 3)
      .map(photos => ({ seconds: MOMENT_SECONDS, grid: { kicker: t('stand.momentsKicker'), photos } }));
    const ev = (list, i, kind, n) => ({ list, i, kind, n });
    return [
      { seconds: 9, render: () => <div className="stand-hero">
        <img src="/assets/img/render_fsae.jpg" alt="" className="stand-hero__img" draggable={false} />
        <div className="stand-hero__copy">
          <img src="/assets/img/logo.png" alt="UTN BA Motorsport" className="stand-hero__logo" draggable={false} />
          <p className="stand-lead">{t('stand.heroLead')}</p>
        </div>
      </div> },
      { seconds: 9, render: () => <div className="stand-intro">
        <span className="stand-kicker">UTN BA Motorsport</span>
        <h2 className="stand-title stand-title--xl">{t('stand.fsaeQuestion')}</h2>
        <p className="stand-lead stand-lead--statement">{t('stand.fsaeTitle')}</p>
        <dl className="stand-stats">
          <div><dt>{t('stand.statEvents')}</dt><dd>{dynamicEvents.length + staticEvents.length}</dd></div>
          <div><dt>{t('stand.statPoints')}</dt><dd>{total}</dd></div>
          <div><dt>{t('stand.statGoal')}</dt><dd>2027</dd></div>
        </dl>
      </div> },
      ...DYNAMIC.map(([, seconds], i) => ({ seconds, event: ev(dynamicEvents, i, 'dynamic', DYNAMIC.length) })),
      ...areaSlides.slice(0, half),
      ...STATIC.map(([, seconds], i) => ({ seconds, event: ev(staticEvents, i, 'static', STATIC.length) })),
      { seconds: 10, render: () => <div className="stand-car">
        <img src="/assets/img/render_fsae.jpg" alt="" className="stand-car__img" draggable={false} />
        <div className="stand-car__copy">
          <span className="stand-kicker">{t('stand.carKicker')}</span>
          <h2 className="stand-title">{t('carPage.specsTitle')}</h2>
          <dl className="stand-specs">{specs.map(s => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
        </div>
      </div> },
      ...areaSlides.slice(half),
      ...moments,
      { seconds: 8, render: () => <div className="stand-intro">
        <span className="stand-kicker">{t('stand.pressKicker')}</span>
        <ul className="stand-press">{PRESS.map(p => <li key={p.name}>{p.name}</li>)}</ul>
      </div> },
      { seconds: 12, render: () => <div className="stand-cta">
        <div>
          <span className="stand-kicker">{t('stand.ctaKicker')}</span>
          <h2 className="stand-title stand-title--xl">{t('stand.ctaTitle')}</h2>
          <p className="stand-lead">{t('stand.ctaLead')}</p>
        </div>
        <figure className="stand-cta__qr">
          <img src="/assets/img/stand-qr-sponsors.svg" alt="" width="240" height="240" draggable={false} />
          <figcaption>utnbamotorsport.com.ar/sponsors</figcaption>
        </figure>
      </div> },
    ].map(s => ({ ...s, taglines }));
  }, [t, i18n.resolvedLanguage, sizes]);

  const slide = slides[current % slides.length];

  useEffect(() => {
    if (paused) return undefined;
    const id = setTimeout(() => setCurrent(c => (c + 1) % slides.length), slide.seconds * 1000);
    return () => clearTimeout(id);
  }, [current, paused, slide.seconds, slides.length]);

  useEffect(() => {
    const onKey = event => {
      if (event.key === ' ') { event.preventDefault(); setPaused(p => !p); }
      if (event.key === 'ArrowRight') setCurrent(c => (c + 1) % slides.length);
      if (event.key === 'ArrowLeft') setCurrent(c => (c - 1 + slides.length) % slides.length);
      if (event.key === 'f') document.documentElement.requestFullscreen?.().catch(() => {});
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  let body;
  if (slide.event) {
    const { list, i, kind, n } = slide.event;
    const Animation = (kind === 'dynamic' ? DYNAMIC : STATIC)[i][0];
    const offset = kind === 'dynamic' ? 0 : DYNAMIC.length;
    body = <EventSlide Animation={Animation} event={list[i]} tagline={slide.taglines[offset + i]}
      kicker={t(kind === 'dynamic' ? 'stand.dynamicKicker' : 'stand.staticKicker', { n: i + 1, total: n })} />;
  } else if (slide.grid) {
    body = <PhotoGridSlide {...slide.grid} />;
  } else {
    body = slide.render();
  }

  return <div className="stand" data-paused={paused}>
    <div className="stand__progress" aria-hidden="true">
      {slides.map((s, i) => <span key={i} className={i < current ? 'is-done' : i === current ? 'is-current' : ''} style={i === current ? { '--slide-seconds': `${s.seconds}s` } : undefined} />)}
    </div>
    <NavLink to={ROUTES.home} className="stand__exit" aria-label={t('stand.exit')}>×</NavLink>
    {/* key remounts each slide, so its animation starts from the beginning */}
    <main className="stand__stage" key={current}>{body}</main>
    <footer className="stand__sponsors">
      <span className="stand__sponsors-label">{t('stand.sponsorsLabel')}</span>
      <SponsorsCarousel speed={45} />
    </footer>
  </div>;
}
