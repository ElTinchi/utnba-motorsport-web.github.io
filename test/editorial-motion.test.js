import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { StaticRouter } from 'react-router-dom/server.js';
import { createServer } from 'vite';

import {
  deriveVisibilityState,
  getVisibilityFallback,
} from '../src/hooks/useInView.js';
import { getReducedMotionPreference } from '../src/hooks/useReducedMotion.js';
import { buildCommercialContactHref } from '../src/routes.js';
import {
  formatAnimatedValue,
  getEditorialRevealProps,
  getStaggerDelay,
  parseAnimatedValue,
} from '../src/utils/editorialMotion.js';

test('visibility stays stable while an element only grazes the viewport boundary', () => {
  assert.equal(deriveVisibilityState(false, { isIntersecting: true, intersectionRatio: 0.08 }), false);
  assert.equal(deriveVisibilityState(false, { isIntersecting: true, intersectionRatio: 0.24 }), true);
  assert.equal(deriveVisibilityState(true, { isIntersecting: true, intersectionRatio: 0.08 }), true);
  assert.equal(deriveVisibilityState(true, { isIntersecting: false, intersectionRatio: 0 }), false);
});

test('visibility fallback exposes content without IntersectionObserver or with reduced motion', () => {
  assert.equal(getVisibilityFallback({ hasObserver: false, reducedMotion: false }), true);
  assert.equal(getVisibilityFallback({ hasObserver: true, reducedMotion: true }), true);
  assert.equal(getVisibilityFallback({ hasObserver: true, reducedMotion: false }), false);
});

test('reduced motion defaults safely when matchMedia is unavailable', () => {
  assert.equal(getReducedMotionPreference(undefined), false);
  assert.equal(getReducedMotionPreference({ matches: true }), true);
  assert.equal(getReducedMotionPreference({ matches: false }), false);
});

test('animated numbers preserve affixes and regional grouping', () => {
  assert.deepEqual(parseAnimatedValue('62%'), {
    target: 62,
    prefix: '',
    suffix: '%',
    grouped: false,
  });
  assert.equal(formatAnimatedValue(parseAnimatedValue('600+'), 600, 'en'), '600+');
  assert.equal(formatAnimatedValue(parseAnimatedValue('~20.000'), 20000, 'es'), '~20.000');
  assert.equal(formatAnimatedValue(parseAnimatedValue('~20.000'), 20000, 'en'), '~20,000');
});

test('stagger delay is local instead of accumulating across a long list', () => {
  assert.equal(getStaggerDelay(0, 80), 0);
  assert.equal(getStaggerDelay(3, 80), 240);
  assert.equal(getStaggerDelay(20, 80), 0);
  assert.throws(() => getStaggerDelay(1, 140), /60 and 100/);
});

test('editorial reveal properties preserve semantic elements and expose state', () => {
  assert.deepEqual(getEditorialRevealProps({
    as: 'article',
    direction: 'left',
    mask: 'horizontal',
    visible: true,
    className: 'story',
  }), {
    element: 'article',
    className: 'editorial-reveal editorial-reveal--left editorial-reveal--mask-horizontal editorial-reveal--visible story',
    'data-motion': 'editorial-reveal',
  });
});

test('commercial contact encodes the requested subject and short handoff body', () => {
  const contact = new URL(buildCommercialContactHref());

  assert.equal(contact.protocol, 'mailto:');
  assert.equal(contact.pathname, 'motorsports@frba.utn.edu.ar');
  assert.equal(contact.searchParams.get('subject'), 'Alianza con UTN BA Motorsport');
  assert.equal(
    contact.searchParams.get('body'),
    'Hola, les escribo de [empresa]. ¿Me pasan un WhatsApp para conversar?',
  );
  assert.equal(contact.href.includes('wa.me'), false);
});

test('commercial contact accepts a company name without changing the message contract', () => {
  const contact = new URL(buildCommercialContactHref({ company: 'Acme & Cía' }));
  assert.equal(
    contact.searchParams.get('body'),
    'Hola, les escribo de Acme & Cía. ¿Me pasan un WhatsApp para conversar?',
  );
});

test('sponsor journey offers contact after evidence, value, and at the close', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });

  try {
    const [{ default: Sponsors }, localeSource] = await Promise.all([
      server.ssrLoadModule('/src/pages/Sponsors.jsx'),
      readFile(new URL('../src/locales/es.json', import.meta.url), 'utf8'),
    ]);
    const instance = i18next.createInstance();
    await instance.init({
      lng: 'es',
      fallbackLng: 'es',
      initImmediate: false,
      resources: { es: { translation: JSON.parse(localeSource) } },
    });

    const html = renderToStaticMarkup(createElement(
      I18nextProvider,
      { i18n: instance },
      createElement(StaticRouter, { location: '/sponsors' }, createElement(Sponsors)),
    ));

    assert.equal((html.match(/data-contact-opportunity=/g) || []).length, 3);
    assert.equal((html.match(/href="mailto:/g) || []).length, 3);
    assert.match(html, /id="alianza"/);
    assert.match(html, /Conversemos sobre una alianza/);
  } finally {
    await server.close();
  }
});

test('narrative routes use shared motion while sober routes remain static', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });
  const localeSource = await readFile(new URL('../src/locales/es.json', import.meta.url), 'utf8');
  const instance = i18next.createInstance();
  await instance.init({
    lng: 'es', fallbackLng: 'es', initImmediate: false,
    resources: { es: { translation: JSON.parse(localeSource) } },
  });

  async function renderPage(modulePath, location, props) {
    const { default: Page } = await server.ssrLoadModule(modulePath);
    return renderToStaticMarkup(createElement(
      I18nextProvider,
      { i18n: instance },
      createElement(StaticRouter, { location }, createElement(Page, props)),
    ));
  }

  try {
    const narrativeRoutes = [
      ['/src/pages/Home.jsx', '/'],
      ['/src/pages/Academy.jsx', '/la-academia'],
      ['/src/pages/FormulaStudent.jsx', '/formula-student'],
      ['/src/pages/Car.jsx', '/el-auto'],
      ['/src/pages/Team.jsx', '/el-equipo'],
      ['/src/pages/News.jsx', '/novedades'],
      ['/src/pages/JoinUs.jsx', '/sumate'],
    ];
    for (const [modulePath, location] of narrativeRoutes) {
      const html = await renderPage(modulePath, location);
      assert.match(html, /data-motion="editorial-reveal"|class="[^"]*stagger-item/, location);
    }

    const legal = await renderPage('/src/pages/PolicyPage.jsx', '/privacidad', { type: 'privacy' });
    const notFound = await renderPage('/src/pages/NotFound.jsx', '/ruta-inexistente');
    assert.doesNotMatch(legal, /data-motion="editorial-reveal"|stagger-item/);
    assert.doesNotMatch(notFound, /data-motion="editorial-reveal"|stagger-item/);
  } finally {
    await server.close();
  }
});
