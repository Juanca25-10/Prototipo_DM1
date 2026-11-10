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
  close:'<path d="M5 5l14 14M19 5L5 19"/>'
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
function cabecera() {
  return `<header class="top"><div>${asset(A.logo, 'Logo Bibliolab Activa', 'logo-main')}</div>
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
let lastFocus = null, modalKey = null;
function openModal(html, cls = '') {
  closeModal(true); lastFocus = document.activeElement;
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
  $('#modal-root').innerHTML = '';
  if (modalKey) document.removeEventListener('keydown', modalKey); modalKey = null;
  if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus();
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
    <li>Tiempo que se conservan las evidencias: <span class="tag-pd">[por definir]</span></li>
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
function p1() {
  view(`${cabecera()}<main class="page home">
    <div class="vert" aria-hidden="true"><span class="v1">Explora</span><span class="v2">Conecta</span><span class="v3">Crea</span><span class="v4">Colabora</span></div>
    <div>
      <div class="hero">
        <div>${asset(A.docente, 'Personaje docente (ilustración)', 'char')}</div>
        <div>
          <div>${asset(A.logo, 'Logo Bibliolab Activa', 'logo-hero')}</div>
          <h1>Transforma tus objetivos pedagógicos en experiencias.</h1>
          <p class="lead">Selecciona una opción para comenzar o gestionar tu actividad.</p>
          <form class="code-form" id="f-code" novalidate>
            <div class="field"><label for="codigo">Código de la actividad</label>
              <input id="codigo" type="text" autocomplete="off" maxlength="12" placeholder="Introduce el código de actividad" aria-describedby="codigo-msg" ${S.lock ? 'disabled' : ''}></div>
            <button class="btn btn-primary" ${S.lock ? 'disabled' : ''}>Cargar / Editar</button>
          </form>
          <p id="codigo-msg" class="err" role="alert">${S.lock ? lockMsg() : ''}</p>
          <p class="note">Aquí no hay cuentas ni inicio de sesión: el código de cada actividad es tu único acceso.</p>
        </div>
      </div>
      <a class="cta-bar" href="#/p2">Crear una actividad +</a>
    </div></main>`);
  $('#f-code').addEventListener('submit', consultar);
}
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

/* ================= P2 · Qué es "Crear una actividad" ================= */
function p2() {
  view(`${cabecera()}<main class="page"><section class="panel">
    <h1>Crear una actividad +</h1><p style="font-size:20px">Así funciona, en tres pasos:</p>
    <div class="what">
      <div class="st"><div class="num" aria-hidden="true">1</div><h2>Define tu objetivo</h2><p>Cuéntanos la asignatura, el grado, tu objetivo de aprendizaje y el enfoque principal.</p></div>
      <div class="st"><div class="num" aria-hidden="true">2</div><h2>Revisa la propuesta</h2><p>Te mostramos un borrador del catálogo de plantillas. Puedes ajustarlo antes de confirmar.</p></div>
      <div class="st"><div class="num" aria-hidden="true">3</div><h2>Genera la ficha y tu código</h2><p>Guarda el código de la actividad: lo digitarás en el computador de la biblioteca.</p></div>
    </div>
    <div class="row"><button class="btn btn-light" id="empezar">Empezar</button><a class="btn btn-ghost" style="color:#fff;border-color:#fff" href="#/p1">Volver al inicio</a></div>
  </section></main>`);
  $('#empezar').onclick = () => { S.form = {asignatura:'', grado:'', objetivo:'', enfoque:''}; S.draft = null; location.hash = '#/p3'; };
}

/* ================= P3 · Formulario ================= */
function p3() {
  const f = S.form;
  view(`${cabecera()}<main class="page" style="max-width:1100px">${steps(1)}
    <h1>Creación de experiencia pedagógica</h1>
    <p class="lead" style="font-weight:500">Ingresa la información básica para vincular los objetivos del aula con los recursos de la Bibliolab.</p>
    <form id="f-crear" novalidate>
      <div class="two">
        <div class="field"><label for="asig">Asignatura <span class="req" aria-hidden="true">*</span></label>
          <select id="asig" required aria-describedby="e-asig"><option value="">Seleccione una…</option>${ASIGNATURAS.map(a => `<option ${f.asignatura === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
          <p class="err" id="e-asig"></p></div>
        <div class="field"><label for="grado">Grado <span class="req" aria-hidden="true">*</span></label>
          <select id="grado" required aria-describedby="e-grado"><option value="">Seleccione uno…</option>${GRADOS.map(a => `<option ${f.grado === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
          <p class="err" id="e-grado"></p></div>
      </div>
      <div class="field"><label for="obj">Objetivo de aprendizaje <span class="req" aria-hidden="true">*</span></label>
        <textarea id="obj" rows="4" required aria-describedby="e-obj" placeholder="Ej.: Reconocer las propiedades físicas del sonido mediante experimentos sencillos y grabación sonora">${esc(f.objetivo)}</textarea>
        <p class="err" id="e-obj"></p></div>
      <fieldset class="field" style="border:0;padding:0;margin:14px 0" aria-describedby="e-enf">
        <legend>Enfoque principal <span class="req" aria-hidden="true">*</span></legend>
        <p class="note" style="margin:2px 0 0">La actividad puede incluir matices de los otros enfoques. Elige uno.</p>
        <div class="enf-grid">${Object.entries(ENFOQUES).map(([k, e]) => `
          <label class="enf e-${k}"><input type="radio" name="enf" value="${k}" ${f.enfoque === k ? 'checked' : ''}>
            <span class="chk">${ic('check')}</span><strong>${e.n}</strong><small>${e.d}</small></label>`).join('')}</div>
        <p class="err" id="e-enf"></p>
      </fieldset>
      <div class="bar">
        <button class="btn btn-light" type="submit">Generar propuesta</button><span class="vr" aria-hidden="true"></span>
        <p><strong>Antes de generar:</strong> la asignatura, el grado y el objetivo no podrás editarlos después. Lo que sí podrás ajustar es la ficha de la actividad.</p>
      </div>
    </form></main>`);
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

/* ================= P4 · Buscando la propuesta ================= */
function p4() {
  if (!S.form.asignatura || !S.form.grado || !S.form.objetivo.trim() || !S.form.enfoque) { location.hash = '#/p3'; return; }
  view(`${cabecera()}<main class="page" style="max-width:1000px">${steps(2)}
    <section class="panel loading" aria-live="polite"><h1>Buscando una plantilla para tu objetivo…</h1>
    <p style="font-size:20px">Estamos revisando el catálogo de plantillas del enfoque <strong>${ENFOQUES[S.form.enfoque].n}</strong>.</p>
    <div class="icons">${ic('book')}${ic('bulb')}${ic('pencil')}${ic('group')}</div></section></main>`);
  S.timer = setTimeout(() => {
    if (S.demo.conexion) {
      $('.loading').innerHTML = `<h1>No pudimos crear la propuesta</h1><p style="font-size:20px">No pudimos crear la propuesta. Tus datos se conservaron; reinténtalo.</p>
        <div class="row" style="justify-content:center"><button class="btn btn-light" id="reint">Reintentar</button><a class="btn btn-ghost" style="color:#fff;border-color:#fff" href="#/p3">Volver al formulario</a></div>`;
      $('#reint').onclick = p4; $('.loading h1').setAttribute('tabindex', '-1'); $('.loading h1').focus();
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
function p5() {
  if (!S.draft) { location.hash = '#/p3'; return; }
  const f = S.draft;
  view(`${cabecera()}<main class="page" style="max-width:1100px">${steps(2)}
    <h1>Propuesta y edición de ficha</h1>
    <p class="lead" style="font-weight:500">Es un borrador; puedes ajustarlo antes de confirmar. Aún no tiene código. <span class="note">(Propuesta del catálogo ${S.idx + 1} de ${CATALOGO[f.enfoque].length})</span></p>
    <div class="sheet-wrap" tabindex="0" aria-label="Borrador de la ficha, desplázate para leerlo completo">${S.editing ? `<div class="ficha">${editFormHTML(f)}</div>` : fichaHTML(f)}</div>
    <div class="float-actions">
      ${S.editing ? `<button class="btn btn-primary" id="guardar">${ic('check')} Guardar cambios</button><button class="btn btn-ghost" id="descartar">Descartar cambios</button>`
      : `<button class="btn btn-ghost" id="editar">${ic('pencil')} Editar manualmente</button>
         <button class="btn btn-ghost" id="regen">Regenerar propuesta</button>
         <button class="btn btn-ghost" id="vista">Vista completa</button>`}
    </div>
    <p id="msg5" class="err" role="alert"></p>
    <div class="bar"><p>Este es un borrador de la ficha de la actividad final. Puedes hacer ediciones manuales antes de continuar.</p>
      <button class="btn btn-light" id="cont">Continuar</button></div></main>`);
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

/* ================= P6 · Fecha estimada ================= */
function p6() {
  if (!S.draft) { location.hash = '#/p3'; return; }
  view(`${cabecera()}<main class="page" style="max-width:1100px">${steps(3)}
    <section class="panel"><div class="two" style="align-items:center">
      <div><h1>Fecha estimada de la sesión</h1><p style="font-size:19px">Es opcional. Define el momento tentativo en el que llevarás a tus estudiantes a la Bibliolab.</p>
        ${asset(A.caritas, 'Caritas de estudiantes (ilustración)', 'caritas')}</div>
      <div><div class="field" style="color:#fff"><label for="fecha" style="color:#fff">Fecha estimada (opcional)</label>
        <input type="date" id="fecha" min="${hoy()}" value="${S.fecha}" aria-describedby="fecha-note e-fecha"></div>
        <p class="err" id="e-fecha" role="alert"></p>
        <p id="fecha-note" class="note">${ic('info').replace('<svg', '<svg width="20" height="20" style="vertical-align:-4px"')} No reserva el espacio; confirma la disponibilidad con la encargada de la Bibliolab.</p>
        <button class="link" style="color:#fff" id="quitar" type="button">Continuar sin fecha</button></div></div>
      <p id="e-gen" class="err" role="alert" style="margin-top:14px"></p>
      <div class="row" style="justify-content:center;margin-top:16px"><button class="btn btn-light" id="gen">Generar ficha y código único</button>
        <a class="btn btn-ghost" style="color:#fff;border-color:#fff" href="#/p5">Volver a la propuesta</a></div></section></main>`);
  $('#fecha').onchange = e => { S.fecha = e.target.value; };
  $('#quitar').onclick = () => { S.fecha = ''; $('#fecha').value = ''; $('#e-fecha').textContent = ''; toast('Sin fecha estimada'); };
  $('#gen').onclick = () => {
    const v = $('#fecha').value;
    if (v && v < hoy()) { $('#e-fecha').textContent = 'La fecha no puede ser anterior a hoy.'; $('#fecha').setAttribute('aria-invalid', 'true'); return; }
    S.fecha = v; $('#e-fecha').textContent = ''; $('#e-gen').textContent = '';
    const b = $('#gen'); b.disabled = true; b.textContent = 'Generando…';
    S.timer = setTimeout(() => {
      if (S.demo.conexion) { b.disabled = false; b.textContent = 'Generar ficha y código único'; $('#e-gen').textContent = 'No pudimos crear la propuesta. Tus datos se conservaron; reinténtalo.'; return; }
      const a = {codigo:genCodigo(), estado:'Programada', fecha:S.fecha, ficha:JSON.parse(JSON.stringify(S.draft)), evid:[]};
      store[a.codigo] = a; S.current = a; S.justCreated = true; location.hash = '#/p7';
    }, 900);
  };
}

/* ================= P7 · Gestión de la actividad ================= */
function p7() {
  const a = S.current; if (!a) { location.hash = '#/p1'; return; }
  const f = a.ficha, off = a.estado === 'Inactiva';
  view(`${cabecera()}<main class="page gestion">
    ${S.justCreated ? `<div class="ok-bar" role="status">${ic('check')} ¡Experiencia pedagógica creada con éxito!</div>` : ''}
    <div class="g-head"><div><h1>Gestión de actividad</h1><p class="sub">${esc(f.titulo)}</p></div>
      <p class="estado ${off ? 'off' : 'on'}"><span class="dot" aria-hidden="true"></span>Estado: <strong>${a.estado}</strong></p></div>
    ${off ? `<div class="warn" role="status">${ic('info')} <span>Esta actividad está Inactiva. Informa a la encargada de la Bibliolab para liberar los recursos y el espacio.</span></div>` : ''}
    <div class="g-grid">
      <section><h2>Ficha de experiencia</h2>
        <dl><dt>Asignatura</dt><dd>${esc(f.asignatura)}</dd><dt>Grado</dt><dd>${esc(f.grado)}</dd>
        <dt>Enfoque principal</dt><dd>${ENFOQUES[f.enfoque].n}</dd><dt>Objetivo</dt><dd>${esc(f.objetivo)}</dd>
        <dt>Producto esperado</dt><dd>${esc(f.producto)}</dd><dt>Duración</dt><dd>${totalMin(f)} min</dd>
        <dt>Fecha estimada</dt><dd>${fmtFecha(a.fecha)}${a.fecha ? ' <span class="note">(no reserva el espacio)</span>' : ''}</dd>
        <dt>Recursos</dt><dd>${f.recursos.map(esc).join(', ')}</dd></dl>
        <div class="actions">
          <button class="btn btn-ghost" id="editar" ${off ? 'disabled' : ''}>${ic('pencil')} Editar ficha</button>
          <button class="btn btn-ghost" id="respaldo">${ic('download')} Descargar respaldo (PDF + JSON)</button>
          <button class="btn btn-danger" id="cancelar" ${off ? 'disabled' : ''}>${ic('trash')} Cancelar actividad</button></div>
        <div id="msg7" role="status" aria-live="polite"></div>
        <div class="ev-actions"><button class="btn btn-pink" id="subir" ${off ? 'disabled' : ''}>Subir evidencias de grupos de trabajo</button>
          <a class="link" href="#/p10">Visualizar galería de evidencias</a></div>
      </section>
      <aside class="codigo-card" aria-label="Código de la actividad">
        <h2>Código</h2><p class="codigo">${esc(a.codigo)}</p>
        <p>Digítalo en el computador de la biblioteca. <strong class="warn-t">No lo compartas con los estudiantes.</strong></p>
        <button class="btn btn-primary" id="copiar">${ic('copy')} Copiar código</button></aside>
    </div>
    <div style="margin-top:26px" class="row">${asset(A.docente, 'Personaje docente (ilustración)', 'char')}</div>
    <p style="margin-top:20px"><a class="link" href="#/p1">Ir al inicio</a></p></main>`);
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
      <div class="row"><button class="btn btn-light" data-ok>Confirmar cancelación</button><button class="btn btn-pink" style="border-color:#fff" data-close>Volver</button></div>`, 'pink');
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

/* ================= P9 · Subir evidencias ================= */
const FORMATOS = ['pdf','jpg','jpeg','png','docx'], MAX_MB = 5;
function p9() {
  const a = S.current; if (!a) { location.hash = '#/p1'; return; }
  if (a.estado === 'Inactiva') { location.hash = '#/p7'; return; }
  const u = S.up;
  view(`${cabecera()}<main class="page"><section class="card upl">
    <h1>Subir evidencias</h1><p class="sub">Actividad ${esc(a.codigo)} · ${esc(a.ficha.titulo)}</p>
    <div class="conds"><p style="margin:0"><strong>Sube el producto, no fotos con rostros.</strong> Recomendamos no incluir rostros ni nombres. Si el material identifica a alguien, necesitas autorización.
      <button class="link" id="vercond" type="button">Ver condiciones de uso</button></p>
      <label style="display:flex;gap:10px;margin-top:8px;align-items:flex-start"><input type="checkbox" id="ok" ${u.ok ? 'checked' : ''} style="width:22px;height:22px;margin-top:2px">
      <span>Confirmo que leí las condiciones de uso y que el material cumple con ellas.</span></label>
      <p class="err" id="e-ok" role="alert"></p></div>
    <fieldset class="tabs"><legend class="sr-only">Qué vas a compartir</legend>
      ${[['archivo','Archivo'],['enlace','Enlace'],['descripcion','Descripción']].map(([k, t]) => `<label><input type="radio" name="modo" value="${k}" ${u.modo === k ? 'checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
    <div id="cuerpo">${u.modo === 'archivo' ? `
      <label class="drop" id="drop"><input type="file" id="file" accept=".pdf,.jpg,.jpeg,.png,.docx">${ic('upload')}
        <p style="margin:.3em 0"><strong>${u.file ? esc(u.file.name) : 'Arrastra el archivo aquí o haz clic para elegirlo'}</strong></p>
        <p class="note" style="margin:0">Formatos y tamaño máximo: <span class="tag-pd">[por definir]</span> — de ejemplo: PDF, JPG, PNG, DOCX, hasta ${MAX_MB} MB.</p></label>`
      : u.modo === 'enlace' ? `<div class="field"><label for="enlace">Enlace al producto</label><input type="url" id="enlace" placeholder="https://" value="${esc(u.enlace)}"></div>`
      : `<div class="field"><label for="desc">Descripción del producto</label><textarea id="desc" rows="4" placeholder="Describe el producto del grupo (sin nombres de estudiantes)">${esc(u.desc)}</textarea></div>`}
    </div>
    <p class="err" id="e-cuerpo" role="alert"></p>
    <div class="field"><label for="grupo">Número o etiqueta del grupo <span class="note">(opcional)</span></label>
      <input type="text" id="grupo" maxlength="30" placeholder="Ej.: Grupo 1" value="${esc(u.grupo)}">
      <p class="note">Usa un número o una etiqueta que no identifique a personas.</p></div>
    <div id="prog" hidden><div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div></div></div><p id="prog-t" class="note"></p></div>
    <div class="row"><button class="btn btn-pink" id="enviar">Subir evidencia</button><a class="btn btn-ghost" href="#/p7">Volver a la gestión</a></div>
  </section></main>`);
  const collect = () => { u.ok = $('#ok').checked; u.grupo = $('#grupo').value; if ($('#enlace')) u.enlace = $('#enlace').value; if ($('#desc')) u.desc = $('#desc').value; };
  $('#vercond').onclick = abrirCondiciones;
  document.querySelectorAll('input[name=modo]').forEach(r => r.onchange = () => { collect(); u.modo = r.value; p9(); });
  const setFile = f => {
    const ext = (f.name.split('.').pop() || '').toLowerCase(), err = $('#e-cuerpo');
    if (!FORMATOS.includes(ext)) { u.file = null; err.textContent = 'Formato no admitido. Formatos de ejemplo: PDF, JPG, PNG, DOCX [por definir].'; return; }
    if (f.size > MAX_MB * 1024 * 1024) { u.file = null; err.textContent = `Archivo demasiado grande (máximo de ejemplo: ${MAX_MB} MB [por definir]). Comprímelo e inténtalo de nuevo.`; return; }
    collect(); u.file = f; p9();
  };
  if ($('#file')) {
    $('#file').onchange = e => { if (e.target.files[0]) setFile(e.target.files[0]); };
    const d = $('#drop');
    ['dragover', 'dragenter'].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.remove('over'); }));
    d.addEventListener('drop', e => { if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); });
  }
  const enviar = () => {
    collect(); $('#e-ok').textContent = ''; $('#e-cuerpo').textContent = '';
    if (!u.ok) { $('#e-ok').textContent = 'Marca la casilla para confirmar las condiciones de uso.'; $('#ok').focus(); return; }
    let nombre = '';
    if (u.modo === 'archivo') { if (!u.file) { $('#e-cuerpo').textContent = 'Elige un archivo para subir.'; return; } nombre = u.file.name; }
    if (u.modo === 'enlace') { if (!/^https?:\/\/\S+\.\S+/.test(u.enlace.trim())) { $('#e-cuerpo').textContent = 'Escribe un enlace válido que empiece por http:// o https://.'; return; } nombre = u.enlace.trim(); }
    if (u.modo === 'descripcion') { if (!u.desc.trim()) { $('#e-cuerpo').textContent = 'Escribe la descripción del producto.'; return; } nombre = u.desc.trim().slice(0, 90); }
    const bar = $('#prog'), fill = $('.prog > div'), pt = $('#prog-t'), btn = $('#enviar');
    bar.hidden = false; btn.disabled = true; let p = 0; pt.textContent = 'Subiendo…';
    clearInterval(S.iv);
    S.iv = setInterval(() => {
      p += 12; const stop = S.demo.subida && p >= 60;
      if (stop) p = 60;
      fill.style.width = p + '%'; $('.prog').setAttribute('aria-valuenow', p);
      if (stop) { clearInterval(S.iv); btn.disabled = false; pt.innerHTML = '<span class="err">No se completó la carga.</span> <button class="btn btn-ghost" id="reint9">Reintentar</button>'; $('#reint9').onclick = enviar; $('#reint9').focus(); return; }
      if (p >= 100) {
        clearInterval(S.iv);
        a.evid.push({tipo:u.modo, nombre, grupo:u.grupo.trim()});
        S.up = {modo:'archivo', file:null, enlace:'', desc:'', grupo:'', ok:false};
        toast('Evidencia subida (simulado)'); location.hash = '#/p10';
      }
    }, 280);
  };
  $('#enviar').onclick = enviar;
}

/* ================= P10 · Galería de evidencias ================= */
function p10() {
  const a = S.current; if (!a) { location.hash = '#/p1'; return; }
  const T = {archivo:'Archivo', enlace:'Enlace', descripcion:'Descripción'};
  view(`${cabecera()}<main class="page" style="max-width:1000px">
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
  view(`${cabecera()}<main class="page" style="max-width:900px">${steps(2)}
    <section class="panel" style="text-align:center"><h1>No encontramos una propuesta para tu objetivo</h1>
    <p style="font-size:20px">Reformula el objetivo o cambia el enfoque principal e inténtalo de nuevo. Tus datos se conservaron.</p>
    <div class="row" style="justify-content:center"><a class="btn btn-light" href="#/p3">Volver al formulario</a></div></section></main>`);
}

/* ================= Router ================= */
const R = {p1, p2, p3, p4, p5, p6, p7, p9, p10, p11, p23};
function route() {
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

route();