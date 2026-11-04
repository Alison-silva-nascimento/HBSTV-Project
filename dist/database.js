(()=>{const db=window.HBSTV_DATABASE;if(!db)return;const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');const key=s=>norm(db.aliases[norm(s)]||s).replace(/0/g,'o');
const people=new Map(db.players.map(p=>[p.id,p])),events=new Map(db.events.map(e=>[e.id,e]));
window.HBSTV={db,key,person:s=>people.get(key(s)),event:id=>events.get(id),playerHref:s=>'#jogador/'+encodeURIComponent(key(s)),eventHref:id=>'#campeonato/'+encodeURIComponent(id),name:s=>people.get(key(s))?.name||s};
window.HBSTV_PLAYER_INDEX.players=db.players;window.HBSTV_PLAYER_INDEX.aliases=db.aliases;window.HBSTV_TEAMS=db.teams;
})();
