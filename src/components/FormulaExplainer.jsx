import { useTranslation } from 'react-i18next';

export default function FormulaExplainer() {
  const { t } = useTranslation();
  return <section id="que-es-formula-sae" className="formula-explainer" aria-labelledby="formula-explainer-title">
    <h2 id="formula-explainer-title">{t('formulaExplainer.title')}</h2>
    <p>{t('formulaExplainer.definition')}</p>
    <p>{t('formulaExplainer.nickname')}</p>
    <h3>{t('formulaExplainer.formulaTitle')}</h3>
    <p>{t('formulaExplainer.formula')}</p>
    <p className="formula-explainer__sources"><a href="https://saemobilus.sae.org/papers/improving-michigan-tech-formula-sae-design-process-2019-01-0807" target="_blank" rel="noopener noreferrer">SAE International ↗</a> · <a href="https://www.formula1.com/en/latest/article/f1-glossary-f-j.2g6grJVxT6dFCDpSmgoCQX" target="_blank" rel="noopener noreferrer">Formula 1 ↗</a></p>
  </section>;
}
