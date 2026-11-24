'use strict';
/* =========================================================
   Bibliolab Activa · Prototipo NO funcional · Aplicativo del punto físico
   Todo es simulado. El estado vive en memoria (variable S).
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- Recursos gráficos (placeholders con nombre y ruta) ---------- */
const A = {
  logo:   'img/logo-bibliolab-activa.png',
  craib:  'img/logo-craib.png',
  ie:     'img/logo-ie-boyaca.png',
  modulo: 'img/modulo-bibliolab.png',
  instr:  'img/instruccion-ejemplo.png'
};
const asset = (path, alt, cls = '') => `<img class="asset ${cls}" src="${path}" alt="${esc(alt)}" data-path="${path}" onerror="phFallback(this)">`;
window.phFallback = img => {
  const d = document.createElement('div');
  d.className = 'placeholder ' + img.className.replace('asset', '').trim();
  d.setAttribute('role', 'img'); d.setAttribute('aria-label', 'Espacio reservado: ' + img.alt);
  d.innerHTML = '<strong>' + img.alt + '</strong><code>' + img.dataset.path + '</code>';
  img.replaceWith(d);
};
/* Avatar del grupo: assets/img/avatar-grupo-1.png, -2.png, -3.png. Si no existe, muestra el número. */
window.avFallback = img => { const s = document.createElement('span'); s.className = 'av-fb'; s.textContent = img.dataset.n; img.replaceWith(s); };
const avatar = n => `<img class="av" src="assets/img/avatar-grupo-${(n - 1) % 3 + 1}.png" alt="" data-n="${n}" onerror="avFallback(this)">`;

/* ---------- Iconos ---------- */
const IC = {
  check:'<path d="M4 12l5 5L20 6"/>', close:'<path d="M5 5l14 14M19 5L5 19"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  laptop:'<rect x="4" y="5" width="16" height="11" rx="1"/><path d="M2 19h20"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
  books:'<path d="M4 20V6l6-2v16zM10 20h10M10 8l8-2v14"/>',
  speaker:'<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="15" r="3"/><circle cx="12" cy="7.5" r="1"/>',
  screen:'<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
  paper:'<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',
  nfc:'<path d="M8 8c3 3 3 5 0 8M12 6c4 4 4 8 0 12M16 4c5 5 5 11 0 16"/>',
  box:'<path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/>',
  camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
  play:'<path d="M8 5l11 7-11 7z"/>',
  book:'<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z M12 6v14"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z"/>',
  pencil:'<path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4"/>',
  group:'<circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M6 20c0-4 3-6 6-6s6 2 6 6zM1 18c0-2 1-4 3-4M23 18c0-2-1-4-3-4"/>',
  upload:'<path d="M7 17a5 5 0 1 1 1-9.9A6 6 0 0 1 19 9a4 4 0 0 1 0 8M12 20v-9M8 14l4-4 4 4"/>',
  radio:'<circle cx="12" cy="12" r="1.6"/><path d="M8 8a5.6 5.6 0 0 0 0 8M16 8a5.6 5.6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>'
};
const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const recIcon = t => { t = t.toLowerCase();
  if (/comput|port[aá]til/.test(t)) return 'laptop'; if (/micr/.test(t)) return 'mic'; if (/libro|texto|atlas|lectura/.test(t)) return 'books';
  if (/parlante|audio/.test(t)) return 'speaker'; if (/proyector|pantalla|video/.test(t)) return 'screen';
  if (/papel|cartulina|marcador|hoja|ficha/.test(t)) return 'paper'; if (/nfc|tarjeta/.test(t)) return 'nfc'; return 'box'; };

/* ---------- Datos de ejemplo (mismos códigos del prototipo docente) ---------- */
const SAMPLES = {
  K7Q2M9XP: {estado:'Programada', ficha:{titulo:'Taller de producción', asignatura:'Ciencias Naturales', grado:'6.º', enfoque:'Crea',
    objetivo:'Explicar cómo los ecosistemas dependen del agua', producto:'Maqueta o cartelera',
    momentos:[{nombre:'Apertura', min:10, texto:'Se presenta el reto y los materiales disponibles sobre ecosistemas y agua.'},
              {nombre:'Desarrollo', min:25, texto:'Cada grupo diseña y elabora su producto con apoyo de los libros del CRAIB.'},
              {nombre:'Cierre', min:10, texto:'Exhibición de los productos y comentarios del grupo.'}],
    recursos:['Libros del CRAIB', 'Computador', 'Micrófono']}},
  R4T8W2NB: {estado:'Programada', ficha:{titulo:'Puentes entre conceptos', asignatura:'Lengua Castellana', grado:'8.º', enfoque:'Conecta',
    objetivo:'Relacionar la poesía con recursos sonoros y visuales', producto:'Mapa conceptual digital',
    momentos:[{nombre:'Apertura', min:10, texto:'Se presentan los conceptos clave: poesía, sonido, imagen.'},
              {nombre:'Desarrollo', min:35, texto:'Los grupos relacionan los conceptos con videos y recursos de internet y construyen su mapa.'},
              {nombre:'Cierre', min:10, texto:'Cada grupo explica las conexiones que encontró.'}],
    recursos:['Computadores con internet', 'Videos y recursos multimedia', 'Parlante']}},
  X9L3P5CD: {estado:'Inactiva', ficha:{titulo:'Detectives de la información', asignatura:'Matemáticas', grado:'7.º', enfoque:'Explora',
    objetivo:'Investigar fracciones en situaciones cotidianas', producto:'Mapa de hallazgos',
    momentos:[{nombre:'Apertura', min:10, texto:'Presentación del reto.'}], recursos:['Hojas y marcadores']}}
};

