# ValeMind

Site estático da ValeMind, publicado pelo GitHub Pages a partir da raiz da `main` em `valemind.tech`. HTML renderizado no build; nenhum framework ou dependência em tempo de execução.

## Desenvolvimento

Requer Node.js 20 ou superior.

```sh
npm ci
npm run build
npm run dev
```

Preview: http://127.0.0.1:4173. O servidor local é apenas para desenvolvimento.

- `src/content.mjs`: conteúdo e configuração de contato.
- `src/components.mjs`: navegação, rodapé, formulário e ícones compartilhados.
- `scripts/build.mjs`: páginas e metadados; gera os HTMLs versionados, sitemap e robots.
- `style.css`: estilos compartilhados, breakpoints e movimento reduzido.
- `script.js`: navegação mobile, formulário e compatibilidade com âncoras antigas.
- `assets/hero-scene.js`: escultura de partículas interativa, sem bibliotecas externas; modos Automação, Dados e Integrações.
- `src/hero.mjs`: visual do hero e SVG estático gerado a partir da mesma geometria da animação.
- `/solucoes/`, `/sobre/`, `/projetos/`, `/contato/`: páginas reais, compatíveis com acesso direto no Pages.

Depois de editar os arquivos fonte, execute `npm run build` e versione também os HTMLs gerados. O GitHub Pages continua configurado como `main / (root)`; não precisa executar Node no servidor. Preserve `CNAME` e `.nojekyll`. Não é necessário configurar uma SPA ou rewrite.

O build calcula um hash do CSS e dos scripts para versionar automaticamente suas URLs e evitar mistura de versões no cache. A animação do hero é carregada somente na Home, limitada a aproximadamente 30 quadros por segundo e densidade de pixels 2. Ela pausa fora da tela, em abas inativas e pelo controle do visitante. Com movimento reduzido, as trocas de forma são estáticas; sem JavaScript ou Canvas, permanece uma ilustração SVG. Os três modos funcionam com teclado e toque.

Referências de direção visual: [Vercel Ship — formas fluidas e interação](https://vercel.com/blog/designing-and-building-the-vercel-ship-conference-platform), [Linear — interfaces mais calmas](https://linear.app/now/behind-the-latest-design-refresh) e [Stripe — geometria interativa](https://stripe.com/blog/globe). A implementação é original, com as cores da ValeMind e foco em uma interação leve.

## Formulário e integração

O formulário anterior apenas simulava sucesso. Agora, sem backend configurado, as três etapas preparam uma mensagem para `contatovalemind@gmail.com`, endereço provisório enquanto o e-mail institucional não está configurado. O visitante precisa confirmar o envio em seu aplicativo de e-mail. Há uma alternativa para copiar o texto. A interface não afirma recebimento nesse modo.

Para envio direto, configure `site.contactEndpoint` em `src/content.mjs` com a URL HTTPS da API e gere novamente as páginas. A API deve aceitar `POST application/json`:

```json
{
  "need": "automation",
  "needLabel": "Automatizar um processo",
  "problem": "Descrição do problema",
  "name": "Nome",
  "company": "Empresa (opcional)",
  "phone": "(11) 99999-9999",
  "email": "pessoa@empresa.com",
  "source": "/contato/"
}
```

Retorne HTTP 2xx e `{"success":true}` somente depois de aceitar/persistir a mensagem. Esse retorno habilita a tela “Recebemos sua mensagem!”. Erros, resposta inválida ou timeout de 15 segundos mantêm os dados e permitem tentar novamente ou preparar um e-mail.

O backend deve validar os campos, limitar abuso e encaminhar para e-mail/CRM/automação com credenciais somente no servidor. Se estiver em outro domínio, permita a origem `https://valemind.tech` e requisições POST/OPTIONS com Content-Type. Não coloque chaves no frontend. O GitHub Pages não executa um backend.

Nenhum dado do formulário é salvo em localStorage, cookies ou logs do site. O destino de e-mail precisa ser confirmado pelo responsável antes da publicação: o repositório não comprova que a caixa existe. O número antigo `+55 (11) 99999-8888` parecia um placeholder e os links sociais eram `#`; não foram apresentados como canais reais. Adicione canais verificados quando disponíveis.

## Validação

```sh
npm test
npx playwright test
```

Os testes de navegador usam Google Chrome instalado (`channel: chrome`). Se necessário, instale o Chromium com `npx playwright install chromium` e remova o `channel` da configuração. Eles interceptam a API com respostas simuladas; não enviam contatos reais. Cobrem formulário, falha/reenvio, rotas, menu, âncoras antigas, ausência de overflow de 320 a 1440 px e conteúdo sem JavaScript.

As capturas de desktop/mobile ficam em `artifacts/` (ignorado pelo Git).

## Conteúdo e decisões

Logo original preservada sem alterações. Serviços e tecnologias foram movidos para Soluções; diferenciais para Sobre; ValeBot AI, GestorWeb e AutoSync para Projetos. Os desenhos dos projetos são identificados como ilustrações, não capturas de produtos. Não foram adicionados clientes, depoimentos ou métricas novas. O simulador de prazo foi substituído pelo briefing, pois suas estimativas não eram validadas por uma integração real.

As antigas âncoras `#tecnologias`, `#diferenciais`, `#portfolio` e `#estimador` redirecionam ao conteúdo correspondente; `#hero` e `#solucoes` permanecem na Home. Metadados, canonical e sitemap usam o domínio de produção existente.
