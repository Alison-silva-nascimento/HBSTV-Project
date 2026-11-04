const fs=require('node:fs');let f='dist/general-players.js',s=fs.readFileSync(f,'utf8');s=s.replace('<p class="hof-real-name">Histórico nos registros competitivos</p>','<p class="hof-real-name">${esc(p.realNames.at(-1)||\'Histórico nos registros competitivos\')}</p>');fs.writeFileSync(f,s);
f='dist/team-years.js';s=fs.readFileSync(f,'utf8');const start=s.indexOf('function player(label,country){'),end=s.indexOf('\nconst isMajor=',start);if(start<0||end<0)throw Error('Player renderer not found');const renderer=`function player(label,country){
const flag=country?\`<i class="team-country" aria-label="\${({BR:'Brasil',LT:'Lituânia',DE:'Alemanha',ES:'Espanha',FR:'França',PL:'Polônia'})[country]||country}">\${country}</i>\`:'';
const nick=label.match(/“([^”]+)”/)?.[1]||label,norm=s=>normalizeText(s).replace(/0/g,'o').replace(/[^a-z0-9]/g,''),aliases={tabsen:'tabsenn',conjure:'c0njure',ryota:'ry0ta',...(window.HBSTV_PLAYER_INDEX?.aliases||{})};
const displayNick=aliases[norm(nick)]||nick,target=players.find(p=>norm(p.name)===norm(displayNick)),id=window.getRegisteredPlayerId?.(displayNick),clickable=target||id;
const attr=target?\`data-player="\${players.indexOf(target)}"\`:id?\`data-entity-player="\${id}"\`:'';
return \`<\${clickable?'button':'div'} class="team-player" \${attr}><span>\${esc(displayNick.slice(0,2))}</span><b>\${flag}\${esc(displayNick)}</b>\${label!==nick?\`<small>\${esc(label.split('“')[0].trim())}</small>\`:target?'<small>Hall of Fame ↗</small>':id?'<small>Ver perfil ↗</small>':''}</\${clickable?'button':'div'}>\`;
}`;s=s.slice(0,start)+renderer+s.slice(end);fs.writeFileSync(f,s);
f='dist/index.html';s=fs.readFileSync(f,'utf8').replaceAll('20261102-general-players','20261102-player-database-final');fs.writeFileSync(f,s);
