// Motor Principal do NutriGame MMORPG Gamificado
// Alinhado com a Identidade Visual de Ana Luísa Rocha

// Estado Geral do Jogador
let state = {
  xp: 0,
  levelIndex: 0,
  lives: 3,
  completedModules: [], // IDs dos módulos concluídos
  unlockedCards: [], // IDs dos resumos liberados
  activeModuleId: null,
  currentQuestionIndex: 0,
  quizXpEarned: 0,
  inventory: [], // Loot coletado
  equippedItem: null, // Item equipado atualmente
  achievements: [], // IDs de conquistas desbloqueadas
  review: [], // chaves "moduloId:indiceQuestao" de questões erradas (repetição espaçada)
  streak: { count: 0, lastDay: null }, // ofensiva de estudo diário
  stats: {
    quizAnswered: 0,      // total de questões respondidas
    quizCorrect: 0,       // total de acertos
    threeStarCases: 0,    // casos concluídos com 3 estrelas
    studyReviews: 0,      // quizzes refeitos no Estudo Livre
    perModule: {}         // { [id]: { completions, bestStars, quizCorrect, quizTotal } }
  }
};

// Garante que o estado tenha todos os campos novos (migração de saves antigos)
function ensureStateShape() {
  if (!state.completedModules) state.completedModules = [];
  if (!state.unlockedCards) state.unlockedCards = [];
  if (!state.inventory) state.inventory = [];
  if (!state.achievements) state.achievements = [];
  if (!state.review) state.review = [];
  if (!state.streak) state.streak = { count: 0, lastDay: null };
  if (!state.stats) state.stats = {};
  const s = state.stats;
  if (typeof s.quizAnswered !== "number") s.quizAnswered = 0;
  if (typeof s.quizCorrect !== "number") s.quizCorrect = 0;
  if (typeof s.threeStarCases !== "number") s.threeStarCases = 0;
  if (typeof s.studyReviews !== "number") s.studyReviews = 0;
  if (typeof s.studySeconds !== "number") s.studySeconds = 0;
  if (typeof s.simuladoBest !== "number") s.simuladoBest = 0;
  if (!s.perModule) s.perModule = {};
}

// Estado do Caso Clínico Atual (Simulador)
let activeCase = {
  moduleId: null,
  requestedExams: [],
  selectedPrescriptions: [],
  uselessExamsCount: 0,
  lives: 3
};

// Banco de Itens de Loot (MMORPG)
const LOOT_ITEMS = {
  estetoscopio_ouro: { id: "estetoscopio_ouro", name: "Estetoscópio de Ouro", emoji: "🩺", rarity: "legendary", bonusText: "+20% XP global", bonusType: "xp_multiplier", bonusVal: 1.2 },
  cristal_orto: { id: "cristal_orto", name: "Cristal Ortomolecular", emoji: "💎", rarity: "legendary", bonusText: "+2 Vidas por caso", bonusType: "extra_life", bonusVal: 2 },
  jaleco_premium: { id: "jaleco_premium", name: "Jaleco de Linho Premium", emoji: "🥼", rarity: "epic", bonusText: "+1 Vida por caso", bonusType: "extra_life", bonusVal: 1 },
  amuleto_passiflora: { id: "amuleto_passiflora", name: "Amuleto de Passiflora", emoji: "🪻", rarity: "epic", bonusText: "+30% XP no Quiz", bonusType: "quiz_xp", bonusVal: 1.3 },
  livro_fito: { id: "livro_fito", name: "Grimório de Fitoterapia Rara", emoji: "📚", rarity: "rare", bonusText: "Dicas de exames ativas", bonusType: "free_hints", bonusVal: true },
  kit_magistral: { id: "kit_magistral", name: "Kit Magistral de Combate", emoji: "⚗️", rarity: "rare", bonusText: "+20 de dano no Boss", bonusType: "boss_damage", bonusVal: 20 },
  calculadora_imc: { id: "calculadora_imc", name: "Calculadora de IMC", emoji: "📟", rarity: "common", bonusText: "+10% XP no Quiz", bonusType: "quiz_xp", bonusVal: 1.1 },
  balanca_bio: { id: "balanca_bio", name: "Balança de Bioimpedância", emoji: "⚖️", rarity: "common", bonusText: "+1 exame sem penalidade", bonusType: "exam_limit", bonusVal: 1 }
};

// Pesos de raridade para o drop (quanto maior, mais comum)
const RARITY_WEIGHTS = { common: 50, rare: 28, epic: 16, legendary: 6 };

// ----- Helpers de bônus do item equipado -----
function equippedItem() {
  return state.equippedItem ? LOOT_ITEMS[state.equippedItem] : null;
}
function bonusOf(type, fallback) {
  const eq = equippedItem();
  return (eq && eq.bonusType === type) ? eq.bonusVal : fallback;
}
function maxLivesFromGear() {
  const eq = equippedItem();
  return (eq && eq.bonusType === "extra_life") ? 3 + (eq.bonusVal || 1) : 3;
}
function bossDamage() {
  return BOSS_DAMAGE + (bonusOf("boss_damage", 0) || 0);
}
function examLimitBonus() {
  return bonusOf("exam_limit", 0) || 0;
}

// Sorteio de drop de loot ponderado por raridade (devolve o texto do drop, ou "")
function rollLootDrop(starCount) {
  const dropChance = starCount >= 3 ? 1.0 : starCount === 2 ? 0.8 : 0.6;
  if (Math.random() > dropChance) return "";

  const owned = state.inventory || [];
  const pool = Object.values(LOOT_ITEMS).filter(it => !owned.includes(it.id));
  if (pool.length === 0) {
    // Inventário completo → bônus de XP consolação
    state.xp += 60;
    saveToLocalStorage();
    return `\n\n🎁 Inventário completo! Você converteu o loot em +60 XP de bônus.`;
  }

  // Pesos por raridade (3 estrelas melhoram itens raros)
  const boost = starCount >= 3 ? { common: 1, rare: 1.3, epic: 1.8, legendary: 2.4 } : { common: 1, rare: 1, epic: 1, legendary: 1 };
  let totalW = 0;
  const weighted = pool.map(it => {
    const w = (RARITY_WEIGHTS[it.rarity] || 10) * (boost[it.rarity] || 1);
    totalW += w;
    return { it, w };
  });
  let r = Math.random() * totalW;
  let chosen = weighted[0].it;
  for (const e of weighted) { r -= e.w; if (r <= 0) { chosen = e.it; break; } }

  state.inventory.push(chosen.id);
  saveToLocalStorage();
  setTimeout(() => { soundSynth.play("loot"); spawnParticles("loot"); }, 500);
  return `\n\n🎁 [LOOT ${chosen.rarity.toUpperCase()}] Você encontrou:\n${chosen.emoji} ${chosen.name}\nEfeito: ${chosen.bonusText}`;
}

// Sintetizador de Áudio Retrô (Web Audio API)
const soundSynth = {
  ctx: null,
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  
  play(type) {
    this.init();
    if (!this.ctx) return;
    
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    const now = this.ctx.currentTime;
    
    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "success") {
      const freqs = [350, 520, 700];
      const duration = 0.12;
      freqs.forEach((f, i) => {
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.type = "triangle";
        subOsc.frequency.setValueAtTime(f, now + i * 0.05);
        subGain.gain.setValueAtTime(0.08, now + i * 0.05);
        subGain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.05 + duration);
        subOsc.start(now + i * 0.05);
        subOsc.stop(now + i * 0.05 + duration);
      });
    } else if (type === "error") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(45, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "loot") {
      const freqs = [900, 1350, 1800];
      freqs.forEach((f, i) => {
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(f, now);
        subGain.gain.setValueAtTime(0.04, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        subOsc.start(now);
        subOsc.stop(now + 0.35);
      });
    } else if (type === "levelup") {
      const notes = [440, 554, 659, 880];
      const durations = [0.1, 0.1, 0.1, 0.35];
      const startTimes = [0, 0.08, 0.16, 0.24];
      
      notes.forEach((note, i) => {
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.type = "square";
        subOsc.frequency.setValueAtTime(note, now + startTimes[i]);
        subGain.gain.setValueAtTime(0.06, now + startTimes[i]);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + startTimes[i] + durations[i]);
        subOsc.start(now + startTimes[i]);
        subOsc.stop(now + startTimes[i] + durations[i]);
      });
    }
  }
};

// Matriz de Layout do Hospital (11x11)
const MAP_WIDTH = 11;
const MAP_HEIGHT = 11;
const hospitalMapLayout = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y = 0
  [1, "L1", 0, 0, 1, 0, 0, 0, "L5", 0, 1], // y = 1
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], // y = 2
  [1, "L2", 0, 0, 0, 0, 0, 0, "L6", 0, 1], // y = 3
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1], // y = 4
  [1, 0, 0, 0, "C", "N", "L", 0, 0, 0, 1], // y = 5
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1], // y = 6
  [1, "L3", 0, 0, 0, "R", 0, 0, "L7", 0, 1], // y = 7
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], // y = 8
  [1, "L4", 0, 0, 1, 0, 0, 0, "L8", 0, 1], // y = 9
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  // y = 10
];

// Posições no mapa
let playerPos = { x: 5, y: 9 };
let camilaPos = { x: 3, y: 2 };
let thiagoPos = { x: 7, y: 8 };
let moveInterval = null;

// Quests Tracker e Batalha de Chefe
let bossHP = 150;
let maxBossHP = 150;

// Pontes para o mundo 3D (world3d.js, ES module) -------------------
// getGameState() reflete o estado atual mesmo após reatribuições de `state`.
window.getGameState = () => state;
window.nutriGameData = nutriGameData;
window.soundSynth = soundSynth;
// ------------------------------------------------------------------

// Inicialização do Aplicativo
function initApp() {
  loadFromLocalStorage();
  setupDarkMode();
  setupFullscreen();
  setupJoystick();
  setupSubTabs();
  setupEventListeners();
  setupGlobalChat();
  setupWanderingPlayers();
  setupHudWindows();
  setupFlashcards();
  startStudyTimer();
  updateDailyStreak();
  renderHomeScreen();
  checkAchievements();
}

// Carregar progresso salvo
function loadFromLocalStorage() {
  const savedState = localStorage.getItem("nutri_game_state");
  if (savedState) {
    try {
      state = JSON.parse(savedState);
    } catch (e) {
      console.error("Erro ao ler LocalStorage, limpando dados.", e);
    }
  }
  ensureStateShape();
}

// Salvar progresso
function saveToLocalStorage() {
  localStorage.setItem("nutri_game_state", JSON.stringify(state));
}

// Registrar o Service Worker (PWA)
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js")
        .then((reg) => console.log("Service Worker registrado:", reg.scope))
        .catch((err) => console.error("Falha ao registrar SW:", err));
    });
  }
}

// Configurar Modo Escuro
function setupDarkMode() {
  const toggleBtn = document.getElementById("btn-toggle-darkmode");
  const savedTheme = localStorage.getItem("nutri_game_theme");
  
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    toggleBtn.textContent = "☀️";
  }
  
  toggleBtn.addEventListener("click", () => {
    soundSynth.play("click");
    const isDark = document.body.classList.toggle("dark-theme");
    if (isDark) {
      toggleBtn.textContent = "☀️";
      localStorage.setItem("nutri_game_theme", "dark");
    } else {
      toggleBtn.textContent = "🌙";
      localStorage.setItem("nutri_game_theme", "light");
    }
  });
}

// ================= TELA CHEIA (FULLSCREEN) =================
function setupFullscreen() {
  const btn = document.getElementById('btn-toggle-fullscreen');
  if (!btn) return;

  btn.addEventListener('click', () => {
    soundSynth.play('click');
    toggleFullscreen();
  });

  // Atualiza ícone quando fullscreen muda externamente (tecla Esc, etc.)
  document.addEventListener('fullscreenchange', updateFullscreenIcon);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
}

function toggleFullscreen() {
  const el = document.getElementById('app-container') || document.documentElement;
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);

  if (!isFs) {
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) req.call(el, { navigationUI: 'hide' }).catch(() => {});
  } else {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) exit.call(document).catch(() => {});
  }
  updateFullscreenIcon();
}

function updateFullscreenIcon() {
  const btn = document.getElementById('btn-toggle-fullscreen');
  if (!btn) return;
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
  btn.textContent = isFs ? '⛶' : '📺';
}

// ================= JOYSTICK VIRTUAL ANALÓGICO =================
let joystickMoveInterval = null;
const JOYSTICK_DEADZONE = 10;   // pixels mínimos para registar movimento
const JOYSTICK_STEP_MS = 160;   // intervalo de repetição do passo (ms)

function setupJoystick() {
  const base  = document.getElementById('joystick-container');
  const knob  = document.getElementById('joystick-knob');
  if (!base || !knob) return;

  const RADIUS = base.offsetWidth / 2 || 45; // raio máximo do knob
  let active = false;
  let lastDx = 0, lastDy = 0;

  function getCenter() {
    const r = base.getBoundingClientRect();
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  }

  function applyDelta(clientX, clientY) {
    const { cx, cy } = getCenter();
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Limita o knob dentro do raio
    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    lastDx = dx;
    lastDy = dy;
  }

  function resetKnob() {
    knob.style.transition = 'transform 0.15s ease-out';
    knob.style.transform = 'translate(0,0)';
    setTimeout(() => { knob.style.transition = ''; }, 150);
    lastDx = 0; lastDy = 0;
  }

  function startMoving() {
    stopMoving();
    fireMove();
    joystickMoveInterval = setInterval(fireMove, JOYSTICK_STEP_MS);
  }

  function stopMoving() {
    if (joystickMoveInterval) { clearInterval(joystickMoveInterval); joystickMoveInterval = null; }
  }

  function fireMove() {
    const absX = Math.abs(lastDx);
    const absY = Math.abs(lastDy);
    if (absX < JOYSTICK_DEADZONE && absY < JOYSTICK_DEADZONE) return;

    // Movimento cardinal: eixo mais dominante vence
    if (absX >= absY) {
      movePlayer(lastDx > 0 ? 1 : -1, 0);
    } else {
      movePlayer(0, lastDy > 0 ? 1 : -1);
    }
    soundSynth.play('click');
  }

  // ——— Pointer Events (unifica touch + mouse) ———
  base.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    base.setPointerCapture(e.pointerId);
    active = true;
    applyDelta(e.clientX, e.clientY);
    startMoving();
  });

  base.addEventListener('pointermove', (e) => {
    if (!active) return;
    e.preventDefault();
    applyDelta(e.clientX, e.clientY);
  });

  base.addEventListener('pointerup', (e) => {
    e.preventDefault();
    active = false;
    resetKnob();
    stopMoving();
  });

  base.addEventListener('pointercancel', () => {
    active = false;
    resetKnob();
    stopMoving();
  });
}

