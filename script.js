/* Shared progressive enhancement. No credentials or personal data persisted. */
document.documentElement.classList.add('js');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menuToggle && navigation) {
  menuToggle.hidden = false;
  const closeMenu = () => {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      closeMenu();
      menuToggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  matchMedia('(min-width:1000px)').addEventListener('change', closeMenu);
}

// Preserve links to sections of the previous landing page.
if (location.pathname === '/' || location.pathname === '/index.html') {
  const legacy = {
    '#diferenciais': '/sobre/#diferenciais',
    '#tecnologias': '/solucoes/#tecnologias',
    '#portfolio': '/projetos/#portfolio',
    '#estimador': '/#contato',
  };
  const redirectLegacy = () => {
    if (legacy[location.hash]) location.replace(legacy[location.hash]);
  };
  redirectLegacy();
  window.addEventListener('hashchange', redirectLegacy);
}

const form = document.querySelector('#contact-form');
if (form) {
  const steps = [...form.querySelectorAll('[data-step]')];
  const error = document.querySelector('#form-error');
  const back = form.querySelector('.back-button');
  const next = form.querySelector('.next-button');
  const result = document.querySelector('#form-result');
  const names = ['Sua necessidade', 'Seu desafio', 'Seu contato'];
  let step = 0;
  let pending = false;

  function showStep(index, focus = true) {
    step = index;
    steps.forEach((element, i) => {
      element.hidden = i !== index;
      element.classList.toggle('step-enter', i === index);
    });
    document.querySelector('#step-count').textContent = `Etapa ${index + 1} de 3`;
    document.querySelector('.step-name').textContent = names[index];
    document.querySelector('.progress-track span').style.width = `${((index + 1) / 3) * 100}%`;
    back.hidden = index === 0;
    next.textContent = index === 2 ? 'Enviar meu problema →' : 'Continuar →';
    error.textContent = '';
    if (focus) {
      const heading = steps[index].querySelector('legend');
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }

  function fail(message, field) {
    error.textContent = message;
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.focus();
    }
    return false;
  }

  function validate(index) {
    if (index === 0 && !form.querySelector('[name=need]:checked'))
      return fail(
        'Escolha uma opção para continuar. Se estiver em dúvida, selecione “Ainda não sei exatamente”.',
        form.querySelector('[name=need]'),
      );
    if (index === 1 && form.elements.problem.value.trim().length < 15)
      return fail(
        'Conte um pouco mais sobre o problema (pelo menos 15 caracteres).',
        form.elements.problem,
      );
    if (index === 2) {
      if (form.elements.name.value.trim().length < 2)
        return fail('Informe seu nome para sabermos com quem falar.', form.elements.name);
      const digits = form.elements.phone.value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15)
        return fail(
          'Informe um telefone válido com DDD, como (11) 99999-9999.',
          form.elements.phone,
        );
    }
    for (const field of steps[index].querySelectorAll('input, textarea')) {
      if (!field.checkValidity())
        return fail(
          field.type === 'email'
            ? 'Confira seu e-mail, por exemplo: voce@empresa.com.'
            : 'Confira este campo para continuar.',
          field,
        );
    }
    return true;
  }

  form.addEventListener('input', (event) => {
    event.target.removeAttribute('aria-invalid');
    if (event.target.name === 'need') {
      form
        .querySelectorAll('[name=need]')
        .forEach((input) => input.removeAttribute('aria-invalid'));
    }
    error.textContent = '';
  });
  back.addEventListener('click', () => {
    if (!pending) showStep(Math.max(0, step - 1));
  });
  document.querySelectorAll('[data-need]').forEach((link) =>
    link.addEventListener('click', () => {
      if (pending) return;
      form.hidden = false;
      result.hidden = true;
      const input = form.querySelector(`[name=need][value="${link.dataset.need}"]`);
      if (input) {
        input.checked = true;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      showStep(0, false);
    }),
  );

  function getPayload() {
    const values = Object.fromEntries(new FormData(form));
    return {
      ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])),
      needLabel: form.querySelector('[name=need]:checked').nextElementSibling.textContent,
      source: location.pathname,
    };
  }

  function showResult(title, description, emailMode) {
    document.querySelector('#result-title').textContent = title;
    document.querySelector('#result-description').textContent = description;
    document.querySelector('#email-handoff').hidden = !emailMode;
    document.querySelector('#edit-message').textContent = emailMode
      ? 'Editar minhas respostas'
      : 'Enviar outra mensagem';
    document.querySelector('#edit-message').dataset.sent = emailMode ? 'false' : 'true';
    form.hidden = true;
    result.hidden = false;
    result.focus();
  }

  function prepareEmail(payload) {
    const body = `Olá, Vale Mind!\n\nGostaria de: ${payload.needLabel}\n\n${payload.problem}\n\nNome: ${payload.name}\nEmpresa: ${payload.company || 'Não informada'}\nTelefone: ${payload.phone}\nE-mail: ${payload.email}`;
    document.querySelector('#email-link').href =
      `mailto:${form.dataset.email}?subject=${encodeURIComponent('Vamos conversar sobre meu problema')}&body=${encodeURIComponent(body)}`;
    document.querySelector('#message-copy').value = body;
    showResult(
      'Sua mensagem está pronta.',
      'Abra seu aplicativo de e-mail e confirme o envio para a Vale Mind. Sua mensagem ainda não foi enviada.',
      true,
    );
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || !validate(step)) return;
    if (step < 2) {
      showStep(step + 1);
      return;
    }
    for (let i = 0; i < steps.length; i++) {
      showStep(i, false);
      if (!validate(i)) return;
    }
    const payload = getPayload();
    if (!form.dataset.endpoint) {
      prepareEmail(payload);
      return;
    }
    pending = true;
    next.disabled = true;
    back.disabled = true;
    next.textContent = 'Enviando…';
    form.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const endpoint = new URL(form.dataset.endpoint, location.origin);
      if (endpoint.protocol !== 'https:' && endpoint.origin !== location.origin)
        throw new Error('Insecure endpoint');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        credentials: 'omit',
      });
      if (!response.ok) throw new Error('Delivery failed');
      const confirmation = await response.json();
      if (confirmation.success !== true) throw new Error('Delivery not confirmed');
      showResult(
        'Recebemos sua mensagem!',
        'Agora é com a gente. Vamos analisar o que você contou e entraremos em contato.',
        false,
      );
      form.reset();
    } catch {
      error.textContent =
        'Não foi possível confirmar o envio. Suas respostas foram mantidas. Tente novamente ou envie sua mensagem por e-mail.';
      const fallback = document.createElement('button');
      fallback.type = 'button';
      fallback.className = 'text-link';
      fallback.textContent = 'Preparar e-mail';
      fallback.addEventListener('click', () => prepareEmail(getPayload()));
      error.append(document.createElement('br'), fallback);
    } finally {
      clearTimeout(timeout);
      pending = false;
      next.disabled = false;
      back.disabled = false;
      next.textContent = 'Enviar meu problema →';
      form.removeAttribute('aria-busy');
    }
  });

  document.querySelector('#edit-message').addEventListener('click', (event) => {
    result.hidden = true;
    form.hidden = false;
    document.querySelector('#copy-status').textContent = '';
    showStep(event.currentTarget.dataset.sent === 'true' ? 0 : 2);
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    const text = document.querySelector('#message-copy');
    try {
      await navigator.clipboard.writeText(text.value);
      document.querySelector('#copy-status').textContent =
        'Mensagem copiada. Cole no seu e-mail para enviar.';
    } catch {
      text.focus();
      text.select();
      document.querySelector('#copy-status').textContent =
        'Selecione e copie o texto acima para enviar pelo seu e-mail.';
    }
  });
  showStep(0, false);
}
