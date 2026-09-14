import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES, CONTACT_EMAIL, CONTACT_HREF } from '../routes';

const SOCIALS = [
  ['Instagram', 'https://www.instagram.com/utnbamotorsport/', 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.26.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.15 3.22-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C.01 15.58 0 15.2 0 12s.01-3.58.07-4.85C.22 3.93 1.73 2.38 4.99 2.23 6.25 2.17 6.63 2.16 9.84 2.16H12zM12 0C8.74 0 8.33.01 7.05.07 2.69.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z'],
  ['LinkedIn', 'https://ar.linkedin.com/company/utn-ba-motorsports', 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z'],
  ['YouTube', 'https://www.youtube.com/@utnbamotorsport', 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z'],
  ['TikTok', 'https://www.tiktok.com/@utnbamotorsport', 'M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03a9.6 9.6 0 0 1-5.82-1.9c-.01 2.92.01 5.84-.02 8.75a7.3 7.3 0 0 1-7.26 7.15 7.47 7.47 0 0 1-4.08-1.03 7.35 7.35 0 0 1-3.65-5.71c-.2-2.41.77-4.8 2.57-6.45a7.45 7.45 0 0 1 6.15-1.72c.02 1.48-.04 2.96-.04 4.44a3.27 3.27 0 0 0-4.38 2.12c-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87a3.5 3.5 0 0 0 3.18-2.67c.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'],
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return <footer className="footer" role="contentinfo">
    <div className="footer__container">
      <section className="footer__cta" aria-labelledby="footer-cta-title">
        <div><span className="footer__eyebrow">{t('footer.ctaEyebrow')}</span><h2 id="footer-cta-title" className="footer__title">{t('footer.ctaTitle')}</h2></div>
        <div className="footer__cta-actions"><NavLink to={ROUTES.sponsors} className="btn btn--primary">{t('footer.sponsorCta')}</NavLink><NavLink to={ROUTES.joinUs} className="footer__text-link">{t('footer.joinCta')} <span aria-hidden="true">↗</span></NavLink></div>
      </section>

      <div className="footer__main">
        <div className="footer__identity">
          <NavLink to={ROUTES.home} className="footer__brand" aria-label="UTN BA Motorsport"><picture><source srcSet="/assets/img/logo-light.png" media="(prefers-color-scheme: light)" /><img src="/assets/img/logo.png" alt="UTN BA Motorsport" className="footer__logo" width="215" height="45" /></picture></NavLink>
          <p className="footer__manifesto">{t('footer.description')}</p>
          <div className="footer__social" aria-label={t('footer.socialLabel')}>{SOCIALS.map(([label, href, path]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label={`${t('footer.followOn')} ${label}`}><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg></a>)}</div>
        </div>

        <nav className="footer__nav" aria-label={t('footer.navLabel')}>
          <div className="footer__column"><span className="footer__heading">{t('footer.exploreLabel')}</span><NavLink to={ROUTES.team} className="footer__link">{t('nav.team')}</NavLink><NavLink to={ROUTES.car} className="footer__link">{t('nav.car')}</NavLink><NavLink to={ROUTES.academy} className="footer__link">{t('nav.academy')}</NavLink><NavLink to={ROUTES.aboutFormulaStudent} className="footer__link">{t('nav.aboutFormulaStudent')}</NavLink></div>
          <div className="footer__column"><span className="footer__heading">{t('footer.connectLabel')}</span><NavLink to={ROUTES.news} className="footer__link">{t('nav.news')}</NavLink><NavLink to={ROUTES.joinUs} className="footer__link">{t('nav.joinUs')}</NavLink><NavLink to={ROUTES.sponsors} className="footer__link">{t('nav.sponsors')}</NavLink><a href="/llms.txt" className="footer__link">{t('footer.aiInfo')}</a></div>
        </nav>

        <address className="footer__contact"><span className="footer__heading">{t('footer.contactLabel')}</span><a href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" className="footer__contact-link">{CONTACT_EMAIL}</a><span className="footer__contact-place">{t('footer.address')}</span></address>
      </div>

      <div className="footer__bottom"><p className="footer__copyright">{t('footer.copyright', { year })}</p><button type="button" className="footer__back-top" onClick={() => window.scrollTo({ top: 0 })}>{t('footer.backToTop')} <span aria-hidden="true">↑</span></button></div>
    </div>
  </footer>;
}