// Configurar Alternância de Sub-Abas da Home
function setupSubTabs() {
  const subTabButtons = document.querySelectorAll(".sub-tab-btn");
  subTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      soundSynth.play("click");
      const targetPanel = btn.getAttribute("data-sub-tab");
      
      subTabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const subPanels = document.querySelectorAll(".home-sub-panel");
      subPanels.forEach(p => p.classList.remove("active"));
      document.getElementById(targetPanel).classList.add("active");
      
      if (targetPanel === "sub-tab-map") {
        renderHospitalMap();
      } else if (targetPanel === "sub-tab-inventory") {
        renderInventoryGrid();
      } else if (targetPanel === "sub-tab-leaderboard") {
        renderLeaderboard();
      }
    });
  });
}

// Configurar Manipuladores de Eventos Gerais
function setupEventListeners() {
  // Abas do Prontuário
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      soundSynth.play("click");
      const targetTab = button.getAttribute("data-tab");
      
      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      
      const panels = document.querySelectorAll(".tab-panel");
      panels.forEach(panel => panel.classList.remove("active"));
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // Botão Sair da Simulação
  document.getElementById("btn-abort-case").addEventListener("click", () => {
    soundSynth.play("click");
    showAlert("Abandonar Paciente?", "Deseja realmente sair do atendimento? O progresso deste leito será perdido.", "❓", "Abandonar", () => {
      showScreen("screen-home");
    });
  });

  // Enviar Prescrição (Inicia Minijogo de Alquimia)
  document.getElementById("btn-submit-prescription").addEventListener("click", () => {
    soundSynth.play("click");
    startApothecaryGame();
  });

  // Ir para o Quiz a partir da Discussão
  document.getElementById("btn-proceed-to-quiz").addEventListener("click", () => {
    soundSynth.play("click");
    startQuiz(activeCase.moduleId);
  });

  // Próxima Pergunta do Quiz
  document.getElementById("btn-next-quiz-question").addEventListener("click", () => {
    soundSynth.play("click");
    nextQuizQuestion();
  });

  // Sair do Quiz/Desafio
  const exitQuizBtn = document.getElementById("btn-exit-quiz");
  if (exitQuizBtn) exitQuizBtn.addEventListener("click", exitQuiz);

  // Reiniciar caso em Game Over
  document.getElementById("btn-restart-case").addEventListener("click", () => {
    soundSynth.play("click");
    document.getElementById("modal-game-over").classList.remove("active");
    startCase(activeCase.moduleId);
  });

  // Voltar para Home de Game Over
  document.getElementById("btn-exit-game-over").addEventListener("click", () => {
    soundSynth.play("click");
    document.getElementById("modal-game-over").classList.remove("active");
    showScreen("screen-home");
  });

  // Fechar modais
  document.getElementById("btn-close-exam-modal").addEventListener("click", () => { soundSynth.play("click"); closeExamModal(); });
  document.getElementById("btn-confirm-exam-modal").addEventListener("click", () => { soundSynth.play("click"); closeExamModal(); });
  document.getElementById("btn-close-level-up").addEventListener("click", () => { soundSynth.play("click"); closeLevelUpModal(); });
  
  // Teclas direcionais e atalhos físicos
  document.addEventListener("keydown", (e) => {
    const homeScreen = document.getElementById("screen-home");
    const caseScreen = document.getElementById("screen-case");
    
    // Movimentação na Home (legado 2D — desativado quando o mundo 3D está ativo)
    if (!window.NutriWorld && homeScreen && homeScreen.classList.contains("active")) {
      const activeModals = document.querySelectorAll(".modal-overlay.active");
      if (activeModals.length > 0) return;

      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") { e.preventDefault(); movePlayer(0, -1); }
      else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") { e.preventDefault(); movePlayer(0, 1); }
      else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { e.preventDefault(); movePlayer(-1, 0); }
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { e.preventDefault(); movePlayer(1, 0); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); checkInteraction(); }
    }
    
    // Atalhos numéricos nas abas de prontuário (1 a 4)
    if (caseScreen && caseScreen.classList.contains("active")) {
      const activeModals = document.querySelectorAll(".modal-overlay.active");
      if (activeModals.length > 0) return;
      
      if (e.key === "1") { e.preventDefault(); document.querySelector('.tab-btn[data-tab="tab-anamnese"]').click(); }
      else if (e.key === "2") { e.preventDefault(); document.querySelector('.tab-btn[data-tab="tab-semiologia"]').click(); }
      else if (e.key === "3") { e.preventDefault(); document.querySelector('.tab-btn[data-tab="tab-exames"]').click(); }
      else if (e.key === "4") { e.preventDefault(); document.querySelector('.tab-btn[data-tab="tab-conduta"]').click(); }
    }
  });

  // Botão de Interagir (ao lado do joystick)
  const actionBtn = document.getElementById('dpad-action');
  if (actionBtn) actionBtn.addEventListener('click', () => { soundSynth.play('click'); checkInteraction(); });
}

// Exibir Tela
function showScreen(screenId) {
  const screens = document.querySelectorAll(".app-screen");
  screens.forEach(screen => screen.classList.remove("active"));
  
  const targetScreen = document.getElementById(screenId);
  targetScreen.classList.add("active");
  
  if (screenId === "screen-home") {
    renderHomeScreen();
  }
}

// Renderizar Tela Home
function renderHomeScreen() {
  updateCareerLevel();
  
  const levelData = nutriGameData.careerLevels[state.levelIndex];
  document.getElementById("home-career-title").textContent = levelData.title;
  document.getElementById("home-xp-value").textContent = state.xp;
  
  // Vidas Máximas com base no equipamento equipado
  let maxLives = 3;
  if (state.equippedItem) {
    const eq = LOOT_ITEMS[state.equippedItem];
    if (eq && eq.bonusType === "extra_life") maxLives = 3 + (eq.bonusVal || 1);
  }
  state.lives = Math.min(maxLives, state.lives);

  // Exibir corações
  let hearts = "";
  for (let i = 0; i < maxLives; i++) {
    hearts += i < state.lives ? "❤️" : "🖤";
  }
  document.getElementById("home-lives-value").textContent = hearts;

  // Progresso do Nível
  const nextLevelData = nutriGameData.careerLevels[state.levelIndex + 1];
  const currentThreshold = levelData.threshold;
  
  if (nextLevelData) {
    const nextThreshold = nextLevelData.threshold;
    const progressXp = state.xp - currentThreshold;
    const totalLevelXp = nextThreshold - currentThreshold;
    const progressPercent = Math.min(100, Math.max(0, (progressXp / totalLevelXp) * 100));
    
    document.getElementById("home-level-progress").style.width = `${progressPercent}%`;
    document.getElementById("home-progress-text").textContent = `${state.xp} / ${nextThreshold} XP`;
  } else {
    document.getElementById("home-level-progress").style.width = "100%";
    document.getElementById("home-progress-text").textContent = "Nível Máximo!";
  }

  // Atualizar objetivos da Quest
  updateQuestTracker();

  // Layout imersivo: inventário e ranking são janelas flutuantes (sempre prontas).
  // Mantém compatibilidade com o layout antigo em abas, se existir.
  const activeTabBtn = document.querySelector(".sub-tab-btn.active");
  if (activeTabBtn) {
    const activeSubTab = activeTabBtn.getAttribute("data-sub-tab");
    if (activeSubTab === "sub-tab-map") renderHospitalMap();
    else if (activeSubTab === "sub-tab-inventory") renderInventoryGrid();
    else if (activeSubTab === "sub-tab-leaderboard") renderLeaderboard();
  } else {
    renderInventoryGrid();
    renderLeaderboard();
  }

  renderSummaryShelf();

  // Sincroniza o estado dos leitos no mundo 3D
  if (window.NutriWorld) window.NutriWorld.refresh();
}

// Atualizar Rastreador de Quests
function updateQuestTracker() {
  const trackerText = document.getElementById("quest-item-text");
  if (!trackerText) return;
  
  const lastCompletedId = state.completedModules.length > 0 
    ? Math.max(...state.completedModules) 
    : 0;
    
  if (lastCompletedId === 0) {
    trackerText.textContent = "Fale com o Dr. Roberto (Preceptor) na ala central.";
  } else if (lastCompletedId < 8) {
    const nextLeito = lastCompletedId + 1;
    const nextMod = nutriGameData.modules.find(m => m.id === nextLeito);
    trackerText.textContent = `Atenda o paciente ${nextMod.case.patient.name} no Leito ${nextLeito}.`;
  } else {
    const ambDone = [9, 10, 11, 12].filter(id => state.completedModules.includes(id)).length;
    if (ambDone < 4) {
      trackerText.textContent = `Enfermaria dominada! Abra o Ambulatório 📋 no HUD e atenda os casos avançados (${ambDone}/4).`;
    } else {
      trackerText.textContent = "🎓 Você concluiu todos os 12 módulos! Use o Estudo Livre 🧠 para revisar.";
    }
  }
}

// Atualizar Nível de Carreira
function updateCareerLevel() {
  let newLevelIndex = 0;
  for (let i = 0; i < nutriGameData.careerLevels.length; i++) {
    if (state.xp >= nutriGameData.careerLevels[i].threshold) {
      newLevelIndex = i;
    }
  }
  
  if (newLevelIndex > state.levelIndex) {
    soundSynth.play("levelup");
    if (navigator.vibrate) navigator.vibrate([100, 100, 200]);
    
    const newTitle = nutriGameData.careerLevels[newLevelIndex].title;
    document.getElementById("modal-new-title").textContent = newTitle;
    document.getElementById("modal-level-up").classList.add("active");
  }
  
  state.levelIndex = newLevelIndex;
  saveToLocalStorage();
}

function closeLevelUpModal() {
  document.getElementById("modal-level-up").classList.remove("active");
  renderHomeScreen();
}

// ================= SISTEMA RPG HOSPITALAR 2.5D =================

// Desenhar o mapa 11x11 na grade HTML
function renderHospitalMap() {
  const gridContainer = document.getElementById("rpg-grid");
  if (!gridContainer) return;
  gridContainer.innerHTML = "";
  
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tile = hospitalMapLayout[y][x];
      const tileDiv = document.createElement("div");
      tileDiv.className = "rpg-tile";
      
      // Estilos de células de cenário
      if (tile === 1) {
        tileDiv.classList.add("tile-wall");
      } else if (tile === 0) {
        tileDiv.classList.add("tile-floor");
      } else if (tile === 3 || tile === "N") {
        tileDiv.classList.add("tile-nurse-station");
        tileDiv.textContent = tile === "N" ? "💼" : "";
      } else if (tile.startsWith("L")) {
        const moduleId = parseInt(tile.replace("L", ""));
        tileDiv.classList.add("tile-bed");
        
        const isCompleted = state.completedModules.includes(moduleId);
        const isAvailable = moduleId === 1 || state.completedModules.includes(moduleId - 1);
        
        if (isCompleted) {
          tileDiv.classList.add("completed");
          tileDiv.innerHTML = `<span class="bed-icon">🛏️</span>`;
        } else if (isAvailable) {
          tileDiv.classList.add("available");
          tileDiv.innerHTML = `<span class="bed-icon">🛌</span>`;
        } else {
          tileDiv.classList.add("locked");
          tileDiv.innerHTML = `<span class="bed-icon">🔒</span>`;
        }
      }
      
      // Renderizar Outros Jogadores Simulados
      if (x === camilaPos.x && y === camilaPos.y) {
        tileDiv.classList.remove("tile-floor");
        tileDiv.classList.add("tile-npc");
        
        tileDiv.innerHTML = `
          <div class="tile-shadow"></div>
          <div class="char-sprite">👩‍⚕️</div>
          <div class="rpg-nametag">Nutri Camila</div>
        `;
      } else if (x === thiagoPos.x && y === thiagoPos.y) {
        tileDiv.classList.remove("tile-floor");
        tileDiv.classList.add("tile-npc");
        
        tileDiv.innerHTML = `
          <div class="tile-shadow"></div>
          <div class="char-sprite">👨‍⚕️</div>
          <div class="rpg-nametag">Nutri Thiago</div>
        `;
      }
      // Renderizar NPCs estáticos
      else if (tile === "R") {
        tileDiv.classList.add("tile-npc");
        tileDiv.innerHTML = `
          <div class="tile-shadow"></div>
          <div class="char-sprite">👨‍⚕️</div>
          <div class="rpg-nametag">Dr. Roberto</div>
          <div class="rpg-health-bar"><div class="health-bar-fill npc-bar" style="width: 100%;"></div></div>
        `;
      } else if (tile === "C") {
        tileDiv.classList.add("tile-npc");
        tileDiv.innerHTML = `
          <div class="tile-shadow"></div>
          <div class="char-sprite">👩‍⚕️</div>
          <div class="rpg-nametag">Clara</div>
          <div class="rpg-health-bar"><div class="health-bar-fill npc-bar" style="width: 100%;"></div></div>
        `;
      } else if (tile === "L") {
        tileDiv.classList.add("tile-npc");
        tileDiv.innerHTML = `
          <div class="tile-shadow"></div>
          <div class="char-sprite">👨‍🔬</div>
          <div class="rpg-nametag">Lucas</div>
          <div class="rpg-health-bar"><div class="health-bar-fill npc-bar" style="width: 100%;"></div></div>
        `;
      }
      
      // Desenhar Player Principal (Sobreposto na coordenada atual)
      if (x === playerPos.x && y === playerPos.y) {
        tileDiv.classList.remove("tile-floor");
        tileDiv.classList.add("tile-player");
        
        // Barra de progresso de nível acima da cabeça do player
        let levelProgress = 50;
        const levelData = nutriGameData.careerLevels[state.levelIndex];
        const nextLevelData = nutriGameData.careerLevels[state.levelIndex + 1];
        if (nextLevelData) {
          levelProgress = ((state.xp - levelData.threshold) / (nextLevelData.threshold - levelData.threshold)) * 100;
        }
        
        tileDiv.innerHTML = `
          <div class="tile-shadow"></div>
          <div class="char-sprite" style="animation-delay: 0.2s;">👩‍⚕️</div>
          <div class="rpg-nametag" style="background-color: var(--primary-color);">Dra. Ana</div>
          <div class="rpg-health-bar"><div class="health-bar-fill" style="width: ${levelProgress}%;"></div></div>
        `;
      }
      
      tileDiv.addEventListener("click", () => {
        walkTo(x, y);
      });
      
      gridContainer.appendChild(tileDiv);
    }
  }
  
  // Atualizar coordenadas do HUD
  const hud = document.getElementById("rpg-hud-pos");
  if (hud) {
    hud.textContent = `📍 X:${playerPos.x} Y:${playerPos.y}`;
  }
}