/* ---------- Estado ---------- */
const S = {};
function resetAll() {
  clearInterval(S.iv);
  Object.assign(S, {act:null, grupos:[], started:false, closed:false, ended:false, left:0, iv:null, fails:0, lock:false, flash:0,
    fotos:[], showIns:false, err:'', cardErr:null, demo:{lector:false, camara:false}});
}
resetAll();
let demoHidden = false, demoOpen = false;
const P = {paso:'inicio', grupo:''};      // estado de la entrega local
const totalMin = f => f.momentos.reduce((s, m) => s + (+m.min || 0), 0);
const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
const fins = () => S.grupos.filter(g => g.estado === 'Finalizado').length;
const lockMsg = () => 'Hiciste varios intentos con códigos inválidos. Espera un momento antes de volver a intentar. (Número de intentos y tiempo de espera: [10 segundos])';

/* ---------- Sonido (señal sonora; siempre hay texto junto a ella) ---------- */
let ac;
function tono(k) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const seq = {ok:[[880, .12], [1175, .18]], err:[[220, .3]], fin:[[660, .12], [880, .12], [1175, .22]], play:[[523, .22], [659, .22], [784, .35]]}[k];
    let t = ac.currentTime;
    seq.forEach(([f, d]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(.18, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d); t += d; });
  } catch (e) {}
}
let avT;
function aviso(msg, tipo = 'warn', link) {
  const a = $('#aviso'); a.className = 'show ' + tipo;
  a.innerHTML = `${ic(tipo === 'ok' ? 'check' : 'info')}<span>${esc(msg)}${link ? ` <a href="${link[1]}">${link[0]}</a>` : ''}</span>`;
  clearTimeout(avT); avT = setTimeout(() => { a.className = ''; }, 6500);
}

/* ---------- Estructura común ---------- */
const DECO = `<div class="deco" aria-hidden="true">
  <svg class="dash" viewBox="0 0 420 300"><ellipse cx="210" cy="150" rx="170" ry="115" fill="none" stroke="#1f4fa3" stroke-width="6" stroke-dasharray="16 14" transform="rotate(-25 210 150)"/></svg>
  <svg class="blobs" viewBox="0 0 1920 300" preserveAspectRatio="xMidYMax slice"><g stroke="#fff3cf" stroke-width="5">
    <ellipse cx="20" cy="150" rx="110" ry="140" fill="#1c4b9b"/><ellipse cx="130" cy="270" rx="400" ry="190" fill="#1ab3dc"/>
    <ellipse cx="410" cy="300" rx="170" ry="200" fill="#f5b21a"/><ellipse cx="640" cy="310" rx="190" ry="170" fill="#d81b7a"/>
    <ellipse cx="800" cy="320" rx="140" ry="210" fill="#5aa83c" transform="rotate(12 800 320)"/><ellipse cx="1060" cy="320" rx="200" ry="170" fill="#1c4b9b"/>
    <ellipse cx="1340" cy="300" rx="210" ry="120" fill="#1ab3dc"/><ellipse cx="1620" cy="310" rx="130" ry="150" fill="#d81b7a"/>
    <ellipse cx="1850" cy="170" rx="130" ry="120" fill="#f5b21a"/><ellipse cx="1820" cy="290" rx="190" ry="190" fill="#ef6a22"/></g></svg>
  <div class="artwork"></div></div>`;
