import { test, expect } from '@playwright/test';

async function fillContact(page) {
  await page.locator('[name=need][value=automation]').check();
  await page.locator('.next-button').click();
  await page
    .locator('#problem')
    .fill('Controlamos pedidos em planilhas e precisamos automatizar o acompanhamento.');
  await page.locator('.next-button').click();
  await page.locator('#name').fill('Pessoa de Teste');
  await page.locator('#phone').fill('(11) 98765-4321');
  await page.locator('#email').fill('teste@example.com');
}

test('form validates each step, preserves edits and prepares an honest email handoff', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.next-button').click();
  await expect(page.locator('#form-error')).toContainText('Escolha uma opção');
  await page.locator('[data-need=data]').click();
  await expect(page.locator('[name=need][value=data]')).toBeChecked();
  await page.locator('.next-button').click();
  await page.locator('.next-button').click();
  await expect(page.locator('#form-error')).toContainText('15 caracteres');
  await page.locator('#problem').fill('Precisamos organizar os dados de pedidos da empresa.');
  await page.locator('.back-button').click();
  await expect(page.locator('[name=need][value=data]')).toBeChecked();
  await page.locator('.next-button').click();
  await expect(page.locator('#problem')).toHaveValue(
    'Precisamos organizar os dados de pedidos da empresa.',
  );
  await page.locator('.next-button').click();
  await page.locator('#name').fill('Pessoa Teste');
  await page.locator('#phone').fill('123');
  await page.locator('.next-button').click();
  await expect(page.locator('#form-error')).toContainText('telefone válido');
  await page.locator('#phone').fill('(11) 98765-4321');
  await page.locator('#email').fill('invalido');
  await page.locator('.next-button').click();
  await expect(page.locator('#form-error')).toContainText('e-mail');
  await page.locator('#email').fill('teste@example.com');
  await page.locator('.next-button').click();
  await expect(page.locator('#result-title')).toHaveText('Sua mensagem está pronta.');
  await expect(page.locator('#result-description')).toContainText('ainda não foi enviada');
  const href = await page.locator('#email-link').getAttribute('href');
  expect(href).toContain('mailto:contato@valemind.com.br?');
  expect(decodeURIComponent(href)).toContain('Organizar ou visualizar dados');
  expect(decodeURIComponent(href)).toContain('teste@example.com');
  await page.locator('#edit-message').click();
  await expect(page.locator('#name')).toHaveValue('Pessoa Teste');
});

test('configured API: failure retains data, retry requires server confirmation', async ({
  page,
}) => {
  await page.goto('/contato/');
  await page.locator('#contact-form').evaluate((form) => {
    form.dataset.endpoint = '/test-contact';
  });
  let calls = 0;
  await page.route('**/test-contact', async (route) => {
    calls++;
    expect(route.request().postDataJSON().email).toBe('teste@example.com');
    await route.fulfill({
      status: calls === 1 ? 503 : 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: calls > 1 }),
    });
  });
  await fillContact(page);
  await page.locator('.next-button').click();
  await expect(page.locator('#form-error')).toContainText('Não foi possível confirmar');
  await expect(page.locator('#name')).toHaveValue('Pessoa de Teste');
  await page.locator('.next-button').click();
  await expect(page.locator('#result-title')).toHaveText('Recebemos sua mensagem!');
  expect(calls).toBe(2);
  await page.locator('#edit-message').click();
  await expect(page.locator('#step-count')).toHaveText('Etapa 1 de 3');
  await expect(page.locator('#name')).toHaveValue('');
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`all routes have no overflow or JS errors at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const path of ['/', '/solucoes/', '/sobre/', '/projetos/', '/contato/']) {
      expect((await page.goto(path)).status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(page.locator('#navigation [aria-current=page]')).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });
}

test('mobile keyboard menu, reduced motion and screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('.menu-toggle').click();
  await expect(page.locator('#navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#navigation')).toBeHidden();
  await expect(page.locator('.menu-toggle')).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
  await page.screenshot({ path: 'artifacts/home-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: true });
});

test('static content and email remain accessible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('#navigation')).toBeVisible();
  await expect(page.locator('noscript a')).toBeVisible();
  await expect(page.locator('noscript a')).toHaveAttribute(
    'href',
    'mailto:contato@valemind.com.br',
  );
  await expect(page.locator('#contact-form')).toBeHidden();
  await context.close();
});

test('legacy anchors lead to the relocated content', async ({ page }) => {
  for (const [anchor, target] of [
    ['tecnologias', '/solucoes/#tecnologias'],
    ['portfolio', '/projetos/#portfolio'],
    ['diferenciais', '/sobre/#diferenciais'],
    ['estimador', '/#contato'],
  ]) {
    await page.goto(`/#${anchor}`);
    await expect(page).toHaveURL(`http://127.0.0.1:4173${target}`);
  }
});
