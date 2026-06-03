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

const FLAGS = {
  'México':'🇲🇽','Sudáfrica':'🇿🇦','Corea del Sur':'🇰🇷','Rep. Checa':'🇨🇿',
  'Canadá':'🇨🇦','Bosnia y Herz.':'🇧🇦','Qatar':'🇶🇦','Suiza':'🇨🇭',
  'Brasil':'🇧🇷','Marruecos':'🇲🇦','Haití':'🇭🇹','Escocia':'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'USA':'🇺🇸','Paraguay':'🇵🇾','Australia':'🇦🇺','Turquía':'🇹🇷',
  'Alemania':'🇩🇪','Curazao':'🏳','Costa de Marfil':'🇨🇮','Ecuador':'🇪🇨',
  'Países Bajos':'🇳🇱','Japón':'🇯🇵','Suecia':'🇸🇪','Túnez':'🇹🇳',
  'Bélgica':'🇧🇪','Egipto':'🇪🇬','Irán':'🇮🇷','Nueva Zelanda':'🇳🇿',
  'España':'🇪🇸','Cabo Verde':'🇨🇻','Arabia Saudita':'🇸🇦','Uruguay':'🇺🇾',
  'Francia':'🇫🇷','Senegal':'🇸🇳','Irak':'🇮🇶','Noruega':'🇳🇴',
  'Argentina':'🇦🇷','Argelia':'🇩🇿','Austria':'🇦🇹','Jordania':'🇯🇴',
  'Portugal':'🇵🇹','RD Congo':'🇨🇩','Uzbekistán':'🇺🇿','Colombia':'🇨🇴',
  'Inglaterra':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Croacia':'🇭🇷','Ghana':'🇬🇭','Panamá':'🇵🇦'
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

const ELIM_ROUNDS = [
  {name:'16avos de final', matches:[
    {id:'e1',date:'Dom 28 jun'},{id:'e2',date:'Dom 28 jun'},{id:'e3',date:'Lun 29 jun'},{id:'e4',date:'Lun 29 jun'},
    {id:'e5',date:'Mar 30 jun'},{id:'e6',date:'Mar 30 jun'},{id:'e7',date:'Mié 1 jul'},{id:'e8',date:'Mié 1 jul'},
    {id:'e9',date:'Jue 2 jul'},{id:'e10',date:'Jue 2 jul'},{id:'e11',date:'Vie 3 jul'},{id:'e12',date:'Vie 3 jul'},
    {id:'e13',date:'Sáb 4 jul'},{id:'e14',date:'Sáb 4 jul'},{id:'e15',date:'Dom 5 jul'},{id:'e16',date:'Dom 5 jul'}
  ]},
  {name:'Octavos de final', matches:[
    {id:'o1',date:'Lun 6 jul'},{id:'o2',date:'Lun 6 jul'},{id:'o3',date:'Mar 7 jul'},{id:'o4',date:'Mar 7 jul'},
    {id:'o5',date:'Mié 8 jul'},{id:'o6',date:'Mié 8 jul'},{id:'o7',date:'Jue 9 jul'},{id:'o8',date:'Jue 9 jul'}
  ]},
  {name:'Cuartos de final', matches:[
    {id:'q1',date:'Sáb 11 jul'},{id:'q2',date:'Sáb 11 jul'},{id:'q3',date:'Dom 12 jul'},{id:'q4',date:'Dom 12 jul'}
  ]},
  {name:'Semifinales', matches:[{id:'s1',date:'Mar 14 jul'},{id:'s2',date:'Mié 15 jul'}]},
  {name:'Final', matches:[{id:'f1',date:'Dom 19 jul · MetLife, NJ'}]}
];

// ── STATE ────────────────────────────────────────────────────────────────────

let CU = null, IA = false;
let cache = { results: {}, elim: {}, players: [], prons: {}, elimProns: {}, config: {} };

// ── HELPERS ──────────────────────────────────────────────────────────────────

const fl = t => FLAGS[t] || '🏳';
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
  if (id === 'ae2') renderElim('elima', true);
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
  const [res, elim, players, cfg] = await Promise.all([
    dbGet('results', 'select=match_id,home_goals,away_goals'),
    dbGet('elim_results', 'select=match_id,home,away,winner'),
    dbGet('players', 'select=name'),
    dbGet('config', 'id=eq.1')
  ]);
  cache.results = {};
  res.forEach(r => cache.results[r.match_id] = r);
  cache.elim = {};
  elim.forEach(e => cache.elim[e.match_id] = e);
  cache.players = players.map(p => p.name);
  cache.config = cfg[0] || {};

  if (CU) {
    const [prons, ep] = await Promise.all([
      dbGet('predictions', `player_name=eq.${encodeURIComponent(CU)}`),
      dbGet('elim_predictions', `player_name=eq.${encodeURIComponent(CU)}`)
    ]);
    cache.prons = {};
    prons.forEach(p => cache.prons[p.match_id] = { h: p.home_goals, a: p.away_goals });
    cache.elimProns = {};
    ep.forEach(p => cache.elimProns[p.match_id] = p.winner);
  }
}

async function loadAllProns() {
  const all = await dbGet('predictions', 'select=player_name,match_id,home_goals,away_goals');
  const byPlayer = {};
  all.forEach(p => {
    if (!byPlayer[p.player_name]) byPlayer[p.player_name] = {};
    byPlayer[p.player_name][p.match_id] = { h: p.home_goals, a: p.away_goals };
  });
  const allEP = await dbGet('elim_predictions', 'select=player_name,match_id,winner');
  const epByPlayer = {};
  allEP.forEach(p => {
    if (!epByPlayer[p.player_name]) epByPlayer[p.player_name] = {};
    epByPlayer[p.player_name][p.match_id] = p.winner;
  });
  return { byPlayer, epByPlayer };
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
  renderElim('elima', true);
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
}

