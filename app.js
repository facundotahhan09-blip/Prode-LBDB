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
async function dbUpsert(table, data) {
  const r = await fetch(sb(table).url, {
    method: 'POST', headers: { ...sb(table).headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(data)
  });
  return r.json();
}
async function dbDelete(table, params) {
  await fetch(`${sb(table).url}?${params}`, { method: 'DELETE', headers: sb(table).headers });
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

let CU = null, IA = false;
let cache = { results: {}, players: [], prons: {}, config: {},
              bracketResults: {}, bracketProns: {}, bracketSlots: {}, bracketConfirmed: false };

// ── HELPERS ──────────────────────────────────────────────────────────────────

const fl = t => { const code = FLAGS[t]; return code ? `<img src="https://flagcdn.com/w40/${code}.png" width="24" height="16" style="border-radius:2px;object-fit:cover;vertical-align:middle" alt="${t}">` : '<span style="display:inline-block;width:24px;height:16px;background:#333;border-radius:2px"></span>'; };
const ini = n => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
const win = (h,a) => h>a?'h':a>h?'a':'d';

function pts(matchId, ph, pa) {
  const r = cache.results[matchId];
  if (!r) return null;
  if (ph === '' || ph === null || ph === undefined) return 0;
  const p = parseInt(ph), q = parseInt(pa);
  if (p === r.home_goals && q === r.away_goals) return 3;
  if (win(p,q) === win(r.home_goals, r.away_goals)) return 1;
  return 0;
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
  if (id === 'tg') renderGrpStandings();
  if (id === 'tt' || id === 'at') renderTbl(id === 'at' ? 'atblcont' : 'tblcont');
  if (id === 'tr') renderMyRes();
  if (id === 'te') renderElim('elimu', false);
  if (id === 'ae2') renderElim('elima', false);
  if (id === 'apa') renderPart();
}

// ── AUTH ─────────────────────────────────────────────────────────────────────

async function doLogin() {
  const n = document.getElementById('ln').value.trim();
  const p = document.getElementById('lp').value;
  const e = document.getElementById('le');
  if (!n) { e.textContent = 'Ingresá tu nombre'; return; }
  const cfg = await dbGet('config', 'id=eq.1');
  if (!cfg[0] || p !== cfg[0].player_pass) { e.textContent = 'Contraseña incorrecta'; return; }
  e.textContent = '';
  CU = n; IA = false;
  await dbUpsert('players', { name: n });
  await loadCache();
  renderUsr();
  go('usr');
}

async function doAdmin() {
  const p = document.getElementById('ap').value;
  const e = document.getElementById('ae');
  const cfg = await dbGet('config', 'id=eq.1');
  if (!cfg[0] || p !== cfg[0].admin_pass) { e.textContent = 'Contraseña incorrecta'; return; }
  e.textContent = '';
  IA = true;
  await loadCache();
  renderAdm();
  go('adm');
}

function doOut() {
  CU = null; IA = false;
  document.getElementById('ln').value = '';
  document.getElementById('lp').value = '';
  go('sl');
}

// ── CACHE ────────────────────────────────────────────────────────────────────

async function loadCache() {
  const [res, players, cfg, bres, bslots, bcfg] = await Promise.all([
    dbGet('results', 'select=match_id,home_goals,away_goals'),
    dbGet('players', 'select=name'),
    dbGet('config', 'id=eq.1'),
    dbGet('bracket_results', 'select=match_id,home_team,away_team,home_goals,away_goals,home_pens,away_pens,winner,kickoff'),
    dbGet('bracket_slots', 'select=slot,team'),
    dbGet('bracket_config', 'id=eq.1')
  ]);
  cache.results = {};
  res.forEach(r => cache.results[r.match_id] = r);
  cache.players = players.map(p => p.name);
  cache.config = cfg[0] || {};
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
  document.getElementById('unav').textContent = ini(CU);
  buildGT('gsu', 'u');
  renderProns('pu', 'u');
  renderTbl('tblcont');
}

function renderAdm() {
  buildGT('gsa', 'a');
  renderProns('pa', 'a');
  document.getElementById('cfp').value = cache.config.player_pass || '';
  document.getElementById('cfa').value = cache.config.admin_pass || '';
  renderTbl('atblcont');
  renderElim('elima', false);
}

const JORNADAS = [
  { num: 1, label: 'Jornada 1', dates: '11 – 17 jun' },
  { num: 2, label: 'Jornada 2', dates: '18 – 23 jun' },
  { num: 3, label: 'Jornada 3', dates: '24 – 27 jun' }
];

let selJ = { u: 1, a: 1 };

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
    renderBracketInto(elId, isA, mode === 'u' ? 'pred' : 'adminres');
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
      const ph = isA ? (r ? r.home_goals : '') : (cache.prons[m.id]?.h ?? '');
      const pa = isA ? (r ? r.away_goals : '') : (cache.prons[m.id]?.a ?? '');
      const hasR = !!r;
      const p = hasR && !isA ? pts(m.id, cache.prons[m.id]?.h, cache.prons[m.id]?.a) : null;
      let badge = '';
      if (p === 3) badge = '<span class="badge bex">+3 pts</span>';
      else if (p === 1) badge = '<span class="badge bwi">+1 pt</span>';
      else if (p === 0 && hasR) badge = '<span class="badge bno">0 pts</span>';
      const color = GRP_COLORS[m.g];
      html += `<div class="match-card">
        <div class="match-meta">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:5px;background:${color};font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${m.g}</span>
          <span class="match-time">${m.time} ARG</span>
          <span style="color:var(--text3)">·</span>
          <span class="match-sede">${m.sede}</span>
          ${badge}
        </div>
        <div class="match-body">
          <div class="team-l"><span class="team-name">${m.h}</span><span class="flag">${fl(m.h)}</span></div>
          <input type="number" min="0" max="99" value="${ph ?? ''}" id="m${mode}${m.id}h" oninput="if(this.value.length>2)this.value=this.value.slice(0,2)" ${hasR && !isA ? 'disabled' : ''}>
          <div class="vs">${hasR ? `<span class="result-score">${r.home_goals}-${r.away_goals}</span>` : 'vs'}</div>
          <input type="number" min="0" max="99" value="${pa ?? ''}" id="m${mode}${m.id}a" oninput="if(this.value.length>2)this.value=this.value.slice(0,2)" ${hasR && !isA ? 'disabled' : ''}>
          <div class="team-r"><span class="flag">${fl(m.a)}</span><span class="team-name">${m.a}</span></div>
        </div>
      </div>`;
    });
    html += '</div>';
  });
  document.getElementById(elId).innerHTML = html;
}