// Verificar se o piso é livre para andar
function isWalkable(x, y) {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
  
  // Evitar andar em cima de outros personagens simulados
  if (x === camilaPos.x && y === camilaPos.y) return false;
  if (x === thiagoPos.x && y === thiagoPos.y) return false;
  
  const tile = hospitalMapLayout[y][x];
  return tile === 0;
}

// Obter leito ou NPC adjacente
function getAdjacentInteractiveTile() {
  const dx = [0, 0, -1, 1];
  const dy = [-1, 1, 0, 0];
  
  for (let i = 0; i < 4; i++) {
    const nx = playerPos.x + dx[i];
    const ny = playerPos.y + dy[i];
    
    if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
      const tile = hospitalMapLayout[ny][nx];
      if (tile !== 0 && tile !== 1) {
        return { type: tile, x: nx, y: ny };
      }
    }
  }
  return null;
}

// Busca de caminho BFS simples
function findPath(start, end) {
  const queue = [[start]];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const curr = path[path.length - 1];
    
    if (curr.x === end.x && curr.y === end.y) {
      return path.slice(1);
    }
    
    const dirs = [
      {x: 0, y: -1}, {x: 0, y: 1},
      {x: -1, y: 0}, {x: 1, y: 0}
    ];
    
    for (const dir of dirs) {
      const nx = curr.x + dir.x;
      const ny = curr.y + dir.y;
      const key = `${nx},${ny}`;
      
      if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT && !visited.has(key)) {
        const tile = hospitalMapLayout[ny][nx];
        // Caminhável se for floor, ou se for o leito/NPC de destino com o qual queremos interagir
        if (isWalkable(nx, ny) || (nx === end.x && ny === end.y)) {
          visited.add(key);
          queue.push([...path, {x: nx, y: ny}]);
        }
      }
    }
  }
  return null;
}

// Adiciona o brilho temporário de movimento no player
function triggerPlayerGlow() {
  const playerTile = document.querySelector(".tile-player");
  if (playerTile) {
    playerTile.classList.add("tile-player-glow");
    setTimeout(() => {
      playerTile.classList.remove("tile-player-glow");
    }, 500);
  }
}

// Caminhada animada até o local clicado
function walkTo(targetX, targetY) {
  if (moveInterval) clearInterval(moveInterval);
  
  const path = findPath(playerPos, { x: targetX, y: targetY });
  if (!path || path.length === 0) return;
  
  let stepIndex = 0;
  moveInterval = setInterval(() => {
    if (stepIndex >= path.length) {
      clearInterval(moveInterval);
      moveInterval = null;
      checkInteraction();
      return;
    }
    
    const nextStep = path[stepIndex];
    const tile = hospitalMapLayout[nextStep.y][nextStep.x];
    
    if (tile !== 0 || (nextStep.x === camilaPos.x && nextStep.y === camilaPos.y) || (nextStep.x === thiagoPos.x && nextStep.y === thiagoPos.y)) {
      clearInterval(moveInterval);
      moveInterval = null;
      checkInteraction();
      return;
    }
    
    playerPos.x = nextStep.x;
    playerPos.y = nextStep.y;
    soundSynth.play("click");
    renderHospitalMap();
    triggerPlayerGlow();
    stepIndex++;
  }, 120);
}

// Movimentação por botão/teclado
function movePlayer(dx, dy) {
  if (moveInterval) {
    clearInterval(moveInterval);
    moveInterval = null;
  }
  
  const nx = playerPos.x + dx;
  const ny = playerPos.y + dy;
  
  if (isWalkable(nx, ny)) {
    playerPos.x = nx;
    playerPos.y = ny;
    soundSynth.play("click");
    renderHospitalMap();
    triggerPlayerGlow();
  } else {
    const tile = hospitalMapLayout[ny]?.[nx];
    if (tile && tile !== 1 && tile !== 0) {
      checkInteraction();
    }
  }
}

// Programar movimentação de estudantes online simulados
function setupWanderingPlayers() {
  setInterval(() => {
    const mapPanel = document.getElementById("sub-tab-map");
    if (!mapPanel || !mapPanel.classList.contains("active")) return;
    
    const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
    
    // Mover Camila
    const dC = dirs[Math.floor(Math.random() * dirs.length)];
    const nCx = camilaPos.x + dC.x;
    const nCy = camilaPos.y + dC.y;
    if (isWalkable(nCx, nCy) && !(nCx === playerPos.x && nCy === playerPos.y) && !(nCx === thiagoPos.x && nCy === thiagoPos.y)) {
      camilaPos.x = nCx;
      camilaPos.y = nCy;
    }
    
    // Mover Thiago
    const dT = dirs[Math.floor(Math.random() * dirs.length)];
    const nTx = thiagoPos.x + dT.x;
    const nTy = thiagoPos.y + dT.y;
    if (isWalkable(nTx, nTy) && !(nTx === playerPos.x && nTy === playerPos.y) && !(nTx === camilaPos.x && nTy === camilaPos.y)) {
      thiagoPos.x = nTx;
      thiagoPos.y = nTy;
    }
    
    renderHospitalMap();
  }, 4000);
}

// Configurar Mensagens do Chat Global
const CHAT_MESSAGES = [
  { name: "Nutri Camila", msg: "Gente, quase matei a Júlia no leito 1 dando cafeína kkk preceptor me xingou demais" },
  { name: "Nutri Thiago", msg: "Consegui dropar o Jaleco Épico hoje! Alguém travado no leito 3 do Marcos?" },
  { name: "Nutri Letícia", msg: "A dica da saburra lingual que a Clara dá no posto salvou meu caso 2!" },
  { name: "Nutri Ju", msg: "Quem aí já estudou a mutação da MTHFR? O metilfolato é crucial!" },
  { name: "Nutri Pedro", msg: "Dr. Roberto pegou pesado comigo no quiz do fígado kkk" },
  { name: "Nutri Mariana", msg: "O Magnésio Quelado faz milagre nas cãibras do Pedro, passem no leito 5." },
  { name: "Nutri Bruno", msg: "Loot lendário dropa só com 3 estrelas?" },
  { name: "Nutri Carla", msg: "Cuidado: Sene é fitoterápico regulado, não prescrevam laxantes contínuos!" }
];

function setupGlobalChat() {
  const chatLog = document.getElementById("mmo-chat-log");
  if (!chatLog) return;
  
  chatLog.innerHTML = `<div class="chat-message"><span class="user-name">[Servidor]:</span> Bem-vindo ao canal de discussões da Pós-Graduação!</div>`;
  
  setInterval(() => {
    const homeScreen = document.getElementById("screen-home");
    if (!homeScreen || !homeScreen.classList.contains("active")) return;
    
    const randMsg = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message";
    msgDiv.innerHTML = `<span class="user-name">${randMsg.name}:</span> ${randMsg.msg}`;
    
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
  }, 12000);
}

// Verificar interação de leito ou equipe
function checkInteraction() {
  const adjacent = getAdjacentInteractiveTile();
  if (!adjacent) return;
  
  if (adjacent.type.startsWith("L")) {
    const moduleId = parseInt(adjacent.type.replace("L", ""));
    interactWithPatient(moduleId);
  } else {
    interactWithNPC(adjacent.type);
  }
}

// Falas de acompanhantes que questionam a conduta (preparam o "erro crítico" do caso)
const COMPANION_REMARKS = {
  1: { who: "Mãe da Júlia", text: "Doutora, ela só precisa de um energético e café mais forte pra render, né? Esses chás de planta funcionam mesmo?" },
  2: { who: "Esposa do Carlos", text: "Doutora, não era mais fácil dar um omeprazol? O vizinho toma e melhora a azia na hora." },
  3: { who: "Filha do Marcos", text: "Doutora, vi na internet que Kava-Kava é natural e forte pra ansiedade. Não dá pra receitar logo isso?" },
  5: { who: "Irmão do Pedro", text: "Doutora, cãibra não é só falta de potássio? Por que não manda ele encher de banana e potássio em cápsula?" },
  6: { who: "Marido da Mariana", text: "Doutora, ela não devia tomar logo a metformina que a prima toma pra emagrecer?" },
  8: { who: "Filho do Roberto", text: "Doutora, por que a senhora não receita logo aquela caneta de emagrecer que todo mundo está usando?" },
  11: { who: "Irmã da Beatriz", text: "Doutora, ouvi dizer que iodo cura tireoide. Não é só ela tomar bastante iodo?" },
  12: { who: "Mãe da Camila", text: "Doutora, pra regular a menstruação não é só tomar anticoncepcional? Por que tanto exame?" }
};

// Modal de interação do leito
function interactWithPatient(moduleId) {
  // Leitos do CTI usam o motor de plantão (cti.js), não o fluxo de módulo padrão.
  if (window.ctiCaseForBed && window.ctiCaseForBed(moduleId)) {
    window.startCtiCase(moduleId);
    return;
  }
  const mod = nutriGameData.modules.find(m => m.id === moduleId);
  if (!mod) return;
  
  const isCompleted = state.completedModules.includes(moduleId);
  // casos de setor (enteral) ficam sempre disponíveis; os demais seguem o encadeamento
  const isAvailable = moduleId === 1 || mod.enteral === true || state.completedModules.includes(moduleId - 1);
  
  const modal = document.getElementById("modal-npc-dialog");
  const avatar = document.getElementById("npc-dialog-avatar");
  const name = document.getElementById("npc-dialog-name");
  const text = document.getElementById("npc-dialog-text");
  const footer = document.getElementById("npc-dialog-buttons");
  
  avatar.textContent = mod.case.patient.avatar;
  name.textContent = `${mod.case.patient.name} (Leito ${moduleId})`;
  
  if (isCompleted) {
    text.textContent = `Olá, Dra. Ana! Muito obrigada pela sua conduta clínica. Graças ao seu tratamento de ${mod.subtitle}, estou ótima! Deseja refazer este caso para praticar?`;
    footer.innerHTML = `
      <button class="btn-primary" id="btn-start-case-now">Refazer Caso</button>
      <button class="btn-secondary" id="btn-close-dialog-btn">Fechar</button>
    `;
  } else if (isAvailable) {
    const comp = COMPANION_REMARKS[moduleId];
    const compHtml = comp
      ? `<div class="companion-remark"><span class="companion-who">🧑‍🤝‍🧑 ${comp.who} questiona:</span> “${comp.text}”</div>`
      : "";
    text.innerHTML = `Dra. Ana, que bom que veio! Minha queixa principal é: ${mod.case.patient.complaint}. Pode avaliar meu caso?${compHtml}`;
    footer.innerHTML = `
      <button class="btn-primary" id="btn-start-case-now">Iniciar Consulta</button>
      <button class="btn-secondary" id="btn-close-dialog-btn">Depois</button>
    `;
  } else {
    avatar.textContent = "🔒";
    name.textContent = `Leito ${moduleId} (Bloqueado)`;
    text.textContent = `Este leito está aguardando internação. Conclua os módulos anteriores da sua pós-graduação para desbloqueá-lo!`;
    footer.innerHTML = `
      <button class="btn-primary" id="btn-close-dialog-btn">Entendido</button>
    `;
  }
  
  modal.classList.add("active");
  
  document.getElementById("btn-close-dialog-btn").addEventListener("click", () => {
    soundSynth.play("click");
    modal.classList.remove("active");
  });
  
  const startBtn = document.getElementById("btn-start-case-now");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      soundSynth.play("click");
      modal.classList.remove("active");
      startCase(moduleId);
    });
  }
}

