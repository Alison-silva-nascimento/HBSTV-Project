const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');const context={window:{}};
for(const file of ['archive-data.js','awards-data.js','player-awards.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'dist',file),'utf8'),context);
const sections=context.window.RANKS_ARCHIVE.pages.filter(p=>/^hall/.test(p.slug)).flatMap(p=>p.sections);
function player(name){const section=sections.find(s=>s.blocks.some(b=>b.level===4&&b.text.toLowerCase().includes(name.toLowerCase())));return {name,text:section.blocks.filter(b=>b.type==='text').map(b=>b.text).join('\n')};}
const awards=(name,category)=>context.window.getPlayerAwards(player(name)).find(a=>a.category===category);
assert.equal(JSON.stringify(awards('ShelzZ','Melhor IGL').years),'[2020,2021]');assert.equal(awards('ShelzZ','Melhor IGL').count,2);
assert.equal(JSON.stringify(awards('Oskar','Melhor IGL').years),'[2023,2024]');assert.equal(awards('Tamashi','Melhor jogador estrangeiro').count,2);
assert.equal(JSON.stringify(awards('tabsenn','Melhor rifler').years),'[2023,2024,2025]');assert.equal(awards('c0njure','Melhor AWP').count,4);
assert.equal(context.window.getPlayerAwards({name:'UnknownPlayer',text:''}).length,0);
console.log('Player awards: years, nickname matching, source deduplication and missing-data checks passed.');
