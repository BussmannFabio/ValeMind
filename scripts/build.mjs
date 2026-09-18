import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { site, problems, services, technologies, projects } from '../src/content.mjs';
import { header, footer, button, contactForm, closing, icon, escape } from '../src/components.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const assetVersion = '2.0.1';
const intro = (label, title, text) =>
  `<section class="page-intro container"><span class="eyebrow">${label}</span><h1>${title}<span class="accent">.</span></h1><p>${text}</p></section>`;
const cta = () =>
  `<section class="internal-cta container"><div><span class="eyebrow">Vamos conversar</span><h2>O próximo projeto pode ser o seu.</h2></div>${button('/contato/#contato', 'Conte seu problema')}</section>`;

function home() {
  return `<section class="hero container" id="hero"><div class="hero-copy"><span class="eyebrow"><span class="status-dot"></span> Software pensado para o seu negócio</span><h1>Seu problema.<br>Nossa próxima<br><span class="accent">solução.</span></h1><p>Transformamos desafios do seu negócio em soluções digitais simples, eficientes e feitas para a sua realidade.</p><div class="hero-actions">${button('#contato', 'Conte seu problema')}<a class="text-link" href="/sobre/">Conheça a Vale Mind ${icon('arrow')}</a></div><div class="hero-caption"><span class="tiny-line"></span> Do primeiro desafio à solução que faz sentido.</div></div><div class="solution-canvas" role="img" aria-label="De processos manuais, dados espalhados e ferramentas desconectadas a uma solução digital sob medida"><div class="canvas-top"><span>DO DESAFIO À SOLUÇÃO</span><span class="canvas-cross">+</span></div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><svg class="connection-lines" viewBox="0 0 500 490" aria-hidden="true"><path d="M80 120H170Q250 120 250 245M410 160H320Q250 160 250 245M100 340H170Q250 340 250 245M250 275V410"/></svg><div class="floating-label label-one">${icon('repeat')} Processos manuais</div><div class="floating-label label-two">${icon('chart')} Dados espalhados</div><div class="floating-label label-three">${icon('link')} Ferramentas desconectadas</div><div class="solution-core"><img src="/assets/logo.png" width="165" height="116" alt=""><span>Conectar. Simplificar.</span></div><div class="solution-output"><span class="output-check">${icon('check')}</span><div><small>FEITO PARA VOCÊ</small><strong>Uma solução sob medida</strong></div></div><div class="canvas-bottom"><span>Inteligência aplicada ao seu dia a dia</span><span>01 — ∞</span></div></div></section><section class="problems-section" id="solucoes"><div class="container"><div class="section-heading"><div><span class="eyebrow">Reconhece algum desses desafios?</span><h2>Onde a tecnologia pode<br>facilitar seu negócio?</h2></div><a class="text-link" href="/solucoes/">Explore nossas soluções ${icon('arrow')}</a></div><div class="problem-grid">${problems.map(([need, title, text, symbol]) => `<a class="problem-item" href="#contato" data-need="${need}"><span class="problem-icon">${icon(symbol)}</span><div><h3>${title}</h3><p>${text}</p></div><span class="problem-arrow">${icon('arrow')}</span></a>`).join('')}</div></div></section>${contactForm()}${closing()}`;
}

function solutions() {
  return `${intro('Nossas soluções', 'Tecnologia que resolve.<br>Sem complicar', 'Do processo repetitivo ao sistema sob medida: construímos ferramentas que fazem sentido para a rotina da sua empresa.')}<section class="container service-list" aria-label="Serviços">${services.map(([symbol, title, description, features], i) => `<article class="service-row"><span class="service-number">0${i + 1}</span><div class="service-description"><span class="service-icon">${icon(symbol)}</span><h2>${title}</h2><p>${description}</p></div><ul class="feature-list">${features.map((feature) => `<li>${icon('check')}${feature}</li>`).join('')}</ul></article>`).join('')}</section><section class="tech-section" id="tecnologias"><div class="container"><div class="section-heading"><div><span class="eyebrow">Por trás de uma boa solução</span><h2>Uma base técnica sólida.</h2></div><p>Escolhemos a tecnologia a partir do desafio. O resultado precisa ser rápido, seguro e fácil de manter.</p></div><div class="tech-grid">${technologies.map(([name, text]) => `<div><h3>${name}</h3><p>${text}</p></div>`).join('')}</div></div></section>${cta()}`;
}

function about() {
  return `${intro('Sobre a Vale Mind', 'Antes do código,<br>entendemos o seu negócio', 'Unimos engenharia de software e inteligência artificial para resolver gargalos, organizar operações e criar soluções web sob medida.')}<section class="about-statement container"><div class="statement-mark" aria-hidden="true"><img src="/assets/logo.png" width="165" height="116" alt=""></div><div><span class="eyebrow">Tecnologia com propósito</span><h2>Construir o que você precisa.<br>Evoluir junto com você.</h2><p>Uma boa solução começa com escuta. Entendemos a dor real do seu negócio para criar apenas o que você realmente precisa, sem custos desnecessários.</p><p>Combinamos técnica e comunicação transparente para entregar ferramentas úteis, com prazos realistas e contato direto com os desenvolvedores.</p></div></section><section class="working-section" id="diferenciais"><div class="container"><span class="eyebrow">Nossa forma de trabalhar</span><h2>Clareza em cada etapa.</h2><div class="working-grid">${[
    [
      '01',
      'Escutar de verdade',
      'Começamos pela sua rotina: o que trava a operação, o que ocupa tempo e o que precisa melhorar.',
    ],
    [
      '02',
      'Definir com clareza',
      'Alinhamos o escopo e os prazos. Entregas parciais permitem acompanhar o avanço do projeto.',
    ],
    [
      '03',
      'Construir em parceria',
      'Você conversa diretamente com os desenvolvedores responsáveis, sem jargões e com alinhamento contínuo.',
    ],
    [
      '04',
      'Preparar para evoluir',
      'Código organizado, versionamento no GitHub e sistemas preparados para acompanhar o negócio.',
    ],
  ]
    .map(
      ([number, title, text]) =>
        `<article><span>${number}</span><h3>${title}</h3><p>${text}</p></article>`,
    )
    .join('')}</div></div></section>${cta()}`;
}

