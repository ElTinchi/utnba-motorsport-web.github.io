import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import { AREAS } from '../components/AreasGrid.jsx';
import { CONTACT_EMAIL, YOUTH_ANCHOR } from '../routes';
import '../styles/join.css';

// ============================================================
// Backend del formulario
// ============================================================
// El sitio es estático, así que el formulario necesita un servicio que reciba
// el POST. Formspree tiene plan gratis y no pide backend propio:
//   1. Crear un form en https://formspree.io con el mail del equipo.
//   2. Pegar acá la URL que te da (https://formspree.io/f/xxxxxxx).
//
// Mientras esto sea null, el formulario no se muestra y en su lugar queda el
// mailto — que funciona, pero convierte mucho peor: en el celular abre una app
// de mail que mucha gente no tiene configurada y ahí se pierde el contacto.
const FORM_ENDPOINT = null;

export default function JoinUs() {
  const { t } = useTranslation();
  const steps = t('joinPage.steps', { returnObjects: true });
  const expectations = t('joinPage.expectations', { returnObjects: true });

  // idle -> sending -> ok | error
  const [status, setStatus] = useState('idle');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(event.target),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      event.target.reset();
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  }

  return (
    <PageShell
      kicker={t('joinPage.kicker')}
      title={t('joinPage.title')}
      intro={t('joinPage.intro')}
    >
      {/* ====== Qué esperamos / qué no hace falta ====== */}
      <div className="shell-block">
        <h2 className="shell-block__title">{t('joinPage.expectationsTitle')}</h2>
        <ul className="join-list" role="list">
          {expectations.map((item) => (
            <li key={item.title} className="join-list__item">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ====== Cómo es el proceso ====== */}
      <div className="shell-block">
        <h2 className="shell-block__title">{t('joinPage.stepsTitle')}</h2>
        <ol className="join-steps">
          {steps.map((step, i) => (
            <li key={step.title} className="join-step">
              <span className="join-step__number">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="join-step__title">{step.title}</h3>
                <p className="join-step__body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* ====== Formulario ====== */}
      <div className="shell-block">
        <div className="join-form-wrap" id="formulario">
          <h2 className="join-form__title">{t('joinPage.formTitle')}</h2>
          <p className="join-form__text">{t('joinPage.formText')}</p>

          {FORM_ENDPOINT ? (
            <form className="join-form" onSubmit={handleSubmit}>
              <div className="join-form__row">
                <label className="join-field">
                  <span>{t('joinPage.form.name')}</span>
                  <input type="text" name="nombre" required autoComplete="name" />
                </label>

                <label className="join-field">
                  <span>{t('joinPage.form.email')}</span>
                  <input type="email" name="email" required autoComplete="email" />
                </label>
              </div>

              <div className="join-form__row">
                <label className="join-field">
                  <span>{t('joinPage.form.career')}</span>
                  <input type="text" name="carrera" />
                </label>

                <label className="join-field">
                  <span>{t('joinPage.form.area')}</span>
                  <select name="area" defaultValue="">
                    <option value="">{t('joinPage.form.areaAny')}</option>
                    {AREAS.map((area) => (
                      <option key={area.id} value={t(`areas.items.${area.id}.title`)}>
                        {t(`areas.items.${area.id}.title`)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="join-field">
                <span>{t('joinPage.form.message')}</span>
                <textarea name="mensaje" rows="5" required />
              </label>

              <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? t('joinPage.form.sending') : t('joinPage.form.submit')}
              </button>

              {/* aria-live: quien usa lector de pantalla se entera del resultado
                  sin tener que ir a buscarlo */}
              <p className="join-form__status" role="status" aria-live="polite">
                {status === 'ok' && t('joinPage.form.ok')}
                {status === 'error' && t('joinPage.form.error', { email: CONTACT_EMAIL })}
              </p>
            </form>
          ) : (
            <div className="join-form__fallback">
              <p>{t('joinPage.form.noBackend')}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn--primary">
                {CONTACT_EMAIL}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ====== Trabajo con jóvenes (antes era una página aparte) ====== */}
      <div className="shell-block">
        <div className="join-youth" id={YOUTH_ANCHOR}>
          <span className="join-youth__kicker">{t('joinPage.youth.kicker')}</span>
          <h2 className="join-youth__title">{t('joinPage.youth.title')}</h2>
          <p className="join-youth__text">{t('joinPage.youth.text')}</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn--secondary">
            {t('joinPage.youth.button')}
          </a>
        </div>
      </div>
    </PageShell>
  );
}
