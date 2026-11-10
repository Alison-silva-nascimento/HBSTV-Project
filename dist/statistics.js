(() => {
const esc=escapeHtml,index=window.HBSTV_PLAYER_INDEX;if(!index)return;
const norm=s=>normalizeText(String(s)).replace(/[^a-z0-9]/g,''),key=s=>norm(index.aliases[norm(s)]||s).replace(/0/g,'o');
const fields={titles:{label:'Títulos',icon:'♜',description:'Conquistas identificadas nas escalações campeãs e nas listas de títulos do Hall of Fame, sem contar duas vezes o mesmo torneio.'},mvps:{label:'MVPs',icon:'★',description:'Totais do Hall of Fame, quando informados, e premiações individuais documentadas nos torneios.'},evps:{label:'EVPs',icon:'✦',description:'Premiações EVP identificadas por campeonato. Registros repetidos do mesmo evento são contados uma vez.'},top20:{label:'Aparições no Top 20',icon:'#',description:'Quantidade de temporadas em que o jogador aparece no Top 20: 2017, 2018, 2019, 2020, 2021, 2023, 2024 e 2025.'},teams:{label:'Aparições no TOP 5 Times do Ano',icon:'◈',description:'Cada equipe do Top 5 em que o jogador atuou na temporada vale uma aparição. A contagem cruza os rankings anuais com os vínculos documentados dos jogadores.'},events:{label:'Campeonatos registrados',icon:'▥',description:'Torneios distintos com título individualizado, escalação campeã ou prêmio documentado.'}};
function titleRecords(player) {
  return [...new Map([...(player.historicalTitles || []), ...player.titles].map(r => [r.id, r])).values()];
}
const roster=new Map(index.players.map(p=>[p.id,{...p,hof:players.find(h=>key(h.name)===p.id)}]));for(const h of players)if(!roster.has(key(h.name)))roster.set(key(h.name),{id:key(h.name),name:h.name,hof:h,titles:[],mvps:[],evps:[],rankings:[],teams:[]});
const rows=[...roster.values()].map(p=>{
const h = p.hof;
const topFiveTeams = p.topFiveTeams || [];
const titles = titleRecords(p);
const awards = [...p.mvps, ...p.evps, ...(p.mvs || [])];
const events = new Set([...titles, ...awards].map(r => r.id));
return {
  id: p.id, name: p.name, hof: h, topFiveTeams,
  search: [p.name, ...(p.aliases || []), ...(p.realNames || []), h?.full || ''].join(' '),
  values: {
    titles: titles.length, mvps: Math.max(Number(h?.mvps) || 0, p.mvps.length),
    evps: new Set(p.evps.map(r => r.id)).size,
    top20: new Set(p.rankings.map(r => r.year)).size, teams: topFiveTeams.length, events: events.size
  },
  source: h ? 'Hall of Fame e fichas de torneios' : 'Registros dos torneios'
};
});
window.getStatisticsRows=()=>rows;
const screen=document.createElement('section');screen.id='statistics-screen';screen.hidden=true;document.querySelector('.content').append(screen);let metric='titles',query='',limit=20,scopeYear='',scopeOrg='';
function scopedRows() {
  if (!scopeYear && !scopeOrg) return rows;
  const accept = r => (!scopeYear || r.year === Number(scopeYear)) &&
    (!scopeOrg || (r.organizer || window.HBSTV.event(r.id)?.organizer) === scopeOrg);
  return rows.map(row => {
    const player = roster.get(row.id);
    const titles = titleRecords(player).filter(accept);
    const mvps = player.mvps.filter(accept);
    const evps = player.evps.filter(accept);
    const events = new Set([...titles, ...mvps, ...evps, ...(player.mvs || []).filter(accept)].map(r => r.id));
    const topFiveTeams = scopeOrg ? [] : row.topFiveTeams.filter(r => r.year === Number(scopeYear));
    return {...row, topFiveTeams, source: 'Registros filtrados', values: {
      titles: titles.length, mvps: new Set(mvps.map(r => r.id)).size,
      evps: new Set(evps.map(r => r.id)).size,
      top20: scopeOrg ? 0 : new Set(player.rankings.filter(r => r.year === Number(scopeYear)).map(r => r.year)).size,
      teams: topFiveTeams.length, events: events.size
    }};
  });
}
const scopes=()=>`<div class="stats-scope"><label>Temporada<select id="stats-year"><option value="">Toda a carreira</option>${[...new Set([...index.rankingYears,...window.HBSTV.db.events.map(e=>e.year),...index.players.flatMap(p=>(p.historicalTitles||[]).map(t=>t.year))])].sort((a,b)=>b-a).map(y=>`<option ${scopeYear===String(y)?'selected':''}>${y}</option>`).join('')}</select></label><label>Organizadora<select id="stats-org"><option value="">Todas</option>${[...new Set([...window.HBSTV.db.events.map(e=>e.organizer),...index.players.flatMap(p=>(p.historicalTitles||[]).map(t=>t.organizer))])].sort().map(o=>`<option ${scopeOrg===o?'selected':''}>${esc(o)}</option>`).join('')}</select></label></div><p class="stats-scope-info">${scopeYear||scopeOrg?'Filtro ativo: títulos e premiações identificados por edição. Totais gerais de MVP do Hall of Fame só aparecem na visão de carreira.':'Visão histórica: títulos e torneios identificados por edição. Os MVPs incluem o total histórico quando ele é maior que o número de fichas.'}${scopeOrg?' Os rankings anuais são consultados sem filtro por organizadora.':''}</p>`;
function ordered(){let previous=null,rank=0;return [...scopedRows()].filter(p=>p.values[metric]>0).sort((a,b)=>b.values[metric]-a.values[metric]||a.name.localeCompare(b.name,'pt-BR')).map((p,i)=>{if(p.values[metric]!==previous)rank=i+1;previous=p.values[metric];return {...p,rank};});}
const action=p=>p.hof?`data-player="${players.indexOf(p.hof)}"`:`data-entity-player="${p.id}"`;
const value=p=>p.values[metric];
function results(){const all=ordered(),list=all.filter(p=>norm(p.search).includes(norm(query))),visible=list.slice(0,limit===0?list.length:limit),top=list.slice(0,5),max=top[0]?.values[metric]||1;document.querySelector('#stats-ranking-title').textContent=fields[metric].label;document.querySelector('#stats-description').textContent=fields[metric].description;document.querySelector('#stats-count').textContent=list.length+' JOGADORES';document.querySelectorAll('[data-stats-metric]').forEach(b=>{const active=b.dataset.statsMetric===metric;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
document.querySelector('#stats-chart').innerHTML=top.length?`<h3>Os líderes</h3>${top.map(p=>`<button class="stats-bar-row" ${action(p)} aria-label="${esc(p.name)}, ${esc(value(p))} ${esc(fields[metric].label)}"><span>${esc(p.name)}</span><b>${esc(value(p))}</b><i><em style="width:${p.values[metric]/max*100}%"></em></i></button>`).join('')}`:'<p class="entity-empty">Nenhum jogador corresponde à busca.</p>';
document.querySelector('#stats-ranking').innerHTML=visible.length?visible.map(p=>`<button class="stats-rank-row" ${action(p)}><span class="stats-position">${p.rank}</span><span class="stats-player-avatar" aria-hidden="true"></span><span class="stats-player-name"><strong>${esc(p.name)}</strong><small>${metric==='teams'?esc(p.topFiveTeams.map(r=>r.year+' · #'+r.rank+' '+r.name).join(' / ')):metric==='evps'||metric==='top20'?'Torneios e rankings':p.source}</small></span><b>${esc(value(p))}</b></button>`).join(''):'<p class="entity-empty">Nenhum registro para estes filtros.</p>';}
function render(){const scoped = scopedRows();const leaders=Object.entries(fields).map(([m,info])=>{
  const highest = Math.max(0, ...scoped.map(row => row.values[m]));
  const leaders = scoped.filter(row => highest > 0 && row.values[m] === highest);
  const label = leaders.map(row => row.name).sort((a,b) => a.localeCompare(b,'pt-BR')).join(' · ');return `<button data-stats-metric="${m}" class="stats-metric-card" aria-pressed="${m===metric}" ${(m==='top20'||m==='teams')&&scopeOrg?'disabled':''}><span class="stats-card-label"><i aria-hidden="true">${info.icon}</i>${info.label}</span><b>${(m==='top20'||m==='teams')&&scopeOrg?'—':highest||'—'}</b><strong>${(m==='top20'||m==='teams')&&scopeOrg?'Retire o filtro de organizadora':highest===0?'Sem registro neste filtro':esc(label)}</strong><small>${leaders.length>1?'LIDERANÇA COMPARTILHADA':scopeYear||scopeOrg?'LÍDER DA SELEÇÃO':'LÍDER HISTÓRICO'}</small></button>`;}).join('');screen.innerHTML=`<header class="stats-header"><span class="eyebrow">HBSTV · HISTÓRICO COMPETITIVO</span><h2>Estatísticas<span>.</span></h2><p>Os números de quem construiu o competitivo.</p><div><b>${rows.length}</b> jogadores na base <span>·</span> <b>${window.HBSTV_TEAMS.length}</b> equipes registradas</div></header>${scopes()}<div class="stats-overview" aria-label="Selecionar ranking">${leaders}</div><div class="stats-ranking-head"><div><span class="eyebrow">RANKING HISTÓRICO</span><h3 id="stats-ranking-title"></h3></div><span id="stats-count"></span></div><p id="stats-description" class="stats-description"></p><div class="stats-controls"><label>Buscar jogador<input id="stats-search" class="entity-field" type="search" placeholder="Nome ou nick…" value="${esc(query)}"></label><label>Mostrar<select id="stats-limit"><option value="10" ${limit===10?'selected':''}>Top 10</option><option value="20" ${limit===20?'selected':''}>Top 20</option><option value="50" ${limit===50?'selected':''}>Top 50</option><option value="0" ${limit===0?'selected':''}>Todos</option></select></label></div><div class="stats-board"><aside id="stats-chart" class="stats-chart"></aside><div id="stats-ranking" class="stats-ranking"></div></div><p class="stats-footnote">Dados históricos disponíveis no site. As estatísticas não representam necessariamente toda a carreira. Empates compartilham a posição. Clique em um jogador para conferir o perfil e os registros.</p>`;results();}
window.renderStatisticsRoute=()=>{screen.hidden=true;if(location.hash!=='#estatisticas')return false;render();screen.hidden=false;document.title='Estatísticas — HBSTV.ORG';return true;};
document.querySelector('.side-nav').insertAdjacentHTML('beforeend','<a href="#estatisticas">▥ <span>Estatísticas</span><b>00</b></a>');
document.addEventListener('click',e=>{const b=e.target.closest('[data-stats-metric]');if(b){metric=b.dataset.statsMetric;results();}});document.addEventListener('input',e=>{if(e.target.id==='stats-search'){query=e.target.value;results();}});document.addEventListener('change',e=>{if(e.target.id==='stats-year'){scopeYear=e.target.value;render();}if(e.target.id==='stats-org'){scopeOrg=e.target.value;if(scopeOrg&&['top20','teams'].includes(metric))metric='titles';render();}if(e.target.id==='stats-limit'){limit=Number(e.target.value);results();}});
})();
