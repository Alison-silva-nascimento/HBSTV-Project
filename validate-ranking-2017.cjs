const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const c={window:{},normalizeText:s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()};
for(const f of ['archive-data.js','player-rankings-data.js'])vm.runInNewContext(fs.readFileSync('dist/'+f,'utf8'),c);
const r=c.window.RANKS_PLAYER_RANKINGS[2017];assert.equal(r.length,20);assert.equal(new Set(r.map(e=>e.rank)).size,20);assert.equal(new Set(r.map(e=>e.name)).size,20);
const source=fs.readFileSync('dist/profiles.js','utf8');vm.runInNewContext(source.slice(source.indexOf('function stats('),source.indexOf('function identity(')),c);
const sections=c.window.RANKS_ARCHIVE.pages.filter(p=>/^hall/.test(p.slug)).flatMap(p=>p.sections);
for(const [name,rank] of [['4i20',2],['zenn',7],['amz',8],['OveR',9],['Brizado',14]]){const s=sections.find(s=>s.blocks.some(b=>b.level===4&&b.text.includes('´´'+name+'´´')));assert(s,name);const p={name,full:s.blocks.find(b=>b.level===4).text,text:s.blocks.filter(b=>b.type==='text').map(b=>b.text).join('\n')};const stats=c.stats(p);assert.equal(stats.rankings.find(r=>r.year===2017).rank,rank);assert.equal(stats.rankings.filter(r=>r.year===2017).length,1);if(name==='zenn')assert.equal(stats.best,7);if(name==='Brizado')assert.equal(stats.best,14);}
console.log('2017 ranking: 20 unique positions, five Hall of Fame matches and annual bests checked.');
