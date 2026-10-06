import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server.js';
import { createSitemapXml, INDEXABLE_PATHS } from '../src/seo.js';
import App from '../src/App.jsx';

export async function renderRoute(location) {
  const helmetContext = {};
  let appHtml = '';
  await new Promise((resolve, reject) => {
    const stream = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={location}>
          <App />
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady() {
          stream.pipe(new Writable({
            write(chunk, encoding, callback) {
              appHtml += chunk.toString();
              callback();
            },
            final: resolve,
          }));
        },
        onShellError: reject,
      },
    );
  });
  const helmet = helmetContext.helmet;
  return {
    appHtml,
    helmet: {
      htmlAttributes: helmet.htmlAttributes.toString(),
      title: helmet.title.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString(),
      script: helmet.script.toString(),
    },
  };
}

export { createSitemapXml, INDEXABLE_PATHS };
