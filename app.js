const SUPABASE_URL = 'https://uaicpoanvmwychklskak.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWNwb2Fudm13eWNoa2xza2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTgxODYsImV4cCI6MjA5NjA3NDE4Nn0.Dd9ekrCNGcChyx_7OQnUPOu8iDC-VujGHoeyRByMgP8';

const sb = (table) => ({
  url: `${SUPABASE_URL}/rest/v1/${table}`,
  headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }
});

async function dbGet(table, params = '') {
  const r = await fetch(`${sb(table).url}?${params}`, { headers: sb(table).headers });
  return r.json();
}

// Llama a una función (RPC) de Supabase. Toda escritura pasa por acá: el servidor
// verifica la contraseña antes de tocar nada. Devuelve el resultado ya parseado.
async function rpc(fn, args) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args || {})
  });
  if (!r.ok) {
    let msg = 'Error de servidor';
    try { const e = await r.json(); msg = e.message || e.hint || msg; } catch (_) {}
    throw new Error(msg);
  }
  const txt = await r.text();
  return txt ? JSON.parse(txt) : null;
}

// ── DATA ─────────────────────────────────────────────────────────────────────

// Códigos ISO para flagcdn.com (funcionan en todos los navegadores incluyendo Windows)
const FLAGS = {
  'México':'mx','Sudáfrica':'za','Corea del Sur':'kr','Rep. Checa':'cz',
  'Canadá':'ca','Bosnia y Herz.':'ba','Qatar':'qa','Suiza':'ch',
  'Brasil':'br','Marruecos':'ma','Haití':'ht','Escocia':'gb-sct',
  'USA':'us','Paraguay':'py','Australia':'au','Turquía':'tr',
  'Alemania':'de','Curazao':'cw','Costa de Marfil':'ci','Ecuador':'ec',
  'Países Bajos':'nl','Japón':'jp','Suecia':'se','Túnez':'tn',
  'Bélgica':'be','Egipto':'eg','Irán':'ir','Nueva Zelanda':'nz',
  'España':'es','Cabo Verde':'cv','Arabia Saudita':'sa','Uruguay':'uy',
  'Francia':'fr','Senegal':'sn','Irak':'iq','Noruega':'no',
  'Argentina':'ar','Argelia':'dz','Austria':'at','Jordania':'jo',
  'Portugal':'pt','RD Congo':'cd','Uzbekistán':'uz','Colombia':'co',
  'Inglaterra':'gb-eng','Croacia':'hr','Ghana':'gh','Panamá':'pa'
};

const GRP_COLORS = {
  A:'#e63946',B:'#f4a261',C:'#2a9d8f',D:'#457b9d',E:'#6a4c93',F:'#f77f00',
  G:'#00b4d8',H:'#e76f51',I:'#2dc653',J:'#c77dff',K:'#ef233c',L:'#4cc9f0'
};

const GRUPOS = {
  A:['México','Sudáfrica','Corea del Sur','Rep. Checa'],
  B:['Canadá','Bosnia y Herz.','Qatar','Suiza'],
  C:['Brasil','Marruecos','Haití','Escocia'],
  D:['USA','Paraguay','Australia','Turquía'],
  E:['Alemania','Curazao','Costa de Marfil','Ecuador'],
  F:['Países Bajos','Japón','Suecia','Túnez'],
  G:['Bélgica','Egipto','Irán','Nueva Zelanda'],
  H:['España','Cabo Verde','Arabia Saudita','Uruguay'],
  I:['Francia','Senegal','Irak','Noruega'],
  J:['Argentina','Argelia','Austria','Jordania'],
  K:['Portugal','RD Congo','Uzbekistán','Colombia'],
  L:['Inglaterra','Croacia','Ghana','Panamá']
};

const MATCHES = [
  {id:1,j:1,g:'A',h:'México',a:'Sudáfrica',date:'Jue 11 jun',time:'16:00',sede:'Azteca, CDMX'},
  {id:2,j:1,g:'A',h:'Corea del Sur',a:'Rep. Checa',date:'Jue 11 jun',time:'23:00',sede:'Akron, Guadalajara'},
  {id:7,j:1,g:'B',h:'Canadá',a:'Bosnia y Herz.',date:'Vie 12 jun',time:'16:00',sede:'BMO Field, Toronto'},
  {id:19,j:1,g:'D',h:'USA',a:'Paraguay',date:'Vie 12 jun',time:'22:00',sede:'SoFi, Los Ángeles'},
  {id:8,j:1,g:'B',h:'Qatar',a:'Suiza',date:'Sáb 13 jun',time:'16:00',sede:"Levi's, San Francisco"},
  {id:13,j:1,g:'C',h:'Brasil',a:'Marruecos',date:'Sáb 13 jun',time:'19:00',sede:'MetLife, Nueva Jersey'},
  {id:14,j:1,g:'C',h:'Haití',a:'Escocia',date:'Sáb 13 jun',time:'22:00',sede:'Gillette, Boston'},
  {id:20,j:1,g:'D',h:'Australia',a:'Turquía',date:'Dom 14 jun',time:'01:00',sede:'BC Place, Vancouver'},
  {id:25,j:1,g:'E',h:'Alemania',a:'Curazao',date:'Dom 14 jun',time:'14:00',sede:'NRG, Houston'},
  {id:31,j:1,g:'F',h:'Países Bajos',a:'Japón',date:'Dom 14 jun',time:'17:00',sede:"AT&T, Dallas"},
  {id:26,j:1,g:'E',h:'Costa de Marfil',a:'Ecuador',date:'Dom 14 jun',time:'20:00',sede:'Lincoln Financial, Filadelfia'},
  {id:32,j:1,g:'F',h:'Suecia',a:'Túnez',date:'Dom 14 jun',time:'23:00',sede:'BBVA, Monterrey'},
  {id:37,j:1,g:'G',h:'Bélgica',a:'Egipto',date:'Lun 15 jun',time:'16:00',sede:'Lumen Field, Seattle'},
  {id:43,j:1,g:'H',h:'España',a:'Cabo Verde',date:'Lun 15 jun',time:'13:00',sede:'Mercedes-Benz, Atlanta'},
  {id:44,j:1,g:'H',h:'Arabia Saudita',a:'Uruguay',date:'Lun 15 jun',time:'19:00',sede:'Hard Rock, Miami'},
  {id:38,j:1,g:'G',h:'Irán',a:'Nueva Zelanda',date:'Lun 15 jun',time:'22:00',sede:'SoFi, Los Ángeles'},
  {id:49,j:1,g:'I',h:'Francia',a:'Senegal',date:'Mar 16 jun',time:'16:00',sede:'MetLife, Nueva Jersey'},
  {id:50,j:1,g:'I',h:'Irak',a:'Noruega',date:'Mar 16 jun',time:'19:00',sede:'Gillette, Boston'},
  {id:55,j:1,g:'J',h:'Argentina',a:'Argelia',date:'Mar 16 jun',time:'22:00',sede:'Arrowhead, Kansas City'},
  {id:56,j:1,g:'J',h:'Austria',a:'Jordania',date:'Mar 16 jun',time:'02:00',sede:"Levi's, San Francisco"},
  {id:61,j:1,g:'K',h:'Portugal',a:'RD Congo',date:'Mié 17 jun',time:'14:00',sede:'NRG, Houston'},
  {id:67,j:1,g:'L',h:'Inglaterra',a:'Croacia',date:'Mié 17 jun',time:'17:00',sede:"AT&T, Dallas"},
  {id:68,j:1,g:'L',h:'Ghana',a:'Panamá',date:'Mié 17 jun',time:'20:00',sede:'BMO Field, Toronto'},
  {id:62,j:1,g:'K',h:'Uzbekistán',a:'Colombia',date:'Mié 17 jun',time:'23:00',sede:'Azteca, CDMX'},

  {id:3,j:2,g:'A',h:'Rep. Checa',a:'Sudáfrica',date:'Mié 18 jun',time:'13:00',sede:'Mercedes-Benz, Atlanta'},
  {id:9,j:2,g:'B',h:'Suiza',a:'Bosnia y Herz.',date:'Mié 18 jun',time:'16:00',sede:'SoFi, Los Ángeles'},
  {id:4,j:2,g:'A',h:'México',a:'Corea del Sur',date:'Mié 18 jun',time:'22:00',sede:'Akron, Guadalajara'},
  {id:10,j:2,g:'B',h:'Canadá',a:'Qatar',date:'Mié 18 jun',time:'19:00',sede:'BC Place, Vancouver'},
  {id:15,j:2,g:'C',h:'Escocia',a:'Marruecos',date:'Jue 19 jun',time:'19:00',sede:'Gillette, Boston'},
  {id:16,j:2,g:'C',h:'Brasil',a:'Haití',date:'Jue 19 jun',time:'22:00',sede:'Lincoln Financial, Filadelfia'},
  {id:22,j:2,g:'D',h:'USA',a:'Australia',date:'Jue 19 jun',time:'16:00',sede:'Lumen Field, Seattle'},
  {id:21,j:2,g:'D',h:'Turquía',a:'Paraguay',date:'Jue 19 jun',time:'01:00',sede:"Levi's, San Francisco"},
  {id:33,j:2,g:'F',h:'Países Bajos',a:'Suecia',date:'Sáb 20 jun',time:'14:00',sede:'NRG, Houston'},
  {id:27,j:2,g:'E',h:'Alemania',a:'Costa de Marfil',date:'Sáb 20 jun',time:'17:00',sede:'BMO Field, Toronto'},
  {id:28,j:2,g:'E',h:'Curazao',a:'Ecuador',date:'Sáb 20 jun',time:'21:00',sede:'Arrowhead, Kansas City'},
  {id:34,j:2,g:'F',h:'Túnez',a:'Japón',date:'Sáb 20 jun',time:'01:00',sede:'BBVA, Monterrey'},
  {id:39,j:2,g:'G',h:'Bélgica',a:'Irán',date:'Dom 21 jun',time:'16:00',sede:'SoFi, Los Ángeles'},
  {id:45,j:2,g:'H',h:'España',a:'Arabia Saudita',date:'Dom 21 jun',time:'13:00',sede:'Mercedes-Benz, Atlanta'},
  {id:46,j:2,g:'H',h:'Uruguay',a:'Cabo Verde',date:'Dom 21 jun',time:'19:00',sede:'Hard Rock, Miami'},
  {id:40,j:2,g:'G',h:'Nueva Zelanda',a:'Egipto',date:'Dom 21 jun',time:'22:00',sede:'BC Place, Vancouver'},
  {id:51,j:2,g:'I',h:'Francia',a:'Irak',date:'Lun 22 jun',time:'18:00',sede:'Lincoln Financial, Filadelfia'},
  {id:52,j:2,g:'I',h:'Noruega',a:'Senegal',date:'Lun 22 jun',time:'21:00',sede:'MetLife, Nueva Jersey'},
  {id:57,j:2,g:'J',h:'Argentina',a:'Austria',date:'Lun 22 jun',time:'14:00',sede:"AT&T, Dallas"},
  {id:58,j:2,g:'J',h:'Jordania',a:'Argelia',date:'Mar 23 jun',time:'01:00',sede:"Levi's, San Francisco"},
  {id:63,j:2,g:'K',h:'Portugal',a:'Uzbekistán',date:'Mar 23 jun',time:'14:00',sede:'NRG, Houston'},
  {id:69,j:2,g:'L',h:'Inglaterra',a:'Ghana',date:'Mar 23 jun',time:'17:00',sede:'Gillette, Boston'},
  {id:70,j:2,g:'L',h:'Panamá',a:'Croacia',date:'Mar 23 jun',time:'20:00',sede:'BMO Field, Toronto'},
  {id:64,j:2,g:'K',h:'RD Congo',a:'Colombia',date:'Mar 23 jun',time:'23:00',sede:'Akron, Guadalajara'},

  {id:11,j:3,g:'B',h:'Suiza',a:'Canadá',date:'Mié 24 jun',time:'16:00',sede:'BC Place, Vancouver'},
  {id:12,j:3,g:'B',h:'Bosnia y Herz.',a:'Qatar',date:'Mié 24 jun',time:'16:00',sede:'Lumen Field, Seattle'},
  {id:5,j:3,g:'A',h:'Rep. Checa',a:'México',date:'Mié 24 jun',time:'22:00',sede:'Azteca, CDMX'},
  {id:6,j:3,g:'A',h:'Sudáfrica',a:'Corea del Sur',date:'Mié 24 jun',time:'22:00',sede:'BBVA, Monterrey'},
  {id:17,j:3,g:'C',h:'Escocia',a:'Brasil',date:'Mié 24 jun',time:'19:00',sede:'Hard Rock, Miami'},
  {id:29,j:3,g:'E',h:'Ecuador',a:'Alemania',date:'Jue 25 jun',time:'17:00',sede:'MetLife, Nueva Jersey'},
  {id:30,j:3,g:'E',h:'Curazao',a:'Costa de Marfil',date:'Jue 25 jun',time:'17:00',sede:'Lincoln Financial, Filadelfia'},
  {id:35,j:3,g:'F',h:'Japón',a:'Suecia',date:'Jue 25 jun',time:'20:00',sede:"AT&T, Dallas"},
  {id:36,j:3,g:'F',h:'Túnez',a:'Países Bajos',date:'Jue 25 jun',time:'20:00',sede:'Arrowhead, Kansas City'},
  {id:24,j:3,g:'D',h:'Paraguay',a:'Australia',date:'Jue 25 jun',time:'23:00',sede:"Levi's, San Francisco"},
  {id:41,j:3,g:'G',h:'Egipto',a:'Irán',date:'Sáb 27 jun',time:'00:00',sede:'Lumen Field, Seattle'},
  {id:42,j:3,g:'G',h:'Nueva Zelanda',a:'Bélgica',date:'Sáb 27 jun',time:'00:00',sede:'BC Place, Vancouver'},
  {id:47,j:3,g:'H',h:'Cabo Verde',a:'Arabia Saudita',date:'Vie 26 jun',time:'21:00',sede:'NRG, Houston'},
  {id:48,j:3,g:'H',h:'Uruguay',a:'España',date:'Vie 26 jun',time:'21:00',sede:'Akron, Guadalajara'},
  {id:53,j:3,g:'I',h:'Noruega',a:'Francia',date:'Vie 26 jun',time:'16:00',sede:'Gillette, Boston'},
  {id:54,j:3,g:'I',h:'Senegal',a:'Irak',date:'Vie 26 jun',time:'16:00',sede:'BMO Field, Toronto'},
  {id:18,j:3,g:'C',h:'Marruecos',a:'Haití',date:'Jue 26 jun',time:'19:00',sede:'Mercedes-Benz, Atlanta'},
  {id:23,j:3,g:'D',h:'Turquía',a:'USA',date:'Vie 26 jun',time:'23:00',sede:'SoFi, Los Ángeles'},
  {id:59,j:3,g:'J',h:'Argelia',a:'Austria',date:'Sáb 27 jun',time:'23:00',sede:'Arrowhead, Kansas City'},
  {id:60,j:3,g:'J',h:'Jordania',a:'Argentina',date:'Sáb 27 jun',time:'23:00',sede:"AT&T, Dallas"},
  {id:65,j:3,g:'K',h:'Colombia',a:'Portugal',date:'Sáb 27 jun',time:'20:30',sede:'Hard Rock, Miami'},
  {id:66,j:3,g:'K',h:'RD Congo',a:'Uzbekistán',date:'Sáb 27 jun',time:'20:30',sede:'Mercedes-Benz, Atlanta'},
  {id:71,j:3,g:'L',h:'Panamá',a:'Inglaterra',date:'Sáb 27 jun',time:'18:00',sede:'MetLife, Nueva Jersey'},
  {id:72,j:3,g:'L',h:'Croacia',a:'Ghana',date:'Sáb 27 jun',time:'18:00',sede:'Lincoln Financial, Filadelfia'}
];