function portfolio() {
  return `${intro('Projetos', 'Problemas reais.<br>Soluções na prática', 'Conheça os projetos apresentados pela Vale Mind e os desafios de comunicação, gestão e automação que eles ajudam a resolver.')}<section class="container project-list" id="portfolio" aria-label="Projetos da Vale Mind">${projects.map((project, index) => `<article class="project-case"><div class="project-visual visual-${index}"><span class="eyebrow">${project.category}</span><div class="project-diagram">${icon(project.icon)}<span>${project.name}</span><div class="diagram-lines"><i></i><i></i><i></i></div></div><small>Representação ilustrativa da solução</small></div><div class="case-content"><span class="eyebrow">0${index + 1} / ${project.category}</span><h2>${project.name}</h2><h3>O desafio</h3><p>${project.problem}</p><h3>A solução</h3><p>${project.solution}</p><p class="case-outcome">${icon('check')}${project.outcome}</p><ul class="tags" aria-label="Tecnologias utilizadas">${project.tags.map((tag) => `<li>${tag}</li>`).join('')}</ul></div></article>`).join('')}</section>${cta()}`;
}

function contact() {
  return `${intro('Contato', 'Seu próximo passo<br>começa aqui', 'Uma ideia, um processo que não funciona ou um sistema que precisa evoluir. Conte com a gente para entender o caminho.')}<div class="container contact-channels"><a href="mailto:${site.email}">${icon('mail')}<span><small>E-mail</small>${site.email}</span>${icon('arrow')}</a><div>${icon('globe')}<span><small>Onde atendemos</small>Atendimento remoto em todo o Brasil</span></div></div>${contactForm()}`;
}

const pages = [
  [
    '/',
    'ValeMind | Seu problema. Nossa próxima solução.',
    'Transformamos desafios do seu negócio em soluções digitais simples e sob medida. Conte seu problema e converse com a Vale Mind.',
    home(),
  ],
  [
    '/solucoes/',
    'Soluções em software, IA e automação | ValeMind',
    'Sistemas web, dashboards, chatbots, integrações e modernização de software. Conheça as soluções e tecnologias da Vale Mind.',
    solutions(),
  ],
  [
    '/sobre/',
    'Sobre a Vale Mind | Tecnologia com propósito',
    'Conheça a Vale Mind e nossa forma de trabalhar: escuta, transparência, contato direto e software preparado para evoluir.',
    about(),
  ],
  [
    '/projetos/',
    'Projetos | ValeMind',
    'Conheça ValeBot AI, GestorWeb e AutoSync: soluções de atendimento, gestão e integração de dados apresentadas pela Vale Mind.',
    portfolio(),
  ],
  [
    '/contato/',
    'Conte seu problema | ValeMind',
    'Conte o desafio do seu negócio. Entre em contato com a Vale Mind para conversar sobre sistemas, automação e soluções digitais.',
    contact(),
  ],
];

function document(path, title, description, body) {
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#ffffff"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${site.url}${path}"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="ValeMind"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${site.url}${path}"><meta property="og:image" content="${site.url}/assets/logo.png"><meta property="og:image:alt" content="Logo ValeMind"><meta name="twitter:card" content="summary"><link rel="icon" href="/assets/logo_icon.png?v=${assetVersion}" type="image/png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/style.css?v=${assetVersion}"><script src="/script.js?v=${assetVersion}" defer></script></head><body>${header(path)}<main id="main">${body}</main>${footer()}</body></html>\n`;
}

for (const [path, title, description, body] of pages) {
  const directory = resolve(root, `.${path}`);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), document(path, title, description, body));
}
await writeFile(
  resolve(root, '404.html'),
  document(
    '/404.html',
    'Página não encontrada | ValeMind',
    'Volte à página inicial da Vale Mind.',
    `<section class="container page-intro"><span class="eyebrow">Erro 404</span><h1>Esse caminho<br>não existe<span class="accent">.</span></h1><p>Mas podemos ajudar você a encontrar uma solução.</p>${button('/', 'Voltar para a Home')}</section>`,
  ).replace(
    '<meta name="description"',
    '<meta name="robots" content="noindex"><meta name="description"',
  ),
);
await writeFile(
  resolve(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(([path]) => `<url><loc>${site.url}${path}</loc></url>`).join('')}</urlset>\n`,
);
await writeFile(
  resolve(root, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`,
);
console.log(`Built ${pages.length} static pages, 404, sitemap and robots.txt.`);