async function savePron() {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  const toSave = [];
  MATCHES.forEach(m => {
    const h = document.getElementById('mu' + m.id + 'h');
    const a = document.getElementById('mu' + m.id + 'a');
    if (h && a && h.value !== '' && a.value !== '') {
      toSave.push({ player_name: CU, match_id: m.id, home_goals: parseInt(h.value), away_goals: parseInt(a.value) });
      cache.prons[m.id] = { h: parseInt(h.value), a: parseInt(a.value) };
    }
  });
  if (toSave.length) await dbUpsert('predictions', toSave);
  btn.disabled = false;
  btn.innerHTML = '💾 Guardar pronósticos';
  const msg = document.getElementById('pmsg');
  msg.textContent = '✓ Pronósticos guardados';
  setTimeout(() => msg.textContent = '', 3000);
}

async function saveRes() {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  const toSave = [];
  MATCHES.forEach(m => {
    const h = document.getElementById('ma' + m.id + 'h');
    const a = document.getElementById('ma' + m.id + 'a');
    if (h && a && h.value !== '' && a.value !== '') {
      toSave.push({ match_id: m.id, home_goals: parseInt(h.value), away_goals: parseInt(a.value) });
      cache.results[m.id] = { home_goals: parseInt(h.value), away_goals: parseInt(a.value) };
    }
  });
  if (toSave.length) await dbUpsert('results', toSave);
  btn.disabled = false;
  btn.innerHTML = '✓ Guardar resultados';
  renderTbl('atblcont');
  const msg = document.getElementById('rmsg');
  msg.textContent = '✓ Resultados guardados';
  setTimeout(() => msg.textContent = '', 3000);
}