const logosR = `<div class="logos">${asset(A.craib, 'Logo CRAIB', 'logo-sm')}${asset(A.ie, 'Logo Institución Educativa Boyacá', 'logo-sm')}</div>`;
function shell(html, hd = 'full') {
  const head = hd === 'none' ? '' : `<header class="hd">${hd === 'full' ? `<div>${asset(A.logo, 'Logo Bibliolab Activa', 'logo-hd')}</div>` : '<span></span>'}${logosR}</header>`;
  $('#app').innerHTML = DECO + head + html;
  const h = $('#app h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({preventScroll:true}); }
}
const clk = () => `<span class="clk-chip">${ic('clock').replace('<svg', '<svg width="18" height="18"')} Tiempo restante: <span class="clk">${fmt(S.left)}</span></span>`;

/* ---------- Modales ---------- */
let lastFocus = null, modalKey = null;
function openModal(html, cls = '') {
  closeModal(true); lastFocus = document.activeElement;
  $('#modal-root').innerHTML = `<div class="overlay"><div class="modal ${cls}" role="dialog" aria-modal="true" aria-labelledby="m-title" tabindex="-1">${html}</div></div>`;
  const m = $('.modal'), foc = () => [...m.querySelectorAll('button,[href],input,select,textarea')].filter(e => !e.disabled);
  (foc()[0] || m).focus();
  modalKey = e => {
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'Tab') { const f = foc(); if (!f.length) return; const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  };
  document.addEventListener('keydown', modalKey);
  m.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  return m;
}
function closeModal(silent) {
  $('#modal-root').innerHTML = ''; if (modalKey) document.removeEventListener('keydown', modalKey); modalKey = null;
  if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus();
}
const xBtn = `<button class="x" data-close aria-label="Cerrar ventana">${ic('close')}</button>`;
function confirmModal({title, text, ok, cancel = 'Volver', onOk}) {
  const m = openModal(`${xBtn}<h2 id="m-title">${title}</h2><p>${text}</p><div class="row-c"><button class="btn btn-light" data-ok>${ok}</button><button class="btn btn-ghost-w" data-close>${cancel}</button></div>`);
  m.addEventListener('click', e => { if (e.target.closest('[data-ok]')) { closeModal(true); onOk(); } });
}

/* ---------- Temporizador (corre aunque cambies de pantalla) ---------- */
function startTimer() {
  clearInterval(S.iv);
  S.iv = setInterval(() => {
    if (S.left > 0) S.left--;
    document.querySelectorAll('.clk').forEach(c => { c.textContent = fmt(S.left); });
    if (S.left <= 0) { clearInterval(S.iv); S.ended = true; tono('fin'); location.hash = '#/p19'; }
  }, 1000);
}

/* ================= P12 · Ingreso del código ================= */
function p12() {
  shell(`<main class="scr"><div class="c12-in">
    <div>${asset(A.logo, 'Logo Bibliolab Activa', 'logo-c')}</div>
    <form class="cod" id="f-cod" novalidate>
      <label class="lbl" for="cod">Código de la actividad</label>
      <input id="cod" type="password" autocomplete="off" maxlength="12" placeholder="Introduce el código de actividad" ${S.lock ? 'disabled' : ''}>
      <label class="chk-inline"><input type="checkbox" id="ver"> Mostrar código</label>
      <button class="btn btn-primary btn-big" ${S.lock ? 'disabled' : ''}>Entrar</button>
    </form>
    <p id="msg" class="err" role="alert">${S.lock ? lockMsg() : ''}</p>
    <div class="row-c"><button class="btn btn-ghost" type="button" id="b-arch">¿Sin conexión? Cargar actividad desde archivo</button><input type="file" id="arch" accept=".json,application/json" class="sr-only" tabindex="-1"></div>
    <p class="note">Si no hay conexión, usa tu archivo de actividad o la ficha en PDF.</p>
    <p class="enf-words" aria-hidden="true"><span class="e1">Explora</span><span class="e2">Conecta</span><span class="e3">Crea</span><span class="e4">Colabora</span></p>
  </div></main>`, 'right');
  $('#ver').onchange = e => { $('#cod').type = e.target.checked ? 'text' : 'password'; };
  $('#b-arch').onclick = () => $('#arch').click();
  $('#arch').onchange = e => cargarArchivo(e.target.files[0]);
  $('#f-cod').onsubmit = e => {
    e.preventDefault(); if (S.lock) { $('#msg').textContent = lockMsg(); return; }
    const v = $('#cod').value.trim().toUpperCase();
    const bad = k => { S.fails++; if (S.fails >= 5) { S.lock = true; S.err = 'bloqueo'; } else S.err = k; location.hash = '#/p13'; if (location.hash === '#/p13') route(); };
    if (!/^[A-Z0-9]{8,12}$/.test(v)) return bad('formato');
    const a = SAMPLES[v]; if (!a) return bad('noexiste');
    S.fails = 0; if (a.estado === 'Inactiva') { S.err = 'inactiva'; location.hash = '#/p13'; return; }
    entrarActividad(a.ficha);
  };
}
function entrarActividad(ficha) {
  resetAll(); S.act = ficha; P.paso = 'inicio'; P.grupo = ''; location.hash = '#/p14a'; if (location.hash === '#/p14a') route();
}
function cargarArchivo(f) {
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const o = JSON.parse(r.result), x = o.ficha || o;
      const ok = x && typeof x.titulo === 'string' && Array.isArray(x.momentos) && x.momentos.length && x.momentos.every(m => m && m.nombre && Number(m.min) > 0 && m.texto) && Array.isArray(x.recursos);
      if (!ok) throw new Error('estructura');
      entrarActividad({titulo:x.titulo, asignatura:x.asignatura || '', grado:x.grado || '', enfoque:x.enfoque || '', objetivo:x.objetivo || '', producto:x.producto || '',
        momentos:x.momentos.map(m => ({nombre:String(m.nombre), min:Number(m.min), texto:String(m.texto)})), recursos:x.recursos.map(String)});
    } catch (e) { S.err = 'archivo'; location.hash = '#/p13'; if (location.hash === '#/p13') route(); }
  };
  r.onerror = () => { S.err = 'archivo'; location.hash = '#/p13'; };
  r.readAsText(f);
}

/* ================= P13 · Código inválido / actividad inactiva / archivo inválido ================= */
function p13() {
  const M = {formato:['Revisa el código.', 'El código tiene letras y números, sin espacios.'], noexiste:['Ese código no existe.', 'Verifica con tu docente e inténtalo de nuevo.'],
    inactiva:['Esta actividad no está disponible.', 'Consulta con tu docente.'], archivo:['El archivo no es válido.', 'Usa el archivo de actividad que descargó tu docente.'], bloqueo:['Ingreso bloqueado por ahora.', lockMsg()]};
  const [t, d] = M[S.err] || M.formato;
  shell(`<main class="scr"><section class="pnl" style="min-height:380px"><div style="width:70px;height:70px">${ic('info')}</div>
    <h1>${t}</h1><p>${esc(d)}</p><p class="note">Si no hay conexión, usa tu archivo de actividad o la ficha en PDF.</p>
    <div class="row-c"><a class="btn btn-light" href="#/p12">${S.lock ? 'Volver' : 'Reintentar'}</a><button class="btn btn-ghost-w" id="b-arch" type="button">Cargar actividad desde archivo</button><input type="file" id="arch" accept=".json,application/json" class="sr-only" tabindex="-1"></div></section></main>`);
  $('#b-arch').onclick = () => $('#arch').click(); $('#arch').onchange = e => cargarArchivo(e.target.files[0]);
}

