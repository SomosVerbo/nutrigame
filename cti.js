// =====================================================================
// NutriGame · Motor do CTI (simulação de plantão)
// Modo de simulação clínica avançada para os casos do CTI (ctiCases em data.js).
// Mantém o princípio: ao abrir o paciente há anamnese, avaliação nutricional,
// exame físico, antropometria, exames, evolução, prescrição e prontuário.
//
// Pontes (globais do app.js): window.getGameState, window.nutriGameData,
//   window.soundSynth, window.saveToLocalStorage, window.showScreen, window.bonusOf
// Expõe: window.startCtiCase(bedId), window.ctiCaseForBed(bedId), window.ctiStatus(bedId)
// =====================================================================
(() => {
  'use strict';

  const D = () => window.nutriGameData || {};
  const S = () => (window.getGameState ? window.getGameState() : {});
  const save = () => { if (window.saveToLocalStorage) window.saveToLocalStorage(); };
  const play = (s) => { try { if (window.soundSynth) window.soundSynth.play(s); } catch (e) { } };
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  let C = null;     // caso ativo
  let ctx = null;   // estado do atendimento

  // ---- Pontes p/ o mundo (game2d) ----
  function caseForBed(bedId) { return (D().ctiCases || []).find((c) => c.bedId === bedId) || null; }
  function isDone(caseId) { const s = S(); return (s.ctiDone || []).includes(caseId); }
  window.ctiCaseForBed = caseForBed;
  window.ctiStatus = (bedId) => { const c = caseForBed(bedId); if (!c) return null; return isDone(c.id) ? 'done' : 'avail'; };

  // ---- Fluxo do plantão ----
  function buildFlow(c) {
    const flow = [{ type: 'plantao' }];
    (c.stages || []).forEach((s) => flow.push({ type: 'stage', stage: s }));
    (c.monitor || []).forEach((m) => flow.push({ type: 'monitor', mon: m }));
    if (c.family) flow.push({ type: 'dialog', who: 'family' });
    if (c.team) flow.push({ type: 'dialog', who: 'team' });
    flow.push({ type: 'evolucao' });
    flow.push({ type: 'result' });
    flow.push({ type: 'quiz' });
    return flow;
  }

  function startCtiCase(bedId) {
    const c = caseForBed(bedId);
    if (!c) return false;
    C = c;
    ctx = {
      step: 0, errors: 0, critical: 0, confidence: 0,
      chosenFormula: null, maxLabDay: 0, evolucao: {}, quizWrong: 0
    };
    ensureScreen();
    renderShell();
    showStep();
    if (window.showScreen) window.showScreen('screen-cti'); else activate();
    play('click');
    return true;
  }
  window.startCtiCase = startCtiCase;

  function activate() {
    document.querySelectorAll('.app-screen').forEach((s) => s.classList.remove('active'));
    document.getElementById('screen-cti').classList.add('active');
  }

  function leave() {
    if (window.showScreen) window.showScreen('screen-home'); else activate();
  }

  // ---- Construção da tela (injetada uma vez) ----
  function ensureScreen() {
    if (document.getElementById('screen-cti')) return;
    const sec = document.createElement('section');
    sec.id = 'screen-cti';
    sec.className = 'app-screen';
    sec.innerHTML = `
      <header class="cti-top">
        <button class="cti-back" id="cti-back" title="Sair do CTI">✕</button>
        <div class="cti-pt">
          <span class="cti-pt-avatar" id="cti-pt-avatar">🧔🏽</span>
          <div class="cti-pt-info">
            <h3 id="cti-pt-name">Paciente</h3>
            <span id="cti-pt-sub">Leito — CTI</span>
          </div>
        </div>
        <div class="cti-conf" title="Confiança da família/equipe">
          <span class="cti-conf-label">Confiança</span>
          <span class="cti-conf-hearts" id="cti-conf-hearts"></span>
        </div>
      </header>
      <div class="cti-refbar">
        <button class="cti-ref-btn" data-ref="prontuario">📋 Prontuário</button>
        <button class="cti-ref-btn" data-ref="antropo">📐 Antropometria</button>
        <button class="cti-ref-btn" data-ref="exames">🧪 Exames</button>
        <button class="cti-ref-btn" data-ref="formulas">📚 Fórmulas</button>
      </div>
      <div class="cti-progress" id="cti-progress"></div>
      <div class="cti-main" id="cti-main"></div>
      <div class="cti-overlay" id="cti-overlay" hidden>
        <div class="cti-overlay-card">
          <div class="cti-overlay-bar"><h3 id="cti-overlay-title">—</h3><button class="cti-overlay-close" id="cti-overlay-close">✕</button></div>
          <div class="cti-overlay-body" id="cti-overlay-body"></div>
        </div>
      </div>`;
    const cont = document.getElementById('app-container') || document.body;
    cont.appendChild(sec);

    sec.querySelector('#cti-back').addEventListener('click', () => { play('click'); leave(); });
    sec.querySelector('#cti-overlay-close').addEventListener('click', closeOverlay);
    sec.querySelector('#cti-overlay').addEventListener('click', (e) => { if (e.target.id === 'cti-overlay') closeOverlay(); });
    sec.querySelectorAll('.cti-ref-btn').forEach((b) => b.addEventListener('click', () => openRef(b.dataset.ref)));
  }

  function renderShell() {
    document.getElementById('cti-pt-avatar').textContent = C.patient.avatar || '🧑';
    document.getElementById('cti-pt-name').textContent = C.patient.name;
    document.getElementById('cti-pt-sub').textContent = `${C.patient.leito} · ${C.title}`;
    updateConfidence();
    renderProgress();
  }

  function updateConfidence() {
    // 0 neutro → mostra 3 corações base; deltaConf move entre 1 e 5
    const v = Math.max(1, Math.min(5, 3 + ctx.confidence));
    let h = '';
    for (let i = 1; i <= 5; i++) h += i <= v ? '💗' : '🤍';
    document.getElementById('cti-conf-hearts').textContent = h;
  }

  function renderProgress() {
    const wrap = document.getElementById('cti-progress');
    const flow = ctx.flow || (ctx.flow = buildFlow(C));
    wrap.innerHTML = flow.map((f, i) => {
      const cls = i < ctx.step ? 'done' : (i === ctx.step ? 'cur' : '');
      return `<span class="cti-dot ${cls}"></span>`;
    }).join('');
  }

  // ---- Render do passo atual ----
  function showStep() {
    ctx.flow = ctx.flow || buildFlow(C);
    renderProgress();
    const f = ctx.flow[ctx.step];
    const main = document.getElementById('cti-main');
    main.scrollTop = 0;
    if (!f) return;
    if (f.type === 'plantao') renderPlantao(main);
    else if (f.type === 'stage') renderStage(main, f.stage);
    else if (f.type === 'monitor') renderMonitor(main, f.mon);
    else if (f.type === 'dialog') renderDialog(main, f.who);
    else if (f.type === 'evolucao') renderEvolucao(main);
    else if (f.type === 'result') renderResult(main);
    else if (f.type === 'quiz') renderQuiz(main);
  }

  function next() { ctx.step++; showStep(); }

  function continueBtn(label) {
    return `<button class="cti-btn cti-btn-primary cti-continue">${label || 'Continuar →'}</button>`;
  }
  function bindContinue(main, fn) {
    const b = main.querySelector('.cti-continue');
    if (b) b.addEventListener('click', () => { play('click'); (fn || next)(); });
  }

  // 0 · Passagem de plantão
  function renderPlantao(main) {
    const p = C.plantao;
    main.innerHTML = `
      <div class="cti-card cti-handoff">
        <div class="cti-card-head">📋 Passagem de Plantão — ${esc(C.patient.name)}</div>
        <p class="cti-admissao">${esc(p.admissao)}</p>
        <div class="cti-grid2">
          ${listBlock('⚠️ Intercorrências (24h)', p.intercorrencias24h)}
          ${listBlock('📌 Pendências', p.pendencias)}
          ${listBlock('🩺 Solicitações da equipe', p.solicitacoes)}
          <div class="cti-hint-block">
            <div class="cti-hint-title">💡 Dica</div>
            <p>Consulte <b>Prontuário</b>, <b>Exames</b> e a <b>Central de Fórmulas</b> na barra acima a qualquer momento.</p>
          </div>
        </div>
        ${continueBtn('Assumir o caso →')}
      </div>`;
    bindContinue(main);
  }
  function listBlock(title, arr) {
    return `<div class="cti-list-block"><div class="cti-list-title">${title}</div><ul>${(arr || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
  }

  // Etapa de decisão (e fórmula)
  function renderStage(main, stage) {
    if (stage.kind === 'formula') return renderFormulaStage(main, stage);
    main.innerHTML = `
      <div class="cti-card">
        <div class="cti-card-head">${stage.icon || '🧭'} ${esc(stage.title)}</div>
        <p class="cti-prompt">${esc(stage.prompt)}</p>
        <div class="cti-options" id="cti-opts"></div>
        <div class="cti-feedback" id="cti-fb" hidden></div>
        <div class="cti-after" id="cti-after" hidden>
          <div class="cti-explain">📖 ${esc(stage.explain)}</div>
          ${continueBtn()}
        </div>
      </div>`;
    const opts = main.querySelector('#cti-opts');
    stage.options.forEach((o) => {
      const btn = document.createElement('button');
      btn.className = 'cti-opt';
      btn.textContent = o.text;
      btn.addEventListener('click', () => answerStage(main, stage, o, btn));
      opts.appendChild(btn);
    });
    bindContinue(main);
  }

  function answerStage(main, stage, o, btn) {
    if (main.querySelector('#cti-opts').classList.contains('locked')) return;
    main.querySelector('#cti-opts').classList.add('locked');
    main.querySelectorAll('.cti-opt').forEach((b) => b.classList.add('disabled'));
    if (o.correct) { btn.classList.add('correct'); play('success'); }
    else { btn.classList.add('wrong'); play('error'); if (o.critical) ctx.critical++; else ctx.errors++; }
    // marca a opção correta
    if (!o.correct) {
      stage.options.forEach((opt, i) => { if (opt.correct) main.querySelectorAll('.cti-opt')[i].classList.add('correct'); });
    }
    const fb = main.querySelector('#cti-fb');
    fb.hidden = false;
    fb.className = 'cti-feedback ' + (o.correct ? 'ok' : (o.critical ? 'crit' : 'warn'));
    fb.innerHTML = (o.correct ? '✅ ' : (o.critical ? '🛑 ' : '⚠️ ')) + esc(o.feedback);
    main.querySelector('#cti-after').hidden = false;
  }

  // Etapa de fórmula (usa a Central de Fórmulas)
  function renderFormulaStage(main, stage) {
    const chosen = ctx.chosenFormula;
    main.innerHTML = `
      <div class="cti-card">
        <div class="cti-card-head">${stage.icon || '🧪'} ${esc(stage.title)}</div>
        <p class="cti-prompt">${esc(stage.prompt)}</p>
        <button class="cti-btn cti-btn-ghost" id="cti-open-lib">📚 Abrir Central de Fórmulas e escolher</button>
        <div class="cti-chosen" id="cti-chosen" ${chosen ? '' : 'hidden'}></div>
        <div class="cti-feedback" id="cti-fb" hidden></div>
        <div class="cti-after" id="cti-after" hidden>
          <div class="cti-explain">📖 ${esc(stage.explain)}</div>
          ${continueBtn()}
        </div>
      </div>`;
    main.querySelector('#cti-open-lib').addEventListener('click', () => openRef('formulas', stage));
    bindContinue(main);
    if (chosen) showFormulaChoice(stage, chosen);
  }

  function chooseFormula(stage, id) {
    ctx.chosenFormula = id;
    closeOverlay();
    showFormulaChoice(stage, id);
  }
  function showFormulaChoice(stage, id) {
    const f = (D().formulasEnterais || []).find((x) => x.id === id);
    const note = stage.notes[id] || 'Fórmula fora do perfil ideal para este caso.';
    const isCorrect = (stage.correctIds || []).includes(id);
    const isCrit = /ERRO\s*CR[IÍ]TICO|CONTRAINDICAD/i.test(note);
    const main = document.getElementById('cti-main');
    const ch = main.querySelector('#cti-chosen');
    ch.hidden = false;
    ch.innerHTML = `<b>Selecionada:</b> ${esc(f ? f.marca + ' · ' + f.nome : id)}`;
    // pontua só na primeira escolha
    if (!ctx._formulaScored) {
      ctx._formulaScored = true;
      if (isCorrect) play('success'); else { play('error'); if (isCrit) ctx.critical++; else ctx.errors++; }
    }
    const fb = main.querySelector('#cti-fb');
    fb.hidden = false;
    fb.className = 'cti-feedback ' + (isCorrect ? 'ok' : (isCrit ? 'crit' : 'warn'));
    fb.innerHTML = (isCorrect ? '✅ ' : (isCrit ? '🛑 ' : '⚠️ ')) + esc(note) +
      (isCorrect && id === stage.bestId ? ' <i>(escolha ideal)</i>' : '');
    main.querySelector('#cti-after').hidden = false;
  }

  // Monitorização 24/48/72h
  function renderMonitor(main, mon) {
    ctx.maxLabDay = Math.max(ctx.maxLabDay, mon.labsDay || 0);
    main.innerHTML = `
      <div class="cti-card">
        <div class="cti-card-head">${mon.icon || '📈'} Monitorização — ${esc(mon.hora)}</div>
        <div class="cti-evento">${esc(mon.evento)}</div>
        <button class="cti-btn cti-btn-ghost cti-mini" id="cti-see-labs">🧪 Ver exames de ${esc(mon.hora)}</button>
        <p class="cti-prompt">${esc(mon.prompt)}</p>
        <div class="cti-options" id="cti-opts"></div>
        <div class="cti-feedback" id="cti-fb" hidden></div>
        <div class="cti-after" id="cti-after" hidden>
          <div class="cti-explain">📖 ${esc(mon.explain)}</div>
          ${continueBtn()}
        </div>
      </div>`;
    main.querySelector('#cti-see-labs').addEventListener('click', () => openLabs(mon.labsDay));
    const opts = main.querySelector('#cti-opts');
    mon.options.forEach((o) => {
      const btn = document.createElement('button');
      btn.className = 'cti-opt';
      btn.textContent = o.text;
      btn.addEventListener('click', () => answerStage(main, mon, o, btn));
      opts.appendChild(btn);
    });
    bindContinue(main);
  }

  // Diálogos (família / equipe) — afetam confiança
  function renderDialog(main, who) {
    const dlg = who === 'family' ? C.family : C.team;
    const line = dlg.lines[0];
    main.innerHTML = `
      <div class="cti-card">
        <div class="cti-card-head">${who === 'family' ? '👪 Conversa com a Família' : '🩺 Discussão com a Equipe'}</div>
        <div class="cti-dialog-speaker"><span class="cti-dlg-av">${esc(dlg.avatar || '🧑')}</span><b>${esc(dlg.speaker)}</b></div>
        <div class="cti-dialog-q">${esc(line.q)}</div>
        <div class="cti-options" id="cti-opts"></div>
        <div class="cti-feedback" id="cti-fb" hidden></div>
        <div class="cti-after" id="cti-after" hidden>${continueBtn()}</div>
      </div>`;
    const opts = main.querySelector('#cti-opts');
    line.options.forEach((o) => {
      const btn = document.createElement('button');
      btn.className = 'cti-opt';
      btn.textContent = o.text;
      btn.addEventListener('click', () => answerDialog(main, o, btn));
      opts.appendChild(btn);
    });
    bindContinue(main);
  }
  function answerDialog(main, o, btn) {
    if (main.querySelector('#cti-opts').classList.contains('locked')) return;
    main.querySelector('#cti-opts').classList.add('locked');
    main.querySelectorAll('.cti-opt').forEach((b) => b.classList.add('disabled'));
    const d = o.deltaConf || 0;
    ctx.confidence = Math.max(-2, Math.min(2, ctx.confidence + d));
    updateConfidence();
    if (d > 0) { btn.classList.add('correct'); play('success'); }
    else { btn.classList.add(d < 0 ? 'wrong' : ''); play(d < 0 ? 'error' : 'click'); if (d < 0) ctx.errors++; }
    const fb = main.querySelector('#cti-fb');
    fb.hidden = false;
    fb.className = 'cti-feedback ' + (d > 0 ? 'ok' : (d < 0 ? 'warn' : ''));
    fb.innerHTML = (d > 0 ? '💗 ' : (d < 0 ? '💔 ' : '')) + esc(o.feedback);
    main.querySelector('#cti-after').hidden = false;
  }

  // Evolução em prontuário (compor)
  function renderEvolucao(main) {
    const ev = C.prontuarioEvolucao;
    const groups = [
      ['diagnostico', '🩺 Diagnóstico nutricional'],
      ['objetivos', '🎯 Objetivos'],
      ['conduta', '📝 Conduta'],
      ['evolucao', '📈 Evolução']
    ];
    main.innerHTML = `
      <div class="cti-card">
        <div class="cti-card-head">🗒️ Registro de Evolução em Prontuário</div>
        <p class="cti-prompt">Monte a sua evolução escolhendo o registro correto em cada campo. A qualidade impacta a pontuação.</p>
        <div id="cti-ev-groups">${groups.map(([k, t]) => evGroup(k, t, ev[k])).join('')}</div>
        <button class="cti-btn cti-btn-primary" id="cti-ev-save">Registrar evolução →</button>
        <div class="cti-feedback" id="cti-fb" hidden></div>
        <div class="cti-after" id="cti-after" hidden>${continueBtn('Ver resultado do caso →')}</div>
      </div>`;
    main.querySelectorAll('.cti-ev-opt').forEach((b) => b.addEventListener('click', () => {
      const g = b.dataset.g;
      main.querySelectorAll(`.cti-ev-opt[data-g="${g}"]`).forEach((x) => x.classList.remove('sel'));
      b.classList.add('sel');
      ctx.evolucao[g] = parseInt(b.dataset.i, 10);
    }));
    main.querySelector('#cti-ev-save').addEventListener('click', () => saveEvolucao(main, ev, groups));
    bindContinue(main);
  }
  function evGroup(key, title, opts) {
    // embaralhar mantendo índice original
    const items = (opts || []).map((o, i) => ({ o, i }));
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
    return `<div class="cti-ev-group"><div class="cti-ev-title">${title}</div>${items.map(({ o, i }) =>
      `<button class="cti-ev-opt" data-g="${key}" data-i="${i}">${esc(o.text)}</button>`).join('')}</div>`;
  }
  function saveEvolucao(main, ev, groups) {
    if (main.querySelector('#cti-ev-save').disabled) return;
    let acertos = 0;
    groups.forEach(([k]) => {
      const sel = ctx.evolucao[k];
      const ok = sel != null && ev[k][sel] && ev[k][sel].correct;
      if (ok) acertos++; else ctx.errors++;
      main.querySelectorAll(`.cti-ev-opt[data-g="${k}"]`).forEach((b) => {
        const i = parseInt(b.dataset.i, 10);
        if (ev[k][i].correct) b.classList.add('correct');
        else if (i === sel) b.classList.add('wrong');
        b.classList.add('disabled');
      });
    });
    ctx.evQuality = acertos / groups.length;
    main.querySelector('#cti-ev-save').disabled = true;
    play(acertos === groups.length ? 'success' : 'error');
    const fb = main.querySelector('#cti-fb');
    fb.hidden = false;
    fb.className = 'cti-feedback ' + (acertos === groups.length ? 'ok' : 'warn');
    fb.innerHTML = (acertos === groups.length ? '✅ ' : '⚠️ ') + `Evolução registrada com ${acertos}/${groups.length} campos corretos.`;
    main.querySelector('#cti-after').hidden = false;
  }

  // Resultado + discussão
  function computeStars() {
    let stars = 3;
    if (ctx.critical >= 1) stars -= ctx.critical;
    if (ctx.errors >= 2) stars -= 1;
    if (ctx.confidence < 0) stars -= 1;
    if (ctx.evQuality != null && ctx.evQuality < 0.75) stars -= 1;
    return Math.max(1, Math.min(3, stars));
  }
  function renderResult(main) {
    const stars = ctx._stars = computeStars();
    const xpBase = stars === 3 ? 250 : stars === 2 ? 180 : 120;
    const mult = (window.bonusOf ? window.bonusOf('xp_multiplier', 1.0) : 1.0) || 1.0;
    const xp = ctx._xp = Math.round(xpBase * mult);
    const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const title = stars === 3 ? 'Conduta de Excelência no CTI!' : stars === 2 ? 'Boa conduta no plantão!' : 'Plantão concluído — revise os pontos críticos.';
    main.innerHTML = `
      <div class="cti-card cti-result">
        <div class="cti-stars">${starStr}</div>
        <h2>${title}</h2>
        <p class="cti-score">+${xp} XP${ctx.critical ? ` · ${ctx.critical} erro(s) crítico(s)` : ''}${ctx.confidence > 0 ? ' · família confiante 💗' : ''}</p>
        <div class="cti-discussion">
          <h4>🧠 Raciocínio clínico</h4>
          <p>${esc(C.discussion)}</p>
        </div>
        <div class="cti-concurso">
          <h4>🎓 Como cai em concurso</h4>
          <p>${esc(C.concurso)}</p>
        </div>
        ${continueBtn('Ir para o quiz de fixação →')}
      </div>`;
    play(stars === 3 ? 'success' : 'click');
    if (stars === 3 && window.spawnParticles) { try { window.spawnParticles('win'); } catch (e) { } }
    bindContinue(main);
  }

  // Quiz inline de fixação
  function renderQuiz(main) {
    ctx.quizIdx = ctx.quizIdx || 0;
    const qs = C.quiz || [];
    if (!qs.length) return finish(main);
    const q = qs[ctx.quizIdx];
    main.innerHTML = `
      <div class="cti-card cti-quiz">
        <div class="cti-card-head">🧠 Quiz de Fixação — ${ctx.quizIdx + 1}/${qs.length}</div>
        <div class="cti-quiz-bar"><div class="cti-quiz-fill" style="width:${((ctx.quizIdx) / qs.length) * 100}%"></div></div>
        <p class="cti-prompt">${esc(q.question)}</p>
        <div class="cti-options" id="cti-opts"></div>
        <div class="cti-feedback" id="cti-fb" hidden></div>
        <div class="cti-after" id="cti-after" hidden>${continueBtn(ctx.quizIdx + 1 < qs.length ? 'Próxima →' : 'Finalizar atendimento →')}</div>
      </div>`;
    const opts = main.querySelector('#cti-opts');
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'cti-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => answerQuiz(main, q, idx, btn));
      opts.appendChild(btn);
    });
    bindContinue(main, () => {
      if (ctx.quizIdx + 1 < qs.length) { ctx.quizIdx++; renderQuiz(main); }
      else finish(main);
    });
  }
  function answerQuiz(main, q, idx, btn) {
    if (main.querySelector('#cti-opts').classList.contains('locked')) return;
    main.querySelector('#cti-opts').classList.add('locked');
    main.querySelectorAll('.cti-opt').forEach((b) => b.classList.add('disabled'));
    const ok = idx === q.correct;
    if (ok) { btn.classList.add('correct'); play('success'); }
    else { btn.classList.add('wrong'); play('error'); ctx.quizWrong++; main.querySelectorAll('.cti-opt')[q.correct].classList.add('correct'); }
    const fb = main.querySelector('#cti-fb');
    fb.hidden = false;
    fb.className = 'cti-feedback ' + (ok ? 'ok' : 'warn');
    fb.innerHTML = (ok ? '✅ ' : '❌ ') + esc(q.explanation);
    main.querySelector('#cti-after').hidden = false;
  }

  function finish(main) {
    const s = S();
    s.ctiDone = s.ctiDone || [];
    if (!s.ctiDone.includes(C.id)) s.ctiDone.push(C.id);
    if (typeof s.xp === 'number') s.xp += (ctx._xp || 0);
    save();
    if (window.checkAchievements) { try { window.checkAchievements(); } catch (e) { } }
    if (main) {
      main.innerHTML = `
        <div class="cti-card cti-result">
          <div class="cti-stars">${'⭐'.repeat(ctx._stars || 1)}</div>
          <h2>Atendimento finalizado</h2>
          <p class="cti-score">Plantão do ${esc(C.patient.name)} concluído. +${ctx._xp || 0} XP somados.</p>
          <p>${ctx.quizWrong ? `Você errou ${ctx.quizWrong} questão(ões) do quiz — revise no material.` : 'Gabaritou o quiz de fixação! 🏆'}</p>
          <button class="cti-btn cti-btn-primary cti-finish">Voltar ao CTI</button>
        </div>`;
      const b = main.querySelector('.cti-finish');
      if (b) b.addEventListener('click', () => { play('click'); leave(); });
    }
    if (window.NutriWorld) { try { window.NutriWorld.refresh(); } catch (e) { } }
  }

  // ---- Painéis de referência (overlay) ----
  function openRef(kind, formulaStage) {
    if (kind === 'prontuario') openProntuario();
    else if (kind === 'antropo') openAntropo();
    else if (kind === 'exames') openLabs(ctx.maxLabDay || 0);
    else if (kind === 'formulas') openFormulas(formulaStage || null);
  }
  function showOverlay(title, html) {
    document.getElementById('cti-overlay-title').textContent = title;
    document.getElementById('cti-overlay-body').innerHTML = html;
    document.getElementById('cti-overlay').hidden = false;
  }
  function closeOverlay() { const o = document.getElementById('cti-overlay'); if (o) o.hidden = true; }

  function openProntuario() {
    const b = C.prontuarioBase;
    showOverlay('📋 Prontuário — ' + C.patient.name, `
      <div class="cti-ref-sec"><h4>👤 Identificação / Diagnóstico</h4><p>${esc(C.patient.name)}, ${esc(C.patient.age)} anos. ${esc(C.patient.diagnostico)}</p></div>
      <div class="cti-ref-sec"><h4>🗣️ Anamnese</h4><p>${esc(b.anamnese)}</p></div>
      <div class="cti-ref-sec"><h4>🍎 Avaliação Nutricional</h4><p>${esc(b.avaliacaoNutricional)}</p></div>
      <div class="cti-ref-sec"><h4>🩺 Exame Físico</h4><p>${esc(b.exameFisico)}</p></div>`);
  }
  function openAntropo() {
    showOverlay('📐 Antropometria — ' + C.patient.name,
      `<div class="cti-ref-sec"><p>${esc(C.prontuarioBase.antropometria)}</p></div>`);
  }
  function openLabs(day) {
    const lab = C.labsByDay || {};
    const maxDay = ctx.maxLabDay || 0;
    let tabs = '';
    for (let d = 0; d <= maxDay; d++) {
      if (!lab[d]) continue;
      tabs += `<button class="cti-lab-tab ${d === day ? 'sel' : ''}" data-d="${d}">${d === 0 ? 'Admissão' : d * 24 + 'h'}</button>`;
    }
    const rows = (lab[day] || []).map((e) => {
      const fl = e.flag === 'alto' ? 'up' : e.flag === 'baixo' ? 'down' : 'ok';
      const arrow = fl === 'up' ? '↑' : fl === 'down' ? '↓' : '•';
      return `<tr class="lab-${fl}"><td>${esc(e.name)}</td><td class="lab-val">${esc(e.value)} <span class="lab-arrow">${arrow}</span></td><td class="lab-ref">${esc(e.ref)}</td></tr>`;
    }).join('');
    showOverlay('🧪 Exames laboratoriais', `
      <div class="cti-lab-tabs">${tabs}</div>
      <table class="cti-lab-table"><thead><tr><th>Exame</th><th>Resultado</th><th>Referência</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="cti-lab-note">Acompanhe a evolução dos marcadores ao longo do plantão.</p>`);
    document.querySelectorAll('.cti-lab-tab').forEach((t) => t.addEventListener('click', () => openLabs(parseInt(t.dataset.d, 10))));
  }

  function openFormulas(stage) {
    const list = D().formulasEnterais || [];
    const cards = list.map((f) => `
      <div class="cti-fmla ${stage ? 'pick' : ''}" data-id="${f.id}">
        <div class="cti-fmla-head"><b>${esc(f.nome)}</b><span class="cti-fmla-brand">${esc(f.marca)}</span></div>
        <div class="cti-fmla-cat">${esc(f.categoria)}</div>
        <div class="cti-fmla-macros">
          <span>${f.densidade} kcal/ml</span><span>PTN ${f.prot} g/100ml</span>
          <span>CHO ${f.cho}</span><span>LIP ${f.lip}</span><span>Fibra ${f.fibra}</span>${f.osmo ? `<span>Osm ${f.osmo}</span>` : ''}
        </div>
        <div class="cti-fmla-line"><b>Indicações:</b> ${esc(f.indicacoes)}</div>
        <div class="cti-fmla-line"><b>Restrições:</b> ${esc(f.restricoes)}</div>
        <div class="cti-fmla-destaque">⭐ ${esc(f.destaque)}</div>
        ${stage ? '<button class="cti-btn cti-btn-primary cti-pick-btn">Selecionar esta fórmula</button>' : ''}
      </div>`).join('');
    showOverlay('📚 Central de Fórmulas Enterais', `
      ${stage ? '<p class="cti-pick-hint">Toque em <b>Selecionar</b> na fórmula que deseja prescrever.</p>' : '<p class="cti-pick-hint">Banco de fórmulas para consulta. Valores são de referência.</p>'}
      <div class="cti-fmla-grid">${cards}</div>`);
    if (stage) {
      document.querySelectorAll('.cti-fmla.pick .cti-pick-btn').forEach((b) => b.addEventListener('click', () => {
        const id = b.closest('.cti-fmla').dataset.id;
        chooseFormula(stage, id);
      }));
    }
  }

})();
