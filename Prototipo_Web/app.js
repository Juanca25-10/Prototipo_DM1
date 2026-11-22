'use strict';
/* =========================================================
   Bibliolab Activa · Prototipo NO funcional · Plataforma docente
   Todo es simulado. El estado vive en memoria (variable S / store).
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- Recursos gráficos (placeholders) ----------
   Si el archivo existe en la ruta, se muestra. Si no, aparece un recuadro
   con el nombre y la ruta que debes poner. */
const A = {
  logo:       'assets/img/logo-bibliolab-activa.png',
  craib:      'assets/img/logo-craib.png',
  ie:         'assets/img/logo-ie-boyaca.png',
  docente:    'assets/img/personaje-docente.png',
  estudiante: 'assets/img/personaje-estudiante.png',
  caritas:    'assets/img/caritas-grupo.png'
};
function asset(path, alt, cls = '') {
  return `<img class="asset ${cls}" src="${path}" alt="${esc(alt)}" data-path="${path}" onerror="phFallback(this)">`;
}
window.phFallback = img => {
  const d = document.createElement('div');
  d.className = 'placeholder ' + img.className.replace('asset', '').trim();
  d.setAttribute('role', 'img');
  d.setAttribute('aria-label', 'Espacio reservado: ' + img.alt);
  d.innerHTML = '<strong>' + img.alt + '</strong><code>' + img.dataset.path + '</code>';
  img.replaceWith(d);
};

/* ---------- Iconos (SVG en línea) ---------- */
const IC = {
  book:'<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z M12 6v14"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z"/>',
  pencil:'<path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4"/>',
  group:'<circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M6 20c0-4 3-6 6-6s6 2 6 6zM1 18c0-2 1-4 3-4M23 18c0-2-1-4-3-4"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
  download:'<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>',
  check:'<path d="M4 12l5 5L20 6"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  upload:'<path d="M7 17a5 5 0 1 1 1-9.9A6 6 0 0 1 19 9a4 4 0 0 1 0 8M12 20v-9M8 14l4-4 4 4"/>',
  close:'<path d="M5 5l14 14M19 5L5 19"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  left:'<path d="M15 5l-7 7 7 7"/>', right:'<path d="M9 5l7 7-7 7"/>'
};
const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

/* ---------- Datos de ejemplo ---------- */
const ASIGNATURAS = ['Ciencias Naturales','Ciencias Sociales','Lengua Castellana','Matemáticas','Inglés','Educación Artística','Tecnología e Informática','Educación Física','Ética y Valores'];
const GRADOS = ['1.º','2.º','3.º','4.º','5.º','6.º','7.º','8.º','9.º','10.º','11.º'];
const ENFOQUES = {
  explora:  {n:'Explora',  d:'Indagación, lectura activa y búsqueda bibliográfica/digital.'},
  conecta:  {n:'Conecta',  d:'Relación de conceptos con recursos multimediales e internet.'},
  crea:     {n:'Crea',     d:'Producción de contenidos (podcast, video, piezas gráficas).'},
  colabora: {n:'Colabora', d:'Dinámicas grupales y co-construcción de productos.'}
};
/* Catálogo simulado de plantillas: 2 borradores por enfoque. {kw} = palabras clave del objetivo; {asig} = asignatura */
const CATALOGO = {
  explora: [
    {titulo:'Detectives de la información', producto:'Mapa de hallazgos con las fuentes consultadas',
     m:[['Apertura',10,'Presentación del reto y recorrido por la colección del CRAIB para ubicar fuentes sobre {kw}.'],['Desarrollo',35,'Cada grupo busca y lee fuentes impresas y digitales sobre {kw} y registra sus hallazgos.'],['Cierre',15,'Los grupos cuentan qué encontraron y comparan las fuentes que usaron.']],
     r:['Libros de la colección de {asig}','Computadores con internet','Hojas y marcadores']},
    {titulo:'Expedición bibliográfica', producto:'Ficha de lectura grupal',
     m:[['Apertura',10,'Se plantea una pregunta guía sobre {kw}.'],['Desarrollo',30,'Lectura activa de textos seleccionados y búsqueda de respuestas a la pregunta guía.'],['Cierre',10,'Puesta en común de respuestas y de nuevas preguntas.']],
     r:['Textos seleccionados del CRAIB','Fichas de lectura','Computador']}
  ],
  conecta: [
    {titulo:'Puentes entre conceptos', producto:'Mapa conceptual digital',
     m:[['Apertura',10,'Se presentan los conceptos clave: {kw}.'],['Desarrollo',35,'Los grupos relacionan los conceptos con videos y recursos de internet y construyen su mapa.'],['Cierre',10,'Cada grupo explica las conexiones que encontró.']],
     r:['Computadores con internet','Videos y recursos multimedia','Parlante']},
    {titulo:'De la pantalla al aula', producto:'Presentación breve con los conceptos conectados',
     m:[['Apertura',15,'Observación de un recurso multimedia relacionado con {kw}.'],['Desarrollo',30,'Los grupos buscan recursos que amplíen el tema y los relacionan con lo visto en clase.'],['Cierre',15,'Presentación corta de lo conectado.']],
     r:['Computadores con internet','Proyector o pantalla','Libros de la colección de {asig}']}
  ],
  crea: [
    {titulo:'Cápsula creativa', producto:'Cápsula de audio o video corta',
     m:[['Apertura',15,'Presentación del reto: contar {kw} en una cápsula. Recorrido por las fuentes del CRAIB.'],['Desarrollo',35,'Los grupos consultan, escriben el guion y graban su cápsula.'],['Cierre',10,'Escucha o visualización de las cápsulas y comentarios.']],
     r:['Libros de la colección de {asig}','Computadores','Micrófono']},
    {titulo:'Taller de producción', producto:'Maqueta o cartelera',
     m:[['Apertura',10,'Se presenta el reto y los materiales disponibles sobre {kw}.'],['Desarrollo',25,'Cada grupo diseña y elabora su producto con apoyo de los libros del CRAIB.'],['Cierre',10,'Exhibición de los productos y comentarios del grupo.']],
     r:['Libros del CRAIB','Papel, cartulina y marcadores','Computador']}
  ],
  colabora: [
    {titulo:'Construcción en equipo', producto:'Producto grupal construido entre todos',
     m:[['Apertura',10,'Se reparten roles y se presenta el reto sobre {kw}.'],['Desarrollo',35,'Los grupos construyen un producto común y se turnan las tareas.'],['Cierre',15,'Cada grupo muestra su producto y cuenta cómo se organizó.']],
     r:['Mesas de trabajo','Libros de la colección de {asig}','Papel y marcadores']},
    {titulo:'Mesa de saberes', producto:'Cartelera colectiva',
     m:[['Apertura',10,'Cada integrante aporta una idea inicial sobre {kw}.'],['Desarrollo',30,'Se ponen en común las ideas y se arma una cartelera entre todos.'],['Cierre',10,'Lectura de la cartelera y acuerdos finales.']],
     r:['Cartulina y marcadores','Libros del CRAIB','Computador']}
  ]
};
const STOP = new Set(['para','como','mediante','desde','entre','sobre','donde','cuando','todos','todas','cada','esto','estos','estas','mismo','través','partir','forma','manera']);
function keywords(obj) {
  const w = (obj || '').toLowerCase().replace(/[^a-záéíóúñü\s]/g, ' ').split(/\s+/).filter(x => x.length >= 5 && !STOP.has(x));
  return (w.slice(0, 3).join(', ')) || 'el tema';
}
function makeFicha(form, idx) {
  const c = CATALOGO[form.enfoque][idx], kw = keywords(form.objetivo);
  const fill = t => t.replaceAll('{kw}', kw).replaceAll('{asig}', form.asignatura);
  return {
    titulo: c.titulo, asignatura: form.asignatura, grado: form.grado, enfoque: form.enfoque, objetivo: form.objetivo,
    producto: c.producto,
    momentos: c.m.map(([nombre, min, texto]) => ({nombre, min, texto: fill(texto)})),
    recursos: c.r.map(fill)
  };
}
const store = {};
function seed() {
  Object.keys(store).forEach(k => delete store[k]);
  const f1 = makeFicha({asignatura:'Ciencias Naturales', grado:'6.º', enfoque:'crea', objetivo:'Explicar cómo los ecosistemas dependen del agua'}, 1);
  f1.recursos = ['Libros del CRAIB','Computador','Micrófono']; f1.producto = 'Maqueta o cartelera';
  store.K7Q2M9XP = {codigo:'K7Q2M9XP', estado:'Programada', fecha:'', ficha:f1, evid:[
    {tipo:'archivo', nombre:'cartelera-ecosistemas.pdf', grupo:'Grupo 1'},
    {tipo:'enlace', nombre:'https://ejemplo.org/maqueta-agua', grupo:'Grupo 2'},
    {tipo:'descripcion', nombre:'Maqueta hecha con cartón y plastilina', grupo:'Grupo 3'}]};
  store.R4T8W2NB = {codigo:'R4T8W2NB', estado:'Programada', fecha:'', evid:[],
    ficha:makeFicha({asignatura:'Lengua Castellana', grado:'8.º', enfoque:'conecta', objetivo:'Relacionar la poesía con recursos sonoros y visuales'}, 0)};
  store.X9L3P5CD = {codigo:'X9L3P5CD', estado:'Inactiva', fecha:'', evid:[],
    ficha:makeFicha({asignatura:'Matemáticas', grado:'7.º', enfoque:'explora', objetivo:'Investigar fracciones en situaciones cotidianas'}, 0)};
}

