import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import '../styles/join.css';

const INSTAGRAM_URL = 'https://www.instagram.com/utnbamotorsport/';

export default function JoinUs() {
  const { t } = useTranslation();
  const steps = t('joinPage.steps', { returnObjects: true });

  return (
    <PageShell
      kicker={t('joinPage.kicker')}
      title={t('joinPage.title')}
      intro={t('joinPage.intro')}
    >
      <div className="shell-block">
        <div className="join-callout">
          <span className="join-callout__status">{t('joinPage.status')}</span>
          <h2 className="join-callout__title">{t('joinPage.calloutTitle')}</h2>
          <p className="join-callout__text">{t('joinPage.calloutText')}</p>
          <a className="btn btn--primary" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            {t('joinPage.instagramButton')}
          </a>
        </div>
      </div>

      <div className="shell-block">
        <h2 className="shell-block__title">{t('joinPage.stepsTitle')}</h2>
        <ol className="join-steps">
          {steps.map((step, index) => (
            <li key={step.title} className="join-step">
              <span className="join-step__number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="join-step__title">{step.title}</h3>
                <p className="join-step__body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="join-selection-note">{t('joinPage.selectionNote')}</p>
      </div>
    </PageShell>
  );
}
