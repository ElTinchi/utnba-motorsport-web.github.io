import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function currentTheme() {
  return document.documentElement.dataset.theme || 'dark';
}

export default function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(currentTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'light' ? '#fcf6e6' : '#151519',
    );
  }, [theme]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch { /* Preferencia opcional. */ }
    setTheme(next);
  }

  const nextLabel = theme === 'dark' ? t('theme.useLight') : t('theme.useDark');

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={nextLabel}
      title={nextLabel}
    >
      <svg className="theme-toggle__sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
      </svg>
      <svg className="theme-toggle__moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 15.4A8.5 8.5 0 0 1 8.6 4 8.5 8.5 0 1 0 20 15.4Z" />
      </svg>
    </button>
  );
}