// Modal de interação com a equipe (NPCs)
function interactWithNPC(npcType) {
  const modal = document.getElementById("modal-npc-dialog");
  const avatar = document.getElementById("npc-dialog-avatar");
  const name = document.getElementById("npc-dialog-name");
  const text = document.getElementById("npc-dialog-text");
  const footer = document.getElementById("npc-dialog-buttons");
  
  let npcName = "";
  let npcAvatar = "";
  let npcText = "";
  
  const lastCompletedId = state.completedModules.length > 0 
    ? Math.max(...state.completedModules) 
    : 0;
    
  if (npcType === "R") {
    npcName = "Dr. Roberto (Preceptor)";
    npcAvatar = "👨‍⚕️";
    if (lastCompletedId === 0) {
      npcText = "Bem-vinda à enfermaria funcional, Ana! Sou o Dr. Roberto. Seu primeiro caso está no Leito 1. Vá examinar a Júlia. Dica de pro: equipar o Grimório no seu Inventário ativará dicas de exames gratuitas nos casos!";
    } else if (lastCompletedId === 1) {
      npcText = "Excelente conduta com a Júlia no Módulo 1! A modulação com adaptógenos foi perfeita. Agora o Carlos está no Leito 2. Investigue a disbiose gástrica dele.";
    } else if (lastCompletedId === 2) {
      npcText = "Ana, vi o prontuário do Carlos no Leito 2. Excelente! O Cloridrato de Betaína com Pepsina foi a chave para sanar a hipocloridria crônica. O Leito 3 aguarda.";
    } else if (lastCompletedId >= 3 && lastCompletedId < 5) {
      npcText = "Para os casos de disbiose intestinal, nunca se esqueça de recompor as junções celulares (tight junctions). A L-Glutamina é o melhor alimento dos enterócitos!";
    } else {
      npcText = "Seus diagnósticos bioquímicos no hospital são fantásticos, Ana! Continue aplicando os limites terapêuticos corretos do CFN.";
    }
  } else if (npcType === "C") {
    npcName = "Enf. Clara (Chefe da Ala)";
    npcAvatar = "👩‍⚕️";
    if (lastCompletedId === 0) {
      npcText = "Olá, Dra. Ana! A Júlia do Leito 1 está exausta. Ela relata extremidades sempre muito frias e cansaço mental à tarde. Isso me parece uma disfunção de cortisol.";
    } else if (lastCompletedId === 1) {
      npcText = "O Carlos no Leito 2 está com gases terríveis. Ele tem marcas de dentes nos lados da língua e unhas com estrias verticais. Esse exame físico grita hipocloridria!";
    } else if (lastCompletedId >= 2 && lastCompletedId < 5) {
      npcText = "Sempre fique de olho na semiologia! Unhas e língua dão pistas sobre carências de zinco, ferro e disbiose muito antes de aparecerem no hemograma.";
    } else {
      npcText = "A ala está tranquila sob sua supervisão gástrica e funcional. Monitore a insulina de jejum e o HOMA-IR dos pacientes da ala bioquímica (Leitos 5-8).";
    }
  } else if (npcType === "L") {
    npcName = "Farm. Lucas (Fitoterapia)";
    npcAvatar = "👨‍🔬";
    if (lastCompletedId < 2) {
      npcText = "Olá, Ana! Sou o Lucas, do almoxarifado farmacêutico. Lembre-se: fitoterapêuticos em cápsulas e tinturas são da nossa competência legal, mas nada de remédio tarja preta!";
    } else if (lastCompletedId === 2) {
      npcText = "Para o Marcos no Leito 3, a Cidreira (Melissa officinalis) padronizada em ácido rosmarínico será excelente. Ela acalma o SNC ao modular o receptor GABA-A.";
    } else if (lastCompletedId >= 3 && lastCompletedId < 6) {
      npcText = "Cuidado com interações: o Hipérico é um potente indutor do CYP3A4, reduzindo o efeito de vários fármacos. E a Kava-Kava está banida por risco hepático.";
    } else {
      npcText = "Para os pacientes da ala bioquímica, o Cardo Mariano (Silimarina) e a N-Acetilcisteína (NAC) são os precursores preferidos para a fase 2 de destoxificação.";
    }
  }
  
  avatar.textContent = npcAvatar;
  name.textContent = npcName;
  text.textContent = npcText;
  
  footer.innerHTML = `
    <button class="btn-primary" id="btn-close-dialog-btn">Entendido</button>
  `;
  
  modal.classList.add("active");
  
  document.getElementById("btn-close-dialog-btn").addEventListener("click", () => {
    soundSynth.play("click");
    modal.classList.remove("active");
  });
}

// Modal Customizado de Alerta (Substituto de alert())
function showAlert(title, message, icon = "⚠️", buttonText = "Entendido", onConfirm = null) {
  const modal = document.getElementById("modal-custom-alert");
  document.getElementById("modal-alert-title").textContent = title;
  document.getElementById("modal-alert-icon").textContent = icon;
  document.getElementById("modal-alert-body").innerHTML = `<p>${message.replace(/\n/g, "<br>")}</p>`;
  
  const btn = document.getElementById("modal-alert-btn");
  btn.textContent = buttonText;
  
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  
  newBtn.addEventListener("click", () => {
    soundSynth.play("click");
    modal.classList.remove("active");
    if (onConfirm) onConfirm();
  });
  
  modal.classList.add("active");
}

// ================= INVENTÁRIO & LOOT =================

// Renderizar Inventário de Equipamento
function renderInventoryGrid() {
  const grid = document.getElementById("inventory-grid");
  if (!grid) return;
  grid.innerHTML = "";
  
  const eq = equippedItem();
  const maxLives = maxLivesFromGear();
  const xpMultiplier = bonusOf("xp_multiplier", 1.0);
  const freeHints = (eq && eq.bonusType === "free_hints") ? "Ativado 🔬" : "Desativado 🔬";

  document.getElementById("attr-max-lives").textContent = `${maxLives} ❤️`;
  document.getElementById("attr-xp-bonus").textContent = `+${Math.round((xpMultiplier - 1)*100)}% ⚡`;
  document.getElementById("attr-free-hints").textContent = freeHints;
  // Bônus ativo do item equipado (linha extra, se o elemento existir)
  const equipEl = document.getElementById("attr-equip-bonus");
  if (equipEl) equipEl.textContent = eq ? `${eq.emoji} ${eq.bonusText}` : "Nenhum item equipado";

  // 12 slots no inventário (acomoda todos os itens)
  for (let i = 0; i < 12; i++) {
    const slot = document.createElement("div");
    slot.className = "inventory-slot";
    
    if (state.inventory && state.inventory[i]) {
      const itemId = state.inventory[i];
      const item = LOOT_ITEMS[itemId];
      slot.classList.add("has-item");
      
      if (state.equippedItem === itemId) {
        slot.classList.add("equipped");
      }
      
      slot.innerHTML = `
        <span>${item.emoji}</span>
        <span class="item-rarity-badge rarity-${item.rarity}">${item.rarity}</span>
      `;
      
      slot.addEventListener("click", () => {
        toggleEquipItem(itemId);
      });
    } else {
      slot.innerHTML = `<span style="font-size: 11px; opacity: 0.3;">Vazio</span>`;
    }
    grid.appendChild(slot);
  }
}

function toggleEquipItem(itemId) {
  soundSynth.play("click");
  if (state.equippedItem === itemId) {
    state.equippedItem = null;
    showAlert("Item Desequipado", "Você removeu o equipamento dos seus atributos.", "🎒");
  } else {
    state.equippedItem = itemId;
    const item = LOOT_ITEMS[itemId];
    showAlert("Item Equipado!", `Você equipou ${item.name}.\nBônus ativo: ${item.bonusText}`, "🛡️");
  }
  saveToLocalStorage();
  renderInventoryGrid();
}

// ================= MURAL DE LIDERANÇA =================
function renderLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  if (!list) return;
  list.innerHTML = "";
  
  const classmates = [
    { name: "Nutri Letícia", xp: 4200 },
    { name: "Nutri Thiago", xp: 3850 },
    { name: "Nutri Ana Luísa (Você)", xp: state.xp, isPlayer: true },
    { name: "Nutri Camila", xp: 2100 },
    { name: "Nutri Pedro", xp: 1500 }
  ];
  
  classmates.sort((a, b) => b.xp - a.xp);
  
  classmates.forEach((student, index) => {
    const row = document.createElement("div");
    row.className = `leaderboard-row ${student.isPlayer ? "player-row" : ""}`;
    
    let medal = `${index + 1}`;
    if (index === 0) medal = "🥇";
    else if (index === 1) medal = "🥈";
    else if (index === 2) medal = "🥉";
    
    row.innerHTML = `
      <div class="leaderboard-rank-name">
        <span class="leaderboard-position">${medal}</span>
        <span>${student.name}</span>
      </div>
      <span class="leaderboard-xp-tag">${student.xp} XP</span>
    `;
    list.appendChild(row);
  });
}

// ================= COLECIONÁVEIS CARDS =================
function renderSummaryShelf() {
  const grid = document.getElementById("summary-cards-grid");
  if (!grid) return;
  grid.innerHTML = "";

  nutriGameData.modules.forEach(mod => {
    const isUnlocked = state.completedModules.includes(mod.id);
    const card = document.createElement("div");
    card.className = `summary-shelf-card ${isUnlocked ? "unlocked" : "locked"}`;
    
    let icon = "🔒";
    if (isUnlocked) {
      const icons = {
        1: "🌿", 2: "🩺", 3: "🔬", 4: "🧪",
        5: "💊", 6: "📊", 7: "🧬", 8: "🏃"
      };
      icon = icons[mod.id] || "📚";
    }

    card.innerHTML = `
      <div class="summary-card-icon">${icon}</div>
      <div class="summary-card-title">${isUnlocked ? mod.subtitle : "Módulo Bloqueado"}</div>
    `;

    if (isUnlocked) {
      card.addEventListener("click", () => {
        soundSynth.play("click");
        openSummaryCardDetails(mod);
      });
    }

    grid.appendChild(card);
  });
}

function openSummaryCardDetails(mod) {
  showAlert(`Ficha: ${mod.subtitle}`, mod.discussion.text, "📚", "Fechar");
}

// ================= MINIJOGO DE ALQUIMIA CLÍNICA =================
let apothecaryPouredCount = 0;
let apothecaryTotalCount = 0;

function startApothecaryGame() {
  const mod = nutriGameData.modules.find(m => m.id === activeCase.moduleId);
  if (!mod) return;
  
  apothecaryTotalCount = activeCase.selectedPrescriptions.length;
  
  if (apothecaryTotalCount === 0) {
    showAlert("Prescrição Vazia", "Selecione pelo menos uma conduta antes de realizar a alquimia.", "⚠️");
    return;
  }
  
  const modal = document.getElementById("modal-apothecary-lab");
  const shelf = document.getElementById("apothecary-shelf-actives");
  const status = document.getElementById("apothecary-mix-status");
  const submitBtn = document.getElementById("btn-apothecary-submit");
  const beakerLiquid = document.getElementById("beaker-liquid");
  
  shelf.innerHTML = "";
  status.textContent = "Clique nas ampolas de ativos para vertê-las...";
  submitBtn.disabled = true;
  beakerLiquid.style.transform = "translateY(100%)";
  beakerLiquid.style.backgroundColor = "transparent";
  beakerLiquid.className = "beaker-body";
  
  apothecaryPouredCount = 0;
  
  activeCase.selectedPrescriptions.forEach((id, index) => {
    const opt = mod.case.prescription.options.find(o => o.id === id);
    if (!opt) return;
    
    const vial = document.createElement("div");
    vial.className = "vial-bottle";
    vial.id = `vial-${opt.id}`;
    
    const colors = ["🧪", "🧪", "🧪", "🧪", "🧪"];
    const colorEmoji = colors[index % colors.length];
    
    vial.innerHTML = `
      <div class="vial-glass">${colorEmoji}</div>
      <div class="vial-name">${opt.name}</div>
    `;
    
    vial.addEventListener("click", () => {
      pourVial(opt.id, vial);
    });
    
    shelf.appendChild(vial);
  });
  
  modal.classList.add("active");
  
  const newSubmitBtn = submitBtn.cloneNode(true);
  submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
  
  newSubmitBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    processPrescriptionValidation();
  });
}

function pourVial(optId, vialElement) {
  if (vialElement.classList.contains("poured")) return;
  
  vialElement.classList.add("poured");
  apothecaryPouredCount++;
  
  soundSynth.play("click");
  
  const beakerLiquid = document.getElementById("beaker-liquid");
  beakerLiquid.classList.add("filling");
  
  const fillPercentage = (apothecaryPouredCount / apothecaryTotalCount) * 100;
  beakerLiquid.style.transform = `translateY(${100 - fillPercentage}%)`;
  
  // Mistura de cores
  const colors = ["#805AD5", "#38A169", "#D69E2E", "#3182CE", "#E53E3E"];
  beakerLiquid.style.backgroundColor = colors[apothecaryPouredCount % colors.length];
  
  document.getElementById("apothecary-mix-status").textContent = `Homogeneizando ativos... (${apothecaryPouredCount}/${apothecaryTotalCount})`;
  
  if (apothecaryPouredCount === apothecaryTotalCount) {
    document.getElementById("apothecary-mix-status").textContent = "Mistura pronta para administração!";
    document.getElementById("btn-apothecary-submit").disabled = false;
    beakerLiquid.classList.remove("filling");
    soundSynth.play("success");
  }
}

// ================= SIMULAÇÃO DE CASO CLÍNICO =================
function startCase(moduleId) {
  const mod = nutriGameData.modules.find(m => m.id === moduleId);
  if (!mod) return;

  activeCase = {
    moduleId: moduleId,
    requestedExams: [],
    selectedPrescriptions: [],
    uselessExamsCount: 0,
    lives: 3
  };

  // Preencher prontuário
  document.getElementById("case-module-title").textContent = mod.subtitle;
  document.getElementById("case-patient-name").textContent = mod.case.patient.name;
  document.getElementById("case-patient-avatar").textContent = mod.case.patient.avatar;
  document.getElementById("patient-avatar-large").textContent = mod.case.patient.avatar;
  
  // Anamnese
  document.getElementById("p-name").textContent = mod.case.patient.name;
  document.getElementById("p-age").textContent = mod.case.patient.age;
  document.getElementById("p-occ").textContent = mod.case.patient.occupation;
  document.getElementById("p-complaint").textContent = mod.case.patient.complaint;
  document.getElementById("p-anamnese").textContent = mod.case.anamnese;

  // Semiologia
  const semiologyContainer = document.getElementById("p-semiologia-text");
  semiologyContainer.innerHTML = "";
  const findings = parseSemiologyFindings(mod.case.semiologia || mod.case.semiology || "");
  findings.forEach(find => {
    semiologyContainer.innerHTML += `
      <div class="semiology-item">
        <span class="semiology-icon">${find.icon}</span>
        <div class="semiology-label">
          <strong>${find.title}</strong>
          <span>${find.desc}</span>
        </div>
      </div>
    `;
  });

  // Exames
  renderExamsGrid(mod.case.investigation.options);
  updateExamsLimitText();

  // Prescrições
  renderPrescriptionsGrid(mod.case.prescription.options);

  // Vidas com base no item equipado
  let maxLives = 3;
  if (state.equippedItem) {
    const eq = LOOT_ITEMS[state.equippedItem];
    if (eq && eq.bonusType === "extra_life") maxLives = 3 + (eq.bonusVal || 1);
  }
  activeCase.lives = maxLives;
  updateCaseLivesDisplay();

  // Se tiver o Grimório de Fitoterapia equipado, dar dica inicial
  if (state.equippedItem) {
    const eq = LOOT_ITEMS[state.equippedItem];
    if (eq && eq.bonusType === "free_hints") {
      setTimeout(() => {
        const correctExam = mod.case.investigation.options.find(o => o.needed);
        showAlert("Dica de Grimório!", `Seu Grimório de Fitoterapia revela uma pista:\nO exame '${correctExam.name}' é necessário neste caso.`, "📚");
      }, 600);
    }
  }

  // Forçar primeira aba
  document.querySelector('.tab-btn[data-tab="tab-anamnese"]').click();

  showScreen("screen-case");
}