function renderProns(elId, mode) {
  const jNum = selJ[mode];
  const ms = MATCHES.filter(m => m.j === jNum);
  const isA = mode === 'a';

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
          <input type="number" min="0" max="30" value="${ph ?? ''}" id="m${mode}${m.id}h" ${hasR && !isA ? 'disabled' : ''}>
          <div class="vs">${hasR ? `<span class="result-score">${r.home_goals}-${r.away_goals}</span>` : 'vs'}</div>
          <input type="number" min="0" max="30" value="${pa ?? ''}" id="m${mode}${m.id}a" ${hasR && !isA ? 'disabled' : ''}>
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
  const { byPlayer, epByPlayer } = await loadAllProns();
  const players = cache.players;
  const scores = {};
  players.forEach(u => {
    let tot = 0, ex = 0, wi = 0;
    MATCHES.forEach(m => {
      const p = byPlayer[u]?.[m.id];
      const pp = p ? pts(m.id, p.h, p.a) : 0;
      if (pp === 3) { tot += 3; ex++; }
      else if (pp === 1) { tot += 1; wi++; }
    });
    let ep = 0;
    Object.entries(epByPlayer[u] || {}).forEach(([k, v]) => {
      if (cache.elim[k]?.winner === v) ep += 5;
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

// ── ELIMINATORIAS ─────────────────────────────────────────────────────────────

function renderElim(id, isA) {
  let html = '';
  ELIM_ROUNDS.forEach(r => {
    html += `<div class="elim-section"><div class="elim-title">${r.name}</div>`;
    r.matches.forEach(em => {
      const ed = cache.elim[em.id] || {};
      if (isA) {
        html += `<div class="elim-match">
          <span style="font-size:11px;color:var(--text3);width:72px;flex-shrink:0">${em.date}</span>
          <input type="text" placeholder="Local" id="ea${em.id}h" value="${ed.home||''}" style="flex:1;width:auto;font-size:12px">
          <span style="font-size:11px;color:var(--text3);padding:0 4px">vs</span>
          <input type="text" placeholder="Visitante" id="ea${em.id}a" value="${ed.away||''}" style="flex:1;width:auto;font-size:12px">
          <input type="text" placeholder="Ganador" id="ea${em.id}w" value="${ed.winner||''}" style="width:95px;font-size:12px;border-color:rgba(34,197,94,.4)">
        </div>`;
      } else {
        const home = ed.home || '?'; const away = ed.away || '?'; const ok = ed.home && ed.away;
        const myP = cache.elimProns[em.id] || '';
        const scored = ed.winner && myP === ed.winner;
        html += `<div class="elim-match">
          <span style="font-size:11px;color:var(--text3);width:72px;flex-shrink:0">${em.date}</span>
          <div class="elim-team"><span style="font-size:16px">${fl(home)}</span>${home}</div>
          <span style="font-size:11px;color:var(--text3)">vs</span>
          <div class="elim-team"><span style="font-size:16px">${fl(away)}</span>${away}</div>
          <input type="text" id="ep${em.id}" value="${myP}" placeholder="ganador" style="width:90px;font-size:12px;${scored?'border-color:rgba(34,197,94,.5)':''}" ${!ok?'disabled':''}>
          ${scored ? '<span class="badge bex">+5</span>' : ''}
        </div>`;
      }
    });
    html += '</div>';
  });
  if (isA) {
    html += `<button class="btn btn-primary btn-full" onclick="saveElimRes()">✓ Guardar eliminatorias</button><div class="ok" id="emsg"></div>`;
  } else {
    html += `<div style="font-size:12px;color:var(--text2);margin-bottom:8px">Acertar el ganador de cada llave = +5 puntos extra</div>
    <button class="btn btn-primary btn-full" onclick="saveEP()">💾 Guardar pronósticos eliminatorias</button>
    <div class="ok" id="epmsg"></div>`;
  }
  document.getElementById(id).innerHTML = html;
}

async function saveElimRes() {
  const toSave = [];
  ELIM_ROUNDS.forEach(r => r.matches.forEach(em => {
    const h = document.getElementById('ea'+em.id+'h');
    const a = document.getElementById('ea'+em.id+'a');
    const w = document.getElementById('ea'+em.id+'w');
    if (h && a) {
      toSave.push({ match_id: em.id, home: h.value, away: a.value, winner: w ? w.value : '' });
      cache.elim[em.id] = { home: h.value, away: a.value, winner: w ? w.value : '' };
    }
  }));
  if (toSave.length) await dbUpsert('elim_results', toSave);
  renderTbl('atblcont');
  const msg = document.getElementById('emsg');
  msg.textContent = '✓ Guardado';
  setTimeout(() => msg.textContent = '', 2500);
}

async function saveEP() {
  const toSave = [];
  ELIM_ROUNDS.forEach(r => r.matches.forEach(em => {
    const inp = document.getElementById('ep'+em.id);
    if (inp && inp.value) {
      toSave.push({ player_name: CU, match_id: em.id, winner: inp.value });
      cache.elimProns[em.id] = inp.value;
    }
  }));
  if (toSave.length) await dbUpsert('elim_predictions', toSave);
  const msg = document.getElementById('epmsg');
  msg.textContent = '✓ Guardado';
  setTimeout(() => msg.textContent = '', 2500);
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
