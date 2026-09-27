import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the viewer communicates the USD 500 entry point without fixed tiers', async () => {
  const [html, script] = await Promise.all([
    readFile(new URL('../public/visor/visor.html', import.meta.url), 'utf8'),
    readFile(new URL('../public/visor/visor.js', import.meta.url), 'utf8'),
  ]);

  assert.match(html, /Podés participar desde USD 500/);
  assert.doesNotMatch(html, /id="sponsor-tier"|data-tier=/);
  assert.doesNotMatch(script, /SPONSOR_TIERS|selectedTier|availableSponsorSlots/);
});

test('the Sponsors hero offers direct access to the logo viewer', async () => {
  const page = await readFile(new URL('../src/pages/Sponsors.jsx', import.meta.url), 'utf8');
  const hero = page.match(/<header className="sp-hero">([\s\S]*?)<\/header>/)?.[1] ?? '';

  assert.match(hero, /href="\/visor\/visor\.html"/);
  assert.match(hero, /sponsorsPage\.viewer\.button/);
});
