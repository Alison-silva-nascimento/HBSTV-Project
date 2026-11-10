(()=>{const db=window.HBSTV_DATABASE;if(!db)return;const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');const key=s=>norm(db.aliases[norm(s)]||s).replace(/0/g,'o');
const people=new Map(db.players.map(p=>[p.id,p])),events=new Map(db.events.map(e=>[e.id,e]));
window.HBSTV={db,key,person:s=>people.get(key(s)),event:id=>events.get(id),playerHref:s=>'#jogador/'+encodeURIComponent(key(s)),eventHref:id=>'#campeonato/'+encodeURIComponent(id),name:s=>people.get(key(s))?.name||s};
if (typeof players !== 'undefined') for (const p of db.players.filter(p => p.hallOfFame)) {
  if (players.some(h => key(h.name) === p.id)) continue;
  const full = p.name;
  players.push({name:p.name, full, initial:p.name[0], label:'HALL OF FAME', text:'',
    registeredOnly:true, blocks:[{type:'heading',level:4,text:full}]});
}
window.HBSTV_PLAYER_INDEX.players=db.players;window.HBSTV_PLAYER_INDEX.aliases=db.aliases;window.HBSTV_TEAMS=db.teams;
window.renderPlayerAnnualFacts=rows=>rows.length?`<div class="player-annual-facts"><dt>Top 20 por ano</dt><dd><span class="player-annual-count">${rows.length} ${rows.length===1?'edição':'edições'}</span><span class="player-annual-results">${[...rows].sort((a,b)=>b.year-a.year).map(r=>`<span class="player-annual-result" aria-label="Posição ${r.rank} em ${r.year}"><b>#${r.rank}</b> <small>${r.year}</small></span>`).join('')}</span></dd></div>`:'';
})();
