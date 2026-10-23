import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SPONSORS } from '../data/sponsors';
export { SPONSORS } from '../data/sponsors';
import '../styles/sponsors-carousel.css';

// Listado único de sponsors del equipo. Los logos apuntan a
// public/assets/img/sponsors/onwhite/ — versiones con fondo transparente,
// recortadas al contenido real y con la tinta preparada para leerse sobre
// blanco (Grupo Paglia es originalmente tinta clara sobre
// fondo oscuro: ahí se invirtió la luminosidad, conservando el tono de marca).


// `duplicate` marca la copia visual del loop: no debe recibir foco de teclado
// ni ser anunciada, para no repetir los mismos links dos veces.
function Logo({ sponsor, duplicate = false }) {
  if (!sponsor.href) {
    return (
      <span className={['sp-car__item', sponsor.logoClass].filter(Boolean).join(' ')} aria-hidden={duplicate || undefined}>
        <span className="sp-car__logo"><img draggable={false} src={sponsor.logo} alt={duplicate ? '' : sponsor.name} loading="lazy" /></span>
      </span>
    );
  }

  return (
    <a
      className={['sp-car__item', sponsor.logoClass].filter(Boolean).join(' ')}
      href={sponsor.href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate || undefined}
    >
      <span className="sp-car__logo"><img draggable={false} src={sponsor.logo} alt={duplicate ? '' : sponsor.name} loading="lazy" /></span>
    </a>
  );
}

export default function SponsorsCarousel({ speed = 35 }) {
  const { t } = useTranslation();
  const root = useRef(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); });
    observer.observe(root.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  const rows = [SPONSORS.filter((_, index) => index % 2 === 0), SPONSORS.filter((_, index) => index % 2 === 1)];
  return (
    <div ref={root} className="sp-car" data-paused={paused || !active} style={{ '--sp-car-speed': `${speed}s` }}>
      <button type="button" className="sp-car__pause" onClick={() => setPaused(value => !value)} aria-pressed={paused}>
        {t(paused ? 'cinematic.resumeSponsors' : 'cinematic.pauseSponsors')}
      </button>
      {rows.map((sponsors, index) => (
        <div className={`sp-car__viewport${index === 1 ? ' sp-car__viewport--reverse' : ''}`} key={index}>
          <div className="sp-car__track">
            <div className="sp-car__group">
              {sponsors.map(sponsor => <Logo key={sponsor.name} sponsor={sponsor} />)}
            </div>
            <div className="sp-car__group" aria-hidden="true">
              {sponsors.map(sponsor => <Logo key={sponsor.name} sponsor={sponsor} duplicate />)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
