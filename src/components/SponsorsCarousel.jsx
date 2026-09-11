import '../styles/sponsors-carousel.css';

// Listado único de sponsors del equipo. Los logos apuntan a
// public/assets/img/sponsors/onwhite/ — versiones con fondo transparente,
// recortadas al contenido real y con la tinta preparada para leerse sobre
// blanco (Ernesto Mayer y Grupo Paglia son originalmente tinta clara sobre
// fondo oscuro: ahí se invirtió la luminosidad, conservando el tono de marca).
export const SPONSORS = [
  { name: 'UTN BA', href: 'https://www.frba.utn.edu.ar/', logo: '/assets/img/sponsors/onwhite/logoutnba.png' },
  { name: 'Cognitive AI', href: 'https://cognitive.com.ar/', logo: '/assets/img/sponsors/onwhite/cognitive.png' },
  { name: 'Ernesto Mayer SA', href: 'https://www.emayer.com.ar/', logo: '/assets/img/sponsors/onwhite/emayer.png' },
  { name: 'Polimetal Procesos', href: 'https://polimetalprocesos.com.ar/', logo: '/assets/img/sponsors/onwhite/polimetal.png' },
  { name: 'PrintALot', href: 'https://printalot.com.ar/', logo: '/assets/img/sponsors/onwhite/printalot.png' },
  { name: 'Aceros Munro', href: 'https://acerosmunro.com.ar/', logo: '/assets/img/sponsors/onwhite/acerosmunro.png' },
  { name: 'Ansys', href: 'https://www.ansys.com/', logo: '/assets/img/sponsors/onwhite/ansys.png' },
  { name: 'MathWorks', href: 'https://www.mathworks.com/', logo: '/assets/img/sponsors/onwhite/mathworks.png' },
  { name: 'Bender', href: 'https://www.bender.de/', logo: '/assets/img/sponsors/onwhite/benderlogo.png' },
  { name: 'Grupo Paglia', href: 'https://www.instagram.com/grupopaglia_/', logo: '/assets/img/sponsors/onwhite/grupopaglia.png' },
  { name: 'DSM Diesel Car S.A.', href: 'https://www.dsmdieselcar.com.ar/', logo: '/assets/img/sponsors/onwhite/dsm-diesel-car.png' },
];

// `duplicate` marca la copia visual del loop: no debe recibir foco de teclado
// ni ser anunciada, para no repetir los mismos 12 links dos veces.
function Logo({ sponsor, duplicate = false }) {
  if (!sponsor.href) {
    return (
      <span className="sp-car__item" aria-hidden={duplicate || undefined}>
        <img src={sponsor.logo} alt={duplicate ? '' : sponsor.name} loading="lazy" />
      </span>
    );
  }

  return (
    <a
      className="sp-car__item"
      href={sponsor.href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate || undefined}
    >
      <img src={sponsor.logo} alt={duplicate ? '' : sponsor.name} loading="lazy" />
    </a>
  );
}

/**
 * Banda blanca a todo el ancho con los logos desplazándose en loop continuo.
 * Sin tiles, sin bordes, sin grises: los logos van directo sobre el blanco.
 *
 * El loop es sin costura porque la pista se renderiza DOS veces y la animación
 * la desplaza exactamente un 50% de su ancho: cuando termina, la copia quedó
 * justo donde arrancó el original. La segunda copia es aria-hidden para no
 * duplicar los links en lectores de pantalla.
 *
 * @param {number} speed  Segundos que tarda una vuelta completa.
 */
export default function SponsorsCarousel({ speed = 45 }) {
  return (
    <div className="sp-car" style={{ '--sp-car-speed': `${speed}s` }}>
      {/* El viewport lleva el recorte y el desvanecido de los bordes. Va como
          hijo y no sobre .sp-car para que la máscara afecte solo a los logos:
          si se aplica al contenedor, agujerea también la banda blanca y en los
          extremos se ve el fondo oscuro de la página. */}
      <div className="sp-car__viewport">
        <div className="sp-car__track">
          <div className="sp-car__group">
            {SPONSORS.map((sponsor) => (
              <Logo key={sponsor.name} sponsor={sponsor} />
            ))}
          </div>
          <div className="sp-car__group" aria-hidden="true">
            {SPONSORS.map((sponsor) => (
              <Logo key={`dup-${sponsor.name}`} sponsor={sponsor} duplicate />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