/* ---------- Estado de la sesión ---------- */
const S = {};
function resetState() {
  Object.assign(S, {
    form:{asignatura:'', grado:'', objetivo:'', enfoque:''}, idx:0, draft:null, edited:false, editing:false,
    fecha:'', current:null, justCreated:false, fails:0, lock:false, timer:null, iv:null,
    up:{modo:'archivo', file:null, enlace:'', desc:'', grupo:'', ok:false},
    demo:{conexion:false, subida:false, sinPlantilla:false, descarga:false}
  });
}
resetState(); seed();
let demoHidden = false, demoOpen = false;

/* ---------- Utilidades ---------- */
const hoy = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const fmtFecha = iso => iso ? new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', {day:'numeric', month:'long', year:'numeric'}) : 'Sin fecha estimada';
const totalMin = f => f.momentos.reduce((s, m) => s + (+m.min || 0), 0);
function genCodigo() {
  const ch = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c;
  do { c = Array.from({length:8}, () => ch[Math.floor(Math.random() * ch.length)]).join(''); } while (store[c]);
  return c;
}
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 4200);
}
function view(html) {
  $('#app').innerHTML = html;
  window.scrollTo(0, 0);
  const h = $('#app h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({preventScroll:true}); }
}
function cabecera(n) {
  return `<header class="top"><div>${asset(A.logo, 'Logo Bibliolab Activa', 'logo-main')}</div>${n ? steps(n) : ''}
  <div class="logos">${asset(A.craib, 'Logo CRAIB', 'logo-sm')}${asset(A.ie, 'Logo Institución Educativa Boyacá', 'logo-sm')}</div></header>`;
}
function steps(n) {
  const L = ['Objetivo','Propuesta','Fecha','Código'];
  return `<nav aria-label="Pasos para crear la actividad"><ol class="steps">${L.map((t, i) => {
    const k = i + 1, cls = k < n ? 'done' : '';
    return `<li class="${cls}" ${k === n ? 'aria-current="step"' : ''}><span class="n">${k < n ? ic('check') : k}</span>${t}${k < n ? '<span class="sr-only"> (completado)</span>' : ''}</li>`;
  }).join('')}</ol></nav>`;
}

/* ---------- Modales ---------- */
let lastFocus = null, modalKey = null, modalClose = null;
function openModal(html, cls = '', onClose = null) {
  closeModal(true); modalClose = onClose; lastFocus = document.activeElement;
  const r = $('#modal-root');
  r.innerHTML = `<div class="overlay"><div class="modal ${cls}" role="dialog" aria-modal="true" aria-labelledby="m-title" tabindex="-1">${html}</div></div>`;
  const m = $('.modal', r);
  const foc = () => [...m.querySelectorAll('button,[href],input,select,textarea')].filter(e => !e.disabled);
  (foc()[0] || m).focus();
  modalKey = e => {
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'Tab') {
      const f = foc(); if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  };
  document.addEventListener('keydown', modalKey);
  return m;
}
function closeModal(silent) {
  const cb = modalClose; modalClose = null;
  $('#modal-root').innerHTML = '';
  if (modalKey) document.removeEventListener('keydown', modalKey); modalKey = null;
  if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  if (!silent && cb) cb();
}
const xBtn = `<button class="x" data-close aria-label="Cerrar ventana">${ic('close')}</button>`;
function confirmModal({title, text, ok, cancel = 'Volver', cls = 'pink', onOk}) {
  const m = openModal(`${xBtn}<h2 id="m-title">${title}</h2><p>${text}</p>
    <div class="row"><button class="btn btn-light" data-ok>${ok}</button><button class="btn ${cls === 'pink' ? 'btn-pink' : 'btn-ghost'}" style="border-color:#fff;color:#fff" data-close>${cancel}</button></div>`, cls);
  m.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) closeModal();
    if (e.target.closest('[data-ok]')) { closeModal(true); onOk(); }
  });
}

/* ---------- P23 · Condiciones de uso de las evidencias ---------- */
function condicionesHTML() {
  return `<ul>
    <li><strong>Sube el producto, no a las personas.</strong> Comparte lo que hizo el grupo (cartelera, maqueta, archivo), sin rostros ni nombres.</li>
    <li>Si el material permite identificar a una persona, necesitas la <strong>autorización</strong> de quien corresponda antes de subirlo.</li>
    <li>Las evidencias solo se consultan con el <strong>código de la actividad</strong>.</li>
    <li>Tiempo que se conservan las evidencias: <span class="tag-pd">[5 Dias]</span></li>
  </ul>`;
}
function p23() {
  view(`${cabecera()}<main class="page"><div class="card upl"><h1>Condiciones de uso de las evidencias</h1>${condicionesHTML()}
    <div class="row"><button class="btn btn-primary" onclick="history.length>1?history.back():(location.hash='#/p1')">Volver</button></div></div></main>`);
}
function abrirCondiciones() {
  const m = openModal(`${xBtn}<h2 id="m-title">Condiciones de uso de las evidencias</h2>${condicionesHTML()}
    <div class="row"><button class="btn btn-primary" data-close>Entendido</button></div>`, 'light');
  m.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
}