// ── ESTRUCTURA DEL BRACKET (Mundial 2026, formato 48 equipos) ──────────────────
// Cada slot usa etiquetas oficiales FIFA: 1A=ganador grupo A, 2B=segundo grupo B,
// 3rd-XXXXX = uno de los 8 mejores terceros (de la combinación de grupos indicada)
const BRACKET = {
  r32: [ // Ronda de 32 (16avos) — cruces oficiales Anexo C FIFA
    {id:'R32-1', home:'2A', away:'2B',  date:'Dom 28 jun', time:'14:00', sede:'Boston'},
    {id:'R32-2', home:'1E', away:'3-ABCDF', date:'Dom 28 jun', time:'17:00', sede:'Filadelfia'},
    {id:'R32-3', home:'1F', away:'2C',  date:'Lun 29 jun', time:'14:00', sede:'Los Ángeles'},
    {id:'R32-4', home:'1C', away:'2F',  date:'Lun 29 jun', time:'21:00', sede:'Houston'},
    {id:'R32-5', home:'1I', away:'3-CDFGH', date:'Mar 30 jun', time:'14:00', sede:'Nueva Jersey'},
    {id:'R32-6', home:'2E', away:'2I',  date:'Mar 30 jun', time:'21:00', sede:'Dallas'},
    {id:'R32-7', home:'1A', away:'3-CEFHI', date:'Mié 1 jul', time:'14:00', sede:'Guadalajara'},
    {id:'R32-8', home:'1L', away:'3-EHIJK', date:'Mié 1 jul', time:'21:00', sede:'Atlanta'},
    {id:'R32-9', home:'1D', away:'3-BEFIJ', date:'Jue 2 jul', time:'14:00', sede:'San Francisco'},
    {id:'R32-10',home:'1G', away:'3-AEHIJ', date:'Jue 2 jul', time:'21:00', sede:'Seattle'},
    {id:'R32-11',home:'2K', away:'2L',  date:'Vie 3 jul', time:'14:00', sede:'Miami'},
    {id:'R32-12',home:'1H', away:'2J',  date:'Vie 3 jul', time:'21:00', sede:'Kansas City'},
    {id:'R32-13',home:'1B', away:'3-EFGIJ', date:'Sáb 4 jul', time:'14:00', sede:'Vancouver'},
    {id:'R32-14',home:'1J', away:'2H',  date:'Sáb 4 jul', time:'21:00', sede:'CDMX'},
    {id:'R32-15',home:'1K', away:'3-DEIJL', date:'Dom 5 jul', time:'14:00', sede:'Toronto'},
    {id:'R32-16',home:'2D', away:'2G',  date:'Dom 5 jul', time:'21:00', sede:'Monterrey'}
  ],
  r16: [ // Octavos — se nutren de los ganadores de R32
    {id:'R16-1', home:'W-R32-1', away:'W-R32-2', date:'Lun 6 jul', time:'16:00', sede:'Filadelfia'},
    {id:'R16-2', home:'W-R32-3', away:'W-R32-4', date:'Lun 6 jul', time:'21:00', sede:'Houston'},
    {id:'R16-3', home:'W-R32-5', away:'W-R32-6', date:'Mar 7 jul', time:'16:00', sede:'Dallas'},
    {id:'R16-4', home:'W-R32-7', away:'W-R32-8', date:'Mar 7 jul', time:'21:00', sede:'Atlanta'},
    {id:'R16-5', home:'W-R32-9', away:'W-R32-10', date:'Mié 8 jul', time:'16:00', sede:'Seattle'},
    {id:'R16-6', home:'W-R32-11', away:'W-R32-12', date:'Mié 8 jul', time:'21:00', sede:'Miami'},
    {id:'R16-7', home:'W-R32-13', away:'W-R32-14', date:'Jue 9 jul', time:'16:00', sede:'Vancouver'},
    {id:'R16-8', home:'W-R32-15', away:'W-R32-16', date:'Jue 9 jul', time:'21:00', sede:'Toronto'}
  ],
  qf: [ // Cuartos
    {id:'QF-1', home:'W-R16-1', away:'W-R16-2', date:'Sáb 11 jul', time:'16:00', sede:'Boston'},
    {id:'QF-2', home:'W-R16-3', away:'W-R16-4', date:'Sáb 11 jul', time:'21:00', sede:'Los Ángeles'},
    {id:'QF-3', home:'W-R16-5', away:'W-R16-6', date:'Dom 12 jul', time:'16:00', sede:'Kansas City'},
    {id:'QF-4', home:'W-R16-7', away:'W-R16-8', date:'Dom 12 jul', time:'21:00', sede:'Miami'}
  ],
  sf: [ // Semifinales
    {id:'SF-1', home:'W-QF-1', away:'W-QF-2', date:'Mar 14 jul', time:'16:00', sede:'Dallas'},
    {id:'SF-2', home:'W-QF-3', away:'W-QF-4', date:'Mié 15 jul', time:'16:00', sede:'Atlanta'}
  ],
  final: [
    {id:'FINAL', home:'W-SF-1', away:'W-SF-2', date:'Dom 19 jul', time:'16:00', sede:'MetLife, Nueva Jersey'}
  ]
};
const BRACKET_ROUNDS = [
  {key:'r32', name:'16avos'},
  {key:'r16', name:'Octavos'},
  {key:'qf', name:'Cuartos'},
  {key:'sf', name:'Semifinal'},
  {key:'final', name:'Final'}
];
const ALL_BRACKET_MATCHES = [...BRACKET.r32, ...BRACKET.r16, ...BRACKET.qf, ...BRACKET.sf, ...BRACKET.final];

// Las 5 combinaciones de grupos para cada slot de tercero (orden de prioridad
// de asignación según el orden de los 16avos). Cada cruce de tercero acepta uno
// de los grupos listados; se asigna automáticamente buscando el mejor calce.
const THIRD_SLOTS = [
  {id:'3-ABCDF', groups:['A','B','C','D','F']},
  {id:'3-CDFGH', groups:['C','D','F','G','H']},
  {id:'3-CEFHI', groups:['C','E','F','H','I']},
  {id:'3-EHIJK', groups:['E','H','I','J','K']},
  {id:'3-BEFIJ', groups:['B','E','F','I','J']},
  {id:'3-AEHIJ', groups:['A','E','H','I','J']},
  {id:'3-EFGIJ', groups:['E','F','G','I','J']},
  {id:'3-DEIJL', groups:['D','E','I','J','L']}
];

// ── STATE ────────────────────────────────────────────────────────────────────

let CU = null, IA = false, TOKEN = null, idleTimer = null;
let cache = { results: {}, players: [], playerInfo: {}, prons: {}, config: {},
              bracketResults: {}, bracketProns: {}, bracketSlots: {}, bracketConfirmed: false };

// ── HELPERS ──────────────────────────────────────────────────────────────────

const fl = t => { const code = FLAGS[t]; return code ? `<img src="https://flagcdn.com/w40/${code}.png" width="24" height="16" style="border-radius:2px;object-fit:cover;vertical-align:middle" alt="${t}">` : '<span style="display:inline-block;width:24px;height:16px;background:#333;border-radius:2px"></span>'; };
const ini = n => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
const win = (h,a) => h>a?'h':a>h?'a':'d';

// Devuelve el HTML de un avatar: foto si existe, si no las iniciales.
// size en px; cls opcional para clases extra
function avatarHtml(name, size, cls) {
  size = size || 28;
  cls = cls || '';
  const info = cache.playerInfo && cache.playerInfo[name];
  if (info && info.photo) {
    return `<img class="avatar-img ${cls}" src="${info.photo}" alt="${name}" style="width:${size}px;height:${size}px" onerror="this.outerHTML='<div class=\\'avatar ${cls}\\' style=\\'width:${size}px;height:${size}px;font-size:${Math.round(size*0.38)}px\\'>${ini(name)}</div>'">`;
  }
  return `<div class="avatar ${cls}" style="width:${size}px;height:${size}px;font-size:${Math.round(size*0.38)}px">${ini(name)}</div>`;
}

function pts(matchId, ph, pa) {
  const r = cache.results[matchId];
  if (!r) return null;
  if (ph === '' || ph === null || ph === undefined) return 0;
  const p = parseInt(ph), q = parseInt(pa);
  if (p === r.home_goals && q === r.away_goals) return 3;
  if (win(p,q) === win(r.home_goals, r.away_goals)) return 1;
  return 0;
}

// Convierte la fecha/hora de un partido de grupos (ej "Jue 11 jun" + "16:00")
// a un objeto Date en hora argentina (UTC-3). Devuelve null si no se puede.
const MESES_ABR = { ene:0, feb:1, mar:2, abr:3, may:4, jun:5, jul:6, ago:7, sep:8, oct:9, nov:10, dic:11 };
function matchKickoff(m) {
  if (!m || !m.date || !m.time) return null;
  // date viene como "Jue 11 jun" → extraer día y mes
  const parts = m.date.split(' ');
  if (parts.length < 3) return null;
  const day = parseInt(parts[1]);
  const mes = MESES_ABR[parts[2].toLowerCase().slice(0,3)];
  if (isNaN(day) || mes === undefined) return null;
  const [hh, mm] = m.time.split(':').map(x => parseInt(x));
  if (isNaN(hh)) return null;
  // Construir el instante en ARG (UTC-3): equivale a UTC = hora + 3
  return new Date(Date.UTC(2026, mes, day, hh + 3, mm || 0, 0));
}

// ¿Ya arrancó un partido de la fase de grupos? (bloquea su pronóstico)
function groupMatchStarted(m) {
  const ko = matchKickoff(m);
  if (!ko) return false;
  return new Date() >= ko;
}

function go(s) {
  document.querySelectorAll('.screen').forEach(x => x.classList.remove('active'));
  document.getElementById(s).classList.add('active');
}