function parseSemiologyFindings(semiologyText) {
  const findings = [];
  const textLower = semiologyText.toLowerCase();
  
  if (textLower.includes("unha")) {
    let desc = "Unhas frágeis com estrias e descamação distal.";
    if (textLower.includes("longitudinal") || textLower.includes("vertical")) {
      desc = "Unhas com estrias verticais marcadas (sinal físico de hipocloridria e má absorção).";
    }
    findings.push({ icon: "💅", title: "Unhas (Semiologia Gástrica/Mineral)", desc: desc });
  }
  
  if (textLower.includes("cabelo")) {
    findings.push({ icon: "💇‍♀️", title: "Cabelos (Saúde do Folículo)", desc: "Cabelos finos, opacos, com queda acentuada ao toque (carência de ferro/zinco)." });
  }
  
  if (textLower.includes("extremidade") || textLower.includes("fria")) {
    findings.push({ icon: "❄️", title: "Extremidades (Termorregulação)", desc: "Mãos e pés frios (indicativo de baixa conversão tireoidiana ou hipocortisolismo)." });
  }

  if (textLower.includes("língua") || textLower.includes("saburra")) {
    let desc = "Língua com saburra branca e espessa central (indicação de disbiose intestinal).";
    if (textLower.includes("marca")) {
      desc = "Língua edemaciada com saburra esbranquiçada e marcas de dentes laterais (retenção hídrica/tireoide).";
    }
    findings.push({ icon: "👅", title: "Língua (Mucosa e Disbiose)", desc: desc });
  }

  if (textLower.includes("pele") || textLower.includes("seco")) {
    findings.push({ icon: "🧴", title: "Pele (Ácidos Graxos / Hidratação)", desc: "Pele seca e áspera, especialmente nos cotovelos e membros." });
  }

  if (textLower.includes("abdômen") || textLower.includes("dor") || textLower.includes("distend")) {
    findings.push({ icon: "🤢", title: "Abdômen (Palpação)", desc: "Visivelmente distendido, timpanizado e dolorido à palpação profunda." });
  }

  if (textLower.includes("acne") || textLower.includes("mandíbula") || textLower.includes("acantose")) {
    let title = "Pele Mandibular (Hormonal)";
    let desc = "Acne inflamatória ativa na região da mandíbula.";
    if (textLower.includes("acantose")) {
      title = "Pele (Resistência Insulínica)";
      desc = "Placas aveludadas hiperpigmentadas escurecidas no pescoço/axilas (Acantose nigricans).";
    }
    findings.push({ icon: "✨", title: title, desc: desc });
  }

  if (findings.length === 0) {
    findings.push({ icon: "🩺", title: "Exame Físico Geral", desc: semiologyText });
  }

  return findings;
}

// Desenhar exames
function renderExamsGrid(options) {
  const container = document.getElementById("exams-selection-grid");
  if (!container) return;
  container.innerHTML = "";

  options.forEach(exam => {
    const isRequested = activeCase.requestedExams.includes(exam.id);
    const row = document.createElement("div");
    row.className = `exam-item-row ${isRequested ? "requested" : ""}`;
    row.id = `exam-row-${exam.id}`;

    row.innerHTML = `
      <span class="exam-name">${exam.name}</span>
      <button class="btn-request-exam ${isRequested ? "requested" : ""}" id="btn-exam-${exam.id}">
        ${isRequested ? "Visualizar" : "Solicitar"}
      </button>
    `;

    row.querySelector("button").addEventListener("click", () => {
      requestExam(exam.id, options);
    });

    container.appendChild(row);
  });
}

function updateExamsLimitText() {
  const mod = nutriGameData.modules.find(m => m.id === activeCase.moduleId);
  const limit = mod.case.investigation.limit + examLimitBonus();
  const requested = activeCase.requestedExams.filter(id => {
    const exam = mod.case.investigation.options.find(o => o.id === id);
    return exam && !exam.needed;
  }).length;

  document.getElementById("exames-limit-text").textContent =
    `Limite de exames desnecessários sem penalidade: ${requested} / ${limit}`;
}

// Solicitar Exame
function requestExam(examId, options) {
  const exam = options.find(o => o.id === examId);
  if (!exam) return;

  if (!activeCase.requestedExams.includes(examId)) {
    activeCase.requestedExams.push(examId);

    if (!exam.needed) {
      const mod = nutriGameData.modules.find(m => m.id === activeCase.moduleId);
      activeCase.uselessExamsCount++;
      
      if (activeCase.uselessExamsCount > mod.case.investigation.limit + examLimitBonus()) {
        deductLife("Excesso de exames desnecessários e custos laboratoriais inviáveis.");
        if (activeCase.lives <= 0) return;
      }
    }
    
    renderExamsGrid(options);
    updateExamsLimitText();
  }

  openExamModal(exam);
}

function openExamModal(exam) {
  document.getElementById("modal-exam-title").textContent = exam.name;
  document.getElementById("modal-exam-value").textContent = exam.result;
  document.getElementById("modal-exam-feedback").textContent = exam.feedback;
  
  let rangesText = "";
  if (exam.id === "cortisol") {
    rangesText = "Referência do Laboratório: Manhã (3.7 a 9.5 ng/mL) | Noite (< 1.0 ng/mL).\n\nIdeal Funcional: Curva equilibrada e robusta de manhã decaindo suavemente à noite. Júlia apresenta curva deprimida de manhã e ativação à noite (ritmo invertido).";
  } else if (exam.id === "ferritin") {
    rangesText = "Referência do Laboratório: 10 a 150 ng/dL.\n\nIdeal Funcional: > 70 ng/dL para mulheres férteis. Níveis abaixo de 30 indicam depleção severa de ferro mitocondrial celular.";
  } else if (exam.id === "tsh") {
    rangesText = "Referência do Laboratório: 0.45 a 4.5 mUI/L.\n\nIdeal Funcional: 1.0 a 2.0 mUI/L. Valor de 3.8 indica fadiga tireoidiana e hipotireoidismo subclínico funcional.";
  } else if (exam.id === "magnesium_erythrocyte") {
    rangesText = "Referência do Laboratório: 1.8 a 2.6 mg/dL (sérico).\n\nIdeal Funcional (Intraeritrocitário): > 5.5 mg/dL. Valores de 3.8 indicam depleção tissular de magnésio.";
  } else if (exam.id === "insulin_fasting") {
    rangesText = "Referência do Laboratório: 2.0 a 20.0 uUI/mL.\n\nIdeal Funcional: 2.0 a 6.0 uUI/mL. Valores de 14.0 uUI/mL indicam hiperinsulinemia compensatória e bloqueio de oxidação lipídica.";
  } else if (exam.id === "crp_ultrasensitive") {
    rangesText = "Referência do Laboratório: < 5.0 mg/L.\n\nIdeal Funcional: < 1.0 mg/L. Nível de 3.4 mg/L indica inflamação subclínica ativa induzida por leakygut.";
  } else if (exam.id === "homocysteine") {
    rangesText = "Referência do Laboratório: 5.0 a 15.0 mcmol/L.\n\nIdeal Funcional: < 9.0 mcmol/L. O valor de 17.5 aponta para séria disfunção do ciclo de metilação (bloqueio metabólico de folato).";
  } else {
    rangesText = "Valores de Referência Médicos e Clínicos convencionais. O ideal funcional busca faixas ideais para máxima vitalidade celular.";
  }
  document.getElementById("modal-exam-ranges").textContent = rangesText;

  document.getElementById("modal-exam-result").classList.add("active");
}

function closeExamModal() {
  document.getElementById("modal-exam-result").classList.remove("active");
}

// Formata a prescrição de dieta enteral: volume total + vazão em ml/h (regra clínica).
// Ex.: formatEnteralRx(500, 24) -> "500 ml total · infundir em 24 h = 21 ml/h"
function formatEnteralRx(totalMl, hours) {
  const rate = Math.round(totalMl / hours);
  return `${totalMl} ml total · infundir em ${hours} h = ${rate} ml/h`;
}

// Desenhar lista de condutas
function renderPrescriptionsGrid(options) {
  const container = document.getElementById("prescription-selection-grid");
  if (!container) return;
  container.innerHTML = "";

  // Lembrete de alçada profissional (regras clínicas globais)
  const note = document.createElement("p");
  note.className = "alcada-note";
  note.style.cssText = "grid-column:1/-1; font-size:.78rem; line-height:1.35; color:#7A0043; background:rgba(122,0,67,.06); border:1px solid rgba(122,0,67,.18); padding:8px 10px; border-radius:8px; margin:0 0 8px;";
  note.innerHTML = "⚠️ <strong>Sua alçada:</strong> o nutricionista <u>não</u> prescreve dieta <strong>parenteral</strong> nem <strong>soro glicosado</strong> (conduta médica). Ao indicar fórmula <strong>enteral</strong>, informe o volume total e a vazão (ml/h).";
  container.appendChild(note);

  options.forEach(opt => {
    const isSelected = activeCase.selectedPrescriptions.includes(opt.id);
    const card = document.createElement("label");
    card.className = `prescription-card-checkbox ${isSelected ? "selected" : ""}`;

    const rxTag = opt.enteralRx
      ? ` <em style="color:#1f7a4d; font-style:normal;">— 💧 ${formatEnteralRx(opt.enteralRx.totalMl, opt.enteralRx.hours)}</em>`
      : "";
    card.innerHTML = `
      <input type="checkbox" value="${opt.id}" ${isSelected ? "checked" : ""}>
      <span>${opt.name}${rxTag}</span>
    `;

    const checkbox = card.querySelector("input");
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        activeCase.selectedPrescriptions.push(opt.id);
      } else {
        activeCase.selectedPrescriptions = activeCase.selectedPrescriptions.filter(id => id !== opt.id);
      }
      card.classList.toggle("selected", checkbox.checked);
    });

    container.appendChild(card);
  });
}

function updateCaseLivesDisplay() {
  let display = "";
  let maxLives = 3;
  if (state.equippedItem) {
    const eq = LOOT_ITEMS[state.equippedItem];
    if (eq && eq.bonusType === "extra_life") maxLives = 3 + (eq.bonusVal || 1);
  }
  
  for (let i = 0; i < maxLives; i++) {
    display += i < activeCase.lives ? "❤️" : "🖤";
  }
  document.getElementById("case-lives-display").textContent = display;
}

// Penalização clínica
function deductLife(reason) {
  activeCase.lives--;
  updateCaseLivesDisplay();
  
  soundSynth.play("error");
  if (navigator.vibrate) navigator.vibrate([150]);
  
  showAlert("Penalidade Clínica", `Você perdeu uma vida devido a:\n\n${reason}`, "⚠️", "Ok", () => {
    if (activeCase.lives <= 0) {
      document.getElementById("modal-game-over").classList.add("active");
    }
  });
}

// Submeter Prescrição após Alquimia
function processPrescriptionValidation() {
  const mod = nutriGameData.modules.find(m => m.id === activeCase.moduleId);
  if (!mod) return;

  const prescOptions = mod.case.prescription.options;
  
  let committedCriticalError = false;
  let criticalErrorText = "";

  activeCase.selectedPrescriptions.forEach(id => {
    const option = prescOptions.find(o => o.id === id);
    if (!option) return;
    // Regra de alçada: nutricionista não prescreve parenteral nem soro glicosado.
    if (option.forbidden) {
      committedCriticalError = true;
      criticalErrorText = option.forbidden === "parenteral"
        ? "Dieta PARENTERAL é prescrição MÉDICA. O nutricionista avalia, sugere e acompanha a NP — mas não a prescreve. Conduta fora da sua alçada profissional."
        : "SORO GLICOSADO (glicose/hidratação endovenosa) é prescrição MÉDICA, fora da alçada do nutricionista.";
    } else if (!option.correct && option.critical) {
      committedCriticalError = true;
      criticalErrorText = option.feedback;
    }
  });

  if (committedCriticalError) {
    deductLife(`Conduta Insegura / Erro Crítico:\n${criticalErrorText}`);
    return;
  }

  const correctOptions = prescOptions.filter(o => o.correct);
  const correctIds = correctOptions.map(o => o.id);
  
  const allCorrectSelected = correctIds.every(id => activeCase.selectedPrescriptions.includes(id));
  
  const incorrectSelected = activeCase.selectedPrescriptions.filter(id => {
    const opt = prescOptions.find(o => o.id === id);
    return opt && !opt.correct;
  });

  if (!allCorrectSelected || incorrectSelected.length > 0) {
    deductLife("Conduta incompleta ou com ativos desnecessários para o diagnóstico funcional.");
    return;
  }

  winCase();
}

