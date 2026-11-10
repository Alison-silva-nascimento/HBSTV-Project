const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const c={window:{}};for(const f of ['archive-data.js','team-profiles-data.js','general-players-data.js'])vm.runInNewContext(fs.readFileSync('dist/'+f,'utf8'),c);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const index=c.window.HBSTV_PLAYER_INDEX,key=s=>norm(index.aliases[norm(s)]||s).replace(/0/g,'o');
const names={};for(const page of c.window.RANKS_ARCHIVE.pages.filter(p=>/^hall-of-fame/.test(p.slug)))for(const sec of page.sections){const full=sec.blocks.find(b=>b.level===4)?.text||'',name=full.match(/(?:´´|“|”|"|''|‘)([^´“”"‘]+?)(?:´´|“|”|"|''|‘)/)?.[1]?.trim();if(name)names[key(name)]=name;}
for(const p of index.players){p.name=names[p.id]||p.name;if(!p.aliases.includes(p.name))p.aliases.push(p.name);}
const events=new Map(),clean=s=>s.replace(/\s*\[TIER[^\]]*\]/gi,'').replace(/\s*\|\s*/g,' | ').trim(),org=s=>{const o=clean(s).split('|')[0].trim();return o===clean(s)?(o.match(/^(RANK S|GAMEZONE|SUVOH|MAWARE|PREMIER|[A-Z0-9]{2,5})\b/i)?.[1]||'Não informada'):o;};
function event(r){if(!events.has(r.id))events.set(r.id,{id:r.id,title:clean(r.title),year:r.year,organizer:org(r.title),major:!!r.major,winners:[],roster:[],mvps:[],evps:[],sources:[],notes:[],images:[]});const e=events.get(r.id);e.major||=!!r.major;if(r.source&&!e.sources.includes(r.source))e.sources.push(r.source);if(r.sourceNote&&!e.notes.includes(r.sourceNote))e.notes.push(r.sourceNote);for(const b of r.blocks||[])if(b.type==='image'&&!e.images.includes(b.src))e.images.push(b.src);if(r.rosterSourceImage&&!e.images.includes(r.rosterSourceImage))e.images.push(r.rosterSourceImage);return e;}
for(const t of c.window.HBSTV_TEAMS)for(const r of t.titles){const e=event(r);if(!e.winners.includes(t.id))e.winners.push(t.id);for(const n of r.roster)if(!e.roster.includes(key(n)))e.roster.push(key(n));}
for(const p of index.players)for(const field of ['mvps','evps'])for(const r of p[field]){const e=event(r);if(!e[field].includes(p.id))e[field].push(p.id);}
const majorNames=JSON.parse(fs.readFileSync('research/major-winning-rosters.json','utf8'));for(const e of events.values()){const major=majorNames.find(r=>e.images.includes(r.sourceImage));if(major)e.title=clean(major.title).replace(/\s*·\s*/,' | ');e.organizer=({GZ:'GAMEZONE','BS:G':'BSG','?':'Não informada'})[e.organizer]||e.organizer;e.title=e.title.replace(/\[\s*TIER[^\]]*\]/ig,'').trim();if(!e.title.includes('|')&&e.organizer!=='Não informada')e.title=e.title.replace(/^(RANK S|GSC|GSE|LCB|PNL|WHL|ESC|TSL|SUVOH|ACE|MAWARE|GZ)\s+/,'$1 | ');}
const patchPath='research/registry-corrections.json';if(fs.existsSync(patchPath)){const patch=JSON.parse(fs.readFileSync(patchPath,'utf8'));for(const alias of patch.aliases)index.aliases[norm(alias.alias)]=index.players.find(p=>p.id===alias.playerId).name;for(const edit of patch.events){const prior=events.get(edit.id),e={...prior,...edit,images:(edit.images||[]).filter(src=>/^assets\/archive\/[a-zA-Z0-9._-]+$/.test(src)),sources:['owner-confirmed']};events.set(e.id,e);for(const p of index.players){for(const f of ['titles','mvps','evps'])p[f]=p[f].filter(r=>r.id!==e.id);if(e.roster.includes(p.id))for(const teamId of e.winners){const t=c.window.HBSTV_TEAMS.find(t=>t.id===teamId);p.titles.push({id:e.id,title:e.title,year:e.year,teamId,team:t.name,major:e.major,source:'owner-confirmed'});}for(const f of ['mvps','evps'])if(e[f].includes(p.id))p[f].push({id:e.id,title:e.title,year:e.year,source:'owner-confirmed',major:e.major});}for(const t of c.window.HBSTV_TEAMS){t.titles=t.titles.filter(r=>r.id!==e.id);if(e.winners.includes(t.id)){t.titles.push({id:e.id,title:e.title,year:e.year,major:e.major,roster:e.roster.map(id=>index.players.find(p=>p.id===id).name),source:'owner-confirmed',sourceNote:e.notes.join(' '),manual:true});for(const id of e.roster){let m=t.members.find(m=>m.id===id);if(!m){m={id,name:index.players.find(p=>p.id===id).name,years:[],sources:[]};t.members.push(m);}if(!m.years.includes(e.year))m.years.push(e.year);let membership=index.players.find(p=>p.id===id).teams.find(m=>m.id===t.id);if(!membership){membership={id:t.id,name:t.name,years:[]};index.players.find(p=>p.id===id).teams.push(membership);}if(!membership.years.includes(e.year))membership.years.push(e.year);}}}}}

