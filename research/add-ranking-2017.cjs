const fs=require('node:fs'),vm=require('node:vm');
const names=['SanSey','4i20','Galaxy','MonsteR','TerroR','PinG','zenn','Amz','OveR','Astr0','Chave','Crash','Biondi','Brizado','syoX','Dede','Jhow','TacO','JrG','NathaN'];
const teams=['P4','P4','SW','REAL','SW','REAL','P4','SW','P4','SW','SW','SW','SW','SW','P4','AE','REAL','SW','P4','P4'];
const entries=names.map((name,i)=>({rank:i+1,name,country:'BR',team:teams[i]}));
fs.writeFileSync('dist/player-rankings-data.js','window.RANKS_PLAYER_RANKINGS = '+JSON.stringify({2017:entries},null,2)+';\n');
const c={window:{}};vm.runInNewContext(fs.readFileSync('dist/archive-data.js','utf8'),c);const page=c.window.RANKS_ARCHIVE.pages.find(p=>p.slug==='top-20-players');
const section={title:'TOP 20 PLAYERS 2017',blocks:[{type:'heading',level:2,text:'TOP 20 PLAYERS 2017'},{type:'player-ranking',year:2017,entries,source:'Ranking fornecido pelo proprietário do acervo.'}]};
if(!page.sections.some(s=>s.title==='TOP 20 PLAYERS 2017')){page.sections.push(section);page.blocks.push(...section.blocks);}
fs.writeFileSync('dist/archive-data.js','window.RANKS_ARCHIVE = '+JSON.stringify(c.window.RANKS_ARCHIVE,null,2)+';\n');
