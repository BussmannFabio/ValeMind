import { shapePoint, projectPoint, sceneModes } from '../assets/hero-scene.js';

export function heroVisual(version) {
  const paths = Array.from({ length: 22 }, (_, row) => {
    const points = Array.from({ length: 86 }, (_, column) => {
      const [x, y] = projectPoint(shapePoint(0, (column / 86) * Math.PI * 2, row / 22));
      return `${(260 + x * 148).toFixed(1)},${(190 + y * 148).toFixed(1)}`;
    });
    return `<polyline points="${points.join(' ')} ${points[0]}"/>`;
  }).join('');
  return `<div class="hero-scene" data-hero-scene data-mode="0" aria-label="Explore nossas soluções"><div class="scene-header"><span class="scene-kicker"><i aria-hidden="true"></i> Inteligência em movimento</span><button class="scene-pause" type="button" aria-label="Pausar animação" aria-pressed="false" hidden><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path class="pause-symbol" d="M7 5v10M13 5v10"/><path class="play-symbol" d="m7 5 8 5-8 5Z"/></svg><span>Pausar</span></button></div><div class="scene-stage"><svg class="scene-fallback" viewBox="0 0 520 380" role="img" aria-label="Escultura digital em forma de fluxo contínuo"><g fill="none" stroke="#7ce3ec" stroke-width="0.85" opacity="0.72">${paths}</g></svg><canvas aria-hidden="true"></canvas><span class="scene-coordinate" aria-hidden="true">VM / 01</span><span class="scene-hint" hidden>Explore as possibilidades abaixo <span aria-hidden="true">↓</span></span></div><div class="scene-bottom"><div class="scene-controls" role="group" aria-label="Escolha uma solução para explorar" hidden>${sceneModes.map((mode, index) => `<button type="button" data-scene-mode="${index}" aria-pressed="${index === 0}" aria-controls="scene-caption" disabled>${mode.label}</button>`).join('')}</div><div id="scene-caption" class="scene-caption" aria-live="polite" aria-atomic="true"><h2 class="scene-title">${sceneModes[0].title}</h2><p class="scene-description">${sceneModes[0].description}</p></div></div></div><script type="module" src="/assets/hero-scene.js?v=${version}"></script>`;
}