const confirmedTournaments = JSON.parse(fs.readFileSync('research/confirmed-tournament-awards.json', 'utf8'));
for (const row of confirmedTournaments) {
  const existing = events.get(row.id);
  const e = existing || event({ id: row.id, title: row.title, year: row.year });
  if (row.title) e.title = row.title;
  if (!e.sources.includes('owner-confirmed')) e.sources.push('owner-confirmed');
  e.notes.push('Premiações individuais confirmadas pelo responsável pelo site.');
  for (const [field, names] of Object.entries({mvps: row.mvp, evps: row.evps, mvs: row.mvs || []})) {
    e[field] = [...new Set(names.map(key))];
    for (const player of index.players) {
      if (!player[field] && !e[field].includes(player.id)) continue;
      player[field] = (player[field] || []).filter(record => record.id !== e.id);
      if (e[field].includes(player.id)) player[field].push({
        id: e.id, title: e.title, year: e.year, major: e.major, source: 'owner-confirmed'
      });
    }
  }
  for (const t of c.window.HBSTV_TEAMS) for (const title of t.titles) {
    if (title.id === e.id) title.title = e.title;
  }
}
const annualCtx={window:{}};vm.runInNewContext(fs.readFileSync('dist/team-years-data.js','utf8'),annualCtx);const annual=annualCtx.window.RANKS_TEAM_YEARS;
for(const e of events.values()){if(e.roster.length||!e.winners.length)continue;const candidates=[];for(const tid of e.winners){const t=c.window.HBSTV_TEAMS.find(t=>t.id===tid);if(!t)continue;const labels=new Set([t.name,...t.aliases,...t.searchAliases].map(norm));const match=x=>labels.has(norm(x.name));const champion=annual.champions.find(x=>x.year===e.year&&match(x)),ranked=annual.rankings.find(x=>x.year===e.year)?.teams.find(match);const row=champion?.roster.length?champion:ranked?.roster.length?ranked:null;const ids=row?row.roster.map(n=>key(n.match(/[“"]([^”"]+)[”"]/)?.[1]||n)):t.members.filter(m=>m.years.includes(e.year)).map(m=>key(m.name));for(const id of ids)if(index.players.some(p=>p.id===id)&&!candidates.includes(id))candidates.push(id);}if(candidates.length)e.rosterReference={players:candidates,year:e.year,source:'Elenco anual da equipe em '+e.year,kind:'annual-team'};}
for (const row of confirmedTournaments.filter(row => row.confirmedRoster || row.excludedRoster)) {
  const event = events.get(row.id);
  const excluded = new Set((row.excludedRoster || []).map(key));
  const confirmed = (row.confirmedRoster || []).map(key);
  event.roster = event.roster.filter(id => !excluded.has(id));
  if (event.rosterReference) {
    event.rosterReference.players = [...new Set([...event.rosterReference.players, ...confirmed])]
      .filter(id => !excluded.has(id));
  }
  const team = c.window.HBSTV_TEAMS.find(team => team.id === event.winners[0]);
  for (const player of index.players) {
    if (excluded.has(player.id)) player.titles = player.titles.filter(r => r.id !== event.id);
    if (!confirmed.includes(player.id)) continue;
    if (!player.titles.some(r => r.id === event.id)) player.titles.push({
      id: event.id, title: event.title, year: event.year, teamId: team.id, team: team.name,
      major: event.major, source: 'owner-confirmed'
    });
    let membership = player.teams.find(t => t.id === team.id);
    if (!membership) {
      membership = {id: team.id, name: team.name, years: []};
      player.teams.push(membership);
    }
    if (!membership.years.includes(event.year)) membership.years.push(event.year);
    let member = team.members.find(p => p.id === player.id);
    if (!member) {
      member = {id: player.id, name: player.name, years: [], sources: []};
      team.members.push(member);
    }
    if (!member.years.includes(event.year)) member.years.push(event.year);
    if (!member.sources.includes('owner-confirmed')) member.sources.push('owner-confirmed');
  }
}
require('./reconcile-historical-titles.cjs')({ archive: c.window.RANKS_ARCHIVE, players: index.players, events, key });
const nescau = index.players.find(player => player.id === 'nescau');
nescau.hallOfFame = true;
nescau.seasonTitles = [...events.values()]
  .filter(e => e.year === 2020 && e.sources.includes('top-1-teams-of-years') && e.winners.includes('pentaesports') && e.rosterReference?.players.includes(nescau.id))
  .map(e => ({id: e.id, title: e.title, year: e.year, team: c.window.HBSTV_TEAMS.find(team => team.id === 'pentaesports').name}));
for (const p of index.players) for (const field of ['titles', 'mvps', 'evps', 'mvs']) {
  for (const r of p[field] || []) r.title = events.get(r.id)?.title || r.title;
  p[field]?.sort((a,b) => b.year - a.year || a.title.localeCompare(b.title));
}
const list=[...events.values()].sort((a,b)=>b.year-a.year||a.title.localeCompare(b.title));for(const e of list)for(const id of [...e.roster,...e.mvps,...e.evps,...(e.mvs||[])])assert(index.players.some(p=>p.id===id),'Unresolved player '+id);
const data={schemaVersion:1,updated:'2026-11-03',players:index.players,aliases:index.aliases,events:list,teams:c.window.HBSTV_TEAMS.map(t=>({...t,aliases:[...new Set([...t.aliases,...t.searchAliases])]}))};
assert.equal(new Set(data.players.map(p=>p.id)).size,data.players.length);assert.equal(new Set(list.map(e=>e.id)).size,list.length);
fs.writeFileSync('dist/database-data.js','window.HBSTV_DATABASE = '+JSON.stringify(data,null,2)+';\n');console.log(JSON.stringify({canonicalPlayers:data.players.length,teams:data.teams.length,events:list.length}));
