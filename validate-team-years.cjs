const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};for(const file of ['archive-data.js','team-years-data.js'])vm.runInNewContext(fs.readFileSync('dist/'+file,'utf8'),ctx);
const d=ctx.window.RANKS_TEAM_YEARS;
assert.equal(d.rankings.length,8);assert.equal(d.champions.length,7);
const sources=new Set();
for(const r of d.rankings){assert.deepEqual(Array.from(r.teams,t=>t.rank),[1,2,3,4,5]);sources.add(r.sourceImage);for(const t of r.teams){assert(t.name);assert.equal(t.countries.length,t.roster.length);const c=t.logoCrop;assert(c.x>=0&&c.y>=0&&c.w>0&&c.h>0&&c.x+c.w<=1&&c.y+c.h<=1);}}
for(const c of d.champions){assert(c.titles.length>0&&c.roster.length>0);assert.equal(c.countries.length,c.roster.length);sources.add(c.sourceImage);assert(d.rankings.some(r=>r.year===c.year));}
const originals=ctx.window.RANKS_ARCHIVE.pages.find(p=>p.slug==='top-1-teams-of-years').blocks.filter(b=>b.type==='image');assert.equal(sources.size,originals.length);for(const b of originals){assert(sources.has(b.src));assert(fs.existsSync('dist/'+b.src));}
assert.equal(d.champions.find(t=>t.year===2023).name,'Chaos Sports Club');assert.equal(d.champions.find(t=>t.year===2019).name,'TSY');
console.log('Team years: all 15 source images represented, 40 ranks, 7 champions, crops, rosters and years checked.');