function st(id, btn) {
  const p = btn.closest('.screen');
  p.querySelectorAll('.tc').forEach(x => x.classList.remove('on'));
  p.querySelectorAll('.tab').forEach(x => x.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  btn.classList.add('on');
  if (id === 'tt' || id === 'at') renderTbl(id === 'at' ? 'atblcont' : 'tblcont');
  if (id === 'tr') renderMyRes();
  if (id === 'te') renderPosiciones('u');
  if (id === 'ae2') renderPosiciones('a');
  if (id === 'apa') renderPart();
}

// Sub-selector de la pestaña Posiciones: Fase de grupos / Eliminatorias
let selPos = { u: 'grupos', a: 'grupos' };
let selGrpView = { u: 'tabla', a: 'tabla' };   // dentro de Fase de grupos: tabla completa / mejores terceros
function renderPosiciones(mode) {
  const selId = mode === 'u' ? 'possu' : 'possa';
  const contId = mode === 'u' ? 'poscont-u' : 'poscont-a';
  const sel = document.getElementById(selId);
  sel.innerHTML = '';
  [['grupos','Fase de grupos'],['elim','Eliminatorias']].forEach(([k,label]) => {
    const b = document.createElement('button');
    b.className = 'gbt' + (selPos[mode] === k ? ' on' : '');
    b.innerHTML = `<strong>${label}</strong>`;
    b.onclick = () => { selPos[mode] = k; renderPosiciones(mode); };
    sel.appendChild(b);
  });
  if (selPos[mode] === 'grupos') renderGrupos(mode, contId);
  else renderElim(contId, mode === 'a');
}

// Fase de grupos con toggle: Tabla completa / Mejores terceros
function setGrpView(mode, k) {
  selGrpView[mode] = k;
  renderGrupos(mode, mode === 'u' ? 'poscont-u' : 'poscont-a');
}
function renderGrupos(mode, contId) {
  let html = `<div class="grp-tabs" style="margin-bottom:1rem;justify-content:center">`;
  [['tabla','Tabla completa'],['terceros','Mejores terceros']].forEach(([k,label]) => {
    html += `<button class="gbt${selGrpView[mode] === k ? ' on' : ''}" onclick="setGrpView('${mode}','${k}')">${label}</button>`;
  });
  html += `</div><div id="grpbody-${mode}"></div>`;
  document.getElementById(contId).innerHTML = html;
  if (selGrpView[mode] === 'tabla') renderGrpStandings('grpbody-' + mode);
  else renderThirdsTable('grpbody-' + mode);
}

// Tabla única de los 12 terceros, ordenados por Pts → DG → GF; los 8 primeros clasifican (verde)
function renderThirdsTable(bodyId) {
  const QC = '#22c55e';
  const thirds = Object.keys(GRUPOS).map(g => ({ ...computeGroupTable(g)[2], grp: g }))
    .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
  let html = `<div style="margin-bottom:.75rem;font-size:12px;color:var(--text2);display:flex;align-items:center;gap:8px">
    <span style="display:inline-block;width:11px;height:11px;border-radius:2px;background:${QC}"></span>
    Los 8 mejores terceros (borde verde) clasifican a 16avos de final
  </div>
  <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius2);overflow:hidden">
  <table class="stbl"><thead><tr>
    <th style="width:18px"></th><th>Selección</th><th>Gr</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th>
  </tr></thead><tbody>`;
  thirds.forEach((s, i) => {
    const q = i < 8;
    html += `<tr ${q ? 'class="qualify-bar"' : ''} style="${q ? `--grp-color:${QC};` : ''}">
      <td style="font-size:11px;color:var(--text3);padding-left:10px">${i + 1}</td>
      <td><div class="team-cell"><span class="flag">${fl(s.team)}</span><span>${s.team}</span></div></td>
      <td><span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:4px;background:${GRP_COLORS[s.grp]};font-size:10px;font-weight:700;color:#fff">${s.grp}</span></td>
      <td>${s.pj}</td><td>${s.g}</td><td>${s.e}</td><td>${s.p}</td>
      <td>${s.gf}</td><td>${s.gc}</td><td>${s.dg >= 0 ? '+' + s.dg : s.dg}</td>
      <td class="pts-bold">${s.pts}</td>
    </tr>`;
  });
  html += `</tbody></table></div>`;
  document.getElementById(bodyId).innerHTML = html;
}

// ── AUTH ─────────────────────────────────────────────────────────────────────

async function doLogin() {
  const n = document.getElementById('ln').value.trim();
  const p = document.getElementById('lp').value;
  const e = document.getElementById('le');
  if (!n) { e.textContent = 'Ingresá tu nombre'; return; }
  if (!p) { e.textContent = 'Ingresá tu contraseña'; return; }
  // Verificación en el servidor: la contraseña nunca viaja de vuelta al navegador.
  let rows;
  try {
    rows = await rpc('prode_login', { p_name: n, p_pass: p });
  } catch (err) { e.textContent = 'Error de conexión. Probá de nuevo.'; return; }
  const acct = rows && rows[0];
  if (!acct) { e.textContent = 'Nombre o contraseña incorrectos. Si no tenés cuenta, pedísela al organizador.'; return; }
  e.textContent = '';
  CU = acct.name; TOKEN = acct.token; IA = false; // usar el nombre tal como está guardado
  persistSession('player', acct.name);
  await loadCache();
  renderUsr();
  go('usr');
  startIdle();
}

async function doAdmin() {
  const p = document.getElementById('ap').value;
  const e = document.getElementById('ae');
  let token;
  try { token = await rpc('prode_admin_login', { p_pass: p }); }
  catch (err) { e.textContent = 'Error de conexión. Probá de nuevo.'; return; }
  if (!token) { e.textContent = 'Contraseña incorrecta'; return; }
  e.textContent = '';
  IA = true; TOKEN = token;
  persistSession('admin', null);
  await loadCache();
  renderAdm();
  go('adm');
  startIdle();
}

async function doOut(byIdle) {
  try { if (TOKEN) await rpc('prode_logout', { p_token: TOKEN }); } catch (_) {}
  CU = null; IA = false; TOKEN = null;
  if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
  clearSession();
  document.getElementById('ln').value = '';
  document.getElementById('lp').value = '';
  const e = document.getElementById('le');
  if (e) e.textContent = (byIdle === true) ? 'Tu sesión se cerró por inactividad.' : '';
  go('sl');
}

// ── SESIÓN (token guardado en el navegador + cierre por inactividad) ──────────

function persistSession(kind, name) {
  try { localStorage.setItem('prode_session', JSON.stringify({ token: TOKEN, kind, name: name || null })); } catch (_) {}
}
function clearSession() {
  try { localStorage.removeItem('prode_session'); } catch (_) {}
}

// Reinicia el contador de inactividad; a los 10 min sin actividad cierra sesión.
function resetIdle() {
  if (idleTimer) clearTimeout(idleTimer);
  if (!TOKEN) return;
  idleTimer = setTimeout(() => doOut(true), 10 * 60 * 1000);
}
function startIdle() {
  ['click', 'keydown', 'touchstart', 'scroll'].forEach(ev =>
    document.addEventListener(ev, resetIdle, { passive: true }));
  resetIdle();
}

// Al abrir la página, intenta reanudar la sesión si el token sigue vivo.
async function resumeSession() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem('prode_session') || 'null'); } catch (_) { saved = null; }
  if (!saved || !saved.token) return;
  let rows;
  try { rows = await rpc('prode_resume', { p_token: saved.token }); } catch (_) { rows = null; }
  const s = rows && rows[0];
  if (!s) { clearSession(); return; }
  TOKEN = saved.token;
  if (s.kind === 'admin') { IA = true; await loadCache(); renderAdm(); go('adm'); }
  else { CU = s.name; IA = false; await loadCache(); renderUsr(); go('usr'); }
  startIdle();
}
resumeSession();

// ── CACHE ────────────────────────────────────────────────────────────────────

async function loadCache() {
  const [res, players, bres, bslots, bcfg] = await Promise.all([
    dbGet('results', 'select=match_id,home_goals,away_goals'),
    dbGet('players_public', 'select=name,photo_url,prev_rank,prev_grupos,prev_elim'),
    dbGet('bracket_results', 'select=match_id,home_team,away_team,home_goals,away_goals,home_pens,away_pens,winner,kickoff'),
    dbGet('bracket_slots', 'select=slot,team'),
    dbGet('bracket_config', 'id=eq.1')
  ]);
  cache.results = {};
  res.forEach(r => cache.results[r.match_id] = r);
  cache.players = players.map(p => p.name);
  cache.playerInfo = {};
  players.forEach(p => cache.playerInfo[p.name] = { photo: p.photo_url, prevGlobal: p.prev_rank, prevGrupos: p.prev_grupos, prevElim: p.prev_elim });
  cache.config = {}; // las contraseñas viven cerradas en el servidor; no se cachean
  cache.bracketResults = {};
  bres.forEach(b => cache.bracketResults[b.match_id] = b);
  cache.bracketSlots = {};
  bslots.forEach(s => cache.bracketSlots[s.slot] = s.team);
  cache.bracketConfirmed = bcfg[0]?.groups_confirmed || false;

  if (CU) {
    const [prons, bprons] = await Promise.all([
      dbGet('predictions', `player_name=eq.${encodeURIComponent(CU)}`),
      dbGet('bracket_predictions', `player_name=eq.${encodeURIComponent(CU)}`)
    ]);
    cache.prons = {};
    prons.forEach(p => cache.prons[p.match_id] = { h: p.home_goals, a: p.away_goals });
    cache.bracketProns = {};
    bprons.forEach(p => cache.bracketProns[p.match_id] = { h: p.home_goals, a: p.away_goals });
  }
}

async function loadAllProns() {
  const all = await dbGet('predictions', 'select=player_name,match_id,home_goals,away_goals');
  const byPlayer = {};
  all.forEach(p => {
    if (!byPlayer[p.player_name]) byPlayer[p.player_name] = {};
    byPlayer[p.player_name][p.match_id] = { h: p.home_goals, a: p.away_goals };
  });
  const allBP = await dbGet('bracket_predictions', 'select=player_name,match_id,home_goals,away_goals');
  const bpByPlayer = {};
  allBP.forEach(p => {
    if (!bpByPlayer[p.player_name]) bpByPlayer[p.player_name] = {};
    bpByPlayer[p.player_name][p.match_id] = { h: p.home_goals, a: p.away_goals };
  });
  return { byPlayer, bpByPlayer };
}

// ── LÓGICA DE CLASIFICACIÓN DEL BRACKET ────────────────────────────────────────

