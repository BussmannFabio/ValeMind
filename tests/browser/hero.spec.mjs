import { test, expect } from '@playwright/test';

test('hero changes shape and copy with keyboard and touch-sized controls', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('[data-hero-scene]');
  await expect(scene).toHaveClass(/scene-ready/);
  const before = await scene.locator('canvas').evaluate((canvas) => canvas.toDataURL());
  await page.getByRole('button', { name: 'Dados', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(scene.locator('.scene-title')).toHaveText('Encontre clareza no meio dos dados.');
  await expect(scene.locator('[data-scene-mode="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(scene.locator('[data-scene-mode="0"]')).toHaveAttribute('aria-pressed', 'false');
  expect(await scene.locator('canvas').evaluate((canvas) => canvas.toDataURL())).not.toBe(before);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Integrações', exact: true }).click();
  await expect(scene.locator('.scene-title')).toHaveText('Tudo conectado. Tudo mais simples.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const control of await scene.locator('[data-scene-mode]').all()) {
    expect((await control.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({ path: 'artifacts/hero-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => scrollTo(0, 0));
  for (const [index, name] of ['Automação', 'Dados', 'Integrações'].entries()) {
    await page.getByRole('button', { name, exact: true }).click();
    await page.screenshot({ path: `artifacts/hero-mode-${index}.png` });
  }
});

test('motion can be paused, responds to pointer and stops outside viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const scene = page.locator('[data-hero-scene]');
  await expect(scene).toHaveAttribute('data-motion', 'playing');
  const stage = await scene.locator('.scene-stage').boundingBox();
  await page.mouse.move(stage.x + stage.width * 0.9, stage.y + stage.height * 0.2);
  await page.getByRole('button', { name: 'Pausar animação' }).click();
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  const frozen = await scene.locator('canvas').evaluate(async (canvas) => {
    const before = canvas.toDataURL();
    await new Promise((resolve) => setTimeout(resolve, 160));
    return before === canvas.toDataURL();
  });
  expect(frozen).toBe(true);
  await page.getByRole('button', { name: 'Retomar animação' }).click();
  await expect(scene).toHaveAttribute('data-motion', 'playing');
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await page.locator('.hero-copy').scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-motion', 'playing');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await expect(scene.locator('.scene-pause')).toBeHidden();
});

test('hero provides a static illustration when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await expect(page.locator('.scene-controls')).toBeHidden();
  await expect(page.locator('.scene-caption')).toBeVisible();
  await context.close();
});

test('hero keeps the illustration when canvas is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto('/');
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await expect(page.locator('.scene-controls')).toBeHidden();
  await expect(page.locator('.scene-pause')).toBeHidden();
});