/* ================= P1 · Inicio ================= */
const LOGO_W = 'assets/img/logo-bibliolab-activa-blanco.png';
const HOME_DECO = `<div class="home-deco" aria-hidden="true">
  <svg style="left:0;top:0" width="150" height="90" viewBox="0 0 150 90"><ellipse cx="0" cy="22" rx="95" ry="68" fill="#f2b81c" stroke="#fff3cf" stroke-width="4"/></svg>
  <svg style="right:0;top:0" width="640" height="360" viewBox="0 0 640 360">
    <circle cx="450" cy="30" r="195" fill="none" stroke="#1f4fa3" stroke-width="4" stroke-dasharray="14 12"/>
    <g stroke="#fff3cf" stroke-width="4"><ellipse cx="225" cy="8" rx="150" ry="62" fill="#e6197a"/><ellipse cx="370" cy="-6" rx="125" ry="62" fill="#f2b81c"/><ellipse cx="545" cy="65" rx="130" ry="112" fill="#1fb5d6"/><ellipse cx="640" cy="250" rx="80" ry="100" fill="#1f4fa3"/></g></svg>
  <svg style="right:0;top:330px" width="150" height="280" viewBox="0 0 150 280"><circle cx="120" cy="140" r="130" fill="none" stroke="#1f4fa3" stroke-width="4" stroke-dasharray="14 12"/></svg></div>`;
function homeHTML() {
  return `<main class="page home">${HOME_DECO}<div class="home-in">
    <div class="vert" aria-hidden="true"><span class="v1">Explora</span><span class="v2">Conecta</span><span class="v3">Crea</span><span class="v4">Colabora</span></div>
    <div class="home-char">${asset(A.docente, 'Personaje docente (ilustración)', 'char-big')}</div>
    <section class="home-text">
      <div>${asset(A.logo, 'Logo Bibliolab Activa', 'logo-hero')}</div>
      <h1>Transforma tus objetivos pedagógicos en experiencias.</h1>
      <p class="lead">Selecciona una opción para comenzar o gestionar tu actividad.</p>
      <form class="code-form" id="f-code" novalidate>
        <div class="field"><label class="sr-only" for="codigo">Código de la actividad</label>
          <input id="codigo" type="text" autocomplete="off" maxlength="12" placeholder="Introduce el código de actividad" aria-describedby="codigo-msg" ${S.lock ? 'disabled' : ''}></div>
        <button class="btn btn-primary" ${S.lock ? 'disabled' : ''}>Cargar / Editar</button>
      </form>
      <p id="codigo-msg" class="err" role="alert">${S.lock ? lockMsg() : ''}</p>
    </section>
    <div class="home-logos">${asset(A.craib, 'Logo CRAIB', 'logo-sm')}${asset(A.ie, 'Logo Institución Educativa Boyacá', 'logo-sm')}</div>
    <a class="cta-bar" href="#/p2">Crear una actividad +</a></div></main>`;
}
function p1() { view(homeHTML()); $('#f-code').addEventListener('submit', consultar); }
const lockMsg = () => 'Hiciste varios intentos con códigos inválidos. Espera un momento antes de volver a intentar. (Número de intentos y tiempo de espera: [por definir])';
function consultar(e) {
  e.preventDefault();
  const msg = $('#codigo-msg'), v = $('#codigo').value.trim().toUpperCase();
  const bad = t => {
    S.fails++;
    if (S.fails >= 5) { S.lock = true; $('#codigo').disabled = true; $('#f-code button').disabled = true; msg.textContent = lockMsg(); }
    else msg.textContent = t;
  };
  if (S.lock) { msg.textContent = lockMsg(); return; }
  if (!/^[A-Z0-9]{8,12}$/.test(v)) return bad('Revisa el código.');
  const a = store[v];
  if (!a) return bad('Ese código no existe.');
  S.fails = 0;
  if (a.estado === 'Inactiva') { msg.textContent = 'Esta actividad no está disponible.'; return; }
  S.current = a; S.justCreated = false; location.hash = '#/p7';
}

/* ================= P2 · Qué es "Crear una actividad" (ventana sobre el inicio) ================= */
function p2() {
  view(homeHTML()); $('#app').inert = true;
  const m = openModal(`${xBtn}<h2 id="m-title">Crear una actividad +</h2><p class="m-sub">¿Qué es una actividad de Bibliolab Activa?</p>
    <p class="c1">Bibliolab Activa permite diseñar actividades pedagógicas que integran los recursos de la biblioteca CRAIB, adaptadas a los objetivos de clase. Así funciona, en tres pasos:</p>
    <ol class="what3">
      <li><span class="num" aria-hidden="true">1</span><h3>Define tu objetivo</h3>${asset('assets/img/captura-formulario.png', 'Captura del formulario de creación', 'shot')}<p class="cap">Completa asignatura, grado, objetivo y enfoque.</p></li>
      <li><span class="num" aria-hidden="true">2</span><h3>Revisa la propuesta</h3>${asset('assets/img/captura-propuesta.png', 'Captura de la propuesta (borrador)', 'shot')}<p class="cap">Es un borrador del catálogo: puedes ajustarlo antes de confirmar.</p></li>
      <li><span class="num" aria-hidden="true">3</span><h3>Genera tu código</h3>${asset('assets/img/captura-ficha.png', 'Captura de la ficha de la actividad', 'shot')}<p class="cap">Guarda el <em>código de la actividad</em> y aplícala con tus estudiantes.</p></li>
    </ol>
    <div class="row c" style="flex-direction:row"><button class="btn btn-light" id="empezar">Empezar</button><button class="btn btn-ghost" data-close>Volver al inicio</button></div>`, 'xl', () => { location.hash = '#/p1'; });
  m.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  $('#empezar', m).onclick = () => { S.form = {asignatura:'', grado:'', objetivo:'', enfoque:''}; S.draft = null; closeModal(true); location.hash = '#/p3'; };
}