/* ================= P14 · Título y ficha ================= */
function p14a() {
  if (!S.act) { location.hash = '#/p12'; return; }
  const w = S.act.titulo.split(' '), l1 = w.slice(0, 2).join(' '), l2 = w.slice(2).join(' ');
  shell(`<main class="scr"><section class="pnl pink splash" style="min-height:430px"><h1>${esc(l1)}${l2 ? `<span class="l2">${esc(l2)}</span>` : ''}</h1>
    <div class="row-c" style="margin-top:18px"><a class="btn btn-light" href="#/p14">Ver la ficha</a></div></section></main>`);
  S.timer = setTimeout(() => { if (location.hash === '#/p14a') location.hash = '#/p14'; }, 3500);
}
function p14() {
  if (!S.act) { location.hash = '#/p12'; return; }
  const f = S.act, w = f.titulo.split(' ');
  shell(`<main class="scr"><section class="pnl pnl-w"><div class="fi">
    <div><h1>${esc(w.slice(0, 2).join(' '))}${w.length > 2 ? `<span class="c">${esc(w.slice(2).join(' '))}</span>` : ''}</h1>
      ${f.objetivo ? `<p><strong>Objetivo:</strong> ${esc(f.objetivo)}</p>` : ''}
      <div class="scroll">${f.momentos.map(m => `<h3>${esc(m.nombre)} (${m.min} min):</h3><p>${esc(m.texto)}</p>`).join('')}</div></div>
    <div><div class="pill">${ic('clock')}<span>Tiempo total estimado:<br>${totalMin(f)} minutos</span></div>
      <h2 class="rec-t">Recursos:</h2>
      <div class="rec">${f.recursos.map(r => `<div><span class="c">${ic(recIcon(r))}</span>${esc(r)}</div>`).join('')}</div></div>
    <div class="fi-foot"><a class="btn btn-light" href="#/p15">Siguiente</a></div></div></section></main>`);
}

/* ================= P15 · Registro de grupos ================= */
function p15() {
  if (!S.act) { location.hash = '#/p12'; return; }
  if (S.started) { location.hash = '#/p18'; return; }
  const n = Math.max(3, S.grupos.length), cards = [];
  for (let i = 1; i <= n; i++) {
    const g = S.grupos[i - 1];
    cards.push(g ? `<div class="gc on ${S.flash === i ? 'flash' : ''}">${avatar(i)}<div class="ic4">${ic('bulb')}${ic('pencil')}${ic('group')}</div><div class="t">Grupo ${i}</div><span class="badge">${ic('check')} Activo</span></div>`
      : `<div class="gc">${avatar(i)}<div class="ic4">${ic('book')}${ic('bulb')}${ic('pencil')}${ic('group')}</div><div class="t">Esperando que sea registrada…</div></div>`);
  }
  S.flash = 0;
  shell(`<main class="scr"><div class="reg">
    <div><h1>Esperando equipos…</h1><p class="sub">En espera de que todos los equipos se unan. Registrados: ${S.grupos.length}</p><div class="cards ${n > 3 ? 'multi' : ''}">${cards.join('')}</div></div>
    <div class="nfc-box"><div class="top"><div class="nfc-card">${ic('pencil')}</div><div><h2>Acerca la tarjeta NFC al lector</h2><p>Deja que el lector lea tu tarjeta para poder ingresar como equipo.</p></div></div>
      <div class="nfc-sym"><p>El lector NFC tiene el siguiente icono:</p>${ic('radio')}<p>Acerca la tarjeta a ese símbolo.</p></div>
      <p>Una vez la acerques, espera a que suene la notificación de que ya ha sido leída correctamente.</p>
      ${S.demo.lector ? `<p class="warn-l">No pudimos leer la tarjeta. Usa el registro manual.</p>` : ''}
      <div class="nfc-actions"><button class="btn btn-ghost" id="sim">Simular tarjeta NFC (demo)</button><button class="btn btn-primary" id="ini">Iniciar actividad</button>
      <a class="link" href="#/p17">¿Falla el lector? Registro manual de grupos</a></div></div></div></main>`);
  $('#sim').onclick = () => leer('nueva');
  $('#ini').onclick = () => {
    if (!S.grupos.length) { aviso('Registra al menos un grupo para iniciar la actividad.', 'warn'); tono('err'); return; }
    S.started = true; S.left = totalMin(S.act) * 60; S.showIns = true; startTimer(); location.hash = '#/p18';
  };
}

/* Lectura de tarjeta (simulada). t: 'nueva' | 'repetida' | 'desconocida'.
   Tarjeta repetida o no reconocida -> pantalla P16 (no cambia ningún estado). */
function errTarjeta(tipo) {
  tono('err');
  if (location.hash !== '#/p16') S.cardErr = {tipo, back:location.hash || '#/p15'};
  else S.cardErr.tipo = tipo;
  location.hash = '#/p16'; if (location.hash === '#/p16') route();
}
function leer(t) {
  if (S.demo.lector) { aviso('No pudimos leer la tarjeta. Usa el registro manual.', 'err', ['Ir al registro manual', '#/p17']); tono('err'); return; }
  if (!S.act) return;
  if (S.closed) { aviso('La sesión ya está cerrada. Esta lectura no cambia nada.', 'warn'); tono('err'); return; }
  if (t === 'desconocida') return errTarjeta('desconocida');
  if (!S.started) {
    if (t === 'repetida') {
      if (!S.grupos.length) { aviso('Todavía no hay grupos registrados.', 'warn'); return; }
      return errTarjeta('repetida');
    }
    if (S.grupos.length >= 6) { aviso('Máximo de grupos de este prototipo: 6.', 'warn'); return; }
    S.grupos.push({n:S.grupos.length + 1, estado:'Activo'}); S.flash = S.grupos.length;
    aviso(`Grupo ${S.grupos.length} registrado · Estado: Activo`, 'ok'); tono('ok'); route(); return;
  }
  if (t === 'repetida') {
    if (!fins()) { aviso('Todavía ningún grupo está Finalizado.', 'warn'); return; }
    return errTarjeta('repetida');
  }
  const g = S.grupos.find(x => x.estado === 'Activo');
  if (!g) { aviso('Todos los grupos ya están Finalizados.', 'warn'); return; }
  g.estado = 'Finalizado'; aviso(`Grupo ${g.n} · Estado: Finalizado`, 'ok'); tono('ok'); route();
}

