import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { ROUTES, CONTACT_HREF } from '../src/routes.js';
import { getSeoForPath } from '../src/seo.js';
import { POLICY_CONTENT } from '../src/data/policyContent.js';

const siteUrl = 'https://utnbamotorsport.com.ar';

test('every public route has unique SEO metadata and its own canonical URL', () => {
  const paths = Object.values(ROUTES);
  const metadata = paths.map(getSeoForPath);

  assert.equal(new Set(metadata.map(({ title }) => title)).size, paths.length);
  assert.equal(new Set(metadata.map(({ description }) => description)).size, paths.length);

  for (const [index, path] of paths.entries()) {
    assert.ok(metadata[index].title.includes('UTN BA Motorsport'));
    assert.ok(metadata[index].description.length >= 80);
    assert.equal(metadata[index].canonical, `${siteUrl}${path === '/' ? '/' : path}`);
  }
});

test('unknown routes use noindex metadata', () => {
  const metadata = getSeoForPath('/ruta-inexistente');

  assert.equal(metadata.robots, 'noindex, nofollow');
  assert.equal(metadata.canonical, null);
});

test('contact works with any email client', () => {
  assert.equal(CONTACT_HREF, 'mailto:motorsports@frba.utn.edu.ar');
});

test('sitemap contains legal and privacy pages', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');

  assert.match(sitemap, /https:\/\/utnbamotorsport\.com\.ar\/aviso-legal/);
  assert.match(sitemap, /https:\/\/utnbamotorsport\.com\.ar\/privacidad/);
});

test('legal information covers the current site behavior in every language', () => {
  for (const language of ['es', 'en', 'pt']) {
    const content = POLICY_CONTENT[language];
    assert.ok(content.legal.sections.length >= 3);
    assert.ok(content.privacy.sections.length >= 4);

    const privacyText = content.privacy.sections.flatMap(({ paragraphs }) => paragraphs).join(' ').toLowerCase();
    assert.match(privacyText, /localstorage|local storage|almacenamiento local/);
    assert.ok(privacyText.includes('motorsports@frba.utn.edu.ar'));
  }
});

test('the primary call to action supports the team from the first screen', async () => {
  const [home, header] = await Promise.all([
    readFile(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/Header.jsx', import.meta.url), 'utf8'),
  ]);

  assert.match(home, /hero__actions[\s\S]*ROUTES\.sponsors/);
  assert.match(header, /header__cta[\s\S]*heroCtaPrimary/);
});

test('Vercel serves the site with baseline security headers', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const headers = Object.fromEntries(config.headers[0].headers.map(({ key, value }) => [key, value]));

  assert.match(headers['Strict-Transport-Security'], /max-age=31536000/);
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
});

test('hero uses an ignition sequence with a single primary action', async () => {
  const [home, styles] = await Promise.all([
    readFile(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/home.css', import.meta.url), 'utf8'),
  ]);

  assert.match(home, /hero__ignition/);
  assert.equal((home.match(/hero__actions/g) || []).length, 1);
  assert.match(styles, /@keyframes hero-ignition-sweep/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});
