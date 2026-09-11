import '../styles/gallery.css';

// Lee TODAS las fotos de src/assets/galerias/<area>/ en tiempo de build.
// Es la razón por la que agregar una foto no requiere tocar código: alcanza
// con dejar el archivo en la carpeta del área. Vite resuelve el glob, le pone
// hash a cada imagen y la optimiza. Ver src/assets/galerias/LEEME.txt.
const FILES = import.meta.glob('../assets/galerias/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

// { diseno: ['/assets/diseno1-a1b2.png', ...], industrial: [...] }
export const PHOTOS_BY_AREA = Object.entries(FILES)
  .sort(([a], [b]) => a.localeCompare(b))
  .reduce((acc, [path, url]) => {
    const area = path.split('/').at(-2);
    (acc[area] ||= []).push(url);
    return acc;
  }, {});

/**
 * Galería de un área. Si todavía no hay fotos cargadas no renderiza nada,
 * así una carpeta vacía no deja un hueco raro en la página.
 *
 * @param {string} area   Nombre de la carpeta en src/assets/galerias/
 * @param {string} label  Nombre del área, para el alt de las imágenes
 */
export default function Gallery({ area, label }) {
  const photos = PHOTOS_BY_AREA[area] || [];
  if (photos.length === 0) return null;

  return (
    <ul className="gallery" role="list">
      {photos.map((src, i) => (
        <li key={src} className="gallery__item">
          <img src={src} alt={`${label} — foto ${i + 1}`} loading="lazy" />
        </li>
      ))}
    </ul>
  );
}
