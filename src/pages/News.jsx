import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import EditorialReveal from '../components/EditorialReveal.jsx';
import content from '../data/news.json';
import '../styles/news.css';

function NewsArticle({ post, labels, featured = false }) {
  const [shareStatus, setShareStatus] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [sharing, setSharing] = useState(false);

  async function sharePost() {
    const url = new URL(window.location.pathname, window.location.origin);
    url.hash = post.id;
    const link = url.href;
    setShareStatus('');
    setManualUrl('');
    setSharing(true);
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: post.title, url: link });
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(link);
        setShareStatus('copied');
      } catch {
        setManualUrl(link);
        setShareStatus('manualCopy');
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <article id={post.id} className={`news-story${featured ? ' news-story--featured' : ''}`} aria-labelledby={`${post.id}-title`}>
      <div className={`news-story__visual${post.image ? " news-story__visual--photo" : ""}`} aria-hidden={post.image ? undefined : true}>
        {post.image ? <img draggable={false} src={post.image} alt={post.imageAlt || ""} loading={featured ? 'eager' : 'lazy'} decoding="async" /> : <>
          <span className="news-story__edition">UTN BA / MOTORSPORT</span>
          <strong className="news-story__number">{post.mark}</strong>
          <span className="news-story__year">{post.year}</span>
        </>}
      </div>
      <div className="news-story__body">
        <div className="news-story__meta">
          <span>{featured ? labels.latest : post.category}</span>
          {post.dateTime ? <time dateTime={post.dateTime}>{post.date}</time> : <span>{post.date}</span>}
        </div>
        <h2 id={`${post.id}-title`}><a href={`#${post.id}`}>{post.title}</a></h2>
        {post.gallery?.length > 0 && <div className="news-story__gallery" role="group" aria-label={labels.gallery}>
          {post.gallery.map(photo => <div key={photo.src}><img draggable={false} src={photo.src} alt={photo.alt} loading="lazy" decoding="async" /></div>)}
        </div>}
        {post.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {post.instagramUrl && <a className="news-story__source" href={post.instagramUrl} target="_blank" rel="noopener noreferrer">{post.instagramLabel || labels.instagram} <span aria-hidden="true">↗</span></a>}
        {post.sourceUrl && <a className="news-story__source" href={post.sourceUrl} target="_blank" rel="noopener noreferrer">{labels.source} ↗</a>}
        <div className="news-story__sharing">
          <button type="button" className="news-story__share" onClick={sharePost} disabled={sharing} aria-label={`${labels.share}: ${post.title}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>
            {labels.share}
          </button>
          <span role="status" className="news-story__share-status">{shareStatus ? labels[shareStatus] : ''}</span>
          {manualUrl && <input className="news-story__share-url" aria-label={labels.copyLink} value={manualUrl} readOnly onFocus={event => event.target.select()} />}
        </div>
      </div>
    </article>
  );
}

export default function News() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage || 'es').split('-')[0];
  const { labels, posts } = content[language] || content.es;
  return (
    <PageShell wide kicker={labels.kicker} title={labels.title} intro={labels.intro}>
      <div className="shell-block news-journal">
        <EditorialReveal mask="horizontal"><NewsArticle post={posts[0]} labels={labels} featured /></EditorialReveal>
        <div className="news-journal__heading"><h2>{labels.archive}</h2><span>2025 — 2026</span></div>
        <div className="news-grid">{posts.slice(1).map(post => <EditorialReveal key={post.id}><NewsArticle post={post} labels={labels} /></EditorialReveal>)}</div>
        <aside className="news-social">
          <div><span className="news-social__label">PADDOCK / UTN BA</span><h2>{labels.socialTitle}</h2><p>{labels.socialText}</p></div>
          <a className="btn btn--primary" href="https://www.instagram.com/utnbamotorsport/" target="_blank" rel="noopener noreferrer">{labels.socialButton} <span aria-hidden="true">↗</span></a>
        </aside>
      </div>
    </PageShell>
  );
}
