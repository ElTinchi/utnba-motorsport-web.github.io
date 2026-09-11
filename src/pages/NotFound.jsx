import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes';
import '../styles/notfound.css';

// 404 real. Antes cualquier ruta desconocida caía en el placeholder del Home,
// así que un link roto parecía una página en construcción.
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="nf">
      <div className="nf__container">
        <span className="nf__code">404</span>
        <h1 className="nf__title">{t('notFound.title')}</h1>
        <p className="nf__text">{t('notFound.text')}</p>

        <div className="nf__actions">
          <NavLink to={ROUTES.home} className="btn btn--primary">
            {t('notFound.home')}
          </NavLink>
          <NavLink to={ROUTES.team} className="btn btn--secondary">
            {t('nav.team')}
          </NavLink>
        </div>
      </div>
    </section>
  );
}