/* ================= P16 · Tarjeta NFC repetida o no reconocida ================= */
function p16() {
  if (!S.act) { location.hash = '#/p12'; return; }
  const e = S.cardErr || {tipo:'desconocida', back:S.started ? '#/p18' : '#/p15'}, rep = e.tipo === 'repetida';
  const back = e.back === '#/p16' ? (S.started ? '#/p18' : '#/p15') : e.back;
  const titulo = rep ? 'Esta tarjeta ya está registrada' : 'Tarjeta no reconocida';
  const texto = rep
    ? (S.started ? 'Ese grupo ya está Finalizado. No hace falta volver a acercar la tarjeta.' : 'Ese grupo ya hizo su registro y sigue en estado Activo. No hace falta volver a acercar la tarjeta.')
    : (S.started ? 'Esta tarjeta no está registrada en esta sesión. Acerca la tarjeta de tu grupo o pide al docente el registro manual.' : 'El lector no reconoce esta tarjeta. Prueba con la tarjeta de tu grupo o pide al docente el registro manual.');
  shell(`<main class="scr"><section class="pnl pink" style="min-height:440px" role="alert">
    <span class="ic-big">${ic(rep ? 'check' : 'info')}</span>
    <h1>${titulo}</h1><p>${texto}</p>
    <p class="note"><strong>No se cambió ningún estado.</strong> ${rep ? '' : 'Si es la tarjeta de tu grupo, avisa al docente.'}</p>
    ${S.started ? `<p>${clk()}</p>` : ''}
    <div class="row-c" style="margin-top:10px"><a class="btn btn-light btn-big" href="${back}">Volver</a><a class="btn btn-ghost-w" href="#/p17">Registro manual</a></div>
    <p class="note" style="margin-top:8px">Volverás automáticamente en unos segundos.</p></section></main>`);
  S.timer = setTimeout(() => { if (location.hash === '#/p16') location.hash = back; }, 10000);
}

/* ================= P17 · Registro manual ================= */
function p17() {
  if (!S.act) { location.hash = '#/p12'; return; }
  const back = S.started ? '#/p18' : '#/p15';
  shell(`<main class="scr"><section class="pnl" style="min-height:430px;align-items:stretch"><div class="man">
    <h1>Registro manual</h1>
    <p>${S.demo.lector ? 'El lector no está funcionando. ' : ''}Usa esta opción si el lector falla. ${S.started ? 'Puedes marcar un grupo como Finalizado o devolverlo a Activo.' : 'Agrega los grupos que participan.'}</p>
    ${S.started ? `<p>${clk()}</p>` : ''}
    ${S.closed ? '<p class="warn-l" style="color:#4a3800">La sesión está cerrada: no se pueden cambiar los estados.</p>' : ''}
    ${S.grupos.length ? `<ul class="glist">${S.grupos.map((g, i) => `<li>${avatar(g.n)}<span class="n">Grupo ${g.n}</span>
      <span class="e">${ic(g.estado === 'Activo' ? 'clock' : 'check')} ${g.estado}</span>
      ${S.started ? (g.estado === 'Activo' ? `<button class="btn btn-light" data-fin="${i}" ${S.closed ? 'disabled' : ''}>Marcar como finalizado</button>` : `<button class="btn btn-ghost-w" data-back="${i}" ${S.closed ? 'disabled' : ''}>Devolver a Activo</button>`) : ''}</li>`).join('')}</ul>`
      : '<p class="note">Aún no hay grupos registrados.</p>'}
    <div class="row-c" style="justify-content:flex-start"><button class="btn btn-light" id="add" ${S.started || S.grupos.length >= 6 || S.closed ? 'disabled' : ''}>Agregar grupo manualmente</button><a class="btn btn-ghost-w" href="${back}">Volver</a></div>
  </div></section></main>`);
  $('#add').onclick = () => { S.grupos.push({n:S.grupos.length + 1, estado:'Activo'}); aviso(`Grupo ${S.grupos.length} agregado · Estado: Activo`, 'ok'); tono('ok'); p17(); };
  document.querySelectorAll('[data-fin]').forEach(b => b.onclick = () => { const g = S.grupos[+b.dataset.fin]; g.estado = 'Finalizado'; aviso(`Grupo ${g.n} · Estado: Finalizado`, 'ok'); tono('ok'); p17(); });
  document.querySelectorAll('[data-back]').forEach(b => b.onclick = () => { const g = S.grupos[+b.dataset.back];
    confirmModal({title:'¿Devolver a Activo?', text:`El Grupo ${g.n} volverá al estado Activo. Úsalo solo para corregir un error.`, ok:'Sí, devolver a Activo', onOk:() => { g.estado = 'Activo'; aviso(`Grupo ${g.n} · Estado: Activo`, 'warn'); p17(); }}); });
}

