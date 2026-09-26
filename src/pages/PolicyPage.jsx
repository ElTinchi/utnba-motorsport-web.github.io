import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import { POLICY_CONTENT } from '../data/policyContent.js';
import '../styles/policy.css';

export default function PolicyPage({ type }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.split('-')[0] || 'es';
  const languageContent = POLICY_CONTENT[language] || POLICY_CONTENT.es;
  const content = languageContent[type];

  return (
    <PageShell kicker={content.kicker} title={content.title} intro={content.intro} motion={false}>
      <div className="policy" aria-label={content.title}>
        <p className="policy__updated">{languageContent.updated}</p>
        {content.sections.map((section) => (
          <section key={section.title} className="policy__section">
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </div>
    </PageShell>
  );
}