// Calcula la tabla ordenada de un grupo a partir de los resultados cargados
function computeGroupTable(g) {
  const teams = GRUPOS[g];
  const st = {};
  teams.forEach(t => st[t] = { team:t, pj:0, g:0, e:0, p:0, gf:0, gc:0 });
  MATCHES.filter(m => m.g === g).forEach(m => {
    const r = cache.results[m.id];
    if (!r) return;
    const h = st[m.h], a = st[m.a];
    h.pj++; a.pj++; h.gf += r.home_goals; h.gc += r.away_goals;
    a.gf += r.away_goals; a.gc += r.home_goals;
    if (r.home_goals > r.away_goals) { h.g++; a.p++; }
    else if (r.home_goals < r.away_goals) { a.g++; h.p++; }
    else { h.e++; a.e++; }
  });
  return Object.values(st).map(s => ({ ...s, dg: s.gf - s.gc, pts: s.g*3 + s.e, grp: g }))
    .sort((a,b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
}

// ¿Están todos los partidos de grupos cargados?
function allGroupsComplete() {
  return MATCHES.every(m => cache.results[m.id]);
}

// Devuelve los 8 mejores terceros (ordenados) y de qué grupos son
function bestThirds() {
  const thirds = Object.keys(GRUPOS).map(g => {
    const t = computeGroupTable(g)[2];
    return { ...t, grp: g };
  });
  thirds.sort((a,b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
  return thirds.slice(0, 8);
}

// Asigna automáticamente los 8 mejores terceros a sus slots.
// Estrategia: backtracking — cada slot acepta terceros de ciertos grupos.
function assignThirds() {
  const top8 = bestThirds();
  const byGroup = {}; top8.forEach(t => byGroup[t.grp] = t);
  const qualifiedGroups = top8.map(t => t.grp);
  // slots en orden; cada uno acepta uno de sus 5 grupos posibles
  const slots = THIRD_SLOTS.map(s => ({ id:s.id, opts: s.groups.filter(g => qualifiedGroups.includes(g)) }));
  const result = {};
  const usedGroups = new Set();
  // backtracking para encontrar asignación válida (cada grupo a un solo slot)
  function solve(i) {
    if (i === slots.length) return true;
    // ordenar opciones por menos flexibilidad ya está implícito; probamos cada grupo libre
    for (const g of slots[i].opts) {
      if (!usedGroups.has(g)) {
        usedGroups.add(g); result[slots[i].id] = g;
        if (solve(i+1)) return true;
        usedGroups.delete(g); delete result[slots[i].id];
      }
    }
    return false;
  }
  solve(0);
  // devuelve {slotId: team}
  const out = {};
  Object.entries(result).forEach(([slot, g]) => { out[slot] = byGroup[g].team; });
  return out;
}

// Calcula automáticamente todos los slots del bracket (1°, 2° y terceros)
function computeAutoSlots() {
  const slots = {};
  Object.keys(GRUPOS).forEach(g => {
    const tbl = computeGroupTable(g);
    slots['1'+g] = tbl[0].team;
    slots['2'+g] = tbl[1].team;
  });
  Object.assign(slots, assignThirds());
  return slots;
}

// Resuelve qué equipo ocupa un slot dado (ej '1A', '2B', '3-ABCDF', 'W-R32-1')
// Usa primero los slots confirmados/override del admin (cache.bracketSlots),
// y para ganadores (W-) busca el resultado del partido correspondiente.
function resolveSlot(slot) {
  if (!slot) return null;
  if (slot.startsWith('W-')) {
    const mid = slot.slice(2);
    const r = cache.bracketResults[mid];
    return r?.winner || null;
  }
  // slot de grupo o tercero
  if (cache.bracketSlots[slot]) return cache.bracketSlots[slot];
  // si el admin aún no confirmó pero los grupos están completos, calcular en vivo
  if (allGroupsComplete()) {
    const auto = computeAutoSlots();
    return auto[slot] || null;
  }
  return null;
}

// Etiqueta corta de un slot cuando todavía no hay equipo (estilo FIFA: 1A, 2B, 3 ABCDF)
function slotLabel(slot) {
  if (!slot) return '—';
  if (slot.startsWith('W-')) {
    const mid = slot.slice(2);
    const names = {R32:'16°',R16:'8°',QF:'4°',SF:'SF'};
    const parts = mid.split('-');
    return 'Gan. ' + (names[parts[0]]||parts[0]) + parts[2];
  }
  if (slot.startsWith('3-')) return '3° ' + slot.slice(2);
  return slot[0] + slot.slice(1); // 1A, 2B, etc.
}

// ── RENDER USER ──────────────────────────────────────────────────────────────

function renderUsr() {
  document.getElementById('uname').textContent = CU;
  document.getElementById('unav').innerHTML = avatarHtml(CU, 30);
  buildGT('gsu', 'u');
  renderProns('pu', 'u');
  renderTbl('tblcont');
}

function renderAdm() {
  buildGT('gsa', 'a');
  renderProns('pa', 'a');
  renderTbl('atblcont');
}

const JORNADAS = [
  { num: 1, label: 'Jornada 1', dates: '11 – 17 jun' },
  { num: 2, label: 'Jornada 2', dates: '18 – 23 jun' },
  { num: 3, label: 'Jornada 3', dates: '24 – 27 jun' }
];

let selJ = { u: 1, a: 1 };
let selR = { u: 'r32', a: 'r32' };  // ronda elegida dentro de Fase Eliminatoria
let adminResDraft = {};             // borrador en memoria de resultados del admin {matchId:{h,a}}
let adminBkDraft = {};              // borrador de resultados del bracket del admin {matchId:{h,a,ph,pa}}

// Indicador de estado unificado para CUALQUIER partido (grupos o eliminatorias):
// jugado (con puntos) · cerrado (arrancó) · abierto (se puede cargar).
function statusChip(hasR, started, ptsVal) {
  if (hasR) {
    if (ptsVal === 3) return '<span class="badge bex">✓ +3 pts</span>';
    if (ptsVal === 1) return '<span class="badge bwi">+1 pt</span>';
    return '<span class="badge bno">+0 pts</span>';
  }
  if (started) return '<span class="badge bno">🔒 Cerrado</span>';
  return '<span class="badge" style="background:rgba(59,130,246,.12);color:var(--accent);border:1px solid rgba(59,130,246,.3)">Abierto</span>';
}

function buildGT(elId, mode) {
  const el = document.getElementById(elId);
  el.innerHTML = '';
  JORNADAS.forEach(j => {
    const b = document.createElement('button');
    b.className = 'gbt' + (selJ[mode] === j.num ? ' on' : '');
    b.innerHTML = `<strong>${j.label}</strong> <span style="font-size:11px;opacity:.7">${j.dates}</span>`;
    b.onclick = () => { selJ[mode] = j.num; buildGT(elId, mode); renderProns(mode === 'u' ? 'pu' : 'pa', mode); };
    el.appendChild(b);
  });
  const be = document.createElement('button');
  be.className = 'gbt' + (selJ[mode] === 'elim' ? ' on' : '');
  be.innerHTML = `<strong>🏆 Fase Eliminatoria</strong> <span style="font-size:11px;opacity:.7">desde 28 jun</span>`;
  be.onclick = () => { selJ[mode] = 'elim'; buildGT(elId, mode); renderProns(mode === 'u' ? 'pu' : 'pa', mode); };
  el.appendChild(be);
}

function renderProns(elId, mode) {
  const isA = mode === 'a';
  if (selJ[mode] === 'elim') {
    if (isA) { renderBracketAdminRounds(elId); return; } // admin: ronda por ronda
    renderBracketPredRounds(elId);                                  // jugador: ronda por ronda
    return;
  }
  const jNum = selJ[mode];
  const ms = MATCHES.filter(m => m.j === jNum);

  // Agrupar por fecha para mostrar separadores de día
  const byDate = {};
  ms.forEach(m => {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  });

  let html = '';
  Object.entries(byDate).forEach(([date, matches]) => {
    html += `<div style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600;color:var(--text)">${date}</span>
        <span style="flex:1;height:1px;background:var(--border)"></span>
        <span style="font-size:11px;color:var(--text3)">${matches.length} partido${matches.length > 1 ? 's' : ''}</span>
      </div>`;
    matches.forEach(m => {
      const r = cache.results[m.id];
      const d = isA ? adminResDraft[m.id] : null;
      const ph = isA ? (d ? d.h : (r ? r.home_goals : '')) : (cache.prons[m.id]?.h ?? '');
      const pa = isA ? (d ? d.a : (r ? r.away_goals : '')) : (cache.prons[m.id]?.a ?? '');
      const hasR = !!r;
      const started = groupMatchStarted(m); // ¿ya arrancó?
      // El jugador no puede editar si hay resultado o si el partido arrancó
      const lockUser = !isA && (hasR || started);
      const p = hasR && !isA ? pts(m.id, cache.prons[m.id]?.h, cache.prons[m.id]?.a) : null;
      const color = GRP_COLORS[m.g];
      html += `<div class="match-card">
        <div class="match-meta">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:5px;background:${color};font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${m.g}</span>
          <span class="match-time">${m.time} ARG</span>
          <span style="color:var(--text3)">·</span>
          <span class="match-sede">${m.sede}</span>
          ${isA ? '' : `<span style="margin-left:auto">${statusChip(hasR, started, p)}</span>`}
        </div>
        <div class="match-body">
          <div class="team-l"><span class="team-name">${m.h}</span><span class="flag">${fl(m.h)}</span></div>
          <input type="number" min="0" max="99" value="${ph ?? ''}" id="m${mode}${m.id}h" oninput="if(this.value.length>2)this.value=this.value.slice(0,2);${isA ? `draftRes('${m.id}')` : `draftG(${m.id})`}" ${(isA ? false : lockUser) ? 'disabled' : ''}>
          <div class="vs">${hasR ? `<span class="result-score">${r.home_goals}-${r.away_goals}</span>` : 'vs'}</div>
          <input type="number" min="0" max="99" value="${pa ?? ''}" id="m${mode}${m.id}a" oninput="if(this.value.length>2)this.value=this.value.slice(0,2);${isA ? `draftRes('${m.id}')` : `draftG(${m.id})`}" ${(isA ? false : lockUser) ? 'disabled' : ''}>
          <div class="team-r"><span class="flag">${fl(m.a)}</span><span class="team-name">${m.a}</span></div>
        </div>
      </div>`;
    });
    html += '</div>';
  });
  if (!isA) html += `<div style="font-size:12px;color:var(--text2);margin:6px 0 8px">Puntos: 3 exacto · 1 ganador · 0 nada. Podés modificar hasta que arranca el partido.</div>
    <button class="btn btn-primary btn-full" onclick="savePron()" style="margin-top:6px">💾 Guardar pronósticos</button><div class="ok" id="pmsg"></div>`;
  else {
    const total = ms.length;
    const loaded = ms.filter(m => { const d = adminResDraft[m.id]; const r = cache.results[m.id]; return (d && d.h !== '' && d.h != null && d.a !== '' && d.a != null) || r; }).length;
    html += `<div style="font-size:12px;color:var(--text2);margin:6px 0 8px">Cargaste <strong id="resCounter" style="color:var(--text)">${loaded}</strong> de ${total} partidos de esta jornada.</div>
      <button class="btn btn-primary btn-full" onclick="saveRes()" style="margin-top:6px">✓ Guardar resultados</button><div class="ok" id="rmsg"></div>`;
  }
  document.getElementById(elId).innerHTML = html;
}

// ── BRACKET DEL JUGADOR: RONDA POR RONDA (dentro de "Fase Eliminatoria") ────────
function setBracketRound(key) { selR.u = key; renderProns('pu', 'u'); }

function renderBracketPredRounds(elId) {
  let html = `<div class="grp-tabs" style="margin-bottom:1rem">`;
  BRACKET_ROUNDS.forEach(rd => {
    html += `<button class="gbt${selR.u === rd.key ? ' on' : ''}" onclick="setBracketRound('${rd.key}')">${rd.name}</button>`;
  });
  html += `</div>`;

  const ms = BRACKET[selR.u] || [];
  const byDate = {};
  ms.forEach(m => { if (!byDate[m.date]) byDate[m.date] = []; byDate[m.date].push(m); });

  Object.entries(byDate).forEach(([date, matches]) => {
    html += `<div style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600;color:var(--text)">${date}</span>
        <span style="flex:1;height:1px;background:var(--border)"></span>
        <span style="font-size:11px;color:var(--text3)">${matches.length} partido${matches.length > 1 ? 's' : ''}</span>
      </div>`;
    matches.forEach(m => html += bracketCardPred(m));
    html += `</div>`;
  });

  html += `<div style="font-size:12px;color:var(--text2);margin:6px 0 8px">Puntos: 3 exacto · 1 ganador · 0 nada. Podés modificar hasta que arranca el partido.</div>
    <button class="btn btn-primary btn-full" onclick="saveBracketProns()">💾 Guardar mis predicciones</button><div class="ok" id="bpmsg"></div>`;
  document.getElementById(elId).innerHTML = html;
}

// ── BRACKET DEL ADMIN: RONDA POR RONDA (carga de resultados reales) ─────────────
function setBracketRoundAdmin(key) { selR.a = key; renderProns('pa', 'a'); }

function renderBracketAdminRounds(elId) {
  const complete = allGroupsComplete();
  let html = `<div class="card" style="margin-bottom:12px">
    <div style="font-size:13px;font-weight:600;margin-bottom:8px">Clasificación a eliminatorias</div>`;
  if (!complete) {
    html += `<div style="font-size:12px;color:var(--text3)">Aún faltan resultados de grupos. Los cruces muestran las posiciones (1A, 2B…) y se completan solos con los equipos reales.</div>`;
  } else if (!cache.bracketConfirmed) {
    html += `<div style="font-size:12px;color:var(--text2);margin-bottom:10px">Los grupos están completos. Confirmá los clasificados para fijar los cruces (1°, 2° y 8 mejores terceros automáticos según FIFA).</div>
      <button class="btn btn-primary btn-full" onclick="confirmGroups()">✓ Confirmar clasificados y armar cuadro</button>`;
  } else {
    html += `<div style="font-size:12px;color:var(--green);margin-bottom:10px">✓ Clasificados confirmados. Cargá los resultados de cada ronda abajo.</div>
      <button class="btn btn-sm" onclick="reopenGroups()">↺ Recalcular clasificados</button>`;
  }
  html += `</div>`;

  // Selector de rondas
  html += `<div class="grp-tabs" style="margin-bottom:1rem">`;
  BRACKET_ROUNDS.forEach(rd => {
    html += `<button class="gbt${selR.a === rd.key ? ' on' : ''}" onclick="setBracketRoundAdmin('${rd.key}')">${rd.name}</button>`;
  });
  html += `</div>`;

  // Partidos de la ronda elegida, agrupados por fecha
  const ms = BRACKET[selR.a] || [];
  const byDate = {};
  ms.forEach(m => { if (!byDate[m.date]) byDate[m.date] = []; byDate[m.date].push(m); });
  Object.entries(byDate).forEach(([date, matches]) => {
    html += `<div style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600;color:var(--text)">${date}</span>
        <span style="flex:1;height:1px;background:var(--border)"></span>
        <span style="font-size:11px;color:var(--text3)">${matches.length} partido${matches.length > 1 ? 's' : ''}</span>
      </div>`;
    matches.forEach(m => html += bracketCardAdmin(m));
    html += `</div>`;
  });

  html += `<div style="font-size:12px;color:var(--text2);margin:6px 0 8px">Cargá el marcador de los 90'. Si un cruce queda empatado, elegís quién avanza (y opcional, el resultado de los penales). Eso no suma puntos, solo arma el cuadro.</div>
    <button class="btn btn-primary btn-full" onclick="saveBracketResults()">✓ Guardar resultados del cuadro</button><div class="ok" id="bmsg"></div>`;
  document.getElementById(elId).innerHTML = html;
}

// Tarjeta de carga de un cruce (admin): marcador 90' + penales solo si hay empate
function bracketCardAdmin(m) {
  const homeTeam = resolveSlot(m.home), awayTeam = resolveSlot(m.away);
  const homeLbl = homeTeam || slotLabel(m.home);
  const awayLbl = awayTeam || slotLabel(m.away);
  const teamsKnown = !!(homeTeam && awayTeam);
  const d = adminBkDraft[m.id];
  const saved = cache.bracketResults[m.id];
  const h = d ? d.h : (saved && saved.home_goals != null ? saved.home_goals : '');
  const a = d ? d.a : (saved && saved.away_goals != null ? saved.away_goals : '');
  const ph = d ? (d.ph ?? '') : (saved && saved.home_pens != null ? saved.home_pens : '');
  const pa = d ? (d.pa ?? '') : (saved && saved.away_pens != null ? saved.away_pens : '');
  const isDraw = h !== '' && a !== '' && h != null && a != null && parseInt(h) === parseInt(a);
  let adv = d ? (d.adv ?? '') : '';
  if (!adv && saved && saved.winner) adv = saved.winner === homeTeam ? 'home' : (saved.winner === awayTeam ? 'away' : '');
  const flCell = t => t ? fl(t) : '<span style="display:inline-block;width:24px;height:16px;background:#1f2a40;border-radius:2px"></span>';
  const dis = teamsKnown ? '' : 'disabled';
  return `<div class="match-card">
    <div class="match-meta">
      <span class="match-time">${m.time} ARG</span>
      <span style="color:var(--text3)">·</span>
      <span class="match-sede">${m.sede}</span>
      ${teamsKnown ? '' : '<span style="margin-left:auto"><span class="badge bno">Por definir</span></span>'}
    </div>
    <div class="match-body">
      <div class="team-l"><span class="team-name">${homeLbl}</span><span class="flag">${flCell(homeTeam)}</span></div>
      <input type="number" min="0" max="99" value="${h}" id="br${m.id}h" ${dis} oninput="if(this.value.length>2)this.value=this.value.slice(0,2);draftBkRes('${m.id}')">
      <div class="vs">vs</div>
      <input type="number" min="0" max="99" value="${a}" id="br${m.id}a" ${dis} oninput="if(this.value.length>2)this.value=this.value.slice(0,2);draftBkRes('${m.id}')">
      <div class="team-r"><span class="flag">${flCell(awayTeam)}</span><span class="team-name">${awayLbl}</span></div>
    </div>
    <div id="drawblk-${m.id}" style="${isDraw ? '' : 'display:none;'}margin-top:8px;padding-top:8px;border-top:1px dashed var(--border)">
      <div style="font-size:11px;color:var(--text2);text-align:center;margin-bottom:8px">⚽ Empate a los 90' — ¿quién avanza? <span style="color:var(--text3)">(no suma puntos, solo el cuadro)</span></div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px;flex-wrap:wrap">
        <button id="adv-${m.id}-home" class="btn btn-sm${adv === 'home' ? ' btn-primary' : ''}" ${dis} onclick="setBkAdv('${m.id}','home')">${homeLbl}</button>
        <button id="adv-${m.id}-away" class="btn btn-sm${adv === 'away' ? ' btn-primary' : ''}" ${dis} onclick="setBkAdv('${m.id}','away')">${awayLbl}</button>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:8px">
        <span style="font-size:11px;color:var(--text3)">Penales (opcional):</span>
        <input type="number" min="0" max="99" value="${ph}" id="br${m.id}ph" style="width:42px" ${dis} oninput="if(this.value.length>2)this.value=this.value.slice(0,2);draftBkRes('${m.id}')">
        <span style="color:var(--text3)">-</span>
        <input type="number" min="0" max="99" value="${pa}" id="br${m.id}pa" style="width:42px" ${dis} oninput="if(this.value.length>2)this.value=this.value.slice(0,2);draftBkRes('${m.id}')">
      </div>
    </div>
  </div>`;
}

// Borrador de resultados del bracket del admin (preserva el "quién avanza" elegido)
function draftBkRes(id) {
  const h = document.getElementById('br' + id + 'h');
  const a = document.getElementById('br' + id + 'a');
  const ph = document.getElementById('br' + id + 'ph');
  const pa = document.getElementById('br' + id + 'pa');
  const prev = adminBkDraft[id] || {};
  adminBkDraft[id] = { h: h ? h.value : '', a: a ? a.value : '', ph: ph ? ph.value : '', pa: pa ? pa.value : '', adv: prev.adv || '' };
  const blk = document.getElementById('drawblk-' + id);
  if (blk && h && a) {
    const isDraw = h.value !== '' && a.value !== '' && parseInt(h.value) === parseInt(a.value);
    blk.style.display = isDraw ? '' : 'none';
    if (!isDraw) adminBkDraft[id].adv = ''; // si deja de ser empate, lo define el marcador
  }
}

// El admin elige qué equipo avanza en un empate
function setBkAdv(id, side) {
  draftBkRes(id);                  // sincroniza marcador/penales (preserva adv previo)
  adminBkDraft[id].adv = side;     // fija el que avanza
  ['home', 'away'].forEach(s => {
    const b = document.getElementById('adv-' + id + '-' + s);
    if (b) b.className = 'btn btn-sm' + (s === side ? ' btn-primary' : '');
  });
}

// Tarjeta de un partido de eliminatoria en modo predicción (mismo estilo que grupos)
function bracketCardPred(m) {
  const homeTeam = resolveSlot(m.home), awayTeam = resolveSlot(m.away);
  const homeLbl = homeTeam || slotLabel(m.home);
  const awayLbl = awayTeam || slotLabel(m.away);
  const r = bracketScore(m.id);
  const hasR = !!r;
  const started = matchStarted(m.id);
  const teamsKnown = !!(homeTeam && awayTeam);
  const myP = cache.bracketProns[m.id];
  const p = hasR ? scoreBracketPts(m.id, myP?.h, myP?.a) : null;
  const editable = teamsKnown && !started && !hasR;
  const ph = myP?.h ?? '';
  const pa = myP?.a ?? '';
  const chip = (!teamsKnown && !hasR) ? '<span class="badge bno">Por definir</span>' : statusChip(hasR, started, p);
  const flCell = t => t ? fl(t) : '<span style="display:inline-block;width:24px;height:16px;background:#1f2a40;border-radius:2px"></span>';
  const mid = hasR ? `<span class="result-score">${r.home_goals}-${r.away_goals}</span>` : 'vs';
  const inH = `<input type="number" min="0" max="99" value="${ph}" id="bp${m.id}h" ${editable ? '' : 'disabled'} oninput="if(this.value.length>2)this.value=this.value.slice(0,2);draftB('${m.id}')">`;
  const inA = `<input type="number" min="0" max="99" value="${pa}" id="bp${m.id}a" ${editable ? '' : 'disabled'} oninput="if(this.value.length>2)this.value=this.value.slice(0,2);draftB('${m.id}')">`;
  return `<div class="match-card">
    <div class="match-meta">
      <span class="match-time">${m.time} ARG</span>
      <span style="color:var(--text3)">·</span>
      <span class="match-sede">${m.sede}</span>
      <span style="margin-left:auto">${chip}</span>
    </div>
    <div class="match-body">
      <div class="team-l"><span class="team-name">${homeLbl}</span><span class="flag">${flCell(homeTeam)}</span></div>
      ${inH}
      <div class="vs">${mid}</div>
      ${inA}
      <div class="team-r"><span class="flag">${flCell(awayTeam)}</span><span class="team-name">${awayLbl}</span></div>
    </div>
    ${(hasR && myP) ? `<div style="font-size:11px;color:var(--text3);text-align:center;margin-top:6px">Tu pronóstico: ${myP.h}-${myP.a}</div>` : ''}
  </div>`;
}

// Guarda en memoria lo que el jugador va tipeando (para no perderlo al cambiar de jornada)
function draftG(id) {
  const h = document.getElementById('mu' + id + 'h');
  const a = document.getElementById('mu' + id + 'a');
  if (h && a) cache.prons[id] = { h: h.value, a: a.value };
}

// Borrador de resultados del admin: persiste lo tipeado al cambiar de jornada
function draftRes(id) {
  const h = document.getElementById('ma' + id + 'h');
  const a = document.getElementById('ma' + id + 'a');
  if (h && a) adminResDraft[id] = { h: h.value, a: a.value };
  updateResCounter();
}
function updateResCounter() {
  const el = document.getElementById('resCounter');
  if (!el || selJ.a === 'elim') return;
  const ms = MATCHES.filter(m => m.j === selJ.a);
  el.textContent = ms.filter(m => {
    const d = adminResDraft[m.id], r = cache.results[m.id];
    return (d && d.h !== '' && d.h != null && d.a !== '' && d.a != null) || r;
  }).length;
}

async function savePron() {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  // Guardamos TODO lo cargado (todas las jornadas), leyendo del borrador en memoria
  const toSave = [];
  MATCHES.forEach(m => {
    if (groupMatchStarted(m)) return; // no guardar partidos que ya arrancaron
    const d = cache.prons[m.id];
    if (d && d.h !== '' && d.h != null && d.a !== '' && d.a != null) {
      toSave.push({ match_id: m.id, home_goals: parseInt(d.h), away_goals: parseInt(d.a) });
    }
  });
  if (toSave.length) {
    try { await rpc('prode_save_predictions', { p_token: TOKEN, p_rows: toSave }); }
    catch (err) {
      btn.disabled = false; btn.innerHTML = '💾 Guardar pronósticos';
      document.getElementById('pmsg').style.color = 'var(--red)';
      document.getElementById('pmsg').textContent = 'No se pudieron guardar: ' + err.message;
      return;
    }
  }
  btn.disabled = false;
  btn.innerHTML = '💾 Guardar pronósticos';
  const msg = document.getElementById('pmsg');
  msg.style.color = 'var(--green)';
  msg.textContent = '✓ Pronósticos guardados';
  setTimeout(() => msg.textContent = '', 3000);
}

// ── IMPORTAR RESULTADOS (precarga; el admin revisa y guarda) ───────────────────
function openImport() {
  document.getElementById('impOverlay').style.display = 'flex';
  document.getElementById('impText').value = '';
  document.getElementById('impMsg').innerHTML = '';
}
function closeImport() { document.getElementById('impOverlay').style.display = 'none'; }

function applyImport() {
  const msg = document.getElementById('impMsg');
  let raw = document.getElementById('impText').value.trim();
  raw = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim(); // tolera bloques con ```
  let data;
  try { data = JSON.parse(raw); }
  catch (e) {
    msg.innerHTML = `<span style="color:var(--red)">No pude leer el texto. Pegá el bloque completo en formato JSON (el que te paso por chat).</span>`;
    return;
  }
  const scoreRe = /^\s*(\d+)\s*-\s*(\d+)\s*(?:\(\s*(\d+)\s*-\s*(\d+)\s*p?\s*\))?\s*$/i;
  let okG = 0, okB = 0; const bad = [];

  const grupos = data.grupos || data.groups || {};
  Object.entries(grupos).forEach(([k, v]) => {
    const id = parseInt(k);
    const m = MATCHES.find(x => x.id === id);
    const mm = String(v).match(scoreRe);
    if (!m || !mm) { bad.push(`grupos[${k}]`); return; }
    adminResDraft[id] = { h: mm[1], a: mm[2] };
    okG++;
  });

  const bracket = data.bracket || data.elim || data.eliminatorias || {};
  Object.entries(bracket).forEach(([k, v]) => {
    const m = ALL_BRACKET_MATCHES.find(x => x.id === k);
    const mm = String(v).match(/^\s*(\d+)\s*-\s*(\d+)\s*(.*)$/);
    if (!m || !mm) { bad.push(`bracket[${k}]`); return; }
    const h = mm[1], a = mm[2], rest = (mm[3] || '').trim();
    let ph = '', pa = '', adv = '';
    if (rest) {
      const pens = rest.match(/\(\s*(\d+)\s*-\s*(\d+)\s*p?\s*\)/i);   // (4-2) penales → avanza el de más
      const aL = rest.match(/\(\s*(?:gana\s+)?(?:l|local)\s*\)/i);   // (L) / (gana L)
      const aV = rest.match(/\(\s*(?:gana\s+)?(?:v|visitante)\s*\)/i);
      if (pens) { ph = pens[1]; pa = pens[2]; adv = parseInt(ph) > parseInt(pa) ? 'home' : 'away'; }
      else if (aL) adv = 'home';
      else if (aV) adv = 'away';
    }
    adminBkDraft[k] = { h, a, ph, pa, adv };
    okB++;
  });

  renderProns('pa', 'a'); // refresca la vista actual con lo precargado

  let s = `<span style="color:var(--green)">✓ Precargado: ${okG} de grupos${okB ? `, ${okB} de eliminatoria` : ''}.</span>`;
  if (bad.length) s += `<br><span style="color:var(--yellow)">No pude ubicar ${bad.length}: ${bad.slice(0, 8).join(', ')}${bad.length > 8 ? '…' : ''}</span>`;
  s += `<br><span style="color:var(--text2);font-size:11px">Cerrá, revisá los partidos en pantalla y tocá <strong>Guardar</strong> para confirmar.</span>`;
  msg.innerHTML = s;
}

async function saveRes() {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  await autoSnapshot(); // foto de posiciones previas (para las flechas ▲▼)
  const toSave = [];
  MATCHES.forEach(m => {
    const d = adminResDraft[m.id];
    if (d && d.h !== '' && d.h != null && d.a !== '' && d.a != null) {
      const hg = parseInt(d.h), ag = parseInt(d.a);
      toSave.push({ match_id: m.id, home_goals: hg, away_goals: ag });
      cache.results[m.id] = { home_goals: hg, away_goals: ag };
    }
  });
  if (toSave.length) {
    try { await rpc('prode_admin_save_results', { p_token: TOKEN, p_rows: toSave }); }
    catch (err) {
      btn.disabled = false; btn.innerHTML = '✓ Guardar resultados';
      const m = document.getElementById('rmsg');
      m.style.color = 'var(--red)'; m.textContent = 'No se pudieron guardar: ' + err.message;
      return;
    }
  }
  btn.disabled = false;
  btn.innerHTML = '✓ Guardar resultados';
  renderTbl('atblcont');
  const msg = document.getElementById('rmsg');
  msg.style.color = 'var(--green)';
  msg.textContent = toSave.length ? `✓ ${toSave.length} resultado${toSave.length > 1 ? 's' : ''} guardado${toSave.length > 1 ? 's' : ''}` : 'No hay resultados nuevos para guardar';
  setTimeout(() => msg.textContent = '', 3000);
}

// ── STANDINGS ────────────────────────────────────────────────────────────────

function renderGrpStandings(contId) {
  contId = contId || 'grpcont';
  let html = '';
  Object.keys(GRUPOS).forEach(g => {
    const teams = GRUPOS[g];
    const color = GRP_COLORS[g];
    const stats = {};
    teams.forEach(t => stats[t] = { pj:0, g:0, e:0, p:0, gf:0, gc:0 });
    MATCHES.filter(m => m.g === g).forEach(m => {
      const r = cache.results[m.id];
      if (!r) return;
      const h = stats[m.h], a = stats[m.a];
      h.pj++; a.pj++; h.gf += r.home_goals; h.gc += r.away_goals;
      a.gf += r.away_goals; a.gc += r.home_goals;
      if (r.home_goals > r.away_goals) { h.g++; a.p++; }
      else if (r.home_goals < r.away_goals) { a.g++; h.p++; }
      else { h.e++; a.e++; }
    });
    const sorted = teams.map(t => ({ t, dg: stats[t].gf - stats[t].gc, pts: stats[t].g * 3 + stats[t].e, ...stats[t] }))
      .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
    html += `<div style="margin-bottom:1.25rem">
      <div class="grp-header" style="background:rgba(${hexToRgb(color)},.1);border-color:rgba(${hexToRgb(color)},.3)">
        <div class="grp-letter" style="background:${color}">${g}</div>
        <div class="grp-title">Grupo ${g}</div>
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-top:none;border-radius:0 0 var(--radius2) var(--radius2)">
      <table class="stbl"><thead><tr>
        <th style="width:18px"></th><th>Selección</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th>
      </tr></thead><tbody>`;
    sorted.forEach((s, i) => {
      const bar = i < 2 ? `style="--grp-color:${color}"` : '';
      html += `<tr class="${i < 2 ? 'qualify-bar' : ''}" ${bar}>
        <td style="font-size:11px;color:var(--text3);padding-left:10px">${i+1}</td>
        <td><div class="team-cell"><span class="flag">${fl(s.t)}</span><span>${s.t}</span></div></td>
        <td>${s.pj}</td><td>${s.g}</td><td>${s.e}</td><td>${s.p}</td>
        <td>${s.gf}</td><td>${s.gc}</td><td>${s.dg >= 0 ? '+' + s.dg : s.dg}</td>
        <td class="pts-bold">${s.pts}</td>
      </tr>`;
    });
    html += '</tbody></table></div></div>';
  });
  document.getElementById(contId).innerHTML = html;
}

// ── TABLA JUGADORES ──────────────────────────────────────────────────────────

// ── TABLA JUGADORES (3 vistas: Global / Grupos / Eliminatorias) ───────────────
let selTblView = 'global';

// Puntaje desglosado por jugador (grupos y bracket por separado)
function computeAllScores(byPlayer, bpByPlayer) {
  const scores = {};
  cache.players.forEach(u => {
    let gTot = 0, gEx = 0, gWi = 0, bTot = 0, bEx = 0, bWi = 0;
    MATCHES.forEach(m => {
      const p = byPlayer[u]?.[m.id]; if (!p) return;
      const pp = pts(m.id, p.h, p.a);
      if (pp === 3) { gTot += 3; gEx++; } else if (pp === 1) { gTot += 1; gWi++; }
    });
    ALL_BRACKET_MATCHES.forEach(m => {
      const p = bpByPlayer[u]?.[m.id]; if (!p) return;
      const pp = scoreBracketPts(m.id, p.h, p.a);
      if (pp === 3) { bTot += 3; bEx++; } else if (pp === 1) { bTot += 1; bWi++; }
    });
    scores[u] = { gTot, gEx, gWi, bTot, bEx, bWi };
  });
  return scores;
}

// Ranking ordenado para una vista
function rankView(scores, view) {
  const rows = Object.entries(scores).map(([name, s]) => {
    let tot, ex, wi;
    if (view === 'grupos') { tot = s.gTot; ex = s.gEx; wi = s.gWi; }
    else if (view === 'elim') { tot = s.bTot; ex = s.bEx; wi = s.bWi; }
    else { tot = s.gTot + s.bTot; ex = s.gEx + s.bEx; wi = s.gWi + s.bWi; }
    return { name, tot, ex, wi };
  });
  rows.sort((a, b) => b.tot - a.tot || b.ex - a.ex || b.wi - a.wi);
  return rows;
}

function prevRankFor(name, view) {
  const info = cache.playerInfo[name]; if (!info) return null;
  return view === 'grupos' ? info.prevGrupos : view === 'elim' ? info.prevElim : info.prevGlobal;
}

async function renderTbl(id) {
  document.getElementById(id).innerHTML = '<div class="loading"><div class="spinner"></div>Cargando...</div>';
  const { byPlayer, bpByPlayer } = await loadAllProns();
  cache._scores = computeAllScores(byPlayer, bpByPlayer);
  paintTbl(id);
}

function setTblView(view, id) { selTblView = view; paintTbl(id); }

function paintTbl(id) {
  const scores = cache._scores || {};
  const view = selTblView;
  const ranked = rankView(scores, view);

  // Sub-selector de vistas
  let html = `<div class="grp-tabs" style="margin-bottom:1rem">`;
  [['global', 'Global'], ['grupos', 'Fase de Grupos'], ['elim', 'Eliminatorias']].forEach(([k, label]) => {
    html += `<button class="gbt${view === k ? ' on' : ''}" onclick="setTblView('${k}','${id}')">${label}</button>`;
  });
  html += `</div>`;

  // Botón para volver a ver el reveal del ganador (si la fase ya terminó)
  if (phaseComplete(view) && ranked.length) {
    html += `<button class="btn btn-sm btn-full" style="margin-bottom:10px" onclick='showWinnerReveal("${view}", ${JSON.stringify(ranked[0]).replace(/'/g, "&#39;")})'>🏆 Ver ganador</button>`;
  }

  // ----- PODIO TOP 3 -----
  if (ranked.length >= 1) {
    const podioOrder = [1, 0, 2];
    html += `<div class="podio">`;
    podioOrder.forEach(pos => {
      if (!ranked[pos]) { html += `<div class="podio-spot"></div>`; return; }
      const s = ranked[pos];
      const medal = pos === 0 ? '🥇' : pos === 1 ? '🥈' : '🥉';
      const stepCls = pos === 0 ? 'step-1' : pos === 1 ? 'step-2' : 'step-3';
      const ringCls = pos === 0 ? 'ring-gold' : pos === 1 ? 'ring-silver' : 'ring-bronze';
      const mine = s.name === CU;
      const glow = ['#f5c542', '#c4ccd8', '#cd7f32'][pos] || '#f5c542';
      html += `<div class="podio-spot">
        <div class="podio-medal">${medal}</div>
        ${avatarHtml(s.name, pos === 0 ? 64 : 54, 'podio-av ' + ringCls)}
        <div class="podio-name">${s.name}</div>
        <div class="podio-pts">${s.tot} pts</div>
        <div class="podio-step ${stepCls}${mine ? ' lit' : ''}" style="${mine ? `--glow:${glow}` : ''}">${pos + 1}</div>
      </div>`;
    });
    html += `</div>`;
  }

  // ----- TABLA COMPLETA -----
  html += `<div class="card" style="padding:0;overflow:hidden;margin-top:1rem">
  <table class="ptbl"><thead><tr>
    <th style="width:40px">#</th><th>Jugador</th>
    <th style="text-align:center">Pts</th>
    <th style="text-align:center">Exac.</th>
    <th style="text-align:center">Gan.</th>
  </tr></thead><tbody>`;
  ranked.forEach((s, i) => {
    const rank = i + 1;
    const pc = i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : '';
    const prev = prevRankFor(s.name, view);
    let mov = '<span class="mov-same">—</span>';
    if (prev && prev !== rank) {
      if (prev > rank) mov = `<span class="mov-up">▲${prev - rank}</span>`;
      else mov = `<span class="mov-down">▼${rank - prev}</span>`;
    }
    const mine = s.name === CU;
    const tag = mine ? ' <span style="font-size:9px;font-weight:700;color:var(--accent);background:rgba(59,130,246,.15);padding:1px 5px;border-radius:6px">VOS</span>' : '';
    html += `<tr style="${mine ? 'background:rgba(59,130,246,.10)' : ''}">
      <td style="padding-left:12px"><div style="display:flex;align-items:center;gap:4px"><span class="pn ${pc}">${rank}</span>${mov}</div></td>
      <td><div style="display:flex;align-items:center;gap:8px">${avatarHtml(s.name, 30)}<span>${s.name}</span>${tag}</div></td>
      <td style="text-align:center;font-weight:700;font-size:14px">${s.tot}</td>
      <td style="text-align:center;color:var(--green)">${s.ex}</td>
      <td style="text-align:center;color:var(--yellow)">${s.wi}</td>
    </tr>`;
  });
  html += '</tbody></table></div>';

  document.getElementById(id).innerHTML = html;

  // Al entrar a una pestaña cuya fase ya terminó, mostrar el reveal (una vez por persona)
  maybeShowWinner(view, ranked);
}

// ── GANADOR DE FASE: detección + reveal épico ─────────────────────────────────
function phaseComplete(view) {
  if (view === 'grupos') return allGroupsComplete();
  const f = cache.bracketResults['FINAL'];
  return !!(f && f.winner); // elim y global cierran con la final jugada
}

function maybeShowWinner(view, ranked) {
  if (!ranked.length || !phaseComplete(view)) return;
  const key = 'prode_seen_winner_' + view;
  let seen = false;
  try { seen = localStorage.getItem(key) === '1'; } catch (_) {}
  if (seen) return;
  try { localStorage.setItem(key, '1'); } catch (_) {}
  showWinnerReveal(view, ranked[0]);
}

function showWinnerReveal(view, w) {
  const cfg = {
    grupos: { kicker: 'GANADOR', title: 'FASE DE GRUPOS', icon: '🏆' },
    elim:   { kicker: 'GANADOR', title: 'ELIMINATORIAS', icon: '🏆' },
    global: { kicker: 'CAMPEÓN', title: 'PRODE MUNDIALISTA · EDICIÓN LBDB', icon: '👑' }
  }[view] || {};
  const ov = document.createElement('div');
  ov.className = 'winner-overlay';
  ov.onclick = e => { if (e.target === ov) ov.remove(); };
  ov.innerHTML = `<div class="winner-card">
    <div class="winner-icon">${cfg.icon}</div>
    ${avatarHtml(w.name, 120, 'winner-photo')}
    <div class="winner-kicker">${cfg.kicker}</div>
    <div class="winner-title">${cfg.title}</div>
    <div class="winner-name">${w.name}</div>
    <div class="winner-pts">${w.tot} pts · ${w.ex} exactos</div>
    <button class="login-btn" style="margin-top:1.25rem" onclick="this.closest('.winner-overlay').remove()">Cerrar</button>
  </div>`;
  document.body.appendChild(ov);
}

// "Foto" automática de posiciones (las 3 tablas) antes de cargar resultados nuevos,
// para que las flechas ▲▼ reflejen el movimiento de esa carga. No bloquea si falla.
async function autoSnapshot() {
  try {
    const { byPlayer, bpByPlayer } = await loadAllProns();
    const scores = computeAllScores(byPlayer, bpByPlayer);
    const rankOf = arr => { const m = {}; arr.forEach((r, i) => m[r.name] = i + 1); return m; };
    const rg = rankOf(rankView(scores, 'global'));
    const rgr = rankOf(rankView(scores, 'grupos'));
    const rel = rankOf(rankView(scores, 'elim'));
    const rows = cache.players.map(name => ({ name, prev_global: rg[name], prev_grupos: rgr[name], prev_elim: rel[name] }));
    await rpc('prode_admin_snapshot_ranks', { p_token: TOKEN, p_rows: rows });
    rows.forEach(r => { const info = cache.playerInfo[r.name]; if (info) { info.prevGlobal = r.prev_global; info.prevGrupos = r.prev_grupos; info.prevElim = r.prev_elim; } });
  } catch (_) { /* el snapshot es secundario: si falla, el guardado sigue igual */ }
}

// ── MIS RESULTADOS ───────────────────────────────────────────────────────────

let selPart = 1;          // sección: 1/2/3 (jornadas) o 'elim'
let selPartR = 'r32';     // ronda dentro de eliminatorias

function setPartSec(j) { selPart = j; renderMyRes(); }
function setPartRound(key) { selPartR = key; renderMyRes(); }

function renderMyRes() {
  // Selector de secciones (jornadas + eliminatoria)
  let html = `<div class="grp-tabs" style="margin-bottom:1rem">`;
  JORNADAS.forEach(j => {
    html += `<button class="gbt${selPart === j.num ? ' on' : ''}" onclick="setPartSec(${j.num})">${j.label}</button>`;
  });
  html += `<button class="gbt${selPart === 'elim' ? ' on' : ''}" onclick="setPartSec('elim')">🏆 Fase Eliminatoria</button></div>`;

  if (selPart === 'elim') {
    html += `<div class="grp-tabs" style="margin-bottom:1rem">`;
    BRACKET_ROUNDS.forEach(rd => html += `<button class="gbt${selPartR === rd.key ? ' on' : ''}" onclick="setPartRound('${rd.key}')">${rd.name}</button>`);
    html += `</div>`;
    html += partByDate(BRACKET[selPartR] || [], partCardBracket);
  } else {
    html += partByDate(MATCHES.filter(m => m.j === selPart), partCardGroup);
  }
  document.getElementById('rescont').innerHTML = html;
}

function partByDate(ms, cardFn) {
  const byDate = {};
  ms.forEach(m => { if (!byDate[m.date]) byDate[m.date] = []; byDate[m.date].push(m); });
  let html = '';
  Object.entries(byDate).forEach(([date, matches]) => {
    html += `<div style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600;color:var(--text)">${date}</span>
        <span style="flex:1;height:1px;background:var(--border)"></span>
        <span style="font-size:11px;color:var(--text3)">${matches.length} partido${matches.length > 1 ? 's' : ''}</span>
      </div>`;
    matches.forEach(m => html += cardFn(m));
    html += `</div>`;
  });
  return html;
}

// Tarjeta read-only de un partido de grupos: resultado real + tu pronóstico + puntos
function partCardGroup(m) {
  const r = cache.results[m.id];
  const hasR = !!r;
  const started = groupMatchStarted(m);
  const myP = cache.prons[m.id];
  const p = hasR ? pts(m.id, myP?.h, myP?.a) : null;
  const chip = statusChip(hasR, started, p);
  const color = GRP_COLORS[m.g];
  const myLine = myP ? `Tu pronóstico: ${myP.h}-${myP.a}` : 'Sin pronóstico';
  return `<div class="match-card">
    <div class="match-meta">
      <span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:5px;background:${color};font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${m.g}</span>
      <span class="match-time">${m.time} ARG</span>
      <span style="color:var(--text3)">·</span>
      <span class="match-sede">${m.sede}</span>
      <span style="margin-left:auto">${chip}</span>
    </div>
    <div class="match-body">
      <div class="team-l"><span class="team-name">${m.h}</span><span class="flag">${fl(m.h)}</span></div>
      <div style="grid-column:2/5;text-align:center;font-weight:700">${hasR ? `<span class="result-score">${r.home_goals}-${r.away_goals}</span>` : '<span style="color:var(--text3)">-</span>'}</div>
      <div class="team-r"><span class="flag">${fl(m.a)}</span><span class="team-name">${m.a}</span></div>
    </div>
    <div style="font-size:11px;color:var(--text3);text-align:center;margin-top:6px">${myLine}</div>
  </div>`;
}

// Tarjeta read-only de un partido de eliminatoria
function partCardBracket(m) {
  const homeTeam = resolveSlot(m.home), awayTeam = resolveSlot(m.away);
  const homeLbl = homeTeam || slotLabel(m.home);
  const awayLbl = awayTeam || slotLabel(m.away);
  const r = bracketScore(m.id);
  const hasR = !!r;
  const started = matchStarted(m.id);
  const teamsKnown = !!(homeTeam && awayTeam);
  const myP = cache.bracketProns[m.id];
  const p = hasR ? scoreBracketPts(m.id, myP?.h, myP?.a) : null;
  const chip = (!teamsKnown && !hasR) ? '<span class="badge bno">Por definir</span>' : statusChip(hasR, started, p);
  const flCell = t => t ? fl(t) : '<span style="display:inline-block;width:24px;height:16px;background:#1f2a40;border-radius:2px"></span>';
  const scoreTxt = hasR ? `${r.home_goals}-${r.away_goals}${(r.home_pens != null) ? ` <span style="font-size:10px;color:var(--text3)">(${r.home_pens}-${r.away_pens} p)</span>` : ''}` : '<span style="color:var(--text3)">-</span>';
  const myLine = myP ? `Tu pronóstico: ${myP.h}-${myP.a}` : (teamsKnown ? 'Sin pronóstico' : '');
  return `<div class="match-card">
    <div class="match-meta">
      <span class="match-time">${m.time} ARG</span>
      <span style="color:var(--text3)">·</span>
      <span class="match-sede">${m.sede}</span>
      <span style="margin-left:auto">${chip}</span>
    </div>
    <div class="match-body">
      <div class="team-l"><span class="team-name">${homeLbl}</span><span class="flag">${flCell(homeTeam)}</span></div>
      <div style="grid-column:2/5;text-align:center;font-weight:700"><span class="result-score">${scoreTxt}</span></div>
      <div class="team-r"><span class="flag">${flCell(awayTeam)}</span><span class="team-name">${awayLbl}</span></div>
    </div>
    ${myLine ? `<div style="font-size:11px;color:var(--text3);text-align:center;margin-top:6px">${myLine}</div>` : ''}
  </div>`;
}

// ── BRACKET (FASE ELIMINATORIA) ────────────────────────────────────────────────

// Helper: ¿el partido del bracket ya arrancó? (bloquea predicciones)
function matchStarted(mid) {
  // Buscar el partido en la estructura del bracket para usar su fecha/hora
  const m = ALL_BRACKET_MATCHES.find(x => x.id === mid);
  if (m) {
    const ko = matchKickoff(m);
    if (ko) return new Date() >= ko;
  }
  // fallback: si hay kickoff guardado en el resultado
  const r = cache.bracketResults[mid];
  if (r?.kickoff) return new Date(r.kickoff) <= new Date();
  return false;
}

// Marcador final de un partido del bracket (para mostrar)
function bracketScore(mid) {
  const r = cache.bracketResults[mid];
  if (!r || r.home_goals === null || r.home_goals === undefined) return null;
  return r;
}

// Render del bracket para el jugador (te=elimu) o admin (ae2=elima)
// renderElim ahora se usa SOLO para la pestaña "Eliminatorias" = modo REAL (solo lectura)
// Cuadro horizontal de un solo lado: 16avos → ... → Final → 🏆 Campeón
// ── OVERRIDE DE CRUCES (admin): corregir clasificados del cuadro a mano ─────────
function bracketOverridePanel() {
  if (!allGroupsComplete())
    return `<div class="card" style="margin-bottom:12px"><div style="font-size:12px;color:var(--text3)">⚙️ El ajuste manual de cruces estará disponible cuando terminen los grupos.</div></div>`;
  if (!cache.bracketConfirmed)
    return `<div class="card" style="margin-bottom:12px"><div style="font-size:12px;color:var(--text2)">⚙️ Para ajustar cruces a mano, primero confirmá los clasificados en la pestaña <strong>Resultados</strong>.</div></div>`;
  let rows = '';
  BRACKET.r32.forEach(m => {
    rows += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
      <span style="color:var(--text3);width:52px;flex-shrink:0;font-size:11px">${m.id}</span>
      ${slotSelect(m.home)}<span style="color:var(--text3);font-size:11px">vs</span>${slotSelect(m.away)}
    </div>`;
  });
  return `<details class="card" style="margin-bottom:12px">
    <summary style="cursor:pointer;font-weight:600;font-size:13px">⚙️ Ajustar clasificados del cuadro (16avos)</summary>
    <div style="font-size:11px;color:var(--text3);margin:8px 0 12px">Tocá solo si la asignación automática de algún equipo (sobre todo los <strong>terceros</strong>) no coincide con la oficial de FIFA. Cambiá lo necesario y guardá.</div>
    ${rows}
    <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="saveSlotOverrides()">Guardar ajustes</button>
      <button class="btn btn-sm" onclick="restoreAutoSlots()">↺ Restaurar automático</button>
    </div>
    <div class="ok" id="ovmsg"></div>
  </details>`;
}

function slotCandidates(slot) {
  if (slot.startsWith('3-'))
    return slot.slice(2).split('').map(L => computeGroupTable(L)[2]?.team).filter(Boolean);
  const letter = slot.slice(1); // '1A' → 'A'
  return (GRUPOS[letter] || []).slice();
}

function slotSelect(slot) {
  const current = resolveSlot(slot) || '';
  const cands = slotCandidates(slot);
  if (current && !cands.includes(current)) cands.unshift(current);
  let opts = `<option value="">(${slotLabel(slot)})</option>`;
  cands.forEach(t => opts += `<option value="${t}" ${t === current ? 'selected' : ''}>${t}</option>`);
  return `<select id="ov-${slot}" style="flex:1;min-width:0;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:12px;padding:5px">${opts}</select>`;
}

async function saveSlotOverrides() {
  const msg = document.getElementById('ovmsg');
  const slots = { ...cache.bracketSlots };
  const teams = [];
  BRACKET.r32.forEach(m => [m.home, m.away].forEach(slot => {
    const sel = document.getElementById('ov-' + slot);
    if (sel && sel.value) { slots[slot] = sel.value; teams.push(sel.value); }
  }));
  const dup = teams.find((t, i) => teams.indexOf(t) !== i);
  if (dup) { if (msg) { msg.style.color = 'var(--red)'; msg.textContent = `"${dup}" está repetido en dos cruces. Revisá antes de guardar.`; } return; }
  const rows = Object.entries(slots).map(([slot, team]) => ({ slot, team }));
  try { await rpc('prode_admin_save_bracket_slots', { p_token: TOKEN, p_rows: rows, p_confirmed: null }); }
  catch (err) { if (msg) { msg.style.color = 'var(--red)'; msg.textContent = 'No se pudo guardar: ' + err.message; } return; }
  cache.bracketSlots = slots;
  renderPosiciones('a');
}

async function restoreAutoSlots() {
  const msg = document.getElementById('ovmsg');
  const auto = computeAutoSlots();
  const rows = Object.entries(auto).map(([slot, team]) => ({ slot, team }));
  try { await rpc('prode_admin_save_bracket_slots', { p_token: TOKEN, p_rows: rows, p_confirmed: null }); }
  catch (err) { if (msg) { msg.style.color = 'var(--red)'; msg.textContent = 'No se pudo: ' + err.message; } return; }
  cache.bracketSlots = auto;
  renderPosiciones('a');
}

function renderElim(id, isA) {
  const complete = allGroupsComplete();
  let html = isA ? bracketOverridePanel() : '';
  html += `<div class="bk-head"><div class="bk-title">🏆 CUADRO DEL MUNDIAL</div>
    <div class="bk-sub">Resultados reales · deslizá horizontal y vertical para recorrer el cuadro →</div></div>`;
  if (!complete) {
    html += `<div style="text-align:center;font-size:12px;color:var(--text3);margin:-6px 0 12px">Se va completando con los equipos reales a medida que terminan los grupos.</div>`;
  }
  html += `<div class="hbk-scroll"><div class="hbk">`;
  BRACKET_ROUNDS.forEach(rd => {
    html += `<div class="hbk-col"><div class="hbk-h">${rd.name}</div><div class="hbk-ms">`;
    (BRACKET[rd.key] || []).forEach(m => html += hbkMatch(m));
    html += `</div></div>`;
  });
  const champ = resolveSlot('W-FINAL');
  html += `<div class="hbk-champ"><div class="hbk-h">Campeón</div>
    <div class="hbk-cup">🏆</div>
    <div class="hbk-cc">${champ
      ? `<span class="flag">${fl(champ)}</span><div class="cn">${champ}</div><div class="cl">Campeón</div>`
      : `<div class="cn" style="color:var(--text3);font-size:13px">Por definir</div>`}</div></div>`;
  html += `</div></div>`;
  document.getElementById(id).innerHTML = html;
}

// Una tarjeta compacta del cuadro horizontal
function hbkMatch(m) {
  const homeTeam = resolveSlot(m.home), awayTeam = resolveSlot(m.away);
  const homeLbl = homeTeam || slotLabel(m.home);
  const awayLbl = awayTeam || slotLabel(m.away);
  const r = bracketScore(m.id);
  const hasR = !!r;
  const started = matchStarted(m.id);
  const hw = hasR && r.winner && r.winner === homeTeam;
  const aw = hasR && r.winner && r.winner === awayTeam;
  const cls = hasR ? 'done' : (started ? 'live' : '');
  const tag = hasR ? '<span class="hbk-tag d">Final</span>' : (started ? '<span class="hbk-tag l">En juego</span>' : '');
  const pen = hasR && r.home_pens != null ? ` <span style="font-size:9px;color:var(--text3)">(${r.home_pens}-${r.away_pens}p)</span>` : '';
  const hs = hasR ? r.home_goals : '-';
  const as = hasR ? r.away_goals : '-';
  const row = (lbl, team, score, win, lose, extra) => {
    const c = !team ? 'hbk-pend' : (win ? 'hbk-win' : (lose ? 'hbk-lose' : ''));
    const flg = team ? `<span class="flag">${fl(team)}</span>` : `<span style="display:inline-block;width:20px;height:14px;background:#1f2a40;border-radius:2px"></span>`;
    return `<div class="hbk-r ${c}">${flg}<span class="hbk-nm">${lbl}</span><span class="hbk-sc">${score}</span></div>`;
  };
  return `<div class="hbk-m ${cls}">${tag}
    ${row(homeLbl, homeTeam, hs, hw, aw)}
    ${row(awayLbl, awayTeam, as, aw, hw)}
    ${pen ? `<div style="text-align:center;margin-top:2px">${pen}</div>` : ''}
  </div>`;
}

// Puntos de una predicción de bracket (mismo criterio clásico)
function scoreBracketPts(mid, ph, pa) {
  const r = cache.bracketResults[mid];
  if (!r || r.home_goals === null || r.home_goals === undefined) return null;
  if (ph === '' || ph === null || ph === undefined) return 0;
  const p = parseInt(ph), q = parseInt(pa);
  if (p === r.home_goals && q === r.away_goals) return 3;
  if (win(p,q) === win(r.home_goals, r.away_goals)) return 1;
  return 0;
}

// Admin confirma los clasificados → fija los slots en la BD
async function confirmGroups() {
  if (!allGroupsComplete()) return;
  const auto = computeAutoSlots();
  const rows = Object.entries(auto).map(([slot, team]) => ({ slot, team }));
  try { await rpc('prode_admin_save_bracket_slots', { p_token: TOKEN, p_rows: rows, p_confirmed: true }); }
  catch (err) { alert('No se pudo confirmar: ' + err.message); return; }
  cache.bracketSlots = auto;
  cache.bracketConfirmed = true;
  renderProns('pa', 'a');
}

async function reopenGroups() {
  if (!confirm('Recalcular los cruces a partir de los resultados actuales.\n\nOjo: esto pisa cualquier ajuste manual que hayas hecho en los cruces. ¿Seguir?')) return;
  const auto = computeAutoSlots();
  const rows = Object.entries(auto).map(([slot, team]) => ({ slot, team }));
  try { await rpc('prode_admin_save_bracket_slots', { p_token: TOKEN, p_rows: rows, p_confirmed: null }); }
  catch (err) { alert('No se pudo guardar: ' + err.message); return; }
  cache.bracketSlots = auto;
  renderProns('pa', 'a');
}

// Admin guarda resultados del bracket (calcula ganador y avanza)
async function saveBracketResults() {
  const btn = event.target; btn.disabled = true; btn.textContent = 'Guardando...';
  await autoSnapshot(); // foto de posiciones previas (para las flechas ▲▼)
  const toSave = [];
  ALL_BRACKET_MATCHES.forEach(m => {
    const d = adminBkDraft[m.id];
    if (!d || d.h === '' || d.h == null || d.a === '' || d.a == null) return;
    const hg = parseInt(d.h), ag = parseInt(d.a);
    const homeTeam = resolveSlot(m.home), awayTeam = resolveSlot(m.away);
    let winner, hp = null, ap = null;
    if (hg > ag) winner = homeTeam;
    else if (ag > hg) winner = awayTeam;
    else {
      // empate → avanza el que eligió el admin; penales son opcionales (solo registro)
      winner = d.adv === 'home' ? homeTeam : (d.adv === 'away' ? awayTeam : null);
      hp = d.ph !== '' && d.ph != null ? parseInt(d.ph) : null;
      ap = d.pa !== '' && d.pa != null ? parseInt(d.pa) : null;
    }
    toSave.push({ match_id: m.id, home_team: homeTeam, away_team: awayTeam,
      home_goals: hg, away_goals: ag, home_pens: hp, away_pens: ap, winner });
    cache.bracketResults[m.id] = { match_id: m.id, home_team: homeTeam, away_team: awayTeam,
      home_goals: hg, away_goals: ag, home_pens: hp, away_pens: ap, winner };
  });
  if (toSave.length) {
    try { await rpc('prode_admin_save_bracket_results', { p_token: TOKEN, p_rows: toSave }); }
    catch (err) {
      btn.disabled = false; btn.innerHTML = '✓ Guardar resultados del cuadro';
      const m = document.getElementById('bmsg');
      if (m) { m.style.color = 'var(--red)'; m.textContent = 'No se pudieron guardar: ' + err.message; }
      return;
    }
  }
  const sinPenales = toSave.filter(r => r.home_goals === r.away_goals && !r.winner).length;
  await loadCache();
  renderProns('pa', 'a');
  const msg = document.getElementById('bmsg');
  if (msg) {
    if (sinPenales > 0) {
      msg.style.color = 'var(--yellow)';
      msg.textContent = `✓ Guardado. Ojo: ${sinPenales} empate${sinPenales > 1 ? 's' : ''} sin definir quién avanza — elegí el equipo que pasa para que el cuadro siga.`;
      setTimeout(() => msg.textContent = '', 5000);
    } else {
      msg.style.color = 'var(--green)';
      msg.textContent = '✓ Resultados guardados';
      setTimeout(() => msg.textContent = '', 2500);
    }
  }
}

// Guarda en memoria lo que el jugador tipea en el bracket (no perder al cambiar de vista)
function draftB(id) {
  const h = document.getElementById('bp' + id + 'h');
  const a = document.getElementById('bp' + id + 'a');
  if (h && a) cache.bracketProns[id] = { h: h.value, a: a.value };
}

// Jugador guarda sus predicciones del bracket
async function saveBracketProns() {
  const btn = event.target; btn.disabled = true; btn.textContent = 'Guardando...';
  const toSave = [];
  ALL_BRACKET_MATCHES.forEach(m => {
    if (matchStarted(m.id)) return; // no guardar los bloqueados
    const d = cache.bracketProns[m.id];
    if (d && d.h !== '' && d.h != null && d.a !== '' && d.a != null) {
      toSave.push({ match_id: m.id, home_goals: parseInt(d.h), away_goals: parseInt(d.a) });
    }
  });
  if (toSave.length) {
    try { await rpc('prode_save_bracket_predictions', { p_token: TOKEN, p_rows: toSave }); }
    catch (err) {
      btn.disabled = false; btn.innerHTML = '💾 Guardar mis predicciones';
      const m = document.getElementById('bpmsg');
      if (m) { m.style.color = 'var(--red)'; m.textContent = 'No se pudieron guardar: ' + err.message; }
      return;
    }
  }
  btn.disabled = false; btn.innerHTML = '💾 Guardar mis predicciones';
  const msg = document.getElementById('bpmsg');
  if (msg) { msg.textContent = '✓ Predicciones guardadas'; setTimeout(() => msg.textContent = '', 2500); }
}

// ── CONFIG ────────────────────────────────────────────────────────────────────

async function saveAdminPass() {
  const ap = document.getElementById('cfa').value;     // NUEVA contraseña admin
  const msg = document.getElementById('cfmsg');
  if (!ap || ap === '') { msg.style.color = 'var(--text3)'; msg.textContent = 'Escribí una nueva contraseña para cambiarla.'; return; }
  try {
    // player_pass quedó sin uso (cada jugador entra con su propia contraseña); mandamos '' sin efecto
    await rpc('prode_admin_save_config', { p_token: TOKEN, p_new_player_pass: '', p_new_admin_pass: ap });
  } catch (err) {
    msg.style.color = 'var(--red)'; msg.textContent = 'Error: ' + err.message; return;
  }
  document.getElementById('cfa').value = '';
  msg.style.color = 'var(--green)';
  msg.textContent = '✓ Contraseña de admin actualizada';
  setTimeout(() => msg.textContent = '', 2500);
}

// Admin: eliminar una cuenta de jugador (y todos sus pronósticos)
async function deletePlayer(name) {
  if (!confirm(`¿Eliminar la cuenta de "${name}"?\n\nSe borran su cuenta y TODOS sus pronósticos. Esta acción no se puede deshacer.`)) return;
  try {
    await rpc('prode_admin_delete_player', { p_token: TOKEN, p_name: name });
  } catch (err) {
    alert('No se pudo eliminar: ' + err.message); return;
  }
  await loadCache();
  renderPart();
}

// ── GESTIÓN DE JUGADORES (admin) ───────────────────────────────────────────────

async function renderPart() {
  const { byPlayer } = await loadAllProns();
  const players = cache.players;

  let html = `<div class="card">
    <div style="font-size:14px;font-weight:600;margin-bottom:1rem">Crear cuenta de jugador</div>
    <div style="margin-bottom:10px"><div class="label">Nombre</div><input type="text" class="login-input" id="np-name" placeholder="Ej: Matías"></div>
    <div style="margin-bottom:10px"><div class="label">Contraseña personal</div><input type="text" class="login-input" id="np-pass" placeholder="La que va a usar para entrar"></div>
    <div style="margin-bottom:12px"><div class="label">Foto de perfil (opcional, podés agregarla después)</div>
      <input type="file" accept="image/*" id="np-photo" style="font-size:12px;color:var(--text2)"></div>
    <button class="btn btn-primary" onclick="createPlayer()">+ Crear cuenta</button>
    <div class="err" id="np-msg"></div>
  </div>`;

  html += `<div style="font-size:13px;font-weight:600;margin:1rem 0 8px;color:var(--text2)">Jugadores (${players.length})</div>`;
  if (!players.length) {
    html += `<div class="card"><div style="color:var(--text2);font-size:13px">Todavía no creaste ninguna cuenta.</div></div>`;
  } else {
    html += `<div class="card" style="padding:0 1.25rem">`;
    players.forEach(u => {
      const filled = Object.keys(byPlayer[u] || {}).length;
      const done = filled === MATCHES.length;
      html += `<div class="player-chip">
        ${avatarHtml(u, 38)}
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600">${u}</div>
          <div style="font-size:11px;color:var(--text2)">${filled}/${MATCHES.length} pronósticos · <a style="color:#7cc4f0;cursor:pointer" onclick="changePhoto('${u.replace(/'/g,"\\'")}')">cambiar foto</a> · <a style="color:#7cc4f0;cursor:pointer" onclick="changePass('${u.replace(/'/g,"\\'")}')">contraseña</a> · <a style="color:#f87171;cursor:pointer" onclick="deletePlayer('${u.replace(/'/g,"\\'")}')">eliminar</a></div>
        </div>
        <div class="dot ${done ? 'dot-ok' : 'dot-nd'}"></div>
      </div>`;
    });
    html += `</div>`;
  }
  // input oculto para cambiar foto de un jugador existente
  html += `<input type="file" accept="image/*" id="photo-changer" style="display:none">`;

  // Contraseña de admin (lo que estaba en Config)
  html += `<div style="font-size:13px;font-weight:600;margin:1.25rem 0 8px;color:var(--text2)">Tu cuenta (admin)</div>
    <div class="card">
      <div class="label">Nueva contraseña de admin</div>
      <input type="text" id="cfa" placeholder="Dejar vacío para no cambiarla" style="margin-bottom:6px">
      <div style="font-size:11px;color:var(--text3);margin-bottom:12px">Por seguridad, la contraseña actual no se muestra. Escribí una nueva solo si querés cambiarla.</div>
      <button class="btn btn-primary btn-sm" onclick="saveAdminPass()">💾 Guardar contraseña</button>
      <div class="ok" id="cfmsg"></div>
    </div>`;

  document.getElementById('partcont').innerHTML = html;
}

// Sube una imagen al Storage de Supabase y devuelve la URL pública
async function uploadAvatar(file, playerName) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const safe = playerName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${safe}_${Date.now()}.${ext}`;
  const url = `${SUPABASE_URL}/storage/v1/object/avatars/${path}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': file.type || 'image/jpeg' },
    body: file
  });
  if (!r.ok) throw new Error('upload failed');
  return `${SUPABASE_URL}/storage/v1/object/public/avatars/${path}`;
}

async function createPlayer() {
  const name = document.getElementById('np-name').value.trim();
  const pass = document.getElementById('np-pass').value;
  const fileInput = document.getElementById('np-photo');
  const msg = document.getElementById('np-msg');
  msg.style.color = 'var(--red)';
  if (!name) { msg.textContent = 'Ingresá un nombre'; return; }
  if (!pass) { msg.textContent = 'Ingresá una contraseña'; return; }
  // ¿ya existe?
  const exists = await dbGet('players_public', `name=ilike.${encodeURIComponent(name)}&select=name`);
  if (exists && exists.length) { msg.textContent = 'Ya existe una cuenta con ese nombre'; return; }
  msg.style.color = 'var(--text2)';
  msg.textContent = 'Creando...';
  let photoUrl = null;
  try {
    if (fileInput.files && fileInput.files[0]) photoUrl = await uploadAvatar(fileInput.files[0], name);
    await rpc('prode_admin_create_player', { p_token: TOKEN, p_name: name, p_player_pass: pass, p_photo_url: photoUrl });
    await loadCache();
    renderPart();
  } catch (err) {
    msg.style.color = 'var(--red)';
    msg.textContent = 'Error al crear la cuenta: ' + err.message;
  }
}

let photoChangeTarget = null;
function changePhoto(name) {
  photoChangeTarget = name;
  const inp = document.getElementById('photo-changer');
  inp.onchange = async () => {
    if (!inp.files || !inp.files[0]) return;
    try {
      const url = await uploadAvatar(inp.files[0], name);
      await rpc('prode_admin_change_player_photo', { p_token: TOKEN, p_name: name, p_photo_url: url });
      await loadCache();
      renderPart();
    } catch (e) { alert('No se pudo subir la foto. Probá de nuevo.'); }
  };
  inp.click();
}

async function changePass(name) {
  const np = prompt('Nueva contraseña para ' + name + ':');
  if (np === null || np === '') return;
  try {
    await rpc('prode_admin_change_player_pass', { p_token: TOKEN, p_name: name, p_new_pass: np });
    alert('Contraseña actualizada para ' + name);
  } catch (err) { alert('No se pudo actualizar: ' + err.message); }
}

// ── UTILS ─────────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
