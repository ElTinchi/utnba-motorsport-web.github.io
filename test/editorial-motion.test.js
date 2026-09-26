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
  getEffectiveEnterThreshold,
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

test('tall sections reveal after at most one fifth of the viewport is exposed', () => {
  assert.equal(getEffectiveEnterThreshold({
    requestedThreshold: 0.2,
    elementHeight: 5115,
    viewportHeight: 568,
  }), 0.0223);
  assert.equal(getEffectiveEnterThreshold({
    requestedThreshold: 0.2,
    elementHeight: 2232,
    viewportHeight: 774,
  }), 0.0694);
  assert.equal(getEffectiveEnterThreshold({
    requestedThreshold: 0.2,
    elementHeight: 400,
    viewportHeight: 568,
  }), 0.2);
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

test('keyboard focus exposes controls immediately including nested sponsor content', async () => {
  const [motionCss, sponsorCss] = await Promise.all([
    readFile(new URL('../src/styles/editorial-motion.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/sponsors.css', import.meta.url), 'utf8'),
  ]);

  assert.match(motionCss, /\.editorial-reveal:focus-within,[^{]*\.stagger-item:focus-within\s*\{[^}]*transition:\s*none/);
  assert.match(sponsorCss, /\.sp-viewer:focus-within \.sp-viewer__visual[^}]*clip-path:\s*inset\(0\)/);
  assert.match(sponsorCss, /\.sp-viewer:focus-within \.sp-viewer__copy[^}]*opacity:\s*1[^}]*transform:\s*translateX\(0\)[^}]*transition:\s*none/);
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

test('home preserves its tuned highlight and seven-area choreography', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });
  try {
    const [{ default: Home }, localeSource] = await Promise.all([
      server.ssrLoadModule('/src/pages/Home.jsx'),
      readFile(new URL('../src/locales/es.json', import.meta.url), 'utf8'),
    ]);
    const instance = i18next.createInstance();
    await instance.init({ lng: 'es', initImmediate: false, resources: { es: { translation: JSON.parse(localeSource) } } });
    const html = renderToStaticMarkup(createElement(
      I18nextProvider,
      { i18n: instance },
      createElement(StaticRouter, { location: '/' }, createElement(Home)),
    ));

    assert.doesNotMatch(html, /home-highlight[^\"]*home-highlight--visible/);
    assert.match(html, /--area-delay:0ms/);
    assert.match(html, /--area-delay:390ms/);
  } finally {
    await server.close();
  }
});

test('team photo keeps its observed surface unclipped so the reveal can start', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });
  try {
    const [{ default: Team }, localeSource] = await Promise.all([
      server.ssrLoadModule('/src/pages/Team.jsx'),
      readFile(new URL('../src/locales/es.json', import.meta.url), 'utf8'),
    ]);
    const instance = i18next.createInstance();
    await instance.init({ lng: 'es', initImmediate: false, resources: { es: { translation: JSON.parse(localeSource) } } });
    const html = renderToStaticMarkup(createElement(
      I18nextProvider,
      { i18n: instance },
      createElement(StaticRouter, { location: '/el-equipo' }, createElement(Team)),
    ));

    assert.match(html, /class="[^"]*team-photo[^"]*"/);
    assert.doesNotMatch(html, /class="[^"]*editorial-reveal--mask-horizontal[^"]*team-photo/);
  } finally {
    await server.close();
  }
});

test('featured news and car hero keep their observed surfaces unclipped', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });
  try {
    const [{ default: News }, { default: Car }, localeSource] = await Promise.all([
      server.ssrLoadModule('/src/pages/News.jsx'),
      server.ssrLoadModule('/src/pages/Car.jsx'),
      readFile(new URL('../src/locales/es.json', import.meta.url), 'utf8'),
    ]);
    const instance = i18next.createInstance();
    await instance.init({ lng: 'es', initImmediate: false, resources: { es: { translation: JSON.parse(localeSource) } } });
    const render = (Page, location) => renderToStaticMarkup(createElement(
      I18nextProvider,
      { i18n: instance },
      createElement(StaticRouter, { location }, createElement(Page)),
    ));
    const news = render(News, '/novedades');
    const car = render(Car, '/el-auto');

    assert.match(news, /news-featured-reveal/);
    assert.match(car, /car-hero-reveal/);
    assert.doesNotMatch(news, /editorial-reveal--mask-horizontal[^"]*news-featured-reveal/);
    assert.doesNotMatch(car, /editorial-reveal--mask-horizontal[^"]*car-hero-reveal/);
  } finally {
    await server.close();
  }
});

test('academy gives long statistics a fitting typography variant', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });
  try {
    const [{ default: Academy }, localeSource] = await Promise.all([
      server.ssrLoadModule('/src/pages/Academy.jsx'),
      readFile(new URL('../src/locales/es.json', import.meta.url), 'utf8'),
    ]);
    const instance = i18next.createInstance();
    await instance.init({ lng: 'es', initImmediate: false, resources: { es: { translation: JSON.parse(localeSource) } } });
    const html = renderToStaticMarkup(createElement(
      I18nextProvider,
      { i18n: instance },
      createElement(StaticRouter, { location: '/la-academia' }, createElement(Academy)),
    ));

    assert.equal((html.match(/stat-item--wide/g) || []).length, 1);
  } finally {
    await server.close();
  }
});