/* ================= P3 · Formulario ================= */
function formHTML() {
  const f = S.form;
  return `${cabecera(1)}<main class="page form-page"><div class="grid-paper" aria-hidden="true"></div>
    <div class="side-char" style="right:24px;bottom:-24px">${asset(A.estudiante, 'Personaje estudiante (ilustración)', 'char-r')}</div>
    <div class="form-in">
    <h1>Creación de experiencia pedagógica</h1>
    <div class="pill-row"><p class="pill-d">Ingresa la información básica para vincular los objetivos del aula con los recursos de la Bibliolab.</p><span class="book-box" aria-hidden="true">${ic('book')}</span></div>
    <form id="f-crear" novalidate>
      <div class="row-f"><label for="asig">Asignatura <span class="req" aria-hidden="true">*</span></label>
        <select id="asig" required aria-describedby="e-asig"><option value="">Seleccione una…</option>${ASIGNATURAS.map(a => `<option ${f.asignatura === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
        <p class="err" id="e-asig"></p></div>
      <div class="row-f"><label for="grado">Grado <span class="req" aria-hidden="true">*</span></label>
        <select id="grado" required aria-describedby="e-grado"><option value="">Seleccione uno…</option>${GRADOS.map(a => `<option ${f.grado === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
        <p class="err" id="e-grado"></p></div>
      <div class="field"><label class="big-l" for="obj">Objetivo de aprendizaje <span class="req" aria-hidden="true">*</span></label>
        <textarea id="obj" rows="3" required aria-describedby="e-obj" placeholder="Ej.: Reconocer las propiedades físicas del sonido mediante experimentos sencillos y grabación sonora">${esc(f.objetivo)}</textarea>
        <p class="err" id="e-obj"></p></div>
      <fieldset class="field enf-f" aria-describedby="e-enf">
        <legend>Enfoque principal <span class="req" aria-hidden="true">*</span> <span class="note">La actividad puede incluir matices de los otros enfoques. Elige uno.</span></legend>
        <div class="enf-grid">${Object.entries(ENFOQUES).map(([k, e]) => `
          <label class="enf e-${k}"><input type="radio" name="enf" value="${k}" ${f.enfoque === k ? 'checked' : ''}>
            <span class="chk">${ic('check')}</span><strong>${e.n}</strong><small>${e.d}</small></label>`).join('')}</div>
        <p class="err" id="e-enf"></p>
      </fieldset>
      <div class="bar gen">
        <button class="btn btn-light" type="submit">Generar propuesta de actividad</button><span class="vr" aria-hidden="true"></span>
        <p><strong>Antes de generar:</strong> la asignatura, el grado y el objetivo no podrás editarlos después. Lo que sí podrás ajustar es la ficha de la actividad.</p>
      </div>
    </form></div></main>`;
}
function p3() {
  view(formHTML());
  const save = () => { S.form = {asignatura:$('#asig').value, grado:$('#grado').value, objetivo:$('#obj').value, enfoque:($('input[name=enf]:checked') || {}).value || ''}; };
  $('#f-crear').addEventListener('input', save); $('#f-crear').addEventListener('change', save);
  $('#f-crear').addEventListener('submit', e => {
    e.preventDefault(); save();
    const chk = [['asig', S.form.asignatura, 'Elige una asignatura.'], ['grado', S.form.grado, 'Elige un grado.'], ['obj', S.form.objetivo.trim(), 'Escribe el objetivo de aprendizaje.'], ['enf', S.form.enfoque, 'Elige un enfoque principal.']];
    let first = null;
    chk.forEach(([id, val, msg]) => {
      const err = $('#e-' + id), inp = id === 'enf' ? null : $('#' + id);
      err.textContent = val ? '' : msg; if (inp) inp.setAttribute('aria-invalid', val ? 'false' : 'true');
      if (!val && !first) first = inp || $('input[name=enf]');
    });
    if (first) { first.focus(); return; }
    location.hash = '#/p4';
  });
}

/* ================= P4 · Buscando la plantilla (ventana sobre el formulario) ================= */
function p4() {
  if (!S.form.asignatura || !S.form.grado || !S.form.objetivo.trim() || !S.form.enfoque) { location.hash = '#/p3'; return; }
  view(formHTML()); $('#app').inert = true;
  const m = openModal(`<div class="l-logo">${asset(LOGO_W, 'Logo Bibliolab Activa (versión blanca)', 'logo-main')}</div>
    <div class="l-body" role="status"><h1 id="m-title" tabindex="-1">Buscando una plantilla para tu objetivo…</h1>
    <p>Estamos revisando el catálogo de plantillas del enfoque <strong>${ENFOQUES[S.form.enfoque].n}</strong>. Puede tardar unos segundos; no cierres la pestaña.</p>
    <div class="ld-icons" aria-hidden="true">${ic('book')}${ic('bulb')}${ic('pencil')}${ic('group')}</div><div class="row c"><button class="btn btn-ghost" data-close>Cancelar y volver al formulario</button></div></div>`, 'load', () => { location.hash = '#/p3'; });
  m.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  $('#m-title', m).focus();
  S.timer = setTimeout(() => {
    if (S.demo.conexion) {
      $('.l-body', m).innerHTML = `<h1 id="m-title" tabindex="-1">No pudimos crear la propuesta</h1><p>No pudimos crear la propuesta. Tus datos se conservaron; reinténtalo.</p>
        <div class="row c"><button class="btn btn-light" id="reint">Reintentar</button><a class="btn btn-ghost" href="#/p3">Volver al formulario</a></div>`;
      $('#reint', m).onclick = p4; $('#m-title', m).focus();
      return;
    }
    if (S.demo.sinPlantilla || /sin-plantilla/i.test(S.form.objetivo)) { location.hash = '#/p11'; return; }
    S.idx = 0; S.draft = makeFicha(S.form, 0); S.edited = false; location.hash = '#/p5';
  }, 2200);
}

/* ================= Ficha (vista y edición) ================= */
function fichaHTML(f, codigo) {
  return `<article class="ficha">
    <div class="ficha-h">${asset(A.logo, 'Logo Bibliolab Activa', 'logo-sm')}
      <p class="ficha-code">Código de la actividad:<strong>${esc(codigo || 'Aún sin generar')}</strong></p>
      <div class="logos">${asset(A.craib, 'Logo CRAIB', 'logo-sm')}${asset(A.ie, 'Logo Institución Educativa Boyacá', 'logo-sm')}</div></div>
    <h3 class="ficha-t">${esc(f.titulo)}</h3>
    <div class="fgrid">
      <div class="box"><p><b>Asignatura:</b> ${esc(f.asignatura)}</p><p><b>Grado:</b> ${esc(f.grado)}</p><p><b>Enfoque principal:</b> ${ENFOQUES[f.enfoque].n}</p>
        <p class="note">La actividad puede incluir matices de los otros enfoques.</p></div>
      <div class="box"><p><b>Objetivo de clase:</b> ${esc(f.objetivo)}</p><p><b>Producto esperado:</b> ${esc(f.producto)}</p></div>
    </div>
    <div class="fcols"><div><h3>Descripción del desarrollo</h3>
      ${f.momentos.map(m => `<div class="momento"><h4>${esc(m.nombre)} (${m.min} min)</h4><p>${esc(m.texto)}</p></div>`).join('')}</div>
      <div class="side"><h3>Tiempo total estimado</h3><p><strong>${totalMin(f)} minutos</strong></p>
      <h3>Recursos requeridos</h3><ul>${f.recursos.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div></div>
    <p class="lockline">${ic('lock')} Asignatura, grado y objetivo quedan bloqueados al generar la propuesta.</p></article>`;
}
function editFormHTML(f) {
  return `<form id="edit-form" class="edit-form" novalidate>
    <div class="field"><label for="e-titulo">Título de la actividad</label><input type="text" id="e-titulo" value="${esc(f.titulo)}"></div>
    <div class="field"><label for="e-prod">Producto esperado</label><input type="text" id="e-prod" value="${esc(f.producto)}"></div>
    ${f.momentos.map((m, i) => `<fieldset><legend>${esc(m.nombre)}</legend>
      <label>Minutos <input type="number" min="1" max="240" id="e-min${i}" value="${m.min}"></label>
      <label>Descripción <textarea id="e-txt${i}" rows="3">${esc(m.texto)}</textarea></label></fieldset>`).join('')}
    <div class="field"><label for="e-rec">Recursos requeridos (uno por línea)</label><textarea id="e-rec" rows="4">${esc(f.recursos.join('\n'))}</textarea></div>
    <p class="note">${ic('lock').replace('<svg', '<svg width="16" height="16"')} Asignatura, grado y objetivo no se pueden editar.</p>
    <p id="e-err" class="err" role="alert"></p></form>`;
}
function readEdit(f) {
  const g = id => $('#' + id).value.trim();
  const n = {...f, titulo:g('e-titulo'), producto:g('e-prod'),
    momentos:f.momentos.map((m, i) => ({...m, min:g('e-min' + i), texto:g('e-txt' + i)})),
    recursos:g('e-rec').split('\n').map(s => s.trim()).filter(Boolean)};
  const errs = [];
  if (!n.titulo) errs.push('el título'); if (!n.producto) errs.push('el producto esperado');
  n.momentos.forEach(m => { if (!m.texto) errs.push('la descripción de «' + m.nombre + '»'); if (!(parseInt(m.min) > 0)) errs.push('los minutos de «' + m.nombre + '»'); });
  if (!n.recursos.length) errs.push('los recursos');
  n.momentos = n.momentos.map(m => ({...m, min:parseInt(m.min) || 0}));
  return {n, errs};
}

/* ================= P5 · Propuesta (borrador) ================= */
function propHTML(f) {
  return `${cabecera(2)}<main class="page prop">
    <h1>Propuesta y edición de ficha</h1>
    <div class="pill-row"><p class="pill-d">Presentación de la propuesta pedagógica estructurada y flexibilidad de ajuste manual antes de la confirmación.</p><span class="book-box" aria-hidden="true">${ic('book')}</span></div>
    <section class="blue-frame"><div class="screen"><div class="sheet-wrap" tabindex="0" aria-label="Borrador de la ficha, desplázate para leerlo completo">${S.editing ? `<div class="ficha">${editFormHTML(f)}</div>` : fichaHTML(f)}</div></div>
      <div class="float-actions">
        ${S.editing ? `<button class="btn btn-primary" id="guardar">${ic('check')} Guardar cambios</button><button class="btn btn-ghost" id="descartar">Descartar cambios</button>`
        : `<button class="btn btn-ghost" id="editar">${ic('pencil')} Editar manualmente</button>
           <button class="btn btn-ghost" id="regen">Regenerar propuesta</button>
           <button class="btn btn-ghost" id="vista">Vista completa</button>`}
      </div></section>
    <div class="bar"><p>Este es un borrador de la ficha de la actividad final, aún sin código; puedes hacer ediciones manuales antes de continuar. <span class="note">(Propuesta del catálogo ${S.idx + 1} de ${CATALOGO[f.enfoque].length})</span></p>
      <p id="msg5" class="err" role="alert"></p><button class="btn btn-light" id="cont">Continuar</button></div></main>`;
}
function p5() {
  if (!S.draft) { location.hash = '#/p3'; return; }
  const f = S.draft;
  view(propHTML(f));
  const msg = t => $('#msg5').textContent = t;
  if ($('#editar')) {
    $('#editar').onclick = () => { S.editing = true; p5(); $('#e-titulo').focus(); };
    $('#vista').onclick = () => { const m = openModal(`${xBtn}<h2 id="m-title" class="sr-only">Vista completa de la ficha</h2><div style="background:#fff;border-radius:16px">${fichaHTML(S.draft)}</div><div class="row"><button class="btn btn-light" data-close>Cerrar</button></div>`); m.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); }); };
    $('#regen').onclick = () => {
      const list = CATALOGO[S.form.enfoque];
      if (S.idx >= list.length - 1) { toast('No hay más opciones'); msg('No hay más opciones en el catálogo para este enfoque.'); return; }
      const go = () => { S.idx++; S.draft = makeFicha(S.form, S.idx); S.edited = false; p5(); };
      if (S.edited) confirmModal({title:'¿Regenerar la propuesta?', text:'Se perderán las ediciones que hiciste a este borrador.', ok:'Sí, regenerar', cancel:'Volver', onOk:go});
      else go();
    };
  } else {
    $('#guardar').onclick = () => {
      const {n, errs} = readEdit(S.draft);
      if (errs.length) { $('#e-err').textContent = 'Completa ' + errs.join(', ') + '.'; return; }
      S.draft = n; S.edited = true; S.editing = false; p5(); toast('Cambios guardados en el borrador');
    };
    $('#descartar').onclick = () => { S.editing = false; p5(); };
  }
  $('#cont').onclick = () => {
    if (S.editing) return msg('Guarda o descarta tus cambios para continuar.');
    const bad = S.draft.momentos.some(m => !m.texto || !(m.min > 0));
    if (bad) return msg('No puedes confirmar con la descripción o el tiempo vacíos. Edita la ficha.');
    location.hash = '#/p6';
  };
}

