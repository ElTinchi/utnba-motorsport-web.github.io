import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { ROUTES, CONTACT_HREF } from '../src/routes.js';
import { createSitemapXml, getSeoForPath, INDEXABLE_PATHS } from '../src/seo.js';
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
  assert.equal(metadata.canonical, undefined);
});

test('trailing slash URLs retain their route metadata and canonical URL', () => {
  assert.equal(getSeoForPath('/el-equipo/').canonical, `${siteUrl}/el-equipo`);
});

test('contact works with any email client', () => {
  assert.equal(CONTACT_HREF, 'mailto:motorsports@frba.utn.edu.ar');
});

test('sitemap includes each canonical route once and excludes unknown paths', () => {
  const sitemap = createSitemapXml([...INDEXABLE_PATHS, '/unknown', ROUTES.home]);
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);

  assert.equal(new Set(locations).size, locations.length);
  assert.equal(locations.length, INDEXABLE_PATHS.length);
  assert.ok(locations.includes(`${siteUrl}/aviso-legal`));
  assert.ok(locations.includes(`${siteUrl}/privacidad`));
  assert.ok(!sitemap.includes('/unknown'));
});

test('SEO metadata supplies complete social previews with absolute URLs', () => {
  for (const path of INDEXABLE_PATHS) {
    const seo = getSeoForPath(path);
    assert.equal(seo.ogUrl, seo.canonical);
    assert.match(seo.ogImage, /^https:\/\//);
    assert.ok(seo.ogImageAlt);
    assert.equal(seo.twitterImage, seo.ogImage);
  }
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

  assert.match(home, /hero__actions[\s\S]*href={COMMERCIAL_CONTACT_HREF}/);
  assert.match(header, /href={COMMERCIAL_CONTACT_HREF}[\s\S]*header__cta[\s\S]*sponsorsPage.primaryCta/);
});

test('the cPanel server sends baseline security headers and compresses the 3D model', async () => {
  const htaccess = await readFile(new URL('../public/.htaccess', import.meta.url), 'utf8');

  assert.match(htaccess, /Header always set Strict-Transport-Security "max-age=31536000"/);
  assert.match(htaccess, /Header always set X-Content-Type-Options "nosniff"/);
  assert.match(htaccess, /Header always set X-Frame-Options "SAMEORIGIN"/);
  assert.match(htaccess, /Header always set Referrer-Policy "strict-origin-when-cross-origin"/);
  assert.match(htaccess, /AddOutputFilterByType DEFLATE model\/gltf-binary/);
});

test('hero exposes the actual car with a booking action and reduced-motion alternative', async () => {
  const [home, styles] = await Promise.all([
    readFile(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/cinematic.css', import.meta.url), 'utf8'),
  ]);

  assert.match(home, /<HeroArtwork/);
  assert.equal((home.match(/hero__actions/g) || []).length, 1);
  assert.match(home, /href="#auto-en-movimiento"/);
  assert.match(styles, /@keyframes cinematic-title/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});
