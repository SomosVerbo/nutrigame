// =====================================================================
// NutriGame · Motor 2.5D (canvas, pixel-art)
// Top-down de clínica. Reaproveita TODO o conteúdo clínico (app.js/data.js)
// e o HUD existente (joystick, botão, minimapa, janelas).
//
// Pontes (globais do app.js): window.getGameState, window.nutriGameData,
//   window.soundSynth, window.interactWithPatient(n), window.interactWithNPC(t)
// Expõe: window.NutriWorld = { refresh, resize, isReady }
// =====================================================================
(() => {
  'use strict';

  const TILE = 32;
  const WALL_FACE = 18;   // altura da face da parede de fundo (visual 2.5D)
  const WALL_IN_FACE = 8; // altura das divisórias internas
  const A = 'assets2d/clinic/';
  const FILES = {
    floor: 'floor.png', floor_rose: 'floor_rose.png', floor_blue: 'floor_blue.png',
    wall: 'wall.png', wall_base: 'wall_base.png', wall_window: 'wall_window.png',
    wall_v: 'wall_v.png', wall_h: 'wall_h.png',
    plant: 'plant.png', desk: 'desk.png', bed: 'bed.png',
    chair: 'chair.png', cabinet: 'cabinet.png', cooler: 'cooler.png', rug: 'rug.png', screen: 'screen.png',
    poster: 'poster.png', clock: 'clock.png',
    ivstand: 'ivstand.png', cart: 'cart.png', sidetable: 'sidetable.png', curtain: 'curtain.png',
    locker: 'locker.png', bench: 'bench.png', trash: 'trash.png',
    vending: 'vending.png', wheelchair: 'wheelchair.png', examtable: 'examtable.png', skeleton: 'skeleton.png', sign: 'sign.png', wallmonitor: 'wallmonitor.png',
    elevator: 'elevator.png', stairs: 'stairs.png', extinguisher: 'extinguisher.png',
    ana: 'ana.png', roberto: 'npc_roberto.png', clara: 'npc_clara.png',
    lucas: 'npc_lucas.png', camila: 'camila.png', thiago: 'thiago.png'
  };
  const IMG = {};

  // ---- Mapa (22x14). '#'=parede  '.'=corredor  'r'=rosa  'b'=azul ----
  const MAP_W = 22, MAP_H = 14;
  function tintAt(x) { return x <= 7 ? 'r' : (x >= 14 ? 'b' : '.'); }
  function isBorder(x, y) { return x === 0 || y === 0 || x === MAP_W - 1 || y === MAP_H - 1; }
  const WINDOWS = new Set(['4,0', '9,0', '13,0', '17,0']);  // janelas na parede de cima
  const WALL_DECOR = new Map([['0,4', 'poster'], ['0,9', 'poster'], ['21,4', 'poster'], ['21,9', 'poster'],
    ['10,0', 'clock'], ['6,0', 'wallmonitor'], ['15,0', 'wallmonitor'],
    ['11,0', 'elevator'], ['19,0', 'stairs'], ['3,0', 'extinguisher'],
    // decoração extra de parede (não interfere na navegação)
    ['0,2', 'poster'], ['0,11', 'poster'], ['21,2', 'poster'], ['21,11', 'poster'],
    ['7,0', 'poster'], ['16,0', 'poster'], ['20,0', 'extinguisher']]);

  // ---- Divisórias internas (FINAS): 4 salas de leito + estação central.
  // Verticais x=7 e x=14 separam as alas do corredor; cada uma tem 2 portas
  // (sala de cima em y=3, sala de baixo em y=9). Horizontais em y=6 separam
  // a sala de cima da de baixo dentro de cada ala. INNER_WALLS: 'x,y' -> 'v'|'h'.
  const INNER_WALLS = new Map();
  const DOORS = new Set(['7,3', '7,9', '14,3', '14,9']);
  (function buildInnerWalls() {
    for (const wx of [7, 14]) {
      for (let y = 1; y <= 12; y++) {
        if (DOORS.has(wx + ',' + y)) continue;     // vãos (portas)
        INNER_WALLS.set(wx + ',' + y, 'v');
      }
    }
    for (const [x0, x1] of [[1, 6], [15, 20]]) {
      for (let x = x0; x <= x1; x++) INNER_WALLS.set(x + ',6', 'h');
    }
  })();

  // Objetos do cenário (posições em tiles)
  // Leitos: top = cabeceira no topo (interage por baixo); bottom = interage por cima
  const BEDS = [
    { id: 1, x: 2, y: 1, top: true }, { id: 2, x: 5, y: 1, top: true },
    { id: 5, x: 16, y: 1, top: true }, { id: 6, x: 19, y: 1, top: true },
    { id: 3, x: 2, y: 11, top: false }, { id: 4, x: 5, y: 11, top: false },
    { id: 7, x: 16, y: 11, top: false }, { id: 8, x: 19, y: 11, top: false }
  ];
  // Ambiência por leito (visual): coberta colorida, equipamento, planta e acompanhante.
  // Apenas atmosfera de enfermaria — não altera o conteúdo clínico do caso.
  const BED_DECOR = {
    1: { blanket: '#7fb2e6', companion: true, equip: 'iv' },
    2: { blanket: '#e69ab8', equip: 'o2' },
    3: { blanket: '#8fd6a0', companion: true, equip: 'sne' },
    4: { blanket: '#e6cf86', plant: true, equip: 'dialysis' },
    5: { blanket: '#c79ae6', companion: true, equip: 'trach' },
    6: { blanket: '#e6b38a', equip: 'gtt' },
    7: { blanket: '#86c9c4', plant: true, equip: 'critical' },
    8: { blanket: '#a9b3dd', companion: true, equip: 'endoflife' }
  };

  const NPCS = [
    { type: 'R', img: 'roberto', name: 'Dr. Roberto', x: 10, y: 7 },
    { type: 'C', img: 'clara', name: 'Enf. Clara', x: 8, y: 7 },
    { type: 'L', img: 'lucas', name: 'Farm. Lucas', x: 13, y: 7 }
  ];
  const WANDER = [
    { img: 'camila', name: 'Nutri Camila', x: 9, y: 4 },
    { img: 'thiago', name: 'Nutri Thiago', x: 12, y: 10 }
  ];
  // Layout LIMPO e SIMÉTRICO. Acessórios de leito são gerados por código (alinhados);
  // o resto é mobiliário fixo em posições espelhadas entre as alas.
  const PROPS = [
    // ----- Corredor central / recepção (simétrico) -----
    { img: 'desk', x: 10, y: 2, h: 24 },
    { img: 'chair', x: 9, y: 2, h: 32, solid: false }, { img: 'chair', x: 11, y: 2, h: 32, solid: false },
    { img: 'rug', x: 10, y: 4, h: 32 },
    { img: 'vending', x: 8, y: 1, h: 44, solid: false }, { img: 'vending', x: 13, y: 1, h: 44, solid: false },
    { img: 'cooler', x: 8, y: 4, h: 32, solid: false }, { img: 'cooler', x: 13, y: 4, h: 32, solid: false },
    { img: 'cart', x: 9, y: 8, h: 40, solid: false }, { img: 'cart', x: 12, y: 8, h: 40, solid: false },
    { img: 'trash', x: 8, y: 9, h: 24, solid: false }, { img: 'trash', x: 13, y: 9, h: 24, solid: false },
    { img: 'bench', x: 8, y: 11, h: 24, solid: false }, { img: 'bench', x: 10, y: 11, h: 24, solid: false }, { img: 'bench', x: 12, y: 11, h: 24, solid: false },
    { img: 'plant', x: 8, y: 12, h: 32, solid: false }, { img: 'plant', x: 13, y: 12, h: 32, solid: false },
    // ----- Mobiliário das alas (mesma posição relativa em cada quarto = organizado) -----
    // armários encostados nas paredes laterais externas
    { img: 'cabinet', x: 1, y: 4, h: 32, solid: false }, { img: 'cabinet', x: 1, y: 8, h: 32, solid: false },
    { img: 'cabinet', x: 20, y: 4, h: 32, solid: false }, { img: 'cabinet', x: 20, y: 8, h: 32, solid: false },
    // armários altos junto à divisória interna
    { img: 'locker', x: 6, y: 4, h: 44, solid: false }, { img: 'locker', x: 6, y: 8, h: 44, solid: false },
    { img: 'locker', x: 15, y: 4, h: 44, solid: false }, { img: 'locker', x: 15, y: 8, h: 44, solid: false },
    // maca de exame no centro de cada ala
    { img: 'examtable', x: 3, y: 3, h: 40, solid: false }, { img: 'examtable', x: 3, y: 9, h: 40, solid: false },
    { img: 'examtable', x: 18, y: 3, h: 40, solid: false }, { img: 'examtable', x: 18, y: 9, h: 40, solid: false },
    // cadeira de rodas nas alas de baixo
    { img: 'wheelchair', x: 4, y: 9, h: 40, solid: false }, { img: 'wheelchair', x: 17, y: 9, h: 40, solid: false }
  ];
  // Acessórios alinhados de cada leito: criado-mudo à direita, suporte de soro à esquerda.
  BEDS.forEach((b) => {
    const ay = b.top ? 1 : 11;
    PROPS.push({ img: 'sidetable', x: b.x + 1, y: ay, h: 28, solid: false });
    PROPS.push({ img: 'ivstand', x: b.x - 1, y: ay, h: 48, solid: false });
  });

  // Pacientes sentados nos bancos de espera (alinhados aos bancos do corredor)
  const SEATED = [
    { x: 8, y: 11, hair: '#6b4a2a', coat: '#d6a6c2' },
    { x: 10, y: 11, hair: '#2a2a30', coat: '#a6c8d6' },
    { x: 12, y: 11, hair: '#7a5230', coat: '#cdbf9a' }
  ];

  // Paciente: cor por leito (variação)
  const PSKIN = ['#f4cda4', '#e8b58f', '#d79a6b', '#f0c8a0', '#c68642'];

  // ---- Estado ----
  let canvas, ctx, root, miniCv, miniCtx, dollCv, dollCtx;
  let player = { x: 10 * TILE + 16, y: 10 * TILE + 16, dir: 0, frame: 0, anim: 0, moving: false };
  let camX = 0, camY = 0, ZOOM = 3, doorOpen = 0;
  const innerDoorOpen = new Map();   // 'x,y' -> 0..1 (abertura animada das portas dos quartos)
  const dust = [];                   // partículas de poeira sob os pés (vida visual)
  let dustTimer = 0;
  // Cômodos (para o foco de câmera): 4 enfermarias + corredor central.
  const ROOMS = [
    { x0: 1, y0: 1, x1: 6, y1: 5 }, { x0: 1, y0: 7, x1: 6, y1: 12 },
    { x0: 15, y0: 1, x1: 20, y1: 5 }, { x0: 15, y0: 7, x1: 20, y1: 12 },
    { x0: 7, y0: 1, x1: 14, y1: 12 }
  ];
  let lastRoom = ROOMS[4];
  let focusRect = null;              // retângulo do foco (px, interpolado suavemente)
  const DOOR_X = 10, DOOR_Y = 13;
  let blocked = new Set();
  let interactables = [];   // {kind:'bed'|'npc', x,y(px center), tx,ty, id?, type?, name}
  let wanderers = [];       // NPCs que andam (Camila, Thiago)
  let current = null, started = false, raf = null;
  const input = { x: 0, y: 0 };
  const keys = new Set();
  const DIR = { down: 0, left: 1, right: 2, up: 3 };

  // ---- Carregamento ----
  function loadAll() {
    const names = Object.keys(FILES);
    return Promise.all(names.map((n) => new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => { IMG[n] = im; res(); };
      im.onerror = () => rej(new Error('falhou: ' + FILES[n]));
      im.src = A + FILES[n];
    })));
  }

  // ---- Colisão / interação ----
  const key = (x, y) => x + ',' + y;
  function buildCollision() {
    blocked.clear(); interactables = [];
    for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++)
      if (isBorder(x, y)) blocked.add(key(x, y));
    INNER_WALLS.forEach((orient, k) => blocked.add(k));
    BEDS.forEach((b) => {
      blocked.add(key(b.x, b.y)); blocked.add(key(b.x, b.y + (b.top ? 1 : -1)));
      const ix = b.x, iy = b.y + (b.top ? 2 : -1);
      interactables.push({ kind: 'bed', id: b.id, tx: ix, ty: iy, x: b.x * TILE + 16, y: b.y * TILE + 16 });
    });
    NPCS.forEach((n) => {
      blocked.add(key(n.x, n.y));
      interactables.push({ kind: 'npc', type: n.type, name: n.name, tx: n.x, ty: n.y, x: n.x * TILE + 16, y: n.y * TILE + 16 });
    });
    PROPS.forEach((p) => { if (p.img !== 'rug' && p.solid !== false) blocked.add(key(p.x, p.y)); });
    // NPCs que andam não bloqueiam (são de fundo); criam-se como agentes
    wanderers = WANDER.map((w) => ({
      img: w.img, name: w.name, hx: w.x, hy: w.y,
      px: w.x * TILE + 16, py: w.y * TILE + 16, tx: w.x * TILE + 16, ty: w.y * TILE + 16,
      dir: 0, frame: 0, anim: 0, wait: Math.random() * 3
    }));
  }

  function updateWanderers(dt) {
    for (const w of wanderers) {
      w.wait -= dt;
      const dx = w.tx - w.px, dy = w.ty - w.py, d = Math.hypot(dx, dy);
      if (d < 2) {
        w.frame = 0; w.anim = 0;
        if (w.wait <= 0) { pickWanderTarget(w); w.wait = 1.5 + Math.random() * 3.5; }
      } else {
        const sp = TILE * 1.5 * dt, nx = w.px + dx / d * sp, ny = w.py + dy / d * sp;
        if (canStand(nx, w.py)) w.px = nx; else w.tx = w.px;
        if (canStand(w.px, ny)) w.py = ny; else w.ty = w.py;
        if (Math.abs(dx) > Math.abs(dy)) w.dir = dx > 0 ? DIR.right : DIR.left;
        else w.dir = dy > 0 ? DIR.down : DIR.up;
        w.anim += dt * 7; w.frame = [0, 1, 2, 3][Math.floor(w.anim) % 4];
      }
    }
  }
  function pickWanderTarget(w) {
    for (let i = 0; i < 10; i++) {
      const gx = w.hx + (Math.floor(Math.random() * 5) - 2), gy = w.hy + (Math.floor(Math.random() * 5) - 2);
      if (gx > 0 && gy > 0 && gx < MAP_W - 1 && gy < MAP_H - 1 && !blocked.has(key(gx, gy))) {
        w.tx = gx * TILE + 16; w.ty = gy * TILE + 16; return;
      }
    }
    w.tx = w.hx * TILE + 16; w.ty = w.hy * TILE + 16;
  }

  function walkable(px, py) {
    const tx = Math.floor(px / TILE), ty = Math.floor(py / TILE);
    return !blocked.has(key(tx, ty));
  }
  function canStand(px, py) {
    // pés do personagem: caixinha de ~18px
    return walkable(px - 7, py) && walkable(px + 7, py) && walkable(px, py - 3) && walkable(px, py + 3);
  }

  // ---- Movimento ----
  const SPEED = TILE * 3.4;
  function update(dt) {
    let ix = input.x, iy = input.y;
    if (keys.has('w') || keys.has('arrowup')) iy -= 1;
    if (keys.has('s') || keys.has('arrowdown')) iy += 1;
    if (keys.has('a') || keys.has('arrowleft')) ix -= 1;
    if (keys.has('d') || keys.has('arrowright')) ix += 1;
    const len = Math.hypot(ix, iy);
    player.moving = len > 0.1;
    if (player.moving) {
      ix /= len; iy /= len;
      const step = SPEED * dt;
      const nx = player.x + ix * step, ny = player.y + iy * step;
      if (canStand(nx, player.y)) player.x = nx;
      if (canStand(player.x, ny)) player.y = ny;
      // direção (prioriza eixo dominante)
      if (Math.abs(ix) > Math.abs(iy)) player.dir = ix > 0 ? DIR.right : DIR.left;
      else player.dir = iy > 0 ? DIR.down : DIR.up;
      player.anim += dt * 8;
      player.frame = [0, 1, 2, 3][Math.floor(player.anim) % 4];
    } else { player.frame = 0; player.anim = 0; }
    // poeirinha ao caminhar (spawna nos pés em intervalos)
    dustTimer -= dt;
    if (player.moving && dustTimer <= 0) {
      dustTimer = 0.16;
      dust.push({ x: player.x + (Math.random() * 6 - 3), y: player.y - 1, life: 0, max: 0.45 + Math.random() * 0.2, r: 1.5 + Math.random() });
    }
    for (let i = dust.length - 1; i >= 0; i--) {
      dust[i].life += dt;
      if (dust[i].life >= dust[i].max) dust.splice(i, 1);
    }
    updateWanderers(dt);
    // porta automática (entrada de vidro) abre quando a Ana se aproxima
    const ddist = Math.hypot((DOOR_X + 0.5) * TILE - player.x, (DOOR_Y + 0.5) * TILE - player.y);
    doorOpen += ((ddist < TILE * 3 ? 1 : 0) - doorOpen) * Math.min(1, dt * 8);
    // portas internas dos quartos abrem/fecham conforme a proximidade
    DOORS.forEach((k) => {
      const [dxk, dyk] = k.split(',').map(Number);
      const dd = Math.hypot((dxk + 0.5) * TILE - player.x, (dyk + 0.5) * TILE - player.y);
      const tgt = dd < TILE * 2.2 ? 1 : 0;
      const cur = innerDoorOpen.get(k) || 0;
      innerDoorOpen.set(k, cur + (tgt - cur) * Math.min(1, dt * 8));
    });
    updateInteraction();
  }

  function updateInteraction() {
    let best = null, bd = TILE * 1.6;
    const ptx = player.x / TILE, pty = player.y / TILE;
    for (const it of interactables) {
      const d = Math.hypot((it.tx + 0.5) - ptx, (it.ty + 0.5) - pty) * TILE;
      if (d < bd) { bd = d; best = it; }
    }
    current = best;
    const prompt = document.getElementById('w3d-interact-prompt');
    const action = document.getElementById('w3d-action');
    if (best) {
      document.getElementById('w3d-interact-text').textContent = promptText(best);
      prompt.classList.remove('hidden'); action.classList.add('ready');
      const sx = (best.x - camX) * ZOOM, sy = (best.y - 34 - camY) * ZOOM;
      prompt.style.transform = `translate(-50%,-100%) translate(${sx}px,${sy}px)`;
    } else { prompt.classList.add('hidden'); action.classList.remove('ready'); }
  }
  function promptText(it) {
    if (it.kind === 'bed') return 'Atender Leito ' + it.id;
    if (it.type === 'R') return 'Falar c/ Dr. Roberto';
    if (it.type === 'C') return 'Falar c/ Enf. Clara';
    return 'Falar c/ Farm. Lucas';
  }
  function doInteract() {
    if (!isActive() || !current) return;
    if (current.kind === 'bed' && window.interactWithPatient) window.interactWithPatient(current.id);
    else if (window.interactWithNPC) window.interactWithNPC(current.type);
  }

  // ---- Render ----
  function bedStatus(id) {
    const st = window.getGameState ? window.getGameState() : { completedModules: [] };
    const cm = st.completedModules || [];
    if (cm.includes(id)) return 'done';
    if (id === 1 || cm.includes(id - 1)) return 'avail';
    return 'locked';
  }

  function drawFloor() {
    const x0 = Math.max(0, Math.floor(camX / TILE)), y0 = Math.max(0, Math.floor(camY / TILE));
    const x1 = Math.min(MAP_W, Math.ceil((camX + canvas.width / ZOOM) / TILE));
    const y1 = Math.min(MAP_H, Math.ceil((camY + canvas.height / ZOOM) / TILE));
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      if (isBorder(x, y)) {
        if (x === DOOR_X && y === DOOR_Y) { drawDoor(); continue; }
        if (y === 0) {
          // parede de fundo ALTA: a face sobe WALL_FACE px acima do tile (2.5D)
          const wimg = WINDOWS.has(key(x, y)) ? IMG.wall_window : IMG.wall;
          ctx.drawImage(wimg, x * TILE, y * TILE - WALL_FACE);
          const dec = WALL_DECOR.get(key(x, y));
          if (dec) ctx.drawImage(IMG[dec], x * TILE, y * TILE - WALL_FACE + 4);
        } else {
          ctx.drawImage(IMG.wall_base, x * TILE, y * TILE);
          const dec = WALL_DECOR.get(key(x, y));
          if (dec) ctx.drawImage(IMG[dec], x * TILE, y * TILE);
        }
        continue;
      }
      const t = tintAt(x);
      ctx.drawImage(t === 'r' ? IMG.floor_rose : t === 'b' ? IMG.floor_blue : IMG.floor, x * TILE, y * TILE);
      // sombra da parede de fundo/bordas no piso (profundidade 2.5D)
      if (isBorder(x, y - 1)) {
        ctx.fillStyle = 'rgba(16,24,40,0.28)'; ctx.fillRect(x * TILE, y * TILE, TILE, 5);
        ctx.fillStyle = 'rgba(16,24,40,0.16)'; ctx.fillRect(x * TILE, y * TILE + 5, TILE, 5);
        ctx.fillStyle = 'rgba(16,24,40,0.07)'; ctx.fillRect(x * TILE, y * TILE + 10, TILE, 4);
      }
      ctx.fillStyle = 'rgba(18,26,42,0.16)';
      if (isBorder(x, y + 1)) ctx.fillRect(x * TILE, y * TILE + TILE - 3, TILE, 3);
      if (isBorder(x - 1, y)) ctx.fillRect(x * TILE, y * TILE, 5, TILE);
      if (isBorder(x + 1, y)) ctx.fillRect(x * TILE + TILE - 5, y * TILE, 5, TILE);
      // sombra suave projetada pelas divisórias finas (profundidade)
      ctx.fillStyle = 'rgba(20,28,44,0.10)';
      if (INNER_WALLS.get(key(x - 1, y)) === 'v') ctx.fillRect(x * TILE, y * TILE, 4, TILE);
      if (INNER_WALLS.get(key(x + 1, y)) === 'v') ctx.fillRect(x * TILE + TILE - 4, y * TILE, 4, TILE);
      if (INNER_WALLS.get(key(x, y - 1)) === 'h') ctx.fillRect(x * TILE, y * TILE, TILE, 4);
    }
    // divisórias internas FINAS por cima do piso (verticais sobem 8px; horizontais ficam na faixa central)
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const o = INNER_WALLS.get(key(x, y));
      if (o === 'v') ctx.drawImage(IMG.wall_v, x * TILE, y * TILE - WALL_IN_FACE);
      else if (o === 'h') ctx.drawImage(IMG.wall_h, x * TILE, y * TILE + 8);
    }
    // batentes/portas azuis nos vãos das divisórias
    DOORS.forEach((k) => {
      const [dx, dy] = k.split(',').map(Number);
      if (dx < x0 - 1 || dx > x1 || dy < y0 - 1 || dy > y1) return;
      drawInnerDoor(dx, dy);
    });
  }

  // Porta azul (vão na divisória vertical): folha que ABRE GIRANDO na dobradiça
  // esquerda (a largura encurta com a perspectiva) conforme a Ana se aproxima.
  function drawInnerDoor(dx, dy) {
    const px = dx * TILE, py = dy * TILE, L = 9, W = 14;   // 9..22
    const top = py - WALL_IN_FACE, h = TILE + WALL_IN_FACE;
    const open = innerDoorOpen.get(dx + ',' + dy) || 0;

    // batente/jamba + verga superior
    ctx.fillStyle = '#cfd9e2'; ctx.fillRect(px + L - 1, top, W + 2, h);
    ctx.fillStyle = '#aab4be'; ctx.fillRect(px + L - 1, top, W + 2, 2);
    // vão escuro (passagem) revelado atrás da folha
    ctx.fillStyle = 'rgba(16,24,40,0.55)'; ctx.fillRect(px + L, top + 2, W, h - 4);

    // folha gira na dobradiça (borda esquerda): largura = W*cos(ângulo)
    const lx = px + L, ly = top + 2, lh = h - 4;
    const leafW = W * Math.cos(open * Math.PI / 2);
    if (leafW > 0.8) {
      ctx.fillStyle = '#3f6fa3'; ctx.fillRect(lx, ly, leafW, lh);              // folha
      ctx.fillStyle = '#5a86bd'; ctx.fillRect(lx, ly, Math.min(2, leafW), lh); // brilho na dobradiça
      ctx.fillStyle = '#2c5078'; ctx.fillRect(lx + leafW - 1.5, ly, 1.5, lh);  // sombra na borda livre
      if (leafW > 6) {                                                          // painéis (escalam c/ a largura)
        ctx.fillStyle = '#4f80b4'; const pw = leafW - 5;
        ctx.fillRect(lx + 2, ly + 3, pw, 8);
        ctx.fillRect(lx + 2, ly + lh - 13, pw, 10);
      }
      if (leafW > 4) {                                                          // maçaneta na borda livre
        ctx.fillStyle = '#ffd54a'; ctx.fillRect(lx + leafW - 3.5, ly + lh / 2 - 2, 2, 4);
      }
    }
  }

  // Paciente deitado (cabeça no travesseiro): cabelo variado, rosto em repouso,
  // braço sobre a coberta. Substitui o antigo bloco de pele (visual mais real).
  const PHAIR = ['#3b2a20', '#6b4a2a', '#1c1c22', '#7a5230', '#b0843f', '#8a8f96'];
  function drawPatient(bx, dy, br, id, t) {
    const sk = PSKIN[id % PSKIN.length];
    const hair = PHAIR[(id * 3) % PHAIR.length];
    const hx = bx + 10, hy = dy + 9 + br;
    ctx.fillStyle = hair; roundRect(hx - 1, hy - 1, 13, 11, 4); ctx.fill();     // cabelo (atrás)
    ctx.fillStyle = sk;   roundRect(hx + 1, hy + 1, 10, 9, 4); ctx.fill();      // rosto
    ctx.fillStyle = hair; ctx.fillRect(hx + 1, hy, 10, 2);                      // franja
    ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(hx + 8, hy + 2, 3, 7);     // sombra lateral
    const blink = (((t || 0) + id * 1.7) % 4) < 0.13;                           // piscadela ocasional
    const awake = (id % 3 === 0) && !blink;
    if (awake) {                                                                // olhos abertos: esclera + pupila
      ctx.fillStyle = '#f5f7fb'; ctx.fillRect(hx + 2, hy + 4, 2, 1); ctx.fillRect(hx + 6, hy + 4, 2, 1);
      ctx.fillStyle = '#3a2a24'; ctx.fillRect(hx + 3, hy + 4, 1, 1); ctx.fillRect(hx + 7, hy + 4, 1, 1);
    } else {                                                                    // olhos fechados (repouso/piscar)
      ctx.fillStyle = '#3a2a24'; ctx.fillRect(hx + 2, hy + 4, 3, 1); ctx.fillRect(hx + 6, hy + 4, 3, 1);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(hx + 4, hy + 7, 3, 1);     // boca
    ctx.fillStyle = 'rgba(240,140,160,0.40)'; ctx.fillRect(hx + 1, hy + 6, 1, 1); ctx.fillRect(hx + 9, hy + 6, 1, 1); // bochechas
    if (id % 2 === 0) {                                                          // braço repousado sobre a coberta
      ctx.fillStyle = sk; roundRect(bx + 7, dy + 22, 10, 3, 1); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(bx + 7, dy + 24, 10, 1);
    }
  }

  function shadow(cx, cy, rx, ry) {
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  }

  // ---- Ambiência por leito (procedural) ----
  function drawMiniPlant(x, y, t) {
    const sway = Math.sin(t * 1.5) * 0.8;
    ctx.fillStyle = '#b5651d'; ctx.fillRect(x + 2, y + 12, 8, 7);
    ctx.fillStyle = '#8a4a16'; ctx.fillRect(x + 2, y + 12, 8, 2);
    ctx.fillStyle = '#3f8d4a'; ctx.beginPath(); ctx.ellipse(x + 6 + sway, y + 7, 5, 7, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#4fa85c';
    ctx.beginPath(); ctx.ellipse(x + 3 + sway, y + 9, 3, 5, -0.5, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 9 + sway, y + 9, 3, 5, 0.5, 0, 7); ctx.fill();
  }

  // Acompanhante sentado na poltrona (rosto, ombros e braços) que questiona a conduta.
  const COMP_HAIR = ['#3b2a20', '#5a3a22', '#1c1c22', '#6b4a2a', '#8a8f96'];
  const COMP_SHIRT = ['#c0688a', '#6a8cc7', '#5aa17a', '#c98a3a', '#8a6aa8'];
  const COMP_SKIN = ['#e8b48f', '#f0c8a0', '#d79a6b'];
  function drawCompanion(x, y, t, seed) {
    seed = seed || 0;
    const hair = COMP_HAIR[seed % COMP_HAIR.length];
    const shirt = COMP_SHIRT[(seed * 2) % COMP_SHIRT.length];
    const sk = COMP_SKIN[seed % COMP_SKIN.length];
    const cx = x + 10;
    shadow(cx, y + 21, 11, 3);
    // ---- Poltrona (encosto alto + assento + apoios de braço) ----
    ctx.fillStyle = '#4f4068'; roundRect(x + 1, y - 4, 18, 25, 5); ctx.fill();   // encosto
    ctx.fillStyle = '#6b5a8a'; roundRect(x + 2, y - 3, 16, 13, 4); ctx.fill();   // estofado do encosto
    ctx.fillStyle = '#7a68a0'; ctx.fillRect(x + 3, y - 2, 14, 2);                // brilho do encosto
    ctx.fillStyle = '#5a4a78'; roundRect(x, y + 11, 20, 10, 4); ctx.fill();      // assento
    ctx.fillStyle = '#4a3d62'; roundRect(x - 1, y + 8, 4, 13, 2); ctx.fill();    // braço esq
    roundRect(x + 17, y + 8, 4, 13, 2); ctx.fill();                             // braço dir
    ctx.fillStyle = '#6b5a8a'; ctx.fillRect(x - 1, y + 8, 4, 2); ctx.fillRect(x + 17, y + 8, 4, 2);
    // ---- Acompanhante sentado ----
    // tronco / camisa
    ctx.fillStyle = shirt; roundRect(cx - 6, y + 6, 12, 12, 4); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(cx - 5, y + 7, 10, 2);  // brilho do ombro
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(cx + 3, y + 8, 3, 9);         // sombra lateral
    // braços sobre os apoios + mãos
    ctx.fillStyle = shirt; roundRect(cx - 9, y + 9, 4, 8, 2); ctx.fill(); roundRect(cx + 5, y + 9, 4, 8, 2); ctx.fill();
    ctx.fillStyle = sk; roundRect(cx - 9, y + 15, 4, 3, 1); ctx.fill(); roundRect(cx + 5, y + 15, 4, 3, 1); ctx.fill();
    // pescoço
    ctx.fillStyle = sk; ctx.fillRect(cx - 2, y + 4, 4, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(cx + 1, y + 4, 1, 3);
    // cabeça
    ctx.fillStyle = sk; roundRect(cx - 5, y - 3, 10, 9, 4); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(cx + 3, y - 1, 2, 6);          // sombra do rosto
    // cabelo
    ctx.fillStyle = hair; roundRect(cx - 6, y - 5, 12, 6, 3); ctx.fill();
    ctx.fillStyle = hair; ctx.fillRect(cx - 6, y - 2, 2, 5); ctx.fillRect(cx + 4, y - 2, 2, 5);  // costeletas
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(cx - 4, y - 4, 5, 1);    // brilho do cabelo
    // rosto: sobrancelhas, olhos (esclera + pupila), boca, bochechas
    ctx.fillStyle = hair; ctx.fillRect(cx - 3, y, 2, 1); ctx.fillRect(cx + 1, y, 2, 1);          // sobrancelhas
    ctx.fillStyle = '#f5f7fb'; ctx.fillRect(cx - 3, y + 1, 2, 1); ctx.fillRect(cx + 1, y + 1, 2, 1);  // esclera
    ctx.fillStyle = '#3a2a24'; ctx.fillRect(cx - 2, y + 1, 1, 1); ctx.fillRect(cx + 2, y + 1, 1, 1);  // pupilas
    ctx.fillStyle = 'rgba(0,0,0,0.20)'; ctx.fillRect(cx - 1, y + 4, 2, 1);          // boca
    ctx.fillStyle = 'rgba(240,140,160,0.40)'; ctx.fillRect(cx - 4, y + 3, 1, 1); ctx.fillRect(cx + 3, y + 3, 1, 1);  // bochechas
    // ---- Balão de pensamento "?" (questiona a conduta) ----
    const by = y - 12 + Math.sin(t * 2 + seed) * 1.2;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.arc(cx + 8, by, 6, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, by + 7, 1.7, 0, 7); ctx.fill();                // rastro do balão
    ctx.beginPath(); ctx.arc(cx + 2, by + 10, 1.1, 0, 7); ctx.fill();
    ctx.save();
    ctx.fillStyle = '#7a0043'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('?', cx + 8, by + 3);
    ctx.restore();
  }

  // Pessoa sentada num banco de espera (cabeça + tronco + leve respiração)
  function drawSeated(x, y, hair, coat, t, seed) {
    const breath = Math.sin(t * 1.4 + seed) * 0.6;
    shadow(x, y + 16, 8, 3);
    ctx.fillStyle = coat; roundRect(x - 6, y + 2 + breath, 12, 13, 3); ctx.fill();   // tronco
    ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(x + 2, y + 4 + breath, 4, 11);  // sombra lateral
    ctx.fillStyle = '#e8b48f'; roundRect(x - 4, y - 5 + breath, 9, 9, 3); ctx.fill(); // cabeça
    ctx.fillStyle = hair; ctx.fillRect(x - 4, y - 6 + breath, 9, 4);                  // cabelo
    ctx.fillStyle = '#3a2a24'; ctx.fillRect(x - 2, y - 2 + breath, 1, 1); ctx.fillRect(x + 2, y - 2 + breath, 1, 1); // olhos
  }

  // Equipamentos clínicos do paciente (desenhados ao lado/sobre o leito)
  function drawBedEquipment(equip, bx, by, t, br) {
    if (equip === 'iv') {
      ctx.strokeStyle = '#cfd9e2'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx - 4, by + 4); ctx.lineTo(bx - 4, by + 42); ctx.stroke();
      ctx.fillStyle = '#dff0ff'; roundRect(bx - 9, by + 8, 9, 12, 2); ctx.fill();
      ctx.strokeStyle = 'rgba(180,210,240,0.8)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bx - 4, by + 20); ctx.lineTo(bx + 12, by + 26); ctx.stroke();
    } else if (equip === 'o2') {
      ctx.fillStyle = '#1f8a4c'; roundRect(bx - 11, by + 24, 8, 18, 3); ctx.fill();
      ctx.fillStyle = '#0f5a30'; ctx.fillRect(bx - 9, by + 22, 4, 4);
      ctx.strokeStyle = 'rgba(220,240,255,0.85)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bx - 7, by + 26); ctx.quadraticCurveTo(bx + 4, by + 18, bx + 16, by + 16 + br); ctx.stroke();
    } else if (equip === 'dialysis') {
      ctx.fillStyle = '#cdd6e0'; roundRect(bx - 17, by + 12, 14, 30, 3); ctx.fill();
      ctx.fillStyle = '#22304a'; ctx.fillRect(bx - 14, by + 16, 8, 7);
      ctx.fillStyle = (Math.floor(t * 3) % 2) ? '#4fd0a0' : '#39b08a'; ctx.fillRect(bx - 13, by + 18, 6, 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#d05a5a'; ctx.beginPath(); ctx.moveTo(bx - 5, by + 26); ctx.quadraticCurveTo(bx + 6, by + 30, bx + 14, by + 28); ctx.stroke();
      ctx.strokeStyle = '#5a7ad0'; ctx.beginPath(); ctx.moveTo(bx - 5, by + 31); ctx.quadraticCurveTo(bx + 6, by + 35, bx + 14, by + 33); ctx.stroke();
    } else if (equip === 'trach') {
      ctx.fillStyle = '#e8eef5'; ctx.fillRect(bx + 14, by + 19 + br, 5, 3);
      ctx.strokeStyle = 'rgba(200,220,240,0.9)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(bx + 16, by + 21 + br); ctx.lineTo(bx + 16, by + 30); ctx.stroke();
      ctx.fillStyle = '#bcd6ea'; roundRect(bx + 12, by + 30, 8, 6, 2); ctx.fill();
    } else if (equip === 'gtt') {
      ctx.fillStyle = '#e0a0a0'; ctx.beginPath(); ctx.arc(bx + 16, by + 30, 2.5, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(230,220,180,0.9)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(bx + 16, by + 30); ctx.lineTo(bx + 26, by + 24); ctx.stroke();
      ctx.fillStyle = '#f3e7b0'; roundRect(bx + 25, by + 14, 8, 12, 2); ctx.fill();
    } else if (equip === 'sne') {
      ctx.strokeStyle = 'rgba(230,220,180,0.95)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(bx + 17, by + 15 + br); ctx.quadraticCurveTo(bx + 26, by + 18, bx + 28, by + 26); ctx.stroke();
      ctx.fillStyle = '#cfd9e2'; ctx.fillRect(bx + 27, by + 4, 2, 24);
      ctx.fillStyle = '#f3e7b0'; roundRect(bx + 24, by + 8, 9, 12, 2); ctx.fill();
    } else if (equip === 'critical') {
      ctx.fillStyle = '#10202e'; roundRect(bx - 18, by + 10, 16, 13, 2); ctx.fill();
      ctx.strokeStyle = '#39e08a'; ctx.lineWidth = 1; ctx.beginPath();
      const y0 = by + 17;
      ctx.moveTo(bx - 16, y0); ctx.lineTo(bx - 12, y0); ctx.lineTo(bx - 10, y0 - 4);
      ctx.lineTo(bx - 8, y0 + 3); ctx.lineTo(bx - 6, y0); ctx.lineTo(bx - 3, y0); ctx.stroke();
      const dx = bx - 16 + ((t * 10) % 13);
      ctx.fillStyle = '#9affd6'; ctx.fillRect(dx, y0 - 2, 1.5, 3);
    } else if (equip === 'endoflife') {
      ctx.fillStyle = '#9fb0c2'; ctx.fillRect(bx - 13, by + 22, 3, 18);
      ctx.fillStyle = '#caa6d8'; ctx.beginPath(); ctx.arc(bx - 11, by + 20, 3, 0, 7); ctx.fill();
      ctx.fillStyle = '#d98ac0'; ctx.beginPath(); ctx.arc(bx - 14, by + 21, 2.4, 0, 7); ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#ffe6c0'; ctx.fillRect(bx + 2, by + 4, 28, 40); ctx.restore();
    }
    ctx.lineWidth = 1;
  }

  // Focos de luz quente no piso (atmosfera). Gradientes cacheados (perf mobile).
  const LIGHTS = [[5, 4], [10, 4], [16, 4], [5, 9], [10, 7], [16, 9], [10, 11]];
  let lightGrads = null;
  function drawLights() {
    if (!lightGrads) {
      lightGrads = LIGHTS.map(([gx, gy]) => {
        const cx = gx * TILE + 16, cy = gy * TILE + 16, r = TILE * 2.2;
        const g = ctx.createRadialGradient(cx, cy, 3, cx, cy, r);
        g.addColorStop(0, 'rgba(255,240,205,0.15)');
        g.addColorStop(1, 'rgba(255,240,205,0)');
        return { g, cx, cy, r };
      });
    }
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const L of lightGrads) { ctx.fillStyle = L.g; ctx.fillRect(L.cx - L.r, L.cy - L.r, L.r * 2, L.r * 2); }
    ctx.restore();
  }

  // Feixes de luz caindo das janelas da parede de fundo no piso (atmosfera).
  let beamGrads = null;
  function drawSunbeams(t) {
    if (!beamGrads) {
      beamGrads = [...WINDOWS].map((k) => {
        const wx = parseInt(k.split(',')[0], 10) * TILE + 16;
        const g = ctx.createLinearGradient(0, 0, 0, TILE * 5.2);
        g.addColorStop(0, 'rgba(255,238,196,0.42)');
        g.addColorStop(0.5, 'rgba(255,235,188,0.20)');
        g.addColorStop(1, 'rgba(255,235,188,0)');
        return { wx, g };
      });
    }
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const B of beamGrads) {
      const flick = 0.9 + 0.1 * Math.sin(t * 0.8 + B.wx);   // leve cintilar
      ctx.globalAlpha = flick;
      ctx.fillStyle = B.g;
      // paralelogramo: estreito na janela, alargando e deslocando ao descer
      ctx.beginPath();
      ctx.moveTo(B.wx - 9, 0); ctx.lineTo(B.wx + 9, 0);
      ctx.lineTo(B.wx + 26, TILE * 5.2); ctx.lineTo(B.wx - 2, TILE * 5.2);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  // Decalques de piso: cruz da recepção, faixas das alas e setas do corredor.
  function drawDecals(t) {
    ctx.save();
    // cruz médica suave no centro da recepção
    ctx.globalAlpha = 0.09; ctx.fillStyle = '#3aa6a0';
    const cxp = 10 * TILE + 16, cyp = 4 * TILE + 4;
    ctx.fillRect(cxp - 5, cyp - 16, 10, 32); ctx.fillRect(cxp - 16, cyp - 5, 32, 10);
    // faixas coloridas de ala no piso (rosa à esquerda, azul à direita)
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = '#e08bb4'; ctx.fillRect(1 * TILE, 6 * TILE + 13, 6 * TILE, 6);   // ala rosa
    ctx.fillStyle = '#6ba3d8'; ctx.fillRect(15 * TILE, 6 * TILE + 13, 6 * TILE, 6);  // ala azul
    // chevrons (setas) descendo o corredor central — guiam até a entrada
    ctx.globalAlpha = 0.12; ctx.strokeStyle = '#7f8aa0'; ctx.lineWidth = 2;
    for (let r = 0; r < 4; r++) {
      const ay = (7 + r) * TILE + ((t * 18) % TILE);     // descem suavemente
      ctx.beginPath();
      ctx.moveTo(cxp - 7, ay - 4); ctx.lineTo(cxp, ay + 3); ctx.lineTo(cxp + 7, ay - 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Correção de cor global (coesão) + vinheta nas bordas — em espaço de tela.
  let vignetteGrad = null, vignetteW = 0, vignetteH = 0;
  function drawGradeAndVignette() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // grade quente sutil (unifica a paleta, suaviza saturações)
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = 'rgba(255,214,170,0.16)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    // vinheta
    if (!vignetteGrad || vignetteW !== canvas.width || vignetteH !== canvas.height) {
      vignetteW = canvas.width; vignetteH = canvas.height;
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const r = Math.hypot(cx, cy);
      vignetteGrad = ctx.createRadialGradient(cx, cy, r * 0.55, cx, cy, r);
      vignetteGrad.addColorStop(0, 'rgba(8,12,22,0)');
      vignetteGrad.addColorStop(1, 'rgba(8,12,22,0.32)');
    }
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // Cômodo atual do jogador (mantém o último se ele estiver numa parede/porta).
  function currentRoom() {
    const tx = Math.floor(player.x / TILE), ty = Math.floor(player.y / TILE);
    for (const r of ROOMS) if (tx >= r.x0 && tx <= r.x1 && ty >= r.y0 && ty <= r.y1) { lastRoom = r; return r; }
    return lastRoom;
  }

  // Foco de câmera: escurece tudo fora do cômodo atual (imersão), com borda suave
  // e transição interpolada ao trocar de sala.
  function drawRoomFocus() {
    const r = currentRoom();
    const tx0 = r.x0 * TILE, ty0 = r.y0 * TILE - (r.y0 === 1 ? WALL_FACE : 0);
    const tx1 = (r.x1 + 1) * TILE, ty1 = (r.y1 + 1) * TILE;
    if (!focusRect) focusRect = { x0: tx0, y0: ty0, x1: tx1, y1: ty1 };
    const k = 0.16;
    focusRect.x0 += (tx0 - focusRect.x0) * k; focusRect.y0 += (ty0 - focusRect.y0) * k;
    focusRect.x1 += (tx1 - focusRect.x1) * k; focusRect.y1 += (ty1 - focusRect.y1) * k;
    const sx0 = (focusRect.x0 - camX) * ZOOM, sy0 = (focusRect.y0 - camY) * ZOOM;
    const sx1 = (focusRect.x1 - camX) * ZOOM, sy1 = (focusRect.y1 - camY) * ZOOM;
    const W = canvas.width, H = canvas.height, DARK = 'rgba(6,10,20,0.62)', CLR = 'rgba(6,10,20,0)';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // bandas escuras fora do cômodo
    ctx.fillStyle = DARK;
    ctx.fillRect(0, 0, W, Math.max(0, sy0));
    ctx.fillRect(0, Math.max(0, sy1), W, H - Math.max(0, sy1));
    ctx.fillRect(0, sy0, Math.max(0, sx0), Math.max(0, sy1 - sy0));
    ctx.fillRect(Math.max(0, sx1), sy0, W - Math.max(0, sx1), Math.max(0, sy1 - sy0));
    // borda suave (feather) nas 4 arestas internas
    const F = 24; let g;
    g = ctx.createLinearGradient(0, sy0, 0, sy0 + F); g.addColorStop(0, DARK); g.addColorStop(1, CLR);
    ctx.fillStyle = g; ctx.fillRect(sx0, sy0, sx1 - sx0, F);
    g = ctx.createLinearGradient(0, sy1, 0, sy1 - F); g.addColorStop(0, DARK); g.addColorStop(1, CLR);
    ctx.fillStyle = g; ctx.fillRect(sx0, sy1 - F, sx1 - sx0, F);
    g = ctx.createLinearGradient(sx0, 0, sx0 + F, 0); g.addColorStop(0, DARK); g.addColorStop(1, CLR);
    ctx.fillStyle = g; ctx.fillRect(sx0, sy0, F, sy1 - sy0);
    g = ctx.createLinearGradient(sx1, 0, sx1 - F, 0); g.addColorStop(0, DARK); g.addColorStop(1, CLR);
    ctx.fillStyle = g; ctx.fillRect(sx1 - F, sy0, F, sy1 - sy0);
    ctx.restore();
  }

  // Porta automática de vidro (abre ao aproximar)
  function drawDoor() {
    const dx = DOOR_X * TILE, dy = DOOR_Y * TILE;
    ctx.fillStyle = '#6b7785'; ctx.fillRect(dx - 2, dy, TILE + 4, TILE);
    ctx.fillStyle = '#243042'; ctx.fillRect(dx, dy + 2, TILE, TILE - 4);
    const s = doorOpen * 13;
    ctx.fillStyle = 'rgba(150,205,232,0.88)';
    ctx.fillRect(dx + 2 - s, dy + 3, 13, TILE - 6);
    ctx.fillRect(dx + 17 + s, dy + 3, 13, TILE - 6);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(dx + 3 - s, dy + 4, 3, TILE - 9);
    ctx.fillRect(dx + 18 + s, dy + 4, 3, TILE - 9);
  }

  function drawSprites(t) {
    const list = [];
    // leitos + paciente (com sombra, respiração e ambiência por leito)
    BEDS.forEach((b) => {
      const drawY = b.top ? b.y * TILE : (b.y - 0.5) * TILE;
      const st = bedStatus(b.id);
      const decor = BED_DECOR[b.id] || {};
      list.push({ sortY: drawY + 48, draw: () => {
        const bx = b.x * TILE;
        shadow(bx + 16, drawY + 47, 13, 4);
        // planta de cabeceira (decoração, mesmo em leito vago)
        if (decor.plant) drawMiniPlant(bx - 13, drawY + 18, t + b.id);
        ctx.drawImage(IMG.bed, bx, drawY);
        if (st !== 'locked') {
          const br = Math.sin(t * 1.6 + b.id) * 0.6;          // respiração
          // coberta colorida (tinge a parte inferior do leito)
          if (decor.blanket) {
            ctx.save(); ctx.globalAlpha = 0.62; ctx.fillStyle = decor.blanket;
            ctx.fillRect(bx + 6, drawY + 20, 21, 24); ctx.restore();
            ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(bx + 6, drawY + 20, 21, 3); // dobra do lençol
          }
          drawPatient(bx, drawY, br, b.id, t);
          // equipamento clínico do paciente
          if (decor.equip) drawBedEquipment(decor.equip, bx, drawY, t, br);
          // poltrona de acompanhante (que às vezes questiona a conduta)
          if (decor.companion) drawCompanion(bx + 30, drawY + 24, t, b.id);
        }
      }, label: { x: b.x * TILE + 16, y: drawY, text: 'Leito ' + b.id, st } });
    });
    PROPS.forEach((p) => {
      const yy = p.y * TILE + (32 - p.h);
      // O tapete é decoração de piso: deve ficar SEMPRE atrás dos personagens
      // (sortY mínimo), nunca por cima da Ana ao caminhar sobre ele.
      const baseSortY = p.img === 'rug' ? -99999 : p.y * TILE + 28;
      list.push({ sortY: baseSortY, draw: () => {
        if (p.img === 'rug' || p.img === 'door' || p.img === 'curtain') { ctx.drawImage(IMG[p.img], p.x * TILE, yy); return; }
        if (p.img === 'plant') {
          const sway = Math.sin(t * 1.5 + p.x) * 0.8;          // balança
          shadow(p.x * TILE + 16, p.y * TILE + 30, 9, 3);
          ctx.drawImage(IMG.plant, p.x * TILE + sway, yy);
          return;
        }
        shadow(p.x * TILE + 16, p.y * TILE + 30, 11, 3.5);
        ctx.drawImage(IMG[p.img], p.x * TILE, yy);
        if (p.img === 'desk') {                                // tela piscando
          ctx.fillStyle = (Math.floor(t * 3) % 2) ? '#5fe0ea' : '#39c3cf';
          ctx.fillRect(p.x * TILE + 12, yy + 2, 8, 4);
        }
      } });
    });
    SEATED.forEach((s, i) => list.push({ sortY: s.y * TILE + 16,
      draw: () => drawSeated(s.x * TILE + 16, s.y * TILE + 6, s.hair, s.coat, t, i * 2.1) }));
    NPCS.forEach((n) => list.push({ sortY: n.y * TILE + 30, draw: () => bob(IMG[n.img], n.x, n.y, t, n.name.length),
      label: { x: n.x * TILE + 16, y: n.y * TILE - 2, text: n.name, st: 'npc' } }));
    wanderers.forEach((w) => list.push({ sortY: w.py, draw: () => {
      shadow(w.px, w.py + 1, 8.5, 3.2);
      ctx.drawImage(IMG[w.img], w.frame * TILE, w.dir * TILE, TILE, TILE, w.px - 16, w.py - 28, TILE, TILE);
    }, label: { x: w.px, y: w.py - 30, text: w.name, st: 'player' } }));
    // player
    list.push({ sortY: player.y, draw: drawPlayer, label: { x: player.x, y: player.y - 30, text: 'Dra. Ana', st: 'self' } });

    list.sort((a, b) => a.sortY - b.sortY);
    labels.length = 0;
    for (const o of list) { o.draw(); if (o.label) labels.push(o.label); }
  }
  const labels = [];

  function bob(img, tx, ty, t, seed) {
    const dy = Math.sin(t * 2 + seed) * 1.2;
    ctx.drawImage(img, tx * TILE, ty * TILE - 2 + dy);
  }
  function drawDust() {
    for (const p of dust) {
      const k = p.life / p.max;                 // 0..1
      ctx.globalAlpha = (1 - k) * 0.35;
      ctx.fillStyle = '#cdbfa6';
      ctx.beginPath(); ctx.arc(p.x, p.y - k * 4, p.r + k * 2, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawPlayer() {
    // sombra dinâmica sob a Ana (encolhe levemente em movimento)
    const sw = player.moving ? 8.5 : 9.5;
    shadow(player.x, player.y + 1, sw, 3.4);
    drawDust();
    const fx = player.frame * TILE, fy = player.dir * TILE;
    ctx.drawImage(IMG.ana, fx, fy, TILE, TILE, player.x - 16, player.y - 28, TILE, TILE);
  }

  function drawLabels() {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = '11px Montserrat, sans-serif'; ctx.textAlign = 'center';
    for (const l of labels) {
      const sx = (l.x - camX) * ZOOM, sy = (l.y - camY) * ZOOM;
      if (sx < -40 || sx > canvas.width + 40 || sy < 0 || sy > canvas.height) continue;
      const w = ctx.measureText(l.text).width + 12;
      let bg = 'rgba(8,14,26,.78)', bd = 'rgba(255,255,255,.18)';
      if (l.st === 'self') bg = 'rgba(122,0,67,.9)';
      else if (l.st === 'avail') { bd = '#ffb300'; }
      else if (l.st === 'done') { bd = '#4caf50'; }
      ctx.fillStyle = bg; roundRect(sx - w / 2, sy - 16, w, 16, 5); ctx.fill();
      ctx.strokeStyle = bd; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#fff';
      let pre = l.st === 'avail' ? '❗ ' : l.st === 'done' ? '✅ ' : l.st === 'locked' ? '🔒 ' : '';
      ctx.fillText(pre + l.text, sx, sy - 4);
    }
    ctx.restore();
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function render(t) {
    // câmera centrada, presa ao mapa
    const viewW = canvas.width / ZOOM, viewH = canvas.height / ZOOM;
    camX = player.x - viewW / 2; camY = player.y - viewH / 2;
    camX = Math.max(0, Math.min(camX, MAP_W * TILE - viewW));
    // deixa a câmera subir um pouco além do topo p/ mostrar a face da parede de fundo
    camY = Math.max(-(WALL_FACE + 6), Math.min(camY, MAP_H * TILE - viewH));
    if (MAP_W * TILE < viewW) camX = (MAP_W * TILE - viewW) / 2;
    if (MAP_H * TILE < viewH) camY = (MAP_H * TILE - viewH) / 2;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#1b2436'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(ZOOM, 0, 0, ZOOM, -camX * ZOOM, -camY * ZOOM);
    drawFloor();
    drawDecals(t);
    drawLights();
    drawSunbeams(t);
    drawSprites(t);
    drawGradeAndVignette();
    drawRoomFocus();
    drawLabels();
    drawMinimap();
  }

  // ---- Minimapa ----
  function drawMinimap() {
    if (!miniCtx) return;
    const S = miniCv.width, cw = S / MAP_W, ch = S / MAP_H;
    miniCtx.clearRect(0, 0, S, S);
    for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
      miniCtx.fillStyle = isBorder(x, y) ? '#0a0f1c' : (tintAt(x) === 'r' ? '#5a3340' : tintAt(x) === 'b' ? '#2b4960' : '#39424f');
      miniCtx.fillRect(x * cw, y * ch, cw, ch);
    }
    BEDS.forEach((b) => {
      const stt = bedStatus(b.id);
      miniCtx.fillStyle = stt === 'done' ? '#4caf50' : stt === 'avail' ? '#ffb300' : '#7a6a55';
      miniCtx.fillRect(b.x * cw, b.y * ch, cw, ch);
    });
    NPCS.forEach((n) => { miniCtx.fillStyle = '#4dd0e1'; miniCtx.fillRect(n.x * cw, n.y * ch, cw, ch); });

    // marcador pulsante sobre o próximo leito a atender (objetivo atual)
    const nextBed = BEDS.filter(b => bedStatus(b.id) === 'avail').sort((a, b) => a.id - b.id)[0];
    if (nextBed) {
      const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 250);
      const mx = (nextBed.x + 0.5) * cw, my = (nextBed.y + 0.5) * ch;
      miniCtx.strokeStyle = `rgba(255,77,148,${pulse.toFixed(2)})`;
      miniCtx.lineWidth = 2;
      miniCtx.beginPath(); miniCtx.arc(mx, my, cw * (0.9 + pulse * 0.7), 0, 7); miniCtx.stroke();
    }

    miniCtx.fillStyle = '#ff4d94';
    miniCtx.beginPath(); miniCtx.arc((player.x / TILE) * cw, (player.y / TILE) * ch, cw * 0.7, 0, 7); miniCtx.fill();
  }

  // ---- Boneco do inventário ----
  function drawDoll() {
    if (!dollCtx) return;
    dollCtx.imageSmoothingEnabled = false;
    dollCtx.clearRect(0, 0, dollCv.width, dollCv.height);
    const s = 5; // zoom do boneco
    dollCtx.drawImage(IMG.ana, 0, 0, TILE, TILE, (dollCv.width - TILE * s) / 2, 24, TILE * s, TILE * s);
  }

  // ---- Loop ----
  function isActive() {
    const home = document.getElementById('screen-home');
    if (!home || !home.classList.contains('active')) return false;
    if (document.querySelector('.modal-overlay.active')) return false;
    if (document.querySelector('.hud-window.open')) return false;
    return true;
  }
  let last = 0;
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
    const t = ts / 1000;
    const active = isActive();
    root.classList.toggle('w3d-paused', !active);
    if (active) update(dt);
    render(t);
    if (document.getElementById('win-inventory')?.classList.contains('open')) drawDoll();
  }

  // ---- Input (reaproveita HUD) ----
  function setupInput() {
    const base = document.getElementById('w3d-joystick');
    const knob = document.getElementById('w3d-joystick-knob');
    let tid = null, cx = 0, cy = 0, R = 1;
    base.addEventListener('pointerdown', (e) => {
      const r = base.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; R = r.width / 2;
      tid = e.pointerId; base.setPointerCapture(e.pointerId); jmove(e);
    });
    function jmove(e) {
      if (tid !== e.pointerId) return;
      let dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy);
      if (d > R) { dx = dx / d * R; dy = dy / d * R; }
      knob.style.transform = `translate(${dx}px,${dy}px)`; input.x = dx / R; input.y = dy / R;
    }
    base.addEventListener('pointermove', jmove);
    const end = (e) => { if (tid !== e.pointerId) return; tid = null; input.x = input.y = 0; knob.style.transform = 'translate(0,0)'; };
    base.addEventListener('pointerup', end); base.addEventListener('pointercancel', end);

    document.getElementById('w3d-action').addEventListener('click', () => { if (window.soundSynth) window.soundSynth.play('click'); doInteract(); });
    const zin = document.getElementById('w3d-zoom-in'), zout = document.getElementById('w3d-zoom-out');
    if (zin) zin.addEventListener('click', () => { ZOOM = Math.min(5, ZOOM + 1); });
    if (zout) zout.addEventListener('click', () => { ZOOM = Math.max(2, ZOOM - 1); });

    window.addEventListener('keydown', (e) => {
      if (!isActive()) return; const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) { keys.add(k); e.preventDefault(); }
      else if (k === 'e' || k === 'enter' || k === ' ') { e.preventDefault(); doInteract(); }
    });
    window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
  }

  function resize() {
    if (!canvas) return;
    const w = root.clientWidth || 320, h = root.clientHeight || 320;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ZOOM = Math.max(2, Math.min(5, Math.round(Math.min(canvas.width, canvas.height) / (TILE * 8))));
  }

  function refresh() { /* labels lêem o estado direto a cada frame */ }

  function fail(msg) {
    const el = document.getElementById('w3d-loading');
    if (el) { el.classList.add('w3d-error'); el.innerHTML = msg; }
    console.error('[NutriWorld2D]', msg);
  }

  async function init() {
    root = document.getElementById('world3d-root');
    canvas = document.getElementById('world3d-canvas');
    if (!root || !canvas) return;
    ctx = canvas.getContext('2d');
    const lbls = document.getElementById('world3d-labels'); if (lbls) lbls.style.display = 'none';
    miniCv = document.getElementById('world3d-minimap'); if (miniCv) miniCtx = miniCv.getContext('2d');
    dollCv = document.getElementById('inv-character'); if (dollCv) dollCtx = dollCv.getContext('2d');
    try {
      await loadAll();
      buildCollision();
      setupInput();
      resize();
      window.addEventListener('resize', resize);
      if (window.ResizeObserver) new ResizeObserver(resize).observe(root);
      started = true;
      const ld = document.getElementById('w3d-loading'); if (ld) ld.style.display = 'none';
      raf = requestAnimationFrame(loop);
    } catch (e) {
      fail('Não foi possível carregar a arte do jogo.<br><small>' + (e && e.message ? e.message : e) + '</small>');
    }
  }

  window.NutriWorld = { refresh, resize, isReady: () => started };
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', init);
  else init();
})();