/* ================= P18 · Instrucciones y temporizador ================= */
function abrirActividad() {
  const f = S.act, tx = `Bienvenidos a la Bibliolab. Hoy van a trabajar en el reto «${f.titulo}». Lean las instrucciones y organicen su tiempo.`;
  const m = openModal(`${xBtn}<h2 id="m-title">${esc(f.titulo)}</h2><p>${clk()}</p>
    <div class="ins"><div>${f.objetivo ? `<h3>Objetivo</h3><p>${esc(f.objetivo)}</p>` : ''}
      ${f.momentos.map(x => `<h3>${esc(x.nombre)} (${x.min} min)</h3><p>${esc(x.texto)}</p>`).join('')}
      ${f.producto ? `<h3>Producto esperado</h3><p>${esc(f.producto)}</p>` : ''}
      <div class="audio"><button class="btn btn-light" id="play" type="button">${ic('play')} Escuchar instrucciones (ejemplo)</button>
        <p class="tx"><strong>Texto del audio:</strong> ${esc(tx)}</p></div></div>
      <div>${asset(A.instr, 'Imagen de ejemplo de la instrucción', 'insimg')}<p class="note" style="margin-top:8px">Si un recurso no carga, las instrucciones siguen en texto.</p></div></div>
    <div class="row-c"><button class="btn btn-light" data-close>Volver al temporizador</button></div>`);
  $('#play', m).onclick = () => tono('play');
}
function p18() {
  if (!S.act) { location.hash = '#/p12'; return; }
  if (!S.started) { location.hash = '#/p15'; return; }
  shell(`<main class="scr"><div class="t-wrap"><section class="pnl tpl"><p class="tl">Tiempo restante:</p>
    <p class="clock clk" role="timer" aria-live="off">${fmt(S.left)}</p>
    <p class="d">Completa la actividad antes de que el tiempo se agote.</p>
    <div class="faces">${S.grupos.map(g => `<span class="f ${g.estado === 'Finalizado' ? 'on' : ''}" title="Grupo ${g.n}: ${g.estado}">${avatar(g.n)}</span>`).join('')}</div>
    <p class="fin-count">Finalizados ${fins()} de ${S.grupos.length}</p></section>
    <aside class="nfc-side"><h3>Acercar tarjeta NFC</h3><p>Si completaste la actividad, acerca la tarjeta NFC del grupo al lector para registrar que han terminado.</p>${ic('radio')}
      ${S.demo.lector ? '<p class="warn-l">Lector con falla: usa el registro manual.</p>' : ''}<button class="btn btn-light" id="sim" style="margin-top:6px;padding:8px 16px;font-size:14px">Simular tarjeta NFC (demo)</button></aside>
    <div class="t-bar"><button class="btn btn-light" id="ver">Volver a ver la actividad</button><a class="btn btn-ghost-w" style="color:#14275a;border-color:#14275a" href="#/p17">Registro manual</a>
      <button class="btn btn-ghost" id="terminar">Terminar actividad (docente)</button></div></div></main>`);
  $('#ver').onclick = abrirActividad;
  $('#sim').onclick = () => leer('nueva');
  $('#terminar').onclick = () => confirmModal({title:'¿Terminar la actividad ahora?', text:'Se detendrá el temporizador. Los grupos que no estén Finalizados permanecerán Activos.', ok:'Sí, terminar', onOk:() => { clearInterval(S.iv); S.ended = true; location.hash = '#/p19'; }});
  if (S.showIns) { S.showIns = false; abrirActividad(); }
}

/* ================= P19 · Resumen de cierre ================= */
function p19() {
  if (!S.act) { location.hash = '#/p12'; return; }
  const act = S.grupos.length - fins();
  shell(`<main class="scr"><section class="pnl" style="min-height:440px"><h1 class="y">${S.closed ? 'Sesión cerrada' : 'Actividad Finalizada'}</h1>
    <p>${S.closed ? 'La sesión se cerró. Nuevas lecturas de tarjeta no cambian nada.' : S.left <= 0 ? 'El tiempo se ha agotado.' : 'La actividad terminó.'}</p>
    <p class="big-n">Finalizados ${fins()} de ${S.grupos.length}</p>
    <div class="chips">${S.grupos.map(g => `<span class="chip ${g.estado === 'Finalizado' ? 'fin' : ''}">${ic(g.estado === 'Finalizado' ? 'check' : 'clock')} Grupo ${g.n} · ${g.estado}</span>`).join('')}</div>
    ${act ? '<p class="note">Los grupos pendientes permanecen Activos; el sistema no los penaliza ni infiere resultados.</p>' : ''}
    <div class="row-c" style="margin-top:12px"><a class="btn btn-light" href="#/p20">Entregar evidencias</a>
      ${S.closed ? '<a class="btn btn-ghost-w" href="#/p12">Volver al inicio</a>' : '<button class="btn btn-ghost-w" id="cerrar">Cerrar sesión (docente)</button>'}
      <button class="btn btn-ghost-w" id="simc" type="button">Simular tarjeta (demo)</button></div></section></main>`);
  $('#simc').onclick = () => leer('nueva');
  const c = $('#cerrar');
  if (c) c.onclick = () => confirmModal({title:'¿Cerrar la sesión?', ok:'Sí, cerrar sesión',
    text: act ? `Quedan ${act} grupo(s) Activo(s). Permanecerán Activos y las nuevas lecturas no cambiarán nada.` : 'Todos los grupos están Finalizados. Después de cerrar, nuevas lecturas no cambian nada.',
    onOk:() => { clearInterval(S.iv); S.closed = true; S.ended = true; p19(); }});
}

