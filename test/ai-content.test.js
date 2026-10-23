import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildAiDocuments } from '../scripts/ai-content.js';
import { SPONSORS } from '../src/data/sponsors.js';
import { ROUTES, COMMERCIAL_CONTACT_HREF } from '../src/routes.js';

const locale = JSON.parse(await readFile(new URL('../src/locales/es.json', import.meta.url), 'utf8'));
const news = JSON.parse(await readFile(new URL('../src/data/news.json', import.meta.url), 'utf8'));
const docs = buildAiDocuments(locale, news);

test('each public page has a complete Markdown reference and llms links resolve to generated files', async () => {
  for (const route of Object.values(ROUTES)) {
    const file = route === '/' ? 'index.md' : `${route.slice(1)}.md`;
    assert.ok(docs.has(file), file);
    assert.doesNotMatch(docs.get(file), /undefined|\[object Object\]|^##\s*$/m, file);
    assert.ok(docs.get('llms-full.txt').includes(docs.get(file)), file);
  }
  const index = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');
  for (const [, file] of index.matchAll(/https:\/\/utnbamotorsport\.com\.ar\/([^\s)]+\.md)/g)) {
    assert.ok(docs.has(file), `Broken llms reference: ${file}`);
  }
});

test('AI references use live sponsor and news sources and distinguish goals from results', () => {
  const sponsors = docs.get('sponsors.md');
  for (const sponsor of SPONSORS) assert.ok(sponsors.includes(sponsor.href), sponsor.name);
  assert.ok(sponsors.includes(COMMERCIAL_CONTACT_HREF));
  assert.doesNotMatch(sponsors, /Ernesto Mayer/);
  for (const post of news.es.posts) assert.ok(docs.get('novedades.md').includes(post.id), post.id);
  assert.match(docs.get('info/preguntas-frecuentes.md'), /no un resultado ya conseguido/);
  assert.match(docs.get('info/prensa.md'), /no prueba de un acuerdo de patrocinio/);
});
