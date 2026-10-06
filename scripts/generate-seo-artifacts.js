import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

export async function generateSeoArtifacts() {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const require = createRequire(import.meta.url);
  const { renderRoute } = require(path.join(DIST, 'server-render.cjs'));
  const { createSitemapXml, INDEXABLE_PATHS } = await import('../src/seo.js');

  for (const route of [...INDEXABLE_PATHS, '/__not-found__']) {
    const { appHtml, helmet } = await renderRoute(route);
    const html = template
      .replace('<html lang="es-AR">', `<html ${helmet.htmlAttributes}>`)
      .replace(/<title>[\s\S]*?<\/title>/, helmet.title)
      .replace(/<meta name="description"[^>]*>/, '')
      .replace(/<meta name="robots"[^>]*>/, '')
      .replace(/<link rel="canonical"[^>]*>/, '')
      .replace(/<meta property="og:[^"]+"[^>]*>/g, '')
      .replace(/<meta name="twitter:[^"]+"[^>]*>/g, '')
      .replace('</head>', `${helmet.meta}\n${helmet.link}\n${helmet.script}\n</head>`)
      .replace('<!--app-html-->', appHtml);

    const output = route === '/__not-found__'
      ? path.join(DIST, '404.html')
      : route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.slice(1), 'index.html');
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html);
  }

  await writeFile(path.join(DIST, 'sitemap.xml'), createSitemapXml());
  await rm(path.join(DIST, 'server-render.cjs'), { force: true });
  const assetsDir = path.join(DIST, 'assets');
  for (const file of await readdir(assetsDir)) {
    if (file.endsWith('.cjs')) await rm(path.join(assetsDir, file), { force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await generateSeoArtifacts();
}
