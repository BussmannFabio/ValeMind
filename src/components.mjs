import { site, needs } from './content.mjs';

export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
const paths = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  repeat: '<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>',
  window: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M8 4v5m1 5h6m-6 3h3"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
  chart: '<path d="M4 3v17h17M8 15v-4m5 4V6m5 9V9"/>',
  link: '<path d="m10 13 4-4m-6 7-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 1)"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  message:
    '<path d="M21 11a8 8 0 0 1-8 8H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8m-8 4h5"/>',
  database:
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
};
export const icon = (name) =>
  `<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
export const brand = () =>
  '<a class="brand" href="/" aria-label="ValeMind — página inicial"><img src="/assets/logo.png" width="165" height="116" alt=""><span>Vale<span class="brand-mind">Mind</span><span class="brand-dot">.</span></span></a>';
const navigation = [
  ['/', 'Home'],
  ['/solucoes/', 'Soluções'],
  ['/sobre/', 'Sobre'],
  ['/projetos/', 'Projetos'],
  ['/contato/', 'Contato'],
];
export const button = (href, label, secondary = false) =>
  `<a class="button${secondary ? ' button-secondary' : ''}" href="${href}">${label}${icon('arrow')}</a>`;

export function header(path) {
  return `<a class="skip-link" href="#main">Pular para o conteúdo</a><header class="site-header"><div class="container header-inner">${brand()}<button class="menu-toggle" aria-controls="navigation" aria-expanded="false" hidden>Menu <span aria-hidden="true">☰</span></button><nav id="navigation" aria-label="Navegação principal">${navigation.map(([href, label]) => `<a href="${href}"${path === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}<a class="button nav-cta" href="${path === '/' ? '#contato' : '/contato/#contato'}">Fale com a Vale Mind ${icon('arrow')}</a></nav></div></header>`;
}

export function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-top">${brand()}<p>Tecnologia com propósito.<br>Soluções para o seu negócio.</p><nav aria-label="Navegação do rodapé">${navigation
    .slice(1)
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join(
      '',
    )}</nav><a class="footer-email" href="mailto:${site.email}">${site.email}${icon('arrow')}</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ValeMind. Todos os direitos reservados.</span><span>Atendimento remoto em todo o Brasil ${icon('globe')}</span></div></div></footer>`;
}

export function contactForm() {
  return `<section class="contact-section" id="contato" aria-labelledby="contact-title"><div class="container contact-layout"><div class="contact-intro"><span class="eyebrow">O próximo passo é uma conversa</span><h2 id="contact-title">Vamos entender<br>seu problema<span class="accent">?</span></h2><p>Conte brevemente o que está acontecendo. A Vale Mind analisa o cenário e entra em contato para entender como podemos ajudar.</p><div class="contact-note">${icon('message')}<span>Não precisa falar de tecnologia.<br>Fale sobre o seu dia a dia.</span></div><a class="text-link" href="mailto:${site.email}">Prefere conversar por e-mail? ${icon('arrow')}</a></div><div class="form-card"><form id="contact-form" data-endpoint="${escape(site.contactEndpoint)}" data-email="${site.email}" novalidate><div class="form-progress" aria-label="Progresso do formulário"><span id="step-count" aria-live="polite">Etapa 1 de 3</span><span class="step-name">Sua necessidade</span></div><div class="progress-track" aria-hidden="true"><span></span></div><fieldset data-step="0"><legend tabindex="-1">O que você gostaria de melhorar?</legend><p class="field-hint">Escolha a opção que mais combina com seu momento.</p><div class="need-options">${needs.map(([value, label]) => `<label class="need-option"><input type="radio" name="need" value="${value}" required><span>${label}</span><span class="option-check" aria-hidden="true">${icon('check')}</span></label>`).join('')}</div></fieldset><fieldset data-step="1" hidden><legend tabindex="-1">Conte um pouco sobre o problema</legend><label for="problem" class="field-label">O que está acontecendo no seu negócio?</label><textarea id="problem" name="problem" rows="6" minlength="15" maxlength="3000" required aria-describedby="problem-hint" placeholder="Ex.: Hoje controlamos nossos pedidos manualmente em planilhas e estamos tendo dificuldade para acompanhar..."></textarea><p class="field-hint" id="problem-hint">Do seu jeito, sem termos técnicos. Entre 15 e 3.000 caracteres.</p></fieldset><fieldset data-step="2" hidden><legend tabindex="-1">Como podemos falar com você?</legend><p class="field-hint">Só o necessário para continuar essa conversa.</p><div class="field-grid"><div><label for="name">Nome</label><input id="name" name="name" autocomplete="name" required minlength="2" maxlength="120"></div><div><label for="company">Empresa <span>(opcional)</span></label><input id="company" name="company" autocomplete="organization" maxlength="160"></div><div><label for="phone">WhatsApp ou telefone</label><input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required maxlength="25" placeholder="(11) 99999-9999"></div><div><label for="email">E-mail</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="voce@empresa.com"></div></div><p class="privacy-note">Usaremos os dados informados para conversar sobre sua solicitação. Não inclua senhas ou informações sensíveis.</p><p class="delivery-note">${site.contactEndpoint ? 'Sua mensagem será enviada à Vale Mind.' : 'Ao continuar, você poderá enviar sua mensagem pelo seu aplicativo de e-mail.'}</p></fieldset><p id="form-error" class="form-error" role="alert"></p><div class="form-actions"><button type="button" class="back-button" hidden>← Voltar</button><button type="submit" class="button next-button">Continuar ${icon('arrow')}</button></div></form><div id="form-result" class="form-result" tabindex="-1" hidden><span class="result-icon">${icon('check')}</span><h3 id="result-title"></h3><p id="result-description"></p><div id="email-handoff" hidden><a id="email-link" class="button">Abrir meu e-mail ${icon('arrow')}</a><details><summary>Não abriu? Copie sua mensagem</summary><textarea id="message-copy" rows="7" readonly aria-label="Mensagem pronta para copiar"></textarea><button type="button" id="copy-message" class="text-link">Copiar mensagem</button><p>Envie para <a href="mailto:${site.email}">${site.email}</a>.</p></details></div><button class="text-link" type="button" id="edit-message">Editar minhas respostas</button><p id="copy-status" role="status"></p></div><noscript><p>Para usar as etapas, ative o JavaScript. Você também pode contar seu problema diretamente para <a href="mailto:${site.email}">${site.email}</a>.</p></noscript></div></div></section>`;
}

export const closing = () =>
  `<section class="closing"><div class="container"><span class="eyebrow">Menos complicação. Mais possibilidades.</span><p>Uma boa solução começa<br>com uma boa conversa<span class="accent">.</span></p></div></section>`;