/* ================= P6 · Fecha estimada (ventana sobre la propuesta) ================= */
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function p6() {
  if (!S.draft) { location.hash = '#/p3'; return; }
  view(propHTML(S.draft)); $('#app').inert = true;
  const now = new Date(), minY = now.getFullYear(), minM = now.getMonth();
  let cy = minY, cm = minM;
  if (S.fecha) { const [y, mo] = S.fecha.split('-'); cy = +y; cm = +mo - 1; }
  const m = openModal(`${xBtn}<div class="fecha-grid">
      <div class="fl"><h2 id="m-title">Programación estimada de la sesión</h2><p>Es opcional. Define el momento tentativo en el que llevarás a tus estudiantes a la Bibliolab.</p>${asset(A.caritas, 'Caritas de estudiantes (ilustración)', 'caritas')}</div>
      <span class="vline" aria-hidden="true"></span>
      <div class="fr"><h3>${ic('cal')} Selector de fecha</h3><div class="calwrap"><div class="cal" id="cal"></div>
        <div class="fecha-info"><p>${ic('info').replace('<svg', '<svg width="22" height="22" style="vertical-align:-5px"')} <strong>Nota:</strong> la fecha es informativa y no reserva el espacio. Confirma la disponibilidad con la encargada de la Bibliolab.</p><p id="sel" aria-live="polite"></p></div></div></div></div>
    <p id="e-fecha" class="err" role="alert"></p><p id="e-gen" class="err" role="alert"></p>
    <div class="row c"><button class="btn btn-light" id="gen">Generar ficha y código único</button><button class="link" id="quitar" type="button">Continuar sin fecha</button><button class="link" data-close type="button">Volver a la propuesta</button></div>`, 'xl', () => { location.hash = '#/p5'; });
  m.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  const drawCal = focusSel => {
    const start = (new Date(cy, cm, 1).getDay() + 6) % 7, dim = new Date(cy, cm + 1, 0).getDate(), h = hoy();
    const canPrev = cy > minY || (cy === minY && cm > minM);
    let cells = ''; for (let i = 0; i < start; i++) cells += '<span></span>';
    for (let d = 1; d <= dim; d++) {
      const iso = `${cy}-${String(cm + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells += `<button type="button" data-d="${iso}" aria-label="${d} de ${MESES[cm]} de ${cy}" aria-pressed="${S.fecha === iso}" ${iso < h ? 'disabled' : ''}>${d}</button>`;
    }
    $('#cal', m).innerHTML = `<div class="cal-h"><button type="button" class="cal-n" id="c-prev" aria-label="Mes anterior" ${canPrev ? '' : 'disabled'}>${ic('left')}</button>
      <select id="c-m" aria-label="Mes">${MESES.map((n, i) => `<option value="${i}" ${i === cm ? 'selected' : ''} ${cy === minY && i < minM ? 'disabled' : ''}>${n[0].toUpperCase() + n.slice(1)}</option>`).join('')}</select>
      <select id="c-y" aria-label="Año">${[minY, minY + 1, minY + 2].map(y => `<option ${y === cy ? 'selected' : ''}>${y}</option>`).join('')}</select>
      <button type="button" class="cal-n" id="c-next" aria-label="Mes siguiente">${ic('right')}</button></div>
      <div class="cal-w" aria-hidden="true">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(x => `<span>${x}</span>`).join('')}</div><div class="cal-g">${cells}</div>`;
    $('#sel', m).textContent = S.fecha ? 'Fecha elegida: ' + fmtFecha(S.fecha) : 'Sin fecha elegida.';
    $('#c-prev', m).onclick = () => { cm--; if (cm < 0) { cm = 11; cy--; } drawCal('#c-prev'); };
    $('#c-next', m).onclick = () => { cm++; if (cm > 11) { cm = 0; cy++; } drawCal('#c-next'); };
    $('#c-m', m).onchange = e => { cm = +e.target.value; drawCal('#c-m'); };
    $('#c-y', m).onchange = e => { cy = +e.target.value; if (cy === minY && cm < minM) cm = minM; drawCal('#c-y'); };
    m.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { S.fecha = S.fecha === b.dataset.d ? '' : b.dataset.d; $('#e-fecha', m).textContent = ''; drawCal('[data-d="' + b.dataset.d + '"]'); });
    if (focusSel) { const el = $(focusSel, m); if (el && !el.disabled) el.focus(); }
  };
  drawCal();
  $('#quitar', m).onclick = () => { S.fecha = ''; drawCal(); toast('Sin fecha estimada'); };
  $('#gen', m).onclick = () => {
    if (S.fecha && S.fecha < hoy()) { $('#e-fecha', m).textContent = 'La fecha no puede ser anterior a hoy.'; return; }
    $('#e-fecha', m).textContent = ''; $('#e-gen', m).textContent = '';
    const b = $('#gen', m); b.disabled = true; b.textContent = 'Generando…';
    S.timer = setTimeout(() => {
      if (S.demo.conexion) { b.disabled = false; b.textContent = 'Generar ficha y código único'; $('#e-gen', m).textContent = 'No pudimos crear la propuesta. Tus datos se conservaron; reinténtalo.'; return; }
      const a = {codigo:genCodigo(), estado:'Programada', fecha:S.fecha, ficha:JSON.parse(JSON.stringify(S.draft)), evid:[]};
      store[a.codigo] = a; S.current = a; S.justCreated = true; location.hash = '#/p7';
    }, 900);
  };
}

/* ================= P7 · Gestión de la actividad ================= */
const BLOBS_BOTTOM = `<svg class="g-blobs" viewBox="0 0 1280 90" preserveAspectRatio="none" aria-hidden="true"><g stroke="#fff3cf" stroke-width="4">
  <ellipse cx="190" cy="104" rx="170" ry="58" fill="#1fb5d6"/><ellipse cx="330" cy="106" rx="80" ry="52" fill="#f2b81c"/><ellipse cx="520" cy="100" rx="130" ry="56" fill="#e6197a"/>
  <ellipse cx="650" cy="106" rx="80" ry="48" fill="#5aa83c"/><ellipse cx="800" cy="106" rx="130" ry="46" fill="#1f4fa3"/><ellipse cx="980" cy="104" rx="150" ry="50" fill="#1fb5d6"/>
  <ellipse cx="1130" cy="104" rx="90" ry="40" fill="#e6197a"/><ellipse cx="1240" cy="70" rx="80" ry="58" fill="#f2b81c"/><ellipse cx="1260" cy="104" rx="90" ry="60" fill="#ef6a22"/></g></svg>`;
function p7() {
  const a = S.current; if (!a) { location.hash = '#/p1'; return; }
  const f = a.ficha, off = a.estado === 'Inactiva';
  view(`<main class="page gestion"><div class="side-char">${asset(A.docente, 'Personaje docente (ilustración)', 'char-l')}</div>
    <div class="g-head"><div><h1>Gestión de actividad: <span class="cod-h">${esc(a.codigo)}</span></h1><p class="sub">${esc(f.titulo)}</p></div>
      <div class="g-state"><button class="icbtn danger" id="cancelar" ${off ? 'disabled' : ''}>${ic('trash')}<span>Cancelar actividad</span></button>
        <p class="estado ${off ? 'off' : 'on'}"><span class="dot" aria-hidden="true"></span><span class="est-t">Estado:<strong>${a.estado}</strong></span></p></div></div>
    ${off ? `<div class="warn" role="status">${ic('info')} <span>Esta actividad está Inactiva. Informa a la encargada de la Bibliolab para liberar los recursos y el espacio.</span></div>` : ''}
    <div class="g-grid">
      <section><h2>Ficha de experiencia</h2>
        <dl><dt>Asignatura</dt><dd>${esc(f.asignatura)}</dd><dt>Grado</dt><dd>${esc(f.grado)}</dd>
        <dt>Enfoque principal</dt><dd>${ENFOQUES[f.enfoque].n}</dd><dt>Objetivo</dt><dd>${esc(f.objetivo)}</dd>
        <dt>Producto esperado</dt><dd>${esc(f.producto)}</dd><dt>Duración</dt><dd>${totalMin(f)} min</dd>
        <dt>Fecha estimada</dt><dd>${fmtFecha(a.fecha)}${a.fecha ? ' <span class="note">(no reserva el espacio)</span>' : ''}</dd>
        <dt>Recursos</dt><dd>${f.recursos.map(esc).join(', ')}</dd></dl>
        <div class="icbtns">
          <button class="icbtn" id="editar" ${off ? 'disabled' : ''}>${ic('pencil')}<span>Editar ficha</span></button>
          <button class="icbtn" id="respaldo">${ic('download')}<span>Descargar respaldo (PDF + JSON)</span></button></div>
        <div id="msg7" role="status" aria-live="polite"></div>
        <div class="ev-actions"><button class="btn btn-pink" id="subir" ${off ? 'disabled' : ''}>Subir evidencias de grupos de trabajo</button></div>
        <p class="g-links"><a class="link" href="#/p10">Visualizar galería de evidencias</a> · <a class="link" href="#/p1">Ir al inicio</a></p>
      </section>
      <aside class="codigo-card" aria-label="Código de la actividad">
        <h2>Código</h2><p class="codigo">${esc(a.codigo)}</p>
        <p>Digítalo en el computador de la biblioteca. <strong class="warn-t">No lo compartas con los estudiantes.</strong></p>
        <button class="btn btn-primary" id="copiar">${ic('copy')} Copiar código</button></aside>
    </div>
    ${S.justCreated ? `<div class="g-toast" role="status"><span>¡Experiencia pedagógica creada con éxito!</span>${ic('check')}</div>` : ''}
    <div class="g-foot-logo">${asset(A.logo, 'Logo Bibliolab Activa', 'logo-main')}</div>
    <div class="g-foot-logos">${asset(A.craib, 'Logo CRAIB', 'logo-sm')}${asset(A.ie, 'Logo Institución Educativa Boyacá', 'logo-sm')}</div>
    ${BLOBS_BOTTOM}</main>`);
  const m7 = (t, retry) => { $('#msg7').innerHTML = `<span class="${retry ? 'err' : 'msg-ok'}">${esc(t)}</span> ${retry ? '<button class="btn btn-ghost" id="reint7">Reintentar</button>' : ''}`; if (retry) $('#reint7').onclick = descargar; };
  $('#copiar').onclick = () => { try { navigator.clipboard.writeText(a.codigo); } catch (e) {} toast('Código copiado'); };
  $('#subir').onclick = () => { location.hash = '#/p9'; };
  const descargar = () => {
    if (off) return m7('Esta actividad está Inactiva; no se descarga el respaldo.', false);
    if (S.demo.descarga) return m7('No se completó la descarga.', true);
    m7('Respaldo listo (simulado): actividad.pdf y actividad.json. Ninguno incluye el código, datos personales ni evidencias.', false);
  };
  $('#respaldo').onclick = descargar;
  $('#cancelar').onclick = () => {
    const m = openModal(`${xBtn}<h2 id="m-title">¿Deseas cancelar esta actividad?</h2>
      <p>La actividad con código <strong>${esc(a.codigo)}</strong> quedará Inactiva. Recuerda informar a la encargada de la Bibliolab para liberar los recursos y el espacio asignado.</p>
      <div class="row c"><button class="btn btn-light" data-ok>Confirmar cancelación</button><button class="btn btn-pink" style="border-color:#fff" data-close>Volver</button></div>`, 'pink center');
    m.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) closeModal();
      if (e.target.closest('[data-ok]')) { closeModal(true); a.estado = 'Inactiva'; S.justCreated = false; p7(); toast('Actividad Inactiva. Informa a la encargada de la Bibliolab.'); }
    });
  };
  $('#editar').onclick = () => {
    const m = openModal(`${xBtn}<h2 id="m-title">Editar ficha</h2>${editFormHTML(a.ficha)}
      <div class="row"><button class="btn btn-light" data-ok>Guardar cambios</button><button class="btn btn-pink" style="border-color:#fff" data-close>Cancelar</button></div>`, 'light');
    m.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) closeModal();
      if (e.target.closest('[data-ok]')) {
        const {n, errs} = readEdit(a.ficha);
        if (errs.length) { $('#e-err').textContent = 'Completa ' + errs.join(', ') + '.'; return; }
        a.ficha = n; closeModal(true); p7(); toast('Ficha actualizada');
      }
    });
  };
}

/* ================= P8 se abre desde P7 (modal) ================= */

/* ================= P9 · Subir evidencias (ventana sobre la gestión) ================= */
const FORMATOS = ['pdf','jpg','jpeg','png','docx'], MAX_MB = 2;
function p9() {
  const a = S.current; if (!a) { location.hash = '#/p1'; return; }
  if (a.estado === 'Inactiva') { location.hash = '#/p7'; return; }
  p7(); $('#app').inert = true;
  const u = S.up;
  const m = openModal('', 'pink upl-m', () => { location.hash = '#/p7'; });
  const draw = () => {
    m.innerHTML = `${xBtn}<h2 id="m-title" class="sr-only">Subir evidencias</h2><p class="up-sub">Subir evidencias · Actividad ${esc(a.codigo)} · ${esc(a.ficha.titulo)}</p>
    <fieldset class="tabs"><legend class="sr-only">Qué vas a compartir</legend>
      ${[['archivo', 'Archivo'], ['enlace', 'Enlace'], ['descripcion', 'Descripción']].map(([k, t]) => `<label><input type="radio" name="modo" value="${k}" ${u.modo === k ? 'checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
    <div class="inner-dash" id="cuerpo">${u.modo === 'archivo' ? `
      <label class="drop" id="drop"><input type="file" id="file" accept=".pdf,.jpg,.jpeg,.png,.docx">${ic('upload')}
        <p style="margin:.4em 0 0;font-size:20px"><strong>${u.file ? esc(u.file.name) : 'Arrastra los archivos o haz clic para elegirlos'}</strong></p>
        <p style="margin:.2em 0;font-size:18px">Límite de peso: ${MAX_MB} MB (de ejemplo) <span class="tag-pd">[por definir]</span></p>
        <p class="note" style="margin:0">Formatos de ejemplo: PDF, JPG, PNG, DOCX <span class="tag-pd">[por definir]</span></p></label>`
      : u.modo === 'enlace' ? `<div class="field" style="width:100%"><label for="enlace">Enlace al producto</label><input type="url" id="enlace" placeholder="https://" value="${esc(u.enlace)}"></div>`
      : `<div class="field" style="width:100%"><label for="desc">Descripción del producto</label><textarea id="desc" rows="4" placeholder="Describe el producto del grupo (sin nombres de estudiantes)">${esc(u.desc)}</textarea></div>`}
    </div>
    <p class="err" id="e-cuerpo" role="alert"></p>
    <div class="up-row">
      <div class="field"><label for="grupo">Número o etiqueta del grupo <span class="note">(opcional)</span></label>
        <input type="text" id="grupo" maxlength="30" placeholder="Ej.: Grupo 1" value="${esc(u.grupo)}"></div>
      <div class="conds"><p style="margin:0"><strong>Sube el producto, no fotos con rostros.</strong> Sin rostros ni nombres; si el material identifica a alguien, necesitas autorización.</p>
        <details class="conds-d"><summary>Ver condiciones de uso</summary>${condicionesHTML()}</details>
        <label style="display:flex;gap:10px;margin-top:6px;align-items:flex-start"><input type="checkbox" id="ok" ${u.ok ? 'checked' : ''} style="width:22px;height:22px;margin-top:2px">
        <span>Confirmo que leí las condiciones de uso y que el material cumple con ellas.</span></label>
        <p class="err" id="e-ok" role="alert"></p></div></div>
    <div id="prog" hidden><div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div></div></div><p id="prog-t" class="note"></p></div>
    <div class="row c"><button class="btn btn-light" id="enviar">Subir evidencia</button></div>`;
    bind();
    const r = m.querySelector('input[name=modo]:checked'); if (r) r.focus();
  };
  const collect = () => { u.ok = $('#ok', m).checked; u.grupo = $('#grupo', m).value; if ($('#enlace', m)) u.enlace = $('#enlace', m).value; if ($('#desc', m)) u.desc = $('#desc', m).value; };
  const bind = () => {
    m.querySelector('[data-close]').onclick = () => closeModal();
    m.querySelectorAll('input[name=modo]').forEach(r => r.onchange = () => { collect(); u.modo = r.value; draw(); });
    const setFile = f => {
      const ext = (f.name.split('.').pop() || '').toLowerCase(), err = $('#e-cuerpo', m);
      if (!FORMATOS.includes(ext)) { u.file = null; err.textContent = 'Formato no admitido. Formatos de ejemplo: PDF, JPG, PNG, DOCX [por definir].'; return; }
      if (f.size > MAX_MB * 1024 * 1024) { u.file = null; err.textContent = `Archivo demasiado grande (máximo de ejemplo: ${MAX_MB} MB [por definir]). Comprímelo e inténtalo de nuevo.`; return; }
      collect(); u.file = f; draw();
    };
    if ($('#file', m)) {
      $('#file', m).onchange = e => { if (e.target.files[0]) setFile(e.target.files[0]); };
      const d = $('#drop', m);
      ['dragover', 'dragenter'].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.add('over'); }));
      ['dragleave', 'drop'].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.remove('over'); }));
      d.addEventListener('drop', e => { if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); });
    }
    $('#enviar', m).onclick = enviar;
  };
  const enviar = () => {
    collect(); $('#e-ok', m).textContent = ''; $('#e-cuerpo', m).textContent = '';
    if (!u.ok) { $('#e-ok', m).textContent = 'Marca la casilla para confirmar las condiciones de uso.'; $('#ok', m).focus(); return; }
    let nombre = '';
    if (u.modo === 'archivo') { if (!u.file) { $('#e-cuerpo', m).textContent = 'Elige un archivo para subir.'; return; } nombre = u.file.name; }
    if (u.modo === 'enlace') { if (!/^https?:\/\/\S+\.\S+/.test(u.enlace.trim())) { $('#e-cuerpo', m).textContent = 'Escribe un enlace válido que empiece por http:// o https://.'; return; } nombre = u.enlace.trim(); }
    if (u.modo === 'descripcion') { if (!u.desc.trim()) { $('#e-cuerpo', m).textContent = 'Escribe la descripción del producto.'; return; } nombre = u.desc.trim().slice(0, 90); }
    const bar = $('#prog', m), fill = $('.prog > div', m), pt = $('#prog-t', m), btn = $('#enviar', m);
    bar.hidden = false; btn.disabled = true; let p = 0; pt.textContent = 'Subiendo…';
    clearInterval(S.iv);
    S.iv = setInterval(() => {
      p += 12; const stop = S.demo.subida && p >= 60;
      if (stop) p = 60;
      fill.style.width = p + '%'; $('.prog', m).setAttribute('aria-valuenow', p);
      if (stop) { clearInterval(S.iv); btn.disabled = false; pt.innerHTML = '<span class="err">No se completó la carga.</span> <button class="btn btn-light" id="reint9">Reintentar</button>'; $('#reint9', m).onclick = enviar; $('#reint9', m).focus(); return; }
      if (p >= 100) {
        clearInterval(S.iv);
        a.evid.push({tipo:u.modo, nombre, grupo:u.grupo.trim()});
        S.up = {modo:'archivo', file:null, enlace:'', desc:'', grupo:'', ok:false};
        toast('Evidencia subida (simulado)'); location.hash = '#/p10';
      }
    }, 280);
  };
  draw();
}