/* ================= P20 · Tipo de entrega ================= */
function p20() {
  if (!S.act) { location.hash = '#/p12'; return; }
  shell(`<main class="scr"><section class="pnl"><h1 class="y">Entrega de evidencias</h1>
    <p>Elijan cómo entregar el producto del grupo. Se entrega el producto, no a las personas.</p>
    <div class="row-c" style="margin:14px 0"><a class="btn btn-light btn-big" href="#/p20b">Entregar al docente</a><a class="btn btn-light btn-big" href="#/p21">Entrega local</a></div>
    <div class="row-c"><a class="btn btn-ghost-w" href="#/p22">Ver galería del punto físico</a><a class="btn btn-ghost-w" href="#/p19">Volver</a></div></section></main>`);
}
function p20b() {
  if (!S.act) { location.hash = '#/p12'; return; }
  shell(`<main class="scr"><section class="pnl pnl-w" style="min-height:480px"><h1>Cómo entregar tu producto <span class="y">al docente</span></h1>
    <p>Estos son los pasos para compartir el producto del grupo.</p>
    <div class="steps4">
      <div class="stp"><span class="num">1</span>${ic('paper')}<br>Reúnan el producto del grupo: un archivo, un enlace o una descripción.</div>
      <div class="stp"><span class="num">2</span>${ic('group')}<br>Compártanlo con su docente por el medio que él indique.</div>
      <div class="stp"><span class="num">3</span>${ic('upload')}<br>El docente lo sube a la plataforma web con el código de la actividad.</div>
      <div class="stp"><span class="num">4</span>${ic('image')}<br>Listo: el producto queda en la galería de evidencias de la actividad.</div></div>
    <p class="note">Recuerden: sin rostros ni nombres de estudiantes.</p>
    <div class="row-c"><a class="btn btn-light" href="#/p20">Regresar</a></div></section></main>`);
}

/* ================= P21 · Entrega local ================= */
function condiciones() {
  openModal(`${xBtn}<h2 id="m-title">Condiciones de uso de las evidencias</h2><ul>
    <li><strong>Fotografía el producto, no a las personas.</strong> Sin rostros ni nombres.</li>
    <li>Si el material permite identificar a una persona, se necesita la autorización de quien corresponda.</li>
    <li>Las fotos se consultan solo desde el punto físico y desde la actividad con su código.</li>
    <li>Tiempo que se conservan las fotos: <span class="tag-pd">[10 dias]</span></li></ul>
    <div class="row-c"><button class="btn btn-light" data-close>Entendido</button></div>`, 'light');
}
function p21() {
  if (!S.act) { location.hash = '#/p12'; return; }
  const paso = P.paso;
  const right = paso === 'inicio' ? asset(A.modulo, 'Foto del módulo Bibliolab Activa en la biblioteca', 'mod')
    : paso === 'preview' ? `<div class="preview" role="img" aria-label="Vista previa de la foto del producto (simulada)">${ic('image')}<p>Vista previa de la foto (simulada)</p></div>`
    : `<div class="ok-box">${ic('check')}<strong>¡Foto guardada!</strong><span>Grupo ${esc(P.grupo)} · guardada en la galería del punto físico.</span></div>`;
  const btns = paso === 'inicio' ? `<button class="btn btn-light" id="foto">${ic('camera')} Tomar foto</button>`
    : paso === 'preview' ? `<button class="btn btn-ghost-w" id="repetir">Repetir foto</button><button class="btn btn-light" id="conf">Confirmar</button>`
    : `<button class="btn btn-ghost-w" id="otra">Tomar otra foto</button><a class="btn btn-light" href="#/p22">Ver galería</a><a class="btn btn-ghost-w" href="#/p20">Volver</a>`;
  shell(`<main class="scr"><section class="pnl pnl-l"><div class="l-left"><h1>Entrega Local</h1>
    <p>Cada grupo se pasa frente a la pantalla y toma una foto de su producto.</p><p class="strong">Fotografíen el producto, no a las personas.</p>
    <div class="field"><label for="gnum">Número de grupo</label><input id="gnum" type="number" min="1" max="20" value="${esc(P.grupo)}" ${paso === 'ok' ? 'disabled' : ''}></div>
    <p id="e21" class="err" role="alert"></p>
    <p class="note">La foto se guarda en la galería del punto físico. Cuánto tiempo se conserva: <span class="tag-pd">[10 dias]</span>. <button class="link" id="cond" type="button">Ver condiciones de uso</button></p></div>
    <div class="l-right">${right}<div class="row-c">${btns}</div></div></section></main>`);
  const g = $('#gnum'); g.oninput = () => { P.grupo = g.value; };
  $('#cond').onclick = condiciones;
  if ($('#foto')) $('#foto').onclick = () => {
    if (!(+g.value >= 1)) { $('#e21').textContent = 'Escribe el número de tu grupo.'; g.focus(); return; }
    if (S.demo.camara) { aviso('No se detectó una cámara. Entrega el producto al docente.', 'err', ['Ver cómo entregarlo', '#/p20b']); tono('err'); return; }
    P.grupo = g.value; P.paso = 'preview'; p21();
  };
  if ($('#repetir')) $('#repetir').onclick = () => { P.paso = 'inicio'; p21(); };
  if ($('#conf')) $('#conf').onclick = () => { S.fotos.push({grupo:P.grupo, hora:new Date().toLocaleTimeString('es-CO', {hour:'2-digit', minute:'2-digit'})}); P.paso = 'ok'; tono('ok'); aviso('Foto guardada en la galería del punto físico.', 'ok'); p21(); };
  if ($('#otra')) $('#otra').onclick = () => { P.paso = 'inicio'; P.grupo = ''; p21(); };
}

