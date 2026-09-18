import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let path = resolve(root, `.${pathname}`);
      if (
        (path !== root && !path.startsWith(root + sep)) ||
        pathname.split('/').some((segment) => segment.startsWith('.'))
      ) {
        res.writeHead(403).end();
        return;
      }
      if ((await stat(path)).isDirectory()) {
        if (!pathname.endsWith('/')) {
          res.writeHead(301, { Location: pathname + '/' }).end();
          return;
        }
        path = resolve(path, 'index.html');
      }
      res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
      res.end(await readFile(path));
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(await readFile(resolve(root, '404.html')));
    }
  })
  .listen(4173, '127.0.0.1', () => console.log('ValeMind preview: http://127.0.0.1:4173'));