/* ================= P10 · Galería de evidencias ================= */
function p10() {
  const a = S.current; if (!a) { location.hash = '#/p1'; return; }
  const T = {archivo:'Archivo', enlace:'Enlace', descripcion:'Descripción'};
  view(`${cabecera()}<main class="page">
    <h1>Galería de evidencias</h1><p class="sub">Actividad ${esc(a.codigo)} · ${esc(a.ficha.titulo)}</p>
    ${a.evid.length ? `<ul class="ev-list">${a.evid.map((e, i) => `<li class="ev-item"><div class="info"><span class="tipo">${T[e.tipo]}</span><span class="g">${esc(e.grupo || 'Sin grupo asignado')}</span><br>${esc(e.nombre)}</div>
        <button class="btn btn-danger" data-del="${i}" aria-label="Eliminar evidencia: ${esc(e.nombre)}">${ic('trash')} Eliminar</button></li>`).join('')}</ul>`
      : `<div class="empty" role="status">Aún no hay evidencias</div>`}
    <div class="row" style="margin-top:20px">${a.estado === 'Inactiva' ? '' : '<a class="btn btn-pink" href="#/p9">Subir evidencias</a>'}<a class="btn btn-ghost" href="#/p7">Volver a la gestión</a></div></main>`);
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    const i = +b.dataset.del;
    confirmModal({title:'¿Eliminar esta evidencia?', text:'Se quitará de la galería de la actividad y no se puede deshacer.', ok:'Sí, eliminar', cancel:'Volver', onOk:() => { a.evid.splice(i, 1); p10(); toast('Evidencia eliminada'); }});
  });
}