// Conclusão com Sucesso do Caso e Drop de Loot
function winCase() {
  const mod = nutriGameData.modules.find(m => m.id === activeCase.moduleId);
  
  // Estrelas baseadas nas vidas perdidas (robusto a itens que aumentam vidas)
  const livesLost = maxLivesFromGear() - activeCase.lives;
  let stars, scoreMsg, xpBonus;
  if (livesLost <= 0) {
    stars = "⭐⭐⭐";
    scoreMsg = "Conduta Impecável! Você demonstrou excelente raciocínio ortomolecular e fitoterapêutico.";
    xpBonus = 200;
  } else if (livesLost === 1) {
    stars = "⭐⭐";
    scoreMsg = "Boa Conduta! Apenas evite exames redundantes ou pequenas incoerências terapêuticas.";
    xpBonus = 150;
  } else {
    stars = "⭐";
    scoreMsg = "Caso Concluído. Mas preste mais atenção para evitar reações adversas e excessos laboratoriais.";
    xpBonus = 100;
  }

  const finalXp = Math.round(xpBonus * bonusOf("xp_multiplier", 1.0));
  state.xp += finalXp;
  state.lives = Math.min(maxLivesFromGear(), state.lives + 1); // Recupera uma vida global

  if (!state.unlockedCards.includes(mod.id)) {
    state.unlockedCards.push(mod.id);
  }

  // Estatísticas: estrelas do caso
  const starCount = (stars.match(/⭐/g) || []).length;
  if (starCount === 3) state.stats.threeStarCases++;
  const pm = getModuleStats(mod.id);
  pm.bestStars = Math.max(pm.bestStars || 0, starCount);

  saveToLocalStorage();
  soundSynth.play("success");

  // Lógica de Drop de Loot — chance e raridade.
  // Casos com 3 estrelas têm chance maior de drop e de itens raros.
  if (!state.inventory) state.inventory = [];
  const lootDropText = rollLootDrop(starCount);

  document.getElementById("discussion-stars").textContent = stars;
  document.getElementById("discussion-status-title").textContent = scoreMsg;
  document.getElementById("discussion-score-detail").textContent = `Você somou +${finalXp} XP!${lootDropText}`;
  document.getElementById("discussion-text").innerHTML = `<p>${mod.case.discussion.text}</p>`;
  const refEl = document.getElementById("discussion-reference");
  if (refEl) refEl.textContent = (nutriGameData.referencias && nutriGameData.referencias[mod.id]) || "Este caso consolida os conteúdos das apostilas e slides da sua pós-graduação.";

  checkAchievements();
  if (stars === "⭐⭐⭐") spawnParticles("win");
  showScreen("screen-discussion");
}

// ================= QUIZ E COMBATE CONTRA BOSS =================
let quizQuestions = [];
let currentQuizQuestionIndex = 0;

const BOSS_NAMES = {
  1: "Lorde do Estresse Adrenal",
  2: "Devorador de Ácido Gástrico",
  3: "Rei das Cólicas Digestivas",
  4: "Espectro da Gordura Hepática",
  5: "Monstro da Depleção Mitocondrial",
  6: "Glúten Gigante da Resistência Insulínica",
  7: "Espectro do Bloqueio de Metilação",
  8: "Lorde da Gordura Visceral",
  9: "Colônia do Supercrescimento (SIBO)",
  10: "Vírus da Imunidade Baixa",
  11: "Sombra Autoimune da Tireoide",
  12: "Tempestade Hormonal Androgênica",
  13: "Uremia Implacável (DRC em Diálise)",
  14: "Devorador Caquético (Câncer)",
  15: "Tempestade Catabólica do Trauma",
  16: "Guardião da Disfagia (AVC)",
  17: "Praga da Diarreia Enteral"
};

const BOSS_DAMAGE = 50; // dano por acerto

// quizMode: 'case' (fluxo normal, perde vida ao errar) | 'study' (revisão, sem perder vida)
//           | 'review' (repetição espaçada) | 'simulado' (prova cronometrada mista)
let quizMode = "case";
let quizWrongThisRun = 0;
let quizReviewModuleId = null; // módulo "dono" do quiz em estudo (para nomear o boss/stats)
let quizRunWrong = [];         // questões erradas nesta rodada (para o resumo final)

function startQuiz(moduleId, mode = "case") {
  const mod = nutriGameData.modules.find(m => m.id === moduleId);
  if (!mod || !mod.quiz) {
    if (mode === "case") finishModule();
    return;
  }

  quizMode = mode;
  quizWrongThisRun = 0;
  quizRunWrong = [];
  quizReviewModuleId = moduleId;
  // Cada questão carrega sua origem (módulo + índice) p/ repetição espaçada
  quizQuestions = mod.quiz.map((q, i) => Object.assign({}, q, { _m: moduleId, _qi: i }));
  currentQuizQuestionIndex = 0;
  state.quizXpEarned = 0;

  setupBossBar(BOSS_NAMES[moduleId] || "Monstro Clínico", quizQuestions.length);
  renderQuizQuestion();
  showScreen("screen-quiz");
}

// HP do boss escala com o número de questões (todas o derrubam ao serem acertadas)
function setupBossBar(name, numQuestions) {
  maxBossHP = Math.max(numQuestions, 1) * BOSS_DAMAGE;
  bossHP = maxBossHP;
  document.getElementById("quiz-boss-name").textContent = name;
  document.getElementById("quiz-boss-hp").style.width = "100%";
  document.getElementById("quiz-boss-hp-text").textContent = `HP: ${maxBossHP} / ${maxBossHP}`;
}

function renderQuizQuestion() {
  const q = quizQuestions[currentQuizQuestionIndex];
  
  document.getElementById("quiz-counter").textContent = `Pergunta ${currentQuizQuestionIndex + 1} de ${quizQuestions.length}`;
  const progressPercent = ((currentQuizQuestionIndex + 1) / quizQuestions.length) * 100;
  document.getElementById("quiz-progress-fill").style.width = `${progressPercent}%`;

  document.getElementById("quiz-question-text").textContent = q.question;

  const optionsGrid = document.getElementById("quiz-options-grid");
  optionsGrid.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option-btn";
    btn.innerHTML = `
      <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
      <span>${opt}</span>
    `;
    
    btn.addEventListener("click", () => {
      selectQuizOption(idx, btn);
    });

    optionsGrid.appendChild(btn);
  });

  document.getElementById("quiz-explanation-box").className = "quiz-explanation-box hidden";
  document.getElementById("btn-next-quiz-question").classList.add("hidden");

  // Resetar scroll da tela do quiz
  const quizWrapper = document.getElementById("quiz-content-wrapper");
  if (quizWrapper) {
    quizWrapper.scrollTop = 0;
  }
}

function selectQuizOption(selectedIdx, btnElement) {
  const q = quizQuestions[currentQuizQuestionIndex];
  
  const btns = document.querySelectorAll(".quiz-option-btn");
  btns.forEach(btn => btn.disabled = true);

  const isCorrect = selectedIdx === q.correct;
  btnElement.classList.add(isCorrect ? "correct" : "wrong");

  const bossBar = document.getElementById("quiz-boss-container");
  const quizWrapper = document.getElementById("quiz-content-wrapper");

  // Estatísticas e repetição espaçada (em todos os modos)
  state.stats.quizAnswered++;
  if (isCorrect) {
    state.stats.quizCorrect++;
    clearReviewItem(q._m, q._qi);   // acertou → remove da fila de revisão
  } else {
    quizWrongThisRun++;
    addReviewItem(q._m, q._qi);     // errou → marca para revisar depois
    quizRunWrong.push({ question: q.question, correct: q.options[q.correct], explanation: q.explanation });
  }

  if (isCorrect) {
    // Acerto: Dano no Boss!
    bossHP = Math.max(0, bossHP - bossDamage());
    soundSynth.play("success");
    spawnParticles("hit");

    // Animação de dano no Boss (hit flash)
    bossBar.classList.add("hit-flash");
    setTimeout(() => {
      bossBar.classList.remove("hit-flash");
    }, 300);

    document.getElementById("quiz-boss-hp").style.width = `${(bossHP / maxBossHP) * 100}%`;
    document.getElementById("quiz-boss-hp-text").textContent = `HP: ${bossHP} / ${maxBossHP}`;

    // Ganho de XP por acerto (bônus de item de quiz_xp)
    state.quizXpEarned += Math.round(50 * bonusOf("quiz_xp", 1.0));
  } else {
    // Erro: O boss contra-ataca!
    btns[q.correct].classList.add("correct");

    soundSynth.play("error");
    if (navigator.vibrate) navigator.vibrate([150]);

    // Tremor na tela
    quizWrapper.classList.add("shake-effect");
    setTimeout(() => {
      quizWrapper.classList.remove("shake-effect");
    }, 250);

    // Só perde vida no fluxo de CASO clínico. No Estudo Livre/Revisão não há penalidade.
    if (quizMode === "case") {
      activeCase.lives--;
      if (activeCase.lives <= 0) {
        saveToLocalStorage();
        setTimeout(() => {
          document.getElementById("modal-game-over").classList.add("active");
        }, 600);
        return;
      }
    }
  }
  saveToLocalStorage();

  const explBox = document.getElementById("quiz-explanation-box");
  explBox.className = `quiz-explanation-box animate-fade ${isCorrect ? "correct-style" : "wrong-style"}`;
  document.getElementById("quiz-explanation-title").textContent = isCorrect ? "Ataque Crítico! Acerto Clínico!" : "O Chefe Bloqueou! Erro Clínico:";
  document.getElementById("quiz-explanation-text-content").textContent = q.explanation;

  document.getElementById("btn-next-quiz-question").classList.remove("hidden");
}

function nextQuizQuestion() {
  currentQuizQuestionIndex++;

  if (currentQuizQuestionIndex < quizQuestions.length) {
    renderQuizQuestion();
  } else if (quizMode === "case") {
    finishModule();
  } else if (quizMode === "simulado") {
    finishSimulado(false);
  } else {
    finishStudyQuiz();
  }
}

// Monta o HTML do resumo de erros da rodada de quiz
function wrongSummaryHTML() {
  if (quizRunWrong.length === 0) {
    return `<p class="quiz-summary-perfect">✅ Você não errou nenhuma questão. Excelente!</p>`;
  }
  let h = `<div class="wrong-summary"><p class="ws-head">📌 Revise estas ${quizRunWrong.length} questões:</p>`;
  quizRunWrong.forEach(w => {
    h += `<div class="wrong-item">
      <p class="wq">${w.question}</p>
      <p class="wa">✔️ <b>${w.correct}</b></p>
      <p class="we">${w.explanation}</p>
    </div>`;
  });
  h += `</div>`;
  return h;
}

// Sair do quiz (confirma e volta para a enfermaria)
function exitQuiz() {
  soundSynth.play("click");
  showAlert("Sair do desafio?", "Seu progresso neste quiz não será salvo. Deseja realmente sair?", "❓", "Sair", () => {
    stopSimTimer();
    showScreen("screen-home");
  });
}

// Conclusão total (fluxo de caso clínico)
function finishModule() {
  const moduleId = activeCase.moduleId;

  if (!state.completedModules.includes(moduleId)) {
    state.completedModules.push(moduleId);
  }

  // Estatísticas por módulo
  const pm = getModuleStats(moduleId);
  pm.completions = (pm.completions || 0) + 1;
  pm.quizCorrect = (state.quizXpEarned / 50) | 0; // acertos deste boss
  pm.quizTotal = quizQuestions.length;

  state.xp += state.quizXpEarned;
  state.lives = 3; // Restaura vidas globais

  // Conquista: derrotou o boss sem errar nenhuma questão
  if (quizWrongThisRun === 0) unlockAchievement("boss_perfeito");

  saveToLocalStorage();
  soundSynth.play("levelup");
  checkAchievements();

  // Define o próximo destino e o rótulo do botão (resolve "não passou para o próximo paciente")
  const isBed = moduleId >= 1 && moduleId <= 8;
  const nextBed = moduleId + 1;
  let nextMsg, btnLabel, onConfirm;
  if (isBed && nextBed <= 8) {
    nextMsg = `O <b>Leito ${nextBed}</b> já está liberado e o próximo paciente aguarda a Dra. Ana!`;
    btnLabel = "Atender o próximo paciente →";
    onConfirm = () => { showScreen("screen-home"); setTimeout(() => interactWithPatient(nextBed), 250); };
  } else if (moduleId === 8) {
    nextMsg = "Você concluiu toda a enfermaria! O <b>Ambulatório de Casos Avançados</b> e a <b>Terapia Nutricional Enteral</b> estão liberados no HUD.";
    btnLabel = "Abrir Ambulatório →";
    onConfirm = () => { showScreen("screen-home"); setTimeout(() => openHudWindow("win-ambulatorio"), 250); };
  } else {
    nextMsg = "Excelente conduta! Veja os próximos casos no Ambulatório (HUD).";
    btnLabel = "Voltar ao Ambulatório →";
    onConfirm = () => { showScreen("screen-home"); setTimeout(() => openHudWindow("win-ambulatorio"), 250); };
  }

  showAlert("Chefe Derrotado!",
    `<p>Você derrotou o <b>${BOSS_NAMES[moduleId] || "Boss Clínico"}</b> e ganhou <b>+${state.quizXpEarned} XP</b>!</p><p>${nextMsg}</p>${wrongSummaryHTML()}`,
    "🏆", btnLabel, onConfirm);
}

// Conclusão do quiz no Modo Estudo Livre / Revisão (sem alterar progresso do módulo)
function finishStudyQuiz() {
  const total = quizQuestions.length;
  const acertos = total - quizWrongThisRun;
  // XP de revisão reduzido (incentivo, sem inflar o ranking)
  const reviewXp = acertos * 10;
  state.xp += reviewXp;
  state.stats.studyReviews++;

  saveToLocalStorage();
  soundSynth.play(quizWrongThisRun === 0 ? "levelup" : "success");
  checkAchievements();

  const titulo = quizMode === "review" ? "Revisão de Erros concluída!" : "Revisão concluída!";
  const restante = state.review.length;
  const extra = quizMode === "review"
    ? `<p>Questões ainda na fila de revisão: <b>${restante}</b>.</p>`
    : "";

  showAlert(titulo,
    `<p>Você acertou <b>${acertos} de ${total}</b> questões e ganhou <b>+${reviewXp} XP</b> de estudo.</p>${extra}${wrongSummaryHTML()}`,
    "🧠", "Voltar", () => {
      showScreen("screen-home");
      openHudWindow("win-estudo");
    });
}

// ================= ESTATÍSTICAS & REPETIÇÃO ESPAÇADA =================
function getModuleStats(id) {
  if (!state.stats.perModule[id]) {
    state.stats.perModule[id] = { completions: 0, bestStars: 0, quizCorrect: 0, quizTotal: 0 };
  }
  return state.stats.perModule[id];
}

const reviewKey = (m, qi) => `${m}:${qi}`;
function addReviewItem(m, qi) {
  if (m == null || qi == null) return;
  const k = reviewKey(m, qi);
  if (!state.review.includes(k)) state.review.push(k);
}
function clearReviewItem(m, qi) {
  if (m == null || qi == null) return;
  const k = reviewKey(m, qi);
  state.review = state.review.filter(r => r !== k);
}

