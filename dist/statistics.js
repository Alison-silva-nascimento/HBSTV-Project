(() => {
const H = window.HBSTV;
if (!H) return;
const esc = escapeHtml;
const norm = value => normalizeText(String(value ?? '')).replace(/[^a-z0-9]/g, '');
const distinct = records => [...new Map(records.map(record => [record.id, record])).values()];
const metrics = {
  players: {
    titles: ['Títulos', 'Conquistas das fichas de torneios e do Hall of Fame, contadas uma vez por edição.', 'event'],
    majors: ['Majors conquistados', 'Títulos de Major identificados nas fichas e no Hall of Fame.', 'event'],
    mvps: ['MVPs', 'Premiações por torneio. Na visão geral, inclui os totais históricos do Hall of Fame.', 'event'],
    evps: ['EVPs', 'Premiações EVP documentadas por edição.', 'event'],
    mvs: ['MVS · Melhor sniper', 'Premiações de melhor sniper registradas nas fichas dos torneios.', 'event'],
    awards: ['Awards individuais', 'Categorias de premiação individual vencidas por temporada.', 'year'],
    top20: ['Aparições no Top 20', 'Temporadas em que o jogador aparece no Top 20 anual.', 'year'],
    teams: ['Aparições no TOP 5 Times do Ano', 'Uma aparição por equipe do Top 5 em que o jogador atuou na temporada.', 'year'],
    records: ['Recordes e feitos', 'Feitos distintos listados na seção Recordes do Hall of Fame.', 'career']
  },
  teams: {
    trophies: ['Troféus por organizadora', 'Títulos por equipe nas fichas de campeonatos. Selecione uma organizadora para ver o ranking dela.', 'event'],
    majors: ['Majors conquistados', 'Títulos de Major documentados nas fichas de campeonatos.', 'event'],
    top5: ['Aparições no Top 5 anual', 'Temporadas em que a equipe ficou entre as cinco primeiras.', 'year'],
    first: ['Vezes como time do ano', 'Temporadas em que a equipe liderou o ranking anual.', 'year']
  }
};
function playerRecords(text = '') {
  const lines = text.normalize('NFKC').split(/\r?\n/);
  const start = lines.findIndex(line => norm(line) === 'recordes');
  if (start < 0) return [];
  const records = new Map();
  for (const line of lines.slice(start + 1)) {
    if (/^(premiacoes|teams|equipes|principaistitulos)/.test(norm(line))) break;
    const entry = line.match(/^\s*[-–—•]\s*(.+)/)?.[1];
    if (entry && norm(entry) && !records.has(norm(entry))) records.set(norm(entry), entry.trim());
  }
  return [...records.values()];
}
function showPlayerRecords(id) {
  const player = playerRows.find(row => row.id === id);
  if (!player?.records.length) return;
  const entries = player.records.map(record => `<li>${esc(record)}</li>`).join('');
  document.querySelector('#detail').classList.remove('profile-dialog', 'registered-player-dialog', 'image-dialog');
  showDetail(`<section class="stats-record-dialog">
    <span class="eyebrow">HALL OF FAME · RECORDES E FEITOS</span>
    <h2>${esc(player.name)}</h2>
    <p>${player.records.length} ${player.records.length === 1 ? 'feito registrado' : 'feitos registrados'}</p>
    <ol>${entries}</ol>
    <a class="hub-button" href="${window.HBSTV.playerHref(player.id)}" data-entity-close>Ver perfil completo ↗</a>
  </section>`);
}
const hall = new Map(players.map(player => [H.key(player.name), player]));
const playerRows = H.db.players.map(player => ({
  ...player,
  hall: hall.get(player.id),
  records: playerRecords(hall.get(player.id)?.text),
  allTitles: window.getPlayerTitleRecords(player),
  search: [player.name, ...player.aliases, ...player.realNames].join(' ')
}));
const teamRows = H.db.teams.map(team => ({
  ...team,
  name: team.id === 'teaminfinity' ? 'FY / Team Infinity' : team.name,
  trophies: H.db.events.filter(event => event.winners.includes(team.id)),
  search: [team.name, ...team.aliases].join(' ')
}));
let category = 'players';
let metric = 'titles';
let year = '';
let organizer = '';
let query = '';
let page = 0;
const pageSize = 5;
const screen = document.createElement('section');
screen.id = 'statistics-screen';
screen.hidden = true;
document.querySelector('.content').append(screen);

function matches(record, useOrganizer = true) {
  return (!year || record.year === Number(year)) &&
    (!useOrganizer || !organizer || (record.organizer || H.event(record.id)?.organizer) === organizer);
}

function playerValue(player) {
  switch (metric) {
    case 'titles': return player.allTitles.filter(record => matches(record)).length;
    case 'majors': return player.allTitles.filter(record =>
      (record.major || H.event(record.id)?.major || /[Ⓜ🅼]/u.test(record.title)) && matches(record)).length;
    case 'mvps': {
      const count = distinct(player.mvps).filter(record => matches(record)).length;
      return year || organizer ? count : Math.max(count, Number(player.hall?.mvps) || 0);
    }
    case 'evps': return distinct(player.evps).filter(record => matches(record)).length;
    case 'mvs': return distinct(player.mvs || []).filter(record => matches(record)).length;
    case 'awards': return distinct(player.awards).filter(record => matches(record, false)).length;
    case 'top20': return new Set(player.rankings.filter(record => matches(record, false)).map(record => record.year)).size;
    case 'teams': return (player.topFiveTeams || []).filter(record => matches(record, false)).length;
    case 'records': return player.records.length;
  }
}

function teamRecords(team) {
  if (metric === 'trophies' || metric === 'majors') {
    return team.trophies.filter(event => (metric === 'trophies' || event.major) && matches(event));
  }
  const maxRank = metric === 'first' ? 1 : 5;
  const placements = team.rankings.filter(record =>
    record.rank >= 1 && record.rank <= maxRank && matches(record, false));
  return [...new Map(placements.map(record => [record.year, record])).values()];
}

function ranking() {
  const rows = category === 'players' ? playerRows : teamRows;
  let rank = 0;
  let previous = -1;
  return rows.map(row => {
    if (category === 'players') return {row, value: playerValue(row), years: []};
    const years = teamRecords(row).map(record => record.year).sort((a,b) => b-a);
    return {row, value: years.length, years};
  })
    .filter(entry => entry.value > 0)
    .sort((a,b) => b.value-a.value || (b.years[0] || 0)-(a.years[0] || 0) || a.row.name.localeCompare(b.row.name,'pt-BR'))
    .map((entry, index) => {
      if (entry.value !== previous) rank = index + 1;
      previous = entry.value;
      return {...entry, rank};
    })
    .filter(entry => norm(entry.row.search).includes(norm(query)));
}

function rowDetail(row, years) {
  if (category === 'teams') return [organizer, ...new Set(years)].filter(Boolean).join(' · ');
  if (metric === 'records') return 'Hall of Fame';
  if (metric === 'awards') return 'Premiações individuais';
  if (metric === 'teams') return (row.topFiveTeams || []).filter(record => matches(record, false))
    .map(record => record.year + ' · #' + record.rank + ' ' + record.name).join(' / ');
  return 'Registros do acervo';
}

function rowHtml({row, value, rank, years}) {
  const icon = category === 'teams' && row.logo
    ? `<span class="club-logo stats-team-logo"><img src="${esc(row.logo.src)}" alt="" style="width:${100/row.logo.crop.w}%;height:${100/row.logo.crop.h}%;left:${-100*row.logo.crop.x/row.logo.crop.w}%;top:${-100*row.logo.crop.y/row.logo.crop.h}%"></span>`
    : category === 'teams' ? `<span class="stats-team-initials" aria-hidden="true">${esc(row.name.slice(0,2))}</span>`
    : '<span class="stats-player-avatar" aria-hidden="true"></span>';
  const contents = `<span class="stats-position">${rank}</span>${icon}<span class="stats-player-name"><strong>${esc(row.name)}</strong><small>${esc(rowDetail(row, years))}</small></span><b>${value}</b>`;
  if (metric === 'records') return `<button class="stats-rank-row" data-stats-record-player="${esc(row.id)}" aria-haspopup="dialog">${contents}</button>`;
  const href = category === 'players' ? H.playerHref(row.id) : '#time/' + encodeURIComponent(row.id);
  return `<a class="stats-rank-row" href="${href}">${contents}</a>`;
}

function results() {
  const list = ranking();
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  page = Math.min(page, pages - 1);
  screen.querySelector('#stats-count').textContent = list.length + (category === 'players' ? ' jogadores' : ' equipes');
  screen.querySelector('#stats-ranking').innerHTML = list.slice(page * pageSize, (page + 1) * pageSize)
    .map(rowHtml).join('') || '<p class="entity-empty">Nenhum registro para estes filtros.</p>';
  screen.querySelector('#stats-page-label').textContent = (page + 1) + ' de ' + pages;
  screen.querySelector('#stats-prev').disabled = page === 0;
  screen.querySelector('#stats-next').disabled = page >= pages - 1;
}

const years = [...new Set([
  ...H.db.events.map(event => event.year),
  ...playerRows.flatMap(player => [...player.allTitles, ...player.awards, ...player.rankings].map(record => record.year)),
  ...teamRows.flatMap(team => team.rankings.map(record => record.year))
])].sort((a,b) => b-a);
const organizers = [...new Set([
  ...H.db.events.map(event => event.organizer),
  ...playerRows.flatMap(player => player.allTitles.map(record => record.organizer))
].filter(Boolean))].sort((a,b) => a.localeCompare(b,'pt-BR'));

function render() {
  const [label, description, scope] = metrics[category][metric];
  if (scope !== 'event') organizer = '';
  if (scope === 'career') year = '';
  screen.innerHTML = `<header class="stats-header"><h2>Estatísticas</h2></header>
    <nav class="stats-category" aria-label="Categoria das estatísticas">
      <button data-stats-category="players" aria-pressed="${category === 'players'}">Jogadores</button>
      <button data-stats-category="teams" aria-pressed="${category === 'teams'}">Equipes</button>
    </nav>
    <div class="stats-scope stats-dashboard-filters">
      <label>Métrica<select id="stats-metric">${Object.entries(metrics[category]).map(([key, [name]]) =>
        `<option value="${key}" ${metric === key ? 'selected' : ''}>${esc(name)}</option>`).join('')}</select></label>
      ${scope === 'career' ? '' : `<label>Temporada<select id="stats-year"><option value="">Todas</option>${years.map(y =>
        `<option ${year === String(y) ? 'selected' : ''}>${y}</option>`).join('')}</select></label>`}
      ${scope === 'event' ? `<label>Organizadora<select id="stats-org"><option value="">Todas</option>${organizers.map(org =>
        `<option ${organizer === org ? 'selected' : ''}>${esc(org)}</option>`).join('')}</select></label>` : ''}
      <label>Buscar ${category === 'players' ? 'jogador' : 'equipe'}<input id="stats-search" class="entity-field" type="search" value="${esc(query)}"></label>
    </div>
    <div class="stats-ranking-head"><h3>${esc(label)}</h3><span id="stats-count" aria-live="polite"></span></div>
    <p class="stats-description">${esc(description)}</p>
    <nav class="stats-pagination" aria-label="Páginas do ranking">
      <button id="stats-prev">← Anterior</button><span id="stats-page-label" aria-live="polite"></span><button id="stats-next">Próxima →</button>
    </nav>
    <div id="stats-ranking" class="stats-ranking"></div>`;
  results();
}
window.renderStatisticsRoute = () => {
  screen.hidden = location.hash !== '#estatisticas';
  if (screen.hidden) return false;
  render();
  document.title = 'Estatísticas — HBSTV.ORG';
  return true;
};
document.querySelector('.side-nav').insertAdjacentHTML('beforeend','<a href="#estatisticas">▥ <span>Estatísticas</span><b>00</b></a>');
screen.addEventListener('click', event => {
  const record = event.target.closest('[data-stats-record-player]');
  if (record) return showPlayerRecords(record.dataset.statsRecordPlayer);
  const tab = event.target.closest('[data-stats-category]');
  if (tab && tab.dataset.statsCategory !== category) {
    category = tab.dataset.statsCategory;
    metric = category === 'players' ? 'titles' : 'trophies';
    query = '';
    page = 0;
    render();
    screen.querySelector('[aria-pressed="true"]').focus();
  }
  if (event.target.id === 'stats-prev' || event.target.id === 'stats-next') {
    page += event.target.id === 'stats-next' ? 1 : -1;
    results();
    if (event.target.disabled) screen.querySelector(event.target.id === 'stats-next' ? '#stats-prev' : '#stats-next').focus();
  }
});
screen.addEventListener('input', event => {
  if (event.target.id !== 'stats-search') return;
  query = event.target.value;
  page = 0;
  results();
});
screen.addEventListener('change', event => {
  const {id, value} = event.target;
  if (id === 'stats-metric') metric = value;
  else if (id === 'stats-year') year = value;
  else if (id === 'stats-org') organizer = value;
  else return;
  page = 0;
  render();
  screen.querySelector('#' + id)?.focus();
});
})();
