/* A small, dependency-free 3D particle scene rendered on a 2D canvas.
 * Geometry is shared with the build-time SVG fallback; nothing is downloaded.
 */
export const sceneModes = [
  {
    label: 'Automação',
    title: 'Menos repetição. Mais possibilidades.',
    description: 'Processos que fluem para sua equipe ir além.',
  },
  {
    label: 'Dados',
    title: 'Encontre clareza no meio dos dados.',
    description: 'Informações conectadas para decidir com confiança.',
  },
  {
    label: 'Integrações',
    title: 'Tudo conectado. Tudo mais simples.',
    description: 'Suas ferramentas trabalhando na mesma direção.',
  },
];

const TAU = Math.PI * 2;
export function shapePoint(mode, u, v) {
  if (mode === 1) {
    const latitude = (v - 0.5) * Math.PI;
    const radius = 1.17 + 0.035 * Math.sin(u * 6 + v * 9);
    return [
      radius * Math.cos(latitude) * Math.cos(u),
      radius * Math.sin(latitude),
      radius * Math.cos(latitude) * Math.sin(u),
    ];
  }
  if (mode === 2) {
    const strand = Math.floor(v * 3);
    const radius = 0.62 + (v * 3 - strand) * 0.27;
    const angle = u * 1.25 + (strand * TAU) / 3;
    return [
      Math.cos(angle) * radius * 0.84,
      (u / TAU - 0.5) * 2.0,
      Math.sin(angle) * radius * 0.84,
    ];
  }
  // A softly twisted, closed ribbon rather than a logo or an orbital diagram.
  const across = (v - 0.5) * 0.82;
  const radius = 0.96 + across * Math.cos(u * 1.5);
  return [
    radius * Math.cos(u),
    radius * Math.sin(u),
    across * Math.sin(u * 1.5) + 0.18 * Math.cos(u * 3),
  ];
}

export function projectPoint(point, yaw = 0.28, pitch = 0.55) {
  const [x, y, z] = point;
  const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
  const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const ry = y * Math.cos(pitch) - rz * Math.sin(pitch);
  const depth = y * Math.sin(pitch) + rz * Math.cos(pitch);
  const perspective = 3.8 / (3.8 - depth);
  return [rx * perspective, ry * perspective, depth];
}

function mountScene(root) {
  const canvas = root.querySelector('canvas');
  let context;
  try {
    context = canvas.getContext('2d', { alpha: true });
  } catch {
    return;
  }
  if (!context) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const pause = root.querySelector('.scene-pause');
  const controls = [...root.querySelectorAll('[data-scene-mode]')];
  const stage = root.querySelector('.scene-stage');
  const title = root.querySelector('.scene-title');
  const description = root.querySelector('.scene-description');
  let targetMode = 0,
    blend = 1;
  let paused = reduced.matches,
    visible = true,
    frame = 0,
    lastTime = 0,
    time = 0;
  let width = 1,
    height = 1;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const rows = 24,
    columns = 86;
  const shapes = sceneModes.map((_, shape) =>
    Array.from({ length: rows * columns }, (_, index) =>
      shapePoint(shape, ((index % columns) / columns) * TAU, Math.floor(index / columns) / rows),
    ),
  );
  let from = shapes[0];
  const colors = ['91,222,237', '143,183,255', '70,207,209'];

  function isMoving() {
    return !paused && !reduced.matches && visible && !document.hidden;
  }
  function pauseState() {
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Retomar animação' : 'Pausar animação');
    pause.querySelector('span').textContent = paused ? 'Reproduzir' : 'Pausar';
    root.dataset.motion = isMoving() ? 'playing' : 'paused';
    pause.hidden = reduced.matches;
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width * 0.29, height * 0.31);
    const eased = blend * blend * (3 - 2 * blend);
    const yaw = 0.28 + time * 0.11 + pointer.x * 0.34;
    const pitch = 0.55 + Math.sin(time * 0.22) * 0.1 + pointer.y * 0.23;
    const points = from.map((start, index) => {
      const destination = shapes[targetMode][index];
      const point = start.map((value, axis) => value + (destination[axis] - value) * eased);
      const projected = projectPoint(point, yaw, pitch);
      return [width / 2 + projected[0] * scale, height / 2 + projected[1] * scale, projected[2]];
    });
    // Fine strands lend the surface depth; particles provide directional highlights.
    for (let row = 0; row < rows; row += 2) {
      context.beginPath();
      for (let column = 0; column < columns; column++) {
        const [x, y] = points[row * columns + column];
        if (!column) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      if (targetMode !== 2) context.closePath();
      context.strokeStyle = `rgba(${colors[targetMode]},0.15)`;
      context.lineWidth = 0.65;
      context.stroke();
    }
    for (let index = 0; index < points.length; index++) {
      const [x, y, z] = points[index];
      const light = Math.max(0, Math.min(1, (z + 1.3) / 2.6));
      const pulse = 0.5 + 0.5 * Math.sin(((index % columns) / columns) * TAU - time * 0.7);
      context.fillStyle = `rgba(${light > 0.78 ? '208,250,255' : colors[targetMode]},${0.17 + light * 0.66 + pulse * 0.12})`;
      context.beginPath();
      context.arc(x, y, 0.6 + light * 0.65, 0, TAU);
      context.fill();
    }
  }

  function tick(now) {
    frame = 0;
    if (!isMoving()) {
      lastTime = 0;
      return;
    }
    const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.07) : 0;
    if (lastTime && delta < 1 / 32) {
      frame = requestAnimationFrame(tick);
      return;
    }
    lastTime = now;
    time += delta;
    blend = Math.min(1, blend + delta / 0.85);
    pointer.x += (pointer.targetX - pointer.x) * 0.09;
    pointer.y += (pointer.targetY - pointer.y) * 0.09;
    draw();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    pauseState();
    if (isMoving()) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const density = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    context.setTransform(density, 0, 0, density, 0, 0);
    draw();
  }

  controls.forEach((button, index) => {
    button.disabled = false;
    button.addEventListener('click', () => {
      if (index === targetMode) return;
      const eased = blend * blend * (3 - 2 * blend);
      from = from.map((start, i) =>
        start.map((value, axis) => value + (shapes[targetMode][i][axis] - value) * eased),
      );
      targetMode = index;
      blend = isMoving() ? 0 : 1;
      controls.forEach((control, i) => control.setAttribute('aria-pressed', String(i === index)));
      root.dataset.mode = String(index);
      title.textContent = sceneModes[index].title;
      description.textContent = sceneModes[index].description;
      draw();
    });
  });
  pause.addEventListener('click', () => {
    paused = !paused;
    sync();
  });
  reduced.addEventListener('change', () => {
    paused = reduced.matches;
    blend = 1;
    pointer.x = pointer.y = pointer.targetX = pointer.targetY = 0;
    sync();
    draw();
  });
  stage.addEventListener('pointermove', (event) => {
    if (!isMoving() || !finePointer.matches || event.pointerType === 'touch') return;
    const rect = stage.getBoundingClientRect();
    pointer.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  });
  stage.addEventListener('pointerleave', () => {
    pointer.targetX = pointer.targetY = 0;
  });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      sync();
    },
    { threshold: 0.05 },
  ).observe(root);
  new ResizeObserver(resize).observe(stage);
  resize();
  root.classList.add('scene-ready');
  root.querySelector('.scene-controls').hidden = false;
  root.querySelector('.scene-hint').hidden = false;
  sync();
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-hero-scene]').forEach(mountScene);
}
