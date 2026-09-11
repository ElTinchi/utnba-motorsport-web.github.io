import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { FLAG_COMPONENTS } from './Flags.jsx';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const current =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.resolvedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function selectLanguage(code) {
    i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div className="lang-switch" ref={wrapperRef}>
      <button
        type="button"
        className="lang-switch__toggle"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {(() => {
          const CurrentFlag = FLAG_COMPONENTS[current.code];
          return <CurrentFlag className="lang-switch__flag" />;
        })()}
        {current.code.toUpperCase()}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`lang-switch__menu${open ? ' lang-switch__menu--open' : ''}`} role="menu">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const Flag = FLAG_COMPONENTS[lang.code];
          return (
            <button
              key={lang.code}
              type="button"
              role="menuitem"
              className={`lang-switch__option${lang.code === current.code ? ' lang-switch__option--active' : ''}`}
              onClick={() => selectLanguage(lang.code)}
            >
              <Flag className="lang-switch__flag" />
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
