import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';

// Las 7 áreas del equipo. Los íconos salen del manual de marca
// (assets/Recursos Gráficos/Logos por Area/SVG/): un círculo de color por área
// con el glifo adentro. Son SVG, así que se ven nítidos en cualquier pantalla
// y pesan ~1 KB en vez de los ~25 KB que pesaban los PNG del sitio viejo.
//
// Cada glifo va sobre su propio círculo de color, así que los íconos se leen
// igual sobre fondo oscuro y sobre fondo claro: no hay que duplicarlos si más
// adelante se agrega el modo claro.
//
// `id` es la clave con la que se buscan título y bajada en los locales
// (areas.items.<id>), así el listado no repite texto traducible.
//
// `folder` es el nombre de la carpeta en src/assets/galerias/. Va aparte del
// `id` a propósito: el id es una clave de traducción y está en inglés, mientras
// que las carpetas están en español, como los archivos que sube el equipo.
//
// El orden importa: son 7 y se muestran en una sola fila, así que Industrial va
// cuarta para quedar justo en el medio. Su ícono es el único con el patrón
// invertido (círculo oscuro, glifo claro) y centrado se lee como un eje en vez
// de como un error.
export const AREAS = [
  { id: 'design', folder: 'diseno', icon: '/assets/img/diseno.svg' },
  { id: 'chemistry', folder: 'quimica', icon: '/assets/img/quimica.svg' },
  { id: 'manufacturing', folder: 'fabricacion', icon: '/assets/img/fabricacion.svg' },
  { id: 'industrial', folder: 'industrial', icon: '/assets/img/industrial.svg' },
  { id: 'cnc', folder: 'cnc', icon: '/assets/img/cnc.svg' },
  { id: 'electronics', folder: 'electronica', icon: '/assets/img/electronica.svg' },
  { id: 'communication', folder: 'comunicacion', icon: '/assets/img/comunicacion.svg' },
];

export default function AreasGrid() {
  const { t } = useTranslation();

  // Cada tarjeta linkea al ancla de su área dentro de /el-equipo, que es donde
  // está la descripción larga y la galería de fotos.
  return (
    <ul className="areas__grid" role="list">
      {AREAS.map((area) => (
        <li key={area.id}>
          <NavLink to={`${ROUTES.team}#${area.id}`} className="area-card">
            <img
              src={area.icon}
              alt=""
              className="area-card__icon"
              width="72"
              height="72"
              loading="lazy"
            />
            <h3 className="area-card__title">{t(`areas.items.${area.id}.title`)}</h3>
            <p className="area-card__subtitle">{t(`areas.items.${area.id}.subtitle`)}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