/* ================= P22 · Galería del punto físico (solo consulta) ================= */
function p22() {
  if (!S.act) { location.hash = '#/p12'; return; }
  shell(`<main class="scr"><section class="pnl pnl-w" style="min-height:460px"><h1>Galería del punto físico</h1>
    <p class="note">Solo consulta: aquí no se puede eliminar ni modificar. Sin nombres ni datos de estudiantes. Tiempo de conservación: <span class="tag-pd">[5 dias]</span></p>
    ${S.fotos.length ? `<div class="gal">${S.fotos.map(f => `<div class="ph">${ic('image')}Grupo ${esc(f.grupo)}<small>${f.hora}</small></div>`).join('')}</div>` : '<div class="empty" role="status">Aún no hay fotos</div>'}
    <div class="row-c" style="margin-top:14px"><a class="btn btn-light" href="#/p20">Volver</a></div></section></main>`);
}

/* ================= Router ================= */
const R = {p12, p13, p14a, p14, p15, p16, p17, p18, p19, p20, p20b, p21, p22};
function route() {
  clearTimeout(S.timer); closeModal(true);
  const k = (location.hash.replace(/^#\/?/, '') || 'p12').toLowerCase();
  (R[k] || p12)(); renderDemo();
}
window.addEventListener('hashchange', route);

/* ================= Escala y panel de demostración ================= */
function fit() {
  const k = Math.min(innerWidth / 1280, innerHeight / 720), st = $('#stage');
  st.style.width = (innerWidth / k) + 'px'; st.style.height = (innerHeight / k) + 'px'; st.style.transform = `scale(${k})`;
}
addEventListener('resize', fit);

function renderDemo() {
  const r = $('#demo-root');
  if (demoHidden) { r.innerHTML = ''; return; }
  r.innerHTML = `<button class="demo-btn" id="d-t" aria-expanded="${demoOpen}">Modo demo</button>${demoOpen ? `<div class="demo-panel" role="region" aria-label="Panel de demostración"><h2>Modo demo (no es parte del producto)</h2>
    <label><input type="checkbox" id="d-lec" ${S.demo.lector ? 'checked' : ''}> Falla del lector NFC</label>
    <label><input type="checkbox" id="d-cam" ${S.demo.camara ? 'checked' : ''}> Sin cámara (entrega local)</label>
    <div>Tarjeta: <button id="d-n">Nueva / lectura</button><button id="d-r">Ya registrada</button><button id="d-u">No reconocida</button></div>
    <div><button id="d-fin">Terminar tiempo</button><button id="d-lock">Bloquear ingreso</button><button id="d-reset">Reiniciar demo</button></div>
    <hr><div>Cargar directo: <button data-c="K7Q2M9XP">K7Q2M9XP</button><button data-c="R4T8W2NB">R4T8W2NB</button></div>
    <div>Ir a: ${['p12','p13','p14a','p14','p15','p16','p17','p18','p19','p20','p20b','p21','p22'].map(p => `<button data-go="${p}">${p.toUpperCase()}</button>`).join('')}</div>
    <hr><div><button id="d-json">Descargar archivo de actividad de ejemplo (.json)</button></div>
    <div style="margin-top:6px">Códigos: <code>K7Q2M9XP</code> y <code>R4T8W2NB</code> (Programada), <code>X9L3P5CD</code> (Inactiva)</div>
    <hr><button id="d-h">Ocultar panel (Shift+D lo vuelve a mostrar)</button></div>` : ''}`;
  $('#d-t').onclick = () => { demoOpen = !demoOpen; renderDemo(); };
  if (!demoOpen) return;
  $('#d-lec').onchange = e => { S.demo.lector = e.target.checked; route(); };
  $('#d-cam').onchange = e => { S.demo.camara = e.target.checked; };
  $('#d-n').onclick = () => leer('nueva'); $('#d-r').onclick = () => leer('repetida'); $('#d-u').onclick = () => leer('desconocida');
  $('#d-fin').onclick = () => { if (S.started && !S.ended) { S.left = 5; document.querySelectorAll('.clk').forEach(c => { c.textContent = fmt(S.left); }); } else aviso('Primero inicia la actividad.', 'warn'); };
  $('#d-lock').onclick = () => { S.lock = true; S.err = 'bloqueo'; location.hash = '#/p13'; route(); };
  $('#d-reset').onclick = () => { resetAll(); P.paso = 'inicio'; P.grupo = ''; demoOpen = true; location.hash = '#/p12'; route(); };
  $('#d-h').onclick = () => { demoHidden = true; renderDemo(); };
  r.querySelectorAll('[data-c]').forEach(b => b.onclick = () => entrarActividad(SAMPLES[b.dataset.c].ficha));
  r.querySelectorAll('[data-go]').forEach(b => b.onclick = () => {
    const p = b.dataset.go;
    if (!S.act && !['p12', 'p13'].includes(p)) S.act = SAMPLES.K7Q2M9XP.ficha;
    if (p === 'p13' && !S.err) S.err = 'noexiste';
    if (['p18'].includes(p) && !S.started) { if (!S.grupos.length) S.grupos = [{n:1, estado:'Activo'}, {n:2, estado:'Activo'}]; S.started = true; S.left = totalMin(S.act) * 60; startTimer(); }
    if (p === 'p19' && !S.grupos.length) S.grupos = [{n:1, estado:'Finalizado'}, {n:2, estado:'Activo'}];
    location.hash = '#/' + p; route();
  });
  $('#d-json').onclick = () => {
    const f = SAMPLES.K7Q2M9XP.ficha, blob = new Blob([JSON.stringify({formato:'bibliolab-actividad', version:1, ...f}, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'actividad-ejemplo.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
}
document.addEventListener('keydown', e => { if (e.shiftKey && e.key === 'D' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) { demoHidden = !demoHidden; renderDemo(); } });

fit(); route();