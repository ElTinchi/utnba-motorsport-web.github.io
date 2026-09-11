import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import '../styles/page-shell.css';

/**
 * Encabezado común de las páginas internas: link para volver, kicker, título
 * e intro. Las páginas viejas (Sponsors, Academia, Fórmula Student) tienen su
 * propio marcado equivalente; las nuevas usan esto para no repetirlo cinco veces.
 *
 * `wide` saca el límite de ancho del contenido, para páginas donde algo va a
 * sangrar a todo el ancho (por ejemplo el visor 3D del auto).
 */
export default function PageShell({ kicker, title, intro, children, wide = false }) {
  const { t } = useTranslation();

  return (
    <section className={`shell${wide ? ' shell--wide' : ''}`}>
      <div className="shell__head">
        <NavLink to={ROUTES.home} className="shell__back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.backLink')}
        </NavLink>

        {kicker && <span className="shell__kicker">{kicker}</span>}
        <h1 className="shell__title">{title}</h1>
        {intro && <p className="shell__intro">{intro}</p>}
      </div>

      {children}
    </section>
  );
}