/* ================= P11 · Sin plantilla coincidente ================= */
function p11() {
  view(`${cabecera(2)}<main class="page">
    <section class="panel mid" style="text-align:center"><h1>No encontramos una propuesta para tu objetivo</h1>
    <p style="font-size:20px">Reformula el objetivo o cambia el enfoque principal e inténtalo de nuevo. Tus datos se conservaron.</p>
    <div class="row" style="justify-content:center"><a class="btn btn-light" href="#/p3">Volver al formulario</a></div></section></main>`);
}

/* ================= Router ================= */
const R = {p1, p2, p3, p4, p5, p6, p7, p9, p10, p11, p23};
function route() {
  $('#app').inert = false;
  clearTimeout(S.timer); clearInterval(S.iv); closeModal(true); S.editing = false;
  const k = (location.hash.replace(/^#\/?/, '') || 'p1').toLowerCase();
  (R[k] || p1)(); renderDemo();
}
window.addEventListener('hashchange', route);

/* ================= Panel de demostración (discreto) ================= */
function renderDemo() {
  const r = $('#demo-root');
  if (demoHidden) { r.innerHTML = ''; return; }
  const flags = [['conexion', 'Falla de conexión al generar'], ['subida', 'Carga de evidencia interrumpida'], ['sinPlantilla', 'Forzar «Sin plantilla»'], ['descarga', 'Descarga de respaldo fallida']];
  r.innerHTML = `<button class="demo-btn" id="d-toggle" aria-expanded="${demoOpen}">Modo demo</button>
    ${demoOpen ? `<div class="demo-panel" role="region" aria-label="Panel de demostración"><h2>Modo demo (no es parte del producto)</h2>
      ${flags.map(([k, t]) => `<label><input type="checkbox" data-flag="${k}" ${S.demo[k] ? 'checked' : ''}> ${t}</label>`).join('')}
      <button id="d-inact">Marcar actividad actual como Inactiva</button><button id="d-lock">Forzar bloqueo por intentos</button><button id="d-reset">Reiniciar demo</button>
      <hr><div>Ir a: ${['p1','p2','p3','p4','p5','p6','p7','p9','p10','p11','p23'].map(p => `<button data-go="${p}">${p.toUpperCase()}</button>`).join('')}</div>
      <hr><div>Códigos de ejemplo:<br><code>K7Q2M9XP</code> Programada<br><code>R4T8W2NB</code> Programada<br><code>X9L3P5CD</code> Inactiva<br>Objetivo con <code>sin-plantilla</code> → P11</div>
      <hr><button id="d-hide">Ocultar panel (Shift+D lo vuelve a mostrar)</button></div>` : ''}`;
  $('#d-toggle').onclick = () => { demoOpen = !demoOpen; renderDemo(); };
  if (!demoOpen) return;
  r.querySelectorAll('[data-flag]').forEach(c => c.onchange = () => { S.demo[c.dataset.flag] = c.checked; });
  r.querySelectorAll('[data-go]').forEach(b => b.onclick = () => {
    const p = b.dataset.go;
    if (['p7', 'p9', 'p10'].includes(p) && !S.current) S.current = store.K7Q2M9XP;
    if (['p5', 'p6'].includes(p) && !S.draft) { if (!S.form.enfoque) S.form = {asignatura:'Ciencias Naturales', grado:'8.º', objetivo:'Identificar las partes de la célula humana', enfoque:'crea'}; S.draft = makeFicha(S.form, S.idx); }
    if (p === 'p4' && (!S.form.enfoque)) S.form = {asignatura:'Ciencias Naturales', grado:'8.º', objetivo:'Identificar las partes de la célula humana', enfoque:'crea'};
    location.hash = '#/' + p; if (location.hash === '#/' + p) route();
  });
  $('#d-inact').onclick = () => { if (S.current) { S.current.estado = 'Inactiva'; route(); toast('Actividad marcada como Inactiva'); } else toast('Primero abre una actividad'); };
  $('#d-lock').onclick = () => { S.lock = true; location.hash = '#/p1'; route(); };
  $('#d-reset').onclick = () => { resetState(); seed(); demoOpen = true; location.hash = '#/p1'; route(); toast('Demo reiniciada'); };
  $('#d-hide').onclick = () => { demoHidden = true; renderDemo(); };
}
document.addEventListener('keydown', e => { if (e.shiftKey && e.key === 'D' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) { demoHidden = !demoHidden; renderDemo(); } });

/* Escala el lienzo 1280x720 para que quepa completo en la ventana (sin scroll) */
function fit() {
  const k = Math.min(innerWidth / 1280, innerHeight / 720), st = $('#stage');
  st.style.width = (innerWidth / k) + 'px'; st.style.height = (innerHeight / k) + 'px';
  st.style.transform = `scale(${k})`; st.style.left = '0px'; st.style.top = '0px';
}
addEventListener('resize', fit); fit();

route();