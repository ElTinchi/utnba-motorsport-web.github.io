import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import '../styles/news.css';

const INSTAGRAM_URL = 'https://www.instagram.com/utnbamotorsport/';

// El feed no se pide a Instagram desde el navegador: eso lo bloquea CORS y
// además obligaría a exponer el token en el bundle, que es público. En su
// lugar, un workflow de GitHub Actions llama a la API con el token guardado en
// Secrets y deja el resultado en public/data/instagram.json. Acá solo se lee
// ese archivo propio: rápido, sin terceros, y si Instagram se cae la página
// sigue mostrando los últimos posts que se hayan traído.
// Ver .github/workflows/instagram.yml
const FEED_URL = '/data/instagram.json';

function formatDate(iso, locale) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function News() {
  const { t, i18n } = useTranslation();
  // idle -> loading -> ready | empty
  const [state, setState] = useState('loading');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetch(FEED_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.posts) ? data.posts : [];
        setPosts(list);
        setState(list.length ? 'ready' : 'empty');
      })
      .catch(() => {
        // Sin feed todavía: no es un error que le importe al visitante,
        // simplemente mostramos el bloque que invita a seguir la cuenta.
        if (!cancelled) setState('empty');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell
      kicker={t('newsPage.kicker')}
      title={t('newsPage.title')}
      intro={t('newsPage.intro')}
    >
      <div className="shell-block">
        {state === 'loading' && <p className="news-status">{t('newsPage.loading')}</p>}

        {state === 'ready' && (
          <ul className="news-grid" role="list">
            {posts.map((post) => (
              <li key={post.id} className="news-card">
                <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                  {post.mediaUrl && (
                    <img src={post.mediaUrl} alt="" loading="lazy" className="news-card__img" />
                  )}
                  <div className="news-card__body">
                    <time className="news-card__date" dateTime={post.timestamp}>
                      {formatDate(post.timestamp, i18n.language)}
                    </time>
                    {post.caption && <p className="news-card__caption">{post.caption}</p>}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        {state === 'empty' && (
          <div className="news-empty">
            <span className="news-empty__badge">{t('newsPage.emptyBadge')}</span>
            <h2 className="news-empty__title">{t('newsPage.emptyTitle')}</h2>
            <p className="news-empty__text">{t('newsPage.emptyText')}</p>
            <a
              className="btn btn--primary"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('newsPage.emptyButton')}
            </a>
          </div>
        )}
      </div>
    </PageShell>
  );
}
