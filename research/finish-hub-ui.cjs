const fs=require('node:fs'),edit=(p,fn)=>fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));
edit('dist/index.html',s=>s.replace('href="#jogadores">Jogadores','href="#jogadores-todos">Jogadores'));
edit('dist/archive.js',s=>s.replace('>Site</a>','>Coleções</a>'));
edit('dist/player-rankings.js',s=>s.replaceAll('escapeHtml(entry.name)','escapeHtml(window.HBSTV?.name(entry.name)||entry.name)'));
edit('dist/team-years.js',s=>s.replace('esc(displayNick)','esc(window.HBSTV?.name(displayNick)||displayNick)'));
edit('dist/statistics.js',s=>s.replace("${m==='events'&&leader.bounded?'≥ ':''}${leader.values[m]}","${m==='top20'&&scopeOrg?'—':leader.values[m]===0?'—':(m==='events'&&leader.bounded?'≥ ':'')+leader.values[m]}").replace('${esc(leader.name)}</strong>','${m===\'top20\'&&scopeOrg?\'Retire o filtro de organizadora\':leader.values[m]===0?\'Sem registro neste filtro\':esc(leader.name)}</strong>'));
edit('research/build-database.cjs',s=>s.replace('e.title=clean(major.title)','e.title=clean(major.title).replace(/\\s*·\\s*/,\' | \')'));
