import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES, COMMERCIAL_CONTACT_HREF, STAND_PATH } from '../routes';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import PresentationMode from './PresentationMode.jsx';

export default function Header() {
  const { t } = useTranslation();
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function closeAll() {
    setNavOpen(false);
    setDropdownOpen(false);
  }

  // Fórmula SAE salió del desplegable: es lo que más explica el proyecto y
  // quedaba escondido. El desplegable agrupa las páginas que explican el proyecto. Sumate
  // salió de acá (es el botón de acción) y Contacto también: no eran "sobre
  // nosotros", eran cosas que el visitante quiere hacer.
  const dropdownLinks = [
    { to: ROUTES.team, label: t('nav.team') },
    { to: ROUTES.academy, label: t('nav.academy') },
  ];

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`} role="banner">
      <div className="header__container">
        <NavLink to={ROUTES.home} className="header__logo" aria-label="UTN BA Motorsport" onClick={closeAll}>
          <picture>
            <source srcSet="/assets/img/logo-light.png" media="(prefers-color-scheme: light)" />
            <img draggable={false} src="/assets/img/logo.png" alt="UTN BA Motorsport" className="header__logo-img" width="215" height="45" />
          </picture>
        </NavLink>

        <button
          className="header__hamburger"
          aria-label={navOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={navOpen}
          aria-controls="main-nav"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
        </button>

        <nav className={`nav${navOpen ? ' nav--open' : ''}`} id="main-nav" role="navigation" aria-label="Navegación principal">
          <ul className="nav__list">
            <li>
              <NavLink to={ROUTES.home} className="nav__link" onClick={closeAll} end>
                {t('nav.home')}
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.news} className="nav__link" onClick={closeAll}>
                {t('nav.news')}
              </NavLink>
            </li>
            <li><NavLink to={ROUTES.car} className="nav__link" onClick={closeAll}>{t('nav.car')}</NavLink></li>
            <li className="nav__item">
              <button
                className="nav__dropdown-toggle"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                {t('nav.team')}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="nav__dropdown" data-open={dropdownOpen} role="menu">
                {dropdownLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className="nav__dropdown-link" role="menuitem" onClick={closeAll}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </li>
            <li><NavLink to={ROUTES.aboutFormulaStudent} className="nav__link" onClick={closeAll}>{t('nav.formulaSae')}</NavLink></li>
            <li>
              <NavLink to={ROUTES.sponsors} className="nav__link" onClick={closeAll}>
                {t('nav.sponsors')}
              </NavLink>
            </li>
          </ul>
          <div className="nav__language"><LanguageSwitcher /></div>
        </nav>

        <div className="header__actions">
          <PresentationMode />
          <NavLink
            to={STAND_PATH}
            className="presentation-toggle"
            aria-label={t('stand.open')}
            title={t('stand.open')}
            onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 5h18v11H3zM8 20h8M12 16v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </NavLink>
          <LanguageSwitcher />
          <a href={COMMERCIAL_CONTACT_HREF} className="btn btn--primary btn--small header__cta" onClick={closeAll}>
            <span className="header__cta-full">{t('sponsorsPage.primaryCta')}</span>
            <span className="header__cta-short">{t('cinematic.bookShort')}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
