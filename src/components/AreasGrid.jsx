import { useTranslation } from 'react-i18next';

// Las 6 áreas del equipo. Los íconos son los mismos del sitio anterior
// (public/assets/img/*.png), redondos y de un color por área.
//
// `id` es la clave con la que se buscan título y bajada en los locales
// (areas.items.<id>), así el listado no repite texto traducible.
//
// TODO: Simulación todavía no tiene ícono propio — usa el de Química como
// placeholder, igual que en el sitio viejo. Al subir `simulacion.png` a
// public/assets/img/ solo hay que cambiar la ruta de acá.
// `folder` es el nombre de la carpeta en src/assets/galerias/. Va aparte del
// `id` a propósito: el id es una clave de traducción y está en inglés, mientras
// que las carpetas están en español, como los archivos que sube el equipo.
export const AREAS = [
  { id: 'design', folder: 'diseno', icon: '/assets/img/diseno.png' },
  { id: 'chemistry', folder: 'quimica', icon: '/assets/img/quimica.png' },
  { id: 'manufacturing', folder: 'fabricacion', icon: '/assets/img/fabricacion.png' },
  { id: 'industrial', folder: 'industrial', icon: '/assets/img/industrial.png' },
  { id: 'electronics', folder: 'electronica', icon: '/assets/img/electronica.png' },
  { id: 'communication', folder: 'comunicacion', icon: '/assets/img/comunicacion.png' },
];

export default function AreasGrid() {
  const { t } = useTranslation();

  return (
    <ul className="areas__grid" role="list">
      {AREAS.map((area) => (
        <li key={area.id} className="area-card">
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
        </li>
      ))}
    </ul>
  );
}
