import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-dist';

const root = path.resolve(import.meta.dirname, '..');
const assets = swaggerUi.getAbsoluteFSPath();
const routes = new Map([
  ['/', ['docs/swagger/index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['docs/swagger/index.html', 'text/html; charset=utf-8']],
  ['/openapi.json', ['contracts/openapi.json', 'application/json; charset=utf-8']],
  ['/frontend-integration.md', ['docs/frontend-integration.md', 'text/plain; charset=utf-8']],
  ['/swagger-ui.css', [path.join(assets, 'swagger-ui.css'), 'text/css']],
  ['/swagger-ui-bundle.js', [path.join(assets, 'swagger-ui-bundle.js'), 'text/javascript']],
  ['/swagger-ui-standalone-preset.js', [path.join(assets, 'swagger-ui-standalone-preset.js'), 'text/javascript']]
]);
const port = Number(process.env.DOCS_PORT || 8787);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid DOCS_PORT');
const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  const entry = routes.get(url.pathname);
  if (!entry || !['GET', 'HEAD'].includes(request.method)) { response.writeHead(404); response.end(); return; }
  const file = path.resolve(root, entry[0]);
  response.setHeader('Content-Type', entry[1]); response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  fs.readFile(file, (error, body) => {
    if (error) { response.writeHead(500); response.end('Documentation file unavailable'); return; }
    response.writeHead(200); response.end(request.method === 'HEAD' ? undefined : body);
  });
});
server.listen(port, '127.0.0.1', () => console.log(`Swagger UI: http://127.0.0.1:${port}`));