// ================= OFENSIVA DE ESTUDO DIÁRIO (STREAK) =================
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function updateDailyStreak() {
  const today = todayKey();
  const st = state.streak;
  if (st.lastDay === today) return; // já contou hoje

  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  const yestKey = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, "0")}-${String(yest.getDate()).padStart(2, "0")}`;

  if (st.lastDay === yestKey) st.count = (st.count || 0) + 1; // dia consecutivo
  else st.count = 1; // recomeça a ofensiva

  st.lastDay = today;
  saveToLocalStorage();
}

// ================= JANELAS HUD (gerenciador genérico) =================
function setupHudWindows() {
  // Botões que abrem janelas (data-window)
  document.querySelectorAll("[data-window]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-window");
      const win = document.getElementById(id);
      if (win && win.classList.contains("open")) closeHudWindow(id);
      else openHudWindow(id);
    });
  });

  // Botões de fechar (data-close)
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      soundSynth.play("click");
      closeHudWindow(btn.getAttribute("data-close"));
    });
  });

  // Chat global: recolher (só o log) e minimizar (vira aba flutuante)
  const chatBox = document.getElementById("rpg-chat-container");
  const chatToggle = document.getElementById("hud-chat-toggle");
  const chatMin = document.getElementById("hud-chat-min");
  const chatReopen = document.getElementById("hud-chat-reopen");
  const setChatMin = (min) => {
    if (!chatBox || !chatReopen) return;
    chatBox.classList.toggle("minimized", min);
    chatReopen.hidden = !min;
    try { localStorage.setItem("nutri_chat_min", min ? "1" : "0"); } catch (e) {}
  };
  if (chatToggle) {
    chatToggle.addEventListener("click", () => {
      soundSynth.play("click");
      if (chatBox) chatBox.classList.toggle("collapsed");
    });
  }
  if (chatMin) {
    chatMin.addEventListener("click", (e) => {
      e.stopPropagation();
      soundSynth.play("click");
      setChatMin(true);
    });
  }
  if (chatReopen) {
    chatReopen.addEventListener("click", () => {
      soundSynth.play("click");
      setChatMin(false);
    });
  }
  // restaura estado salvo do chat
  try { if (localStorage.getItem("nutri_chat_min") === "1") setChatMin(true); } catch (e) {}

  // Ocultar/mostrar painéis do HUD (minimapa, ícones e chat) — útil no celular
  const visToggle = document.getElementById("hud-visibility-toggle");
  const setHudHidden = (hidden) => {
    document.body.classList.toggle("hud-hidden", hidden);
    if (visToggle) {
      visToggle.textContent = hidden ? "👁️" : "🙈";
      visToggle.title = hidden ? "Mostrar painéis" : "Ocultar painéis";
    }
    try { localStorage.setItem("nutri_hud_hidden", hidden ? "1" : "0"); } catch (e) {}
  };
  if (visToggle) {
    visToggle.addEventListener("click", () => {
      soundSynth.play("click");
      setHudHidden(!document.body.classList.contains("hud-hidden"));
    });
  }
  try { if (localStorage.getItem("nutri_hud_hidden") === "1") setHudHidden(true); } catch (e) {}

  // Esc fecha qualquer janela aberta
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllHudWindows();
  });
}

function openHudWindow(id) {
  closeAllHudWindows();
  const win = document.getElementById(id);
  if (!win) return;
  soundSynth.play("click");
  win.classList.add("open");
  // Renderiza o conteúdo sob demanda
  const renderers = {
    "win-inventory": renderInventoryGrid,
    "win-ranking": renderLeaderboard,
    "win-resumos": renderSummaryShelf,
    "win-codex": renderCodex,
    "win-estudo": renderStudyWindow,
    "win-conquistas": renderAchievementsWindow,
    "win-ambulatorio": renderAmbulatorio
  };
  if (renderers[id]) renderers[id]();
}
function closeHudWindow(id) {
  const win = document.getElementById(id);
  if (win) win.classList.remove("open");
}
function closeAllHudWindows() {
  document.querySelectorAll(".hud-window.open").forEach(w => w.classList.remove("open"));
}

// ================= CONQUISTAS =================
function unlockAchievement(id) {
  if (!state.achievements) state.achievements = [];
  if (state.achievements.includes(id)) return;
  const ach = (nutriGameData.achievements || []).find(a => a.id === id);
  if (!ach) return;
  state.achievements.push(id);
  saveToLocalStorage();
  soundSynth.play("loot");
  showAchievementToast(ach);
}

function checkAchievements() {
  const cm = state.completedModules || [];
  const has = (arr) => arr.every(id => cm.includes(id));
  const lootTotal = Object.keys(LOOT_ITEMS).length;

  const conditions = {
    primeiro_caso: cm.length >= 1,
    ala_gastrica: has([1, 2, 3, 4]),
    ala_bioquimica: has([5, 6, 7, 8]),
    ambulatorio: [9, 10, 11, 12].some(id => cm.includes(id)),
    todos_modulos: has([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    perfeccionista: state.stats.threeStarCases >= 1,
    tres_estrelas_5: state.stats.threeStarCases >= 5,
    quiz_100: state.stats.quizCorrect >= 100,
    colecionadora: (state.inventory || []).length >= lootTotal && lootTotal > 0,
    streak_7: (state.streak.count || 0) >= 7,
    revisora: state.stats.studyReviews >= 10
  };

  Object.keys(conditions).forEach(id => { if (conditions[id]) unlockAchievement(id); });
}

function showAchievementToast(ach) {
  let stack = document.getElementById("achievement-toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.id = "achievement-toast-stack";
    document.body.appendChild(stack);
  }
  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  toast.innerHTML = `
    <span class="ach-toast-icon">${ach.icon}</span>
    <div class="ach-toast-text">
      <strong>Conquista desbloqueada!</strong>
      <span>${ach.title}</span>
    </div>`;
  stack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

// ================= CÓDEX DE REFERÊNCIA =================
let codexTab = "fitoterapicos";
function renderCodex() {
  const root = document.getElementById("codex-content");
  if (!root || !nutriGameData.codex) return;
  const tabs = [
    { key: "fitoterapicos", label: "🌿 Fitoterápicos" },
    { key: "nutrientes", label: "💊 Nutrientes" },
    { key: "exames", label: "🧪 Exames" },
    { key: "legislacao", label: "⚖️ Legislação" }
  ];
  let html = `<div class="codex-tabs">`;
  tabs.forEach(t => {
    html += `<button class="codex-tab-btn ${codexTab === t.key ? "active" : ""}" data-codex-tab="${t.key}">${t.label}</button>`;
  });
  html += `</div><div class="codex-list">`;

  const C = nutriGameData.codex;
  if (codexTab === "fitoterapicos") {
    C.fitoterapicos.forEach(f => {
      html += `
        <div class="codex-card">
          <div class="codex-card-head"><strong>${f.nome}</strong><span class="codex-tag">${f.classe}</span></div>
          <p><b>Mecanismo:</b> ${f.mecanismo}</p>
          <p><b>Uso:</b> ${f.uso}</p>
          <p class="codex-alert"><b>⚠️ Atenção:</b> ${f.alerta}</p>
        </div>`;
    });
  } else if (codexTab === "nutrientes") {
    C.nutrientes.forEach(n => {
      html += `
        <div class="codex-card">
          <div class="codex-card-head"><strong>${n.nome}</strong></div>
          <p><b>Função:</b> ${n.funcao}</p>
          <p><b>Deficiência:</b> ${n.deficiencia}</p>
          <p><b>Forma preferida:</b> ${n.forma}</p>
        </div>`;
    });
  } else if (codexTab === "exames") {
    C.exames.forEach(e => {
      html += `
        <div class="codex-card">
          <div class="codex-card-head"><strong>${e.nome}</strong></div>
          <p><b>Ref. laboratório:</b> ${e.lab}</p>
          <p class="codex-func"><b>Ideal funcional:</b> ${e.funcional}</p>
        </div>`;
    });
  } else {
    C.legislacao.forEach(l => {
      html += `
        <div class="codex-card">
          <div class="codex-card-head"><strong>${l.tema}</strong></div>
          <p>${l.detalhe}</p>
        </div>`;
    });
  }
  html += `</div>`;
  root.innerHTML = html;

  root.querySelectorAll("[data-codex-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      soundSynth.play("click");
      codexTab = btn.getAttribute("data-codex-tab");
      renderCodex();
    });
  });
}

// ================= MODO ESTUDO LIVRE / REVISÃO =================
function renderStudyWindow() {
  const root = document.getElementById("estudo-content");
  if (!root) return;
  const reviewCount = state.review.length;

  let html = `
    <div class="estudo-review-bar">
      <div>
        <strong>🔁 Revisão de Erros</strong>
        <span class="estudo-review-count">${reviewCount} ${reviewCount === 1 ? "questão" : "questões"} para revisar</span>
      </div>
      <button class="btn-primary btn-sm" id="btn-start-review" ${reviewCount === 0 ? "disabled" : ""}>Revisar Erros</button>
    </div>
    <div class="estudo-review-bar estudo-simulado-bar">
      <div>
        <strong>📝 Simulado Cronometrado</strong>
        <span class="estudo-review-count">${SIMULADO_SIZE} questões mistas · 10 min · recorde ${state.stats.simuladoBest}%</span>
      </div>
      <button class="btn-primary btn-sm" id="btn-start-simulado">Iniciar Prova</button>
    </div>
    <p class="section-desc">Refaça o quiz de qualquer módulo concluído (sem perder vidas) e revise os pontos-chave nas fichas flipáveis.</p>
    <div class="estudo-list">`;

  nutriGameData.modules.forEach(mod => {
    const done = state.completedModules.includes(mod.id);
    const pm = state.stats.perModule[mod.id];
    const score = pm && pm.quizTotal ? ` · melhor: ${pm.quizCorrect}/${pm.quizTotal}` : "";
    html += `
      <div class="estudo-row ${done ? "" : "locked"}">
        <div class="estudo-row-info">
          <span class="estudo-row-title">${done ? mod.subtitle : "🔒 " + (mod.ambulatorio ? "Caso avançado bloqueado" : "Módulo bloqueado")}</span>
          ${done ? `<span class="estudo-row-meta">${mod.title.split(":")[0]}${score}</span>` : ""}
        </div>
        ${done ? `
        <div class="estudo-row-actions">
          <button class="btn-secondary btn-sm" data-flashcard="${mod.id}">📚 Ficha</button>
          <button class="btn-primary btn-sm" data-study-quiz="${mod.id}">🧠 Quiz</button>
        </div>` : ""}
      </div>`;
  });
  html += `</div>`;
  root.innerHTML = html;

  const reviewBtn = root.querySelector("#btn-start-review");
  if (reviewBtn) reviewBtn.addEventListener("click", () => { soundSynth.play("click"); startReviewQuiz(); });
  const simBtn = root.querySelector("#btn-start-simulado");
  if (simBtn) simBtn.addEventListener("click", () => { soundSynth.play("click"); startSimulado(); });

  root.querySelectorAll("[data-flashcard]").forEach(btn => {
    btn.addEventListener("click", () => { soundSynth.play("click"); openFlashcards(parseInt(btn.getAttribute("data-flashcard"))); });
  });
  root.querySelectorAll("[data-study-quiz]").forEach(btn => {
    btn.addEventListener("click", () => {
      soundSynth.play("click");
      const id = parseInt(btn.getAttribute("data-study-quiz"));
      closeAllHudWindows();
      activeCase = { moduleId: id, requestedExams: [], selectedPrescriptions: [], uselessExamsCount: 0, lives: 99 };
      startQuiz(id, "study");
    });
  });
}

function startReviewQuiz() {
  const refs = state.review.slice(0, 15); // até 15 por sessão
  const questions = [];
  refs.forEach(k => {
    const [m, qi] = k.split(":").map(Number);
    const mod = nutriGameData.modules.find(x => x.id === m);
    if (mod && mod.quiz && mod.quiz[qi]) {
      questions.push(Object.assign({}, mod.quiz[qi], { _m: m, _qi: qi }));
    } else {
      clearReviewItem(m, qi); // referência inválida, limpa
    }
  });
  if (questions.length === 0) {
    showAlert("Nada para revisar", "Você não tem questões pendentes de revisão. Continue jogando e errando para alimentar a fila! 😉", "✅");
    return;
  }
  closeAllHudWindows();
  quizMode = "review";
  quizWrongThisRun = 0;
  quizRunWrong = [];
  quizReviewModuleId = null;
  quizQuestions = questions;
  currentQuizQuestionIndex = 0;
  state.quizXpEarned = 0;
  activeCase = { moduleId: null, lives: 99 };
  setupBossBar("Fantasma dos Erros Passados", questions.length);
  renderQuizQuestion();
  showScreen("screen-quiz");
}

// ----- Flashcards flipáveis (frente/verso, navegáveis, com auto-avaliação) -----
let fcDeck = [], fcIndex = 0, fcModuleId = null;

function buildFlashcardDeck(mod) {
  const deck = [];
  const li = (arr) => arr.map(x => `<li>${x}</li>`).join("");
  const exames = mod.case.investigation.options.filter(o => o.needed).map(o => o.name);
  const condutas = mod.case.prescription.options.filter(o => o.correct).map(o => o.name);
  const erros = mod.case.prescription.options.filter(o => !o.correct && o.critical).map(o => o.name);

  deck.push({ front: `🧑 Paciente & Queixa`, back: `<b>${mod.case.patient.name}</b>, ${mod.case.patient.age} anos (${mod.case.patient.occupation}).<br><br>${mod.case.patient.complaint}` });
  deck.push({ front: `🧪 Quais são os exames-chave deste caso?`, back: `<ul>${li(exames)}</ul>` });
  deck.push({ front: `✅ Qual é a conduta correta?`, back: `<ul>${li(condutas)}</ul>` });
  if (erros.length) deck.push({ front: `⛔ Quais erros críticos evitar?`, back: `<ul class="fc-errors">${li(erros)}</ul>` });
  deck.push({ front: `🧠 Raciocínio funcional do caso`, back: mod.case.discussion.text });
  // Uma carta por questão do quiz (alimenta a repetição espaçada)
  (mod.quiz || []).forEach((q, i) => {
    deck.push({ front: `❓ ${q.question}`, back: `✔️ <b>${q.options[q.correct]}</b><br><br>${q.explanation}`, ref: { m: mod.id, qi: i } });
  });
  const ref = nutriGameData.referencias && nutriGameData.referencias[mod.id];
  if (ref) deck.push({ front: `📖 Onde estudar este tema na pós?`, back: ref });
  return deck;
}

function openFlashcards(moduleId) {
  const mod = nutriGameData.modules.find(m => m.id === moduleId);
  if (!mod) return;
  fcModuleId = moduleId;
  fcDeck = buildFlashcardDeck(mod);
  fcIndex = 0;
  document.getElementById("fc-title").textContent = `Ficha: ${mod.subtitle}`;
  renderFlashcard();
  document.getElementById("modal-flashcard").classList.add("active");
}

function renderFlashcard() {
  const card = fcDeck[fcIndex];
  if (!card) return;
  const cardEl = document.getElementById("fc-card");
  cardEl.classList.remove("flipped");
  document.getElementById("fc-front").innerHTML = `<div class="fc-face-inner">${card.front}</div>`;
  document.getElementById("fc-back").innerHTML = `<div class="fc-face-inner">${card.back}</div>`;
  document.getElementById("fc-counter").textContent = `${fcIndex + 1} / ${fcDeck.length}`;
  // Botões "sabia/não sabia" só fazem sentido em cartas de questão (com ref)
  const hasRef = !!card.ref;
  document.getElementById("fc-dunno").style.display = hasRef ? "" : "none";
  document.getElementById("fc-know").style.display = hasRef ? "" : "none";
}

function flipFlashcard() {
  document.getElementById("fc-card").classList.toggle("flipped");
}
function navFlashcard(dir) {
  fcIndex = (fcIndex + dir + fcDeck.length) % fcDeck.length;
  renderFlashcard();
}
function markFlashcard(known) {
  const card = fcDeck[fcIndex];
  if (card && card.ref) {
    if (known) clearReviewItem(card.ref.m, card.ref.qi);
    else addReviewItem(card.ref.m, card.ref.qi);
    saveToLocalStorage();
  }
  soundSynth.play(known ? "success" : "click");
  if (fcIndex < fcDeck.length - 1) navFlashcard(1);
  else {
    document.getElementById("modal-flashcard").classList.remove("active");
    showAlert("Ficha concluída!", "Você revisou todos os cartões deste módulo. As questões marcadas como “não sabia” entraram na sua fila de Revisão de Erros. 🧠", "📚", "Boa!");
  }
}

function setupFlashcards() {
  const card = document.getElementById("fc-card");
  if (card) card.addEventListener("click", () => { soundSynth.play("click"); flipFlashcard(); });
  const map = {
    "fc-prev": () => navFlashcard(-1),
    "fc-next": () => navFlashcard(1),
    "fc-know": () => markFlashcard(true),
    "fc-dunno": () => markFlashcard(false),
    "btn-close-flashcard": () => document.getElementById("modal-flashcard").classList.remove("active")
  };
  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", (e) => { e.stopPropagation(); soundSynth.play("click"); map[id](); });
  });
}

// ================= AMBULATÓRIO (CASOS AVANÇADOS 9-12) =================
function renderAmbulatorio() {
  const root = document.getElementById("ambulatorio-content");
  if (!root) return;
  const enfermariaDone = state.completedModules.includes(8);
  const avancados = nutriGameData.modules.filter(m => m.ambulatorio);

  let html = "";
  if (!enfermariaDone) {
    html += `<p class="section-desc ambul-locked-note">🔒 O Ambulatório de Casos Avançados é liberado após você concluir todos os 8 leitos da enfermaria (módulo 8).</p>`;
  } else {
    html += `<p class="section-desc">Casos especializados liberados! Atenda na ordem para aprofundar os temas avançados da pós.</p>`;
  }
  html += `<div class="ambul-grid">`;

  avancados.forEach((mod, idx) => {
    const done = state.completedModules.includes(mod.id);
    // disponível se enfermaria concluída e (primeiro avançado ou anterior concluído)
    const prevId = idx === 0 ? 8 : avancados[idx - 1].id;
    const available = enfermariaDone && state.completedModules.includes(prevId);
    let cls = "locked", btn = "", badge = "🔒";
    if (done) { cls = "done"; badge = "✅"; btn = `<button class="btn-secondary btn-sm" data-ambul-case="${mod.id}">Refazer</button>`; }
    else if (available) { cls = "available"; badge = "🩺"; btn = `<button class="btn-primary btn-sm" data-ambul-case="${mod.id}">Atender</button>`; }

    html += `
      <div class="ambul-card ${cls}">
        <div class="ambul-card-badge">${badge}</div>
        <div class="ambul-card-title">${mod.subtitle}</div>
        <div class="ambul-card-sub">${available || done ? mod.case.patient.name + " · " + mod.case.patient.age + " anos" : "Conclua o caso anterior"}</div>
        ${btn}
      </div>`;
  });
  html += `</div>`;

  // ---- Seção: Terapia Nutricional Enteral (Casos Críticos) ----
  const enterais = nutriGameData.modules.filter(m => m.enteral);
  if (enterais.length) {
    html += `<h4 class="ambul-section-head">🏥 Terapia Nutricional Enteral — Casos Críticos</h4>`;
    html += `<p class="section-desc">Pacientes internados graves (DRC, oncologia, traqueostomia, GTT/SNE). Também acessíveis pelos setores do hospital (saia pela porta do saguão). Escolha a fórmula e a conduta corretas.</p>`;
    html += `<div class="ambul-grid">`;
    enterais.forEach((mod) => {
      const done = state.completedModules.includes(mod.id);
      // casos críticos de setor: sempre disponíveis (acessíveis pelas alas)
      const available = true;
      let cls = "locked", btn = "", badge = "🔒";
      if (done) { cls = "done"; badge = "✅"; btn = `<button class="btn-secondary btn-sm" data-ambul-case="${mod.id}">Refazer</button>`; }
      else if (available) { cls = "available"; badge = "🩺"; btn = `<button class="btn-primary btn-sm" data-ambul-case="${mod.id}">Atender</button>`; }
      html += `
        <div class="ambul-card ${cls}">
          <div class="ambul-card-badge">${badge}</div>
          <div class="ambul-card-title">${mod.subtitle}</div>
          <div class="ambul-card-sub">${available || done ? mod.case.patient.name + " · " + mod.case.patient.age + " anos" : "Conclua o caso anterior"}</div>
          ${btn}
        </div>`;
    });
    html += `</div>`;
  }

  root.innerHTML = html;

  root.querySelectorAll("[data-ambul-case]").forEach(b => {
    b.addEventListener("click", () => {
      soundSynth.play("click");
      closeAllHudWindows();
      startCase(parseInt(b.getAttribute("data-ambul-case")));
    });
  });
}

// ================= CONQUISTAS & ESTATÍSTICAS (janela) =================
function renderAchievementsWindow() {
  const root = document.getElementById("conquistas-content");
  if (!root) return;
  const s = state.stats;
  const total = nutriGameData.modules.length;
  const acc = s.quizAnswered ? Math.round((s.quizCorrect / s.quizAnswered) * 100) : 0;
  const lootTotal = Object.keys(LOOT_ITEMS).length;

  let html = `
    <div class="stats-grid">
      <div class="stat-box"><span class="stat-num">${state.completedModules.length}/${total}</span><span class="stat-label">Casos concluídos</span></div>
      <div class="stat-box"><span class="stat-num">${acc}%</span><span class="stat-label">Acerto no quiz</span></div>
      <div class="stat-box"><span class="stat-num">${s.threeStarCases}</span><span class="stat-label">Casos 3⭐</span></div>
      <div class="stat-box"><span class="stat-num">🔥 ${state.streak.count || 0}</span><span class="stat-label">Dias seguidos</span></div>
      <div class="stat-box"><span class="stat-num">${(state.inventory || []).length}/${lootTotal}</span><span class="stat-label">Itens de loot</span></div>
      <div class="stat-box"><span class="stat-num">${s.quizCorrect}</span><span class="stat-label">Acertos totais</span></div>
      <div class="stat-box"><span class="stat-num">${formatStudyTime(s.studySeconds || 0)}</span><span class="stat-label">Tempo de estudo</span></div>
      <div class="stat-box"><span class="stat-num">${s.simuladoBest || 0}%</span><span class="stat-label">Recorde simulado</span></div>
      <div class="stat-box"><span class="stat-num">${s.studyReviews || 0}</span><span class="stat-label">Revisões feitas</span></div>
    </div>
    <h4>🏅 Conquistas (${state.achievements.length}/${(nutriGameData.achievements || []).length})</h4>
    <div class="ach-grid">`;

  (nutriGameData.achievements || []).forEach(a => {
    const unlocked = state.achievements.includes(a.id);
    html += `
      <div class="ach-card ${unlocked ? "unlocked" : "locked"}">
        <div class="ach-icon">${unlocked ? a.icon : "🔒"}</div>
        <div class="ach-info">
          <strong>${a.title}</strong>
          <span>${a.desc}</span>
        </div>
      </div>`;
  });
  html += `</div>`;
  root.innerHTML = html;
}

// ================= TEMPO DE ESTUDO =================
function startStudyTimer() {
  // Acumula segundos enquanto a aba está visível (granularidade de 10s)
  setInterval(() => {
    if (document.visibilityState === "visible") {
      state.stats.studySeconds += 10;
      if (state.stats.studySeconds % 60 === 0) saveToLocalStorage();
    }
  }, 10000);
  window.addEventListener("beforeunload", saveToLocalStorage);
}
function formatStudyTime(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

// ================= PARTÍCULAS (efeito visual) =================
function spawnParticles(type) {
  const layer = document.getElementById("fx-layer") || (() => {
    const l = document.createElement("div"); l.id = "fx-layer"; document.body.appendChild(l); return l;
  })();
  const presets = {
    hit: { emojis: ["✨", "💥", "⭐"], count: 8, originY: 28 },
    loot: { emojis: ["🎁", "✨", "💎", "🌟"], count: 14, originY: 50 },
    win: { emojis: ["🎉", "🎊", "⭐", "✨"], count: 18, originY: 40 }
  };
  const cfg = presets[type] || presets.hit;
  for (let i = 0; i < cfg.count; i++) {
    const p = document.createElement("span");
    p.className = "fx-particle";
    p.textContent = cfg.emojis[Math.floor(Math.random() * cfg.emojis.length)];
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 120;
    p.style.left = (50 + (Math.random() * 20 - 10)) + "vw";
    p.style.top = cfg.originY + "vh";
    p.style.setProperty("--dx", `${Math.cos(ang) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(ang) * dist - 40}px`);
    p.style.fontSize = (14 + Math.random() * 16) + "px";
    layer.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }
}

// ================= MODO PROVA / SIMULADO CRONOMETRADO =================
const SIMULADO_SIZE = 15;       // nº de questões
const SIMULADO_SECONDS = 600;   // 10 minutos
let simTimer = null, simTimeLeft = 0;

function startSimulado() {
  // Sorteia questões de TODOS os módulos (foco no que o aluno errou, se houver fila)
  const all = [];
  nutriGameData.modules.forEach(mod => (mod.quiz || []).forEach((q, i) => all.push({ q, m: mod.id, qi: i })));
  // Embaralha
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  const picked = all.slice(0, Math.min(SIMULADO_SIZE, all.length));

  closeAllHudWindows();
  quizMode = "simulado";
  quizWrongThisRun = 0;
  quizRunWrong = [];
  quizReviewModuleId = null;
  activeCase = { moduleId: null, lives: 99 };
  quizQuestions = picked.map(p => Object.assign({}, p.q, { _m: p.m, _qi: p.qi }));
  currentQuizQuestionIndex = 0;
  state.quizXpEarned = 0;

  setupBossBar("Simulado da Pós", quizQuestions.length);
  renderQuizQuestion();
  showScreen("screen-quiz");

  // Cronômetro
  simTimeLeft = SIMULADO_SECONDS;
  showSimTimer();
  if (simTimer) clearInterval(simTimer);
  simTimer = setInterval(() => {
    simTimeLeft--;
    showSimTimer();
    if (simTimeLeft <= 0) { stopSimTimer(); finishSimulado(true); }
  }, 1000);
}

function showSimTimer() {
  let el = document.getElementById("sim-timer");
  if (!el) {
    el = document.createElement("div"); el.id = "sim-timer"; el.className = "sim-timer";
    const header = document.querySelector("#screen-quiz .quiz-header");
    if (header) header.appendChild(el);
  }
  el.style.display = "block";
  const m = Math.floor(simTimeLeft / 60), s = simTimeLeft % 60;
  el.textContent = `⏱️ ${m}:${String(s).padStart(2, "0")}`;
  el.classList.toggle("urgent", simTimeLeft <= 60);
}
function stopSimTimer() {
  if (simTimer) { clearInterval(simTimer); simTimer = null; }
  const el = document.getElementById("sim-timer");
  if (el) el.style.display = "none";
}

function finishSimulado(timeUp) {
  stopSimTimer();
  const total = quizQuestions.length;
  // Em simulado, só conta como respondidas as que foram exibidas até aqui
  const answered = timeUp ? currentQuizQuestionIndex : total;
  const acertos = answered - quizRunWrong.length;
  const nota = total ? Math.round((acertos / total) * 100) : 0;
  const xp = acertos * 15;
  state.xp += xp;
  if (nota > state.stats.simuladoBest) state.stats.simuladoBest = nota;
  saveToLocalStorage();
  soundSynth.play(nota >= 70 ? "levelup" : "success");
  if (nota >= 70) spawnParticles("win");
  checkAchievements();

  const msg = timeUp ? "⏰ Tempo esgotado!" : "Simulado concluído!";
  showAlert(msg,
    `<p>Nota: <b>${nota}%</b> (${acertos}/${total} corretas) — <b>+${xp} XP</b>.</p><p>Recorde de simulado: <b>${state.stats.simuladoBest}%</b>.</p>${wrongSummaryHTML()}`,
    nota >= 70 ? "🏆" : "📝", "Voltar", () => { showScreen("screen-home"); openHudWindow("win-estudo"); });
}

// Iniciar ao carregar DOM
window.addEventListener("DOMContentLoaded", initApp);
// Registrar SW
registerServiceWorker();