// ── STANDINGS ────────────────────────────────────────────────────────────────

function renderGrpStandings() {
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
  document.getElementById('grpcont').innerHTML = html;
}

// ── TABLA JUGADORES ──────────────────────────────────────────────────────────

async function renderTbl(id) {
  document.getElementById(id).innerHTML = '<div class="loading"><div class="spinner"></div>Cargando...</div>';
  const { byPlayer, bpByPlayer } = await loadAllProns();
  const players = cache.players;
  const scores = {};
  players.forEach(u => {
    let tot = 0, ex = 0, wi = 0;
    // Puntos fase de grupos
    MATCHES.forEach(m => {
      const p = byPlayer[u]?.[m.id];
      const pp = p ? pts(m.id, p.h, p.a) : 0;
      if (pp === 3) { tot += 3; ex++; }
      else if (pp === 1) { tot += 1; wi++; }
    });
    // Puntos fase eliminatoria (mismo criterio: 3 exacto / 1 ganador)
    let ep = 0;
    ALL_BRACKET_MATCHES.forEach(m => {
      const p = bpByPlayer[u]?.[m.id];
      if (!p) return;
      const pp = scoreBracketPts(m.id, p.h, p.a);
      if (pp === 3) { ep += 3; ex++; }
      else if (pp === 1) { ep += 1; wi++; }
    });
    scores[u] = { tot: tot + ep, group: tot, elim: ep, ex, wi };
  });
  const sorted = Object.entries(scores).sort((a, b) => b[1].tot - a[1].tot);
  const played = MATCHES.filter(m => cache.results[m.id]).length;
  let html = `<div class="stats-grid">
    <div class="stat-card"><div class="stat-num">${played}/${MATCHES.length}</div><div class="stat-label">Partidos jugados</div></div>
    <div class="stat-card"><div class="stat-num">${players.length}</div><div class="stat-label">Participantes</div></div>
    <div class="stat-card"><div class="stat-num">${sorted[0]?.[1].tot ?? 0}</div><div class="stat-label">Puntaje líder</div></div>
  </div>
  <div class="card" style="padding:0;overflow:hidden">
  <table class="ptbl"><thead><tr>
    <th style="width:32px">#</th><th>Jugador</th><th style="text-align:center">Pts</th>
    <th style="text-align:center">Grupo</th><th style="text-align:center">Elim.</th><th style="text-align:center">Exactos</th>
  </tr></thead><tbody>`;
  sorted.forEach(([u, s], i) => {
    const pc = i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : '';
    html += `<tr>
      <td style="padding-left:14px"><span class="pn ${pc}">${i+1}</span></td>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="avatar">${ini(u)}</div>${u}</div></td>
      <td style="text-align:center;font-weight:700;font-size:14px">${s.tot}</td>
      <td style="text-align:center;color:var(--text2)">${s.group}</td>
      <td style="text-align:center;color:var(--yellow)">${s.elim}</td>
      <td style="text-align:center;color:var(--green)">${s.ex}</td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  document.getElementById(id).innerHTML = html;
}

// ── MIS RESULTADOS ───────────────────────────────────────────────────────────

function renderMyRes() {
  let html = '';
  JORNADAS.forEach(j => {
    const ms = MATCHES.filter(m => m.j === j.num);
    const byDate = {};
    ms.forEach(m => { if (!byDate[m.date]) byDate[m.date] = []; byDate[m.date].push(m); });

    html += `<div style="margin-bottom:1.5rem">
      <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)">
        ${j.label} <span style="font-size:12px;font-weight:400;color:var(--text2)">${j.dates}</span>
      </div>`;
    Object.entries(byDate).forEach(([date, matches]) => {
      html += `<div style="margin-bottom:1rem">
        <div style="font-size:12px;color:var(--text3);margin-bottom:6px;font-weight:500">${date}</div>`;
      matches.forEach(m => {
        const r = cache.results[m.id];
        const p = cache.prons[m.id];
        const hasR = !!r;
        const pp = p ? pts(m.id, p.h, p.a) : (hasR ? 0 : null);
        let badge = '';
        if (pp === 3) badge = '<span class="badge bex">+3</span>';
        else if (pp === 1) badge = '<span class="badge bwi">+1</span>';
        else if (pp === 0 && hasR) badge = '<span class="badge bno">0</span>';
        const my = p ? `${p.h}-${p.a}` : '<span style="color:var(--text3)">—</span>';
        const color = GRP_COLORS[m.g];
        html += `<div class="match-card">
          <div class="match-meta">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:5px;background:${color};font-size:11px;font-weight:700;color:#fff">${m.g}</span>
            <span class="match-time">${m.time} ARG</span>
            <span style="color:var(--text3);font-size:11px">Mi pronóstico: ${my}</span>
            ${badge}
          </div>
          <div class="match-body">
            <div class="team-l"><span class="team-name">${m.h}</span><span class="flag">${fl(m.h)}</span></div>
            <div style="text-align:center">${hasR ? `<span class="result-score">${r.home_goals}-${r.away_goals}</span>` : '<span style="color:var(--text3)">-</span>'}</div>
            <div></div><div></div>
            <div class="team-r"><span class="flag">${fl(m.a)}</span><span class="team-name">${m.a}</span></div>
          </div>
        </div>`;
      });
      html += '</div>';
    });
    html += '</div>';
  });
  document.getElementById('rescont').innerHTML = html;
}

// ── BRACKET (FASE ELIMINATORIA) ────────────────────────────────────────────────

// Helper: ¿el partido ya arrancó? (bloquea predicciones)
function matchStarted(mid) {
  const r = cache.bracketResults[mid];
  if (r?.kickoff) return new Date(r.kickoff) <= new Date();
  return false; // si no hay kickoff definido, se puede predecir
}

// Marcador final de un partido del bracket (para mostrar)
function bracketScore(mid) {
  const r = cache.bracketResults[mid];
  if (!r || r.home_goals === null || r.home_goals === undefined) return null;
  return r;
}

// Render del bracket para el jugador (te=elimu) o admin (ae2=elima)
// renderElim ahora se usa SOLO para la pestaña "Eliminatorias" = modo REAL (solo lectura)
function renderElim(id, isA) {
  let html = `<div class="bk-head"><div class="bk-title">🏆 CUADRO DEL MUNDIAL</div>
    <div class="bk-sub">Resultados reales · desliza horizontalmente →</div></div>`;
  html += renderBracketColumns('real');
  document.getElementById(id).innerHTML = html;
}

// Render del bracket dentro de un contenedor, según el modo:
//  'pred'     → jugador predice (pestaña pronósticos)
//  'adminres' → admin carga resultados (pestaña pronósticos)
//  'real'     → solo lectura (pestaña Eliminatorias)
function renderBracketInto(elId, isAdmin, modo) {
  const complete = allGroupsComplete();
  let html = '';

  // Encabezado admin con confirmación de clasificados (solo en modo adminres)
  if (modo === 'adminres') {
    html += `<div class="card" style="margin-bottom:12px">
      <div style="font-size:13px;font-weight:600;margin-bottom:8px">Clasificación a eliminatorias</div>`;
    if (!complete) {
      html += `<div style="font-size:12px;color:var(--text3)">Aún faltan resultados de grupos. El cuadro muestra las posiciones (1A, 2B...) y se irá completando con los equipos reales.</div>`;
    } else if (!cache.bracketConfirmed) {
      html += `<div style="font-size:12px;color:var(--text2);margin-bottom:10px">Los grupos están completos. Confirmá los clasificados para fijar los cruces (1°, 2° y 8 mejores terceros automáticos según FIFA).</div>
        <button class="btn btn-primary btn-full" onclick="confirmGroups()">✓ Confirmar clasificados y armar cuadro</button>`;
    } else {
      html += `<div style="font-size:12px;color:var(--green);margin-bottom:10px">✓ Clasificados confirmados. Cargá los resultados de cada cruce abajo.</div>
        <button class="btn btn-sm" onclick="reopenGroups()">↺ Reabrir / recalcular clasificados</button>`;
    }
    html += `</div>`;
  }

  // El cuadro SIEMPRE se muestra (con etiquetas 1A/2B/3... en los huecos vacíos)
  html += `<div class="bk-head"><div class="bk-title">🏆 FASE ELIMINATORIA</div>
    <div class="bk-sub">Desliza horizontalmente para ver todas las rondas →</div></div>`;
  html += renderBracketColumns(modo);

  // Botones de guardado
  if (modo === 'adminres') {
    html += `<button class="btn btn-primary btn-full" onclick="saveBracketResults()" style="margin-top:10px">✓ Guardar resultados del cuadro</button><div class="ok" id="bmsg"></div>`;
  }
  if (modo === 'pred') {
    html += `<div style="font-size:12px;color:var(--text2);margin:10px 0 8px">Predicí el marcador de cada cruce ya definido. Podés modificar hasta que arranca el partido. Puntos: 3 exacto · 1 ganador · 0 nada.</div>
      <button class="btn btn-primary btn-full" onclick="saveBracketProns()">💾 Guardar mis predicciones</button><div class="ok" id="bpmsg"></div>`;
  }

  document.getElementById(elId).innerHTML = html;
}

// Construye el cuadro simétrico: izquierda → centro (final) ← derecha
function renderBracketColumns(modo) {
  // Reparto de cruces por lado:
  // Izquierda alimenta SF-1 (R32 1-8, R16 1-4, QF 1-2)
  // Derecha alimenta SF-2 (R32 9-16, R16 5-8, QF 3-4)
  const left = {
    r32: BRACKET.r32.slice(0,8), r16: BRACKET.r16.slice(0,4), qf: BRACKET.qf.slice(0,2), sf: [BRACKET.sf[0]]
  };
  const right = {
    r32: BRACKET.r32.slice(8,16), r16: BRACKET.r16.slice(4,8), qf: BRACKET.qf.slice(2,4), sf: [BRACKET.sf[1]]
  };
  const roundNames = { r32:'16avos', r16:'8avos', qf:'4tos', sf:'Semi' };
  const leftOrder = ['r32','r16','qf','sf'];
  const rightOrder = ['sf','qf','r16','r32'];

  let html = `<div class="bk-scroll"><div class="bk-grid">`;

  // ----- LADO IZQUIERDO -----
  leftOrder.forEach((key, idx) => {
    const ms = left[key];
    html += `<div class="bk-col"><div class="bk-col-t">${roundNames[key]}</div>`;
    ms.forEach(m => html += renderBracketMatch(m, modo));
    html += `</div>`;
    // conector hacia la derecha (apunta al centro)
    html += `<div class="bk-conn"><div class="bk-conn-t"></div><div class="bk-conn-b">`;
    for (let k = 0; k < ms.length; k++) html += `<div class="bk-cell ${k%2===0?'l-top':'l-bot'}"></div>`;
    html += `</div>`;
  });

  // ----- CENTRO: Final + campeón -----
  const champ = cache.bracketResults['FINAL']?.winner;
  html += `<div class="bk-center">
    <div class="bk-col-t" style="color:#f5c542">FINAL</div>
    <div class="bk-trophy-mini">🏆</div>
    ${renderBracketMatch(BRACKET.final[0], modo)}
    <div class="bk-champ"><div class="bk-champ-label">CAMPEÓN</div>
      <div class="bk-champ-team">${champ ? fl(champ)+' <b>'+champ+'</b>' : '<span class="bk-slot">A definir</span>'}</div></div>
  </div>`;

  // ----- LADO DERECHO (espejo) -----
  rightOrder.forEach((key, idx) => {
    const ms = right[key];
    // conector hacia la izquierda (apunta al centro) — va ANTES de la columna
    html += `<div class="bk-conn"><div class="bk-conn-t"></div><div class="bk-conn-b">`;
    for (let k = 0; k < ms.length; k++) html += `<div class="bk-cell ${k%2===0?'r-top':'r-bot'}"></div>`;
    html += `</div></div>`;
    html += `<div class="bk-col"><div class="bk-col-t">${roundNames[key]}</div>`;
    ms.forEach(m => html += renderBracketMatch(m, modo));
    html += `</div>`;
  });

  html += `</div></div>`;
  return html;
}

// Render de un partido individual del bracket según el modo
function renderBracketMatch(m, modo) {
  const homeTeam = resolveSlot(m.home);
  const awayTeam = resolveSlot(m.away);
  const homeLbl = homeTeam || slotLabel(m.home);
  const awayLbl = awayTeam || slotLabel(m.away);
  const r = bracketScore(m.id);
  const started = matchStarted(m.id);
  const myP = cache.bracketProns[m.id];
  const teamsKnown = homeTeam && awayTeam;

  let homeCls = '', awayCls = '';
  if (r && r.winner) {
    if (r.winner === homeTeam) homeCls = 'bk-win';
    if (r.winner === awayTeam) awayCls = 'bk-win';
  }
  const fmtScore = (goals, pens) => {
    if (goals === null || goals === undefined) return '';
    return pens !== null && pens !== undefined ? `${goals}<span class="bk-pen">(${pens})</span>` : `${goals}`;
  };
  const flagImg = t => t && FLAGS[t]
    ? `<img src="https://flagcdn.com/w40/${FLAGS[t]}.png" onerror="this.style.visibility='hidden'">`
    : `<span style="display:inline-block;width:18px;height:12px;background:#1f2a40;border-radius:2px;flex-shrink:0;box-shadow:0 0 0 1px rgba(255,255,255,.06)"></span>`;
  const homeNmCls = homeTeam ? 'nm' : 'nm bk-slot';
  const awayNmCls = awayTeam ? 'nm' : 'nm bk-slot';

  // MODO ADMIN: cargar resultados reales
  if (modo === 'adminres') {
    return `<div class="bk-match">
      <div class="bk-match-info">${m.date} · ${m.time} · ${m.sede}</div>
      <div class="bk-team ${homeCls}">${flagImg(homeTeam)}<span class="${homeNmCls}">${homeLbl}</span>
        <input type="number" min="0" max="99" class="bk-in" id="br${m.id}h" value="${r?.home_goals??''}" ${!teamsKnown?'disabled':''} oninput="if(this.value.length>2)this.value=this.value.slice(0,2)"></div>
      <div class="bk-team ${awayCls}">${flagImg(awayTeam)}<span class="${awayNmCls}">${awayLbl}</span>
        <input type="number" min="0" max="99" class="bk-in" id="br${m.id}a" value="${r?.away_goals??''}" ${!teamsKnown?'disabled':''} oninput="if(this.value.length>2)this.value=this.value.slice(0,2)"></div>
      <div class="bk-pens">Penales (si empatan): 
        <input type="number" min="0" max="99" class="bk-pen-in" id="br${m.id}ph" value="${r?.home_pens??''}" placeholder="L">
        <input type="number" min="0" max="99" class="bk-pen-in" id="br${m.id}pa" value="${r?.away_pens??''}" placeholder="V"></div>
    </div>`;
  }

  // MODO PREDICCIÓN: jugador pone su marcador
  if (modo === 'pred') {
    let badge = '';
    if (r && myP) {
      const pp = scoreBracketPts(m.id, myP.h, myP.a);
      if (pp === 3) badge = '<span class="badge bex">+3</span>';
      else if (pp === 1) badge = '<span class="badge bwi">+1</span>';
      else if (pp === 0) badge = '<span class="badge bno">0</span>';
    }
    const lockIcon = started ? ' 🔒' : '';
    return `<div class="bk-match">
      <div class="bk-match-info">${m.date} · ${m.time} ARG · ${m.sede}${lockIcon} ${badge}</div>
      <div class="bk-team ${homeCls}">${flagImg(homeTeam)}<span class="${homeNmCls}">${homeLbl}</span>
        ${r ? `<span class="sc">${fmtScore(r.home_goals,r.home_pens)}</span>` : `<input type="number" min="0" max="99" class="bk-in" id="bp${m.id}h" value="${myP?.h??''}" ${(!teamsKnown||started)?'disabled':''} oninput="if(this.value.length>2)this.value=this.value.slice(0,2)">`}</div>
      <div class="bk-team ${awayCls}">${flagImg(awayTeam)}<span class="${awayNmCls}">${awayLbl}</span>
        ${r ? `<span class="sc">${fmtScore(r.away_goals,r.away_pens)}</span>` : `<input type="number" min="0" max="99" class="bk-in" id="bp${m.id}a" value="${myP?.a??''}" ${(!teamsKnown||started)?'disabled':''} oninput="if(this.value.length>2)this.value=this.value.slice(0,2)">`}</div>
      ${myP && !r ? `<div class="bk-mypred">Mi predicción: ${myP.h}-${myP.a}</div>` : ''}
    </div>`;
  }

  // MODO REAL: solo lectura (lo que va pasando)
  let myInfo = '';
  if (myP) {
    if (r) {
      const pp = scoreBracketPts(m.id, myP.h, myP.a);
      let b = pp === 3 ? 'bex' : pp === 1 ? 'bwi' : 'bno';
      myInfo = `<div class="bk-mypred">Predijiste ${myP.h}-${myP.a} <span class="badge ${b}">${pp>0?'+'+pp:'0'}</span></div>`;
    } else {
      myInfo = `<div class="bk-mypred">Tu predicción: ${myP.h}-${myP.a}</div>`;
    }
  }
  return `<div class="bk-match">
    <div class="bk-match-info">${m.date} · ${m.time} ARG · ${m.sede}</div>
    <div class="bk-team ${homeCls}">${flagImg(homeTeam)}<span class="${homeNmCls}">${homeLbl}</span>
      <span class="sc">${r ? fmtScore(r.home_goals,r.home_pens) : '—'}</span></div>
    <div class="bk-team ${awayCls}">${flagImg(awayTeam)}<span class="${awayNmCls}">${awayLbl}</span>
      <span class="sc">${r ? fmtScore(r.away_goals,r.away_pens) : '—'}</span></div>
    ${myInfo}
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
  await dbUpsert('bracket_slots', rows);
  await dbUpsert('bracket_config', { id: 1, groups_confirmed: true });
  cache.bracketSlots = auto;
  cache.bracketConfirmed = true;
  renderProns('pa', 'a');
}

async function reopenGroups() {
  const auto = computeAutoSlots();
  const rows = Object.entries(auto).map(([slot, team]) => ({ slot, team }));
  await dbUpsert('bracket_slots', rows);
  cache.bracketSlots = auto;
  renderProns('pa', 'a');
}

// Admin guarda resultados del bracket (calcula ganador y avanza)
async function saveBracketResults() {
  const btn = event.target; btn.disabled = true; btn.textContent = 'Guardando...';
  const toSave = [];
  ALL_BRACKET_MATCHES.forEach(m => {
    const h = document.getElementById('br'+m.id+'h');
    const a = document.getElementById('br'+m.id+'a');
    if (!h || !a || h.value === '' || a.value === '') return;
    const ph = document.getElementById('br'+m.id+'ph');
    const pa = document.getElementById('br'+m.id+'pa');
    const hg = parseInt(h.value), ag = parseInt(a.value);
    const homeTeam = resolveSlot(m.home), awayTeam = resolveSlot(m.away);
    let winner;
    if (hg > ag) winner = homeTeam;
    else if (ag > hg) winner = awayTeam;
    else {
      // empate → definir por penales
      const hp = ph && ph.value !== '' ? parseInt(ph.value) : null;
      const ap = pa && pa.value !== '' ? parseInt(pa.value) : null;
      if (hp !== null && ap !== null) winner = hp > ap ? homeTeam : awayTeam;
      else winner = null;
    }
    const row = { match_id: m.id, home_team: homeTeam, away_team: awayTeam,
      home_goals: hg, away_goals: ag,
      home_pens: ph && ph.value !== '' ? parseInt(ph.value) : null,
      away_pens: pa && pa.value !== '' ? parseInt(pa.value) : null,
      winner };
    toSave.push(row);
    cache.bracketResults[m.id] = row;
  });
  if (toSave.length) await dbUpsert('bracket_results', toSave);
  await loadCache();
  renderProns('pa', 'a');
  const msg = document.getElementById('bmsg');
  if (msg) { msg.textContent = '✓ Resultados guardados'; setTimeout(() => msg.textContent = '', 2500); }
}

// Jugador guarda sus predicciones del bracket
async function saveBracketProns() {
  const btn = event.target; btn.disabled = true; btn.textContent = 'Guardando...';
  const toSave = [];
  ALL_BRACKET_MATCHES.forEach(m => {
    if (matchStarted(m.id)) return; // no guardar los bloqueados
    const h = document.getElementById('bp'+m.id+'h');
    const a = document.getElementById('bp'+m.id+'a');
    if (h && a && h.value !== '' && a.value !== '') {
      toSave.push({ player_name: CU, match_id: m.id, home_goals: parseInt(h.value), away_goals: parseInt(a.value) });
      cache.bracketProns[m.id] = { h: parseInt(h.value), a: parseInt(a.value) };
    }
  });
  if (toSave.length) await dbUpsert('bracket_predictions', toSave);
  btn.disabled = false; btn.innerHTML = '💾 Guardar mis predicciones';
  const msg = document.getElementById('bpmsg');
  if (msg) { msg.textContent = '✓ Predicciones guardadas'; setTimeout(() => msg.textContent = '', 2500); }
}

// ── CONFIG ────────────────────────────────────────────────────────────────────

async function saveCfg() {
  const pp = document.getElementById('cfp').value;
  const ap = document.getElementById('cfa').value;
  await dbUpsert('config', { id: 1, player_pass: pp, admin_pass: ap });
  cache.config = { player_pass: pp, admin_pass: ap };
  const msg = document.getElementById('cfmsg');
  msg.textContent = '✓ Guardado';
  setTimeout(() => msg.textContent = '', 2500);
}

// ── PARTICIPANTES ─────────────────────────────────────────────────────────────

async function renderPart() {
  const { byPlayer } = await loadAllProns();
  const players = cache.players;
  let html = players.length
    ? '<div class="card" style="padding:0 1.25rem">'
    : '<div class="card"><div style="color:var(--text2);font-size:13px">Nadie se registró todavía.</div></div>';
  players.forEach(u => {
    const filled = Object.keys(byPlayer[u] || {}).length;
    const done = filled === MATCHES.length;
    html += `<div class="player-chip">
      <div class="avatar">${ini(u)}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600">${u}</div>
        <div style="font-size:11px;color:var(--text2)">${filled}/${MATCHES.length} pronósticos cargados</div>
      </div>
      <div class="dot ${done ? 'dot-ok' : 'dot-nd'}"></div>
    </div>`;
  });
  if (players.length) html += '</div>';
  document.getElementById('partcont').innerHTML = html;
}

// ── UTILS ─────────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
