import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { site } from '../src/content.mjs';

const pages = [
  'index.html',
  'solucoes/index.html',
  'sobre/index.html',
  'projetos/index.html',
  'contato/index.html',
  '404.html',
];
for (const file of pages) {
  test(`${file}: static content, metadata, local links and unique IDs`, async () => {
    const html = await readFile(file, 'utf8');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.match(html, /<html lang="pt-BR">/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /src="\/assets\/logo.png"/);
    assert.ok(!html.includes('href="#"'));
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size);
    for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (href.startsWith('#')) {
        assert.ok(ids.includes(href.slice(1)), `Missing anchor ${href}`);
        continue;
      }
      if (!href.startsWith('/')) continue;
      const [pathWithQuery, anchor] = href.split('#');
      const pathname = pathWithQuery.split('?')[0];
      const target = resolve(`.${pathname.endsWith('/') ? pathname + 'index.html' : pathname}`);
      await access(target);
      if (anchor) assert.ok((await readFile(target, 'utf8')).includes(`id="${anchor}"`));
    }
  });
}
test('Home remains focused; technical content and cases remain on internal pages', async () => {
  const home = await readFile('index.html', 'utf8');
  assert.equal((home.match(/<section\b/g) || []).length, 4);
  assert.ok(!home.includes('Prisma'));
  assert.ok(!home.includes('GestorWeb'));
  const solutions = await readFile('solucoes/index.html', 'utf8');
  for (const name of ['Prisma', 'PyTorch', 'Angular', 'WhatsApp', 'Redis'])
    assert.ok(solutions.includes(name));
  const projects = await readFile('projetos/index.html', 'utf8');
  for (const name of ['ValeBot AI', 'GestorWeb', 'AutoSync']) assert.ok(projects.includes(name));
});
test('GitHub Pages domain and configured contact email are preserved', async () => {
  assert.equal((await readFile('CNAME', 'utf8')).trim(), 'valemind.tech');
  assert.equal(site.email, 'contatovalemind@gmail.com');
  assert.equal(site.contactEndpoint, '');
});
